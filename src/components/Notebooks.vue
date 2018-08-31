<template>
  <div class="app-container">

    <header>
      <h2>Notebooks</h2>
      <span class="button-bar">
        <svg class="icon" @click="addNotebook()"><use xlink:href="./dist/symbols.svg#add-item"></use></svg>
      </span>
    </header>

    <div class="content">
      <ul class="notebooks">
        <li
          v-for="notebook in notebooks"
          :key="notebook._id"
          class="list-item"
          @click="notebookSelect(notebook)"
        >
          <span class="list-item-name">{{notebook.name}}</span>
          <span class="notebook-date">{{$moment(notebook.Created_date).format("l")}}</span>
        </li>
      </ul>
      <div class="notebooks-message">{{notebooksMessage}}</div>
      <div class="loading-mask" v-if="isLoading"><span>{{loadingMessage}}</span></div>
    </div>

    <div class="navigation">
      <router-link to="/">Home</router-link>
    </div>

    <edit-notebook-dialog
      v-if="showNewNotebook"
      :mode="'create'"
      :notebook="notebookBaseObj"
      @save="saveNewNotebook"
      @close="cancelNewNotebook"
    ></edit-notebook-dialog>

  </div>
</template>

<script>
  import EditNotebookDialog from './EditNotebookDialog'

  var vm;
  export default {

    components:{
      EditNotebookDialog
    },

    data: function() {
      return {
        notebooks:[],
        notebooksMessage:'',
        showNewNotebook:false,
        isLoading: true,
        loadingMessage:'Loading...',
        notebookBaseObj:{}
      }
    },

    mounted: function() {
      //console.log('Notebooks.mounted()');
      vm = this;
      this.$axios.get('/notebooks')
        .then(function(res) {
          //console.log('Notebooks.vue service call response:');
          //console.dir(res.data);
          vm.isLoading = false;
          vm.notebooks = res.data;
          if (res.data.length > 0) {
            vm.message = '';
          } else {
            vm.notebooksMessage = 'No notebook have been created.';
          }
        })
        .then(function() {
          // Check to see if route is to notebooks-new
          if (vm.$route.name === 'notebooks-new') {
            vm.showNewNotebook = true;
          }
        })
        .catch(error => console.log(error));
        //.then(response => (this.data = response.data));
    },

    methods:{
      notebookSelect: function(notebook) {
        //console.log('Notebooks.notebookSelect() notebook');
        vm.$router.push('/notebook/'+notebook._id);
      },
      addNotebook: function() {
        //console.log('Notebooks.addNotebook()');
        // initialize a new notebook instance
        vm.notebookBaseObj = {name:'', Created_date: new Date()};
        vm.showNewNotebook = true;
        vm.$router.replace('/notebooks/new');
      },
      cancelNewNotebook: function() {
        //console.log('Notebooks.cancelNewNotebook()');
        // clear notebookBaseObj
        vm.notebookBaseObj = {};
        vm.showNewNotebook = false;
        vm.$router.replace('/notebooks');
      },
      saveNewNotebook: function(notebook) {
        //console.log('Notebooks.saveNewNotebook()');
        this.$axios.post('/notebooks/', notebook)
          .then(function(res) {
            if (res.data._id) {
              vm.notebooks.unshift(res.data);
            }
            // clear notebookBaseObj
            vm.notebookBaseObj = {};
            vm.showNewNotebook = false;
            vm.$router.replace('/notebooks');
          })
          .catch(error => console.log(error));
      }
    }

  }
</script>

<style scoped>
  ul {
    width: 100%;
    margin: 0px;
    text-align: left;
  }
  ul.notebooks li {
    list-style: none;
    width: 100%;
    height: 50px;
    padding: 0px 20px;
    background-color: #dddddd;
    border-top: 1px solid #ffffff;
    border-bottom: 1px solid #999999;
    line-height: 50px;
    cursor: pointer;
  }
  ul.notebooks li:hover {
    background-color: #eeeeee;
  }
  .notebook-date {
    float: right;
  }
  .notebooks-message {
    margin: 20px;
  }
</style>
