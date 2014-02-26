doodles.register = {

  init: function () {
    var registerForm = document.getElementById('register_form');
    if (registerForm) {
      registerForm.addEventListener('submit', doodles.register.submit);
    }
  },

  submit: function (e) {
    e.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    doodles.utils.ajax({
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
        doodles.utils.message(response.error, 'error');
      }
    }.bind(this));
  }

}

window.addEventListener('load', doodles.register.init);