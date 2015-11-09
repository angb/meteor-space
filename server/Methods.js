Meteor.methods({

  'createUserWithRole': function(data, role) {
    var userId;
    Meteor.call('createUserNoRole', data, function(err, result) {
      if (err) {
        return err;
      }
      Roles.addUsersToRoles(result, role);
      return userId = result;
    });
    return userId;
  },

  'createUserNoRole': function(data) {
    //Do server side validation
    return Accounts.createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      profile: data.profile
    });
  },

  'freeSpace': function(spaceId) {

    // Add freed status
    var ownerName = Meteor.users.findOne({ '_id': Meteor.userId() }).username;
    SpaceStatusData.insert({
      'userId': Meteor.userId(),
      'username': ownerName,
      'spaceId': spaceId,
      'action': "freed",
      'date': new Date()
    });

    // Notify first user space is free
    Meteor.call('notifySpace', spaceId, 0);
  },

  'claimSpace': function(spaceId) {

    var username = Meteor.user().username;
    console.log("Claim: username is " + username);

    //Update SpaceData with claimant
    SpaceData.update({ 'spaceId': spaceId }, { $set: { 'status': "claimed", 'delegatedTo': username } });
    //Add to status history
    SpaceStatusData.insert({
      'userId': Meteor.userId(),
      'username': username,
      'spaceId': spaceId,
      'action': "claimed",
      'date': new Date()
    });
  },

  'rejectSpace': function(spaceId) {

    var username = Meteor.user().username;
    console.log("Reject by username: " + username);
    //Add to status history
    SpaceStatusData.insert({
      'userId': Meteor.userId(),
      'username': username,
      'spaceId': spaceId,
      'action': "reject",
      'date': new Date()
    });

    // Notify next user space is free
    var delegate = SpaceData.findOne({ 'spaceId': spaceId, 'delegates.name': username }, { fields: { _id: 0, 'delegates.$': 1 }});
    var index = delegate.delegates[0].index;
    if (SpaceData.findOne({ 'spaceId': spaceId }).delegates.length == index) {
      // No one wants it, return to owner
      var ownerId = SpaceData.findOne({ 'spaceId': spaceId }).ownerId;
      var ownerName = Meteor.users.findOne({ '_id': ownerId }).username;
      console.log("Returning space to " + ownerName);
      SpaceData.update({ 'spaceId': spaceId }, { $set: { 'status': "claimed", 'delegatedTo': ownerName }});
    } else {
      // Send to the next delegate
      console.log("Sending space to next delegate");
      Meteor.call('notifySpace', spaceId, index);

    }
  },

  'notifySpace': function(spaceId, index) {

    // Notify user space is free
    var delegateName = SpaceData.findOne({ 'spaceId': spaceId }).delegates[index].name;
    SpaceData.update({ 'spaceId': spaceId }, { $set: { 'delegatedTo': delegateName, 'status': "pending" } });

    //Add to status history
    SpaceStatusData.insert({
      'userId': Meteor.userId(),
      'username': delegateName,
      'spaceId': spaceId,
      'action': "pending",
      'date': new Date()
    });
  },

  'returnSpaceOnTimeOut': function(spaceId) {

    // Return space to owner at midnight.
    console.log("Checking expire on space " + spaceId);

    var today = moment();

    // Find last time space was freed
    var dateLastFreed = SpaceStatusData.findOne({'spaceId': spaceId,'action': "freed"}, {sort: {date: -1}, limit: 1});

    if (dateLastFreed) {
      var dateExpires = moment(dateLastFreed.date).add( 1, 'days').startOf('day');

      // If it's past midnight return to owner
      if (moment(today).isAfter(dateExpires)) {
        //  Return to owner
        var ownerId = SpaceData.findOne({'spaceId': spaceId}).ownerId;
        var ownerName = Meteor.users.findOne({'_id': ownerId}).username;
        console.log("Returning space to " + ownerName);
        SpaceData.update({ 'spaceId': spaceId}, { $set: {'status': "claimed", 'delegatedTo': ownerName} });
        //Add to status history
        SpaceStatusData.insert({ 'userId': ownerId, 'username': ownerName, 'spaceId': spaceId, 'action': "returned", 'date': new Date() });
      }
    }
  },

});
