Template.manageSpace.helpers({
  user: function() {
    return SpaceData.findOne();
  },
  spaceUsers: function() {
    // return Meteor.users.find({}).fetch();
    return Meteor.users.find({ '_id': { $ne: Meteor.userId() } }).fetch();
  },

});

Template.manageSpace.events({

  'submit form': function(e, template) {
    e.preventDefault();
    var currentSpaceID = SpaceData.findOne().spaceId;
    console.log("currentSpaceID is " + currentSpaceID);
    var newSpaceID = event.target.spaceId.value;
    console.log("newSpaceID is " + newSpaceID);

    if (newSpaceID != "") {
      Meteor.call('setSpaceId', newSpaceID, function(error, id) {
        if (error)
          return alert(error.reason);
      });
    };

    $("select[name='delegate']").each(function() {
      var delg = $(this).val();
      var ind = $(this).attr("id");
      if (delg != null) {
        var newdelegate = { "index": ind, "name": delg };
        Meteor.call('setDelegate', newdelegate, function(error, id) {
          if (error)
            return alert(error.reason);
        });
      }
    });
  }
});
