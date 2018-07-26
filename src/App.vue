<template>
  <div id="app">
    <!-- <Dise></Dise> -->
    <tn></tn>
    <!-- <sjldd :citys = 'city' :sheng="sheng" @change="change"></sjldd> -->
    <!-- <router-view/> -->
  </div>
</template>

<script>
  import Dise from "./components/displayTable"
  import tn from "./components/tableNew"

export default {
  name: 'App',
  components:{
    Dise,
    tn
  },
  data(){
    return{
      city:[
        {
          id:1,
          name:'test'
        },
          {
          id:2,
          name:'test'
        },
          {
          id:3,
          name:'test'
        },
      ],
      sheng:[
          {
          id:1,
          name:'test'
        },
          {
          id:2,
          name:'test'
        },
          {
          id:4,
          name:'test'
        },
      ]
    }
  },
  methods:{
    change(data){
          console.log("change");
      console.debug(data);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
