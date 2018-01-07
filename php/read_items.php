<?php
require_once('constants.php');
require_once('db.php');

XMLHeader();
echo '<row>';


// Read Persons
$query = "SELECT id,display_name,importance,category FROM ". $TABLE['person']->GetTableName() ." ORDER BY importance DESC";
$result = mysqli_query($DBLink, $query);
while($row = mysqli_fetch_assoc($result)) {
    echo '<item category="'. $row['category'] .'" date="" id="'. $row['id'] .'" importance="'. $row['importance'] .'" table="person" text="'. htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") .'"/>';
}

// Read Places
$query = "SELECT id,title,importance,category FROM ". $TABLE[PLACE]->GetTableName() ." ORDER BY importance DESC";
$result = mysqli_query($DBLink, $query);
while($row = mysqli_fetch_assoc($result)) {
    echo '<item category="'. $row['category'] .'" date="" id="'. $row['id'] .'" importance="'. $row['importance'] .'" table="place" text="'. htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") .'"/>';
}

// Read Tags
$query = "SELECT id,title,importance,category FROM ". $TABLE['tag']->GetTableName() ." ORDER BY importance DESC";
$result = mysqli_query($DBLink, $query);
while($row = mysqli_fetch_assoc($result)) {
    echo '<item category="'.$row['category'].'" date="" id="'. $row['id'] .'" importance="'. $row['importance'].'" table="tag" text="'. htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") .'"/>';
}

// Read Events
$query = "SELECT id,title,from_date,to_date,to_time,importance,category FROM ". $TABLE[EVENT]->GetTableName() ." ORDER BY from_date DESC";
$result = mysqli_query($DBLink, $query);
while($row = mysqli_fetch_assoc($result)) {
    echo '<item category="'. $row['category'] .'" date="'. $row['from_date'] .'" id="'. $row['id'] .'" importance="'. $row['importance'] .'" table="event" text="'. htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") .'"/>';
}

// Read Notes
$query = "SELECT id,date,title,importance,category FROM ". $TABLE[NOTE]->GetTableName() ." ORDER BY date DESC";
$result = mysqli_query($DBLink, $query);
while($row = mysqli_fetch_assoc($result)) {
    echo '<item category="'. $row['category'] .'" date="'. $row['date'] .'" id="'. $row['id'] .'" importance="'. $row['importance'] .'" table="note" text="'. htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") .'"/>';
}

echo '</row>';
mysqli_close($DBLink);
?> 
