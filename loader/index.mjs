const QWIK_LOADER = "(()=>{function e(e){return\"object\"==typeof e&&e&&\"Module\"===e[Symbol.toStringTag]}((t,n)=>{const o=\"__q_context__\",r=[\"on:\",\"on-window:\",\"on-document:\"],s=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>\"-\"+e.toLowerCase())),t.querySelectorAll(\"[on\"+e+\"\\\\:\"+n+\"]\").forEach((e=>l(e,n,o)))},i=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),a=e=>{throw Error(\"QWIK \"+e)},c=(e,n)=>(e=e.closest(\"[q\\\\:container]\"),new URL(n,new URL(e?e.getAttribute(\"q:base\"):t.baseURI,t.baseURI))),l=async(n,s,l)=>{for(const f of r){const r=n.getAttribute(f+s);if(r){n.hasAttribute(\"preventdefault:\"+s)&&l.preventDefault();for(const s of r.split(\"\\n\")){const r=c(n,s);if(r){const s=b(r),c=(window[r.pathname]||(u=await import(r.href.split(\"#\")[0]),Object.values(u).find(e)||u))[s]||a(r+\" does not export \"+s),f=t[o];if(n.isConnected)try{t[o]=[n,l,r],c(l,n,r)}finally{t[o]=f,i(n,\"qsymbol\",s)}}}}}var u},b=e=>e.hash.replace(/^#?([^?[|]*).*$/,\"$1\")||\"default\",u=(e,n)=>{if((n=e.target)==t)setTimeout((()=>s(\"-document\",e.type,e)));else for(;n&&n.getAttribute;)l(n,e.type,e),n=e.bubbles?n.parentElement:null},f=e=>{if(e=t.readyState,!n&&(\"interactive\"==e||\"complete\"==e)&&(n=1,s(\"\",\"qinit\",new CustomEvent(\"qinit\")),\"undefined\"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),l(n.target,\"qvisible\",new CustomEvent(\"qvisible\",{bubbles:!1,detail:n})))}));t.qO=e,new MutationObserver((t=>{for(const n of t)e.observe(n.target)})).observe(document.documentElement,{attributeFilter:[\"on:qvisible\"],subtree:!0}),t.querySelectorAll(\"[on\\\\:qvisible]\").forEach((t=>e.observe(t)))}},d=e=>t.addEventListener(e,u,{capture:!0});if(!t.qR){t.qR=1;{const e=t.querySelector(\"script[events]\");if(e)e.getAttribute(\"events\").split(/[\\s,;]+/).forEach(d);else for(const e in t)e.startsWith(\"on\")&&d(e.slice(2))}t.addEventListener(\"readystatechange\",f),f()}})(document)})();";
const QWIK_LOADER_DEBUG = "(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return \"object\" == typeof module && module && \"Module\" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized, prefetchWorker) => {\n        const ON_PREFIXES = [ \"on:\", \"on-window:\", \"on-document:\" ];\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => \"-\" + a.toLowerCase()));\n            doc.querySelectorAll(\"[on\" + infix + \"\\\\:\" + type + \"]\").forEach((target => dispatch(target, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error(\"QWIK \" + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest(\"[q\\\\:container]\");\n            return new URL(qrl, new URL(element ? element.getAttribute(\"q:base\") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, eventName, ev) => {\n            for (const onPrefix of ON_PREFIXES) {\n                const attrValue = element.getAttribute(onPrefix + eventName);\n                if (attrValue) {\n                    element.hasAttribute(\"preventdefault:\" + eventName) && ev.preventDefault();\n                    for (const qrl of attrValue.split(\"\\n\")) {\n                        const url = qrlResolver(element, qrl);\n                        if (url) {\n                            const symbolName = getSymbolName(url);\n                            const handler = (window[url.pathname] || findModule(await import(url.href.split(\"#\")[0])))[symbolName] || error(url + \" does not export \" + symbolName);\n                            const previousCtx = doc.__q_context__;\n                            if (element.isConnected) {\n                                try {\n                                    doc.__q_context__ = [ element, ev, url ];\n                                    handler(ev, element, url);\n                                } finally {\n                                    doc.__q_context__ = previousCtx;\n                                    emitEvent(element, \"qsymbol\", symbolName);\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, \"$1\") || \"default\";\n        const processEvent = (ev, element) => {\n            if ((element = ev.target) == doc) {\n                setTimeout((() => broadcast(\"-document\", ev.type, ev)));\n            } else {\n                while (element && element.getAttribute) {\n                    dispatch(element, ev.type, ev);\n                    element = ev.bubbles ? element.parentElement : null;\n                }\n            }\n        };\n        const processReadyStateChange = readyState => {\n            readyState = doc.readyState;\n            if (!hasInitialized && (\"interactive\" == readyState || \"complete\" == readyState)) {\n                hasInitialized = 1;\n                broadcast(\"\", \"qinit\", new CustomEvent(\"qinit\"));\n                if (\"undefined\" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, \"qvisible\", new CustomEvent(\"qvisible\", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    new MutationObserver((mutations => {\n                        for (const mutation2 of mutations) {\n                            observer.observe(mutation2.target);\n                        }\n                    })).observe(document.documentElement, {\n                        attributeFilter: [ \"on:qvisible\" ],\n                        subtree: !0\n                    });\n                    doc.querySelectorAll(\"[on\\\\:qvisible]\").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => doc.addEventListener(eventName, processEvent, {\n            capture: !0\n        });\n        if (!doc.qR) {\n            doc.qR = 1;\n            {\n                const scriptTag = doc.querySelector(\"script[events]\");\n                if (scriptTag) {\n                    scriptTag.getAttribute(\"events\").split(/[\\s,;]+/).forEach(addDocEventListener);\n                } else {\n                    for (const key in doc) {\n                        key.startsWith(\"on\") && addDocEventListener(key.slice(2));\n                    }\n                }\n            }\n            doc.addEventListener(\"readystatechange\", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();";
export { QWIK_LOADER, QWIK_LOADER_DEBUG };
