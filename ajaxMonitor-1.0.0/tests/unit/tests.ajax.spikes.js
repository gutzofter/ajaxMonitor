/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 27, 2010
 * Time: 10:57:10 AM
 * To change this template use File | Settings | File Templates.
 */
var maxRunCount = 1000;

module('Ajax - Various spike tests');

should('add extra setting to ajax to see if it affects the request', function() {
    var result = getAjaxServerRequest({});
    same(result, true, 'response: good');

    result = getAjaxServerRequest({ monitor: true });
    same(result, true, 'response: good');
});

should('what is going on in the error callback', function() {
    var xhr = {};
    var status = '';
    var error = {};
    var result = getAjaxServerRequest({
        "url" : 'go_nowhere'
        ,"error": function(req, txtStatus, e) {
            xhr = req;
            status = txtStatus;
            error = e;
        }
    });
    same(status, 'error', 'status');
    same(error, undefined, 'error object');

});


should('profile Ajax requests', function() {
    var sw = NewStopWatchService();
    var totalResult = true;
    var totalTime = 0;

    for(var i = 0; i < maxRunCount; i++) {
        sw.start();
        totalResult = (totalResult &&getAjaxServerRequest({}));
        sw.stop();

        totalTime += sw.elapsed();
    }
    same(totalResult, true, 'all responses: good');
    same((totalTime > 0), true, 'Average time/request: ' + (totalTime/maxRunCount));

});

should('profile Ajax requests with monitor', function() {
    $('<div id="ajax_monitor"/>').appendTo('body');
    var monitor = $('#ajax_monitor').ajaxMonitor({maximize: true, monitorActive: true});

    var sw = NewStopWatchService();
    var totalResult = true;
    var totalTime = 0;

    for(var i = 0; i < maxRunCount; i++) {
        sw.start();
        totalResult = (totalResult &&getAjaxServerRequest({}));
        sw.stop();

        totalTime += sw.elapsed();
    }
//    monitor.destroy();
//    $('#ajax_monitor').remove();

    same(totalResult, true, 'all responses: good');
    same((totalTime > 0), true, 'Average time/request: ' + (totalTime/maxRunCount));

});


