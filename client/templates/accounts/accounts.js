Template.SignUp.events({
  'submit #signUpForm': function(e, t) {
    e.preventDefault();

    var signUpForm = $(e.currentTarget);
    var user = {
      'username': trimInput(signUpForm.find('#signUpName').val().toLowerCase()),
      'email': trimInput(signUpForm.find('#signUpEmail').val().toLowerCase()),
      'password': signUpForm.find('#signUpPassword').val(),
      'passwordConfirm': signUpForm.find('#signUpPasswordConfirm').val(),
      'profile': {
        'days': ["monday", "tuesday", "wednesday", "thursday", "friday"],
        'registered': new Date()
      }
    }
    var roleChoice = $('input:radio[name="SpaceRole"]:checked').val();

    if (isNotEmpty(user.email) && isNotEmpty(user.password) && isEmail(user.email) && areValidPasswords(user.password, user.passwordConfirm)) {
        Meteor.call('createUserWithRole', user, roleChoice, function(err, userId) {
        if (!err) {
          console.log('User Created.');
          Meteor.loginWithPassword(user.email, user.password, function(err) {
            if (err) {
              console.log('These credentials are not valid.');
            } else {
              console.log('Welcome back Meteorite!');
            }
          });
        } else {
          console.log('Register User Failed.');
        }

      });

      if (roleChoice == "SpaceOwner") {
        Router.go('createSpace')
      } else {
        Router.go('home');
      }
    }
    return false;
  },
});

Template.SignIn.events({
  'submit #signInForm': function(e, t) {
    e.preventDefault();
    var signInForm = $(e.currentTarget),
      email = trimInput(signInForm.find('#signInEmail').val().toLowerCase()),
      password = signInForm.find('#signInPassword').val();

    if (isNotEmpty(email) && isEmail(email) && isNotEmpty(password) && isValidPassword(password)) {
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          console.log('These credentials are not valid.');
        } else {
          console.log('Welcome back!');
        }
      });
      Router.go('home');
    }
    return false;
  },
});

Template.SignOut.events({
  'click #signOut': function(e, t) {
    Meteor.logout(function() {
      console.log('Bye! Come back whenever you want!');
      Router.go('home');
    });
    return false;
  }
});
