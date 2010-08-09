<!DOCTYPE html>
<html>
<head>
    <title>TESTS - Validation jQuery Ajax Monitor Plug-In || GutZofter</title>

    <link rel="stylesheet" href="../../../../../qunit/qunit.css" type="text/css" media="screen">
    <link rel="stylesheet" type="text/css" href="../../../styles/ajaxMonitor.css" media="all"/>

</head>
<body>
    <h1 id="qunit-header">Ajax Monitor Plug-In Validation Test Suite</h1>
    <h2 id="qunit-banner"></h2>
    <div id="qunit-testrunner-toolbar"></div>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>

    <dl id="dl" style="display:none;">
    <div id="main" style="display: none;">
        <p id="firstp">See <a id="simon1" href="http://simon.incutio.com/archive/2003/03/25/tests.ajax.monitor.validation.php#getElementsBySelector" rel="bookmark">this blog entry</a> for more information.</p>
        <p id="ap">
            Here are some links in a normal paragraph: <a id="google" href="http://www.google.com/" title="Google!">Google</a>,
            <a id="groups" href="http://groups.google.com/" class="GROUPS">Google Groups (Link)</a>.
            This link has <code><a href="http://smin" id="anchor1">class="blog"</a></code>:
            <a href="http://diveintomark.org/" class="blog" hreflang="en" id="mark">diveintomark</a>

        </p>
        <div id="gutz_foo" >gutz was here!</div>
        <div id="foo">
            <p id="sndp">Everything inside the red border is inside a div with <code>id="foo"</code>.</p>
            <p lang="en" id="en">This is a normal link: <a id="yahoo" href="http://www.yahoo.com/" class="blogTest">Yahoo</a></p>
            <p id="sap">This link has <code><a href="index.php#2" id="anchor2">class="blog"</a></code>: <a href="http://simon.incutio.com/" class="blog link" id="simon">Simon Willison's Weblog</a></p>

        </div>
        <span id="name+value"></span>
        <p id="first">Try them out:</p>
        <ul id="firstUL"></ul>
        <ol id="empty"></ol>
        <form id="form" action="formaction">
            <label for="action" id="label-for">Action:</label>
            <input type="text" name="action" value="Test" id="text1" maxlength="30"/>
            <input type="text" name="text2" value="Test" id="text2" disabled="disabled"/>
            <input type="radio" name="radio1" id="radio1" value="on"/>

            <input type="radio" name="radio2" id="radio2" checked="checked"/>
            <input type="checkbox" name="check" id="check1" checked="checked"/>
            <input type="checkbox" id="check2" value="on"/>

            <input type="hidden" name="hidden" id="hidden1"/>
            <input type="text" style="display:none;" name="foo[bar]" id="hidden2"/>

            <input type="text" id="name" name="name" value="name" />
            <input type="search" id="search" name="search" value="search" />

            <button id="button" name="button" type="button">Button</button>

            <textarea id="area1" maxlength="30">foobar</textarea>

            <select name="select1" id="select1">
                <option id="option1a" class="emptyopt" value="">Nothing</option>
                <option id="option1b" value="1">1</option>
                <option id="option1c" value="2">2</option>
                <option id="option1d" value="3">3</option>
            </select>
            <select name="select2" id="select2">
                <option id="option2a" class="emptyopt" value="">Nothing</option>
                <option id="option2b" value="1">1</option>
                <option id="option2c" value="2">2</option>
                <option id="option2d" selected="selected" value="3">3</option>
            </select>
            <select name="select3" id="select3" multiple="multiple">
                <option id="option3a" class="emptyopt" value="">Nothing</option>
                <option id="option3b" selected="selected" value="1">1</option>
                <option id="option3c" selected="selected" value="2">2</option>
                <option id="option3d" value="3">3</option>
                <option id="option3e">no value</option>
            </select>

            <object id="object1" codebase="stupid">
                <param name="p1" value="x1" />
                <param name="p2" value="x2" />
            </object>

            <span id="??Ta?ibe?i"></span>
            <span id="??" lang="??"></span>
            <span id="utf8class1" class="??Ta?ibe?i ??"></span>
            <span id="utf8class2" class="??"></span>
            <span id="foo:bar" class="foo:bar"></span>
            <span id="test.foo[5]bar" class="test.foo[5]bar"></span>

            <foo_bar id="foobar">test element</foo_bar>
        </form>
        <b id="floatTest">Float test.</b>
        <iframe id="iframe" name="iframe"></iframe>
        <form id="lengthtest">
            <input type="text" id="length" name="test"/>
            <input type="text" id="idTest" name="id"/>
        </form>
        <table id="table"></table>

        <form id="name-tests">
            <!-- Inputs with a grouped name attribute. -->
            <input name="types[]" id="types_all" type="checkbox" value="all" />
            <input name="types[]" id="types_anime" type="checkbox" value="anime" />
            <input name="types[]" id="types_movie" type="checkbox" value="movie" />
        </form>

        <form id="testForm" action="index.php#" method="get">
            <textarea name="T3" rows="2" cols="15">?
