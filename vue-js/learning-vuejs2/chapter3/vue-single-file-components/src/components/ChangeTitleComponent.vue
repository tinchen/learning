<template>
  <div>
    <em>Change the title of your shopping list here</em>
    <input v-bind:value="value" v-on:input="onInput"/>
  </div>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    onInput: function (event) {
      console.log(event.target.value);
      this.$emit('update:value', event.target.value);
      this.$emit('input', event.target.value)
    }
  }    
}
</script>

<style scoped>
</style>
