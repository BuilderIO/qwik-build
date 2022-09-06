const QWIK_LOADER = "(()=>{function e(e){return\"object\"==typeof e&&e&&\"Module\"===e[Symbol.toStringTag]}((t,n)=>{const o=\"__q_context__\",r=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>\"-\"+e.toLowerCase())),t.querySelectorAll(\"[on\"+e+\"\\\\:\"+n+\"]\").forEach((t=>c(t,e,n,o)))},s=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),i=e=>{throw Error(\"QWIK \"+e)},a=(e,n)=>(e=e.closest(\"[q\\\\:container]\"),new URL(n,new URL(e?e.getAttribute(\"q:base\"):t.baseURI,t.baseURI))),c=async(n,r,c,u)=>{var d;n.hasAttribute(\"preventdefault:\"+c)&&u.preventDefault();const b=\"on\"+r+\":\"+c,f=null==(d=n._qc_)?void 0:d.li[b];if(f)return void f.forEach((e=>e.getFn([n,u],(()=>n.isConnected))(u,n)));const v=n.getAttribute(b);if(v)for(const r of v.split(\"\\n\")){const c=a(n,r);if(c){const r=l(c),a=(window[c.pathname]||(p=await import(c.href.split(\"#\")[0]),Object.values(p).find(e)||p))[r]||i(c+\" does not export \"+r),d=t[o];if(n.isConnected)try{t[o]=[n,u,c],a(u,n)}finally{t[o]=d,s(n,\"qsymbol\",r)}}}var p},l=e=>e.hash.replace(/^#?([^?[|]*).*$/,\"$1\")||\"default\",u=e=>{let t=e.target;for(r(\"-document\",e.type,e);t&&t.getAttribute;)c(t,\"\",e.type,e),t=e.bubbles?t.parentElement:null},d=e=>{r(\"-window\",e.type,e)},b=()=>{const e=t.readyState;if(!n&&(\"interactive\"==e||\"complete\"==e)&&(n=1,r(\"\",\"qinit\",new CustomEvent(\"qinit\")),\"undefined\"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),c(n.target,\"\",\"qvisible\",new CustomEvent(\"qvisible\",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll(\"[on\\\\:qvisible]\").forEach((t=>e.observe(t)))}},f=e=>{document.addEventListener(e,u,{capture:!0}),window.addEventListener(e,d)};if(!t.qR){t.qR=1;{const e=t.querySelector(\"script[events]\");if(e)e.getAttribute(\"events\").split(/[\\s,;]+/).forEach(f);else for(const e in t)e.startsWith(\"on\")&&f(e.slice(2))}t.addEventListener(\"readystatechange\",b),b()}})(document)})();";
const QWIK_LOADER_DEBUG = "(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return \"object\" == typeof module && module && \"Module\" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => \"-\" + a.toLowerCase()));\n            doc.querySelectorAll(\"[on\" + infix + \"\\\\:\" + type + \"]\").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error(\"QWIK \" + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest(\"[q\\\\:container]\");\n            return new URL(qrl, new URL(element ? element.getAttribute(\"q:base\") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute(\"preventdefault:\" + eventName) && ev.preventDefault();\n            const attrName = \"on\" + onPrefix + \":\" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                qrls.forEach((q => q.getFn([ element, ev ], (() => element.isConnected))(ev, element)));\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split(\"\\n\")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (window[url.pathname] || findModule(await import(url.href.split(\"#\")[0])))[symbolName] || error(url + \" does not export \" + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                emitEvent(element, \"qsymbol\", symbolName);\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, \"$1\") || \"default\";\n        const processDocumentEvent = ev => {\n            let element = ev.target;\n            broadcast(\"-document\", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, \"\", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast(\"-window\", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && (\"interactive\" == readyState || \"complete\" == readyState)) {\n                hasInitialized = 1;\n                broadcast(\"\", \"qinit\", new CustomEvent(\"qinit\"));\n                if (\"undefined\" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, \"\", \"qvisible\", new CustomEvent(\"qvisible\", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll(\"[on\\\\:qvisible]\").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => {\n            document.addEventListener(eventName, processDocumentEvent, {\n                capture: !0\n            });\n            window.addEventListener(eventName, processWindowEvent);\n        };\n        if (!doc.qR) {\n            doc.qR = 1;\n            {\n                const scriptTag = doc.querySelector(\"script[events]\");\n                if (scriptTag) {\n                    scriptTag.getAttribute(\"events\").split(/[\\s,;]+/).forEach(addDocEventListener);\n                } else {\n                    for (const key in doc) {\n                        key.startsWith(\"on\") && addDocEventListener(key.slice(2));\n                    }\n                }\n            }\n            doc.addEventListener(\"readystatechange\", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();";
exports.QWIK_LOADER = QWIK_LOADER;
exports.QWIK_LOADER_DEBUG = QWIK_LOADER_DEBUG;
