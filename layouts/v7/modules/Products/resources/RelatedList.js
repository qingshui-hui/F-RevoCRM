/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.1
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is: vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/


class Products_RelatedList_Js extends PriceBooks_RelatedList_Js {
    /**
     * Function to get params for show event invocation
     */
    getPopupParams() {
        var relatedModuleName = this.relatedModulename;
        if (jQuery.inArray(relatedModuleName, ["Products", "Services", "PriceBooks"]) == -1) {
            return super.getPopupParams();
        }
        var view = 'ProductPriceBookPopup';
        var srcField = 'productsRelatedList';
        var multiSelect = '';

        if ((relatedModuleName === 'Products' && this.parentModuleName === "Services") || relatedModuleName === 'Services') {
            view = 'Popup';
            multiSelect = true;
        }
        else if (relatedModuleName === 'Products') {
            view = 'ProductsPopup';
            srcField = 'productsList';
        }

        var parameters = {
            'module': relatedModuleName,
            'src_module': this.parentModuleName,
            'src_record': this.parentRecordId,
            'view': view,
            'src_field': srcField,
            'multi_select': multiSelect,
            'relationId': this.getSelectedTabElement().data('relationId')
        }
        return parameters;
    }

    addRelations(idList) {
        var thisInstance = this;
        var aDeferred = jQuery.Deferred();
        var sourceRecordId = this.parentRecordId;
        var sourceModuleName = this.parentModuleName;
        var relatedModuleName = this.relatedModulename;
        var relationId = this.getSelectedTabElement().data('relationId');

        var params = {};
        params['module'] = sourceModuleName;
        params['action'] = 'RelationAjax';
        params['src_record'] = sourceRecordId;
        params['related_module'] = relatedModuleName;
        params['mode'] = 'addRelation';
        params['relationId'] = relationId;
        if (relatedModuleName === 'PriceBooks') {
            params['mode'] = 'addListPrice';
            params['relinfo'] = JSON.stringify(idList);
        } else {
            var relatedRecords = new Array();
            jQuery.each(idList, function(id, quantity) {
                relatedRecords.push(id);
            });
            params['related_record_list'] = JSON.stringify(relatedRecords);
            if (relatedModuleName === 'Products') {
                params['quantities'] = JSON.stringify(idList);
            }
        }
        app.helper.showProgress();
        app.request.post({data: params}).then(function(err, responseData) {
            var relatedIdList = Object.keys(idList);
            thisInstance.updateRelatedRecordsCount(relationId, relatedIdList, true);
            app.helper.hideProgress();
            aDeferred.resolve(responseData);
        });

        return aDeferred.promise();
    }

    updateRelations(idList) {
        var aDeferred = jQuery.Deferred();
        var sourceRecordId = this.parentRecordId;
        var sourceModuleName = this.parentModuleName;
        var relatedModuleName = this.relatedModulename;

        var params = {};
        params['module'] = sourceModuleName;
        params['action'] = 'RelationAjax';
        params['src_record'] = sourceRecordId;
        params['related_module'] = relatedModuleName;
        params['mode'] = 'updateQuantity';
        params['relatedRecords'] = JSON.stringify(idList);
        app.request.post({data: params}).then(function(responseData) {
            aDeferred.resolve(responseData);
        });

        return aDeferred.promise();
    }

    /**
     * Function to trigger related record actions
     */
    triggerRelationAdditionalActions() {
        var thisInstance = this;
        var sourceModuleName = thisInstance.parentModuleName;
        var relatedModuleName = thisInstance.relatedModulename;

        var tabLabel = thisInstance.getSelectedTabElement().data('label-key');
        if (sourceModuleName == relatedModuleName && tabLabel == 'Product Bundles') {
            var params = {
                'module'		: sourceModuleName,
                'relatedModule'	: relatedModuleName,
                'record'		: thisInstance.parentRecordId,
                'tabLabel'		: tabLabel,
                'view'			: 'Detail',
                'mode'			: 'showBundleTotalCostView'
            }
            app.request.post({data: params}).then(function(err, data) {
                    jQuery('.bundleCostContainer').html(data);
                    app.event.trigger('popover.click.event');
            });
        }
    }

    /**
     * Function to handle Sort
     */
    sortHandler(headerElement) {
        var thisInstance = this;
        var sourceModuleName = thisInstance.parentModuleName;
        var relatedModuleName = thisInstance.relatedModulename;
        if (sourceModuleName == relatedModuleName) {
            var bundleCostInfo = jQuery('.bundleCostInfo', thisInstance.relatedContentContainer);
            return super.sortHandler(headerElement).then(function() {
                jQuery('.bundleCostContainer').html(bundleCostInfo);
});
        }
        return super.sortHandler(headerElement);
    }

    /**
     * Function to handle next page navigation
     */
    nextPageHandler() {
        var thisInstance = this;
        var sourceModuleName = thisInstance.parentModuleName;
        var relatedModuleName = thisInstance.relatedModulename;
        
        if (sourceModuleName == relatedModuleName) {
            var bundleCostInfo = jQuery('.bundleCostInfo', thisInstance.relatedContentContainer);
            return super.nextPageHandler().then(function() {
                jQuery('.bundleCostContainer').html(bundleCostInfo);
            });
        }
        return super.nextPageHandler();
    }

    /**
     * Function to handle next page navigation
     */
    previousPageHandler() {
        var thisInstance = this;
        var sourceModuleName = thisInstance.parentModuleName;
        var relatedModuleName = thisInstance.relatedModulename;
        if (sourceModuleName == relatedModuleName) {
            var bundleCostInfo = jQuery('.bundleCostInfo', thisInstance.relatedContentContainer);
            return super.previousPageHandler().then(function() {
                jQuery('.bundleCostContainer').html(bundleCostInfo);
            });
        }
        return super.previousPageHandler();
    }

    /**
     * Function to handle page jump in related list
     */
    pageJumpHandler(e) {
        var thisInstance = this;
        var sourceModuleName = thisInstance.parentModuleName;
        var relatedModuleName = thisInstance.relatedModulename;
        if (sourceModuleName == relatedModuleName) {
            var bundleCostInfo = jQuery('.bundleCostInfo', thisInstance.relatedContentContainer);
            return super.pageJumpHandler(e).then(function() {
                jQuery('.bundleCostContainer').html(bundleCostInfo);
            });
        }
        return super.pageJumpHandler(e);
    }

    /**
     * Function to add related record for this record
     */
    addRelatedRecord(element, callback) {
        var thisInstance = this;
        return super.addRelatedRecord(element, callback).then(function() {
            thisInstance.triggerRelationAdditionalActions();
        });
    }
}