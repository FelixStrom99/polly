<template>
<p>{{question.q}}</p>

<button v-for="(a,i) in question.a" v-on:click="answer(a[i])" v-bind:key="a[i]">
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
    answer: function (answer) {
      this.$emit("answer", answer);
    } 
  }
}
</script>