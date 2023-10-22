class Calendar_Detail_Js extends Vtiger_Detail_Js {
    _delete(deleteRecordActionUrl) {
        var params = app.convertUrlToDataParams(deleteRecordActionUrl+"&ajaxDelete=true");
        app.helper.showProgress();
        app.request.post({data:params}).then(
        function(err,data){
            app.helper.hideProgress();
            if(err === null) {
                if(typeof data !== 'object') {
                    window.location.href = data;
                } else {
                    app.helper.showAlertBox({'message' : data.prototype.message});
                }
            } else {
                app.helper.showAlertBox({'message' : err});
            }
        });
    }

    /**
    * To Delete Record from detail View
    * @param URL deleteRecordActionUrl
    * @returns {undefined}
    */
    remove(deleteRecordActionUrl) {
        var thisInstance = this;
        var isRecurringEvent = jQuery('#addEventRepeatUI').data('recurringEnabled');
        if(isRecurringEvent) {
            app.helper.showConfirmationForRepeatEvents().then(function(postData) {
                deleteRecordActionUrl += '&' + jQuery.param(postData);
                thisInstance._delete(deleteRecordActionUrl);
            });
        } else {
            super.remove(deleteRecordActionUrl);
        }
    }

    registerEvents() {
        super.registerEvents();
    }
};