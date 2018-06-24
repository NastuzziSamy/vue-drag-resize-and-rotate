<template>
<div>
  <vue-drr :w='200' :h='200' cancel='.block-text' :active="active" :rotable="true" :desactivation="desac" style="background-color: green">
      <div class="block-text" contenteditable="true" @keydown="handleDown" @click="setActive">Editable zone, not draggable</div>
  </vue-drr>
  <vue-drr :w='200' :h='200' :rotable="true" style="left: 250px; background-color: red">
      Fully draggable<br />
      Text not editable or selectable
  </vue-drr>
</div>
</template>
<style>
    .block-text {
        word-wrap: break-word;
        width: 100%;
        height: 100%;
    }

    [contenteditable]:focus {
    outline: 0px solid transparent;
}

</style>
<script>
import VueDRR from '../components/vue-drag-resize-and-rotate.vue'

export default {
  name: 'app',
  data: function () {
      return {
          active: false
      }
  },
  components: {
    'vue-drr': VueDRR,
  },
  methods: {
    handleDown: function (event) {
      console.log(event)
    },
    setActive: function (event) {
        console.log(event)

        this.active = true;
    },
    desac: function () {
        console.log('a')
        this.active = false;
    }
  }
}
</script>
