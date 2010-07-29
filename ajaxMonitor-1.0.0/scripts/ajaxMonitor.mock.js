/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 26, 2010
 * Time: 3:00:33 PM
 * To change this template use File | Settings | File Templates.
 */

function NewAjaxMock(responseType, runTimes, responseData) {
    var mock = {};
    var originalAjax = $.ajax;
    var executionCount = 0;
    var xhr = { status: 200 };

    $.ajax = function(settings) {
        if(executionCount < runTimes) {
            if (settings.beforeSend) {
                settings.beforeSend();
            }
            if(settings.error) {
                settings.error(xhr, responseData);
            }
            if (settings.success) {
                settings.success(responseData);
            }
            if (settings.complete) {
                if(responseType === 'success') {
                    settings.complete(xhr, 'success');
                }
                else {
                    settings.complete(xhr, 'error');
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

