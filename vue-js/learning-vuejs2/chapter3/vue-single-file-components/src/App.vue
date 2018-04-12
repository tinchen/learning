<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <add-item-component :items="items"></add-item-component>
    <items-component :items="items"></items-component>
    <div class="footer">
      <hr/>
      <change-title-component :value.sync="title"></change-title-component>
    </div>
  </div>
</template>

<script>
import AddItemComponent from './components/AddItemComponent'
import ItemsComponent from './components/ItemsComponent'
import ChangeTitleComponent from './components/ChangeTitleComponent'

export default {
  components: {
    AddItemComponent,
    ItemsComponent,
    ChangeTitleComponent
  },
  data () {
    return {
      items: [{ text: 'Bananas', checked: true }, { text: 'Apples', checked: false }],
      title: 'My Shopping List'
    }
  }
}
</script>

<style scoped>
.container {
  width: 40%;
  margin: 20px auto 0px auto;
}
.footer {
  font-size: 0.7em;
  margin-top: 20vh;
}
</style>