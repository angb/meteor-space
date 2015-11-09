Meteor.startup(function() {

  if (Meteor.users.find().count() === 0) {
    var users = [
    { 'username': "user1", 'email': "user1@test.com", 'roles': ["SpaceUser"] },
    { 'username': "user2", 'email': "user2@test.com", 'roles': ["SpaceUser"] },
    { 'username': "user3", 'email': "user3@test.com", 'roles': ["SpaceUser"] },
    { 'username': "spaceowner", 'email': "spaceowner@test.com", 'roles': ["SpaceOwner"] },
    { 'username': "admin", 'email': "admin@test.com", 'roles': ["Administrator"]
    }];

    _.each(users, function(user) {
      var id;
      id = Accounts.createUser({
        'username': user.username,
        'email': user.email,
        'password': "123456",
        'profile': {
          'days': ["monday", "tuesday", "wednesday", "thursday", "friday"],
          'registered': new Date()
        }
      });

      if (user.roles.length > 0) {
        Roles.addUsersToRoles(id, user.roles);
      };
      console.log("Added user...", user.username);

      if (Roles.userIsInRole(id, ['SpaceOwner'])) {
        var spaceDataSeed = {
          'ownerId': id,
          'spaceId': 100,
          'delegates': [
            { 'name': "user1", 'index': "1" },
            { 'name': "user2", 'index': "2" },
            { 'name': "user3", 'index': "3"}
          ],
          'delegatedTo': "spaceowner",
          'status': "claimed"
        };
        SpaceData.insert(spaceDataSeed);
        console.log("Inserted space # ", spaceDataSeed.spaceId);
      }
    }); //_each

  };

  SpaceData.find().forEach(function(space) {
    Meteor.call('returnSpaceOnTimeOut', space.spaceId);
  });

  SyncedCron.add({
    name: 'Return spaces to owners at midnight',
    schedule: function(parser) {
      return parser.text('at 12:00 am');
    },
    job: function() {
      SpaceData.find().forEach(function(space) {
        Meteor.call('returnSpaceOnTimeOut', space.spaceId);
      });
    }
  });

  SyncedCron.start();

})
