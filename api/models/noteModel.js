'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  name: {
    type: String,
    required: 'A note requires a name.'
  },
  note: {
    type: String,
    required: 'A note requires a note body text.'
  },
  notebook: {
    type: Schema.Types.ObjectId,
    required: 'A note requires a notebook reference.',
    index: true
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  geocode: {
    lat: Number,
    lng: Number
  },
  place: {
    _id: String, // want to use Schema.Types.ObjectId but getting an error
    icon: String,
    url: String,
    name: String
  }
});

module.exports = mongoose.model('Notes', NoteSchema);