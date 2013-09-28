<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');

$table = $_GET['table'];
$id = $_GET['id'];

$tableNameTemp = $TABLE[$table]->GetTableName();
$query = "SELECT * FROM $tableNameTemp WHERE id = $id";
$result = mysql_query($query);

XMLHeader();
echo '<row>';
echo '<item>';
echo '<id>'. $id .'</id><table>'. $table .'</table>';

while($row = mysql_fetch_row($result)){
	echo "<last_changed>". $row[1] ."</last_changed>";
	$TABLE[$table]->EchoXMLRow($row);
}
echo '</item>';
echo '</row>';
mysql_close();
?> 