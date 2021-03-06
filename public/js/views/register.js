App.Register = (function () {
  'use strict';

  var registerForm;

  return {

    init: function () {
      registerForm = document.getElementById('register');

      this.bindEvents();
    },

    bindEvents: function () {
      registerForm.addEventListener('submit', this.submit.bind(this), false);
    },

    submit: function (e) {
      e.preventDefault();

      var username = document.getElementById('username').value;
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;

      App.Utils.ajax({
        method: 'POST',
        url: '/register',
        data: {
          username: username,
          email: email,
          password: password
        }
      }, function (response) {
        if (response.success) {
          window.location = '/new';
        } else {
          App.Utils.message(response.error, 'error');
        }
      }.bind(this));
    }

  };

})();

if (document.getElementById('register')) {
  window.addEventListener('load', App.Register.init.bind(App.Register));
}
