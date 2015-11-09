SpaceData = new Meteor.Collection('space_data');
var Schemas = {};

Schemas.Delegates = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  index: {
    type: String,
    optional: true
  }
});

Schemas.SpaceData = new SimpleSchema({
  ownerId: {
    type: String,
    label: "Owner ID",
  },
  spaceId: {
    type: String,
    label: "Space ID"
  },
  delegates: {
    type: [Schemas.Delegates],
    optional: true
  },
  delegatedTo: {
    type: String,
    label: "Delegated to",
    optional: true
  },
  status: {
    type: String,
    label: "Status",
    allowedValues: ['freed', 'claimed', 'pending', 'reject'],
    optional: true,
  }
});

SpaceData.attachSchema(Schemas.SpaceData);

SpaceData.allow({
  insert: function(userId, data) {
    if (data.userId == userId)
      return true;
    return false;
  },
  update: function(userId, data) {
    if (data.userId == userId)
      return true;
    return false;
  },
  remove: function(userId, data) {
    if (data.userId == userId)
      return true;
    return false;
  }
});

Meteor.methods({
  setSpaceId: function(spaceId) {
    SpaceData.update({ ownerId: this.userId }, { $set: { 'spaceId': spaceId }});
  },
  setDelegate: function(delegate) {
    console.log("Updating delegate with index " + delegate.index + " and name " + delegate.name);
    SpaceData.update({ 'ownerId': this.userId, 'delegates.index': delegate.index }, { $set: { 'delegates.$.name': delegate.name}});
  },
  insertSpace: function(data) {
    console.log("Inserting space with ID " + data.spaceId);
    SpaceData.insert(data);
  }

});
