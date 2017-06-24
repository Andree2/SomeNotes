<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');

$table = $_GET['table'];
$id = $_GET['id'];

$tableNameTemp = $TABLE[$table]->GetTableName();
$query =  $TABLE[$table]->GetQueryReadRow($id);
$result = mysql_query($query);

XMLHeader();

// ID is unique, there should only be one result.
$row = mysql_fetch_assoc($result);
$TABLE[$table]->EchoXMLRow($row);

mysql_close();
?> 