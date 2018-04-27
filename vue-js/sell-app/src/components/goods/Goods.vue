<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <li class="menu-item" :class="{'current': currentIndex == 0}" @click="menuSelected(0)">
          <p class="text">
            <img class="icon" :src="container.tag_icon" v-if="container.tag_icon" />
            {{ container.tag_name }}
          </p>
        </li>
        <li class="menu-item" v-for="(item, idx) in goods" :key="item.idx"
            :class="{'current': currentIndex == (idx+1)}" @click="menuSelected(idx+1)">
          <p class="text">
            <img class="icon" :src="item.icon" v-if="item.icon" />
            {{ item.name }}
          </p>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsScroll">
      <ul>
        <li class="container-list food-list-hook">
          <div v-for="item in container.operation_source_list" :key="item.idx">
            <img :src="item.pic_url" alt="">
          </div>
        </li>

        <li class="food-list food-list-hook" v-for="item in goods" :key="item.idx">
          <h3 class="title">{{ item.name }}</h3>
          <ul>
            <li class="food-item" v-for="food in item.spus" :key="food.idx">
              <div class="icon" :style="food_bg(food.picture)"></div>
              <div class="content">
                <h3 class="name">{{ food.name }}</h3>
                <p class="desc" v-if="food.description">{{ food.description }}</p>
                <p class="extra">
                  <span class="saled">{{ food.month_saled_content }}</span>
                  <span class="praise">{{ food.praise_content }}</span>
                </p>
                <img :src="food.product_label_picture" class="product" />
                <p class="price">
                  <span class="text">$ {{ food.min_price }} </span>
                  <span class="unit">/ {{ food.unit }}</span>
                </p>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

export default {
  name: 'Goods',
  data() {
    return {
      container: {},
      goods: [],
      listHeight: [],
      scrollY: 0,
      menuScroll: null,
      foodsScroll: null
    }
  },
  created() {
    let that = this;
    this.$axios.get('/api/goods').then(function (resp) {
      let ds = resp.data;
      if (ds.code === 0) {
        that.container = ds.data['container_operation_source'];
        that.goods = ds.data['food_spu_tags'];
        //console.log(that.container);
        //console.log(that.goods);
        that.$nextTick(() => {
          that.initScroll();
          that.caculateHeight();
        });
      }
    }).catch(function (err) {
      console.log(err);
    });
  },
  methods: {
    food_bg(picUrl) {
      let style = 'background: url(' + picUrl + ') no-repeat center/100% 135%;';
      //style += 'background-size: 100% 135%;';
      //console.log(style);
      return style;
    },
    initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuScroll, { click: true});
      this.foodsScroll = new BScroll(this.$refs.foodsScroll, { probeType: 3});

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    caculateHeight() {
      let foodList = this.$refs.foodsScroll.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i=0; i<foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    menuSelected(idx) {
      //console.log(idx);
      let foodList = this.$refs.foodsScroll.getElementsByClassName('food-list-hook');
      let el = foodList[idx];
      this.foodsScroll.scrollToElement(el, 250);
    }
  },
  computed: {
    currentIndex() {
      for (let i=0; i<this.listHeight.length; i++) {
        let h1 = this.listHeight[i];
        let h2 = this.listHeight[i+1];
        if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {
          //console.log(i);
          return i;
        }
      }
      return 0;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import url('../../commons/styles/icon.css');
    @import url('Goods.css');
</style>
