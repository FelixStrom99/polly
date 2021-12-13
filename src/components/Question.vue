<template>
<p>{{question.q}}</p>

<button v-for="a in question.a" v-on:click="answer(a,question.q)" v-bind:key="a">
  {{ a }}
</button>
</template>
<script>
export default {
  name: "Question",
  props: {
    question: Object
  },
  methods: {
    answer: function (answer,title) {
      this.$emit("answer", answer,title);
    } 
  }
}
</script>