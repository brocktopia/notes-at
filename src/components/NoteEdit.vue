<template>
  <div class="app-container edit">

    <header>
      <h2>{{mode === 'edit' ? note.name : 'New Note'}}</h2>
      <span class="button-bar">
        <svg class="icon action-icon" @click="closeNote()"><use xlink:href="./dist/symbols.svg#close-note"></use></svg>
        <svg class="icon action-icon" v-on:click="saveNote()"><use xlink:href="./dist/symbols.svg#save"></use></svg>
      </span>
    </header>

    <div class="content note-edit">

      <div class="name">
        <label for="noteName">Name</label>
        <input type="text" id="noteName" v-model="note.name" maxlength="40" placeholder="Name for your note" tabindex="1">
        <span class="input-info"><span class="char-count">{{note.name.length}}</span> (40 character limit)</span>
      </div>

      <div class="date">{{$moment(note.Created_date).format('LLLL')}}</div>

      <div class="geocoords">
        <label for="geocords">Location:</label>
        <span id="geocords" class="link">{{note.geocode.lat +', '+note.geocode.lng}}</span>
        <svg class="icon-small action-icon" v-on:click="updateCoordinates()"><use xlink:href="./dist/symbols.svg#my-location"></use></svg>
      </div>

      <div class="place">
        <label v-if="!hasPlace(note)" for="placeName">
          <svg class="icon-small"><use xlink:href="./dist/symbols.svg#place"></use></svg>
        </label>
        <label v-if="hasPlace(note)" for="placeName">
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
          @dragend="mapMarkerMoved"
          :position="{'lat':note.geocode.lat, 'lng':note.geocode.lng}"></gmap-marker>
      </gmap-map>

      <div class="note-input">
        <textarea id="noteNote" v-model="note.note" placeholder="Your note" tabindex="3"></textarea>
      </div>

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
  import EditNoteImpl from './EditNoteImpl'

  export default {
    name: 'EditNote',
    extends: EditNoteImpl
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
    display: grid;
    grid-template-rows: 45px 30px 35px 35px 155px auto;
  }
  .note-input {
    flex: auto;
  }
  #noteNote {
    height: 100%;
  }
  .geocoords, .place {
    height: 30px;
    line-height: 30px;
    width: 100%;
  }
  .place button {
    vertical-align: top;
  }
  .place svg {
    fill: #ed453b;
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