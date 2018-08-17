<template>
  <div>

    <header>
      <h2>{{mode === 'edit' ? note.name : 'New Note'}}</h2>
      <svg class="icon action-icon" @click="closeNote()"><use xlink:href="./dist/symbols.svg#close-note"></use></svg>
      <svg class="icon action-icon" v-on:click="saveNote()"><use xlink:href="./dist/symbols.svg#save"></use></svg>
    </header>

    <div class="content">

      <label for="noteName">Name</label>
      <input type="text" id="noteName" v-model="note.name" maxlength="40" placeholder="Name for your note" tabindex="1">
      <span class="input-info"><span class="char-count">{{note.name.length}}</span> (40 character limit)</span>

      <div class="date">{{$moment(note.Created_date).format('LLLL')}}</div>

      <div class="geocoords">
        <label for="geocords">Location:</label>
        <span id="geocords" class="link">{{note.geocode.lat +', '+note.geocode.lng}}</span>
        <svg class="icon-small action-icon" v-on:click="updateCoordinates()"><use xlink:href="./dist/symbols.svg#my-location"></use></svg>
      </div>

      <div class="place">
        <label for="placeName" v-if="!(note.place && note.place.icon)">
          <svg class="icon-small"><use xlink:href="./dist/symbols.svg#location"></use></svg>
        </label>
        <label for="placeName" v-if="note.place && note.place.icon">
          <img :src="note.place.icon" width="24" height="24" />
        </label>
        <span :class="note.place && note.place._id ? 'has-place' : 'no-place'" id="placeName">{{note.place && note.place._id ? note.place.name : 'Click the button to add a place'}}</span>
        <span style="float:right;">
          <button class="small" v-if="note.place && note.place._id" @click="clearPlace()" style="margin-right: 10px;">Remove Place</button>
          <button class="small" @click="findPlace()" tabindex="2">Lookup Places</button>
        </span>
      </div>

      <gmap-map
        class="content"
        ref="NoteMap"
        :center="{'lat':geoLat,'lng':geoLon}"
        :zoom="15"
        style="width:100%;  height: 150px;"
      >
        <gmap-marker
          ref="myMarker"
          :draggable="true"
          v-on:dragend="mapMarkerMoved"
          :position="{'lat':note.geocode.lat, 'lng':note.geocode.lng}"></gmap-marker>
      </gmap-map>

      <textarea v-model="note.note" placeholder="Your note" rows="32" tabindex="3"></textarea>

    </div>

    <div class="navigation">
      <a @click="closeNote()">Cancel</a>
      <a class="action-link" @click="saveNote()">Save</a>
    </div>

    <places-dialog
      v-if="showPlacesDialog"
      :places="places"
      :showMore="showMoreButton"
      v-on:select="placeSelected"
      v-on:close="placesClose"
      v-on:place="placeInputUpdated"
      v-on:more="moreSelected"
    ></places-dialog>

  </div>
</template>

