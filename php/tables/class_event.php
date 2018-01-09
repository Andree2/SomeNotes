<?php
class Event extends Table
{
    public function GetColumnDate()
    {
        return 'FROM_DATE';
    }
    
    public function GetColumnDisplayText()
    {
        return 'TITLE';
    }
    
    public function GetName()
    {
        return 'event';
    }
    
    public function GetID()
    {
        return 1;
    }
    
    public function GetPostDataSQLFormat($value, $column, $tableGlobals)
    {
        if (   $column == 'FROM_MINUS' 
            || $column == 'TO_PLUS'
            || $column == 'IMPORTANCE') {
            if ($value == '') {
                return 'NULL';
            }
            else {
                return $value;
            }
        }
        elseif ($column == 'FROM_TIME' || $column == 'TO_TIME') {
            $value = $value.':00';
        }
        
        return '\''.addslashes($value).'\'';
    }
    
    public function GetTableName()
    {
        return 'lifelog_events';
    }
    
    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,importance,category,title,text,from_date,from_time,from_minus,to_date,to_time,to_plus FROM ". $this->GetTableName() ." WHERE id = $id";
    }
    
    public function EchoXMLRow($row)
    {
        echo '<row id="'. $row['id'] .'" table="'. $this->GetName() .'" created="'. $row['created'] .'" last_changed="'. $row['last_changed'] .'" from_date="'. $row['from_date'] .'" from_time="'. $row['from_time'] .'" from_minus="'. $row['from_minus'] .'" to_date="'. $row['to_date'] .'" to_time="'. $row['to_time'] .'" to_plus="'. $row['to_plus'] .'" importance="'. $row['importance'] .'">';
        echo "  <title>". htmlspecialchars ($row['title'], ENT_QUOTES, "UTF-8") ."</title>";
        echo "  <text>". htmlspecialchars ($row['text'], ENT_QUOTES, "UTF-8") ."</text>";
        echo "  <category>". htmlspecialchars ($row['category'], ENT_QUOTES, "UTF-8") ."</category>";
        echo "</row>";
    }
}
?>