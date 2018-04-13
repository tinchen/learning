(function(window, angular, firebase) {

  'use strict';

  const URL_EXP = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g;

  const URL_SHORTENER = 'https://us-central1-tinchen-275cf.cloudfunctions.net/googl?u=';
  const LOGO = 'https://icons.iconarchive.com/icons/seanau/support-bubble/128/Support-Bubble-1-icon.png';
  const MB = 1000 * 1000;

  Date.ago = function(days) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  String.prototype.format = function() {
    if (arguments.length === 0) return '';
    const args = Array.prototype.slice.call(arguments, 0);
    return this.replace(/\{(\d+)\}/g, function(_, i) {
      return args[i];
    });
  };

  const chatApp = angular.module('chatApp', ['ngCookies', 'ngSanitize']);

  chatApp.service('chatsDb', function() {
    firebase.initializeApp({
      apiKey: "AIzaSyCpqNV0NN56muiqsmDUkbAJAM5jk7pVrm4",
      authDomain: "tinchen-275cf.firebaseapp.com",
      databaseURL: "https://tinchen-275cf.firebaseio.com",
      projectId: "tinchen-275cf",
      storageBucket: "tinchen-275cf.appspot.com",
      messagingSenderId: "710815853785"
    });

    this.init = function(roomId) {
      const path = `chats/${roomId}/`;
      this.ref = firebase.database().ref(path);
      this.storage = firebase.storage().ref(path);
      this.archives = [];
      return this.ref;
    };

    this.add = function(chat) {
      const key = this.ref.push().key;
      this.ref.child(key).set(chat);
      return key;
    };

    this.update = function(key, text) {
      this.ref.child(key).update({
        text: text
      });
    };

    this.addReader = function(key, author) {
      if (!author) return;
      this.ref.child(key).transaction(function(chat) {
        chat.readers = Array.isArray(chat.readers) ? chat.readers : [];
        if (chat.readers.indexOf(author) == -1) {
          chat.readers.push(author);
        }
        return chat;
      });
    };
  });

  chatApp.service('urlshortener', function($http, $sce) {
    this.get = function(url, callback) {
      url = $sce.trustAsResourceUrl(URL_SHORTENER + url);
      $http.jsonp(url).then(function(res) {
        callback(res.data.id);
      });
    };
  });

  chatApp.filter('moment', function() {
    return function(utime) {
      return moment(new Date(utime)).fromNow();
    };
  });

  chatApp.directive('chatText', ['urlshortener', function(urlshortener) {
    return {
      restrict: 'A',
      scope: {
        text: '=ngModel'
      },
      link: function($scope, $this, $attrs) {
        let html = $scope.text.replace(URL_EXP, function(url, i) {
          if (url.includes('firebasestorage')) return url;
          return `<a target="_blank" href="${url}">${url}</a>`;
        });
        $this.css('visibility', 'hidden').html(html.replace(/\n/g, '<br/>'));
        angular.forEach($this.find('a'), function(a) {
          let $a = angular.element(a);
          let href = $a.attr('href');
          if (!href.includes('firebasestorage') && href.length > 30) {
            urlshortener.get(href, function(url) {
              $a.text(url).attr('href', url);
            });
          }
        });
        $this.css('visibility', 'visible');
      }
    };
  }]);

  chatApp.directive('message', function() { // 用來自動下拉捲動對話
    let timer = null;
    let speed = 35;
    return {
      restrict: 'C',
      link: function($scope, $this, $attrs) {
        let $messages = $this.parent();
        if ($attrs.archived) {
            return $messages.prop('scrollTop', 10);
        }
        if (!timer) {
          timer = setInterval(function() {
            let top = $messages.prop('scrollTop');
            let height = $messages.prop('scrollHeight') - $messages.prop('clientHeight');
            if (top < height) {
              $messages.prop('scrollTop', top + speed);
            } else {
              clearInterval(timer);
              timer = null;
              speed = 35;
            }
          }, 200);
        }
        else {
            speed = speed + 5;
        }
      }
    }
  });

  chatApp.directive('messages', ['$interval', 'chatsDb', function($interval, chatsDb) {
    return {
      restrict: 'C',
      link: function($scope, $this, attrs) { // 用來讓畫面上的 xx 分鐘前 會動態變動
        let timer = $interval(function() {
          $scope.chats.forEach(function(chat) {
            chat.utime++;
          });
          if ($this.prop('scrollTop') == 0 && chatsDb.archives.length) {
            $scope.chats.add(chatsDb.archives.pop());
          }
        }, 1000);
        $this.on('$destroy', function() {
          $interval.cancel(timer);
        });
      }
    }
  }]);

  chatApp.directive('ctrlEnter', [function() {
    return {
      restrict: 'A',
      scope: {
        keyEnter: '&ctrlEnter'
      },
      link: function($scope, $this) {
        setInterval(function() {
          $this.css('height', 'auto').css('padding', 0);
          let height = $this.prop('scrollHeight');
          $this.css('height', height + 'px');
          $this.parent().css('height', Math.max(50, height + 15) + 'px');
        }, 50);
        $this.bind('keydown keypress', function(event) {
          if (event.ctrlKey && event.which === 13) {
            event.preventDefault();
            $scope.$apply($scope.keyEnter);
          }
        });
      }
    };
  }]);

  chatApp.controller('chatCtrl', function($scope, $cookies, $timeout, chatsDb) {
    $scope.chats = [];
    $scope.placeholder = '';

    $scope.chats.findIdxByKey = function(key) {
      let idx = $scope.chats.findIndex(function(chat) {
        return chat.key == key;
      });
      return idx;
    };

    $scope.chats.add = function(chat) {
      if (chat.readers && chat.readers.length) {
        chat.readed = `${chat.readers.length} 已讀`;
      }
      chat.isOwner = ($scope.author == chat.author);
      chat.appeared = true;

      $timeout(function() {
          if (chat.archived) {
            $scope.chats.unshift(chat);
          }
          else {
            $scope.chats.push(chat);
          }
      }, 10);

      if (!chat.archived && !chat.isOwner) { // 等一下，若非自己的訊息，就把自已加入已讀人列表中
        $timeout(chatsDb.addReader.bind(chatsDb, chat.key, $scope.author), 1250);
        let text = chat.text.length > 25 ? chat.text.substring(0, 30) + '...' : chat.text;
        $timeout(notify.bind($scope, '{0}：{1}'.format(chat.author, text)), 100);
      }
    };

    $scope.sendMessage = function(text) {
      text = text || $scope.text.trim();
      if (text === '') {
        return;
      }

      let chat = {
        readers: [],
        utime: new Date().getTime()
      };

      if (!$scope.author) {
        $scope.author = text;
        $cookies.put('author', $scope.author, { 'expires': Date.ago(365) });
        $scope.placeholder = '聊聊吧..';
        chat.author = '管理者';
        chat.text = '歡迎 {0} 加入 •*¨*•.¸¸♪'.format($scope.author);
      } else {
        chat.author = $scope.author;
        chat.text = text;
      }

      $scope.text = '';
      $scope.$input.focus();

      return chatsDb.add(chat);
    };

    $scope.removeMessage = function(key) {
      chatsDb.ref.child(key).remove();
    };

    $scope.sendFile = function(e) {
      if (!e) {
        $scope.$file.click();
      } else {
        let file = e.target.files[0];
        let filename = file.name;
        let metadata = {
          contentType: file.type
        };

        let chatKey = $scope.sendMessage('正在上傳 {0}'.format(filename));

        let uploadName = new Date().getTime() + '.' + filename.split('.').pop();
        let uploadTask = chatsDb.storage.child(uploadName).put(file, metadata);
        uploadTask.on('state_changed', function(file) {
          let progress = Math.ceil(file.bytesTransferred / file.totalBytes * 100);
          chatsDb.update(chatKey, '正在上傳 {0}（{1}%）'.format(filename, progress));
        }, function(error) {
          chatsDb.update(chatKey, '{0} 上傳失敗'.format(filename));
          console.error('{0} 上傳失敗 :'.format(filename), error);
        }, function() {
          let file = uploadTask.snapshot;
          let size = Math.ceil(file.totalBytes / MB);
          let download = '下載 <a target="_blank" href="{0}">{1}</a>（{2} MB）'.format(file.downloadURL, filename, size);
          chatsDb.update(chatKey, download);
        });
      }
    };

    $scope.maximize = function() {
      screenfull.request(document.getElementById('chat_window'));
    };

    $scope.close = function() {
      if (confirm('確定要關閉此聊天室？')) {
        chatsDb.ref.remove();
        $scope.chats.length = 0;
        $cookies.remove('author');
        openChatRoom(null, null);
      }
    };

    const openChatRoom = function(roomId, author) {
      $scope.$input = document.getElementsByClassName('message_input')[0];
      $scope.$input.focus();
      $scope.$file = document.getElementsByClassName('upload_file')[0];
      $scope.$file.addEventListener('change', $scope.sendFile, false);

      if (!roomId) {
        roomId = 'room' + new Date().getTime();
      }
      $cookies.put('roomId', roomId, { 'expires': Date.ago(365) });
      location.hash = roomId;

      $scope.author = author;
      $scope.placeholder = !$scope.author ? '先給一個暱稱..' : '聊聊吧..';

      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      chatsDb.init(roomId).limitToLast(50).on('child_added', function(data) {
        let chat = data.val();
        chat.key = data.key;
        if (chat.utime > Date.ago(-2).getTime()) {
          $scope.chats.add(chat);
        }
        else {
          chat.archived = true;
          chatsDb.archives.push(chat);
        }
      });

      chatsDb.ref.on('child_changed', function(data) {
        let chat = data.val();
        let idx = $scope.chats.findIdxByKey(data.key);
        if (chat.readers && chat.readers.length) {
          $timeout(function() {
            $scope.chats[idx].readed = '{0} 已讀'.format(chat.readers.length);
          }, 10);
        }
        if (idx != -1 && chat) {
          $scope.chats[idx].text = chat.text;
        }
      });

      chatsDb.ref.on('child_removed', function(data) {
        let idx = $scope.chats.findIdxByKey(data.key);
        $timeout(function() {
          $scope.chats.splice(idx, 1);
        }, 10);
      });
    };

    const notify = function(text) {
      if (Notification.permission !== 'granted') {
        return;
      }

      notify.text = text;
      if (!notify.timer) {
        notify.timer = setTimeout(function() {
          let notification = new Notification('聊聊', {
            icon: LOGO,
            body: notify.text,
          });
          notification.onclick = function() {
            notification.close();
          };
          setTimeout(notification.close.bind(notification), 6000);
          notify.timer = null;
        }, 500);
      }
    };

    let roomId = location.hash.replace('#', '') || $cookies.get('roomId');
    let author = $cookies.get('author');

    $timeout(openChatRoom.bind($scope, roomId, author), 10);
  });

})(window, angular, firebase);
