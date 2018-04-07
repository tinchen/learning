<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <li class="menu-item">
          <p class="text">
            <img class="icon" :src="container.tag_icon" v-if="container.tag_icon" />
            {{ container.tag_name }}
          </p>
        </li>
        <li class="menu-item" v-for="item in goods" :key="item.idx">
          <p class="text">
            <img class="icon" :src="item.icon" v-if="item.icon" />
            {{ item.name }}
          </p>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsScroll">
      <ul>
        <li class="container-list">
          <div v-for="item in container.operation_source_list" :key="item.idx">
            <img :src="item.pic_url" alt="">
          </div>
        </li>

        <li class="food-list" v-for="item in goods" :key="item.idx">
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
      goods: []
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
      new BScroll(this.$refs.menuScroll);
      new BScroll(this.$refs.foodsScroll);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import url('../../commons/styles/icon.css');
    @import url('Goods.css');
</style>
