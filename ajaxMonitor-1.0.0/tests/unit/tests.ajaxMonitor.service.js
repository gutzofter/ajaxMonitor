/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 25, 2010
 * Time: 10:25:13 AM
 * To change this template use File | Settings | File Templates.
 */
function NewMockStopWatchService() {
    var watch = {};
    var start = 101;
    var stop = 0;

    watch.start = function() {
        start = 0;
    };

    watch.stop = function() {
        stop = 100;
    };

    watch.elapsed = function() {
        var eStop = stop;
        var eStart = start;
        stop = 101;
        start = 0;
        return eStop - eStart;
    };

    return watch;
}

var setup = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = NewAjaxMonitorService(tstMsgBus, NewMockStopWatchService);
    }
    ,teardown: function() {
        removeEvent('isDeactivated');
        enableNullEvent('isDeactivated');
        service.deactivate();
    }
};

module('service', setup);

should('fire is activated', function() {
    enableActionEvent('isActivated');
    service.activate();
    same(isFired, true, 'is activated');
});

should('fire is deactivated', function() {
    enableActionEvent('isDeactivated');
    service.deactivate();
    same(isFired, true, 'is deactivated');
});

var setupWithAjaxActivated = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = NewAjaxMonitorService(tstMsgBus, NewMockStopWatchService);
    }
    ,teardown: function() {
    }
};

module('service - ajax activated', setupWithAjaxActivated);

should('execute ajax request', function() {
    var success = false;
    var completedStatus = '';

    enableNullEvent('isActivated');
    enableNullEvent('messageCompleted');
    service.activate();

    var serverResponse = { status: 'success'};
    var mock = NewAjaxMonitorMock(
    {
        success: true
        ,runTimes: 1
    }, serverResponse);

    $.ajax({
        type:           'GET'
        ,url:           '../../server_side.php'
        ,async:         false
        ,dataType:      'json'
        ,beforeSend:    function() {
            success = false
        }
        ,complete:      function(request, status) {
            completedStatus = status;
        }
        ,success:       function(response) {
            if (response.status === 'success') {
                success = true;
            }
        }
    });

    same(completedStatus, 'success', 'status is ');
    same(success, true, 'response received');
});

var setupForCallbackFunctions = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = NewAjaxMonitorService(tstMsgBus, NewMockStopWatchService);
    }
    ,teardown: function() {
        service.unwrapAjax();
    }
};

module('service - ajax monitor functions', setupForCallbackFunctions);

should('execute complete wrapper without function', function() {
    enableActionEvent('messageCompleted');
    var index = 0;
    service.addMessage(index, null);

    var complete = service.monitorComplete(null, index, NewMockStopWatchService());
    complete();

    same(isFired, true, 'message completed');
});

should('execute complete wrapper with function', function() {
    var completeIsExecuted = false;
    var index = 0;
    service.addMessage(index, null);

    enableActionEvent('messageCompleted');

    var complete = service.monitorComplete(function() {
        completeIsExecuted = true;
    }, index, NewMockStopWatchService());

    complete();

    same(isFired, true, 'message completed');
    same(completeIsExecuted, true, 'complete executed');
});

should('get unexpected completion message', function() {
    enableNullEvent('messageCompleted');
    var index = 0;
    service.addMessage(index, null);

    var expectedMessage = {
        "id":               -1
        ,"requestStatus": 'completed'
        ,"completedStatus":  "unexpected"
        ,"timeToComplete":  -1
    };

    var complete = service.monitorComplete(NullFn, index, NewMockStopWatchService());

    complete(null, 'success');

    var message = service.getCurrentMessage();

    same(message, expectedMessage, 'message is ');
});

module('service - before send message', setupForCallbackFunctions);

should('get beforeSend message', function() {
    enableNullEvent('messageBeforeSend');
    var index = 0;
    service.addMessage(index, null);

    var expectedMessage = {
        "id":               -1
        ,"requestStatus": 'beforeSend'
        ,"completedStatus":  "unexpected"
        ,"timeToComplete":  -1
    };

    var beforeSend = service.monitorBeforeSend(NullFn, index, NewMockStopWatchService());

    beforeSend(null);

    var message = service.getCurrentMessage();

    same(message, expectedMessage, 'message is ');
});

