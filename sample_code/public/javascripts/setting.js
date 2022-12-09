window.addEventListener("DOMContentLoaded", main);

function main() {
    //put user email on page
    let emailName = document.getElementById("userEmail");
    emailName.innerText = sessionStorage.getItem("email");
    
    $(function() {
        let txdata = {
            user: sessionStorage.getItem("email")
        }
        $.ajax({
            url: '/customers/status',
            method: 'GET',
            headers: { 'x-auth' : window.localStorage.getItem("token") },
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            $('#currFreq').html(JSON.stringify(data, null, 2));
            $('#currStartHour').html(JSON.stringify(data, null, 2));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            window.location.replace("display.html");
        });
    });

    //change frequency
    function changefreq() {
        if ($('#freq').val() === "") {
            window.alert("Invalid frequency");
            return;
        }

        let txdata = {
            freq: $('#freq').val(),
            user: sessionStorage.getItem("email")
        };

        $.ajax({
            url: '/settings/changePassword',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            $('#rxData').html(JSON.stringify(data, null, 2));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        });
    }


    //change password
    function changepassword() {
        if ($('#old').val() === "") {
            window.alert("Invalid current password");
            return;
        }
        if ($('#new').val() === "") {
            window.alert("Invalid new password");
            return;
        }

        let txdata = {
            old: $('#old').val(),
            new: $('#new').val(),
            user: sessionStorage.getItem("email")
        };

        $.ajax({
            url: '/settings/changePassword',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            $('#rxData').html(JSON.stringify(data, null, 2));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        });
    }

    $(function () {
        $('#btnChangeP').click(changepassword);
    });
    $(function() {
        $('freqUpdate').click(changefreq);
    })
}