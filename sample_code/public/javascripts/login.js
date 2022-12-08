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
    .done(function (data, textStatus, jqXHR) {
        sessionStorage.setItem("email", $('#email').val());
        localStorage.setItem("token", data.token);
        window.location.replace("account.html");
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        //$('#errorMsg').html(data);
        //$('#rxData').html(jqXHR.msg);
        $('#rxData').html(JSON.stringify(jqXHR, null, 2));
    });
}

$(function () {
    $('#btnLogIn').click(login);
});