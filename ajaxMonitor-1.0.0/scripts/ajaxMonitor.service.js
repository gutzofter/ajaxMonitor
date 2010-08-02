/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 25, 2010
 * Time: 10:23:13 AM
 * To change this template use File | Settings | File Templates.
 */

function NewStopWatchService() {
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

function NewAjaxMonitorService(msgBus, stopWatchService) {
    var service = {};

    var currentMessage = {};
    var newMessageIndex = 0;
    var messageCache = {};
    var timingServices =  stopWatchService;

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
        var xhr = {};

        originalAjax = $.ajax;
        if(originalAjax.isMonitoredCount) {
            originalAjax.isMonitoredCount++;
        }
        else {
            originalAjax.isMonitoredCount = 1;
        }

        $.ajax = function(settings) {
            var stopWatch = timingServices();
            
            var ajaxMonitorSettings = $.extend({}, settings);


            ajaxMonitorSettings.beforeSend = service.monitorBeforeSend(ajaxMonitorSettings.beforeSend, newMessageIndex, stopWatch);
            ajaxMonitorSettings.error = service.monitorError(ajaxMonitorSettings.error, newMessageIndex);
            ajaxMonitorSettings.success = service.monitorSuccess(ajaxMonitorSettings.success, newMessageIndex);
            ajaxMonitorSettings.complete = service.monitorComplete(ajaxMonitorSettings.complete, newMessageIndex, stopWatch);

            if(ajaxMonitorSettings.type === undefined) {
                ajaxMonitorSettings.type = $.ajaxSettings.type;
            }

            if(ajaxMonitorSettings.mock) {
                var mockAjax = NewAjaxMock('success', {
                    status:     'success'
                    ,message:   'Thank you for using ajaxMonitor with Mocking!'
                });
                service.addMessage(newMessageIndex, {
                    id:                 newMessageIndex
                    ,requestType:       ajaxMonitorSettings.type + ' [Monitored - Mock]'
                    ,completedStatus:   'unknown'
                    ,timeToComplete:    -1
                    ,url:               ajaxMonitorSettings.url
                });
                
                xhr = mockAjax(ajaxMonitorSettings);
            }
            else {
                service.addMessage(newMessageIndex, {
                    id:                 newMessageIndex
                    ,requestType:       ajaxMonitorSettings.type + ' [Monitored]'
                    ,completedStatus:   'unknown'
                    ,timeToComplete:    -1
                    ,url:               ajaxMonitorSettings.url
                });

                xhr = originalAjax(ajaxMonitorSettings);
            }

            newMessageIndex++;
            
            return xhr;
        };
    };

    service.monitorSuccess = function(success, messageIndex) {
        var origSuccess = function(data, textStatus, request) {
            return (data && textStatus && request);
        };

        if(success) {
            origSuccess = success;
        }

        return function(data, textStatus, request) {
            origSuccess(data, textStatus, request);

            currentMessage = service.getMessage((messageIndex));

            if(currentMessage) {
                currentMessage.requestStatus = 'success';
            }
            else {
                currentMessage = {};
                currentMessage.id = -1,
                currentMessage.requestStatus = 'success';
                currentMessage.completedStatus = 'unexpected';
                currentMessage.timeToComplete = -1;
            }

            service.addMessage(messageIndex, currentMessage);
            msgBus.fire.messageSuccess();
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

    service.monitorBeforeSend = function(beforeSend, messageIndex, stopWatch) {
        var origBeforeSend = function(request) {
            return (request === request);
        };

        if(beforeSend) {
            origBeforeSend = beforeSend;
        }

        return function(request) {
            stopWatch.start();
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
            msgBus.fire.messageBeforeSend();
        };
    };

    service.monitorComplete = function(complete, messageIndex, stopWatch) {
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

                //TODO: does not handle xpc wrappednative objects
                // need to figure this part out.
                // ????no unit tests coverage how do create an exception when accessing a property????
                try {
                    currentMessage.statusHTTP = request.status
                }
                catch(e) {
                    currentMessage.statusHTTP = 'server error'
                }
            }
            else {
                // unexpected completion of message this should be written to thrown an error, but it worked good in the unit test
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

