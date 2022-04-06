!function() {
    const qrlResolver = (element, eventUrl, baseURI) => {
        element = element.closest("[q\\:container]");
        return new URL(eventUrl, new URL(element ? element.getAttribute("q:base") : baseURI, baseURI));
    };
    const error = msg => {
        throw new Error("QWIK: " + msg);
    };
    ((doc, hasInitialized) => {
        const ON_PREFIXES = [ "on:", "on-window:", "on-document:" ];
        const broadcast = (infix, type, ev) => {
            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));
            doc.querySelectorAll("[on" + infix + "\\:" + type + "]").forEach((target => dispatch(target, type, ev)));
        };
        const symbolUsed = (el, symbolName) => el.dispatchEvent(new CustomEvent("qSymbol", {
            detail: {
                name: symbolName
            },
            bubbles: !0,
            composed: !0
        }));
        const dispatch = async (element, eventName, ev) => {
            for (const on of ON_PREFIXES) {
                const attrValue = element.getAttribute(on + eventName);
                if (attrValue) {
                    element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();
                    for (const qrl of attrValue.split("\n")) {
                        const url = qrlResolver(element, qrl, doc.baseURI);
                        if (url) {
                            const symbolName = getSymbolName(url);
                            const handler = (window[url.pathname] || await import(url.href.split("#")[0]))[symbolName] || error(url + " does not export " + symbolName);
                            const previousCtx = doc.__q_context__;
                            try {
                                doc.__q_context__ = [ element, ev, url ];
                                handler(ev, element, url);
                            } finally {
                                doc.__q_context__ = previousCtx;
                                symbolUsed(element, symbolName);
                            }
                        }
                    }
                }
            }
        };
        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";
        const processEvent = (ev, element) => {
            if ((element = ev.target) == doc) {
                setTimeout((() => broadcast("-document", ev.type, ev)));
            } else {
                while (element && element.getAttribute) {
                    dispatch(element, ev.type, ev);
                    element = ev.bubbles ? element.parentElement : null;
                }
            }
        };
        const addEventListener = eventName => doc.addEventListener(eventName, processEvent, {
            capture: !0
        });
        const processReadyStateChange = readyState => {
            readyState = doc.readyState;
            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {
                hasInitialized = 1;
                broadcast("", "q-init", new CustomEvent("qInit"));
            }
        };
        window.qEvents.forEach(addEventListener);
        doc.addEventListener("readystatechange", processReadyStateChange);
        processReadyStateChange();
    })(document);
}();