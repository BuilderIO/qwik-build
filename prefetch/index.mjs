const QWIK_PREFETCH = "(()=>{const n=Number.MAX_SAFE_INTEGER>>>1;function e(e,i){const[o,a]=s(i),c=e.t.find((n=>o===n.i));if(c)return e.o(\"intercepting\",i.pathname),t(e,c,[a],n).then((()=>async function(n,e){const t=n.u.find((n=>n.$.pathname===e.pathname));return t?t.l:(n.o(\"CACHE HIT\",e.pathname),(await n.p).match(e))}(e,i)))}async function t(e,t,o,s){const c=new Set;o.forEach((n=>a(t.h,c,n))),await Promise.all(Array.from(c).map((i=>async function(e,t,i){let o=e.u.find((n=>n.$.pathname===t.pathname));const a=i>=n?\"direct\":\"prefetch\";if(o){const n=o.m?\"fetching\":\"waiting\";o.C<i?(e.o(\"queue update priority\",n,t.pathname),o.C=i):e.o(\"already in queue\",a,n,t.pathname)}else await(await e.p).match(t)||(e.o(\"enqueue\",a,t.pathname),o={C:i,$:t,R:null,l:null,m:!1},o.l=new Promise((n=>o.R=n)),e.u.push(o));return o}(e,new URL(t.i+i,e.$),s)))),i(e)}function i(e){e.u.sort(o);let t=0;for(const o of e.u)if(o.m)t++;else if(t<e.H||o.C>=n){o.m=!0,t++;const a=o.C>=n?\"FETCH (CACHE MISS)\":\"FETCH\";e.o(a,o.$.pathname),e.S(o.$).then((async n=>{200===n.status&&(e.o(\"CACHED\",o.$.pathname),await(await e.p).put(o.$,n.clone())),o.R(n)})).finally((()=>{e.o(\"FETCH DONE\",o.$.pathname),e.u.splice(e.u.indexOf(o),1),i(e)}))}}function o(n,e){return e.C-n.C}function a(n,e,t){if(!e.has(t)){e.add(t);let i=n.findIndex((n=>n===t));if(-1!==i)for(;\"number\"==typeof n[++i];)a(n,e,n[n[i]])}return e}function s(n){const e=new URL(n).pathname,t=e.lastIndexOf(\"/\");return[e.substring(0,t+1),e.substring(t+1)]}const c=(...n)=>{console.log(\"⚙️ Prefetch SW:\",...n)};async function r(n,e,t,i){const o=n.t.findIndex((n=>n==n));if(-1!==o&&n.t.splice(o,1),n.o(\"adding base:\",e),n.t.push({i:e,h:t}),i){const i=new Set(t.filter((n=>\"string\"==typeof n)));for(const t of await(await n.p).keys()){const[o,a]=s(new URL(t.url)),c=[];o!==e||i.has(a)||(n.o(\"deleting\",t.url),c.push((await n.p).delete(t))),await Promise.all(c)}}}function u(n,e,i){const o=n.t.find((n=>e===n.i));o?t(n,o,i,0):console.error(`Base path not found: ${e}, ignoring prefetch.`)}function f(n){if(!n.U&&n.L.length){const t=n.L.shift();n.U=(async(n,t)=>{const i=t[0];n.o(\"received message:\",i,t[1],t.slice(2)),\"graph\"===i?await r(n,t[1],t.slice(2),!0):\"graph-url\"===i?await async function(n,t,i){await r(n,t,[],!1);const o=await e(n,new URL(t+i,n.$));if(o&&200===o.status){const e=await o.json();e.push(i),await r(n,t,e,!0)}}(n,t[1],t[2]):\"prefetch\"===i?await u(n,t[1],t.slice(2)):\"prefetch-all\"===i?await function(n,e){const t=n.t.find((n=>e===n.i));t?u(n,e,t.h.filter((n=>\"string\"==typeof n))):console.error(`Base path not found: ${e}, ignoring prefetch.`)}(n,t[1]):\"ping\"===i?c(\"ping\"):\"verbose\"===i?(n.o=c)(\"mode: verbose\"):console.error(\"UNKNOWN MESSAGE:\",t)})(n,t).then((()=>{n.U=null,f(n)}))}}(n=>{const t={S:n.fetch.bind(n),u:[],t:[],p:null,L:[],U:null,H:10,$:new URL(n.location.href),o:()=>{}};n.addEventListener(\"fetch\",(async n=>{const i=n.request;if(\"GET\"===i.method){const o=e(t,new URL(i.url));o&&n.respondWith(o)}})),n.addEventListener(\"message\",(n=>{t.L.push(n.data),f(t)})),n.addEventListener(\"install\",(()=>n.skipWaiting())),n.addEventListener(\"activate\",(async e=>{e.waitUntil(n.clients.claim()),t.p=n.caches.open(\"QwikBundles\")}))})(globalThis)})();";
const QWIK_PREFETCH_DEBUG = "(() => {\n    const DIRECT_PRIORITY = Number.MAX_SAFE_INTEGER >>> 1;\n    function directFetch(swState, url) {\n        const [basePath, filename] = parseBaseFilename(url);\n        const base = swState.$bases$.find((base2 => basePath === base2.$path$));\n        if (base) {\n            swState.$log$(\"intercepting\", url.pathname);\n            return enqueueFileAndDependencies(swState, base, [ filename ], DIRECT_PRIORITY).then((() => async function(swState, url) {\n                const currentRequestTask = swState.$queue$.find((task => task.$url$.pathname === url.pathname));\n                if (currentRequestTask) {\n                    return currentRequestTask.$response$;\n                }\n                swState.$log$(\"CACHE HIT\", url.pathname);\n                return (await swState.$cache$).match(url);\n            }(swState, url)));\n        }\n    }\n    async function enqueueFileAndDependencies(swState, base, filenames, priority) {\n        const fetchSet =  new Set;\n        filenames.forEach((filename => addDependencies(base.$graph$, fetchSet, filename)));\n        await Promise.all(Array.from(fetchSet).map((filename => async function(swState, url, priority) {\n            let task = swState.$queue$.find((task2 => task2.$url$.pathname === url.pathname));\n            const mode = priority >= DIRECT_PRIORITY ? \"direct\" : \"prefetch\";\n            if (task) {\n                const state = task.$isFetching$ ? \"fetching\" : \"waiting\";\n                if (task.$priority$ < priority) {\n                    swState.$log$(\"queue update priority\", state, url.pathname);\n                    task.$priority$ = priority;\n                } else {\n                    swState.$log$(\"already in queue\", mode, state, url.pathname);\n                }\n            } else {\n                if (!await (await swState.$cache$).match(url)) {\n                    swState.$log$(\"enqueue\", mode, url.pathname);\n                    task = {\n                        $priority$: priority,\n                        $url$: url,\n                        $resolveResponse$: null,\n                        $response$: null,\n                        $isFetching$: !1\n                    };\n                    task.$response$ = new Promise((resolve => task.$resolveResponse$ = resolve));\n                    swState.$queue$.push(task);\n                }\n            }\n            return task;\n        }(swState, new URL(base.$path$ + filename, swState.$url$), priority))));\n        taskTick(swState);\n    }\n    function taskTick(swState) {\n        swState.$queue$.sort(byFetchOrder);\n        let outstandingRequests = 0;\n        for (const task of swState.$queue$) {\n            if (task.$isFetching$) {\n                outstandingRequests++;\n            } else if (outstandingRequests < swState.$maxPrefetchRequests$ || task.$priority$ >= DIRECT_PRIORITY) {\n                task.$isFetching$ = !0;\n                outstandingRequests++;\n                const action = task.$priority$ >= DIRECT_PRIORITY ? \"FETCH (CACHE MISS)\" : \"FETCH\";\n                swState.$log$(action, task.$url$.pathname);\n                swState.$fetch$(task.$url$).then((async response => {\n                    if (200 === response.status) {\n                        swState.$log$(\"CACHED\", task.$url$.pathname);\n                        await (await swState.$cache$).put(task.$url$, response.clone());\n                    }\n                    task.$resolveResponse$(response);\n                })).finally((() => {\n                    swState.$log$(\"FETCH DONE\", task.$url$.pathname);\n                    swState.$queue$.splice(swState.$queue$.indexOf(task), 1);\n                    taskTick(swState);\n                }));\n            }\n        }\n    }\n    function byFetchOrder(a, b) {\n        return b.$priority$ - a.$priority$;\n    }\n    function addDependencies(graph, fetchSet, filename) {\n        if (!fetchSet.has(filename)) {\n            fetchSet.add(filename);\n            let index = graph.findIndex((file => file === filename));\n            if (-1 !== index) {\n                while (\"number\" == typeof graph[++index]) {\n                    addDependencies(graph, fetchSet, graph[graph[index]]);\n                }\n            }\n        }\n        return fetchSet;\n    }\n    function parseBaseFilename(url) {\n        const pathname = new URL(url).pathname;\n        const slashIndex = pathname.lastIndexOf(\"/\");\n        return [ pathname.substring(0, slashIndex + 1), pathname.substring(slashIndex + 1) ];\n    }\n    const log = (...args) => {\n        console.log(\"⚙️ Prefetch SW:\", ...args);\n    };\n    const processMessage = async (state, msg) => {\n        const type = msg[0];\n        state.$log$(\"received message:\", type, msg[1], msg.slice(2));\n        \"graph\" === type ? await processBundleGraph(state, msg[1], msg.slice(2), !0) : \"graph-url\" === type ? await async function(swState, base, graphPath) {\n            await processBundleGraph(swState, base, [], !1);\n            const response = await directFetch(swState, new URL(base + graphPath, swState.$url$));\n            if (response && 200 === response.status) {\n                const graph = await response.json();\n                graph.push(graphPath);\n                await processBundleGraph(swState, base, graph, !0);\n            }\n        }(state, msg[1], msg[2]) : \"prefetch\" === type ? await processPrefetch(state, msg[1], msg.slice(2)) : \"prefetch-all\" === type ? await function(swState, basePath) {\n            const base = swState.$bases$.find((base2 => basePath === base2.$path$));\n            base ? processPrefetch(swState, basePath, base.$graph$.filter((item => \"string\" == typeof item))) : console.error(`Base path not found: ${basePath}, ignoring prefetch.`);\n        }(state, msg[1]) : \"ping\" === type ? log(\"ping\") : \"verbose\" === type ? (state.$log$ = log)(\"mode: verbose\") : console.error(\"UNKNOWN MESSAGE:\", msg);\n    };\n    async function processBundleGraph(swState, base, graph, cleanup) {\n        const existingBaseIndex = swState.$bases$.findIndex((base2 => base2 == base2));\n        -1 !== existingBaseIndex && swState.$bases$.splice(existingBaseIndex, 1);\n        swState.$log$(\"adding base:\", base);\n        swState.$bases$.push({\n            $path$: base,\n            $graph$: graph\n        });\n        if (cleanup) {\n            const bundles = new Set(graph.filter((item => \"string\" == typeof item)));\n            for (const request of await (await swState.$cache$).keys()) {\n                const [cacheBase, filename] = parseBaseFilename(new URL(request.url));\n                const promises = [];\n                if (cacheBase === base && !bundles.has(filename)) {\n                    swState.$log$(\"deleting\", request.url);\n                    promises.push((await swState.$cache$).delete(request));\n                }\n                await Promise.all(promises);\n            }\n        }\n    }\n    function processPrefetch(swState, basePath, bundles) {\n        const base = swState.$bases$.find((base2 => basePath === base2.$path$));\n        base ? enqueueFileAndDependencies(swState, base, bundles, 0) : console.error(`Base path not found: ${basePath}, ignoring prefetch.`);\n    }\n    function drainMsgQueue(swState) {\n        if (!swState.$msgQueuePromise$ && swState.$msgQueue$.length) {\n            const top = swState.$msgQueue$.shift();\n            swState.$msgQueuePromise$ = processMessage(swState, top).then((() => {\n                swState.$msgQueuePromise$ = null;\n                drainMsgQueue(swState);\n            }));\n        }\n    }\n    (swScope => {\n        const swState = ((fetch, url) => ({\n            $fetch$: fetch,\n            $queue$: [],\n            $bases$: [],\n            $cache$: null,\n            $msgQueue$: [],\n            $msgQueuePromise$: null,\n            $maxPrefetchRequests$: 10,\n            $url$: url,\n            $log$: (...args) => {}\n        }))(swScope.fetch.bind(swScope), new URL(swScope.location.href));\n        swScope.addEventListener(\"fetch\", (async ev => {\n            const request = ev.request;\n            if (\"GET\" === request.method) {\n                const response = directFetch(swState, new URL(request.url));\n                response && ev.respondWith(response);\n            }\n        }));\n        swScope.addEventListener(\"message\", (ev => {\n            swState.$msgQueue$.push(ev.data);\n            drainMsgQueue(swState);\n        }));\n        swScope.addEventListener(\"install\", (() => swScope.skipWaiting()));\n        swScope.addEventListener(\"activate\", (async event => {\n            event.waitUntil(swScope.clients.claim());\n            swState.$cache$ = swScope.caches.open(\"QwikBundles\");\n        }));\n    })(globalThis);\n})();";
export { QWIK_PREFETCH, QWIK_PREFETCH_DEBUG };
