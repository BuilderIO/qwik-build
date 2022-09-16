const QWIK_LOADER = "(()=>{function e(e){return\"object\"==typeof e&&e&&\"Module\"===e[Symbol.toStringTag]}((t,n)=>{const o=\"__q_context__\",r=window,a=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>\"-\"+e.toLowerCase())),t.querySelectorAll(\"[on\"+e+\"\\\\:\"+n+\"]\").forEach((t=>l(t,e,n,o)))},i=(e,t)=>new CustomEvent(e,{detail:t}),s=e=>{throw Error(\"QWIK \"+e)},c=(e,n)=>(e=e.closest(\"[q\\\\:container]\"),new URL(n,new URL(e?e.getAttribute(\"q:base\"):t.baseURI,t.baseURI))),l=async(n,a,l,d)=>{var u;n.hasAttribute(\"preventdefault:\"+l)&&d.preventDefault();const b=\"on\"+a+\":\"+l,v=null==(u=n._qc_)?void 0:u.li[b];if(v){for(const e of v)await e.getFn([n,d],(()=>n.isConnected))(d,n);return}const p=n.getAttribute(b);if(p)for(const a of p.split(\"\\n\")){const l=c(n,a);if(l){const a=f(l),c=(r[l.pathname]||(w=await import(l.href.split(\"#\")[0]),Object.values(w).find(e)||w))[a]||s(l+\" does not export \"+a),u=t[o];if(n.isConnected)try{t[o]=[n,d,l],await c(d,n)}finally{t[o]=u,t.dispatchEvent(i(\"qsymbol\",{symbol:a,element:n}))}}}var w},f=e=>e.hash.replace(/^#?([^?[|]*).*$/,\"$1\")||\"default\",d=async e=>{let t=e.target;for(a(\"-document\",e.type,e);t&&t.getAttribute;)await l(t,\"\",e.type,e),t=e.bubbles&&!0!==e.cancelBubble?t.parentElement:null},u=e=>{a(\"-window\",e.type,e)},b=()=>{const e=t.readyState;if(!n&&(\"interactive\"==e||\"complete\"==e)){n=1,a(\"\",\"qinit\",i(\"qinit\"));const e=t.querySelectorAll(\"[on\\\\:qvisible]\");if(e.length>0){const t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),l(n.target,\"\",\"qvisible\",i(\"qvisible\",n)))}));e.forEach((e=>t.observe(e)))}}},v=new Set,p=e=>{for(const t of e)v.has(t)||(document.addEventListener(t,d,{capture:!0}),r.addEventListener(t,u),v.add(t))};if(!t.qR){const e=r.qwikevents;Array.isArray(e)&&p(e),r.qwikevents={push:(...e)=>p(e)},t.addEventListener(\"readystatechange\",b),b()}})(document)})();";
const QWIK_LOADER_DEBUG = "(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return \"object\" == typeof module && module && \"Module\" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const win = window;\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => \"-\" + a.toLowerCase()));\n            doc.querySelectorAll(\"[on\" + infix + \"\\\\:\" + type + \"]\").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const error = msg => {\n            throw new Error(\"QWIK \" + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest(\"[q\\\\:container]\");\n            return new URL(qrl, new URL(element ? element.getAttribute(\"q:base\") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute(\"preventdefault:\" + eventName) && ev.preventDefault();\n            const attrName = \"on\" + onPrefix + \":\" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                for (const q of qrls) {\n                    await q.getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split(\"\\n\")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (win[url.pathname] || findModule(await import(url.href.split(\"#\")[0])))[symbolName] || error(url + \" does not export \" + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                await handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                doc.dispatchEvent(createEvent(\"qsymbol\", {\n                                    symbol: symbolName,\n                                    element: element\n                                }));\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, \"$1\") || \"default\";\n        const processDocumentEvent = async ev => {\n            let element = ev.target;\n            broadcast(\"-document\", ev.type, ev);\n            while (element && element.getAttribute) {\n                await dispatch(element, \"\", ev.type, ev);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast(\"-window\", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && (\"interactive\" == readyState || \"complete\" == readyState)) {\n                hasInitialized = 1;\n                broadcast(\"\", \"qinit\", createEvent(\"qinit\"));\n                const results = doc.querySelectorAll(\"[on\\\\:qvisible]\");\n                if (results.length > 0) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, \"\", \"qvisible\", createEvent(\"qvisible\", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const events =  new Set;\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    document.addEventListener(eventName, processDocumentEvent, {\n                        capture: !0\n                    });\n                    win.addEventListener(eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            doc.addEventListener(\"readystatechange\", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();";
export { QWIK_LOADER, QWIK_LOADER_DEBUG };
