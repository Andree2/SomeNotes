<?php
require_once '../passes.php';

$DBLink = mysqli_connect($DBServer, $DBUsername, $DBPassword, $DBDatabase);

if (mysqli_connect_errno()) {
    $error = mysqli_connect_error();
    exit("Failed to connect to MySQL: " . $error);
}
if (! mysqli_set_charset($DBLink, 'utf8')) {
    exit("Error setting charset to utf8: " . mysqli_error($DBLink));
}

@mysqli_select_db($DBLink, $DBDatabase) or die("Unable to select database");
