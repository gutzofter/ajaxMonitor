/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 24, 2010
 * Time: 3:38:11 PM
 * To change this template use File | Settings | File Templates.
 */

function NewAjaxMonitorModel(msgBus) {
    var model = {};
    var isActive = false;
    var settings = {};
    var isActivated = false;

    var currentMessage = {};

    model.initialize = function(initSettings) {
        settings = initSettings;
        if(settings.maximize) {
            msgBus.fire.maximize();
        }
        else {
            msgBus.fire.minimize();
        }

        isActivated = settings.monitorActive;
        model.processActivation(isActivated);
    };

    model.toggleActivation = function() {
        isActivated = !isActivated;
        model.processActivation(isActivated);
    };

    model.isActiveCount = function() {
        return isActive;
    };

    model.processActivation = function(shouldActivate) {
        if(shouldActivate) {
            msgBus.fire.activateService();
        }
        else {
            msgBus.fire.deactivateService();
        }
    };

    model.setNotActive = function() {
        msgBus.fire.deactivate();
    };

    model.setActive = function() {
        msgBus.fire.activate();
    };

    model.destroy = function() {
        msgBus.fire.deactivateService();
    };

    model.addMessage = function(message) {
        currentMessage = message;
        msgBus.fire.newMessage();
    };

    model.currentMessage = function() {
        return currentMessage;
    };
    
    return model;
}

