/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 25, 2010
 * Time: 5:48:15 PM
 * To change this template use File | Settings | File Templates.
 */

function NewEventExistsException(eventName) {
    return {
        name: 'Event Already Exists Error'
        ,message: 'An event by the name of [' + eventName + '] already exists. Try another name.'
    }
}

function NewMessageBus() {
    var msgBus = {};

    msgBus.when = function(name, fn) {
        if (this.fire[name]) {
            throw NewEventExistsException(name);
        }
        else {
            this.fire[name] = fn;
        }
    };

    msgBus.fire = {};

    return msgBus;
}

function NewAjaxMonitorView(msgBus) {
    var view = {};

    view.initialize = function($thisElement) {

        $('<div id="ajax_monitor_container" class="reset_left left_position"/>').appendTo($thisElement);

        $('#ajax_monitor_container')
                .append('<h1><span id="monitor_button" class="control">Monitor</span></h1>')
                .append('<div id="monitor_container" class="main_container reset_left left_position"/>');

        $('#monitor_container')
                .append('<div id="monitor_controls" class="section reset_left left_position"></div>')
                .append('<div id="monitor_messages" class="section reset_left left_position">Monitor Messages</div>')
                .append('<div id="monitor_footer" class="section reset_left left_position">Monitor Footer</div>')
                .append('<div id="monitor_status" class="section reset_left left_position">Monitor Status</div>');

        $('#monitor_controls')
                .append('<div id="remove_control" class="control reset_left left_position">Remove</div>')
                .append('<div id="activate_control" class="control right_position">Activate Not Initialized</div>');

        $('#monitor_messages')
                .append('<table id="monitor_table" />');

        $('<thead>' + view.formatColumnHTML() + '</thead>').appendTo('#monitor_table');
        $('<tbody>' + '<tr>' + '</tr>' + '</tbody>').appendTo('#monitor_table');
        $('<tfoot>' + view.formatColumnHTML() + '</tfoot>').appendTo('#monitor_table');

        $('#monitor_container').hide();

        $('#monitor_button').click(function() {
            view.displayToggle();
        });

        $('#activate_control').click(function() {
            msgBus.fire.toggleActivation();
        });

        $('#remove_control').click(function() {
            msgBus.fire.removeMonitor();
        });

    };

    view.destroy = function() {
        $('#ajax_monitor_container').remove();
    };

    view.minimize = function() {
        $('#monitor_container').hide();
    };

    view.maximize = function() {
        $('#monitor_container').show();
    };

    view.setNotActive = function() {
        $('#activate_control').text('Activate');
        $('#monitor_status').text('Not Active');
    };

    view.setActive = function() {
        $('#activate_control').text('De-Activate');
        $('#monitor_status').text('Active');
    };

    view.displayToggle = function() {
        $('#monitor_container').slideToggle('slow');
    };

    view.newMessage = function(message) {
        var id = message.id;
        var selector = '#monitor_table tbody tr[id=message_' + id + ']';

        $(selector).remove();

        var tableEntry = view.formatMessageHTML(id, message);

        $('#monitor_table tbody').append(tableEntry);
    };

    view.formatColumnHTML = function() {
        var columns = '<tr>';

        columns += view.formatColumnItemHTML('Id', 5);
        columns += view.formatColumnItemHTML('HTTP Status', 5);
        columns += view.formatColumnItemHTML('Completion Time mSec(s)', 10);
        columns += view.formatColumnItemHTML('Request Type', 25);
        columns += view.formatColumnItemHTML('Url', 25);
        columns += view.formatColumnItemHTML('Request Status', 15);
        columns += view.formatColumnItemHTML('Completion Status', 15);

        columns += '</tr>';

        return columns;
    };

    view.formatColumnItemHTML = function(item, width) {
        return '<th width="' + width + '%">' + item + '</th>';
    };

    view.formatMessageHTML = function(id, message) {
        var tableEntry = '<tr id="message_' + id + '" >';

        tableEntry += view.formatMessageItemHTML(message.id);
        tableEntry += view.formatMessageItemHTML(message.statusHTTP);
        tableEntry += view.formatMessageItemHTML(message.timeToComplete);
        tableEntry += view.formatMessageItemHTML(message.requestType);
        tableEntry += view.formatMessageItemHTML(message.url);
        tableEntry += view.formatMessageItemHTML(message.requestStatus);
        tableEntry += view.formatMessageItemHTML(message.completedStatus);

        tableEntry += '</tr>';

        return tableEntry;
    };

    view.formatMessageItemHTML = function(item) {
        return '<td>' + item + '</td>';
    };

    return view;
}

