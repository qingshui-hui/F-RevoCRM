/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.1
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is: vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/

class Migration_Index_Js extends Vtiger_Class_Js {
    static startMigrationEvent() {
        var migrateUrl = 'index.php?module=Migration&view=Index&mode=applyDBChanges';
        app.request.post({url:migrateUrl}).then(function (err, data) {
            jQuery('#running').addClass('hide').removeClass('show');
            jQuery('#success').addClass('show').removeClass('hide');
            jQuery('#nextButton').addClass('show').removeClass('hide');
            jQuery('#showDetails').addClass('show').removeClass('hide').html(data);
        });
    }

    static registerEvents() {
        this.startMigrationEvent();
    }
};
