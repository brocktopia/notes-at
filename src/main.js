import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import moment from 'moment'
import * as VueGoogleMaps from 'vue2-google-maps'
import './css/style.scss'
import './assets/svg/symbols.svg'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'your-google-api-key',
    libraries: 'places'
  }
});

let baseUrl = window.location.protocol + '//' + window.location.host;
if (baseUrl.lastIndexOf(':') > 6) { // strip port # off of baseUrl
  baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf(':'));
}
//console.log('main.js baseUrl ['+baseUrl+']');

Vue.prototype.$axios = axios.create({
  baseURL: baseUrl + ':3030'
  // baseURL: baseUrl + '/apiservices/'
  /*
     For local development under Apache I configured a proxypass to point to /apiservices/
     <VirtualHost *:80>
       SSLProxyEngine on
       ServerName localhost
       ProxyPass /apiservices http://localhost:3030
       ...
  */
});

Vue.prototype.$moment = moment;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