module('service - error message', setupForCallbackFunctions);

should('get error message', function() {
    enableNullEvent('messageError');
    var index = 0;
    service.addMessage(index, null);

    var expectedMessage = {
        "id":               -1
        ,"requestStatus": 'error'
        ,"completedStatus":  "unexpected"
        ,"timeToComplete":  -1
    };

    var error = service.monitorError(NullFn, index, null);

    error(null);

    var message = service.getCurrentMessage();

    same(message, expectedMessage, 'message is ');
});

should('get success message', function() {
    enableNullEvent('messageSuccess');
    var index = 0;
    service.addMessage(index, null);

    var expectedMessage = {
        "id":               -1
        ,"requestStatus": 'success'
        ,"completedStatus":  "unexpected"
        ,"timeToComplete":  -1
    };

    var success = service.monitorSuccess(NullFn, index, null);

    success(null);

    var message = service.getCurrentMessage();

    same(message, expectedMessage, 'message is ');
});

var mock = {};

var setupForAllMessages = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = NewAjaxMonitorService(tstMsgBus, NewMockStopWatchService);
        var serverResponse = { status: 'success'};
        mock = NewAjaxMonitorMock(
        {
            success: true
            ,runTimes: 100
        }, serverResponse);

        service.wrapAjax();
    }
    ,teardown: function() {
        service.unwrapAjax();
        //'makes sure that global space shows that monitor is not wrapping ***** this is very critical *****'
        same(service.isActiveCount(), 0, 'service is deactivated all wrapping is gone');
    }
};

module('service - complete request messages', setupForAllMessages);

should('get completion message for post request', function() {
    enableActionEvent('messageBeforeSend');
    enableActionEvent('messageSuccess');
    enableActionEvent('messageCompleted');

    var expectedMessage = {
        "id":                   0
        ,"requestStatus":       "completed"
        ,"completedStatus":     "success"
        ,"timeToComplete":      100
        ,"requestType":         "POST [Monitored]"
        ,dataType:              'smart'
        ,"url":                 '../../server_side.php'
        ,"statusHTTP":          200
    };

    getAjaxServerRequest({});

    var message = service.getCurrentMessage();

    same(message, expectedMessage, 'message is ');
    same(eventFired.messageBeforeSend, true, 'before sent event fired');
    same(eventFired.messageSuccess, true, 'sucess event fired');
    same(eventFired.messageCompleted, true, 'complete event fired');
});

should('get second completion message', function() {
    enableNullEvent('messageBeforeSend');
    enableNullEvent('messageSuccess');
    enableNullEvent('messageCompleted');
    var expectedMessage = {
        "id":               1
    };

    getAjaxServerRequest({});
    getAjaxServerRequest({});

    var message = service.getCurrentMessage();

    same(message.id, expectedMessage.id, 'message id is ');
});

should('validate that timing is not getting mangled and only the correct events are fired and no others', function() {
    enableActionEvent('messageBeforeSend');
    enableActionEvent('messageSuccess');
    enableActionEvent('messageCompleted');
    enableActionEvent('messageError');

    var message = {};

    var expectedMessage = {
        "timeToComplete": 100
    };

    var defaultSettings = {
        type:           'POST'
        ,url:           '../../server_side.php'
        ,async:         false
        ,dataType:      'json'
        ,beforeSend:    function() {
        }
        ,complete:      function() {
        }
        ,success:       function() {
        }
    };

    $.ajax(defaultSettings);
    message = service.getCurrentMessage();
    same(message.timeToComplete, expectedMessage.timeToComplete, 'message id is ');

    $.ajax(defaultSettings);
    message = service.getCurrentMessage();

    same(message.timeToComplete, expectedMessage.timeToComplete, 'message id is ');
    same(eventFiredCounter.messageBeforeSend, 2, 'before send');
    same(eventFiredCounter.messageSuccess, 2, 'success');
    same(eventFiredCounter.messageCompleted, 2, 'completed');
    same(eventFiredCounter.messageError, 0, 'error');
});

