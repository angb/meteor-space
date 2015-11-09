Template.spaceDetails.helpers({
  user: function() {
    var data = SpaceData.findOne();
    return data;
  },
  
  isFreed: function() {
    var delegatedTo = SpaceData.findOne().delegatedTo;
    if (delegatedTo != Meteor.user().username) {
      return true;
    }
    return false;
  },
});

Template.spaceDetails.events({
  'click #freeSpace': function(e) {
    e.preventDefault();
    var spaceId = this.spaceId;
    console.log("About to update space " + spaceId);
    Meteor.call('freeSpace', spaceId);
  },

  'click #reclaimSpace': function(e) {
    e.preventDefault();
    var id = this._id;
    var spaceId = this.spaceId;
    console.log("About to reclaim space " + spaceId);
    Meteor.call('claimSpace', spaceId);
  },

});
