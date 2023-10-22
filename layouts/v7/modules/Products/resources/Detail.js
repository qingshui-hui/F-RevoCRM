/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.1
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is: vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/


class Products_Detail_Js extends PriceBooks_Detail_Js {
    static triggerEditQuantity(url) {
        app.request.get({url: url}).then(
                function(err, data) {
                    app.helper.showModal(data, {cb: function() {
                            var productDetailjs = new Products_Detail_Js();
                            productDetailjs.registerEventForUpdateQuantity();
                        }
                    });
                });
    }

    /**
     * function to register event for editing the list price in related list
     */


    registerEventForUpdateQuantity() {
        var self = this;
        var updateQuantityForm = jQuery('#quantityUpdate');
        updateQuantityForm.vtValidate({
            submitHandler: function(form) {
                var selectedRecordDetails = {};
                var quantityEle = updateQuantityForm.find('input[name="quantity"]');
                var quantity = quantityEle.val();
                var relid = updateQuantityForm.find('input[name="relid"]').val();
                selectedRecordDetails[relid] = quantity;
                var relatedListInstance = self.getRelatedController();
                var relation = relatedListInstance.updateRelations(selectedRecordDetails);
                app.helper.hideModal();
                relation.done(self.loadRelatedList());         
            }
        });
    }

    registerEventForChangeTotalCost() {
        var detailContentsHolder = this.getContentHolder();
        var thisInstance = this;
        detailContentsHolder.on('click', '#updatePrice', function(e) {
            var element = jQuery(e.currentTarget);
            if (element.attr('disabled')) {
                return;
            }
            app.helper.showProgress();
            var unitPrice = jQuery('.subProductsTotalCost').text();
            var params = {
                'module': app.getModuleName(),
                'relatedModule': thisInstance.getRelatedModuleName(),
                'record': thisInstance.getRecordId(),
                'tabLabel': jQuery('#tab_label').val(),
                'action': 'RelationAjax',
                'mode': 'changeBundleCost',
                'unit_price': unitPrice
            }
            app.request.post({data: params}).then(
                    function(err, data) {
                        app.helper.hideProgress();

                        if (data) {
                            element.attr('disabled', true);
                            var message = 'JS_SUCCESSFULLY_CHANGED_BUNDLE_COST';
                            app.helper.showSuccessNotification({message: app.vtranslate(message)});
                        }
                    });
        });
        thisInstance.registerPopover();
        detailContentsHolder.on('click', '.totalCostCalculationInfo', function(e) {
            var element = jQuery(e.currentTarget);
            element.popover({
                'html': true,
                'container':'body',
                'placement': 'top',
            }).data('bs.popover').tip().addClass('productBundlePopover');
            element.one('shown.bs.popover',function(){
                app.helper.showVerticalScroll(jQuery('.productBundlePopover .popover-content'));
            });
        });
    }

    /**
     * Function to register event for select button click on pricebooks in Products related list
     */
    registerEventForSelectOptionToShowBundleInInventory() {
        var thisInstance = this;
        var detailContentsHolder = this.getContentHolder();

        detailContentsHolder.on('click', '.showBundlesInInventory', function(e) {
            var currentTarget = jQuery(e.currentTarget);
            var prevSelectedValue = jQuery('.isShowBundles').val();
            var isChecked = currentTarget.find('input[type="checkbox"]').is(':checked');
            var value = 0;
            if (isChecked) {
                value = 1;
            }

            if (value != prevSelectedValue) {
                var params = {
                    'module': app.getModuleName(),
                    'relatedModule': thisInstance.getRelatedModuleName(),
                    'record': thisInstance.getRecordId(),
                    'tabLabel': jQuery('#tab_label').val(),
                    'action': 'RelationAjax',
                    'mode': 'updateShowBundles',
                    'value': value
                }

                app.request.post({data: params}).then(
                        function(err, response) {
                            jQuery('.isShowBundles').val(value);
                            if (value) {
                                currentTarget.attr('checked', 'true');
                            } else {
                                currentTarget.removeAttr('checked');
                            }
                            var message = 'JS_SUB_PRODUCTS_WILL_NOT_BE_SHOWN_IN_INVENTORY';
                            if (value) {
                                message = 'JS_SUB_PRODUCTS_WILL_BE_SHOWN_IN_INVENTORY';
                            }
                            app.helper.showSuccessNotification({message:app.vtranslate(message)});
                        }

                );
            }
        });
    }

    loadRelatedList() {
        var relatedController = this.getRelatedController();
        var self = this;
        relatedController.loadRelatedList().then(function(){
            relatedController.triggerRelationAdditionalActions();
        });
    }

    registerPopover() {
        if (jQuery('.totalCostCalculationInfo').length !== 0) {
            jQuery('.totalCostCalculationInfo').popover({html: true, container: 'body', placement: 'top'}).data('bs.popover').tip().addClass('productBundlePopover');
        }
    }

    registerBasicEvents() {
        super.registerBasicEvents();
    }

    /**
     * Function to register events
     */
    registerEvents() {
        var self = this;
        app.event.on("post.RecordList.click", function(event, data) {
            var responseData = JSON.parse(data);
            app.helper.hideModal();
            var relatedController = self.getRelatedController();
            relatedController.addRelations(responseData).then(self.loadRelatedList());
        });
        super.registerEvents();
        this.registerEventForSelectOptionToShowBundleInInventory();
        this.registerEventForChangeTotalCost();
        app.event.on("post.relatedListLoad.click", function() {
            self.registerPopover();
        });
        app.event.on("popover.click.event", function(e) {
            self.registerPopover();
        });
            }
};
