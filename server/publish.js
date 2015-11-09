Meteor.publish('allSpaceData', function() {
  return SpaceData.find({ ownerId: this.userId });
});

Meteor.publish('userSpaceData', function() {
  if (this.userId) {
    var username = Meteor.users.findOne({ '_id': this.userId }).username;
    return SpaceData.find({ 'delegatedTo': username }, { fields: { 'spaceId': 1, 'delegatedTo': 1, 'status': 1 }});
  }
});

Meteor.publish('userSpaceStatus', function() {
  if (Roles.userIsInRole(this.userId, ['SpaceOwner'])) {
    //Find the owners spaces
    var spaceId = SpaceData.findOne({ 'ownerId': this.userId }).spaceId;
    return SpaceStatusData.find({ 'spaceId': spaceId }, { sort: { date: -1 }, limit: 10 });
  } else {
    return SpaceStatusData.find({ 'userId': this.userId }, { sort: { date: -1 }, limit: 10 });
  }
});

Meteor.publish('spaceusers', function() {
  if (Roles.userIsInRole(this.userId, ['SpaceOwner'])) {
    return Meteor.users.find({ 'roles': "SpaceUser" }, { fields: { 'username': 1, 'profile': 1 }});
  }
});
