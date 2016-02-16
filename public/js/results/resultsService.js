(function() {
    // Provides access to the end point which produces all values required to
    // geneate the score to be provided on the front end.
    var module = angular.module('resultsServiceModule', ['ngResource']);

    module.service('ResultStore', ['$http', '$resource', function($http, $resource) {
        this.scoreConn = $resource('/score/:client_id/:form_id/:assessment_id');
        this.assessmentDetailsConn = $resource('/assmentdetails/:assessment_id');
    }]);

    module.service('GraphScoresDataStore', ['$http', '$resource', function($http, $resource, valueWeightsArray) {

        function calculateAllScores(response_value, question_weight) {

            if ((response_value == 1 || response_value == 2) && (question_weight == 1 || question_weight == 2)) {
                return response_value - 1;
            } else {
                return response_value;
            }
        }

        this.getGraphScores = function(valueWeightsArray){

          var score;
          var categories = {
              QA: 1,
              SA: 2
          };
          var scoresArray={};
          var categoryID;
          var formName;

          //Calculate Scores
          for (var i = 0; i < valueWeightsArray.length; i++) {
              categoryID = valueWeightsArray[i].category_id;
              formName = valueWeightsArray[i].name;

              if(!scoresArray[categoryID]){
                scoresArray[categoryID] =  {};
              }
              if (!scoresArray[categoryID][formName]) { //making a hash-map, "gropuname": [array of numbers to be averaged]
                  scoresArray[categoryID][formName] = [];
              }
              (categoryID == categories.SA) ? (score=valueWeightsArray[i].value) : (score = calculateAllScores(valueWeightsArray[i].value, valueWeightsArray[i].weight));
              scoresArray[categoryID][formName].push(score);
              valueWeightsArray[i].score = score;
          }
          return scoresArray;
        };

        this.getAverageGraphScores = function(graphScoresArray){

            var total;
            var averages_array = {};
            var internalArrayLength = 0;

            for (var key in graphScoresArray) {
                total = 0;
                internalArrayLength = graphScoresArray[key].length;
                for (var j = 0; j < internalArrayLength; j++) {
                    total += graphScoresArray[key][j];
                }
                averages_array[key] = (total / (internalArrayLength));
            }
            return averages_array;
        };

        this.getMappedGraphScoresScores = function(averages_array){

          var graphInputsArray = {};

          for (var key in averages_array) {
              if (averages_array[key] < 1.1) {
                  graphInputsArray[key] = 0;
              } else if (averages_array[key] > 1 && averages_array[key] < 2.5) {
                  graphInputsArray[key] = 1;
              } else {
                  graphInputsArray[key] = 2;
              }
          }
          return graphInputsArray;
        };


    }]);


    module.service('GraphingFunctionsStore', ['$http', '$resource', function($http, $resource, qaGraphData, saGraphData, keyArray) {
        this.makeRadarGraph = function(qaGraphData, saGraphData, keyArray){

          var showGraphId;
          var canvasName = "radarGraph";
          var canvas = document.getElementById(canvasName);

          var graphData = {
              labels: keyArray,
              datasets: [
                  {
                      label: "QA-Graph",
                      fillColor: "rgba(0,255,255,0.2)",
                      strokeColor: "rgba(0,255,255,1)",
                      pointColor: "rgba(0,255,255,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(0,255,255,1)",
                      data: qaGraphData
                  },
                  {
                      label: "SA-Graph",
                      fillColor: "rgba(0,0,0,0.2)",
                      strokeColor: "rgba(0,0,0,1)",
                      pointColor: "rgba(0,0,0,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(0,0,0,1)",
                      data: saGraphData
                  }
              ]
          };

          var myRadarChart = new Chart(document.getElementById(canvasName).getContext("2d")).Radar(graphData);
          document.getElementById("legendDiv").innerHTML = myRadarChart.generateLegend();
          return;
        };

        this.makeGaugeGraphs = function(QAGraphData, SAGraphData){

          var qaMaxVal = 4;
          var saMaxVal = 2;

          makeGaugeGraphs(QAGraphData, "QAgaugeGraph", qaMaxVal) ;
          makeGaugeGraphs(SAGraphData, "SAgaugeGraph", saMaxVal) ;
        };

        function convertToCanvas(){
          angular.element(document).ready(function(){
              canvg();
          });
        }

        function makeGaugeGraphs(graph_array, showGraph, max_val) {

            var graphData = [];
            var showGraphId;

            graphData.push(['Label', 'Value']);
            for (var key in graph_array) {
                graphData.push([key, (graph_array[key] / max_val) * 100]); //converting the value to a percentage
            }

            var data = google.visualization.arrayToDataTable(graphData);

            var options = {
                width: 400,
                height: 120,
                redFrom: 90,
                redTo: 100,
                yellowFrom: 75,
                yellowTo: 90,
                minorTicks: 5
            };

            var chart = new google.visualization.Gauge(document.getElementById(showGraph));
            google.visualization.events.addListener(chart, 'ready', convertToCanvas);
            chart.draw(data, options);
       }
    }]);

    module.service('FileFormatsConversionStore', ['$http', '$resource', function($http, $resource) {



      this.convertToPDF = function(){

        var noteClass = "form-control";
        var notes = document.getElementsByClassName(noteClass);

        //show the note if there is content
        for(var i=0; i<notes.length; i++){
          //showing the note
          if(notes[i].defaultValue != "")
              notes[i].parentNode.className = notes[i].parentNode.className.replace('ng-hide','ng-show');
        }

        html2canvas(document.getElementById('exportthis'), {
        onrendered: function (canvas) {
              var data = canvas.toDataURL();
              var scalingFactor = 1.1;
              var docDefinition = {
                  // a string or { width: number, height: number }
                  pageSize: {width: (canvas.width)*scalingFactor, height: (canvas.height)*scalingFactor},
                  content: [{
                      image: data
                  }]
              };

              pdfMake.createPdf(docDefinition).download("Result_Details.pdf");
              //show the note if there is content
              for(var i=0; i<notes.length; i++){
                //hide all notes
                notes[i].parentNode.className = notes[i].parentNode.className.replace('ng-show','ng-hide');
              }
          }
        });
      };

      this.convertToDOCX = function($http){

          createWordDocument = function(){
              // //full set of html tags to be displayed in browser
              var htmlString = document.getElementById('exportthis').innerHTML;

              //WORD will only know to render this as a HTML document and not plain text
              //if the html, head and body tags are included
              var htmlOutput = '<html xmlns:v="urn:schemas-microsoft-com:vml"\
                                xmlns:o="urn:schemas-microsoft-com:office:office"\
                                xmlns:w="urn:schemas-microsoft-com:office:word"\
                                xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\
                                xmlns="http://www.w3.org/TR/REC-html40">\
                                <head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><title></title>\
                                  <style>\
                                    v\:* {behavior:url(#default#VML);}\
                                    o\:* {behavior:url(#default#VML);}\
                                    w\:* {behavior:url(#default#VML);}\
                                    .shape {behavior:url(#default#VML);}\
                                  </style>\
                                  <xml>\
                                    <w:WordDocument>\
                                    <w:View>Print</w:View>\
                                    <w:Zoom>150</w:Zoom>\
                                    <w:DoNotOptimizeForBrowser/>\
                                    </w:WordDocument>\
                                  </xml>\
                                </head><body>'+htmlString+"</body></html>";

              var element = document.createElement('a');
              element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(htmlOutput));
              element.setAttribute('download', "results.doc");

              element.style.display = 'none';
              document.body.appendChild(element);
              element.click();
          }

          sendCanvasToIMGUR = function($http, canvas){

              try
              {
                var img = canvas.toDataURL(
                      'image/png', 0.9).split(',')[1].replace(/^data:image\/(jpg|png);base64,/, "");
              }
              catch (e)
              {
                  var img = canvas.toDataURL()
                      .split(',')[1];
              }
              var req = {
                   method: 'POST',
                   url: 'https://api.imgur.com/3/image',
                   headers:
                   {
                       Authorization: 'Client-ID 1f95eb94c1011e9'
                   },
                   data:
                   {
                       image: img
                   }
              }
              $http(req).then(function successCallback(response) {
                 if (response)
                 {
                      var src = response.data.data.link ;
                      var oImg=document.createElement("img");
                      var max_pixel_count = 1000;
                      // <image type="image/png">
                      oImg.setAttribute('src', src);
                      oImg.height = (canvas.height);
                      oImg.width = (canvas.width);
                      if(oImg.height>max_pixel_count || oImg.width>max_pixel_count){
                        oImg.height = (canvas.height)/2;
                        oImg.width = (canvas.width)/2;
                      }

                      canvas.parentNode.appendChild(oImg);
              				canvas.parentNode.removeChild(canvas);

                      //all canvas to image conversions done, generate WORD document
                      if(document.getElementsByTagName('canvas').length == 0){
                        createWordDocument();
                      }
                      return;
                 }
               }, function errorCallback(response) {
                      return;
              });

          };


          // convert from canvas to png to allow word to display images
          var canvasTags = document.getElementsByTagName('canvas');
    			var max_val = canvasTags.length;

          //no canvas exist, conversion is not needed
          if(max_val == 0){
            createWordDocument();
            return;
          }

    			for (var i=0; i<max_val; i++) {
    				var canvas = canvasTags[i];
            sendCanvasToIMGUR($http, canvas);
    			}
      };
    }]);
})();
