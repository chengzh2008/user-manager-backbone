
$(function(){

  var User = Backbone.Model.extend({
    defaults: function() {
      return {
        first: "empty contact...",
	       last: "empty mobile...",
         email: "empty email...",
      };
    },
  });

  var UserList = Backbone.Collection.extend({
    model: User,
    localStorage: new Backbone.LocalStorage("users-backbone"),
  });

  var users = new UserList;

  var UserView = Backbone.View.extend({
    tagName:  "li",
    template: _.template($('#item-template').html()),
    events: {
      "click button.update"  : "edit",
      "click button.remove" : "clear",
      "click #updtBt"      : "close"
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$('.edit');
      return this;
    },

    edit: function() {
	$("li.editing").removeClass("editing");	
      this.$el.addClass("editing");
    },

    close: function() {
      if($(".editing #first").val() && validateEmail($(".editing #email").val())){
	       this.model.save({first:  $(".editing #first").val(),email:$(".editing #email").val(),last:$(".editing #last").val()});
        this.$el.removeClass("editing");
      } 
    },

    clear: function() {
      this.model.destroy();
    }

  });

  var AppView = Backbone.View.extend({
    el: $("#userManagerApp"),
    
    events: {
      "click #addBtn": "addUser"
    },

    initialize: function() {
      this.listenTo(users, 'add', this.addOne);
      this.listenTo(users, 'reset', this.addAll);
      this.listenTo(users, 'all', this.render);
      this.main = $('#main');
      users.fetch();
    },

    render: function() {
      if (users.length) {
        this.main.show();
      } else {
        this.main.hide();
        }
    },

    addOne: function(user) {
      var view = new UserView({model: user});
      this.$("#user-list").append(view.render().el);
    },

    addAll: function() {
      users.each(this.addOne, this);
    },

     addUser : function(){
		  if($("#firstText").val() && validateEmail($("#emailText").val())){
			   users.create({first: $("#firstText").val(),email:  $("#emailText").val(),last:  $("#lastText").val()});
			   $("#firstText").val('');
			   $("#emailText").val('');
			   $("#lastText").val('');
		  } 
	   }, 

  });

  function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      } 

  var App = new AppView;

});
