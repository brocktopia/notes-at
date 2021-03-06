<template>
  <div>

    <!-- Name, Date & Map settings -->
    <div :class="'app-container' + (mode === 'new' ? ' new' : ' edit')" v-if="activeView === 'edit-name'">

      <header>
        <h2>{{mode === 'edit' ? note.name : 'New Mobile Note'}}</h2>
        <span class="button-bar">
          <svg class="icon" @click="activeView = 'edit-note'"><use xlink:href="./dist/symbols.svg#arrow-forward"></use></svg>
        </span>
      </header>

      <div class="content name-edit">

        <div class="name">
          <label v-if="mode === 'edit'" for="noteName" style="font-size: smaller;">Name</label>
          <input type="text" id="noteName" v-model="note.name" maxlength="40" placeholder="Name for your note" tabindex="1">
          <span style="font-size: smaller;">
            Maximum 40 characters (<span :class="note.name.length < 30 ? 'char-count' : 'char-count-close'">{{40 - note.name.length}}</span> remaining)
          </span>
        </div>

        <div class="date">{{$moment(note.Created_date).format('LLLL')}}</div>

        <div class="geocoords">
          <svg class="icon-tiny location-icon" style="vertical-align: text-bottom;"><use xlink:href="./dist/symbols.svg#my-location"></use></svg>
          {{note.geocode.lat +', '+note.geocode.lng}}
        </div>

        <div class="place">
          <svg v-if="!hasPlace(note)" class="icon-small"><use xlink:href="./dist/symbols.svg#place"></use></svg>
          <img v-if="hasPlace(note)" :src="note.place.icon" class="icon-small" style="vertical-align:unset;" />
          <span :class="hasPlace(note) ? 'has-place' : 'no-place'" id="placeName">{{note.place && note.place._id ? note.place.name : 'Click the button to add a place'}}</span>
          <span style="float:right;">
            <button v-if="hasPlace(note)" @click="clearPlace()" style="margin-right: 10px;">Remove</button>
            <button v-if="hasPlace(note)" @click="findPlace()" tabindex="2">Change</button>
            <button v-if="!hasPlace(note)" @click="findPlace()" tabindex="2">Lookup Places</button>
          </span>
        </div>

        <gmap-map
          class="content"
          ref="NoteMap"
          :center="{'lat':geoLat,'lng':geoLon}"
          :zoom="15"
          style="width:100%;  height:100%;"
        >
          <gmap-marker
            ref="myMarker"
            :draggable="true"
            @dragend="mapMarkerMoved"
            :position="{'lat':note.geocode.lat, 'lng':note.geocode.lng}"></gmap-marker>
        </gmap-map>

      </div>

      <div class="navigation">
        <a @click="closeNote()">Cancel</a>
        <a class="action-link" @click="activeView = 'edit-note'">Next</a>
      </div>

    </div>

    <!-- Note input -->
    <div class="app-container" v-if="activeView === 'edit-note'">

      <header>
        <h2>{{mode === 'edit' ? note.name : 'New Mobile Note'}}</h2>
        <span class="button-bar">
          <svg class="icon" @click="activeView = 'edit-name'"><use xlink:href="./dist/symbols.svg#arrow-back"></use></svg>
          <svg class="icon" @click="saveNote()"><use xlink:href="./dist/symbols.svg#save"></use></svg>
        </span>
      </header>

      <div class="content note-edit">
        <textarea id="noteNote" v-model="note.note" placeholder="Your note"></textarea>
      </div>

      <div class="navigation">
        <a @click="closeNote()">Cancel</a>
        <a class="action-link" @click="saveNote()">Save</a>
        <a class="action-link" @click="activeView = 'edit-name'">Back</a>
      </div>
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
  /*
    I created this file as a way to test branching views based on mobile/desktop. Originally,
    I was just linking this file and NoteEdit.vue to the external script via the src attribute
    of the script tag. This didn't work and this view was overriding the NoteEdit component because
    it's module was being imported after NoteEdit. Got help showing me the right way to do this
    using the extends for composition. Would probably make more sense to just move the templating
    out of this file into NoteEdit and do my CSS branching in that file, but since it makes a nice
    example of using composition, I'm going to leave it.
  */
  import EditNoteImpl from './EditNoteImpl'

  export default {
    name: 'EditNoteMobile',
    extends: EditNoteImpl
  }
</script>

<style scoped>
  .app-container.edit .name-edit {
    display: grid;
    grid-template-rows: 120px 40px 60px 60px auto;
  }
  .app-container.new .name-edit {
    display: grid;
    grid-template-rows: 90px 40px 60px 60px auto;
  }
  #noteName {
    font-size: 1.8rem;
  }
  .content {
    padding: 20px;
  }
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
  #noteNote {
    height: 100%;
    font-size: 1.8rem;
  }
  .geocoords {
    color: #4e7eef;
    fill: #4e7eef;
  }
  .geocoords, .place {
    height: 50px;
    line-height: 50px;
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
    width: 100%;
  }
  .content textarea {
    width: 100%;
    heigth: 100%;
    overflow: auto;
  }
  .char-count {
    color: darkgreen;
  }
  .char-count-close {
    color: orangered;
  }
</style>