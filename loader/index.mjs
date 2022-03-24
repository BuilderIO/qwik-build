const QWIK_LOADER = "!function(){const e=(t,n,o,s,r)=>(void 0===o?n?(s=n.getAttribute(\"q:base\"),r=e(t,n.parentNode&&n.parentNode.closest(\"[q\\\\:base]\"))):s=t.baseURI:o&&(s=o,r=e(t,n.closest(\"[q\\\\:base]\"))),s?new URL(s,r):void 0),t=e=>{throw Error(\"QWIK: \"+e)};((n,o)=>{const s=\"__q_context__\",r=[\"on:\",\"on-window:\",\"on-document:\"],a=async(e,t,o)=>{t=t.replace(/([A-Z])/g,(e=>\"-\"+e.toLowerCase())),n.querySelectorAll(\"[on\"+e+\"\\\\:\"+t+\"]\").forEach((e=>i(e,t,o)))},i=async(o,a,i)=>{for(const d of r){const r=o.getAttribute(d+a);if(r){o.hasAttribute(\"preventdefault:\"+a)&&i.preventDefault();for(const a of r.split(\"\\n\")){const r=e(n,o,a);if(r){const e=c(r),a=(window[r.pathname]||await import(\n/* @vite-ignore */\n(r+\"\").split(\"#\")[0]))[e]||t(r+\" does not export \"+e),d=n[s];try{n[s]=[o,i,r],a(i,o,r)}finally{n[s]=d,l=e,o.dispatchEvent(new CustomEvent(\"qSymbol\",{detail:{name:l},bubbles:!0,composed:!0}))}}}}}var l},c=e=>e.hash.replace(/^#?([^?[|]*).*$/,\"$1\")||\"default\",l=async(e,t)=>{if((t=e.target)==n)setTimeout((()=>a(\"-document\",e.type,e)));else for(;t&&t.getAttribute;)i(t,e.type,e),t=e.bubbles?t.parentElement:null},d=e=>n.addEventListener(e,l,{capture:!0}),u=e=>{e=n.readyState,o||\"interactive\"!=e&&\"complete\"!=e||(o=1,a(\"\",\"q-init\",new CustomEvent(\"qInit\")))};{const e=n.querySelector(\"script[events]\");if(e)(e.getAttribute(\"events\")||\"\").split(/[\\s,;]+/).forEach(d);else for(const e in n)0==e.indexOf(\"on\")&&d(e.substring(2))}n.addEventListener(\"readystatechange\",u),u()})(document)}();";
const QWIK_LOADER_DEBUG = "!function() {\n    /**\n * @license\n * Copyright Builder.io, Inc. All Rights Reserved.\n *\n * Use of this source code is governed by an MIT-style license that can be\n * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE\n */\n    const qrlResolver = (doc, element, eventUrl, _url, _base) => {\n        if (void 0 === eventUrl) {\n            if (element) {\n                _url = element.getAttribute(\"q:base\");\n                _base = qrlResolver(doc, element.parentNode && element.parentNode.closest(\"[q\\\\:base]\"));\n            } else {\n                _url = doc.baseURI;\n            }\n        } else if (eventUrl) {\n            _url = eventUrl;\n            _base = qrlResolver(doc, element.closest(\"[q\\\\:base]\"));\n        }\n        return _url ? new URL(_url, _base) : void 0;\n    };\n    const error = msg => {\n        throw new Error(\"QWIK: \" + msg);\n    };\n    ((doc, hasInitialized) => {\n        const ON_PREFIXES = [ \"on:\", \"on-window:\", \"on-document:\" ];\n        const broadcast = async (infix, type, event) => {\n            type = type.replace(/([A-Z])/g, (a => \"-\" + a.toLowerCase()));\n            doc.querySelectorAll(\"[on\" + infix + \"\\\\:\" + type + \"]\").forEach((target => dispatch(target, type, event)));\n        };\n        const symbolUsed = (el, name) => el.dispatchEvent(new CustomEvent(\"qSymbol\", {\n            detail: {\n                name: name\n            },\n            bubbles: !0,\n            composed: !0\n        }));\n        const dispatch = async (element, eventName, ev) => {\n            for (const on of ON_PREFIXES) {\n                const attrValue = element.getAttribute(on + eventName);\n                if (!attrValue) {\n                    continue;\n                }\n                element.hasAttribute(\"preventdefault:\" + eventName) && ev.preventDefault();\n                for (const qrl of attrValue.split(\"\\n\")) {\n                    const url = qrlResolver(doc, element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (window[url.pathname] || await import(\n                        /* @vite-ignore */\n                        String(url).split(\"#\")[0]))[symbolName] || error(url + \" does not export \" + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        try {\n                            doc.__q_context__ = [ element, ev, url ];\n                            handler(ev, element, url);\n                        } finally {\n                            doc.__q_context__ = previousCtx;\n                            symbolUsed(element, symbolName);\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, \"$1\") || \"default\";\n        const processEvent = async (ev, element) => {\n            if ((element = ev.target) == doc) {\n                setTimeout((() => broadcast(\"-document\", ev.type, ev)));\n            } else {\n                while (element && element.getAttribute) {\n                    dispatch(element, ev.type, ev);\n                    element = ev.bubbles ? element.parentElement : null;\n                }\n            }\n        };\n        const addEventListener = eventName => doc.addEventListener(eventName, processEvent, {\n            capture: !0\n        });\n        const processReadyStateChange = readyState => {\n            readyState = doc.readyState;\n            if (!hasInitialized && (\"interactive\" == readyState || \"complete\" == readyState)) {\n                hasInitialized = 1;\n                broadcast(\"\", \"q-init\", new CustomEvent(\"qInit\"));\n            }\n        };\n        {\n            const scriptTag = doc.querySelector(\"script[events]\");\n            if (scriptTag) {\n                (scriptTag.getAttribute(\"events\") || \"\").split(/[\\s,;]+/).forEach(addEventListener);\n            } else {\n                for (const key in doc) {\n                    if (0 == key.indexOf(\"on\")) {\n                        addEventListener(key.substring(2));\n                    }\n                }\n            }\n        }\n        doc.addEventListener(\"readystatechange\", processReadyStateChange);\n        processReadyStateChange();\n    })(document);\n}();";
export { QWIK_LOADER, QWIK_LOADER_DEBUG };
