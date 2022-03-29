<?php
require_once 'passes.php';
?>
<html>
    <link rel="stylesheet" href="css/my.css" type="text/css" >
    <link rel="stylesheet" href="css/mobile.css" type="text/css" >
    <link rel="stylesheet" href="css/colorSchemes.css" type="text/css" >
    <link rel="icon" href="images/favicon.ico" />
    <script type="text/JavaScript" src="3rdParty/sorttable.js"></script>
    <script type="text/JavaScript" src="3rdParty/jquery-3.3.1.js"></script>
    <script type="text/JavaScript" src="js/my.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_itemBarBase.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_itemBarLinkedItems.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_mapView.js" charset="utf-8"></script>
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
        <div class="mapView" style="grid-column: 1 / 10; grid-row: 1;">
            <div >
                <div id="selectedElement">Please select an item</div>
                <div>
                    <input id='minimumImportance' type='number' min='0' max='10' value='0' onchange='View.GlobalFilterChanged()'/>
                    <input id='showNotes' type='checkbox' checked='true' onchange='View.GlobalFilterChanged()'/>
                    <label for="showNotes">Notes</label>
                </div>
                <div id="divLinks" class="itemBar"></div>
            </div>
            <div id="map"></div>
        </div>
        <script type="text/javascript">

          var View = new MapView();
          var ItemBarLinks = new ItemBarLinkedItems('ItemBarLinks', 'divLinks', 0, 0, false, View.LoadLinksAndSetSelectedElement);

        </script>
        <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=<?php echo $GoogleAPIKey; ?>&callback=View.Initialize">
        </script>
    </body>
</html>