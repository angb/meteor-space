Template.claimSpace.helpers({
  currentSpaceData: function() {
    return SpaceData.find().fetch();
  },
  isPending: function() {
    var spaceData = SpaceData.findOne();
    if (spaceData) {
      if (spaceData.status == "pending") {
        return true;
      }
    }
    return false;
  },
});

Template.claimSpace.events({
  'click #claimSpace': function(e) {
    e.preventDefault();
    var spaceId = this.spaceId;
    console.log(Meteor.userId() + " is about to claim space " + spaceId);
    Meteor.call('claimSpace', spaceId);
  },

  'click #rejectSpace': function(e) {
    e.preventDefault();
    var spaceId = this.spaceId;
    console.log(Meteor.userId() + " is about to reject space " + spaceId);
    Meteor.call('rejectSpace', spaceId);
  },

});
