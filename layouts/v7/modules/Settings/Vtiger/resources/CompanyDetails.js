/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is: vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

class Settings_Vtiger_CompanyDetails_Js extends Vtiger_Class_Js {
    constructor() {
        super();
        this.addComponents();
    }

    addComponents() {
      this.addModuleSpecificComponent('Index', app.module(), app.getParentModuleName());
    }

    registerUpdateDetailsClickEvent() {
        jQuery('#updateCompanyDetails').on('click',function(e){
            jQuery('#CompanyDetailsContainer').addClass('hide');
            jQuery('#updateCompanyDetailsForm').removeClass('hide');
            jQuery('#updateCompanyDetails').addClass('hide');
        });
    }

    registerSaveCompanyDetailsEvent() {
        var thisInstance = this;
        var form = jQuery('#updateCompanyDetailsForm');
        var params = {
            submitHandler : function(form) {
                var form = jQuery(form);
                var result = thisInstance.checkValidation();
                if(result === false){
                    return result;
                }else {
                    return true;
                }
            }
        };
        form.vtValidate(params);
    }

    registerCancelClickEvent() {
        jQuery('.cancelLink').on('click',function() {
            jQuery('#CompanyDetailsContainer').removeClass('hide');
            jQuery('#updateCompanyDetailsForm').addClass('hide');
            jQuery('#updateCompanyDetails').removeClass('hide');
        });
    }

    checkValidation() {
        var imageObj = jQuery('#logoFile');
        var imageName = imageObj.val();
        if(imageName != '') {
            var image_arr = new Array();
            image_arr = imageName.split(".");
            var image_arr_last_index = image_arr.length - 1;
            if(image_arr_last_index < 0) {
                app.helper.showErrorNotification({'message' : app.vtranslate('LBL_WRONG_IMAGE_TYPE')});
                imageObj.val('');
                return false;
            }
            var image_extensions = JSON.parse(jQuery('#supportedImageFormats').val());
            var image_ext = image_arr[image_arr_last_index].toLowerCase();
            if(image_extensions.indexOf(image_ext) != '-1') {
                var size = imageObj[0].files[0].size;
                if (size < 1024000) {
                    return true;
                } else {
                    app.helper.showErrorNotification({'message' : app.vtranslate('LBL_MAXIMUM_SIZE_EXCEEDS')});
                    return false;
                }
            } else {
                app.helper.showErrorNotification({'message' : app.vtranslate('LBL_WRONG_IMAGE_TYPE')});
                imageObj.val('');
                return false;
            }
    
        }
    }

    registerCompanyLogoDimensionsValidation() {
        //150*40 logo with padding would be nice
        var updateCompanyDetailsForm = jQuery('form#updateCompanyDetailsForm');
        var logoFile = updateCompanyDetailsForm.find('#logoFile');
        logoFile.on('change', function() {
            //http://stackoverflow.com/a/13572209
            var _URL = window.URL || window.webkitURL;
            var image, file = this.files[0];
            if(file && typeof Image === 'function') {
                image = new Image();
                image.src = _URL.createObjectURL(file);
            }
        });
    }

    registerEvents() {
        this.registerUpdateDetailsClickEvent();
        this.registerSaveCompanyDetailsEvent();
        this.registerCancelClickEvent();
        this.registerCompanyLogoDimensionsValidation();
    }
};
