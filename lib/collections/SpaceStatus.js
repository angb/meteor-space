SpaceStatusData = new Meteor.Collection('spaceStatus');

var Schemas = {};


Schemas.SpaceStatusData = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
  },
  username: {
    type: String,
    label: "Username",
  },
  spaceId: {
    type: String,
    label: "Space ID"
  },
  action: {
    type: String,
    optional: true
  },
  date: {
    type: Date,
    label: "Date"
  },
});

SpaceStatusData.attachSchema(Schemas.SpaceStatusData);

SpaceStatusData.allow({
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