function NewAjaxMonitorModel(msgBus) {
    var model = {};
    var isActive = false;
    var settings = {};
    var isActivated = false;

    var currentMessage = {};

    model.initialize = function(initSettings) {
        settings = initSettings;
        if(settings.maximize) {
            msgBus.fire.maximize();
        }
        else {
            msgBus.fire.minimize();
        }

        isActivated = settings.monitorActive;
        model.processActivation(isActivated);
    };

    model.toggleActivation = function() {
        isActivated = !isActivated;
        model.processActivation(isActivated);
    };

    model.isActiveCount = function() {
        return isActive;
    };

    model.processActivation = function(shouldActivate) {
        if(shouldActivate) {
            msgBus.fire.activateService();
        }
        else {
            msgBus.fire.deactivateService();
        }
    };

    model.setNotActive = function() {
        msgBus.fire.deactivate();
    };

    model.setActive = function() {
        msgBus.fire.activate();
    };

    model.destroy = function() {
        msgBus.fire.deactivateService();
    };

    model.addMessage = function(message) {
        currentMessage = message;
        msgBus.fire.newMessage();
    };

    model.currentMessage = function() {
        return currentMessage;
    };

    return model;
}

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

                mockAjax(ajaxMonitorSettings);
            }
            else {
                service.addMessage(newMessageIndex, {
                    id:                 newMessageIndex
                    ,requestType:       ajaxMonitorSettings.type + ' [Monitored]'
                    ,completedStatus:   'unknown'
                    ,timeToComplete:    -1
                    ,url:               ajaxMonitorSettings.url
                });

                originalAjax(ajaxMonitorSettings);
            }

            newMessageIndex++;
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

function NewAjaxMonitorController(msgBus, view, model) {
    var controller = {};

    msgBus.when('minimize', function() {
        view.minimize();
    });
    msgBus.when('maximize', function() {
        view.maximize();
    });
    msgBus.when('activate', function() {
        view.setActive();
    });
    msgBus.when('deactivate', function() {
        view.setNotActive();
    });
    msgBus.when('toggleActivation', function() {
        model.toggleActivation();
    });
    msgBus.when('removeMonitor', function() {
        view.destroy();
        model.destroy();
    });
    msgBus.when('newMessage', function() {
        var message = model.currentMessage();
        view.newMessage(message);
    });

    controller.run = function(settings, $thisElement) {
        view.initialize($thisElement);
        model.initialize(settings);
    };

    return controller;
}

function NewAjaxMonitorCoordinator(msgBus, model, service) {
    var coordinator = {};

    msgBus.when('activateService', function() {
        service.activate();
    });

    msgBus.when('deactivateService', function() {
        service.deactivate();
    });

    msgBus.when('isActivated', function() {
        model.setActive();
    });

    msgBus.when('isDeactivated', function() {
        model.setNotActive();
    });

    msgBus.when('messageCompleted', function() {
        var message = service.getCurrentMessage();
        model.addMessage(message);
    });

    msgBus.when('messageBeforeSend', function() {
        var message = service.getCurrentMessage();
        model.addMessage(message);
    });

    msgBus.when('messageError', function() {
        var message = service.getCurrentMessage();
        model.addMessage(message);
    });

    msgBus.when('messageSuccess', function() {
        var message = service.getCurrentMessage();
        model.addMessage(message);
    });

    coordinator.run = function() {

    };

    return coordinator;
}

function NewAjaxMock(responseType, responseData) {
    var xhr = { status: 200 };
    var textStatus = 'success';

    return function(settings) {
        if (settings.beforeSend) {
            settings.beforeSend();
        }
        if (responseType === 'success') {
            if (settings.success) {
                settings.success(responseData);
            }
        }
        else {
            if (settings.error) {
                xhr.status = 404;
                textStatus = 'error';
                settings.error(xhr, responseData);
            }
        }

        if (settings.complete) {
            settings.complete(xhr, textStatus);
        }
    }
}

function NewAjaxMocker(responseType, runTimes, responseData) {
    var mock = {};
    var originalAjax = $.ajax;
    var executionCount = 0;


    $.ajax = function(settings) {
        if (mock.executionCount() < runTimes) {
            var mockedAjax = NewAjaxMock(responseType, responseData);
            mockedAjax(settings);
            executionCount++;
        }
        else {
            $.ajax = originalAjax;
            $.ajax(settings);
        }
    };

    mock.executionCount = function() {
        return executionCount;
    };

    return mock;
}

function NewAjaxMonitorMock(settings, responseData) {
    var monitorMock = {};

    var defaultSettings = {
        succes: true
        ,runTimes: 1
    };

    var changedSettings = defaultSettings;
    if (settings) {
        changedSettings = $.extend({}, defaultSettings, settings);
    }
    var responseType = 'error';
    if (changedSettings.success) {
        responseType = 'success'
    }

    var ajaxMock = NewAjaxMocker(responseType, changedSettings.runTimes, responseData);

    monitorMock.executionCount = function() {
        return ajaxMock.executionCount();
    };

    return monitorMock;
}

(function($) {
    var internalData = {};
    var msgBus = NewMessageBus();
    var view = NewAjaxMonitorView(msgBus);
    var model = NewAjaxMonitorModel(msgBus);
    var stopWatchService = NewStopWatchService;
    var service = NewAjaxMonitorService(msgBus, stopWatchService);

    var controller = NewAjaxMonitorController(msgBus, view, model);
    var coordinator = NewAjaxMonitorCoordinator(msgBus, model, service);


    internalData.version = '1.0.0';
    internalData.plugInName = 'ajaxMonitor';

    $.fn.ajaxMonitor = function(settings) {
        var defaultSettings = {
            monitorActive: false
            ,maximize: false
            // TODO: Not Implemented at this time
            ,refreshRate: 'realtime' // 'realtime', 'fast', 'medium', 'slow', value in mSecs
            // TODO: Not Implemented at this time
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

