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
            console.log(data[0]);
            populateTable(data[0].devices);
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
            window.location.reload();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#errMsg').html(jqXHR.responseJSON.error);
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
            window.location.reload();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#errMsg').html(jqXHR.responseJSON.error);
        });
    }

    //change end time
    function changeend() {
        if ($('#endHour').val() === "") {
            window.alert("Invalid start hour input");
            return;
        }
        if ($('#endMin').val() === "") {
            window.alert("Invalid start minuite input");
            return;
        }

        let txdata = {
            eHour: $('#endHour').val(),
            eMin: $('#endMin').val(),
            user: sessionStorage.getItem("email")
        };

        $.ajax({
            url: '/settings/changeEnd',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            window.location.reload();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#errMsg').html(jqXHR.responseJSON.error);
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
            window.location.reload();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#PErrMsg').html(jqXHR.responseJSON.msg);
        });
    }

    //Register a new device
    function registerdevice() {
        if ($('#name').val() === "") {
            window.alert("Invalid device name");
            return;
        }
        if ($('#id').val() === "") {
            window.alert("Invalid new id");
            return;
        }

        let txdata = {
            newName: $('#name').val(),
            newID: $('#id').val(),
            user: sessionStorage.getItem("email")
        };

        $.ajax({
            url: '/settings/newDevice',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            //$('#rxData').html(JSON.stringify(data, null, 2));
            window.location.reload();
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
    $(function() {
        $('#endUpdate').click(changeend);
    })
    $(function() {
        $('#btnRegister').click(registerdevice);
    })
}

function populateTable(deviceArray) {
    let $tableBody = $('#deviceBody');
    let deviceNum = deviceArray.length;

    if(deviceNum === 0){
        console.log("No devices present");
    }

    else {
        console.log(deviceNum, "devices present");
        let deviceSet = 0;
        for(let i = 0; i < deviceNum; i++){
            let device = deviceArray[i];
            deviceSet++;
            let $tableRow = $("<tr></tr>").attr("id", "row" + deviceSet);
            let $nameColumn = $("<td>" + device.deviceName + "</td>").attr("id", "name" + deviceSet);
            let $idColumn = $("<td>" + device.deviceID + "</td>").attr("id", "id" + deviceSet);
            let $buttonColumn = $("<td></td>");


            const button = document.createElement("button");
            button.innerText = "Delete";
            button.id = 'button' + deviceSet;

            $buttonColumn.append(button);
            $tableRow.append($nameColumn);
            $tableRow.append($idColumn);
            $tableRow.append($buttonColumn);
            $tableBody.append($tableRow);
            
            //Add the AJAX request for that button
            button.addEventListener("click", function(){
                let txdata = {
                    deviceName: device.deviceName,
                    deviceID: device.deviceID,
                    user: sessionStorage.getItem("email")
                };
        
                $.ajax({
                    url: '/settings/deleteDevice',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(txdata),
                    dataType: 'json'
                })
                .done(function (data, textStatus, jqXHR) {
                    $('#rxData').html(JSON.stringify(data, null, 2));
                    window.location.reload();
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    $('#rxData').html(JSON.stringify(jqXHR, null, 2));
                });
            });
        }
    }
    console.log("Exit device");
    return
}