import Vue from 'vue'
import VueRouter from 'vue-router'

// component route endpoints
import Home from '../components/Home'
import Notebooks from '../components/Notebooks'
import Notebook from '../components/Notebook'
import NavError from '../components/NavError'

Vue.use(VueRouter);

export default new VueRouter({
  routes:[
    // Home Component
    {
      path:'/',
      name:'home',
      component: Home
    }
    // Notebooks Component
    ,{
      path:'/notebooks',
      name:'notebooks',
      component: Notebooks
    },{
      path:'/notebooks/new',
      name:'notebooks-new',
      component: Notebooks
    }
    // Notebook Component
    ,{
      path:'/notebook/:notebook_id',
      name:'notebook',
      component: Notebook
    },{
      path:'/notebook/:notebook_id/note/:note_id',
      name:'notebook-note',
      component: Notebook
    },{
      path:'/notebook/:notebook_id/note-edit/:note_id',
      name:'notebook-note-edit',
      component: Notebook
    },{
      path:'/notebook/:notebook_id/note-new',
      name:'notebook-note-new',
      component: Notebook
    },{
      path:'/notebook/:notebook_id/map',
      name:'notebook-map',
      component: Notebook
    }
    // NavError Component
    ,{
      path:'*',
      name:'404',
      component: NavError
    }
  ]
})