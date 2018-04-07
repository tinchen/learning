<template>
  <div class="star">
    <span v-for="item in itemClasses" :key="item.idx" 
          :class="item" class="star-item"></span>
  </div>
</template>

<script>
const LENGTH = 5;

export default {
    name: 'Star',
    props: {
        score: { // 可接收外部傳入的參數
            type: Number
        }
    },
    computed: {
        itemClasses() {
            let result = [];
            // 4.7 => 4.5, 3.1 => 3.0
            let score = Math.floor(this.score * 2) / 2;
            let integer = Math.floor(score);
            for (let i=0; i<integer; i++) {
                result.push('on');
            }
            if (score != integer) {
                result.push('half');
            }
            while (result.length < LENGTH) {
                result.push('off');
            }
            return result;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.star {
    font-size: 0px;
}
.star .star-item {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 3px;
    background-repeat:  no-repeat;
    background-size: 10px 10px;
}

.star .star-item :last-child {
    margin-right: 0px;
}

.star .on {
    background-image: url(star24_on@2x.png);
}

.star .half {
    background-image: url(star24_half@2x.png);
}

.star .off {
    background-image: url(star24_off@2x.png);
}
</style>
