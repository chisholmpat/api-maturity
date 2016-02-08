(function() {
    // Provides access to the end point which produces all values required to
    // geneate the score to be provided on the front end.
    var module = angular.module('resultsServiceModule', ['ngResource']);

    module.service('ResultStore', ['$http', '$resource', function($http, $resource) {
        this.scoreConn = $resource('/score/:client_id/:form_id/:assessment_id');
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
                      fillColor: "rgba(220,220,220,0.2)",
                      strokeColor: "rgba(220,220,220,1)",
                      pointColor: "rgba(220,220,220,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(220,220,220,1)",
                      data: qaGraphData
                  },
                  {
                      label: "SA-Graph",
                      fillColor: "rgba(151,187,205,0.2)",
                      strokeColor: "rgba(151,187,205,1)",
                      pointColor: "rgba(151,187,205,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(151,187,205,1)",
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
            // google.visualization.events.addListener(chart, 'ready', convertToCanvas);
            chart.draw(data, options);
       }
    }]);

    module.service('FileFormatsConversionStore', ['$http', '$resource', function($http, $resource) {

      this.convertToPDF = function(){
        html2canvas(document.getElementById('exportthis'), {
  //         var docDefinition = {
  // content: [
  //   {
  //     // you'll most often use dataURI images on the browser side
  //     // if no width/height/fit is provided, the original size will be used
  //     image: 'data:image/jpeg;base64,...encodedContent...'
  //   },
        onrendered: function (canvas) {
              var data = canvas.toDataURL();
              var docDefinition = {
                  content: [{
                      image: data,
                      width: 500
                  }]
              };

              pdfMake.createPdf(docDefinition).download("Result_Details.pdf");
          }
        });
      };

      this.convertToDOCX = function(){
          //convert from canvas to png to allow word to display images
          // var canvasTags = document.getElementsByTagName('canvas');
    			// var max_val = canvasTags.length;
    			// for (var i=0; i<max_val; i++) {
    			// 	var canvas = canvasTags[0];
          //   var img    = canvas.toDataURL("image/png");
          //   var oImg=document.createElement("img");
          //   // <xml><image>AAECAwQFBgcICQ==</image></xml>
          //
          //   oImg.setAttribute('src', img);
    			// 	// canvas.parentNode.insertBefore(canvas, oImg);
          //   canvas.parentNode.appendChild(oImg);
    			// 	canvas.parentNode.removeChild(canvas);
    			// }
          // //full set of html tags to be displayed in browser
          var htmlString = document.getElementById('exportthis').innerHTML;

          //WORD will only know to render this as a HTML document and not plain text
          //if the html, head and body tags are included
          var htmlOutput = "<html><head></head><body>"+htmlString+"</body></html>";

          var element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(htmlOutput));
          element.setAttribute('download', "results.doc");

          element.style.display = 'none';
          document.body.appendChild(element);

          element.click();
      };
    }]);
})();
