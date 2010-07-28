/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 24, 2010
 * Time: 3:38:11 PM
 * To change this template use File | Settings | File Templates.
 */

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