should('specify default request type of GET if no request type is specified', function() {
    enableNullEvent('messageBeforeSend');
    enableNullEvent('messageSuccess');
    enableNullEvent('messageCompleted');

    var message = {};

    var expectedMessage = {
        "requestType": 'GET [Monitored]'
    };

    var defaultSettings = {
        url:           '../../server_side.php'
        ,async:         false
        ,dataType:      'json'
        ,beforeSend:    function() {
        }
        ,complete:      function() {
        }
        ,success:       function() {
        }
    };

    var xhr = $.ajax(defaultSettings);
    message = service.getCurrentMessage();
    same(message.requestType, expectedMessage.requestType, 'message request type is ');
});

should('verify that .ajax returns xhr reuqest object', function() {
    enableNullEvent('messageBeforeSend');
    enableNullEvent('messageSuccess');
    enableNullEvent('messageCompleted');

    var message = {};

    var expectedMessage = {
        "requestType": 'GET [Monitored]'
    };

    var defaultSettings = {
        url:           '../../server_side.php'
        ,async:         false
        ,dataType:      'json'
        ,beforeSend:    function() {
        }
        ,complete:      function() {
        }
        ,success:       function() {
        }
    };

    var xhr = $.ajax(defaultSettings);
    same(xhr.status, 200, 'xhr status is 200');

});

should('specify abort in message (beforeSend, cancel request)', function() {
    enableNullEvent('messageBeforeSend');
    enableNullEvent('messageSuccess');
    enableNullEvent('messageCompleted');

    var message = {};

    var expectedMessage = {
        "statusHTTP": 'abort'
    };

    var defaultSettings = {
        url:           '../../server_side.php'
        ,async:         false
        ,dataType:      'json'
        ,beforeSend:    function() {
            return false;
        }
        ,complete:      function() {
        }
        ,success:       function() {
        }
    };

    var xhr = $.ajax(defaultSettings);
    message = service.getCurrentMessage();
    same(message.statusHTTP, expectedMessage.statusHTTP, 'message request type is ');
});

should("maintain context with ajax events", function() {
    expect(4); // don't forget expectation in teardown

    stop();
    enableNullEvent('messageBeforeSend');
    enableNullEvent('messageSuccess');
    enableNullEvent('messageCompleted');

    var context = document.createElement("div");

    function callback(msg) {
        return function() {
            equals(this, context, "context is preserved on callback " + msg);
        };
    }

    $.ajax({
        url: 'data/name.html',
        beforeSend: callback("beforeSend"),
        success: callback("success"),
        error: callback("error"),
        complete: function() {
            callback("complete").call(this);
            start();
        },
        context: context
    });
});

should('specify abort in message (beforeSend, cancel request)', function() {
    enableNullEvent('messageBeforeSend');
    enableNullEvent('messageSuccess');
    enableNullEvent('messageCompleted');

    var message = {};

    var expectedMessage = {
        "statusHTTP": 'abort'
    };

    var defaultSettings = {
        url:           '../../server_side.php'
        ,async:         false
        ,dataType:      'json'
        ,beforeSend:    function() {
            return false;
        }
        ,complete:      function() {
        }
        ,success:       function() {
        }
    };

    var xhr = $.ajax(defaultSettings);
    message = service.getCurrentMessage();
    same(message.statusHTTP, expectedMessage.statusHTTP, 'message request type is ');
});

