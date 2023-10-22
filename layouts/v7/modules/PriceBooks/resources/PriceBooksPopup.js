/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is: vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/
class PriceBook_Products_Popup_Js extends Vtiger_Popup_Js {
    static registered = false;
    popupSelectedRecords = {};

    /**
     * Function to register event for enabling list price
     */
    checkBoxChangeHandler(e) {
        var thisInstance = this;
        super.checkBoxChangeHandler(e);
        var elem = jQuery(e.currentTarget);
        var parentRow = elem.closest('tr');
        var id = parentRow.data("id");
        if(elem.is(':checked')) {
            jQuery('input[name=unit_price]',parentRow).removeClass('hide');
            jQuery('input[name=unit_price]',parentRow).focus();
        }else{
            jQuery('input[name=unit_price]',parentRow).addClass('hide');
            delete thisInstance.popupSelectedRecords[id];
        }
    }

    /**
     * Function to register event for add to pricebook button in the popup
     */

    registerSelectButton() {
        var popupPageContentsContainer = jQuery('#popupPage');
        var thisInstance = this;
        popupPageContentsContainer.on('click','button.addProducts', function(e){
            popupPageContentsContainer.vtValidate({
                ignore: '.listSearchContributor,input.hide',
                submitHandler: function(form) {
                    var selectedRecords = thisInstance.readSelectedIds();
                    var selectedRecordDetails = {};
                    for(var data in selectedRecords){
                        if(typeof selectedRecords[data] == "object"){
                            var id = selectedRecords[data]['id'];
                            var row = popupPageContentsContainer.find('[data-id='+id+']');
                            var rowListPrice = row.find('input[name=unit_price]');
                            var listPrice = rowListPrice.val();
                            selectedRecordDetails[id] = {'id' : id,'price' : listPrice};
                        }
                    }
                    selectedRecordDetails = jQuery.extend(selectedRecordDetails,thisInstance.popupSelectedRecords);
                    if(Object.keys(selectedRecordDetails).length === 0){
                        var message = app.vtranslate("JS_PLEASE_SELECT_ONE_RECORD");
                        app.helper.showErrorNotification({message: message});
                        return;
                    }
                    
                    thisInstance.done(selectedRecordDetails, thisInstance.getEventName());
                }
            });
        });
    }

    /**
     * Function to handle select all in the popup
     */

    selectAllHandler(e) {
        super.selectAllHandler(e);
        var currentElement = jQuery(e.currentTarget);
        var isMainCheckBoxChecked = currentElement.is(':checked');
        var tableElement = currentElement.closest('table');
        if(isMainCheckBoxChecked) {
            jQuery('input.entryCheckBox', tableElement).closest('tr').find('input[name="unit_price"]').removeClass('hide');
        }else {
            jQuery('input.entryCheckBox', tableElement).closest('tr').find('input[name="unit_price"]').addClass('hide');
        }
    }

    /**
     * Function to register event for actions buttons
     */
    registerEventForActionsButtons() {
        var thisInstance = this;
        var popupPageContentsContainer = this.getPopupPageContainer();
        popupPageContentsContainer.on('click','a.cancelLink',function(e){
            thisInstance.done();
        })
    }

    /**
     * Function to get Page Records
     */
    getPageRecords(params) {
        var thisInstance = this;
        var aDeferred = jQuery.Deferred();
        super.getPageRecords(params).then(
            function(data){
                aDeferred.resolve(data);
            },

            function(textStatus, errorThrown){
                aDeferred.reject(textStatus, errorThrown);
            }
        );
        return aDeferred.promise();
    }

    /**
     * Function to handle sort
     */
    sortHandler(headerElement) {
        var thisInstance = this;
        //Listprice column should not be sorted so checking for class noSorting
        if(headerElement.hasClass('noSorting')){
            return;
        }
        super.sortHandler(headerElement).then(
            function(data){
                thisInstance.popupSlimScroll();
            },

            function(textStatus, errorThrown){

            }
        );
    }

    /**
     * Function to handle slim scroll for popup
     */
    popupSlimScroll() {
        var popupPageContentsContainer = this.getPopupPageContainer();
        var element = popupPageContentsContainer.find('.popupEntriesDiv');
        app.helper.showVerticalScroll(element, {setHeight: 400});
    }

    /**
    * Function which will register event when user clicks on the row
    */
    registerEventForListViewEntryClick() {
        //To Make sure we will not close the window once he clicks on the row,
        //which is default behaviour in normal popup
        return true;
    }

    /**
     * Function to get complete params
     */
    getCompleteParams() {
        var params = super.getCompleteParams();
        var selectedRecords = this.popupSelectedRecords;
        params["selectedRecords"] = selectedRecords;
        return params;
    }

    /**
     * Function to handle next page navigation
     */
    nextPageHandler() {
       app.event.trigger("pre.popupNavigationButton.click");
        var aDeferred = jQuery.Deferred();
        super.nextPageHandler().then(function(data){
            aDeferred.resolve(data);
        });
        return aDeferred.promise();
    }

    /**
    * Function to handle Previous page navigation
    */
    previousPageHandler() {
        app.event.trigger("pre.popupNavigationButton.click");
        var aDeferred = jQuery.Deferred();
        super.previousPageHandler().then(function(data){
            aDeferred.resolve(data);
        });
        return aDeferred.promise();
    }

    /**
     * Function to register events
     */
    registerEvents() {
        if(!PriceBook_Products_Popup_Js.registered) {
            var thisInstance = this;
            PriceBook_Products_Popup_Js.registered = true;
            super.registerEvents();
            this.registerEventForActionsButtons();
            app.event.on("pre.popupNavigationButton.click",function(event){
                var popupPageContentsContainer = jQuery('#popupPage');
                var tableEntriesElement = popupPageContentsContainer.find('table.listViewEntriesTable');
                var selectedRecords = jQuery('input.entryCheckBox', tableEntriesElement).filter(':checked');
                if ((selectedRecords.length) > 0) {
                    selectedRecords.each(function(index, checkBoxElement) {
                        var checkBoxJqueryObject = jQuery(checkBoxElement);
                        var row = checkBoxJqueryObject.closest('tr');
                        var id = row.data('id');

                        var listPrice = row.find('input[name=unit_price]').val();
                        if(listPrice > 0){
                            thisInstance.popupSelectedRecords[id] = {'id' : id,'price' : listPrice};
                        }
                    });
                }
            })
        }
    }
};