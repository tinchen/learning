<template>
  <div id="app">
    <sell-header :poiInfo="poiInfo"></sell-header>

    <sell-nav></sell-nav>

    <router-view></router-view>
  </div>
</template>

<script>
import header from 'components/header/Header'
import nav from 'components/nav/Nav'

export default {
  name: 'App',
  components: {
    'sell-header': header,
    'sell-nav': nav
  },
  data() {
    return {
      poiInfo: {}
    }
  },
  created() {
    let that = this;

    this.$axios.get('/api/goods').then(function (resp) {
      let ds = resp.data;
      console.log(ds);
      if (ds.code === 0) {
        that.poiInfo = ds.data.poi_info;
        console.log(that.poiInfo);
      }
    }).catch(function (err) {
      console.log(err);
    });
  }
}
</script>

<style>

</style>
