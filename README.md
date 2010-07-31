#ajaxMonitor#

##jQuery Plugin-in for monitoring ajax requests##

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

###Link to Work in progrss###
<a href="http://gutzofter.herobo.com/ajaxMonitor/" />

###Screen Shot###
<img src="http://gutzofter.herobo.com/ajaxMonitor/ajaxMonitor-1.0.0/images/screenshot.JPG"/>

