Template.createSpace.helpers({
  spaceUsers: function() {
    return Meteor.users.find({ '_id': { $ne: Meteor.userId() } }).fetch();
  },

});

Template.createSpace.events({

  'submit form': function(e, template) {
    e.preventDefault();
    var createSpace = $(e.currentTarget);
    var spaceData = {
      'ownerId': Meteor.userId(),
      'spaceId': createSpace.find('#spaceId').val(),
      'delegates': [
        { 'name': createSpace.find('#delegate_one').val(), 'index': "1" },
        { 'name': createSpace.find('#delegate_two').val(), 'index': "2" },
        { 'name': createSpace.find('#delegate_three').val(), 'index': "3"}
      ],
      'delegatedTo': Meteor.user().username,
      'status': "claimed"
    };

    Meteor.call('insertSpace', spaceData, function(error, id) {
      if (error)
        return alert(error.reason);
    });

    Router.go('home');
  }
});
