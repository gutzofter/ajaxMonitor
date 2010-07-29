/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 23, 2010
 * Time: 12:33:20 PM
 * To change this template use File | Settings | File Templates.
 */

(function($) {
    var internalData = {};
    var msgBus = NewMessageBus();
    var view = NewAjaxMonitorView(msgBus);
    var model = NewAjaxMonitorModel(msgBus);
    var stopWatch = NewStopWatch();
    var service = NewAjaxMonitorService(msgBus, stopWatch);

    var controller = NewAjaxMonitorController(msgBus, view, model);
    var coordinator = NewAjaxMonitorCoordinator(msgBus, model, service);


    internalData.version = '1.0.0';
    internalData.plugInName = 'ajaxMonitor';

    $.fn.ajaxMonitor = function(settings) {
        var defaultSettings = {
            monitorActive: false
            ,maximize: false
            ,refreshRate: 'realtime' // 'realtime', 'fast', 'medium', 'slow', value in mSecs
            ,useExternalServices: false // future jsonlint testing of request data and repsonse data and test json reuqest to my server
        };
        consoleLog(internalData.plugInName + ' Version: ' + internalData.version + ' is initialized');

        var changedSettings = {};
        if (settings) {
            changedSettings = $.extend({}, defaultSettings, settings);
        }

        this.each(function() {
            var thisJQueryElement = $(this);
            coordinator.run();
            controller.run(changedSettings, thisJQueryElement);
        });

        this.destroy = $.fn.ajaxMonitor.destroy;

        return this;

    };

    $.fn.ajaxMonitor.destroy = function() {
        view.destroy();
        model.destroy();
    };

    function consoleLog(msg) {
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
    }

})(jQuery);

