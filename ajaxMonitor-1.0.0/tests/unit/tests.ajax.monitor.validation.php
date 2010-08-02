<!DOCTYPE html>
<html>
<head>
    <title>TESTS - Validation jQuery Ajax Monitor Plug-In || GutZofter</title>

    <link rel="stylesheet" href="../../../../qunit/qunit.css" type="text/css" media="screen">
    <link rel="stylesheet" type="text/css" href="../../styles/ajaxMonitor.css" media="all"/>

    <script type="text/javascript" src="../../scripts/jquery-1.4.2.js"></script>
    <script type="text/javascript" src="../../../../qunit/qunit.js"></script>

    <script type="text/javascript" src="../../scripts/ajaxMonitor.msg.bus.js"></script>
    <script type="text/javascript" src="../../scripts/ajaxMonitor.view.js"></script>
    <script type="text/javascript" src="../../scripts/ajaxMonitor.model.js"></script>
    <script type="text/javascript" src="../../scripts/ajaxMonitor.controller.js"></script>
    <script type="text/javascript" src="../../scripts/ajaxMonitor.coordinator.js"></script>
    <script type="text/javascript" src="../../scripts/ajaxMonitor.service.js"></script>
    <script type="text/javascript" src="../../scripts/ajaxMonitor.mock.js"></script>

    <script type="text/javascript" src="../../scripts/jquery.ajaxMonitor.js"></script>

    <script type="text/javascript" src="tests.helper.js"></script>

    <script type="text/javascript" src="tests.ajax.js"></script>


</head>
<body>
    <h1 id="qunit-header">Ajax Monitor Plug-In Validation Test Suite</h1>

    <h2 id="qunit-banner"></h2>

    <div id="qunit-testrunner-toolbar"></div>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>

    <div id="main" style="display: none;">
        <div id="foo">
            <p id="sndp">Everything inside the red border is inside a div with <code>id="foo"</code>.</p>

            <p lang="en" id="en">This is a normal link: <a id="yahoo" href="http://www.yahoo.com/" class="blogTest">Yahoo</a>
            </p>

            <p id="sap">This link has <code><a href="#2" id="anchor2">class="blog"</a></code>: <a
                    href="http://simon.incutio.com/" class="blog link" id="simon">Simon Willison's Weblog</a></p>

        </div>
    </div>

    <div id="ajax_monitor"></div>

</body>

</html>
<script type="text/javascript">
    var monitor = $('#ajax_monitor').ajaxMonitor({ monitorActive: true, maximize: true });
</script>

