<?php
	$DBServer="localhost";
	$DBUsername="admin";
	$DBPassword="";
	$DBDatabase="lifelog";
	$DBLink= mysqli_connect($DBServer, $DBUsername, $DBPassword);

	if (mysqli_connect_errno()) {
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	if (!mysqli_set_charset($DBLink, 'utf8')) {
		printf("Error setting charset to utf8: %s\n", mysqli_error($DBLink));
		exit();
	}

	@mysqli_select_db($DBLink, $DBDatabase) or die( "Unable to select database");
?>
