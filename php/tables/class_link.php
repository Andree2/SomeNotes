<?php
class Link extends Table
{
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
}
?>