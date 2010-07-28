/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 24, 2010
 * Time: 4:43:34 PM
 * To change this template use File | Settings | File Templates.
 */

var setup = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        view = {
            initialize: function() {
            }
        };
        model = {
            initialize: function() {
            }
        };
        controller = NewAjaxMonitorController(tstMsgBus, view, model);
    }
    ,teardown: function() {
    }
};


module('controller', setup);

should('fire minimize', function() {
    mockViewMethod('minimize');

    tstMsgBus.fire.minimize();

    same(isViewFiredOn, true);

});

should('fire maximize', function() {
    mockViewMethod('maximize');

    tstMsgBus.fire.maximize();

    same(isViewFiredOn, true);

});

should('fire activation', function() {
    mockViewMethod('setActive');

    tstMsgBus.fire.activate();

    same(isViewFiredOn, true);

});

should('fire no activation', function() {
    mockViewMethod('setNotActive');

    tstMsgBus.fire.deactivate();

    same(isViewFiredOn, true);

});

should('fire toggle activation', function() {
    mockModelMethod('toggleActivation');

    tstMsgBus.fire.toggleActivation();

    same(isModelFiredOn, true);
});

should('fire remove monitor', function() {
    mockModelMethod('destroy');
    mockViewMethod('destroy');

    tstMsgBus.fire.removeMonitor();

    same(isViewFiredOn, true);
    same(isModelFiredOn, true);
});

should('fire new message', function() {
    mockViewMethod('newMessage');
    mockModelMethod('currentMessage');

    tstMsgBus.fire.newMessage();

    same(isViewFiredOn, true);
});

