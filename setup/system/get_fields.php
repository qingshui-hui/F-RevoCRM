<?php

$Vtiger_Utils_Log = true;
require_once('vendor/autoload.php');
include_once('vtlib/Vtiger/Menu.php');
include_once('vtlib/Vtiger/Module.php');
include_once('modules/PickList/DependentPickListUtils.php');
include_once('modules/ModTracker/ModTracker.php');
include_once('include/utils/CommonUtils.php');
include_once('includes/Loader.php');

require_once('setup/utils/FRFieldSetting.php');
require_once('setup/utils/FRFilterSetting.php');
require_once('includes/runtime/BaseModel.php');
require_once('modules/Settings/Vtiger/models/Module.php');
require_once('modules/Settings/MenuEditor/models/Module.php');
require_once('modules/Vtiger/models/MenuStructure.php');
require_once('modules/Vtiger/models/Module.php');


global $log, $adb;

/** @var \ADOConnection */
$db = $adb->database;

$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC;
$fields = $db->GetAll("SELECT * FROM vtiger_field ORDER BY tabid, block, sequence");

class FieldCol {
    const fieldid = 0;
    const columnname = 1;
    const tablename = 2;
    const generatedtype = 3;
    const uitype = 4;
    const fieldname = 5;
    const fieldlabel = 6;
    const readonly = 7;
    const presence = 8;
    const defaultvalue = 9;
    const maximumlength = 10;
    const displaytype = 11;
    const typeofdata = 12;
    const quickcreate = 13;
    const quickcreatesequence = 14;
    const info_type = 15;
    const masseditable = 16;
    const helpinfo = 17;
    const summaryfield = 18;
    const headerfield = 19;
    const isunique = 20;
}

// var_export($fields[0]);
$modules = [];
foreach ($fields as $field) {
    $tabid = $field['tabid'];
    $blockid = $field['block'];
    if (!$blockid) {
        $blockid = -1;
    }
    unset($field['tabid']);
    unset($field['block']);
    unset($field['sequence']);
    // if ($field['columnname'] != $field['fieldname']) {
    //     echo $field['fieldname'] . " != " . $field['columnname'] . ", tabid=" . $tabid . "\n";
    // }
    $modules[$tabid][$blockid][] = $field;
}

$content = "<?php\n\n";
$content .= "// VSCode command 'Fold Level 2' folds blocks\n\n";
$content .= '$vtiger_fields = [';
foreach ($modules as $moduleId => $blocks) {
    $content .= "\n  {$moduleId} => [";
    foreach ($blocks as $blockId => $fields) {
        $content .= "\n    {$blockId} => [";
        foreach ($fields as $field) {
            $content .= "\n      ";
            $content .= var_representation($field, VAR_REPRESENTATION_SINGLE_LINE);
            $content .= ",";
        }
        $content .= "\n    ],";
    }
    $content .= "\n  ],";
}
$content .= "\n];\n";

file_put_contents('schema/fields.php', $content);
