import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import moment from 'moment'
import googleConfig from './google-maps-config'
import * as VueGoogleMaps from 'vue2-google-maps'
import './css/style.scss'
import './assets/svg/symbols.svg'

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: googleConfig
});

let servicePort,
  serviceUrl = window.location.protocol + '//' + window.location.host;
if (serviceUrl.lastIndexOf(':') > 6) { // strip port # off of serviceUrl
  serviceUrl = serviceUrl.substr(0, serviceUrl.lastIndexOf(':'));
}
// determine port based on ssl
if (window.location.protocol.indexOf('https') != -1) {
  // IMPORTANT - This requires the use of server-ssl.js. server.js doesn't listen for port 3031
  servicePort = ':3031/'
} else {
  servicePort = ':3030/';
}
console.log('main.js serviceUrl [' + serviceUrl + servicePort + ']');

Vue.prototype.$axios = axios.create({
  baseURL: serviceUrl + servicePort
});

Vue.prototype.$moment = moment;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
