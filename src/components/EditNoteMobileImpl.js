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
      activeView: 'edit-name',
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
    hasPlace:function(note) {
      return !!(note.place && note.place.name);
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