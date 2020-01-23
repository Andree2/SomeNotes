function MapView()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function DownloadUrl(url, callback)
    {
        url = url + "?sid=" + Math.random();
        var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

        request.onreadystatechange = function()
        {
            if (request.readyState == 4)
            {
                request.onreadystatechange = doNothing;
                callback(request, request.status);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    }

    function doNothing() { }

    function LoadLinksAndSetSelectedElement(table, id)
    {
        ItemBarLinks.LoadLinks(table, id, function(responseXML)
        {
            $('#selectedElement').html(responseXML.firstChild.getAttribute('text'));
        });
    }

    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================

    this.OnMouseUpBox = function(event, table, id)
    {
        LoadLinksAndSetSelectedElement(table, id);
    };

    this.InitMap = function()
    {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(53.073666, 8.796378),
            zoom: 12,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "color": "#b0b0b0"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#b0b0b0"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#b0b0b0"
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

        DownloadUrl('php/read_places.php', function(data)
        {
            var xml = data.responseXML;
            var places = xml.documentElement.getElementsByTagName('place');
            Array.prototype.forEach.call(places, function(place)
            {
                var id = place.getAttribute('id')
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
                marker.addListener('click', function()
                {
                    infoWindow.setContent(infowincontent);
                    infoWindow.open(map, marker);
                    LoadLinksAndSetSelectedElement('place', id);
                });
            });
        });
    }
};