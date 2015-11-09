Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route("/", {
  name: "home",
  data: function() {
    return {
      message: "Free your car space here (or grab an unused one!)"
    }
  },
  onBeforeAction: function() {
    if (Roles.userIsInRole(Meteor.userId(), ['SpaceUser']))
      Router.go('/spaceUserHome');
    else if (Roles.userIsInRole(Meteor.userId(), ['SpaceOwner']))
      Router.go('/spaceOwnerHome');
    else
      this.next();
  }
});

Router.route("/history", {
  name: "history",
  waitOn: function() {
    Meteor.subscribe('userSpaceStatus');
  }
});

Router.route("/signup", {
  name: "SignUp"
});

Router.route("/signin", {
  name: "SignIn"
});

Router.route("/signout", {
  name: "SignOut"
});

Router.route("/spaceUserHome", {
  name: "spaceUserHome",
  waitOn: function() {
    return Meteor.subscribe("userSpaceData");
  }
});

Router.route("/spaceOwnerHome", {
  name: "spaceOwnerHome",
  waitOn: function() {
    return [Meteor.subscribe("allSpaceData"),
      Meteor.subscribe("spaceusers") ];
  }
});

Router.route("/manageSpace", {
  name: "manageSpace",
  waitOn: function() {
    return [Meteor.subscribe("allSpaceData"),
      Meteor.subscribe("spaceusers") ];
  }
});

Router.route("/createSpace", {
  name: "createSpace",
  waitOn: function() {
    return Meteor.subscribe("spaceusers");
  }
});

Router.route("/profile", {
  name: "profile"
});
