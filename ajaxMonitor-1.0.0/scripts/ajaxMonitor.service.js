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

function NewNoMessageInCache(index) {
    return {
        name: 'NoMessage'
        ,message: 'No Message with index of [' + index + '] exists'
    };
}

function NewAjaxMonitorService(msgBus, stopWatch) {
    var service = {};

    var ajaxMonitorSettings = {};
    var currentMessage = {};
    var newMessageIndex = 0;
    var messageCache = {};

    var originalAjax = $.ajax;

    service.getMessage = function(index) {
        var message = messageCache[index];
        if(message === undefined) {
            throw NewNoMessageInCache(index);
        }

        return message;
    };

    service.addMessage = function(index, message) {
        messageCache[index] = message;
    };

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
            ajaxMonitorSettings = settings;

            service.addMessage(newMessageIndex, {
                id:                 newMessageIndex
                ,requestType:       ajaxMonitorSettings.type + ' [Monitored]'
                ,completedStatus:   'unknown'
                ,timeToComplete:    -1
                ,url:               ajaxMonitorSettings.url
            });

            ajaxMonitorSettings.monitorBeforeSend = service.monitorBeforeSend(ajaxMonitorSettings.beforeSend, newMessageIndex);
            ajaxMonitorSettings.monitorError = service.monitorError(ajaxMonitorSettings.error, newMessageIndex);
            ajaxMonitorSettings.monitorSuccess = service.monitorSuccess(ajaxMonitorSettings.success, newMessageIndex);
            ajaxMonitorSettings.complete = service.monitorComplete(ajaxMonitorSettings.complete, newMessageIndex);

            newMessageIndex++;

            stopWatch.start();
            originalAjax(ajaxMonitorSettings);
        };
    };

    service.monitorSuccess = function(data, textStatus, request) {

        return function(data, textStatus, request) {

        }
    };



    service.monitorError = function(error, messageIndex) {
        var origError = function(request, status, errorThrown) {
            return (request && status && errorThrown);
        };

        if(error) {
            origError = error;
        }

        return function(request, status, errorThrown) {
            origError(request, status, errorThrown);

            currentMessage = service.getMessage((messageIndex));

            if(currentMessage) {
                currentMessage.requestStatus = 'error';
            }
            else {
                currentMessage = {};
                currentMessage.id = -1,
                currentMessage.requestStatus = 'error';
                currentMessage.completedStatus = 'unexpected';
                currentMessage.timeToComplete = -1;
            }

            service.addMessage(messageIndex, currentMessage);
            msgBus.fire.messageError();
        }
    };

    service.monitorBeforeSend = function(beforeSend, messageIndex) {
        var origBeforeSend = function(request) {
            return (request === request);
        };

        if(beforeSend) {
            origBeforeSend = beforeSend;
        }

        return function(request) {
            origBeforeSend(request);

            currentMessage = service.getMessage(messageIndex);

            if(currentMessage) {
                currentMessage.requestStatus = 'beforeSend';
            }
            else {
                currentMessage = {};
                currentMessage.id = -1,
                currentMessage.requestStatus = 'beforeSend';
                currentMessage.completedStatus = 'unexpected';
                currentMessage.timeToComplete = -1;
            }

            service.addMessage(messageIndex, currentMessage);
            msgBus.fire.messageBeforeSent();
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

            currentMessage = service.getMessage(messageIndex);
            
            if (currentMessage) {
                currentMessage.requestStatus = 'completed';
                currentMessage.completedStatus = status;
                currentMessage.timeToComplete = stopWatch.elapsed();
                currentMessage.statusHTTP = request.status
            }
            else {
                // unexpected completion of message this should throw an error, but it worked good in the unit test
                currentMessage = {};
                currentMessage.id = -1,
                currentMessage.requestStatus = 'completed';
                currentMessage.completedStatus = 'unexpected';
                currentMessage.timeToComplete = -1;
            }

            service.addMessage(messageIndex, currentMessage);
            
            msgBus.fire.messageCompleted();
        };
    };

    service.unwrapAjax = function() {
        originalAjax.isMonitoredCount--;
        $.ajax = originalAjax;
    };

    service.getCurrentMessage = function() {
        return currentMessage;
    };

    service.isActiveCount = function() {
        return originalAjax.isMonitoredCount;
    };

    return service;
}

