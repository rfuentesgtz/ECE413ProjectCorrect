window.addEventListener("DOMContentLoaded", main);

function main() {
    //put user email on page
    let emailName = document.getElementById("userEmail");
    emailName.innerText = sessionStorage.getItem("email");
    
    //let freqVal = document.getElementById("currFreq");

    // let requestData = {email: sessionStorage.getItem("email")};
    // $.get("customer.js", requestData, function(data) {
    //     freqVal.innerText = data.passwordHash;
    // });

    // function updatevisual() {
    //     let txdata = {
    //         user: sessionStorage.getItem("email")
    //     }
    //     $.ajax({
    //         url: '/settings/updateVisual',
    //         method: 'GET',
    //         contentType: 'application/json',
    //         data: JSON.stringify(txdata),
    //         dataType: 'json'
    //     })
    //     .done(function (data, textStatus, jqXHR) {
    //         $('#rxData').html(JSON.stringify(data, null, 2));
    //     })
    //     .fail(function (jqXHR, textStatus, errorThrown) {
    //         $('#rxData').html(JSON.stringify(jqXHR, null, 2));
    //     });
    // }
    
        //freqVal.innerText = "hihihi";
    //put freq, start time, end time on page
    

    

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
}