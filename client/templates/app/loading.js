Template.loading.rendered = function() {
  if (!Session.get('loadingSplash')) {
    this.loading = window.pleaseWait({
      logo: 'img/car-space-icon.png',
      backgroundColor: '#7f8c8d',
      loadingHtml: message + spinner
    });
    Session.set('loadingSplash', true); // just show loading splash once
  }
};

Template.loading.destroyed = function() {
  if (this.loading) {
    this.loading.finish();
  }
};

var message = '<p class="loading-message">Please wait ... making space</p>';
var spinner = '<img src="img/car-space-icon.png" class="sk-spinner sk-spinner-rotating-plane"/>';
