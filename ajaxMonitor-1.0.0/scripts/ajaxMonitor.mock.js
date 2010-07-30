/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 26, 2010
 * Time: 3:00:33 PM
 * To change this template use File | Settings | File Templates.
 */

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

