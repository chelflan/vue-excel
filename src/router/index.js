import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ExcelCom from '@/components/ExcelComponent'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/excel',
      name: 'ExcelCom',
      component: ExcelCom
    }
  ]
})
