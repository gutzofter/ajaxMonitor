/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 26, 2010
 * Time: 3:00:33 PM
 * To change this template use File | Settings | File Templates.
 */

function NewAjaxMock(responseType, responseData) {
    var mockSettings = {};

    var isNotAbort = true;

    var xhr = {
        status: 200
        ,abort: function() {
            isNotAbort = false;
        }
    };

    var textStatus = 'success';

    function executeResponse() {
        if (isNotAbort) {
            if (responseType === 'success') {
                if (mockSettings.success) {
                    mockSettings.success.call(this, responseData);
                }
            }
            else {
                if (mockSettings.error) {
                    xhr.status = 404;
                    textStatus = 'error';
                    mockSettings.error.call(this, xhr, responseData);
                }
            }

            if (mockSettings.complete) {
                mockSettings.complete.call(this, xhr, textStatus);
            }
        }
        else {
            if (mockSettings.complete) {
                textStatus = 'abort';
                mockSettings.complete.call(this, xhr, textStatus);
            }
         }

        return xhr;
    }

    return function(settings) {
        mockSettings = $.extend(true, {}, settings);
        var callbackContext = settings && settings.context || mockSettings;

        if (settings.beforeSend) {

            if (mockSettings.beforeSend.call(callbackContext) === false) {
                return false;
            }
        }

        if (mockSettings.wait) {
            //todo: setup timer
            setTimeout(executeResponse, mockSettings.wait);
        }
        else {
            xhr = executeResponse.call(callbackContext);
        }

        return xhr;
    };

}

function NewAjaxMocker(responseType, runTimes, responseData) {
    var mock = {};
    var originalAjax = $.ajax;
    var executionCount = 0;
    var xhr = {};


    $.ajax = function(settings) {

        if (mock.executionCount() < runTimes) {
            var mockedAjax = NewAjaxMock(responseType, responseData);
            xhr = mockedAjax.call(this, settings);
            executionCount++;
            return xhr;
        }
        else {
            $.ajax = originalAjax;
            xhr = $.ajax.call(this, settings);
            return xhr;
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