Z</textarea>
            <input type="hidden" name="H1" value="x" />
            <input type="hidden" name="H2" />
            <input name="PWD" type="password" value="" />
            <input name="T1" type="text" />
            <input name="T2" type="text" value="YES" readonly="readonly" />
            <input type="checkbox" name="C1" value="1" />
            <input type="checkbox" name="C2" />
            <input type="radio" name="R1" value="1" />
            <input type="radio" name="R1" value="2" />
            <input type="text" name="My Name" value="me" />
            <input type="reset" name="reset" value="NO" />
            <select name="S1">
                <option value="abc">ABC</option>
                <option value="abc">ABC</option>
                <option value="abc">ABC</option>
            </select>
            <select name="S2" multiple="multiple" size="3">
                <option value="abc">ABC</option>
                <option value="abc">ABC</option>
                <option value="abc">ABC</option>
            </select>
            <select name="S3">
                <option selected="selected">YES</option>
            </select>
            <select name="S4">
                <option value="" selected="selected">NO</option>
            </select>
            <input type="submit" name="sub1" value="NO" />
            <input type="submit" name="sub2" value="NO" />
            <input type="image" name="sub3" value="NO" />
            <button name="sub4" type="submit" value="NO">NO</button>
            <input name="D1" type="text" value="NO" disabled="disabled" />
            <input type="checkbox" checked="checked" disabled="disabled" name="D2" value="NO" />
            <input type="radio" name="D3" value="NO" checked="checked" disabled="disabled" />
            <select name="D4" disabled="disabled">
                <option selected="selected" value="NO">NO</option>
            </select>
        </form>
        <div id="moretests">
            <form>
                <div id="checkedtest" style="display:none;">
                    <input type="radio" name="checkedtestradios" checked="checked"/>
                    <input type="radio" name="checkedtestradios" value="on"/>
                    <input type="checkbox" name="checkedtestcheckboxes" checked="checked"/>
                    <input type="checkbox" name="checkedtestcheckboxes" />
                </div>
            </form>
            <div id="nonnodes"><span>hi</span> there <!-- mon ami --></div>
            <div id="t2037">
                <div><div class="hidden">hidden</div></div>
            </div>
        </div>

        <div id="tabindex-tests">
            <ol id="listWithTabIndex" tabindex="5">
                <li id="foodWithNegativeTabIndex" tabindex="-1">Rice</li>
                <li id="foodNoTabIndex">Beans</li>
                <li>Blinis</li>
                <li>Tofu</li>
            </ol>

            <div id="divWithNoTabIndex">I'm hungry. I should...</div>
            <span>...</span><a href="index.php#" id="linkWithNoTabIndex">Eat lots of food</a><span>...</span> |
            <span>...</span><a href="index.php#" id="linkWithTabIndex" tabindex="2">Eat a little food</a><span>...</span> |
            <span>...</span><a href="index.php#" id="linkWithNegativeTabIndex" tabindex="-1">Eat no food</a><span>...</span>
            <span>...</span><a id="linkWithNoHrefWithNoTabIndex">Eat a burger</a><span>...</span>
            <span>...</span><a id="linkWithNoHrefWithTabIndex" tabindex="1">Eat some funyuns</a><span>...</span>
            <span>...</span><a id="linkWithNoHrefWithNegativeTabIndex" tabindex="-1">Eat some funyuns</a><span>...</span>
        </div>

        <div id="liveHandlerOrder">
            <span id="liveSpan1"><a href="index.php#" id="liveLink1"></a></span>
            <span id="liveSpan2"><a href="index.php#" id="liveLink2"></a></span>
        </div>

        <div id="siblingTest">
            <em id="siblingfirst">1</em>
            <em id="siblingnext">2</em>
        </div>
    </div>
    </dl>
    <div id="fx-test-group" style="position:absolute;width:1px;height:1px;overflow:hidden;">
        <div id="fx-queue" name="test">
            <div id="fadein" class='chain test' name='div'>fadeIn<div>fadeIn</div></div>
            <div id="fadeout" class='chain test out'>fadeOut<div>fadeOut</div></div>

            <div id="show" class='chain test'>show<div>show</div></div>
            <div id="hide" class='chain test out'>hide<div>hide</div></div>

            <div id="togglein" class='chain test'>togglein<div>togglein</div></div>
            <div id="toggleout" class='chain test out'>toggleout<div>toggleout</div></div>


            <div id="slideup" class='chain test'>slideUp<div>slideUp</div></div>
            <div id="slidedown" class='chain test out'>slideDown<div>slideDown</div></div>

            <div id="slidetogglein" class='chain test'>slideToggleIn<div>slideToggleIn</div></div>
            <div id="slidetoggleout" class='chain test out'>slideToggleOut<div>slideToggleOut</div></div>
        </div>

        <div id="fx-tests"></div>
    </div>

    <div id="ajax_monitor"></div>

</body>

</html>
<script type="text/javascript" src="../../../scripts/jquery-1.4.2.modified.js"></script>
<!--<script type="text/javascript" src="../../../scripts/jquery.beta/jquery.beta.js"></script>-->

<script type="text/javascript" src="../../../scripts/ajaxMonitor.msg.bus.js"></script>
<script type="text/javascript" src="../../../scripts/ajaxMonitor.view.js"></script>
<script type="text/javascript" src="../../../scripts/ajaxMonitor.model.js"></script>
<script type="text/javascript" src="../../../scripts/ajaxMonitor.controller.js"></script>
<script type="text/javascript" src="../../../scripts/ajaxMonitor.coordinator.js"></script>
<script type="text/javascript" src="../../../scripts/ajaxMonitor.service.js"></script>
<script type="text/javascript" src="../../../scripts/ajaxMonitor.mock.js"></script>

<script type="text/javascript" src="../../../scripts/jquery.ajaxMonitor.js"></script>

<!--    <script type="text/javascript" src="../../../src/jquery.ajaxMonitor-1.0.0.js"></script>-->

<script type="text/javascript" src="../../../../../qunit/qunit.js"></script>
<script type="text/javascript" src="../tests.helper.js"></script>

<script type="text/javascript" src="tests.ajax.js"></script>
<!--<script type="text/javascript" src="../../../scripts/jquery.beta/tests.ajax.beta.js"></script>-->

<script type="text/javascript">
    $(function() {
        var monitor = $('#ajax_monitor').ajaxMonitor({
            monitorActive: true
            ,maximize: true});
    });
</script>

