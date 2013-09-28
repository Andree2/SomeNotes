<?php
class Link extends Table
{	
    
    /**
     * @brief Returns the names of all columns except <id> and <last_changed>.
     */
    public function GetColumns()
    {
    	return array('TABLE1_ID', 'TABLE1_ITEM_ID', 'TABLE2_ID', 'TABLE2_ITEM_ID');
    }
    
    public function GetName()
    {
    	return 'link';
    }
    
    public function GetID()
    {
    	return 3;
    }
    
	public function GetPostDataSQLFormat($value, $column, $tableGlobals)
	{	
		if ($column == 'TABLE1_ID' ||  $column == 'TABLE2_ID') {
			// Convert from table name to table ID.
			return $tableGlobals[$value]->GetID();
		}
		
		return $value;
	}
    
    public function GetTableName()
    {
    	return 'lifelog_links';
    }

    // ---------------------------------------- SQL Queries ----------------------------------------

    // ---------------------------------------- Other ----------------------------------------
    
}	
?>