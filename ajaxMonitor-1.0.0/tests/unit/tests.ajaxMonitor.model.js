/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 24, 2010
 * Time: 5:22:39 PM
 * To change this template use File | Settings | File Templates.
 */

var NewSettings = function(settings) {
    var defaultSettings = {
        monitorActive: false
        ,maximize: false
        ,settings: false
        ,refreshRate: 'realtime'
        ,useExternalServices: false
    };

    if (settings) {
        $.extend(defaultSettings, settings);
    }

    return defaultSettings;
};

var setup = {
    setup: function() {
        tstMsgBus = NewMessageBus();
        model = NewAjaxMonitorModel(tstMsgBus);
    }
    ,teardown: function() {
    }
};

module('model - initialize', setup);

should('fire minimize default', function() {
    enableActionEvent('minimize');
    enableNullEvent('deactivateService');
    model.initialize(NewSettings({
        maximize: false
    }));
    same(isFired, true, 'minimize');
});

should('fire maximize from settings', function() {
    enableActionEvent('maximize');
    enableNullEvent('deactivateService');
    model.initialize(NewSettings({
        maximize: true
    }));

    same(isFired, true, 'maximize');
});

should('fire activate from settings', function() {
    enableNullEvent('minimize');
    enableActionEvent('activateService');
    model.initialize(NewSettings({
        monitorActive: true
    }));

    same(isFired, true, 'activate');
});

should('fire deactivate from settings', function() {
    enableNullEvent('minimize');
    enableActionEvent('deactivateService');
    model.initialize(NewSettings({
        monitorActive: false
    }));

    same(isFired, true, 'deactivate');
});

should('fire deactivate from toggle activate', function() {
    enableNullEvent('minimize');
    enableNullEvent('activateService');
    model.initialize(NewSettings({
        monitorActive: true
    }));
    
    enableActionEvent('deactivateService');
    model.toggleActivation();

    same(isFired, true, 'deactivate');
});

should('fire activate from toggle activate', function() {
    enableNullEvent('minimize');
    enableNullEvent('activateService');
    model.initialize(NewSettings({
        monitorActive: true
    }));

    enableNullEvent('deactivateService');
    model.toggleActivation();

    removeEvent('activateService');
    enableActionEvent('activateService');
    model.toggleActivation();

    same(isFired, true, 'deactivate');
});

should('fire activate from set active', function() {
    enableActionEvent('activate');
    model.setActive();

    same(isFired, true, 'fire activate');
});

should('fire deactivate from set not active', function() {
    enableActionEvent('deactivate');
    model.setNotActive();

    same(isFired, true, 'fire deactivate');
});

should('fire added message', function() {
    var msg = { "completedStatus": "success" };
    enableActionEvent('newMessage');
    model.addMessage(msg);
    var actualMsg = model.currentMessage();

    same(isFired, true, 'new message');
    same(actualMsg, msg, 'current message');
});

should('fire deactivate service from set not active', function() {
    enableActionEvent('deactivateService');
    model.destroy();

    same(isFired, true, 'fire deactivate service');
});

