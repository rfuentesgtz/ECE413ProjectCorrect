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
        var i = 0;
        var arr1 = [];
        var arr2 = [];
        var min = 1000;
        var o = 0;
        var p = 0;
        var max = 0;
        var total = 0;
        var average = 0;
        while(data[0].BPMData[i] != null){
            if(min>data[0].BPMData[i].bpmEntry){
                min = data[0].BPMData[i].bpmEntry;
                o = i;
            }
            else if(data[0].BPMData[i].bpmEntry>max){
                max = data[0].BPMData[i].bpmEntry;
                p = i;
            }
            total += data[0].BPMData[i].bpmEntry;
        arr1.push(data[0].BPMData[i].bpmEntry);
        arr2.push(data[0].BPMData[i].timeData);
        i++;
        }
        average = total / i;
        alert(min);
        alert(max);
        alert(average);
        $("#weekMin").html(min);
        $("#weekMax").html(max);
        $("#weekAvg").html(average);
        var k = 0;
        var color2 = [];
        while(k < i){
            if(i == o){
                color2.push('rgba(222,45,38,0.8)');
            }
            else if(i == p){
                color2.push('rgba(188,45,38,0.8)');
            }
            else{
                color2.push('rgba(204,204,204,1)');
            }
        }
        var trace1 = {
            x: arr2,
            y: arr1,
            marker:{
              color: color2
            },
            type: 'bar'
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Heart Rate'
          };
          
          Plotly.newPlot('myDiv', data, layout);

          var i = 0;
          var arr1 = [];
          var arr2 = [];
          var min = 1000;
          var o = 0;
          var p = 0;
          var max = 0;
          var total = 0;
          var average = 0;
          while(data[0].BPMData[i] != null){
              if(min>data[0].BPMData[i].oxEntry){
                  min = data[0].BPMData[i].oxEntry;
                  o = i;
              }
              else if(data[0].BPMData[i].oxEntry>max){
                  max = data[0].BPMData[i].oxEntry;
                  p = i;
              }
              total += data[0].BPMData[i].oxEntry;
          arr1.push(data[0].BPMData[i].oxEntry);
          arr2.push(data[0].BPMData[i].timeData);
          i++;
          }
          average = total / i;
          var k = 0;
          var color2 = [];
          while(k < i){
              if(i == o){
                  color2.push('rgba(222,45,38,0.8)');
              }
              else if(i == p){
                  color2.push('rgba(188,45,38,0.8)');
              }
              else{
                  color2.push('rgba(204,204,204,1)');
              }
          }
          alert(min);
        alert(max);
        alert(average);
        //   var trace1 = {
        //       x: arr2,
        //       y: arr1,
        //       marker:{
        //         color: color2
        //       },
        //       type: 'bar'
        //     };
            
        //     var data = [trace1];
            
        //     var layout = {
        //       title: 'Heart Rate'
        //     };
            
        //     Plotly.newPlot('myDiv2', data, layout);
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