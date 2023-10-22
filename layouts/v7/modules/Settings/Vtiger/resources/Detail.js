/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is: vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

class Settings_Vtiger_Detail_Js extends Vtiger_Class_Js {
    detailViewForm = false;

    constructor() {
       this.addComponents();
    }

    addComponents() {
      this.addModuleSpecificComponent('Index','Vtiger',app.getParentModuleName());
    }

    /**
     * Function which will give the detail view form
     * @return : jQuery element
     */
    getForm() {
        if(this.detailViewForm === false) {
            this.detailViewForm = jQuery('#detailView');
        }
        return this.detailViewForm;
    }

    /**
     * Function to register form for validation
     */
    registerFormForValidation() {
        var detailViewForm = this.getForm();
        if(detailViewForm.length > 0) {
            detailViewForm.vtValidate();
        }
    }

    /**
     * Function which will handle the registrations for the elements
     */
    registerEvents() {
        this.registerFormForValidation();
    }
};