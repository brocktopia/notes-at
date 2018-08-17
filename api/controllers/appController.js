'use strict';

var mongoose = require('mongoose'),
  Notebook = mongoose.model('Notebooks'),
  Note = mongoose.model('Notes');

// Get All Notebooks
exports.list_all_notebooks = function(req, res) {
  Notebook.find({})
    .sort({Created_date: -1})
    .exec(
      function(err, notebooks) {
        if (err) {
          res.send(err);
        }
        res.json(notebooks);
      }
    );
};
// Create New Notebook
exports.create_a_notebook = function(req, res) {
  var new_notebook = new Notebook(req.body);
  new_notebook.save(function(err, notebook) {
    if (err)
      res.send(err);
    res.json(notebook);
  });
};
// Update Notebook
exports.update_a_notebook = function(req, res) {
  Notebook.findOneAndUpdate({_id: req.params.notebookId}, req.body, {new: true}, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
// Delete Notebook (and all Notes)
exports.delete_a_notebook = function(req, res, next) {
  // first delete notebook notes
  Note.remove({notebook: req.params.notebookId}).exec().
    then(function (notes) {
      // then delete notebook
      if (notes.ok) {
        Notebook.remove({
          _id: req.params.notebookId
        }, function(err, notebook) {
            if (err)
              res.send(err);
            res.json({ success: 1, notes: notes.n, message: 'Notebook and ['+notes.n+'] Notes successfully deleted' });
        });
      } else {
        res.send(new Error('Failed to delete notes'));
      }
  });
};
// Get Notebook & Notes (append notes to notebook object)
exports.read_a_notebook = function(req, res) {
  Notebook.findById(req.params.notebookId).exec()
    .then(function(notebook) {
      Note.find({notebook: req.params.notebookId})
        .sort({Created_date: -1})
        .exec(
          function(err, notes) {
            if (err)
              res.send(err);
            var myNotebook = notebook.toObject();
            myNotebook.notes = notes.map(m => m._doc);
            res.json(myNotebook);
          }
        )
    }
  )
};
// Get Notebook Notes without Notebook reference (not sure of use case)
exports.notes_by_notebook = function(req, res) {
  Note.find({notebook: req.params.notebookId})
    .sort({Created_date: -1})
    .exec(
      function(err, notes) {
        if (err)
          res.send(err);
        res.json(notes);
      }
    );
};
// Delete all Notes in a Notebook
exports.delete_notebook_notes = function(req, res) {
  Note.remove({
    notebook: req.params.notebookId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ success: 1, message: 'Notes successfully deleted' });
  });
};
// Get all Notes regardless of Notebook (not sure of use case)
exports.list_all_notes = function(req, res) {
  Note.find({}, function(err, notes) {
    if (err) {
      res.send(err);
    }
    res.json(notes);
  });
};
// Create a new Note
exports.create_a_note = function(req, res) {
  var notebook_id = req.params.notebookId;
  // inject notebook id
  if (notebook_id) {
    req.body.notebook = notebook_id;
  }
  var new_note = new Note(req.body);
  new_note.save(function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
// Get an individual Note
exports.read_a_note = function(req, res) {
  Note.findById(req.params.noteId, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
// Update a Note
exports.update_a_note = function(req, res) {
  Note.findOneAndUpdate({_id: req.params.noteId}, req.body, {new: true}, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
// Delete a Note
exports.delete_a_note = function(req, res) {
  Note.remove({
    _id: req.params.noteId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ success: 1, message: 'Note successfully deleted' });
  });
};
// Get count of all Notes
exports.count_all_notes = function(req, res) {
  Note.estimatedDocumentCount({}, function(err, count) {
    if (err)
      res.send(err);
    res.json(count);
  })
};
// Get a count of Notebook Notes
exports.count_notebook_notes = function(req, res) {
  Note.countDocuments({notebook: req.params.notebookId}, function(err, count) {
    if (err)
      res.send(err);
    res.json(count);
  })
};