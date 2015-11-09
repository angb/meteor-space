
Template.delegatePanel.onCreated(function() {
  this.isExpanded = new ReactiveVar(false);
  this.glyphicon = new ReactiveVar('glyphicon-chevron-down');
});

Template.delegatePanel.helpers({
  isExpanded: function() {
    return Template.instance().isExpanded.get();
  },
  glyphicon: function() {
    return Template.instance().glyphicon.get();

  },
  delegateProfile: function(name) {
    var data = Meteor.users.findOne({ 'username': name });
    return data;
  }
});

Template.delegatePanel.events({
  'click .dropdown-user': function(e, template) {
    e.preventDefault();
    var isExpanded = template.isExpanded.get();
    template.isExpanded.set(!isExpanded);

    if (isExpanded) {
      template.glyphicon.set('glyphicon-chevron-down');
    } else {
      template.glyphicon.set('glyphicon-chevron-up');
    }
    template.isExpanded.set(!isExpanded);
  },

  'click button': function(e) {
    e.preventDefault();
    alert("This is a demo.\n :-)");
  }
});
