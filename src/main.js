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
  // baseURL: serviceUrl + '/apiservices/'
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
