<?php
class Person extends Table
{
	
	// ---------------------------------------- Getter ----------------------------------------
	/**
	 * @brief Returns the names of all columns except <id> and <last_changed>.
	 */
	public function GetColumns()
	{
		return array('DISPLAY_NAME', 'FIRST_NAME', 'MIDDLE_NAME', 'LAST_NAME', 'BIRTHDAY_DAY', 'BIRTHDAY_MONTH', 'BIRTHDAY_YEAR', 'TEXT', 'IMPORTANCE', 'CATEGORY');
	}
	
	public function GetColumnDisplayText()
	{
		return 'DISPLAY_NAME';
	}
	
	public function GetName()
	{
		return 'person';
	}
	
	public function GetID()
	{
		return 5;
	}
	
	public function GetPostDataSQLFormat($value, $column, $tableGlobals)
	{
		if (   $column == 'BIRTHDAY_DAY' 
		    || $column == 'BIRTHDAY_MONTH'
		    || $column == 'BIRTHDAY_YEAR'
		    || $column == 'IMPORTANCE'
		    || $column == 'CATEGORY') {
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
		return 'lifelog_persons';
	}
	
	// ---------------------------------------- Other ----------------------------------------
	public function EchoXMLRow($row)
	{
		echo "<display_name>". htmlspecialchars($row[2], ENT_QUOTES, "UTF-8") ."</display_name>";
		echo "<first_name>" . htmlspecialchars($row[3], ENT_QUOTES, "UTF-8") . "</first_name>";
		echo "<middle_name>" . htmlspecialchars($row[4], ENT_QUOTES, "UTF-8") . "</middle_name>";
		echo "<last_name>" . htmlspecialchars($row[5], ENT_QUOTES, "UTF-8") . "</last_name>";
		echo "<birthday_day>" . $row[6] . "</birthday_day>";
		echo "<birthday_month>" . $row[7] . "</birthday_month>";
		echo "<birthday_year>" . $row[8] . "</birthday_year>";
		echo "<text>" . htmlspecialchars($row[9], ENT_QUOTES, "UTF-8") . "</text>";
		echo "<importance>" . $row[10] . "</importance>";
		echo "<category>" . $row[11] . "</category>";
	}
}
?>