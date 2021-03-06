/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 25, 2010
 * Time: 12:52:02 PM
 * To change this template use File | Settings | File Templates.
 */
var controller = {};
var view = {};
var model = {};
var tstMsgBus = {};
var service = {};

var isFired = false;

var eventFired = {};
var eventFiredCounter = {};

var isServiceFiredOn = false;
var isViewFiredOn = false;
var isModelFiredOn = false;

function NullFn() {}

function mockViewMethod(name) {
    isViewFiredOn = false;
    view[name] = function() {
        isViewFiredOn = true;
    };
}

function mockModelMethod(name) {
    isModelFiredOn = false;
    model[name] = function() {
        isModelFiredOn = true;
    };
}

function mockServiceMethod(name) {
    isServiceFiredOn = false;
    service[name] = function() {
        isServiceFiredOn = true;
    };
}

function removeEvent(name) {
    if(tstMsgBus.fire[name]) {
        tstMsgBus.fire[name] = undefined;
    }
}

function enableNullEvent(name) {
    tstMsgBus.when(name, function() {
    });
}

function enableActionEvent(name) {
    eventFired[name] = false;
    eventFiredCounter[name] = 0;
    isFired = false;
    tstMsgBus.when(name, function() {
        isFired = true;
        eventFired[name] = true;
        eventFiredCounter[name]++;
    });
}

function extend(a, b) {
    var newExtendedProperties = {};
    var prop;

    for (prop in a) {
        newExtendedProperties[prop] = a[prop];
    }

    for (prop in b) {
        newExtendedProperties[prop] = b[prop];
    }

    return newExtendedProperties;
}


function getAjaxServerRequest(settings) {
    var success = false;
    var completedStatus = '';
    var responseStatus = '';

    var defaultSettings = {
        type:           'POST'
        ,url:           '../../server_side.php'
        ,async:         false
        ,beforeSend:    function() {
            success = false;
            completedStatus = '';
            responseStatus = '';
        }
        ,complete:      function(request, status) {
            completedStatus = status;
        }
        ,success:       function(response) {
            responseStatus = response.status;
            if (response.status === 'success') {
                success = true;
            }
        }
    };

    var changedSettings = extend(defaultSettings, settings);
    $.ajax(changedSettings);

    return ((completedStatus === 'success') && (responseStatus === 'success') && (success === true));

}

