// public/javasciprts/account.js

$(function (){
    $('#btnLogOut').click(logout); //when user clicks logout button they will be loged out

    $.ajax({
        url: '/customers/status',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {

    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});

//when logging out, remove token and email from storage then reload the page back to main
function logout() { 
    localStorage.removeItem("token");
    sessionStorage.removeItem("email");
    window.location.replace("index.html");
}
