
# 聊聊（Chat Room）
 
> 這是一個使用 AngularJs 1.x 搭配 Firebase 後端存儲資料的 App

> _[AngularJs - angularjs.org](https://angularjs.org/)_
_[Firebase Docs](https://firebase.google.com/docs/)_

## 使用 Firebase CLI 建構基礎開發環境

>  _[Firebase Console](https://console.firebase.google.com/)_
> _[Firebase CLI Reference](https://firebase.google.com/docs/cli/)_

首先要先在 **Firebase Console** 上用 Google 帳號登入，然後申請所需的服務並取得 API_KEY 等資料

本機安裝 Node.js 後，再安裝 **Firebase CLI**，並登入 Google 帳號：
```javascript
npm install -g firebase-tools
firebase login //輸入 email 與密碼
```

使用下列指令建構專案目錄：
```javascript
firebase init
```

## 使用 Firebase 進行重要設定

firebase.json 是最重要的設定檔案，說明如下：
> _[Firebase Realtime Database Rules](https://firebase.google.com/docs/database/security/)_

```javascript
{
  "database": { // 資料庫的權限設定檔案
    "rules": "database.rules.json"
  },
  "hosting": { // 設定 web 根目錄與首頁檔案
    "public": "public",
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  }
}
```

package.json 中主要會加入外部依賴的 API 函式庫：
```javascript
{
  "name": "PROJECT_NAME",
  "version": "3.14",
  "description": "PROJECT_DESC",
  //"main": "server.js",
  //"repository": "",
  "author": "Tinchen <tin.chen@gmail.com>",
  "dependencies": {
    "googleapis": "*"
  }
}
```

## Firebase CLI 常用指定

> _[Firebase CLI Reference](https://firebase.google.com/docs/cli/)_

*  npm install -g firebase-tools ：CLI 版本更新
*  firebase list ：列出已經申請的專案
* firebase serve ：啟動本機的 web hosing
* firebase deploy ：將本機的檔案發佈到 firebase 主機上
* firebase deploy --only hosting ：只發佈 hosting 部分到 firebase 主機上
* firebase deploy --only functions:function1 ：只發佈 functions:function1 的部分到 firebase 主機上