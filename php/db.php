<?php
$DBServer="localhost";
$DBUsername="root";
$DBPassword="";
$DBDatabase="lifelog";
$DBLink= mysql_connect($DBServer, $DBUsername, $DBPassword);
mysql_set_charset('utf8', $DBLink);
@mysql_select_db($DBDatabase) or die( "Unable to select database");
?>