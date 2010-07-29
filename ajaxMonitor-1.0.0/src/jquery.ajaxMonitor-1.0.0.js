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
        var tableEntry = view.formatMessageHTML(message);
        $('#monitor_table tbody').append(tableEntry);
    };

    view.formatColumnHTML = function() {
        var columns = '<tr>';

        columns += view.formatColumnItemHTML('Id', 10);
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

    view.formatMessageHTML = function(message) {
        var tableEntry = '<tr>';

        tableEntry += view.formatMessageItemHTML(message.id);
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
        var message = service.getMessage();
        model.addMessage(message);
    });

    coordinator.run = function() {

    };

    return coordinator;
}

function NewAjaxMock(responseType, runTimes, responseData) {
    var mock = {};
    var originalAjax = $.ajax;
    var executionCount = 0;

    $.ajax = function(settings) {
        if(executionCount < runTimes) {
            if (settings.beforeSend) {
                settings.beforeSend();
            }
            if (settings.success) {
                settings.success(responseData);
            }
            if (settings.complete) {
                if(responseType === 'success') {
                    settings.complete(null, 'success');
                }
                else {
                    settings.complete(null, 'error');
                }
            }
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
    if(changedSettings.success) {
        responseType = 'success'
    }

    var ajaxMock = NewAjaxMock(responseType, changedSettings.runTimes, responseData);

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

