/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 25, 2010
 * Time: 10:25:13 AM
 * To change this template use File | Settings | File Templates.
 */
var mockStopWatch = {
    start: function() {}
    ,stop: function() {}
    ,elapsed: function() { return 100; }
};

var setup = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = NewAjaxMonitorService(tstMsgBus, mockStopWatch);
    }
    ,teardown: function() {
        removeEvent('isDeactivated');
        setDummyEvent('isDeactivated');
        service.deactivate();
    }
};

module('service', setup);

should('fire is activated', function() {
    setFireEvent('isActivated');
    service.activate();
    same(isFired, true, 'is activated');
});

should('fire is deactivated', function() {
    setFireEvent('isDeactivated');
    service.deactivate();
    same(isFired, true, 'is deactivated');
});

var setupWithAjaxActivated = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = NewAjaxMonitorService(tstMsgBus, mockStopWatch);
    }
    ,teardown: function() {
    }
};

module('service - ajax activated', setupWithAjaxActivated);

should('execute ajax request', function() {
    var success = false;
    var completedStatus = '';

    setDummyEvent('isActivated');
    setDummyEvent('messageCompleted');
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
        service = NewAjaxMonitorService(tstMsgBus, mockStopWatch);
    }
    ,teardown: function() {
        service.unwrapAjax();
    }
};

module('service - ajax monitor functions', setupForCallbackFunctions);

should('execute complete wrapper without function', function() {
    setFireEvent('messageCompleted');

    var complete = service.monitorComplete(null, 0);
    complete();

    same(isFired, true, 'message completed');
});

should('execute complete wrapper with function', function() {
    var completeIsExecuted = false;

    setFireEvent('messageCompleted');

    var complete = service.monitorComplete(function() {
        completeIsExecuted = true;
    }, 0);

    complete();

    same(isFired, true, 'message completed');
    same(completeIsExecuted, true, 'complete executed');
});

should('get unexpected completion message', function() {
    setDummyEvent('messageCompleted');
    var expectedMessage = {
        "id":               -1
        ,"requestStatus": 'completed'
        ,"completedStatus":  "unexpected"
        ,"timeToComplete":  -1
    };

    var complete = service.monitorComplete(function() {}, 0);

    complete(null, 'success');

    var message = service.getMessage();

    same(message, expectedMessage, 'message is ');
});

var mock = {};

var setupForCompletedMessages = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = NewAjaxMonitorService(tstMsgBus, mockStopWatch);
        var serverResponse = { status: 'success'};
        mock = NewAjaxMonitorMock(
        {
            success: true
            ,runTimes: 1
        }, serverResponse);

        service.wrapAjax();
    }
    ,teardown: function() {
        service.unwrapAjax();
        //'makes sure that global space shows that monitor is not wrapping ***** this is very critical *****'
        same(service.isActiveCount(), 0, 'service is deactivated all wrapping vestiges is gone');
    }
};

module('service - complete messages', setupForCompletedMessages);

should('get completion message', function() {
    setDummyEvent('messageCompleted');
    var expectedMessage = {
        "id":                   0
        ,"requestStatus":       "completed"
        ,"completedStatus":     "success"
        ,"timeToComplete":      100
        ,"requestType":         "*POST*"
    };

    getAjaxServerRequest({});

    var message = service.getMessage();

    same(message, expectedMessage, 'message is ');
});

should('get second completion message', function() {
    setDummyEvent('messageCompleted');
    var expectedMessage = {
        "id":               1
    };

    getAjaxServerRequest({});
    getAjaxServerRequest({});

    var message = service.getMessage();

    same(message.id, expectedMessage.id, 'message id is ');
});

should('get wrappped count', function() {
    same(service.isActiveCount(), 1, 'service is activated count');
});

module('stopwatch - located in service tests');

should('get me my time', function() {
    var stopWatch = NewStopWatch();
    stopWatch.start();

    var x = 0;
    for( var i = 0; i < 1000000; i++) {
        x = i;
    }
    stopWatch.stop();
    var elapsedTime = stopWatch.elapsed();

    same(x, 999999);
    same(elapsedTime > 0, true, 'elapsed time is ' + elapsedTime);
});

