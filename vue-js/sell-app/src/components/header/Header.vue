<template>
  <div class="header">
    <!-- {{ poiInfo.name }} -->
    <div class="top-wrapper">
      <div class="back-wrapper">
        <span class="icon-arrow_lift"></span>
      </div>
      <form class="search-wrapper">
        <span class="search-icon"></span>
        <input class="search-bar" type="text" 
          placeholder="搜尋店內商品.." />
      </form>
      <div class="more-wrapper">
        <a class="selling-bt" href="#">併單</a>
        <div class="more-bt">
          <i class="s-radius"></i>
          <i class="s-radius"></i>
          <i class="s-radius"></i>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="icon" :style="content_bg">
        <!-- <img :src="poiInfo.pic_url" /> -->
      </div>
      <div class="name">
        <h3>{{ poiInfo.name }}</h3>
      </div>
      <div class="collect">
        <img src="../../../resource/img/star.png" />
        <span>收藏</span>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <div class="icon">
        <img v-if="poiInfo.discounts2" :src="poiInfo.discounts2[0].icon_url" />
      </div>
      <span v-if="poiInfo.discounts2" class="text">{{ poiInfo.discounts2[0].info }}</span> 
      <div v-if="poiInfo.discounts2" class="detail" @click="toggleBulletinDetail">
        {{ poiInfo.discounts2.length }} 個活動
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bg-wrapper" :style="head_bg">
      <!-- <img :src="poiInfo.head_pic_url" /> -->
    </div>
    <transition name="ts-bulletin-detail">
      <div class="bulletin-detail" v-show="isShowBulletinDetail">
        <div class="detail-wrapper">
          <div class="main-wrapper" :style="detail_bg">
            <div class="icon" :style="content_bg"></div>
            <h3 class="name">{{ poiInfo.name }}</h3>
            <div class="score">
              <sell-star :score="poiInfo.wm_poi_score"></sell-star>
              <span>{{ poiInfo.wm_poi_score }}</span>
            </div>
            <p class="tip">
              {{ poiInfo.min_price_tip }} <i>|</i>
              {{ poiInfo.shipping_fee_tip }} <i>|</i>
              {{ poiInfo.delivery_time_tip }}
            </p>
            <p class="time">
              配送時間：
              {{ poiInfo.shipping_time }}
            </p>
            <div class="discounts" v-if="poiInfo.discounts2">
              <p>
                <img :src="poiInfo.discounts2[0].icon_url" />
                <span>{{ poiInfo.discounts2[0].info }}</span>
              </p>
            </div>
          </div>
          <div class="close-wrapper">
            <span class="icon-close" @click="toggleBulletinDetail"></span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import star from 'components/star/Star';

export default {
    name: 'Header',
    components: {
        'sell-star': star
    },
    data() {
        return {
            isShowBulletinDetail: false
        }
    },
    props: {
        poiInfo: {
            type: Object,
            default: {}
        }
    },
    computed: {
        head_bg() {
            let style = 'background: url(' + this.poiInfo.head_pic_url + ') center -12px/100% 135%;';
            //style += 'background-size: 100% 135%; background-position: center -12px;';
            //console.log(style);
            return style;
        },
        content_bg() {
            let style = 'background: url(' + this.poiInfo.pic_url + ') center/135% 100%;';
            //style += 'background-size: 135% 100%; background-position: center;';
            //console.log(style);
            return style;
        },
        detail_bg() {
            let style = 'background: url(' + this.poiInfo.poi_back_pic_url + ') center/100% 100%;';
            //style += 'background-size: 100% 100%;';
            //console.log(style);
            return style;
        }
    },
    methods: {
        toggleBulletinDetail() {
            this.isShowBulletinDetail = !this.isShowBulletinDetail;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import url('../../commons/styles/icon.css');
    @import url('Header.css');
</style>
