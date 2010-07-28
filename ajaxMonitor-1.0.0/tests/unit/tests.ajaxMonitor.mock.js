/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 26, 2010
 * Time: 3:01:02 PM
 * To change this template use File | Settings | File Templates.
 */

module('mock');

should('be able to intercept ajax calls', function() {
    same(service.isActiveCount(), 0, 'no service should be running');
    
    var serverResponse = { status: 'success'};

    var mock = NewAjaxMonitorMock(
    {
        success: true
        ,runTimes: 2
    }, serverResponse);


    same(getAjaxServerRequest(), true, 'mock ajax passed ');
    same(mock.executionCount(), 1);
    same(getAjaxServerRequest(), true, 'mock ajax passed ');
    same(mock.executionCount(), 2);
    same(getAjaxServerRequest(), true, 'real ajax passed ');
    same(mock.executionCount(), 2);
});

