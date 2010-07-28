/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 27, 2010
 * Time: 10:57:10 AM
 * To change this template use File | Settings | File Templates.
 */

module('Ajax - Various spike tests');

should('add extra setting to ajax to see if it affects the request', function() {
    var result = getAjaxServerRequest();
    same(result, true, 'response: good');

    result = getAjaxServerRequest({ monitor: true });
    same(result, true, 'response: good');
});


should('profile Ajax requests', function() {
    var sw = NewStopWatch();
    var totalResult = true;
    var totalTime = 0;

    var maxRunCount = 100;
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
    var monitor = $('#ajax_monitor').ajaxMonitor({monitorActive: true});

    var sw = NewStopWatch();
    var totalResult = true;
    var totalTime = 0;

    var maxRunCount = 100;
    for(var i = 0; i < maxRunCount; i++) {
        sw.start();
        totalResult = (totalResult &&getAjaxServerRequest({}));
        sw.stop();

        totalTime += sw.elapsed();
    }
    monitor.destroy();
    $('#ajax_monitor').remove();

    same(totalResult, true, 'all responses: good');
    same((totalTime > 0), true, 'Average time/request: ' + (totalTime/maxRunCount));

});