should('specify abort in message abort request object', function() {
    enableNullEvent('messageBeforeSend');
    enableNullEvent('messageSuccess');
    enableNullEvent('messageCompleted');

    var message = {};

    var expectedMessage = {
        "completedStatus": 'abort'
    };

    var waitTime = 100;

    var defaultSettings = {
        url:           '../../server_side.php?wait=5'
        ,async:         false
        ,dataType:      'json'
        ,beforeSend:    function() {
        }
        ,complete:      function() {
        }
        ,success:       function() {
        }
        ,wait:          waitTime
    };

    var xhr = $.ajax(defaultSettings);
    xhr.abort();

    stop(2000);
    setTimeout(stopper, waitTime);

    function stopper() {
        message = service.getCurrentMessage();
        same(message.completedStatus, expectedMessage.completedStatus, 'message request type is ');
        start();
    }
});


should('get wrappped count', function() {
    same(service.isActiveCount(), 1, 'service is activated count');
});

var setupForMockMessages = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = NewAjaxMonitorService(tstMsgBus, NewMockStopWatchService);
        service.wrapAjax();
    }
    ,teardown: function() {
        service.unwrapAjax();
        //'makes sure that global space shows that monitor is not wrapping ***** this is very critical *****'
        same(service.isActiveCount(), 0, 'service is deactivated all wrapping is gone');
    }
};

module('Service - mock capabilities', setupForMockMessages);

should('have standard monitored request with mocking on request being false', function() {
    enableActionEvent('messageBeforeSend');
    enableActionEvent('messageSuccess');
    enableActionEvent('messageCompleted');

    var expectedMessage = {
        "requestType":         "POST [Monitored]"
        ,"timeToComplete":      100
    };

    getAjaxServerRequest({ mock: false });
    var message = service.getCurrentMessage();
    same(message.requestType, expectedMessage.requestType);
    same(message.timeToComplete, expectedMessage.timeToComplete);

    same(eventFiredCounter.messageBeforeSend, 1, 'before send');
    same(eventFiredCounter.messageSuccess, 1, 'success');
    same(eventFiredCounter.messageCompleted, 1, 'completed');
});

should('verify mocked ajax request returns xhr object', function() {
    enableActionEvent('messageBeforeSend');
    enableActionEvent('messageSuccess');
    enableActionEvent('messageCompleted');

    var xhr = $.ajax({ mock: true });

    same(xhr.status, 200, 'request status is ')

});

should('mock all monitored request', function() {
    enableNullEvent('messageBeforeSend');
    enableNullEvent('messageSuccess');
    enableNullEvent('messageCompleted');
    enableNullEvent('messageError');

    var message = {};

    var expectedMessage = {
        "requestType":         "POST [Monitored - Mock]"
        ,"timeToComplete":      100
    };

    getAjaxServerRequest({ mock: true });
    message = service.getCurrentMessage();
    getAjaxServerRequest({ mock: true });
    message = service.getCurrentMessage();
    same(message.requestType, expectedMessage.requestType);
    same(message.timeToComplete, expectedMessage.timeToComplete);
    same(message.id, 1);
});

module('stopwatch - located in service tests');

should('get me my time', function() {
    var stopWatch = NewStopWatchService();
    stopWatch.start();

    var x = 0;
    for (var i = 0; i < 1000000; i++) {
        x = i;
    }
    stopWatch.stop();
    var elapsedTime = stopWatch.elapsed();

    same(x, 999999);
    same(elapsedTime > 0, true, 'elapsed time is ' + elapsedTime);
});

should('verify that without start elapsed === -1', function() {
    var stopWatch = NewStopWatchService();

    var time = stopWatch.elapsed();

    same(time, -1, 'no start');

});

should('verify that without stop elapsed === -1', function() {
    var stopWatch = NewStopWatchService();

    stopWatch.stop();
    var time = stopWatch.elapsed();


    same(time, -1, 'no start');

});

should('verify that with start and without stop elapsed === -1', function() {
    var stopWatch = NewStopWatchService();

    stopWatch.start();
    var time = stopWatch.elapsed();

    same(time, -1, 'start/no stop');
});

should('verify that with start and with stop elapsed resets start stop', function() {
    var stopWatch = NewStopWatchService();

    stopWatch.start();
    stopWatch.stop();
    stopWatch.elapsed();
    var time = stopWatch.elapsed();


    same(time, -1, 'start/no stop');

});

