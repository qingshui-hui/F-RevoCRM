/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

class Import_Popup_Js extends Vtiger_Popup_Js {
    getCompleteParams() {
        var params = {};
        params['view'] = 'List';
        params['module'] = 'Import';
        params['search_key'] = this.getSearchKey();
        params['search_value'] = this.getSearchValue();
        params['orderby'] = this.getOrderBy();
        params['sortorder'] = this.getSortOrder();
        params['page'] = this.getPageNumber();
        params['for_module'] = app.getModuleName();
        params.search_params = JSON.stringify(this.getPopupListSearchParams());
        return params;
    }

    /**
     * Function to get Page Jump Params
     */
    getPageJumpParams() {
        var params = this.getCompleteParams();
        params['view'] = "List";
        params['mode'] = "getPageCount";

        return params;
    }

    registerEvents() {
        super.registerEvents();
    }
};

