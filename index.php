<?php
require_once('php/functions.php');
require_once('php/constants.php');

$timeStamp = time();
if (!empty($_GET['date'])) {
    $timeStamp = $_GET['date'];
}
$date = date("d.m.Y", $timeStamp);
?>
<html>
    <link rel="stylesheet" href="css/my.css" type="text/css" >
    <link rel="stylesheet" href="css/colorSchemes.css" type="text/css" >
    <link rel="stylesheet" href="css/jacs.css" type="text/css" >
    <link rel="icon" href="images/favicon.ico" />
    <script type="text/JavaScript" src="js/tables/class_day.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_event.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_note.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_person.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_place.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/tables/class_tag.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/my.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/jacs.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/sorttable.js"></script>
    <script type="text/JavaScript" src="js/class_itemBarBase.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_itemBar.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_itemBarLinkedItems.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/class_mainView.js" charset="utf-8"></script>
    <script type="text/JavaScript" src="js/var_mainView.js" charset="utf-8"></script>
    <head>
        <title>My</title>
        <script type="text/javascript">

            function Load ()
            {
                var divView = document.getElementById('divView');

                // Add mouse wheel event, according to the events supported by the browser.
                if(window.addEventListener) {
                    if (My.IsEventSupported('mousewheel')) {
                        divView.addEventListener('mousewheel', View.OnEventMouseScroll, false);
                    }
                    else {
                        divView.addEventListener('DOMMouseScroll', View.OnEventMouseScroll, false);
                    }
                }
                else {
                    divView.onmousewheel = View.OnEventMouseScroll;
                }
                window.oncontextmenu = View.OnEventContextMenu;
                View.LoadView(new Date());
                View.LoadSearch();
            }
        </script>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" /> 
    </head>
    <body class="main">
        <script type="text/javascript">
            /* Ueberwachung von Internet Explorer initialisieren */
            if (document.body && document.body.offsetWidth) {
                window.onload = Load;
            }
        </script>
        <table class="main noSpaces">
            <tr style="height: 0px; visibility: collapse"> 
                <td class='links'></td>
                <td class='months'></td>
                <td style="width: 100%;"></td>
            </tr>
            <tr style="height: 0px; visibility: collapse" id="editElement" >
                <td>
                    <div id="divLinks" class="itemBar">
                    </div>
                </td>
                <td id="editElementContent" colspan='2'>
                </td>
            </tr>
            <tr style="height: 70%">
                <td>
                    <table class="navigation noSpaces">
                        <tr>
                            <td width="100%">
                                <input id="viewDate" type='hidden' value='<?php echo $date; ?>'/>
                                <script type='text/Javascript'>
                                    function ShowDate(page)
                                    {// Run this when the calendar closes
                                        View.LoadView(document.getElementById(ShowDate.JACSid).outputDate);
                                    };
                                    JACS.show(document.getElementById('viewDate'));
                                    JACS.next(ShowDate,'index.php');
                                </script>
                            </td>
                        </tr>
                        <tr height="100%">
                            <td width="100%">
                                <div id="divSearch" class="itemBar" style="width: 100%;">
                                        ERROR: innerHTML of divSearch not set
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
                <td>
                    <div id="divMonthBar" class="monthBar">
                        ERROR: innerHTML of divMonthBar not set
                    </div>
                </td>
                <td>
                    <div id="divView" class="mainView">
                        ERROR: innerHTML of divView not set	
                    </div>
                </td>
            </tr>
        </table>
    </body>
</html>
