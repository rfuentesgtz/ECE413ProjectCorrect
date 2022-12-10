// public/javasciprts/signup.js

function signup() {
    //when login button is clicked check if there are inputs, then save the values in txdata
    if ($('#email').val() === "") {
        window.alert("invalid email!");
        return;
    }
    if ($('#password').val() === "") {
        window.alert("invalid password");
        return;
    }
    let txdata = {
        email: $('#email').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: '/customers/signUp',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        if (data.success) {
            //save email and token in storage 
            //after 1 second, move to "login.html"
            setTimeout(function(){
                sessionStorage.setItem("email", $('#email').val());
                localStorage.setItem("token", data.token);
                window.location = "account.html";
            }, 1000);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 404) {
            $('#errorMsg').html("Server could not be reached!!!");    //server error
        }
        else $('#errorMsg').html(jqXHR.responseJSON.msg); //other error
    });
}



$(function () {
    $('#btnSignUp').click(signup);
});