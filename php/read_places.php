<?php
require_once('constants.php');
require_once('db.php');

XMLHeader();
echo '<row>';

// Read Places
$query = "SELECT id,title,importance,category,latitude,longitude FROM ". $TABLE[PLACE]->GetTableName();
$result = mysqli_query($DBLink, $query);
while($row = mysqli_fetch_assoc($result)) {
    echo '<place category="'. htmlspecialchars($row['category'], ENT_QUOTES, "UTF-8") .'" id="'. $row['id'] .'" importance="'. $row['importance'] .'" latitude="'. $row['latitude'] .'" longitude="'. $row['longitude'] .'" title="'. htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") .'"/>';
}

echo '</row>';
mysqli_close($DBLink);
?> 