Parse.initialize("AQ4u5KQHoN3hXj0VgyMVOWDwB4VrbyYsqVpbbabR", "Jtsz9QU0LQsr3h7Gn1xMawkRjSBCWjAP84CLggpC");
var model;
var Radio = Parse.Object.extend("Radio");
var player;
$(document).ready(function(){
    $("#dialog").hide();
    LoadData();
    player = document.createElement("audio");
    model = new RadioViewModel();
    ko.applyBindings(model);

    $("#sav").click(function(){
        var ch = new Radio();
         ch.save({Name: $("#name").val(),URl:$("#URL").val()}).then(function(object) {
             var t = new rad(object);
             model.addRadio(t);
            });
         Close();
    });
}); 
        
 function LoadData(){                
    var query = new Parse.Query(Radio);
    query.find({
      success: function(results) {
          $(results).each(function(i,item){ 
             var it = new rad(item);
             model.addRadio(it); 
          });
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
 }
function rad(obj) {
    var self = this;
    self.obj = ko.observable(obj);
    
    self.Name = ko.observable(obj.get('Name'));
    self.URl = ko.observable(obj.get('URl'));
    
    self.temp = ko.observable("dis");
    self.stop = function (item) {
        player.pause();
        model.act(null);
        self.temp('dis');
    };
    self.cha = function (item) {
       model.prev(item.temp());
       item.temp('edit');
    };
    self.close = function (item) {
        self.temp(model.prev());
    };
    self.save = function (item) {
        self.obj().set('Name',item.Name());
        self.obj().set('URl',item.URl());
        self.obj().save();
        item.temp(model.prev());
    };
    self.delete = function (item) {        
        self.obj().destroy({
          success: function(myObject) {
            model.removeRadio(item);
          },
          error: function(myObject, error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
        item.temp(model.prev());
    };
    self.Play = function (item) {
        if(model.act() != null){
            model.act().stop();
            model.act(item);
        }
        else{model.act(item);}
        player.setAttribute('src',self.obj().get('URl')); 
        player.play();;
        self.temp('play');
    };    
}
function RadioViewModel() {
    var self = this;
    self.list = ko.observableArray([]);    
    self.removeRadio = function (item) {self.list.remove(item);};
    self.act = ko.observable();
    self.prev = ko.observable("dis");
    self.addRadio = function (rad) {self.list.push(rad);};    
}