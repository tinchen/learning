var data = {
  items: [{
      text: '香蕉',
      checked: true
    },
    {
      text: '蘋果',
      checked: false
    }
  ],
  title: '我的購物清單',
  newItem: ''
};

new Vue({
  el: '#app',
  data: data,
  methods: {
    addItem: function () {
      let text = this.newItem.trim();
      if (text) {
        this.items.push({
          text: text,
          checked: false
        });
        this.newItem = '';
      }
    }
  }
});