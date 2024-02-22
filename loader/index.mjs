const QWIK_LOADER = "((e,t)=>{const n=\"__q_context__\",s=window,o=new Set,i=\"replace\",a=\"forEach\",r=\"target\",l=\"getAttribute\",c=\"isConnected\",f=\"qvisible\",u=\"_qwikjson_\",d=t=>e.querySelectorAll(t),p=(e,t,n=t.type)=>{d(\"[on\"+e+\"\\\\:\"+n+\"]\")[a]((s=>m(s,e,t,n)))},b=t=>{if(void 0===t[u]){let n=(t===e.documentElement?e.body:t).lastElementChild;for(;n;){if(\"SCRIPT\"===n.tagName&&\"qwik/json\"===n[l](\"type\")){t[u]=JSON.parse(n.textContent[i](/\\\\x3C(\\/?script)/gi,\"<$1\"));break}n=n.previousElementSibling}}},w=(e,t)=>new CustomEvent(e,{detail:t}),m=async(t,s,o,a=o.type)=>{const r=\"on\"+s+\":\"+a;t.hasAttribute(\"preventdefault:\"+a)&&o.preventDefault();const f=t._qc_,u=f&&f.li.filter((e=>e[0]===r));if(u&&u.length>0){for(const e of u)await e[1].getFn([t,o],(()=>t[c]))(o,t);return}const d=t[l](r);if(d){const s=t.closest(\"[q\\\\:container]\"),a=new URL(s[l](\"q:base\"),e.baseURI);for(const r of d.split(\"\\n\")){const l=new URL(r,a),f=l.hash[i](/^#?([^?[|]*).*$/,\"$1\")||\"default\",u=performance.now();let d;const p=r.startsWith(\"#\");if(p)d=(s.qFuncs||[])[Number.parseInt(f)];else{const e=import(l.href.split(\"#\")[0]);b(s),d=(await e)[f]}const w=e[n];if(t[c])try{e[n]=[t,o,l],p||y(\"qsymbol\",{symbol:f,element:t,reqTime:u}),await d(o,t)}finally{e[n]=w}}}},y=(t,n)=>{e.dispatchEvent(w(t,n))},q=e=>e[i](/([A-Z])/g,(e=>\"-\"+e.toLowerCase())),v=async e=>{let t=q(e.type),n=e[r];for(p(\"-document\",e,t);n&&n[l];)await m(n,\"\",e,t),n=e.bubbles&&!0!==e.cancelBubble?n.parentElement:null},h=e=>{p(\"-window\",e,q(e.type))},g=()=>{var n;const i=e.readyState;if(!t&&(\"interactive\"==i||\"complete\"==i)&&(t=1,y(\"qinit\"),(null!=(n=s.requestIdleCallback)?n:s.setTimeout).bind(s)((()=>y(\"qidle\"))),o.has(f))){const e=d(\"[on\\\\:\"+f+\"]\"),t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n[r]),m(n[r],\"\",w(f,n)))}));e[a]((e=>t.observe(e)))}},_=(e,t,n,s=!1)=>e.addEventListener(t,n,{capture:s,passive:!1}),C=t=>{for(const n of t)o.has(n)||(_(e,n,v,!0),_(s,n,h),o.add(n))};if(!(n in e)){e[n]=0;const t=s.qwikevents;Array.isArray(t)&&C(t),s.qwikevents={push:(...e)=>C(e)},_(e,\"readystatechange\",g),g()}})(document)";
const QWIK_LOADER_DEBUG = "(() => {\n    ((doc, hasInitialized) => {\n        const Q_CONTEXT = \"__q_context__\";\n        const win = window;\n        const events =  new Set;\n        const querySelectorAll = query => doc.querySelectorAll(query);\n        const broadcast = (infix, ev, type = ev.type) => {\n            querySelectorAll(\"[on\" + infix + \"\\\\:\" + type + \"]\").forEach((el => dispatch(el, infix, ev, type)));\n        };\n        const resolveContainer = containerEl => {\n            if (void 0 === containerEl._qwikjson_) {\n                let script = (containerEl === doc.documentElement ? doc.body : containerEl).lastElementChild;\n                while (script) {\n                    if (\"SCRIPT\" === script.tagName && \"qwik/json\" === script.getAttribute(\"type\")) {\n                        containerEl._qwikjson_ = JSON.parse(script.textContent.replace(/\\\\x3C(\\/?script)/gi, \"<$1\"));\n                        break;\n                    }\n                    script = script.previousElementSibling;\n                }\n            }\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {\n            const attrName = \"on\" + onPrefix + \":\" + eventName;\n            element.hasAttribute(\"preventdefault:\" + eventName) && ev.preventDefault();\n            const ctx = element._qc_;\n            const relevantListeners = ctx && ctx.li.filter((li => li[0] === attrName));\n            if (relevantListeners && relevantListeners.length > 0) {\n                for (const listener of relevantListeners) {\n                    await listener[1].getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                const container = element.closest(\"[q\\\\:container]\");\n                const base = new URL(container.getAttribute(\"q:base\"), doc.baseURI);\n                for (const qrl of attrValue.split(\"\\n\")) {\n                    const url = new URL(qrl, base);\n                    const symbolName = url.hash.replace(/^#?([^?[|]*).*$/, \"$1\") || \"default\";\n                    const reqTime = performance.now();\n                    let handler;\n                    const isSync = qrl.startsWith(\"#\");\n                    if (isSync) {\n                        handler = (container.qFuncs || [])[Number.parseInt(symbolName)];\n                    } else {\n                        const module = import(\n                                                url.href.split(\"#\")[0]);\n                        resolveContainer(container);\n                        handler = (await module)[symbolName];\n                    }\n                    const previousCtx = doc[Q_CONTEXT];\n                    if (element.isConnected) {\n                        try {\n                            doc[Q_CONTEXT] = [ element, ev, url ];\n                            isSync || emitEvent(\"qsymbol\", {\n                                symbol: symbolName,\n                                element: element,\n                                reqTime: reqTime\n                            });\n                            await handler(ev, element);\n                        } finally {\n                            doc[Q_CONTEXT] = previousCtx;\n                        }\n                    }\n                }\n            }\n        };\n        const emitEvent = (eventName, detail) => {\n            doc.dispatchEvent(createEvent(eventName, detail));\n        };\n        const camelToKebab = str => str.replace(/([A-Z])/g, (a => \"-\" + a.toLowerCase()));\n        const processDocumentEvent = async ev => {\n            let type = camelToKebab(ev.type);\n            let element = ev.target;\n            broadcast(\"-document\", ev, type);\n            while (element && element.getAttribute) {\n                await dispatch(element, \"\", ev, type);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast(\"-window\", ev, camelToKebab(ev.type));\n        };\n        const processReadyStateChange = () => {\n            var _a;\n            const readyState = doc.readyState;\n            if (!hasInitialized && (\"interactive\" == readyState || \"complete\" == readyState)) {\n                hasInitialized = 1;\n                emitEvent(\"qinit\");\n                (null != (_a = win.requestIdleCallback) ? _a : win.setTimeout).bind(win)((() => emitEvent(\"qidle\")));\n                if (events.has(\"qvisible\")) {\n                    const results = querySelectorAll(\"[on\\\\:qvisible]\");\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, \"\", createEvent(\"qvisible\", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addEventListener = (el, eventName, handler, capture = !1) => el.addEventListener(eventName, handler, {\n            capture: capture,\n            passive: !1\n        });\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    addEventListener(doc, eventName, processDocumentEvent, !0);\n                    addEventListener(win, eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!(Q_CONTEXT in doc)) {\n            doc[Q_CONTEXT] = 0;\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            addEventListener(doc, \"readystatechange\", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})()";
export { QWIK_LOADER, QWIK_LOADER_DEBUG };
