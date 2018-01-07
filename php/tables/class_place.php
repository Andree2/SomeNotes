<?php
class Place extends Table
{
    public function GetColumnDisplayText()
    {
        return 'TITLE';
    }
    
    public function GetName()
    {
        return 'place';
    }
    
    public function GetID()
    {
        return 8;
    }
    
    public function GetPostDataSQLFormat($value, $column, $tableGlobals)
    {
        if (   $column == 'IMPORTANCE'
            || $column == 'CATEGORY'
            || $column == 'LATITUDE'
            || $column == 'LONGITUDE') {
            if ($value == '') {
                return 'NULL';
            }
            else {
                return $value;
            }
        }
        return '\''.addslashes($value).'\'';
    }
    
    public function GetTableName()
    {
        return 'lifelog_places';
    }
    
    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,importance,category,title,address,latitude,longitude FROM ". $this->GetTableName() ." WHERE id = $id";
    }
    
    public function EchoXMLRow($row)
    {
        echo '<row id="'. $row['id'] .'" table="'. $this->GetName() .'" created="'. $row['created'] .'" last_changed="'. $row['last_changed'] .'" importance="'. $row['importance'] .'" category="'. $row['category'] .'" latitude="'. $row['latitude'] .'" longitude="'. $row['longitude'] .'">';
        echo "<title>". htmlspecialchars ($row['title'], ENT_QUOTES, "UTF-8") ."</title>";
        echo "<address>" . htmlspecialchars($row['address'], ENT_QUOTES, "UTF-8") . "</address>";
        echo "</row>";
    }
}
?>