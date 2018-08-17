# notes-at Sample App

> A note taking app that retrieves and stores location data for each note. I created this app 
as a full-stack project to learn to work with a new toolchain  (MEVN). It is based off of the Vue.JS 
[webpack-simple](https://github.com/vuejs-templates/webpack-simple) template. For detailed 
explanation on vue-loader, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Dependencies

**Server-side**
* [Node.js](https://nodejs.org)
* [Express](https://github.com/expressjs/express)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://github.com/Automattic/mongoose)

**Client-side**
* [VueJS 2.x](https://github.com/vuejs/vue)
* [Vue-router](https://github.com/vuejs/vue-router)
* [axios](https://github.com/mzabriskie/axios)
* [vue-googlemaps](https://github.com/Akryum/vue-googlemaps)
* [Moment.js](https://momentjs.com/)
* [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) (for Maps JavaScript API &amp; Places API for Web)

## Configuration

You will need to set your Google API Key in [./src/main.js](src/main.js).
```js
Vue.use(VueGoogleMaps, {
  load: {
    key: 'your-google-api-key',
    libraries: 'places'
  }
});
```
You may also need to configure [./server.js](server.js) if your instance of MongoDB is running on a port
other than the default port `27017` or your local server is something other than `http://localhost`.
```js
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/' + dbName, {'useNewUrlParser': true});//
```

## Build Setup

``` bash
# install dependencies
npm install

# start express RESTful service layer at localhost:3030
npm run start

# build project (drop -dev for production build)
npm run build-dev

# serve with hot reload at localhost:8080
npm run dev
```

## Resources

* [RESTfulAPITutorial](https://github.com/generalgmt/RESTfulAPITutorial) Provided the underpinnings of my API services
* [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) Documentation on navigator.geolocation from Mozilla.
* [Google Maps API Reference](https://developers.google.com/maps/documentation/javascript/reference/map)
* [Google Places Service API Reference](https://developers.google.com/maps/documentation/javascript/reference/places-service)

## To-Do Roadmap
* Pull reusable styles out of .vue files. 
* Improve mobile UX
* Incorporate [Vuex](https://vuex.vuejs.org/)
* Incorporate unit and e2e testing
* Put it up on [Firebase](https://firebase.google.com/) behind authentications and with user accounts
* Implement as Progressive Web App

## Author
Brock Henderson [@brocktopia](https://github.com/brocktopia/) ||
[brocktopia.com](https://brocktopia.com)