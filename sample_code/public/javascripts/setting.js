window.addEventListener("DOMContentLoaded", main);

function main() {

    //put user email on page
    let emailName = document.getElementById("userEmail");
    emailName.innerHTML = sessionStorage.getItem('email');

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
            new: $('#new').val()
        };

        $.ajax({
            url: '/customers/changePassword',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            localStorage.setItem("token", data.token);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#rxData').html(JSON.stringify(jqXHR, null, 2));
        });
    }

    $(function () {
        $('#btnChangeP').click(changepassword);
    });
}