<script>
  import PlacesDialog from './PlacesDialog'
  import {GmapMap} from 'vue2-google-maps'

  let vm;
  export default {

    components: {
      PlacesDialog
    },

    props: {
      note:Object,
      mode:String
    },

    computed: {
      location: function() {
        return { lat: vm.note.geocode.lat, lng: vm.note.geocode.lng }
      },
      geoLat: function() {
        if (!this.note) return 0;
        return this.note.geocode.lat || 0;
      },
      geoLon: function() {
        if (!this.note) return 0;
        return this.note.geocode.lng || 0;
      }
    },

    data: function() {
      return {
        google:null,
        places:[],
        placesService: null,
        showPlacesDialog: false,
        showMoreButton: false,
        pagination: null
      }
    },

    mounted: function() {
      //console.log('NoteEditor.mounted() fetch geolocation data and google reference');
      vm = this;
      // get location if this is a new note
      if (vm.mode === 'new') {
        vm.updateCoordinates();
      }
      // get google reference
      vm.$gmapApiPromiseLazy().then((google) => {
        vm.google = google;
      });
      // get places service
      vm.$refs.NoteMap.$mapPromise.then((map) => {
        vm.placesService = new vm.google.maps.places.PlacesService(map);
      });
    },

    methods:{
      updateCoordinates: function() {
        //console.log('NoteEditor.updateCoordinates()');
        navigator.geolocation.getCurrentPosition(
          function(position) {
            let latlonObj = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            vm.$emit('latlon', latlonObj);
          },
          function(err) {
            console.warn(`updateCoordinates() ERROR(${err.code}): ${err.message}`);
          },
          {
            enableHighAccuracy: true
          }
        );
      },
      saveNote: function() {
        //console.log('NoteEditor.saveNote()');
        vm.$emit('save');
      },
      closeNote: function() {
        //console.log('NoteEditor.closeNote()');
        if (vm.mode === 'edit') {
          vm.$emit('cancel');
        } else {
          vm.$emit('close');
        }
      },
      findPlace: function(placeName) {
        //console.log('NoteEditor.findPlace()');
        let options = {
          location:{
            lat:vm.geoLat,
            lng:vm.geoLon
          },
          radius:1000
        };
        if (placeName) {
          options.keyword = placeName;
        }
        vm.placesService.nearbySearch(options, function (res, status, pagination) {
          if (status !== 'OK') return;
          vm.places ? vm.places = vm.places.concat(res) : vm.places = res;
          vm.showPlacesDialog = true;
          if (pagination.hasNextPage) {
            vm.showMoreButton = true;
            vm.pagination = pagination;
          } else {
            vm.showMoreButton = false;
            vm.pagination = null;
          }
        });
      },
      moreSelected: function() {
        //console.log('NoteEditor.moreSelected()');
        if (vm.pagination) {
          vm.pagination.nextPage();
        }
      },
      mapMarkerMoved: function(marker) {
        //console.log('NoteEditor.mapMarkerMoved()');
        let latlonObj = {
          lat:  marker.latLng.lat(),
          lng: marker.latLng.lng()
        };
        vm.$emit('latlon', latlonObj);
      },
      placesClose: function() {
        //console.log('NoteEditor.placesClose()');
        vm.showPlacesDialog = false;
      },
      placeSelected: function(place) {
        //console.log('NoteEdit.placeSelected()');
        let options = {
          placeId: place.place_id,
          fields:['name', 'url']
        };
        vm.placesService.getDetails(options, function(placeDetail, status) {
          //console.log('NoteEdit.placeSelected() place details ['+status+']');
          if (status === 'OK') {
            let placeObj = {
              name: place.name,
              icon: place.icon,
              url: placeDetail.url,
              _id: place.place_id
            };
            let latlonObj = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            vm.$emit('place', placeObj, latlonObj);
            vm.showPlacesDialog = false;
          } else {
            console.warn('NoteEdit.placeSelected() Error ['+status+'] getting Place details');
          }
        });
      },
      placeInputUpdated: function(placeName) {
        //console.log('NoteEditor.placeInputUpdated()');
        vm.findPlace(placeName)
      },
      clearPlace: function() {
        //console.log('NoteEditor.clearPlace()');
        vm.$emit('place', null);
      }
    }
  }
</script>

<style scoped>
  span.no-place {
    font-size: smaller;
    color: #999999;
  }
  span.has-place {
    display: inline-block;
    max-width: 340px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: text-bottom;
  }
  .content {
    padding: 20px 20px 8px;
  }
  .geocoords, .place {
    height: 30px;
    line-height: 30px;
    width: 100%;
  }
  .place button {
    vertical-align: top;
  }
  .content > * {
    margin-bottom: 10px;
  }
  .content > *:last-child {
    margin-bottom: 0;
  }
  .content input {
    width: 60%;
  }
  .content textarea {
    width: 100%;
    heigth: 100%;
    overflow: auto;
  }
  .input-info {
    font-size: smaller;
  }
  .char-count {
    color: orangered;
  }
</style>