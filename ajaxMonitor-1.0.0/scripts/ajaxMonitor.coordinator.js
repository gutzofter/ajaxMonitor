/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 25, 2010
 * Time: 10:23:33 AM
 * To change this template use File | Settings | File Templates.
 */

function NewAjaxMonitorCoordinator(msgBus, model, service) {
    var coordinator = {};

    msgBus.when('activateService', function() {
        service.activate();
    });

    msgBus.when('deactivateService', function() {
        service.deactivate();
    });

    msgBus.when('isActivated', function() {
        model.setActive();
    });

    msgBus.when('isDeactivated', function() {
        model.setNotActive();
    });

    msgBus.when('messageCompleted', function() {
        var message = service.getCurrentMessage();
        model.addMessage(message);
    });

    msgBus.when('messageBeforeSend', function() {
        var message = service.getCurrentMessage();
        model.addMessage(message);
    });

    msgBus.when('messageError', function() {
        var message = service.getCurrentMessage();
        model.addMessage(message);
    });

    msgBus.when('messageSuccess', function() {
        var message = service.getCurrentMessage();
        model.addMessage(message);
    });

    coordinator.run = function() {

    };
    
    return coordinator;
}
