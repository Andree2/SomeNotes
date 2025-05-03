<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

$table = $_GET['table'];
$id    = $_GET['id'];

$tableNameTemp = $TABLE[$table]->GetTableName();
$query         = $TABLE[$table]->GetQueryReadRow($id);
$result        = mysqli_query($DBLink, $query);

XMLHeader();

// ID is unique, there should only be one result.
$row = mysqli_fetch_assoc($result);
$TABLE[$table]->EchoXMLReadRow($row);

mysqli_close($DBLink);
