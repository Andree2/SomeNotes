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
	<script type="text/JavaScript" src="js/tables/class_event.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/tables/class_note.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/tables/class_person.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/tables/class_tag.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/class_slider.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/colorSchemes.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/my.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/jacs.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/sorttable.js"></script>
	<script type="text/JavaScript" src="js/class_itemBar.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/class_mainView.js" charset="utf-8"></script>
	<script type="text/JavaScript" src="js/var_mainView.js" charset="utf-8"></script>
	<head>
		<title>My</title>
		<script type="text/javascript">

			function Load ()
			{
				var divView = document.getElementById('divView');

				// Add mouse wheel event, according to the evetns supported by the browser.
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
				View.LoadToDo();
				View.LoadTags();
				View.LoadPersons();
			}
		</script>

		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	</head>
	<body class="main">
		<script type="text/javascript">
			/* Ueberwachung von Internet Explorer initialisieren */
			if (document.body && document.body.offsetWidth) {
				window.onload = Load;
			}
		</script>
		<table class="main noSpaces">
			<tr>
				<td class="navigation">
					<table class="navigation noSpaces">
						<tr>
							<td>
								<input id="viewDate" type='hidden' value='<?php echo $date; ?>'/>
								<script type='text/Javascript'>		
									function ShowDate(page)
									{// Run this when the calendar closes
										View.LoadView(document.getElementById(ShowDate.JACSid).outputDate);
									};
									JACS.show(document.getElementById('viewDate'));
									JACS.next(ShowDate,'index.php');
								</script>
								<div id='divStatusBar'></div>
								<br/>
							</td>
						</tr>
						<tr style="height: 100%;">
							<td style="vertical-align: top;">
								<div id="divToDo" class="itemBar">
									<div id="divToDoContent">
										ERROR: innerHTML of divToDoContent not set
									</div>
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
				<td>
					<div id="divPersons" class="itemBar" style="height: 100%; width: 140px;">
						<a class="button" style="width:50%" href="#" onclick="return View.SetShowPersonsTagged(true)">Tagged</a>
						<a class="button" style="width:50%" href="#" onclick="return View.SetShowPersonsTagged(false)">All</a>
						<br/>
						<br/>
						<div id="divPersonsContent">
							ERROR: innerHTML of divPersonsContent not set
						</div>
					</div>
				</td>
				<td>
					<div id="divTags" class="itemBar" style="height: 100%; width: 100px;">
						<div id="divTagsContent">
							ERROR: innerHTML of divTagsContent not set
						</div>
					</div>
				</td>
			</tr>
		</table>
		<div id="divEdit" style="visibility: hidden; position: absolute; left: 330px; top: 5%; z-index: 1000;">
			<div id="divEditContent">
				ERROR: innerHTML of divEditContent not set
			</div>
		</div>
		<div id="divLinks" class="itemBar" style="visibility: hidden; position: absolute; left: 10px; top: 5%; z-index: 1001; width: 320px;">
			<div id="divLinksContent">
				ERROR: innerHTML of divLinksContent not set
			</div>
		</div>
	</body>
</html>
