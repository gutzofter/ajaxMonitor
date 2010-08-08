#ajaxMonitor#

##jQuery 1.4.2 Plugin-in for monitoring ajax requests##

To use the plug-in you just add three things to your present page.
Oh, and if you don't want the default settings, chcnge them.

  1. Script tag for including plug-in.

    <script type="text/javascript" src="../../../src/jquery.ajaxMonitor-1.0.0.js"></script>

  2. A div tag in the body of your page.

    <div id="ajax_monitor"></div>

  3. Execute the plug-in when executing the jQuery ready function

    <script type="text/javascript">
        $(function() {
            var monitor = $('#ajax_monitor').ajaxMonitor({
                monitorActive: true
                ,maximize: true});
        });
    </script>


###Default settings###
        var defaultSettings = {
            monitorActive: false
            ,maximize: false
        };

*maximize: [true/false]*

True value allows the view to be maximized at initialization of plug-in

*monitorActive: [true/false]*

True value allows the monitor to be activated at initialization of plug-in

###Usage###

Default:

        var = $('selector').ajaxMonitor();

Over-riding default:

        var $ajaxMonitor = $('#ajax_monitor').ajaxMonitor({
            maximize: true,
            monitorActive: true
        });

###Unit tests so far...###
<a href="http://gutzofter.herobo.com/ajaxMonitor/ajaxMonitor-1.0.0/tests/unit/tests.ajax.monitor.php">Ajax Monitor Plug-In Test Suite</a>

###Link to Work in progrss###
<a href="http://gutzofter.herobo.com/ajaxMonitor/">AjaxMonitor</a>

###Screen Shot###
<img src="http://gutzofter.herobo.com/ajaxMonitor/ajaxMonitor-1.0.0/images/screenshot.JPG"/>

##Outstanding Issues##
The issues have been addressed by my file 'src/jquery-1.4.2.modified.js'

1. In order to monitor JSONP requests properly you will need to make modifications to the `complete` handler of $.ajax.
Because jQuery 1.4.2 executes the complete callback twice during the request. See here for bug ticket #5383.

2. FF 3.6.8 returns an xhr.status === 0 when server replies with HTTP code if 301.
The fix requires changeing `httpSuccess` function of $.ajax

