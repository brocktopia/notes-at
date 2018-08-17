<template>
  <div>

    <header>
      <h2>{{note.name}}</h2>
      <svg class="icon action-icon" @click="closeNote()"><use xlink:href="./dist/symbols.svg#close-note"></use></svg>
      <svg v-if="!showNoteMap" class="icon action-icon" @click="showMap()"><use xlink:href="./dist/symbols.svg#map"></use></svg>
      <svg v-if="showNoteMap" class="icon action-icon" @click="showNote()"><use xlink:href="./dist/symbols.svg#note"></use></svg>
      <svg class="icon action-icon" @click="editNote()"><use xlink:href="./dist/symbols.svg#edit-note"></use></svg>
      <svg class="icon action-icon" @click="deleteNote()"><use xlink:href="./dist/symbols.svg#delete-note"></use></svg>
    </header>

    <div v-if="!showNoteMap" class="content">

      <div class="date">{{$moment(note.date).format('LLLL')}}</div>

      <div class="geocoords" v-if="note.place && note.place.name">
        <label for="placeName">
          <img :src="note.place.icon" width="24" height="24" />
        </label>
        <span id="placeName">{{note.place.name}}</span>
        <a :href="note.place.url" target="_blank">
          <svg class="icon-tiny"><use xlink:href="./dist/symbols.svg#launch"></use></svg>
        </a>
      </div>

      <div class="geocoords">
        <a @click="showMap()" style="cursor: pointer;">
          <svg class="icon-tiny location-icon"><use xlink:href="./dist/symbols.svg#my-location"></use></svg>
          {{note.geocode.lat +', '+note.geocode.lng}}
        </a>
      </div>
      <p class="note">{{note.note}}</p>
    </div>

    <gmap-map
      class="content"
      v-if="showNoteMap"
      ref="NoteMap"
      :center="{'lat':geoLat,'lng':geoLon}"
      :zoom="15"
    >
      <gmap-marker
        ref="myMarker"
        :position="google && new google.maps.LatLng(geoLat, geoLon)"
      />
    </gmap-map>

    <div class="navigation">
      <a @click="closeNote()">Back to Notebook</a>
      <a style="float:right;" @click="nextNote()">Next Note &gt;</a>
      <a style="float:right;" @click="previousNote()">&lt; Previous Note</a>
    </div>

    <!-- Dynamically loaded content -->

    <modal-dialog v-if="showConfirmModal" @close="showConfirmModal = false">
      <h3 slot="header">Confirm Delete</h3>
      <div slot="body">Are you sure you want to delete this note? This can not be undone.</div>
      <div slot="footer">
        <button class="modal-optional-button" @click="cancelDelete()">
          Cancel
        </button>
        <button class="modal-default-button" @click="confirmDelete()">
          Confirm
        </button>
      </div>
    </modal-dialog>

    <div class="loading-mask" v-if="isLoading"><span>{{loadingMessage}}</span></div>

  </div>
</template>

<script>
  import ModalDialog from './ModalDialog'
  import {gmapApi, GmapMap} from 'vue2-google-maps'

  var vm;
  export default {

    components: {
      ModalDialog
    },

    computed: {
      google: gmapApi,
      geoLat: function () {
        return vm.note.geocode.lat || 0;
      },
      geoLon: function () {
        return vm.note.geocode.lng || 0;
      },
    },

    props: {
      note:Object
    },

    data: function() {
      return {
        showConfirmModal: false,
        isLoading: false,
        loadingMessage:'Loading...',
        showNoteMap:false
      }
    },

    mounted: function() {
      vm = this;
    },

    methods: {
      editNote:function() {
        //console.log('Note.editNote()');
        vm.$emit('edit');
      },
      closeNote:function() {
        //console.log('Note.closeNote()');
        vm.$emit('close');
      },
      nextNote:function() {
        //console.log('Note.nextNote()');
        vm.$emit('next');
      },
      previousNote:function() {
        //console.log('Note.previousNote()');
        vm.$emit('previous');
      },
      deleteNote:function() {
        //console.log('Note.deleteNote()');
        vm.showConfirmModal = true;
      },
      cancelDelete:function() {
        //console.log('Note.cancelDelete()');
        vm.showConfirmModal = false;
      },
      confirmDelete:function() {
        //console.log('Note.confirmDelete()');
        vm.$emit('delete');
      },
      showMap:function() {
        //console.log('Note.showMap() lat ['+vm.geoLat+'] lng ['+vm.geoLon+']');
        vm.showNoteMap = true;
      },
      showNote:function() {
        //console.log('Note.showNote()');
        vm.showNoteMap = false;
      },
      closeMap:function() {
        //console.log('closeMap()');
        vm.showNoteMap = false;
      }
    }

  }
</script>

<style scoped>
  .content {
    padding: 20px;
  }
  .content > div {
    margin: 6px 0;
  }
  .geocoords img {
    vertical-align: middle;
  }
  .note {
    white-space: pre-wrap;
  }
  a svg {
    fill: #42b983;
  }
</style>