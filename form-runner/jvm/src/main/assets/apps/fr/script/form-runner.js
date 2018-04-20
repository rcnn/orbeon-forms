(function() {

    var $ = ORBEON.jQuery;

    // Enable scrolling within iframes with Firefox >= 4, due to this bug:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=638598
    if (YAHOO.env.ua.gecko >= 2 && document.getElementsByClassName("fr-toc")[0]) { // Firefox 4 and higher
        YAHOO.util.Event.onDOMReady(function() {

            // Only initialize if there is a parent window with same origin
            var parentWithSameOrigin = false;
            try {
                if (window.parent != window && window.parent.scrollTo)
                    parentWithSameOrigin = true;
            } catch (e) {}

            if (parentWithSameOrigin) {
                // Find toc
                var toc = document.getElementsByClassName("fr-toc")[0];
                if (toc) {

                    // Listener for clicks on toc links
                    var onClick = function(event) {
                        // "the Event Utility automatically adjusts the execution scope so that this refers to the DOM element to
                        // which the event was attached"
                        var eventObserver = this;
                        var linkTarget = document.getElementById(eventObserver.getAttribute("href").substring(1));
                        if (linkTarget)
                            window.parent.scrollTo(0, YAHOO.util.Dom.getY(linkTarget) + YAHOO.util.Dom.getY(window.frameElement));
                    };

                    // Find all toc links starting with a non-empty fragment, and add the listener to them
                    var as = toc.getElementsByTagName("a");
                    for (var i = 0; i < as.length; i++) {
                        var a = as[i];
                        var href = a.getAttribute("href");
                        if (href && href[0] == "#" && href[1])
                            YAHOO.util.Event.addListener(a, "click", onClick);
                    }
                }
            }
        });
    }

    // See https://github.com/orbeon/orbeon-forms/issues/3579 for improving this.
    // $(window).on('beforeunload', function() {
    $(window).on('beforeunload', function() {
        try{
            if (! ORBEON.xforms.Document.isReloading()) {

                var dirty =
                    _.find(_.values(ORBEON.xforms.Globals.ns), function(prefix) {
                        var control = window.document.getElementById(prefix + 'fr-data-safe');
                        return control && ORBEON.xforms.Document.getValue(control) != 'true';
                    });

                // 2018-05-07: Some browsers, including Firefox and Chrome, no longer use the message provided here.
                if (! _.isUndefined(dirty))
                    return "You may lose some unsaved changes.";
            }

        } catch (ex) {}
    });
})();
