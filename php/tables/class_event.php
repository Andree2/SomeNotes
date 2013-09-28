<?php
class Event extends Table
{
	
	/**
	 * @brief Returns the names of all columns except <id> and <last_changed>.
	 */
	public function GetColumns()
	{
		return array('TITLE', 'TEXT', 'FROM_DATE', 'FROM_TIME', 'FROM_MINUS', 'TO_DATE', 'TO_TIME', 'TO_PLUS', 'IMPORTANCE', 'CATEGORY');
	}
	
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
		    || $column == 'IMPORTANCE'
		    || $column == 'CATEGORY') {
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
	
	// ---------------------------------------- SQL Queries ----------------------------------------
	
	public function GetQueryReadView($dateStartSQL, $dateEndSQL)
	{
		// TODO: Where from_date between OR end_date between, return end_date as well
		return "SELECT id,from_date,title,importance,category,to_date,to_time FROM ". $this->GetTableName() ." WHERE from_date BETWEEN ". $dateStartSQL. " AND ". $dateEndSQL;
	}
	// ---------------------------------------- Other ----------------------------------------
	public function EchoXMLRow($row)
	{
		echo "<title>". htmlspecialchars ($row[2], ENT_QUOTES, "UTF-8") ."</title>";
		echo "<text>". htmlspecialchars ($row[3], ENT_QUOTES, "UTF-8") ."</text>";
		echo "<from_date>" . $row[4] . "</from_date>";
		echo "<from_time>" . $row[5] . "</from_time>";
		echo "<from_minus>" . $row[6] . "</from_minus>";
		echo "<to_date>" . $row[7] . "</to_date>";
		echo "<to_time>" . $row[8] . "</to_time>";
		echo "<to_plus>" . $row[9] . "</to_plus>";
		echo "<importance>" . $row[10] . "</importance>";
		echo "<category>" . $row[11] . "</category>";
	}
}	
?>