/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 24, 2010
 * Time: 4:52:29 PM
 * To change this template use File | Settings | File Templates.
 */

function NewEventExistsException(eventName) {
    return {
        name: 'Event Already Exists Error'
        ,message: 'An event by the name of [' + eventName + '] already exists. Try another name.'
    }
}
 
function NewMessageBus() {
    var msgBus = {};

    msgBus.when = function(name, fn) {
        if (this.fire[name]) {
            throw NewEventExistsException(name);
        }
        else {
            this.fire[name] = fn;
        }
    };

    msgBus.fire = {};

    return msgBus;
}

