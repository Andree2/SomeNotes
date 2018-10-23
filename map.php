<?php
require_once 'passes.php';
?>
<html>
  <link rel="icon" href="images/favicon.ico" />
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
    <title>Map</title>
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>

  <body>
    <div id="map"></div>

    <script>
      var customLabel = {
        restaurant: {
          label: 'R'
        },
        bar: {
          label: 'B'
        }
      };

        function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: new google.maps.LatLng(53.073666, 8.796378),
          zoom: 12,
          styles: [
            {
              "featureType": "poi",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }
          ]
        });
        var infoWindow = new google.maps.InfoWindow;

          // Change this depending on the name of your PHP or XML file
          downloadUrl('php/read_places.php', function(data) {
            var xml = data.responseXML;
            var places = xml.documentElement.getElementsByTagName('place');
            Array.prototype.forEach.call(places, function(place) {
              var title = place.getAttribute('title')
              //var address = My.NodeValuesToString(place.getElementsByTagName("address")[0].childNodes);
              var category = place.getAttribute('category');
              var latitude = place.getAttribute('latitude');
              var longitude = place.getAttribute('longitude');
              var point = new google.maps.LatLng(
                latitude,
                longitude);

              var infowincontent = document.createElement('div');
              var strong = document.createElement('strong');
              strong.textContent = title
              infowincontent.appendChild(strong);
              infowincontent.appendChild(document.createElement('br'));

              //var text = document.createElement('text');
              //text.textContent = address
              //infowincontent.appendChild(text);

              var marker = new google.maps.Marker({
                icon: 'images/' + category + '.png',
                map: map,
                position: point
              });
              marker.addListener('click', function() {
                infoWindow.setContent(infowincontent);
                infoWindow.open(map, marker);
              });
            });
          });
        }



      function downloadUrl(url, callback) {
        url = url + "?sid=" + Math.random();
        var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

        request.onreadystatechange = function() {
          if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
          }
        };

        request.open('GET', url, true);
        request.send(null);
      }

      function doNothing() {}
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=<?php echo $GoogleAPIKey; ?>&callback=initMap">
    </script>
  </body>
</html>