'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotebookSchema = new Schema({
  name:{
    type: String,
    required: 'A notebook requires a name.'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notebooks', NotebookSchema)