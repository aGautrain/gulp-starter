Vue.component('file', {
  props: {
    name: String,
    origin:{
      validator: function(value){
        return (value === 'Dropbox') || (value === 'Google');
      }
    },
    id:{
      type: String,
      required: false
    }
  },
  methods :{
    getIcon:function(){
      switch(this.origin){
        case 'Dropbox':
          return 'fab fa-dropbox';
          break;
        case 'Google':
          return 'fab fa-google-drive';
          break;
        default:
          return 'fas fa-question';
          break;
      }
    }
  }
  ,
  template: 'this is a file component'
});

// View
var model = new Vue({
  el: '#main',
  data: {
    msg: "Vue is working fine"
  },
  // methods: { }
});