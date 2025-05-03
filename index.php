<?php
    require_once 'php/functions.php';
    require_once 'php/constants.php';

    $timeStamp = time();
    if (! empty($_GET['date'])) {
        $timeStamp = $_GET['date'];
    }
    $date = date("Y-m-d", $timeStamp);
?>
<html>
    <link rel="stylesheet" href="css/my.css" type="text/css" >
    <link rel="stylesheet" href="css/mobile.css" type="text/css" >
    <link rel="stylesheet" href="css/colorSchemes.css" type="text/css" >
    <link rel="icon" href="images/favicon.ico" />
    <script type="text/JavaScript" src="3rdParty/sorttable.js"></script>
    <script type="text/JavaScript" src="3rdParty/jquery-3.3.1.js"></script>
    <script type="text/JavaScript" src="js/tables/class_day.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_event.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_note.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_person.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_place.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_tag.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/my.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_itemBarBase.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_itemBarAllItems.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_itemBarLinkedItems.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_indexView.js" charset="utf-8"></script>
    <head>
        <title>My</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body class="main">
        <script type="text/javascript">

            var Table = new Array();

            Table['day'] = new Day();
            Table['event'] = new Event();
            Table['note'] = new Note();
            Table['person'] = new Person();
            Table['place'] = new Place();
            Table['tag'] = new Tag();

            var View = new IndexView();
            var WeekLastId = 'WeekLast';

            var ItemBarLinks = new ItemBarLinkedItems('ItemBarLinks', 'divLinks', 0, false, View.ShowEdit);
            var ItemBarAll = new ItemBarAllItems('ItemBarAll', 'divSearch', -1, true, View.OnEnterKeySearch)

            if (document.body && document.body.offsetWidth) {
                window.onload =  function ()
                    {
                        View.Initialize();
                    };
            }
        </script>
        <div class="main noSpaces">
            <div style="grid-column: 1; grid-row: 1 / 2;">
                <input type="date" id="viewDate" name="viewDate" value='<?php echo $date; ?>'>
                <span><a class='button' onclick="ShowDate()" href='#' style='width:30%;'>-></a></span>
                <script type='text/Javascript'>
                    function ShowDate() {
                        var date = document.getElementById("viewDate").value;
                        View.LoadView(new Date(date));
                    }
                </script>
                <div>
                    <input id='minimumImportance' type='number' min='0' max='10' value='0' onchange='View.GlobalFilterChanged()'/>
                    <input id='showNotes' type='checkbox' checked='true' onchange='View.GlobalFilterChanged()'/>
                    <label for="showNotes">Notes</label>
                </div>
            </div>
            <div class="noSpaces monthBarTopFill" style="grid-column: 2; grid-row: 1;"></div>
            <div class="mainViewWeekDayHeader" style="grid-column: 3; grid-row: 1;">Mo</div>
            <div class="mainViewWeekDayHeader" style="grid-column: 4; grid-row: 1;">Di</div>
            <div class="mainViewWeekDayHeader" style="grid-column: 5; grid-row: 1;">Mi</div>
            <div class="mainViewWeekDayHeader" style="grid-column: 6; grid-row: 1;">Do</div>
            <div class="mainViewWeekDayHeader" style="grid-column: 7; grid-row: 1;">Fr</div>
            <div class="mainViewWeekDayHeader" style="grid-column: 8; grid-row: 1;">Sa</div>
            <div class="mainViewWeekDayHeader" style="grid-column: 9; grid-row: 1;">So</div>

            <div id="divSearch" class="itemBar" style="grid-column: 1; grid-row: 3;">
                ERROR: innerHTML of divSearch not set
            </div>
            <div id="divView" class="mainView" style="grid-column: 2 / 10; grid-row: 2 / 4;">
                ERROR: innerHTML of divView not set
            </div>

            <div class="editArea" id="editElement" >
                <div id="divLinks" class="itemBar linkBar"></div>
                <div id="editElementContent"></div>
            </div>
        </div>
    </body>
</html>
