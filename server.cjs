/**
 * @license
 * @builder.io/qwik/server 0.0.108
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */

if (typeof globalThis == 'undefined') {
  const g = 'undefined' != typeof global ? global : 'undefined' != typeof window ? window : 'undefined' != typeof self ? self : {};
  g.globalThis = g;
}


if (typeof global == 'undefined') {
  const g = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof window ? window : 'undefined' != typeof self ? self : {};
  g.global = g;
}

globalThis.qwikServer = (function (module) {

if (typeof require !== 'function' && typeof location !== 'undefined' && typeof navigator !== 'undefined') {
  // shim cjs require() for core.cjs within a browser
  globalThis.require = function(path) {
    if (path === './core.cjs' || path === '@builder.io/qwik') {
      if (!self.qwikCore) {
        throw new Error('Qwik Core global, "globalThis.qwikCore", must already be loaded for the Qwik Server to be used within a browser.');
      }
      return self.qwikCore;
    }
    throw new Error('Unable to require() path "' + path + '" from a browser environment.');
  };
}
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/qwik/src/server/index.ts
var server_exports = {};
__export(server_exports, {
  createTimer: () => createTimer,
  getQwikLoaderScript: () => getQwikLoaderScript,
  renderToStream: () => renderToStream,
  renderToString: () => renderToString,
  setServerPlatform: () => setServerPlatform,
  versions: () => versions
});
module.exports = __toCommonJS(server_exports);

// packages/qwik/src/server/utils.ts
function createTimer() {
  if (typeof performance === "undefined") {
    return () => 0;
  }
  const start = performance.now();
  return () => {
    const end = performance.now();
    const delta = end - start;
    return delta / 1e6;
  };
}
function getBuildBase(opts) {
  let base = opts.base;
  if (typeof base === "string") {
    if (!base.endsWith("/")) {
      base += "/";
    }
    return base;
  }
  return "/build/";
}
var versions = {
  qwik: "0.0.108",
  qwikDom: "2.1.19"
};

// packages/qwik/src/server/render.ts
var import_qwik3 = require("@builder.io/qwik");

// packages/qwik/src/server/platform.ts
var import_qwik = require("@builder.io/qwik");
function createPlatform(document, opts, mapper) {
  if (!document || document.nodeType !== 9) {
    throw new Error(`Invalid Document implementation`);
  }
  const mapperFn = opts.symbolMapper ? opts.symbolMapper : (symbolName) => {
    if (mapper) {
      const hash = getSymbolHash(symbolName);
      const result = mapper[hash];
      if (!result) {
        console.error("Cannot resolve symbol", symbolName, "in", mapper);
      }
      return result;
    }
  };
  const serverPlatform = {
    isServer: true,
    async importSymbol(_element, qrl, symbolName) {
      let [modulePath] = String(qrl).split("#");
      if (!modulePath.endsWith(".js")) {
        modulePath += ".js";
      }
      const module2 = require(modulePath);
      if (!(symbolName in module2)) {
        throw new Error(`Q-ERROR: missing symbol '${symbolName}' in module '${modulePath}'.`);
      }
      const symbol = module2[symbolName];
      return symbol;
    },
    raf: () => {
      console.error("server can not rerender");
      return Promise.resolve();
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol(symbolName) {
      return mapperFn(symbolName, mapper);
    }
  };
  return serverPlatform;
}
async function setServerPlatform(document, opts, mapper) {
  const platform = createPlatform(document, opts, mapper);
  (0, import_qwik.setPlatform)(document, platform);
}
var getSymbolHash = (symbolName) => {
  const index = symbolName.lastIndexOf("_");
  if (index > -1) {
    return symbolName.slice(index + 1);
  }
  return symbolName;
};

// packages/qwik/src/server/scripts.ts
var QWIK_LOADER_DEFAULT_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=window,i=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>l(t,e,n,o)))},s=(e,t,n=!1)=>new CustomEvent(e,{detail:t,bubbles:n}),a=e=>{throw Error("QWIK "+e)},c=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),l=async(n,i,l,f)=>{var u;n.hasAttribute("preventdefault:"+l)&&f.preventDefault();const b="on"+i+":"+l,v=null==(u=n._qc_)?void 0:u.li[b];if(v)return void v.forEach((e=>e.getFn([n,f],(()=>n.isConnected))(f,n)));const p=n.getAttribute(b);if(p)for(const i of p.split("\\n")){const l=c(n,i);if(l){const i=d(l),c=(r[l.pathname]||(q=await import(l.href.split("#")[0]),Object.values(q).find(e)||q))[i]||a(l+" does not export "+i),u=t[o];if(n.isConnected)try{t[o]=[n,f,l],c(f,n)}finally{t[o]=u,n.dispatchEvent(s("qsymbol",i,!0))}}}var q},d=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",f=e=>{let t=e.target;for(i("-document",e.type,e);t&&t.getAttribute;)l(t,"",e.type,e),t=e.bubbles?t.parentElement:null},u=e=>{i("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)){n=1,i("","qinit",s("qinit"));const e=t.querySelectorAll("[on\\\\:qvisible]");if(e.length>0){const t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),l(n.target,"","qvisible",s("qvisible",n)))}));e.forEach((e=>t.observe(e)))}}},v=new Set,p=e=>{for(const t of e)v.has(t)||(document.addEventListener(t,f,{capture:!0}),r.addEventListener(t,u),v.add(t))};if(!t.qR){const e=r.qwikevents;Array.isArray(e)&&p(e),r.qwikevents={push:(...e)=>p(e)},t.addEventListener("readystatechange",b),b()}})(document)})();';
var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const win = window;\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const createEvent = (eventName, detail, bubbles = !1) => new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: bubbles\n        });\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                qrls.forEach((q => q.getFn([ element, ev ], (() => element.isConnected))(ev, element)));\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (win[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                element.dispatchEvent(createEvent("qsymbol", symbolName, !0));\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, "", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", createEvent("qinit"));\n                const results = doc.querySelectorAll("[on\\\\:qvisible]");\n                if (results.length > 0) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const events =  new Set;\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    document.addEventListener(eventName, processDocumentEvent, {\n                        capture: !0\n                    });\n                    win.addEventListener(eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
var QWIK_LOADER_OPTIMIZE_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=window,i=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>l(t,e,n,o)))},s=(e,t,n=!1)=>new CustomEvent(e,{detail:t,bubbles:n}),a=e=>{throw Error("QWIK "+e)},c=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),l=async(n,i,l,f)=>{var u;n.hasAttribute("preventdefault:"+l)&&f.preventDefault();const b="on"+i+":"+l,v=null==(u=n._qc_)?void 0:u.li[b];if(v)return void v.forEach((e=>e.getFn([n,f],(()=>n.isConnected))(f,n)));const p=n.getAttribute(b);if(p)for(const i of p.split("\\n")){const l=c(n,i);if(l){const i=d(l),c=(r[l.pathname]||(q=await import(l.href.split("#")[0]),Object.values(q).find(e)||q))[i]||a(l+" does not export "+i),u=t[o];if(n.isConnected)try{t[o]=[n,f,l],c(f,n)}finally{t[o]=u,n.dispatchEvent(s("qsymbol",i,!0))}}}var q},d=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",f=e=>{let t=e.target;for(i("-document",e.type,e);t&&t.getAttribute;)l(t,"",e.type,e),t=e.bubbles?t.parentElement:null},u=e=>{i("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)){n=1,i("","qinit",s("qinit"));const e=t.querySelectorAll("[on\\\\:qvisible]");if(e.length>0){const t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),l(n.target,"","qvisible",s("qvisible",n)))}));e.forEach((e=>t.observe(e)))}}},v=new Set,p=e=>{for(const t of e)v.has(t)||(document.addEventListener(t,f,{capture:!0}),r.addEventListener(t,u),v.add(t))};if(!t.qR){const e=r.qwikevents;Array.isArray(e)&&p(e),r.qwikevents={push:(...e)=>p(e)},t.addEventListener("readystatechange",b),b()}})(document)})();';
var QWIK_LOADER_OPTIMIZE_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const win = window;\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const createEvent = (eventName, detail, bubbles = !1) => new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: bubbles\n        });\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                qrls.forEach((q => q.getFn([ element, ev ], (() => element.isConnected))(ev, element)));\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (win[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                element.dispatchEvent(createEvent("qsymbol", symbolName, !0));\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, "", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", createEvent("qinit"));\n                const results = doc.querySelectorAll("[on\\\\:qvisible]");\n                if (results.length > 0) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const events = new Set;\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    document.addEventListener(eventName, processDocumentEvent, {\n                        capture: !0\n                    });\n                    win.addEventListener(eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
function getQwikLoaderScript(opts = {}) {
  if (Array.isArray(opts.events) && opts.events.length > 0) {
    const loader = opts.debug ? QWIK_LOADER_OPTIMIZE_DEBUG : QWIK_LOADER_OPTIMIZE_MINIFIED;
    return loader.replace("window.qEvents", JSON.stringify(opts.events));
  }
  return opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED;
}

// packages/qwik/src/server/prefetch-implementation.ts
var import_qwik2 = require("@builder.io/qwik");

// packages/qwik/src/server/prefetch-utils.ts
function workerFetchScript() {
  const fetch = `Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})`;
  const workerBody = `onmessage=(e)=>{${fetch}}`;
  const blob = `new Blob(['${workerBody}'],{type:"text/javascript"})`;
  const url = `URL.createObjectURL(${blob})`;
  let s = `const w=new Worker(${url});`;
  s += `w.postMessage(u.map(u=>new URL(u,origin)+''));`;
  s += `w.onmessage=()=>{w.terminate()};`;
  return s;
}
function prefetchUrlsEventScript(prefetchResources) {
  const data = {
    bundles: flattenPrefetchResources(prefetchResources).map((u) => u.split("/").pop())
  };
  return `dispatchEvent(new CustomEvent("qprefetch",{detail:${JSON.stringify(data)}}))`;
}
function flattenPrefetchResources(prefetchResources) {
  const urls = [];
  const addPrefetchResource = (prefetchResources2) => {
    if (Array.isArray(prefetchResources2)) {
      for (const prefetchResource of prefetchResources2) {
        if (!urls.includes(prefetchResource.url)) {
          urls.push(prefetchResource.url);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(prefetchResources);
  return urls;
}

// packages/qwik/src/server/prefetch-implementation.ts
function applyPrefetchImplementation(opts, prefetchResources) {
  const { prefetchStrategy } = opts;
  if (prefetchStrategy !== null) {
    const prefetchImpl = normalizePrefetchImplementation(prefetchStrategy == null ? void 0 : prefetchStrategy.implementation);
    const prefetchNodes = [];
    if (prefetchImpl.prefetchEvent === "always") {
      prefetchUrlsEvent(prefetchNodes, prefetchResources);
    }
    if (prefetchImpl.linkInsert === "html-append") {
      linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl);
    }
    if (prefetchImpl.linkInsert === "js-append") {
      linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl);
    } else if (prefetchImpl.workerFetchInsert === "always") {
      workerFetchImplementation(prefetchNodes, prefetchResources);
    }
    if (prefetchNodes.length > 0) {
      return (0, import_qwik2.jsx)(import_qwik2.Fragment, { children: prefetchNodes });
    }
  }
  return null;
}
function prefetchUrlsEvent(prefetchNodes, prefetchResources) {
  prefetchNodes.push(
    (0, import_qwik2.jsx)("script", {
      type: "module",
      dangerouslySetInnerHTML: prefetchUrlsEventScript(prefetchResources)
    })
  );
}
function linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const urls = flattenPrefetchResources(prefetchResources);
  const rel = prefetchImpl.linkRel || "prefetch";
  for (const url of urls) {
    const attributes = {};
    attributes["href"] = url;
    attributes["rel"] = rel;
    if (rel === "prefetch" || rel === "preload") {
      if (url.endsWith(".js")) {
        attributes["as"] = "script";
      }
    }
    prefetchNodes.push((0, import_qwik2.jsx)("link", attributes, void 0));
  }
}
function linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const rel = prefetchImpl.linkRel || "prefetch";
  let s = ``;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `let supportsLinkRel = true;`;
  }
  s += `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += `u.map((u,i)=>{`;
  s += `const l=document.createElement('link');`;
  s += `l.setAttribute("href",u);`;
  s += `l.setAttribute("rel","${rel}");`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(i===0){`;
    s += `try{`;
    s += `supportsLinkRel=l.relList.supports("${rel}");`;
    s += `}catch(e){}`;
    s += `}`;
  }
  s += `document.body.appendChild(l);`;
  s += `});`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(!supportsLinkRel){`;
    s += workerFetchScript();
    s += `}`;
  }
  if (prefetchImpl.workerFetchInsert === "always") {
    s += workerFetchScript();
  }
  prefetchNodes.push(
    (0, import_qwik2.jsx)("script", {
      type: "module",
      dangerouslySetInnerHTML: s
    })
  );
}
function workerFetchImplementation(prefetchNodes, prefetchResources) {
  let s = `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += workerFetchScript();
  prefetchNodes.push(
    (0, import_qwik2.jsx)("script", {
      type: "module",
      dangerouslySetInnerHTML: s
    })
  );
}
function normalizePrefetchImplementation(input) {
  if (typeof input === "string") {
    switch (input) {
      case "link-prefetch-html": {
        return {
          linkInsert: "html-append",
          linkRel: "prefetch",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-prefetch": {
        return {
          linkInsert: "js-append",
          linkRel: "prefetch",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
      case "link-preload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "preload",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-preload": {
        return {
          linkInsert: "js-append",
          linkRel: "preload",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
      case "link-modulepreload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "modulepreload",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-modulepreload": {
        return {
          linkInsert: "js-append",
          linkRel: "modulepreload",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
    }
    return {
      linkInsert: null,
      linkRel: null,
      workerFetchInsert: "always",
      prefetchEvent: null
    };
  }
  if (input && typeof input === "object") {
    return input;
  }
  const defaultImplementation = {
    linkInsert: null,
    linkRel: null,
    workerFetchInsert: "always",
    prefetchEvent: null
  };
  return defaultImplementation;
}

// packages/qwik/src/optimizer/src/manifest.ts
var EVENT_PRIORITY = [
  "click",
  "dblclick",
  "contextmenu",
  "auxclick",
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerover",
  "pointerenter",
  "pointerleave",
  "pointerout",
  "pointercancel",
  "gotpointercapture",
  "lostpointercapture",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "wheel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "keydown",
  "keyup",
  "keypress",
  "input",
  "change",
  "search",
  "invalid",
  "beforeinput",
  "select",
  "focusin",
  "focusout",
  "focus",
  "blur",
  "submit",
  "reset",
  "scroll"
].map((n) => `on${n.toLowerCase()}$`);
var FUNCTION_PRIORITY = [
  "useWatch$",
  "useClientEffect$",
  "useEffect$",
  "component$",
  "useStyles$",
  "useStylesScoped$"
].map((n) => n.toLowerCase());
function getValidManifest(manifest) {
  if (manifest != null && manifest.mapping != null && typeof manifest.mapping === "object" && manifest.symbols != null && typeof manifest.symbols === "object" && manifest.bundles != null && typeof manifest.bundles === "object") {
    return manifest;
  }
  return void 0;
}

// packages/qwik/src/server/prefetch-strategy.ts
function getPrefetchResources(snapshotResult, opts, mapper) {
  const manifest = getValidManifest(opts.manifest);
  if (manifest && mapper) {
    const prefetchStrategy = opts.prefetchStrategy;
    const buildBase = getBuildBase(opts);
    if (prefetchStrategy !== null) {
      if (!prefetchStrategy || !prefetchStrategy.symbolsToPrefetch || prefetchStrategy.symbolsToPrefetch === "auto") {
        return getAutoPrefetch(snapshotResult, manifest, mapper, buildBase);
      }
      if (typeof prefetchStrategy.symbolsToPrefetch === "function") {
        try {
          return prefetchStrategy.symbolsToPrefetch({ manifest });
        } catch (e) {
          console.error("getPrefetchUrls, symbolsToPrefetch()", e);
        }
      }
    }
  }
  return [];
}
function getAutoPrefetch(snapshotResult, manifest, mapper, buildBase) {
  const prefetchResources = [];
  const listeners = snapshotResult == null ? void 0 : snapshotResult.listeners;
  const stateObjs = snapshotResult == null ? void 0 : snapshotResult.objs;
  const urls = /* @__PURE__ */ new Set();
  if (Array.isArray(listeners)) {
    for (const prioritizedSymbolName in mapper) {
      const hasSymbol = listeners.some((l) => {
        return l.qrl.getHash() === prioritizedSymbolName;
      });
      if (hasSymbol) {
        addBundle(manifest, urls, prefetchResources, buildBase, mapper[prioritizedSymbolName][1]);
      }
    }
  }
  if (Array.isArray(stateObjs)) {
    for (const obj of stateObjs) {
      if (isQrl(obj)) {
        const qrlSymbolName = obj.getHash();
        const resolvedSymbol = mapper[qrlSymbolName];
        if (resolvedSymbol) {
          addBundle(manifest, urls, prefetchResources, buildBase, resolvedSymbol[0]);
        }
      }
    }
  }
  return prefetchResources;
}
function addBundle(manifest, urls, prefetchResources, buildBase, bundleFileName) {
  const url = buildBase + bundleFileName;
  if (!urls.has(url)) {
    urls.add(url);
    const bundle = manifest.bundles[bundleFileName];
    if (bundle) {
      const prefetchResource = {
        url,
        imports: []
      };
      prefetchResources.push(prefetchResource);
      if (Array.isArray(bundle.imports)) {
        for (const importedFilename of bundle.imports) {
          addBundle(manifest, urls, prefetchResource.imports, buildBase, importedFilename);
        }
      }
    }
  }
}
var isQrl = (value) => {
  return typeof value === "function" && typeof value.getSymbol === "function";
};

// packages/qwik/src/server/document.ts
function createEl(tagName, doc) {
  return {
    nodeType: tagName === ":virtual" ? 111 : 1,
    nodeName: tagName.toUpperCase(),
    localName: tagName,
    ownerDocument: doc,
    isConnected: true,
    _qc_: null,
    __virtual: null,
    "q:id": null
  };
}
function createSimpleDocument() {
  const doc = {
    nodeType: 9,
    parentElement: null,
    ownerDocument: null,
    createElement(tagName) {
      return createEl(tagName, doc);
    }
  };
  return doc;
}

// packages/qwik/src/core/util/qdev.ts
var qDev = globalThis.qDev === true;
var qSerialize = globalThis.qSerialize !== false;
var qDynamicPlatform = globalThis.qDynamicPlatform !== false;
var qTest = globalThis.qTest === true;

// packages/qwik/src/core/util/flyweight.ts
var EMPTY_ARRAY = [];
var EMPTY_OBJ = {};
if (qDev) {
  Object.freeze(EMPTY_ARRAY);
  Object.freeze(EMPTY_OBJ);
  Error.stackTraceLimit = 9999;
}

// packages/qwik/src/server/render.ts
var DOCTYPE = "<!DOCTYPE html>";
async function renderToStream(rootNode, opts) {
  var _a, _b;
  let stream = opts.stream;
  let bufferSize = 0;
  let totalSize = 0;
  let networkFlushes = 0;
  let firstFlushTime = 0;
  const doc = createSimpleDocument();
  const inOrderStreaming = ((_a = opts.streaming) == null ? void 0 : _a.inOrder) ?? {
    strategy: "auto",
    initialChunkSize: 3e4,
    minimunChunkSize: 1024
  };
  const containerTagName = opts.containerTagName ?? "html";
  const containerAttributes = opts.containerAttributes ?? {};
  const buffer = [];
  const nativeStream = stream;
  const firstFlushTimer = createTimer();
  function flush() {
    buffer.forEach((chunk) => nativeStream.write(chunk));
    buffer.length = 0;
    bufferSize = 0;
    networkFlushes++;
    if (networkFlushes === 1) {
      firstFlushTime = firstFlushTimer();
    }
  }
  function enqueue(chunk) {
    bufferSize += chunk.length;
    totalSize += chunk.length;
    buffer.push(chunk);
  }
  switch (inOrderStreaming.strategy) {
    case "disabled":
      stream = {
        write: enqueue
      };
      break;
    case "auto":
      let count = 0;
      const minimunChunkSize = inOrderStreaming.minimunChunkSize ?? 0;
      const initialChunkSize = inOrderStreaming.initialChunkSize ?? 0;
      stream = {
        write(chunk) {
          enqueue(chunk);
          if (chunk === "<!--qkssr-pu-->") {
            count++;
          } else if (count > 0 && chunk === "<!--qkssr-po-->") {
            count--;
          }
          const chunkSize = networkFlushes === 0 ? initialChunkSize : minimunChunkSize;
          if (count === 0 && bufferSize >= chunkSize) {
            flush();
          }
        }
      };
      break;
  }
  if (containerTagName === "html") {
    stream.write(DOCTYPE);
  } else {
    if (opts.qwikLoader) {
      if (opts.qwikLoader.include === void 0) {
        opts.qwikLoader.include = "never";
      }
      if (opts.qwikLoader.position === void 0) {
        opts.qwikLoader.position = "bottom";
      }
    } else {
      opts.qwikLoader = {
        include: "never"
      };
    }
  }
  if (!opts.manifest) {
    console.warn("Missing client manifest, loading symbols in the client might 404");
  }
  const buildBase = getBuildBase(opts);
  const mapper = computeSymbolMapper(opts.manifest);
  await setServerPlatform(doc, opts, mapper);
  let prefetchResources = [];
  let snapshotResult = null;
  const injections = (_b = opts.manifest) == null ? void 0 : _b.injections;
  const beforeContent = injections ? injections.map((injection) => (0, import_qwik3.jsx)(injection.tag, injection.attributes ?? EMPTY_OBJ)) : void 0;
  const renderTimer = createTimer();
  let renderTime = 0;
  let snapshotTime = 0;
  const renderSymbols = [];
  await (0, import_qwik3.renderSSR)(doc, rootNode, {
    stream,
    containerTagName,
    containerAttributes,
    envData: opts.envData,
    base: buildBase,
    beforeContent,
    beforeClose: async (contexts, containerState) => {
      var _a2, _b2;
      renderTime = renderTimer();
      const snapshotTimer = createTimer();
      snapshotResult = await (0, import_qwik3._pauseFromContexts)(contexts, containerState);
      prefetchResources = getPrefetchResources(snapshotResult, opts, mapper);
      const jsonData = JSON.stringify(snapshotResult.state, void 0, qDev ? "  " : void 0);
      const children = [
        (0, import_qwik3.jsx)("script", {
          type: "qwik/json",
          dangerouslySetInnerHTML: escapeText(jsonData)
        })
      ];
      if (prefetchResources.length > 0) {
        children.push(applyPrefetchImplementation(opts, prefetchResources));
      }
      const needLoader = !snapshotResult || snapshotResult.mode !== "static";
      const includeMode = ((_a2 = opts.qwikLoader) == null ? void 0 : _a2.include) ?? "auto";
      const includeLoader = includeMode === "always" || includeMode === "auto" && needLoader;
      if (includeLoader) {
        const qwikLoaderScript = getQwikLoaderScript({
          events: (_b2 = opts.qwikLoader) == null ? void 0 : _b2.events,
          debug: opts.debug
        });
        children.push(
          (0, import_qwik3.jsx)("script", {
            id: "qwikloader",
            dangerouslySetInnerHTML: qwikLoaderScript
          })
        );
      }
      const uniqueListeners = /* @__PURE__ */ new Set();
      snapshotResult.listeners.forEach((li) => {
        uniqueListeners.add(JSON.stringify(li.eventName));
      });
      const extraListeners = Array.from(uniqueListeners);
      if (extraListeners.length > 0) {
        let content = `window.qwikevents.push(${extraListeners.join(", ")})`;
        if (!includeLoader) {
          content = `window.qwikevents||=[];${content}`;
        }
        children.push(
          (0, import_qwik3.jsx)("script", {
            dangerouslySetInnerHTML: content
          })
        );
      }
      collectRenderSymbols(renderSymbols, contexts);
      snapshotTime = snapshotTimer();
      return (0, import_qwik3.jsx)(import_qwik3.Fragment, { children });
    }
  });
  flush();
  const result = {
    prefetchResources,
    snapshotResult,
    flushes: networkFlushes,
    manifest: opts.manifest,
    size: totalSize,
    timing: {
      render: renderTime,
      snapshot: snapshotTime,
      firstFlush: firstFlushTime
    },
    _symbols: renderSymbols
  };
  return result;
}
async function renderToString(rootNode, opts = {}) {
  const chunks = [];
  const stream = {
    write: (chunk) => {
      chunks.push(chunk);
    }
  };
  const result = await renderToStream(rootNode, {
    ...opts,
    stream
  });
  return {
    ...result,
    html: chunks.join("")
  };
}
function computeSymbolMapper(manifest) {
  if (manifest) {
    const mapper = {};
    Object.entries(manifest.mapping).forEach(([key, value]) => {
      mapper[getSymbolHash(key)] = [key, value];
    });
    return mapper;
  }
  return void 0;
}
var escapeText = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
function collectRenderSymbols(renderSymbols, elements) {
  var _a;
  for (const ctx of elements) {
    const symbol = (_a = ctx.$renderQrl$) == null ? void 0 : _a.getSymbol();
    if (symbol && !renderSymbols.includes(symbol)) {
      renderSymbols.push(symbol);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTimer,
  getQwikLoaderScript,
  renderToStream,
  renderToString,
  setServerPlatform,
  versions
});
return module.exports; })(typeof module === 'object' && module.exports ? module : { exports: {} });
