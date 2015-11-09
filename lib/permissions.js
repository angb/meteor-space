isAdmin = function(){
  var loggedInUser = Meteor.user();
  var result = false;
  if(loggedInUser){
    if (Roles.userIsInRole(loggedInUser, ['Administrator'])){
      result = true;
    }
  }
  return result;
};

isSpaceOwner = function(){
  var loggedInUser = Meteor.user();
  var result = false;
  if(loggedInUser){
    if (Roles.userIsInRole(loggedInUser, ['SpaceOwner'])){
      result = true;
    }
  }
  return result;
};
