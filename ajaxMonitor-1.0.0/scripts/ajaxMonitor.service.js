/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 25, 2010
 * Time: 10:23:13 AM
 * To change this template use File | Settings | File Templates.
 */

function NewStopWatch() {
    var stopWatch = {};


    var start = -100;
    var stop = -1;

    stopWatch.start = function() {
        var d = new Date();
        start = d.getTime();
    };

    stopWatch.stop = function() {
        var d = new Date();
        stop = d.getTime();
    };

    stopWatch.elapsed = function() {
        var elapsedTime = 0;

        elapsedTime = stop - start;
        start = 0;
        stop = 0;

        return elapsedTime;
    };

    return stopWatch;
}

function NewAjaxMonitorService(msgBus, stopWatch) {
    var service = {};

    var ajaxMonitorSettings = {};
    var currentMessage = {};
    var messageCount = 0;
    var messageCache = [];

    var originalAjax = $.ajax;
    
    service.activate = function() {
        service.wrapAjax();
        msgBus.fire.isActivated();
    };

    service.deactivate = function() {
        service.unwrapAjax();
        msgBus.fire.isDeactivated();
    };

    service.wrapAjax = function() {
        originalAjax = $.ajax;
        if(originalAjax.isMonitoredCount) {
            originalAjax.isMonitoredCount++;
        }
        else {
            originalAjax.isMonitoredCount = 1;
        }

        $.ajax = function(settings) {
            messageCache[messageCount] = {
                id:                 messageCount
                ,requestType:       settings.type + ' [Monitored]'
                ,completedStatus:   'unknown'
                ,timeToComplete:    -1
                ,url:               settings.url
            };

            ajaxMonitorSettings = settings;

            var origComplete;

            if (settings.complete) {
                origComplete = settings.complete;
            }

            settings.complete = service.monitorComplete(settings.complete, messageCount);

            stopWatch.start();
            messageCount++;
            originalAjax(settings);
        };
    };

    service.monitorComplete = function(complete, messageIndex) {
        var origComplete = function(request, status) {
            return (request && status);
        };

        if (complete) {
            origComplete = complete;
        }

        return function(request, status) {
            origComplete(request, status);

            stopWatch.stop();

            currentMessage = messageCache[messageIndex];
            if (currentMessage) {
                currentMessage.requestStatus = 'completed';
                currentMessage.completedStatus = status;
                currentMessage.timeToComplete = stopWatch.elapsed();
            }
            else {
                // unexpected completion of message this should throw an error, but it worked good in the unit test
                currentMessage = {};
                currentMessage.id = -1,
                currentMessage.requestStatus = 'completed';
                currentMessage.completedStatus = 'unexpected';
                currentMessage.timeToComplete = -1;
            }
            msgBus.fire.messageCompleted();
        };
    };

    service.unwrapAjax = function() {
        originalAjax.isMonitoredCount--;
        $.ajax = originalAjax;
    };

    service.getMessage = function() {
        return currentMessage;
    };

    service.isActiveCount = function() {
        return originalAjax.isMonitoredCount;
    };

    return service;
}

