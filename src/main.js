// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import AxiosConfig from './config/axiosConfig'

// 全局引入vue-codemirror
import { codemirror } from 'vue-codemirror'
import 'vue-codemirror/node_modules/codemirror/lib/codemirror.css'
// theme
import 'vue-codemirror/node_modules/codemirror/theme/idea.css'

// addon
import 'vue-codemirror/node_modules/codemirror/addon/lint/lint.css'
import 'vue-codemirror/node_modules/codemirror/addon/fold/foldgutter.css'

import 'vue-codemirror/node_modules/codemirror/addon/hint/show-hint.css'
import 'vue-codemirror/node_modules/codemirror/addon/hint/show-hint.js'
import 'vue-codemirror/node_modules/codemirror/addon/hint/sql-hint.js'

// lint
import 'vue-codemirror/node_modules/codemirror/addon/lint/lint.js'
import 'vue-codemirror/node_modules/codemirror/addon/lint/json-lint.js'

// mode
import 'vue-codemirror/node_modules/codemirror/mode/xml/xml.js'
import 'vue-codemirror/node_modules/codemirror/mode/javascript/javascript'
import 'vue-codemirror/node_modules/codemirror/mode/htmlmixed/htmlmixed.js'
import 'vue-codemirror/node_modules/codemirror/mode/sql/sql.js'

//括号匹配
import 'vue-codemirror/node_modules/codemirror/addon/edit/matchbrackets.js'



// merge
import 'vue-codemirror/node_modules/codemirror/addon/merge/merge.js'
import 'vue-codemirror/node_modules/codemirror/addon/merge/merge.css'

// fold
import 'vue-codemirror/node_modules/codemirror/addon/fold/foldcode.js'
import 'vue-codemirror/node_modules/codemirror/addon/fold/foldgutter.js'
import 'vue-codemirror/node_modules/codemirror/addon/fold/xml-fold.js'

import 'vue-codemirror/node_modules/codemirror/addon/edit/closebrackets.js'

window.jsonlint = require("vue-codemirror/node_modules/codemirror/addon/lint/json-lint.js");

import { Loading } from 'element-ui';

Vue.use(codemirror)

Vue.prototype.$axios = AxiosConfig.axiosService
Vue.prototype.$loading = Loading
Vue.use(ElementUI);

//路由拦截器
// router.beforeEach((to, from, next) => {
//   if (to.matched.length != 0) {
//     // if (to.meta) {
//     //   if (to.meta.allowBack === false) {
//     //     alert(1)
//     //   }
//     // } else {
//     //   next()
//     // }
//     if (to.path === '/') {
//       console.log(1)
//       next()
//     } else  {
//       alert('no')
//     }
//     console.log(from)
//     console.log(to)
//   } else {
//     next({
//       path: '/',
//     })
//   }
//   console.log(11111111111111111)
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  components: { App },
  template: '<App/>'
})
