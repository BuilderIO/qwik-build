const QWIK_PREFETCH = "(()=>{const n=Number.MAX_SAFE_INTEGER>>>1;function e(e,o){const[i,s]=a(o),c=e.t.find((n=>i===n.o));if(c)return e.i(\"intercepting\",o.pathname),t(e,c,[s],n).then((()=>async function(n,e){const t=n.u.find((n=>n.l.pathname===e.pathname));return t?t.$:(n.i(\"CACHE HIT\",e.pathname),(await n.p).match(e))}(e,o)))}async function t(e,t,i,a){const c=new Set;i.forEach((n=>s(t.h,c,n))),await Promise.all(Array.from(c).map((o=>async function(e,t,o){let i=e.u.find((n=>n.l.pathname===t.pathname));const s=o>=n?\"direct\":\"prefetch\";if(i){const n=i.m?\"fetching\":\"waiting\";i.C<o?(e.i(\"queue update priority\",n,t.pathname),i.C=o):e.i(\"already in queue\",s,n,t.pathname)}else await e.p.match(t)||(e.i(\"enqueue\",s,t.pathname),i={C:o,l:t,R:null,$:null,m:!1},i.$=new Promise((n=>i.R=n)),e.u.push(i));return i}(e,new URL(t.o+o,e.l),a)))),o(e)}function o(e){e.u.sort(i);let t=0;for(const i of e.u)if(i.m)t++;else if(t<e.H||i.C>=n){i.m=!0,t++;const s=i.C>=n?\"FETCH (CACHE MISS)\":\"FETCH\";e.i(s,i.l.pathname),e.S(i.l).then((async n=>{if(200===n.status){const t=e.p;try{!t&&e.U(),e.i(\"CACHED\",i.l.pathname),await e.p.put(i.l,n.clone())}finally{e.p=t}}i.R(n)})).finally((()=>{e.i(\"FETCH DONE\",i.l.pathname),e.u.splice(e.u.indexOf(i),1),o(e)}))}}function i(n,e){return e.C-n.C}function s(n,e,t){if(!e.has(t)){e.add(t);let o=n.findIndex((n=>n===t));if(-1!==o)for(;\"number\"==typeof n[++o];)s(n,e,n[n[o]])}return e}function a(n){const e=new URL(n).pathname,t=e.lastIndexOf(\"/\");return[e.substring(0,t+1),e.substring(t+1)]}const c=(...n)=>{console.log(\"⚙️ Prefetch SW:\",...n)};async function r(n,e,t,o){const i=n.t.findIndex((n=>n==n));if(-1!==i&&n.t.splice(i,1),n.i(\"adding base:\",e),n.t.push({o:e,h:t}),o){const o=new Set(t.filter((n=>\"string\"==typeof n)));for(const t of await n.p.keys()){const[i,s]=a(new URL(t.url)),c=[];i!==e||o.has(s)||(n.i(\"deleting\",t.url),c.push(n.p.delete(t))),await Promise.all(c)}}}function u(n,e,o){const i=n.t.find((n=>e===n.o));i?t(n,i,o,0):console.error(`Base path not found: ${e}, ignoring prefetch.`)}function f(n){if(!n.L&&n.P.length){const t=n.P.shift();n.L=(async(n,t)=>{const o=t[0];n.i(\"received message:\",o,t[1],t.slice(2)),await n.U(),\"graph\"===o?await r(n,t[1],t.slice(2),!0):\"graph-url\"===o?await async function(n,t,o){await r(n,t,[],!1);const i=await e(n,new URL(t+o,n.l));if(i&&200===i.status){const e=await i.json();e.push(o),await r(n,t,e,!0)}}(n,t[1],t[2]):\"prefetch\"===o?await u(n,t[1],t.slice(2)):\"prefetch-all\"===o?await function(n,e){const t=n.t.find((n=>e===n.o));t?u(n,e,t.h.filter((n=>\"string\"==typeof n))):console.error(`Base path not found: ${e}, ignoring prefetch.`)}(n,t[1]):\"ping\"===o?c(\"ping\"):\"verbose\"===o?(n.i=c)(\"mode: verbose\"):console.error(\"UNKNOWN MESSAGE:\",t),n.p=null})(n,t).then((()=>{n.L=null,f(n)}))}}(n=>{const t={S:n.fetch.bind(n),u:[],t:[],p:null,U:null,P:[],L:null,H:10,l:new URL(n.location.href),i:()=>{}};n.addEventListener(\"fetch\",(async n=>{const o=n.request;if(\"GET\"===o.method){const i=t.p;try{!i&&t.U();const s=e(t,new URL(o.url));s&&n.respondWith(s)}finally{t.p=i}}})),n.addEventListener(\"message\",(n=>{t.P.push(n.data),f(t)})),n.addEventListener(\"install\",(()=>n.skipWaiting())),n.addEventListener(\"activate\",(async e=>{e.waitUntil(n.clients.claim()),t.U=async()=>t.p=await n.caches.open(\"QwikBundles\")}))})(globalThis)})();";
const QWIK_PREFETCH_DEBUG = "(() => {\n    const DIRECT_PRIORITY = Number.MAX_SAFE_INTEGER >>> 1;\n    function directFetch(swState, url) {\n        const [basePath, filename] = parseBaseFilename(url);\n        const base = swState.$bases$.find((base2 => basePath === base2.$path$));\n        if (base) {\n            swState.$log$(\"intercepting\", url.pathname);\n            return enqueueFileAndDependencies(swState, base, [ filename ], DIRECT_PRIORITY).then((() => async function(swState, url) {\n                const currentRequestTask = swState.$queue$.find((task => task.$url$.pathname === url.pathname));\n                if (currentRequestTask) {\n                    return currentRequestTask.$response$;\n                }\n                swState.$log$(\"CACHE HIT\", url.pathname);\n                return (await swState.$cache$).match(url);\n            }(swState, url)));\n        }\n    }\n    async function enqueueFileAndDependencies(swState, base, filenames, priority) {\n        const fetchSet =  new Set;\n        filenames.forEach((filename => addDependencies(base.$graph$, fetchSet, filename)));\n        await Promise.all(Array.from(fetchSet).map((filename => async function(swState, url, priority) {\n            let task = swState.$queue$.find((task2 => task2.$url$.pathname === url.pathname));\n            const mode = priority >= DIRECT_PRIORITY ? \"direct\" : \"prefetch\";\n            if (task) {\n                const state = task.$isFetching$ ? \"fetching\" : \"waiting\";\n                if (task.$priority$ < priority) {\n                    swState.$log$(\"queue update priority\", state, url.pathname);\n                    task.$priority$ = priority;\n                } else {\n                    swState.$log$(\"already in queue\", mode, state, url.pathname);\n                }\n            } else {\n                if (!await swState.$cache$.match(url)) {\n                    swState.$log$(\"enqueue\", mode, url.pathname);\n                    task = {\n                        $priority$: priority,\n                        $url$: url,\n                        $resolveResponse$: null,\n                        $response$: null,\n                        $isFetching$: !1\n                    };\n                    task.$response$ = new Promise((resolve => task.$resolveResponse$ = resolve));\n                    swState.$queue$.push(task);\n                }\n            }\n            return task;\n        }(swState, new URL(base.$path$ + filename, swState.$url$), priority))));\n        taskTick(swState);\n    }\n    function taskTick(swState) {\n        swState.$queue$.sort(byFetchOrder);\n        let outstandingRequests = 0;\n        for (const task of swState.$queue$) {\n            if (task.$isFetching$) {\n                outstandingRequests++;\n            } else if (outstandingRequests < swState.$maxPrefetchRequests$ || task.$priority$ >= DIRECT_PRIORITY) {\n                task.$isFetching$ = !0;\n                outstandingRequests++;\n                const action = task.$priority$ >= DIRECT_PRIORITY ? \"FETCH (CACHE MISS)\" : \"FETCH\";\n                swState.$log$(action, task.$url$.pathname);\n                swState.$fetch$(task.$url$).then((async response => {\n                    if (200 === response.status) {\n                        const previousCache = swState.$cache$;\n                        try {\n                            !previousCache && swState.$openCache$();\n                            swState.$log$(\"CACHED\", task.$url$.pathname);\n                            await swState.$cache$.put(task.$url$, response.clone());\n                        } finally {\n                            swState.$cache$ = previousCache;\n                        }\n                    }\n                    task.$resolveResponse$(response);\n                })).finally((() => {\n                    swState.$log$(\"FETCH DONE\", task.$url$.pathname);\n                    swState.$queue$.splice(swState.$queue$.indexOf(task), 1);\n                    taskTick(swState);\n                }));\n            }\n        }\n    }\n    function byFetchOrder(a, b) {\n        return b.$priority$ - a.$priority$;\n    }\n    function addDependencies(graph, fetchSet, filename) {\n        if (!fetchSet.has(filename)) {\n            fetchSet.add(filename);\n            let index = graph.findIndex((file => file === filename));\n            if (-1 !== index) {\n                while (\"number\" == typeof graph[++index]) {\n                    addDependencies(graph, fetchSet, graph[graph[index]]);\n                }\n            }\n        }\n        return fetchSet;\n    }\n    function parseBaseFilename(url) {\n        const pathname = new URL(url).pathname;\n        const slashIndex = pathname.lastIndexOf(\"/\");\n        return [ pathname.substring(0, slashIndex + 1), pathname.substring(slashIndex + 1) ];\n    }\n    const log = (...args) => {\n        console.log(\"⚙️ Prefetch SW:\", ...args);\n    };\n    const processMessage = async (state, msg) => {\n        const type = msg[0];\n        state.$log$(\"received message:\", type, msg[1], msg.slice(2));\n        await state.$openCache$();\n        \"graph\" === type ? await processBundleGraph(state, msg[1], msg.slice(2), !0) : \"graph-url\" === type ? await async function(swState, base, graphPath) {\n            await processBundleGraph(swState, base, [], !1);\n            const response = await directFetch(swState, new URL(base + graphPath, swState.$url$));\n            if (response && 200 === response.status) {\n                const graph = await response.json();\n                graph.push(graphPath);\n                await processBundleGraph(swState, base, graph, !0);\n            }\n        }(state, msg[1], msg[2]) : \"prefetch\" === type ? await processPrefetch(state, msg[1], msg.slice(2)) : \"prefetch-all\" === type ? await function(swState, basePath) {\n            const base = swState.$bases$.find((base2 => basePath === base2.$path$));\n            base ? processPrefetch(swState, basePath, base.$graph$.filter((item => \"string\" == typeof item))) : console.error(`Base path not found: ${basePath}, ignoring prefetch.`);\n        }(state, msg[1]) : \"ping\" === type ? log(\"ping\") : \"verbose\" === type ? (state.$log$ = log)(\"mode: verbose\") : console.error(\"UNKNOWN MESSAGE:\", msg);\n        state.$cache$ = null;\n    };\n    async function processBundleGraph(swState, base, graph, cleanup) {\n        const existingBaseIndex = swState.$bases$.findIndex((base2 => base2 == base2));\n        -1 !== existingBaseIndex && swState.$bases$.splice(existingBaseIndex, 1);\n        swState.$log$(\"adding base:\", base);\n        swState.$bases$.push({\n            $path$: base,\n            $graph$: graph\n        });\n        if (cleanup) {\n            const bundles = new Set(graph.filter((item => \"string\" == typeof item)));\n            for (const request of await swState.$cache$.keys()) {\n                const [cacheBase, filename] = parseBaseFilename(new URL(request.url));\n                const promises = [];\n                if (cacheBase === base && !bundles.has(filename)) {\n                    swState.$log$(\"deleting\", request.url);\n                    promises.push(swState.$cache$.delete(request));\n                }\n                await Promise.all(promises);\n            }\n        }\n    }\n    function processPrefetch(swState, basePath, bundles) {\n        const base = swState.$bases$.find((base2 => basePath === base2.$path$));\n        base ? enqueueFileAndDependencies(swState, base, bundles, 0) : console.error(`Base path not found: ${basePath}, ignoring prefetch.`);\n    }\n    function drainMsgQueue(swState) {\n        if (!swState.$msgQueuePromise$ && swState.$msgQueue$.length) {\n            const top = swState.$msgQueue$.shift();\n            swState.$msgQueuePromise$ = processMessage(swState, top).then((() => {\n                swState.$msgQueuePromise$ = null;\n                drainMsgQueue(swState);\n            }));\n        }\n    }\n    (swScope => {\n        const swState = ((fetch, url) => ({\n            $fetch$: fetch,\n            $queue$: [],\n            $bases$: [],\n            $cache$: null,\n            $openCache$: null,\n            $msgQueue$: [],\n            $msgQueuePromise$: null,\n            $maxPrefetchRequests$: 10,\n            $url$: url,\n            $log$: (...args) => {}\n        }))(swScope.fetch.bind(swScope), new URL(swScope.location.href));\n        swScope.addEventListener(\"fetch\", (async ev => {\n            const request = ev.request;\n            if (\"GET\" === request.method) {\n                const previousCache = swState.$cache$;\n                try {\n                    !previousCache && swState.$openCache$();\n                    const response = directFetch(swState, new URL(request.url));\n                    response && ev.respondWith(response);\n                } finally {\n                    swState.$cache$ = previousCache;\n                }\n            }\n        }));\n        swScope.addEventListener(\"message\", (ev => {\n            swState.$msgQueue$.push(ev.data);\n            drainMsgQueue(swState);\n        }));\n        swScope.addEventListener(\"install\", (() => swScope.skipWaiting()));\n        swScope.addEventListener(\"activate\", (async event => {\n            event.waitUntil(swScope.clients.claim());\n            swState.$openCache$ = async () => swState.$cache$ = await swScope.caches.open(\"QwikBundles\");\n        }));\n    })(globalThis);\n})();";
exports.QWIK_PREFETCH = QWIK_PREFETCH;
exports.QWIK_PREFETCH_DEBUG = QWIK_PREFETCH_DEBUG;
