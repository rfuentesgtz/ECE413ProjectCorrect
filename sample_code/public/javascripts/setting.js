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
            let startStr = data[0].startHour + ":" + data[0].startMinute;
            let endStr = data[0].endHour + ":" + data[0].endMinute;
            $('#currFreq').html(data[0].measurementFrequency);
            $('#currStart').html(startStr);
            $('#currEnd').html(endStr);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            window.location.replace("display.html");
        });
    });

    //change frequency
    function changefreq() {
        if ($('#freq').val() === "") {
            window.alert("Invalid frequency input");
            return;
        }

        let txdata = {
            freq: $('#freq').val(),
            user: sessionStorage.getItem("email")
        };

        $.ajax({
            url: '/settings/changeFreq',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            $('#currFreq').html(data[0].measurementFrequency);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        });
    }

    //changing start time
    function changestart() {
        if ($('#startHour').val() === "") {
            window.alert("Invalid start hour input");
            return;
        }
        if ($('#startMin').val() === "") {
            window.alert("Invalid start minuite input");
            return;
        }

        let txdata = {
            sHour: $('#startHour').val(),
            sMin: $('#startMin').val(),
            user: sessionStorage.getItem("email")
        };

        $.ajax({
            url: '/settings/changeStart',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            let startStr = data[0].startHour + ":" + data[0].startMinute;
            $('#currStart').html(startStr);
            window.location.replace("setting.html");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        });
    }

    //changing end time


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
        $('#freqUpdate').click(changefreq);
    });
    $(function() {
        $('#startUpdate').click(changestart);
    })
}