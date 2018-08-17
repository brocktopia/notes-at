'use strict';
module.exports = function(app) {
  var controller = require('../controllers/appController');

  // notebook operations
  app.route('/notebooks')
    .get(controller.list_all_notebooks)
    .post(controller.create_a_notebook);
  app.route('/notebook/:notebookId')
    .get(controller.read_a_notebook) // returns notebook instance along with all of its notes
    .put(controller.update_a_notebook) // updated notebook name
    .delete(controller.delete_a_notebook); // deletes notebook instance along with all of its notes [, controller.delete_notebook_notes]

  // returns all notes--not used in app but may be handy for testing
  app.route('/notes')
    .get(controller.list_all_notes);

  // count operations
  app.route('/notes/count')
    .get(controller.count_all_notes); // returns a count of all notes
  app.route('/notes/count/:notebookId')
    .get(controller.count_notebook_notes); // returns a count of all notes in a notebook

  // note(s) operations based on notebook id
  app.route('/notes/:notebookId')
    .post(controller.create_a_note) // injects notebook_id in service call
    .get(controller.notes_by_notebook) // returns notes for a notebook without notebook data
    .delete(controller.delete_notebook_notes); // deletes all notes in a notebook but not the notebook--might be an edge case

  // operations on an individual note
  app.route('/notes/note/:noteId')
    .get(controller.read_a_note)
    .put(controller.update_a_note)
    .delete(controller.delete_a_note);
};