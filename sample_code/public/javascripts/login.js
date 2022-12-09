// public/javasciprts/login.js
function login() {
    let txdata = {
        email: $('#email').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: '/customers/logIn',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {      //when user has entered a valid email and password, their email will be stored and they will be given a token
        sessionStorage.setItem("email", $('#email').val());
        localStorage.setItem("token", data.token);
        window.location.replace("account.html");
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        $('#errorMsg').html(jqXHR.responseJSON.error);           //display error message when they enter the wrong email or username
        //$('#rxData').html(JSON.stringify(jqXHR, null, 2));
    });
}

$(function () {
    $('#btnLogIn').click(login);
});