/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is: vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

class Inventory_List_Js extends Vtiger_List_Js {
    showQuickPreviewForId(recordId, appName, templateId) {
        var self = this;
        var vtigerInstance = Vtiger_Index_Js.getInstance();
        vtigerInstance.showQuickPreviewForId(recordId, self.getModuleName(), app.getAppName(), templateId);
    }

    registerEvents() {
        super.registerEvents();
    }
};
