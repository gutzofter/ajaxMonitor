/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 25, 2010
 * Time: 10:24:31 AM
 * To change this template use File | Settings | File Templates.
 */

module('Message Bus - located in coordinator tests');

should('catch message bus exception with duplicate event names', function() {
    var msgBus = NewMessageBus();

    msgBus.when('event', function() {
    });

    try {
        msgBus.when('event', function() {
        });
        ok(false, 'should never get here because of exception');
    }
    catch(e) {
        same(e.name, 'Event Already Exists Error');
        same(e.message, 'An event by the name of [event] already exists. Try another name.')
    }
});

should('fire message', function() {
    var msgBus = NewMessageBus();

    var isFired = false;

    msgBus.when('event', function() {
        isFired = true;
    });

    try{
        msgBus.fire.event();
    }
    catch(e) {
        ok(false, 'should never fail to fire');
    }

    same(isFired, true, 'event fired correctly');

});

var setup = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        service = {
            initialize: function() {
            }
        };
        model = {
            initialize: function() {
            }
        };
        controller = NewAjaxMonitorCoordinator(tstMsgBus, model, service);
    }
    ,teardown: function() {
    }
};


module('coordinator', setup);

should('fire activate service', function() {
    mockServiceMethod('activate');

    tstMsgBus.fire.activateService();

    same(isServiceFiredOn, true);

});

should('fire deactivate service', function() {
    mockServiceMethod('deactivate');

    tstMsgBus.fire.deactivateService();

    same(isServiceFiredOn, true);

});

should('fire isActivated', function() {
    mockModelMethod('setActive');

    tstMsgBus.fire.isActivated();

    same(isModelFiredOn, true);

});

should('fire isDeactivated', function() {
    mockModelMethod('setNotActive');

    tstMsgBus.fire.isDeactivated();

    same(isModelFiredOn, true);
});

should('fire isDeactivated', function() {
    mockModelMethod('setNotActive');

    tstMsgBus.fire.isDeactivated();

    same(isModelFiredOn, true);
});

should('fire messageReady', function() {
    mockModelMethod('addMessage');
    mockServiceMethod('getMessage');

    tstMsgBus.fire.messageReady();

    same(isModelFiredOn, true);
});

