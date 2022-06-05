/**
 * @license
 * @builder.io/qwik/testing
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
if (typeof globalThis == 'undefined') {
  const g = 'undefined' != typeof global ? global : 'undefined' != typeof window ? window : 'undefined' != typeof self ? self : {};
  g.globalThis = g;
}

var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/qwik/src/testing/index.ts
var testing_exports = {};
__export(testing_exports, {
  ElementFixture: () => ElementFixture,
  applyDocumentConfig: () => applyDocumentConfig,
  createDocument: () => createDocument,
  createWindow: () => createWindow,
  getTestPlatform: () => getTestPlatform,
  isPromise: () => isPromise,
  toDOM: () => toDOM,
  toFileUrl: () => toFileUrl
});
module.exports = __toCommonJS(testing_exports);

// packages/qwik/src/testing/document.ts
var import_server = require("../server.cjs");

// packages/qwik/src/testing/platform.ts
var import_qwik = require("../core.cjs");
var import_fs = require("fs");
var import_url = require("url");

// packages/qwik/src/core/util/qdev.ts
var qDev = globalThis.qDev !== false;
var qTest = globalThis.describe !== void 0;

// packages/qwik/src/core/util/log.ts
var STYLE = qDev ? `background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;` : "";
var logError = (message, ...optionalParams) => {
  console.error("%cQWIK ERROR", STYLE, message, ...optionalParams);
};
var logWarn = (message, ...optionalParams) => {
  console.warn("%cQWIK WARN", STYLE, message, ...optionalParams);
};
var logDebug = (message, ...optionalParams) => {
  if (qDev) {
    console.debug("%cQWIK", STYLE, message, ...optionalParams);
  }
};

// packages/qwik/src/core/assert/assert.ts
function assertDefined(value, text) {
  if (qDev) {
    if (value != null)
      return;
    throw newError(text || "Expected defined value");
  }
}
function assertEqual(value1, value2, text) {
  if (qDev) {
    if (value1 === value2)
      return;
    throw newError(text || `Expected '${value1}' === '${value2}'.`);
  }
}
function newError(text) {
  debugger;
  const error = new Error(text);
  logError(error);
  return error;
}

// packages/qwik/src/core/util/markers.ts
var QHostAttr = "q:host";
var OnRenderProp = "q:renderFn";
var QHostSelector = "[q\\:host]";
var ComponentScopedStyles = "q:sstyle";
var ComponentStylesPrefixHost = "\u{1F48E}";
var ComponentStylesPrefixContent = "\u2B50\uFE0F";
var QSlotAttr = "q:slot";
var QContainerAttr = "q:container";
var QContainerSelector = "[q\\:container]";
var RenderEvent = "qRender";
var ELEMENT_ID = "q:id";
var ELEMENT_ID_PREFIX = "#";

// packages/qwik/src/core/util/dom.ts
function getDocument(node) {
  if (typeof document !== "undefined") {
    return document;
  }
  if (node.nodeType === 9) {
    return node;
  }
  let doc = node.ownerDocument;
  while (doc && doc.nodeType !== 9) {
    doc = doc.parentNode;
  }
  assertDefined(doc);
  return doc;
}

// packages/qwik/src/core/use/use-core.ts
var CONTAINER = Symbol("container");
function isStyleTask(obj) {
  return obj && typeof obj === "object" && obj.type === "style";
}
var _context;
function tryGetInvokeContext() {
  if (!_context) {
    const context = typeof document !== "undefined" && document && document.__q_context__;
    if (!context) {
      return void 0;
    }
    if (Array.isArray(context)) {
      const element = context[0];
      const hostElement = getHostElement(element);
      assertDefined(element);
      return document.__q_context__ = newInvokeContext(getDocument(element), hostElement, element, context[1], context[2]);
    }
    return context;
  }
  return _context;
}
function getInvokeContext() {
  const ctx = tryGetInvokeContext();
  if (!ctx) {
    throw new Error("Q-ERROR: invoking 'use*()' method outside of invocation context.");
  }
  return ctx;
}
function useInvoke(context, fn, ...args) {
  const previousContext = _context;
  let returnValue;
  try {
    _context = context;
    returnValue = fn.apply(null, args);
  } finally {
    const currentCtx = _context;
    _context = previousContext;
    if (currentCtx.waitOn && currentCtx.waitOn.length > 0) {
      return Promise.all(currentCtx.waitOn).then(() => returnValue);
    }
  }
  return returnValue;
}
function newInvokeContext(doc, hostElement, element, event, url) {
  return {
    seq: 0,
    doc,
    hostElement,
    element,
    event,
    url: url || null,
    qrl: void 0
  };
}
function useWaitOn(promise) {
  const ctx = getInvokeContext();
  (ctx.waitOn || (ctx.waitOn = [])).push(promise);
}
function getHostElement(el) {
  let foundSlot = false;
  let node = el;
  while (node) {
    const isHost = node.hasAttribute(QHostAttr);
    const isSlot = node.tagName === "Q:SLOT";
    if (isHost) {
      if (!foundSlot) {
        break;
      } else {
        foundSlot = false;
      }
    }
    if (isSlot) {
      foundSlot = true;
    }
    node = node.parentElement;
  }
  return node;
}
function getContainer(el) {
  let container = el[CONTAINER];
  if (!container) {
    container = el.closest(QContainerSelector);
    el[CONTAINER] = container;
  }
  return container;
}
function useContainerState() {
  var _a;
  const ctx = getInvokeContext();
  const containerState = (_a = ctx.renderCtx) == null ? void 0 : _a.containerState;
  if (!containerState) {
    throw new Error("Cant access containerState for existing context");
  }
  return containerState;
}

// packages/qwik/src/testing/platform.ts
function createPlatform(document2) {
  if (!document2 || document2.nodeType !== 9) {
    throw new Error(`Invalid Document implementation`);
  }
  const doc = document2;
  let render = null;
  const moduleCache = /* @__PURE__ */ new Map();
  const testPlatform = {
    isServer: true,
    importSymbol(element, url, symbolName) {
      const urlDoc = toUrl(element.ownerDocument, element, url);
      const importPath = toPath(urlDoc);
      const mod = moduleCache.get(importPath);
      if (mod) {
        return mod[symbolName];
      }
      return Promise.resolve().then(() => __toESM(require(importPath))).then((mod2) => {
        moduleCache.set(importPath, mod2);
        return mod2[symbolName];
      });
    },
    nextTick: (renderMarked2) => {
      if (!render) {
        render = {
          fn: renderMarked2,
          promise: null,
          resolve: null,
          reject: null
        };
        render.promise = new Promise((resolve, reject) => {
          render.resolve = resolve;
          render.reject = reject;
        });
      } else if (renderMarked2 !== render.fn) {
        throw new Error("Must be same function");
      }
      return render.promise;
    },
    raf: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    flush: async () => {
      await Promise.resolve();
      if (render) {
        try {
          render.resolve(await render.fn(doc));
        } catch (e) {
          render.reject(e);
        }
        render = null;
      }
    },
    chunkForSymbol() {
      return void 0;
    }
  };
  return testPlatform;
}
function setTestPlatform(document2) {
  const platform = createPlatform(document2);
  (0, import_qwik.setPlatform)(document2, platform);
}
function toUrl(doc, element, url) {
  var _a;
  const containerEl = getContainer(element);
  const base = new URL((_a = containerEl == null ? void 0 : containerEl.getAttribute("q:base")) != null ? _a : doc.baseURI, doc.baseURI);
  return new URL(url, base);
}
function toPath(url) {
  const normalizedUrl = new URL(String(url));
  normalizedUrl.hash = "";
  normalizedUrl.search = "";
  const path = (0, import_url.fileURLToPath)(String(normalizedUrl));
  const importPaths = [path, ...testExts.map((ext) => path + ext)];
  for (const importPath of importPaths) {
    if ((0, import_fs.existsSync)(importPath)) {
      return importPath;
    }
  }
  throw new Error(`Unable to find path for import "${url}"`);
}
function getTestPlatform(document2) {
  const testPlatform = (0, import_qwik.getPlatform)(document2);
  if (!testPlatform) {
    throw new Error(`Test platform was not applied to the document`);
  }
  if (typeof testPlatform.flush !== "function") {
    throw new Error(`Invalid Test platform applied to the document`);
  }
  return testPlatform;
}
var testExts = [".ts", ".tsx", ".js", ".cjs", ".mjs", ".jsx"];

// packages/qwik/src/testing/document.ts
function createWindow(opts = {}) {
  const win = (0, import_server._createDocument)(opts).defaultView;
  setTestPlatform(win.document);
  return win;
}
function createDocument(opts = {}) {
  const doc = (0, import_server._createDocument)(opts);
  setTestPlatform(doc);
  return doc;
}

// packages/qwik/src/core/util/types.ts
function isHtmlElement(node) {
  return node ? node.nodeType === 1 : false;
}

// packages/qwik/src/core/error/stringify.ts
function stringifyDebug(value) {
  if (value == null)
    return String(value);
  if (typeof value === "function")
    return value.name;
  if (isHtmlElement(value))
    return stringifyElement(value);
  if (value instanceof URL)
    return String(value);
  if (typeof value === "object")
    return JSON.stringify(value, function(key, value2) {
      if (isHtmlElement(value2))
        return stringifyElement(value2);
      return value2;
    });
  return String(value);
}
function stringifyElement(element) {
  let html = "<" + element.localName;
  const attributes = element.attributes;
  const names = [];
  for (let i = 0; i < attributes.length; i++) {
    names.push(attributes[i].name);
  }
  names.sort();
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    let value = element.getAttribute(name);
    if (value == null ? void 0 : value.startsWith("file:/")) {
      value = value.replace(/(file:\/\/).*(\/.*)$/, (all, protocol, file) => protocol + "..." + file);
    }
    html += " " + name + (value == null || value == "" ? "" : "='" + value.replace("'", "&apos;") + "'");
  }
  return html + ">";
}

// packages/qwik/src/core/error/error.ts
function qError(code, ...args) {
  if (qDev) {
    const text = codeToText(code);
    const parts = text.split("{}");
    const error = parts.map((value, index) => {
      return value + (index === parts.length - 1 ? "" : stringifyDebug(args[index]));
    }).join("");
    debugger;
    return new Error(error);
  } else {
    return new Error(`QError ` + code);
  }
}
function codeToText(code) {
  const area = {
    0: "ERROR",
    1: "QRL-ERROR",
    2: "INJECTOR-ERROR",
    3: "SERVICE-ERROR",
    4: "COMPONENT-ERROR",
    5: "PROVIDER-ERROR",
    6: "RENDER-ERROR",
    7: "EVENT-ERROR"
  }[Math.floor(code / 100)];
  const text = {
    [0 /* TODO */]: "{}",
    [1 /* Core_qConfigNotFound_path */]: "QConfig not found in path '{}'.",
    [2 /* Core_unrecognizedStack_frame */]: "Unrecognized stack format '{}'",
    [3 /* Core_noAttribute_atr1_element */]: "Could not find entity state '{}' at '{}' or any of it's parents.",
    [4 /* Core_noAttribute_atr1_attr2_element */]: "Could not find entity state '{}' ( or entity provider '{}') at '{}' or any of it's parents.",
    [5 /* Core_missingProperty_name_props */]: "Missing property '{}' in props '{}'.",
    [6 /* Core_missingExport_name_url_props */]: "Missing export '{}' from '{}'. Exported symbols are: {}",
    [100 /* QRL_expectFunction_url_actual */]: "QRL '${}' should point to function, was '{}'.",
    [200 /* Injector_noHost_element */]: "Can't find host element above '{}'.",
    [201 /* Injector_expectedSpecificInjector_expected_actual */]: "Provider is expecting '{}' but got '{}'.",
    [202 /* Injector_notElement_arg */]: "Expected 'Element' was '{}'.",
    [203 /* Injector_wrongMethodThis_expected_actual */]: "Expected injection 'this' to be of type '{}', but was of type '{}'.",
    [204 /* Injector_missingSerializedState_entityKey_element */]: "Entity key '{}' is found on '{}' but does not contain state. Was 'serializeState()' not run during dehydration?",
    [206 /* Injector_notFound_element */]: "No injector can be found starting at '{}'.",
    [207 /* Injector_eventInjectorNotSerializable */]: "EventInjector does not support serialization.",
    [300 /* Entity_notValidKey_key */]: "Data key '{}' is not a valid key.\n  - Data key can only contain characters (preferably lowercase) or number\n  - Data key is prefixed with entity name\n  - Data key is made up from parts that are separated with ':'.",
    [301 /* Entity_keyAlreadyExists_key */]: "A entity with key '{}' already exists.",
    [303 /* Entity_invalidAttribute_name */]: "'{}' is not a valid attribute. Attributes can only contain 'a-z' (lowercase), '0-9', '-' and '_'.",
    [304 /* Entity_missingExpandoOrState_attrName */]: "Found '{}' but expando did not have entity and attribute did not have state.",
    [305 /* Entity_elementMissingEntityAttr_element_attr */]: "Element '{}' is missing entity attribute definition '{}'.",
    [306 /* Entity_noState_entity_props */]: "Unable to create state for entity '{}' with props '{}' because no state found and '$newState()' method was not defined on entity.",
    [307 /* Entity_expected_obj */]: "'{}' is not an instance of 'Entity'.",
    [308 /* Entity_overridesConstructor_entity */]: "'{}' overrides 'constructor' property preventing 'EntityType' retrieval.",
    [311 /* Entity_no$keyProps_entity */]: "Entity '{}' does not define '$keyProps'.",
    [310 /* Entity_no$type_entity */]: "Entity '{}' must have static '$type' property defining the name of the entity.",
    [312 /* Entity_no$qrl_entity */]: "Entity '{}' must have static '$qrl' property defining the import location of the entity.",
    [313 /* Entity_nameCollision_name_currentQrl_expectedQrl */]: "Name collision. Already have entity named '{}' with QRL '{}' but expected QRL '{}'.",
    [309 /* Entity_keyMissingParts_key_key */]: "Entity key '{}' is missing values. Expecting '{}:someValue'.",
    [314 /* Entity_keyTooManyParts_entity_parts_key */]: "Entity '{}' defines '$keyProps' as  '{}'. Actual key '{}' has more parts than entity defines.",
    [315 /* Entity_keyNameMismatch_key_name_entity_name */]: "Key '{}' belongs to entity named '{}', but expected entity '{}' with name '{}'.",
    [316 /* Entity_stateMissingKey_state */]: "Entity state is missing '$key'. Are you sure you passed in state? Got '{}'.",
    [400 /* Component_bindNeedsKey */]: `'bind:' must have an key. (Example: 'bind:key="propertyName"').`,
    [401 /* Component_bindNeedsValue */]: `'bind:id' must have a property name. (Example: 'bind:key="propertyName"').`,
    [402 /* Component_needsState */]: "Can't find state on host element.",
    [403 /* Component_needsInjectionContext_constructor */]: "Components must be instantiated inside an injection context. Use '{}.new(...)' for creation.",
    [404 /* Component_noProperty_propName_props_host */]: "Property '{}' not found in '{}' on component '{}'.",
    [405 /* Component_notFound_component */]: "Unable to find '{}' component.",
    [406 /* Component_doesNotMatch_component_actual */]: "Requesting component type '{}' does not match existing component instance '{}'.",
    [408 /* Component_noState_component_props */]: "Unable to create state for component '{}' with props '{}' because no state found and '$newState()' method was not defined on component.",
    [500 /* Provider_unrecognizedFormat_value */]: "Unrecognized expression format '{}'.",
    [600 /* Render_unexpectedJSXNodeType_type */]: "Unexpected JSXNode<{}> type.",
    [601 /* Render_unsupportedFormat_obj_attr */]: "Value '{}' can't be written into '{}' attribute.",
    [602 /* Render_expectingEntity_entity */]: "Expecting entity object, got '{}'.",
    [603 /* Render_expectingEntityArray_obj */]: "Expecting array of entities, got '{}'.",
    [604 /* Render_expectingEntityOrComponent_obj */]: "Expecting Entity or Component got '{}'.",
    [699 /* Render_stateMachineStuck */]: "Render state machine did not advance.",
    [700 /* Event_emitEventRequiresName_url */]: "Missing '$type' attribute in the '{}' url.",
    [701 /* Event_emitEventCouldNotFindListener_event_element */]: "Re-emitting event '{}' but no listener found at '{}' or any of its parents."
  }[code];
  let textCode = "000" + code;
  textCode = textCode.slice(-3);
  return `${area}(Q-${textCode}): ${text}`;
}

// packages/qwik/src/core/util/promises.ts
function isPromise(value) {
  return value instanceof Promise;
}
var then = (promise, thenFn, rejectFn) => {
  return isPromise(promise) ? promise.then(thenFn, rejectFn) : thenFn(promise);
};
var promiseAll = (promises) => {
  const hasPromise = promises.some(isPromise);
  if (hasPromise) {
    return Promise.all(promises);
  }
  return promises;
};

// packages/qwik/src/core/util/flyweight.ts
var EMPTY_ARRAY = [];
var EMPTY_OBJ = {};
if (qDev) {
  Object.freeze(EMPTY_ARRAY);
  Object.freeze(EMPTY_OBJ);
}

// packages/qwik/src/core/platform/platform.ts
var createPlatform2 = (doc) => {
  const moduleCache = /* @__PURE__ */ new Map();
  return {
    isServer: false,
    importSymbol(element, url, symbolName) {
      const urlDoc = toUrl2(doc, element, url).toString();
      const urlCopy = new URL(urlDoc);
      urlCopy.hash = "";
      urlCopy.search = "";
      const importURL = urlCopy.href;
      const mod = moduleCache.get(importURL);
      if (mod) {
        return mod[symbolName];
      }
      return Promise.resolve().then(() => __toESM(require(importURL))).then((mod2) => {
        mod2 = findModule(mod2);
        moduleCache.set(importURL, mod2);
        return mod2[symbolName];
      });
    },
    raf: (fn) => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve(fn());
        });
      });
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol() {
      return void 0;
    }
  };
};
function findModule(module2) {
  return Object.values(module2).find(isModule) || module2;
}
function isModule(module2) {
  return typeof module2 === "object" && module2 && module2[Symbol.toStringTag] === "Module";
}
function toUrl2(doc, element, url) {
  var _a;
  const containerEl = getContainer(element);
  const base = new URL((_a = containerEl == null ? void 0 : containerEl.getAttribute("q:base")) != null ? _a : doc.baseURI, doc.baseURI);
  return new URL(url, base);
}
var getPlatform2 = (docOrNode) => {
  const doc = getDocument(docOrNode);
  return doc[DocumentPlatform] || (doc[DocumentPlatform] = createPlatform2(doc));
};
var DocumentPlatform = /* @__PURE__ */ Symbol();

// packages/qwik/src/core/use/use-subscriber.ts
function wrapSubscriber(obj, subscriber) {
  if (obj && typeof obj === "object") {
    const target = obj[QOjectTargetSymbol];
    if (!target) {
      return obj;
    }
    return new Proxy(obj, {
      get(target2, prop) {
        if (prop === QOjectOriginalProxy) {
          return target2;
        }
        target2[SetSubscriber] = subscriber;
        return target2[prop];
      },
      ownKeys(target2) {
        target2[SetSubscriber] = subscriber;
        return Reflect.ownKeys(target2);
      }
    });
  }
  return obj;
}
function unwrapSubscriber(obj) {
  if (obj && typeof obj === "object") {
    const proxy = obj[QOjectOriginalProxy];
    if (proxy) {
      return proxy;
    }
  }
  return obj;
}

// packages/qwik/src/core/import/qrl.ts
var runtimeSymbolId = 0;
var RUNTIME_QRL = "/runtimeQRL";
function toInternalQRL(qrl) {
  assertEqual(isQrl(qrl), true);
  return qrl;
}
function qrlImport(element, qrl) {
  const qrl_ = toInternalQRL(qrl);
  if (qrl_.symbolRef)
    return qrl_.symbolRef;
  if (qrl_.symbolFn) {
    return qrl_.symbolRef = qrl_.symbolFn().then((module2) => qrl_.symbolRef = module2[qrl_.symbol]);
  } else {
    if (!element) {
      throw new Error(`QRL '${qrl_.chunk}#${qrl_.symbol || "default"}' does not have an attached container`);
    }
    const symbol = getPlatform2(element).importSymbol(element, qrl_.chunk, qrl_.symbol);
    return qrl_.symbolRef = then(symbol, (ref) => {
      return qrl_.symbolRef = ref;
    });
  }
}
function runtimeQrl(symbol, lexicalScopeCapture = EMPTY_ARRAY) {
  return new QRLInternal(RUNTIME_QRL, "s" + runtimeSymbolId++, symbol, null, null, lexicalScopeCapture);
}
function stringifyQRL(qrl, opts = {}) {
  var _a;
  const qrl_ = toInternalQRL(qrl);
  let symbol = qrl_.symbol;
  let chunk = qrl_.chunk;
  const refSymbol = (_a = qrl_.refSymbol) != null ? _a : symbol;
  const platform = opts.platform;
  const element = opts.element;
  if (platform) {
    const result = platform.chunkForSymbol(refSymbol);
    if (result) {
      chunk = result[1];
      if (!qrl_.refSymbol) {
        symbol = result[0];
      }
    }
  }
  const parts = [chunk];
  if (symbol && symbol !== "default") {
    parts.push("#", symbol);
  }
  const capture = qrl_.capture;
  const captureRef = qrl_.captureRef;
  if (opts.getObjId) {
    if (captureRef && captureRef.length) {
      const capture2 = captureRef.map(opts.getObjId);
      parts.push(`[${capture2.join(" ")}]`);
    }
  } else if (capture && capture.length > 0) {
    parts.push(`[${capture.join(" ")}]`);
  }
  const qrlString = parts.join("");
  if (qrl_.chunk === RUNTIME_QRL && element) {
    const qrls = element.__qrls__ || (element.__qrls__ = /* @__PURE__ */ new Set());
    qrls.add(qrl);
  }
  return qrlString;
}
function parseQRL(qrl, el) {
  const endIdx = qrl.length;
  const hashIdx = indexOf(qrl, 0, "#");
  const captureIdx = indexOf(qrl, hashIdx, "[");
  const chunkEndIdx = Math.min(hashIdx, captureIdx);
  const chunk = qrl.substring(0, chunkEndIdx);
  const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
  const symbolEndIdx = captureIdx;
  const symbol = symbolStartIdx == symbolEndIdx ? "default" : qrl.substring(symbolStartIdx, symbolEndIdx);
  const captureStartIdx = captureIdx;
  const captureEndIdx = endIdx;
  const capture = captureStartIdx === captureEndIdx ? EMPTY_ARRAY : qrl.substring(captureStartIdx + 1, captureEndIdx - 1).split(" ");
  if (chunk === RUNTIME_QRL) {
    logError(`Q-ERROR: '${qrl}' is runtime but no instance found on element.`);
  }
  const iQrl = new QRLInternal(chunk, symbol, null, null, capture, null);
  if (el) {
    iQrl.setContainer(el);
  }
  return iQrl;
}
function indexOf(text, startIdx, char) {
  const endIdx = text.length;
  const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
  return charIdx == -1 ? endIdx : charIdx;
}
function toQrlOrError(symbolOrQrl) {
  if (!isQrl(symbolOrQrl)) {
    if (typeof symbolOrQrl == "function" || typeof symbolOrQrl == "string") {
      symbolOrQrl = runtimeQrl(symbolOrQrl);
    } else {
      throw new Error(`Q-ERROR Only 'function's and 'string's are supported.`);
    }
  }
  return symbolOrQrl;
}

// packages/qwik/src/core/import/qrl-class.ts
function isQrl(value) {
  return value instanceof QRLInternal;
}
var QRL = class {
  constructor(chunk, symbol, symbolRef, symbolFn, capture, captureRef) {
    this.chunk = chunk;
    this.symbol = symbol;
    this.symbolRef = symbolRef;
    this.symbolFn = symbolFn;
    this.capture = capture;
    this.captureRef = captureRef;
  }
  setContainer(el) {
    if (!this.el) {
      this.el = el;
    }
  }
  getSymbol() {
    var _a;
    return (_a = this.refSymbol) != null ? _a : this.symbol;
  }
  getCanonicalSymbol() {
    var _a;
    return getCanonicalSymbol((_a = this.refSymbol) != null ? _a : this.symbol);
  }
  async resolve(el) {
    if (el) {
      this.setContainer(el);
    }
    return qrlImport(this.el, this);
  }
  resolveIfNeeded(el) {
    return typeof this.symbolRef === "function" ? this.symbolRef : this.resolve(el);
  }
  invokeFn(el, currentCtx, beforeFn) {
    return (...args) => {
      const fn = this.resolveIfNeeded(el);
      return then(fn, (fn2) => {
        if (typeof fn2 === "function") {
          const baseContext = currentCtx != null ? currentCtx : newInvokeContext();
          const context = __spreadProps(__spreadValues({}, baseContext), {
            qrl: this
          });
          if (beforeFn) {
            beforeFn();
          }
          return useInvoke(context, fn2, ...args);
        }
        throw new Error("QRL is not a function");
      });
    };
  }
  copy() {
    const copy = new QRLInternal(this.chunk, this.symbol, this.symbolRef, this.symbolFn, null, this.captureRef);
    copy.refSymbol = this.refSymbol;
    return copy;
  }
  async invoke(...args) {
    const fn = this.invokeFn();
    const result = await fn(...args);
    return result;
  }
  serialize(options) {
    return stringifyQRL(this, options);
  }
};
var getCanonicalSymbol = (symbolName) => {
  const index = symbolName.lastIndexOf("_");
  if (index > -1) {
    return symbolName.slice(index + 1);
  }
  return symbolName;
};
var isSameQRL = (a, b) => {
  return a.getCanonicalSymbol() === b.getCanonicalSymbol();
};
var QRLInternal = QRL;

// packages/qwik/src/core/util/case.ts
function fromCamelToKebabCase(text) {
  return text.replace(/([A-Z])/g, "-$1").toLowerCase();
}

// packages/qwik/src/core/props/props-on.ts
var ON_PROP_REGEX = /^(window:|document:|)on([A-Z]|-.).*Qrl$/;
var ON$_PROP_REGEX = /^(window:|document:|)on([A-Z]|-.).*\$$/;
function isOnProp(prop) {
  return ON_PROP_REGEX.test(prop);
}
function isOn$Prop(prop) {
  return ON$_PROP_REGEX.test(prop);
}
function qPropWriteQRL(rctx, ctx, prop, value) {
  if (!value) {
    return;
  }
  if (!ctx.listeners) {
    ctx.listeners = getDomListeners(ctx.element);
  }
  const kebabProp = fromCamelToKebabCase(prop);
  const existingListeners = ctx.listeners.get(kebabProp) || [];
  const newQRLs = Array.isArray(value) ? value : [value];
  for (const value2 of newQRLs) {
    const cp = value2.copy();
    cp.setContainer(ctx.element);
    const capture = cp.capture;
    if (capture == null) {
      const captureRef = cp.captureRef;
      cp.capture = captureRef && captureRef.length ? captureRef.map((ref) => String(ctx.refMap.add(ref))) : EMPTY_ARRAY;
    }
    for (let i = 0; i < existingListeners.length; i++) {
      const qrl = existingListeners[i];
      if (isSameQRL(qrl, cp)) {
        existingListeners.splice(i, 1);
        i--;
      }
    }
    existingListeners.push(cp);
  }
  ctx.listeners.set(kebabProp, existingListeners);
  const newValue = serializeQRLs(existingListeners, ctx);
  if (ctx.element.getAttribute(kebabProp) !== newValue) {
    if (rctx) {
      setAttribute(rctx, ctx.element, kebabProp, newValue);
    } else {
      ctx.element.setAttribute(kebabProp, newValue);
    }
  }
}
function getDomListeners(el) {
  const attributes = el.attributes;
  const listeners = /* @__PURE__ */ new Map();
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes.item(i);
    if (attr.name.startsWith("on:") || attr.name.startsWith("on-window:") || attr.name.startsWith("on-document:")) {
      let array = listeners.get(attr.name);
      if (!array) {
        listeners.set(attr.name, array = []);
      }
      array.push(parseQRL(attr.value, el));
    }
  }
  return listeners;
}
function serializeQRLs(existingQRLs, ctx) {
  const platform = getPlatform2(ctx.element);
  const element = ctx.element;
  const opts = {
    platform,
    element
  };
  return existingQRLs.map((qrl) => isPromise(qrl) ? "" : stringifyQRL(qrl, opts)).filter((v) => !!v).join("\n");
}

// packages/qwik/src/core/render/jsx/host.public.ts
var Host = { __brand__: "host" };
var SkipRerender = { __brand__: "skip" };

// packages/qwik/src/core/import/qrl.public.ts
function $(expression) {
  return runtimeQrl(expression);
}
function implicit$FirstArg(fn) {
  return function(first, ...rest) {
    return fn.call(null, $(first), ...rest);
  };
}

// packages/qwik/src/core/render/render.ts
function visitJsxNode(ctx, elm, jsxNode, isSvg) {
  if (jsxNode === void 0) {
    return smartUpdateChildren(ctx, elm, [], "root", isSvg);
  }
  if (Array.isArray(jsxNode)) {
    return smartUpdateChildren(ctx, elm, jsxNode.flat(), "root", isSvg);
  } else if (jsxNode.type === Host) {
    updateProperties(ctx, getContext(elm), jsxNode.props, isSvg);
    return smartUpdateChildren(ctx, elm, jsxNode.children || [], "root", isSvg);
  } else {
    return smartUpdateChildren(ctx, elm, [jsxNode], "root", isSvg);
  }
}

// packages/qwik/src/core/util/hash_code.ts
function hashCode(text, hash = 0) {
  if (text.length === 0)
    return hash;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Number(Math.abs(hash)).toString(36);
}

// packages/qwik/src/core/component/qrl-styles.ts
function styleKey(qStyles) {
  return qStyles && String(hashCode(qStyles.getCanonicalSymbol()));
}
function styleHost(styleId) {
  return styleId && ComponentStylesPrefixHost + styleId;
}
function styleContent(styleId) {
  return styleId && ComponentStylesPrefixContent + styleId;
}

// packages/qwik/src/core/render/jsx/jsx-runtime.ts
var JSXNodeImpl = class {
  constructor(type, props, key = null) {
    this.type = type;
    this.props = props;
    this.children = EMPTY_ARRAY;
    this.text = void 0;
    this.key = null;
    if (key != null) {
      this.key = String(key);
    }
    if (props) {
      const children = processNode(props.children);
      if (children !== void 0) {
        if (Array.isArray(children)) {
          this.children = children;
        } else {
          this.children = [children];
        }
      }
    }
  }
};
function processNode(node) {
  if (node == null || typeof node === "boolean") {
    return void 0;
  }
  if (isJSXNode(node)) {
    if (node.type === Host || node.type === SkipRerender) {
      return node;
    } else if (typeof node.type === "function") {
      return processNode(node.type(__spreadProps(__spreadValues({}, node.props), { children: node.children }), node.key));
    } else {
      return node;
    }
  } else if (Array.isArray(node)) {
    return node.flatMap(processNode).filter((e) => e != null);
  } else if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
    const newNode = new JSXNodeImpl("#text", null, null);
    newNode.text = String(node);
    return newNode;
  } else {
    logWarn("Unvalid node, skipping");
    return void 0;
  }
}
var isJSXNode = (n) => {
  if (qDev) {
    if (n instanceof JSXNodeImpl) {
      return true;
    }
    if (n && typeof n === "object" && n.constructor.name === JSXNodeImpl.name) {
      throw new Error(`Duplicate implementations of "JSXNodeImpl" found`);
    }
    return false;
  } else {
    return n instanceof JSXNodeImpl;
  }
};

// packages/qwik/src/core/component/component-ctx.ts
var firstRenderComponent = (rctx, ctx) => {
  ctx.element.setAttribute(QHostAttr, "");
  return renderComponent(rctx, ctx);
};
var renderComponent = (rctx, ctx) => {
  ctx.dirty = false;
  const hostElement = ctx.element;
  const onRenderQRL = ctx.renderQrl;
  assertDefined(onRenderQRL);
  const props = ctx.props;
  assertDefined(props);
  rctx.containerState.hostsStaging.delete(hostElement);
  const newCtx = __spreadProps(__spreadValues({}, rctx), {
    components: [...rctx.components]
  });
  const invocatinContext = newInvokeContext(rctx.doc, hostElement, hostElement, RenderEvent);
  invocatinContext.subscriber = hostElement;
  invocatinContext.renderCtx = newCtx;
  const waitOn = invocatinContext.waitOn = [];
  rctx.containerState.subsManager.clearSub(hostElement);
  const onRenderFn = onRenderQRL.invokeFn(rctx.containerEl, invocatinContext);
  try {
    const renderPromise = onRenderFn(props);
    return then(renderPromise, (jsxNode) => {
      rctx.hostElements.add(hostElement);
      const waitOnPromise = promiseAll(waitOn);
      return then(waitOnPromise, (waitOnResolved) => {
        var _a;
        waitOnResolved.forEach((task) => {
          if (isStyleTask(task)) {
            appendStyle(rctx, hostElement, task);
          }
        });
        if (typeof jsxNode === "function") {
          ctx.dirty = false;
          jsxNode = jsxNode();
        } else if (ctx.dirty) {
          logDebug("Dropping render. State changed during render.");
          return renderComponent(rctx, ctx);
        }
        let componentCtx = ctx.component;
        if (!componentCtx) {
          componentCtx = ctx.component = {
            hostElement,
            slots: [],
            styleHostClass: void 0,
            styleClass: void 0,
            styleId: void 0
          };
          const scopedStyleId = (_a = hostElement.getAttribute(ComponentScopedStyles)) != null ? _a : void 0;
          if (scopedStyleId) {
            componentCtx.styleId = scopedStyleId;
            componentCtx.styleHostClass = styleHost(scopedStyleId);
            componentCtx.styleClass = styleContent(scopedStyleId);
            hostElement.classList.add(componentCtx.styleHostClass);
          }
        }
        componentCtx.slots = [];
        newCtx.components.push(componentCtx);
        return visitJsxNode(newCtx, hostElement, processNode(jsxNode), false);
      });
    }, (err) => {
      logError(err);
    });
  } catch (err) {
    logError(err);
  }
};

// packages/qwik/src/core/util/element.ts
function isNode(value) {
  return value && typeof value.nodeType == "number";
}
function isDocument(value) {
  return value && value.nodeType == 9;
}
function isElement(value) {
  return isNode(value) && value.nodeType === 1;
}

// packages/qwik/src/core/use/use-host-element.public.ts
function useHostElement() {
  const ctx = getInvokeContext();
  assertEqual(ctx.event, RenderEvent);
  const element = ctx.hostElement;
  assertDefined(element);
  return element;
}

// packages/qwik/src/core/use/use-store.public.ts
function useSequentialScope() {
  const ctx = getInvokeContext();
  assertEqual(ctx.event, RenderEvent);
  const index = ctx.seq;
  const hostElement = useHostElement();
  const elementCtx = getContext(hostElement);
  ctx.seq++;
  const updateFn = (value) => {
    elementCtx.seq[index] = value;
  };
  return [elementCtx.seq[index], updateFn, index];
}

// packages/qwik/src/core/use/use-lexical-scope.public.ts
function useLexicalScope() {
  var _a;
  const context = getInvokeContext();
  const hostElement = context.hostElement;
  const qrl = (_a = context.qrl) != null ? _a : parseQRL(decodeURIComponent(String(context.url)), hostElement);
  if (qrl.captureRef == null) {
    const el = context.element;
    assertDefined(el);
    resumeIfNeeded(getContainer(el));
    const ctx = getContext(el);
    qrl.captureRef = qrl.capture.map((idx) => qInflate(idx, ctx));
  }
  const subscriber = context.subscriber;
  if (subscriber) {
    return qrl.captureRef.map((obj) => wrapSubscriber(obj, subscriber));
  }
  return qrl.captureRef;
}
function qInflate(ref, hostCtx) {
  const int = parseInt(ref, 10);
  const obj = hostCtx.refMap.get(int);
  assertEqual(hostCtx.refMap.array.length > int, true);
  return obj;
}

// packages/qwik/src/core/use/use-document.public.ts
function useDocument() {
  const ctx = getInvokeContext();
  assertEqual(ctx.event, RenderEvent);
  const doc = ctx.doc;
  if (!doc) {
    throw new Error("Cant access document for existing context");
  }
  return doc;
}

// packages/qwik/src/core/component/component.public.ts
function useCleanupQrl(unmountFn) {
  const [watch, setWatch, i] = useSequentialScope();
  if (!watch) {
    const el = useHostElement();
    const watch2 = {
      qrl: unmountFn,
      el,
      f: 8 /* IsCleanup */,
      i
    };
    setWatch(true);
    getContext(el).watches.push(watch2);
  }
}
var useCleanup$ = implicit$FirstArg(useCleanupQrl);
function useResumeQrl(resumeFn) {
  useOn("qinit", resumeFn);
}
var useResume$ = implicit$FirstArg(useResumeQrl);
function useVisibleQrl(resumeFn) {
  useOn("qvisible", resumeFn);
}
var useVisible$ = implicit$FirstArg(useVisibleQrl);
function useOn(event, eventFn) {
  const el = useHostElement();
  const ctx = getContext(el);
  qPropWriteQRL(void 0, ctx, `on:${event}`, eventFn);
}
function useStylesQrl(styles) {
  _useStyles(styles, false);
}
var useStyles$ = implicit$FirstArg(useStylesQrl);
function useScopedStylesQrl(styles) {
  _useStyles(styles, true);
}
var useScopedStyles$ = implicit$FirstArg(useScopedStylesQrl);
function _useStyles(styles, scoped) {
  const [style, setStyle] = useSequentialScope();
  if (style === true) {
    return;
  }
  setStyle(true);
  const styleQrl = toQrlOrError(styles);
  const styleId = styleKey(styleQrl);
  const hostElement = useHostElement();
  if (scoped) {
    hostElement.setAttribute(ComponentScopedStyles, styleId);
  }
  useWaitOn(styleQrl.resolve(hostElement).then((styleText) => {
    const task = {
      type: "style",
      styleId,
      content: scoped ? styleText.replace(/�/g, styleId) : styleText
    };
    return task;
  }));
}

// packages/qwik/src/core/watch/watch.public.ts
function handleWatch() {
  const [watch] = useLexicalScope();
  notifyWatch(watch);
}
function useWatchQrl(qrl, opts) {
  const [watch, setWatch, i] = useSequentialScope();
  if (!watch) {
    const el = useHostElement();
    const containerState = useContainerState();
    const watch2 = {
      qrl,
      el,
      f: 4 /* IsDirty */ | 2 /* IsWatch */,
      i
    };
    setWatch(true);
    getContext(el).watches.push(watch2);
    useWaitOn(Promise.resolve().then(() => runWatch(watch2, containerState)));
    const isServer = containerState.platform.isServer;
    if (isServer) {
      useRunWatch(watch2, opts == null ? void 0 : opts.run);
    }
  }
}
var useWatch$ = implicit$FirstArg(useWatchQrl);
function useClientEffectQrl(qrl, opts) {
  var _a;
  const [watch, setWatch, i] = useSequentialScope();
  if (!watch) {
    const el = useHostElement();
    const watch2 = {
      qrl,
      el,
      f: 1 /* IsEffect */,
      i
    };
    setWatch(true);
    getContext(el).watches.push(watch2);
    useRunWatch(watch2, (_a = opts == null ? void 0 : opts.run) != null ? _a : "visible");
    const doc = useDocument();
    if (doc["qO"]) {
      doc["qO"].observe(el);
    }
  }
}
var useClientEffect$ = implicit$FirstArg(useClientEffectQrl);
function useServerMountQrl(mountQrl) {
  const [watch, setWatch] = useSequentialScope();
  if (!watch) {
    setWatch(true);
    const isServer = getPlatform2(useDocument()).isServer;
    if (isServer) {
      useWaitOn(mountQrl.invoke());
    }
  }
}
var useServerMount$ = implicit$FirstArg(useServerMountQrl);
function useClientMountQrl(mountQrl) {
  const [watch, setWatch] = useSequentialScope();
  if (!watch) {
    setWatch(true);
    const isServer = getPlatform2(useDocument()).isServer;
    if (!isServer) {
      useWaitOn(mountQrl.invoke());
    }
  }
}
var useClientMount$ = implicit$FirstArg(useClientMountQrl);
function useMountQrl(mountQrl) {
  const [watch, setWatch] = useSequentialScope();
  if (!watch) {
    setWatch(true);
    useWaitOn(mountQrl.invoke());
  }
}
var useMount$ = implicit$FirstArg(useMountQrl);
function runWatch(watch, containerState) {
  if (!(watch.f & 4 /* IsDirty */)) {
    logDebug("Watch is not dirty, skipping run", watch);
    return Promise.resolve(watch);
  }
  watch.f &= ~4 /* IsDirty */;
  const promise = new Promise((resolve) => {
    then(watch.running, () => {
      cleanupWatch(watch);
      const el = watch.el;
      const doc = getDocument(el);
      const invokationContext = newInvokeContext(doc, el, el, "WatchEvent");
      const { subsManager } = containerState;
      const watchFn = watch.qrl.invokeFn(el, invokationContext, () => {
        subsManager.clearSub(watch);
      });
      const track = (obj, prop) => {
        var _a;
        const manager = subsManager.getLocal((_a = getProxyTarget(obj)) != null ? _a : obj);
        manager.addSub(watch, prop);
        if (prop) {
          return obj[prop];
        } else {
          return obj;
        }
      };
      return then(watchFn(track), (returnValue) => {
        if (typeof returnValue === "function") {
          watch.destroy = noSerialize(returnValue);
        }
        resolve(watch);
      });
    });
  });
  watch.running = noSerialize(promise);
  return promise;
}
var cleanupWatch = (watch) => {
  const destroy = watch.destroy;
  if (destroy) {
    watch.destroy = void 0;
    try {
      destroy();
    } catch (err) {
      logError(err);
    }
  }
};
var destroyWatch = (watch) => {
  if (watch.f & 8 /* IsCleanup */) {
    watch.f &= ~8 /* IsCleanup */;
    const cleanup = watch.qrl.invokeFn(watch.el);
    cleanup();
  } else {
    cleanupWatch(watch);
  }
};
var useRunWatch = (watch, run) => {
  if (run === "load") {
    useResumeQrl(getWatchHandlerQrl(watch));
  } else if (run === "visible") {
    useVisibleQrl(getWatchHandlerQrl(watch));
  }
};
var getWatchHandlerQrl = (watch) => {
  const watchQrl = watch.qrl;
  const watchHandler = new QRLInternal(watchQrl.chunk, "handleWatch", handleWatch, null, null, [watch]);
  watchHandler.refSymbol = watchQrl.symbol;
  return watchHandler;
};

// packages/qwik/src/core/util/event.ts
var emitEvent = (el, eventName, detail, bubbles) => {
  if (el && typeof CustomEvent === "function") {
    el.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: bubbles
    }));
  }
};

// packages/qwik/src/core/object/store.ts
var UNDEFINED_PREFIX = "";
var QRL_PREFIX = "";
var DOCUMENT_PREFIX = "";
function resumeContainer(containerEl) {
  if (!isContainer(containerEl)) {
    logWarn("Skipping hydration because parent element is not q:container");
    return;
  }
  const doc = getDocument(containerEl);
  const isDocElement = containerEl === doc.documentElement;
  const parentJSON = isDocElement ? doc.body : containerEl;
  const script = getQwikJSON(parentJSON);
  if (!script) {
    logWarn("Skipping hydration qwik/json metadata was not found.");
    return;
  }
  script.remove();
  const containerState = getContainerState(containerEl);
  const meta = JSON.parse(unescapeText(script.textContent || "{}"));
  const elements = /* @__PURE__ */ new Map();
  getNodesInScope(containerEl, hasQId).forEach((el) => {
    const id = el.getAttribute(ELEMENT_ID);
    elements.set(ELEMENT_ID_PREFIX + id, el);
  });
  const getObject = (id) => {
    return getObjectImpl(id, elements, meta.objs, containerState);
  };
  reviveValues(meta.objs, meta.subs, getObject, containerState, parentJSON);
  for (const obj of meta.objs) {
    reviveNestedObjects(obj, getObject);
  }
  Object.entries(meta.ctx).forEach(([elementID, ctxMeta]) => {
    const el = getObject(elementID);
    assertDefined(el);
    const ctx = getContext(el);
    const qobj = ctxMeta.r;
    const seq = ctxMeta.s;
    const host = ctxMeta.h;
    const contexts = ctxMeta.c;
    const watches = ctxMeta.w;
    if (qobj) {
      ctx.refMap.array.push(...qobj.split(" ").map((part) => getObject(part)));
    }
    if (seq) {
      ctx.seq = seq.split(" ").map((part) => getObject(part));
    }
    if (watches) {
      ctx.watches = watches.split(" ").map((part) => getObject(part));
    }
    if (contexts) {
      contexts.split(" ").map((part) => {
        const [key, value] = part.split("=");
        if (!ctx.contexts) {
          ctx.contexts = /* @__PURE__ */ new Map();
        }
        ctx.contexts.set(key, getObject(value));
      });
    }
    if (host) {
      const [props, renderQrl] = host.split(" ");
      assertDefined(props);
      assertDefined(renderQrl);
      ctx.props = createProps(getObject(props), ctx.element, containerState);
      ctx.renderQrl = getObject(renderQrl);
    }
  });
  containerEl.setAttribute(QContainerAttr, "resumed");
  logDebug("Container resumed");
  emitEvent(containerEl, "qresume", void 0, true);
}
function hasContext(el) {
  return !!tryGetContext(el);
}
function snapshotState(containerEl) {
  const doc = getDocument(containerEl);
  const { subsManager, proxyMap, platform } = getContainerState(containerEl);
  const elementToIndex = /* @__PURE__ */ new Map();
  const collector = createCollector(doc, proxyMap);
  const elements = getNodesInScope(containerEl, hasContext);
  elements.forEach((node) => {
    var _a, _b;
    const ctx = tryGetContext(node);
    collectProps(node, ctx.props, collector);
    (_a = ctx.contexts) == null ? void 0 : _a.forEach((ctx2) => {
      collectValue(ctx2, collector);
    });
    (_b = ctx.listeners) == null ? void 0 : _b.forEach((listeners2) => {
      for (const l of listeners2) {
        const captured = l.captureRef;
        if (captured) {
          captured.forEach((obj) => collectValue(obj, collector));
        }
      }
    });
    ctx.watches.forEach((watch) => {
      collector.watches.push(watch);
    });
  });
  const objs = Array.from(collector.objSet);
  function hasSubscriptions(a) {
    const manager = subsManager.tryGetLocal(a);
    if (manager) {
      return manager.subs.size > 0;
    }
    return false;
  }
  objs.sort((a, b) => {
    const isProxyA = hasSubscriptions(a) ? 0 : 1;
    const isProxyB = hasSubscriptions(b) ? 0 : 1;
    return isProxyA - isProxyB;
  });
  const objToId = /* @__PURE__ */ new Map();
  let count = 0;
  for (const obj of objs) {
    objToId.set(obj, count);
    count++;
  }
  function getElementID(el) {
    let id = elementToIndex.get(el);
    if (id === void 0) {
      if (el.isConnected) {
        id = intToStr(elementToIndex.size);
        el.setAttribute(ELEMENT_ID, id);
        id = ELEMENT_ID_PREFIX + id;
      } else {
        id = null;
      }
      elementToIndex.set(el, id);
    }
    return id;
  }
  function getObjId(obj) {
    if (obj !== null && typeof obj === "object") {
      const target = obj[QOjectTargetSymbol];
      const id = objToId.get(normalizeObj(target != null ? target : obj, doc));
      if (id !== void 0) {
        const proxySuffix = target ? "!" : "";
        return intToStr(id) + proxySuffix;
      }
      if (!target && isNode(obj)) {
        if (obj.nodeType === 1) {
          return getElementID(obj);
        } else {
          logError("Can not serialize a HTML Node that is not an Element", obj);
          return null;
        }
      }
    } else {
      const id = objToId.get(normalizeObj(obj, doc));
      if (id !== void 0) {
        return intToStr(id);
      }
    }
    return null;
  }
  function mustGetObjId(obj) {
    const id = getObjId(obj);
    assertDefined(id);
    return id;
  }
  const subs = objs.map((obj) => {
    var _a;
    const subs2 = (_a = subsManager.tryGetLocal(obj)) == null ? void 0 : _a.subs;
    if (subs2 && subs2.size > 0) {
      return Object.fromEntries(Array.from(subs2.entries()).map(([sub, set]) => {
        const id = getObjId(sub);
        if (id !== null) {
          return [id, set ? Array.from(set) : null];
        } else {
          return [void 0, void 0];
        }
      }));
    } else {
      return null;
    }
  }).filter((a) => !!a);
  const serialize = (value) => {
    var _a;
    return (_a = getObjId(value)) != null ? _a : value;
  };
  const qrlSerializeOptions = {
    platform,
    getObjId
  };
  const convertedObjs = objs.map((obj) => {
    if (Array.isArray(obj)) {
      return obj.map(serialize);
    } else if (obj && typeof obj === "object") {
      if (isQrl(obj)) {
        return QRL_PREFIX + stringifyQRL(obj, qrlSerializeOptions);
      }
      const output = {};
      Object.entries(obj).forEach(([key, value]) => {
        output[key] = serialize(value);
      });
      return output;
    }
    return obj;
  });
  const listeners = [];
  const meta = {};
  elements.forEach((node) => {
    const ctx = getContext(node);
    assertDefined(ctx);
    const ref = ctx.refMap;
    const props = ctx.props;
    const contexts = ctx.contexts;
    const watches = ctx.watches;
    const renderQrl = ctx.renderQrl;
    const seq = ctx.seq;
    const metaValue = {};
    const elementCaptured = collector.elements.includes(node);
    let add = false;
    if (ref.array.length > 0) {
      const value = ref.array.map((obj) => mustGetObjId(obj)).join(" ");
      if (value) {
        metaValue.r = value;
        add = true;
      }
    }
    if (elementCaptured && props) {
      const objs2 = [getProxyTarget(props)];
      if (renderQrl) {
        objs2.push(renderQrl);
      }
      const value = objs2.map((obj) => mustGetObjId(obj)).join(" ");
      if (value) {
        metaValue.h = value;
        add = true;
      }
    }
    if (watches.length > 0) {
      const value = watches.map((watch) => getObjId(watch)).filter((obj) => obj != null).join(" ");
      if (value) {
        metaValue.w = value;
        add = true;
      }
    }
    if (elementCaptured && seq.length > 0) {
      const value = seq.map((obj) => mustGetObjId(obj)).join(" ");
      if (value) {
        metaValue.s = value;
        add = true;
      }
    }
    if (contexts) {
      const serializedContexts = [];
      contexts.forEach((value2, key) => {
        serializedContexts.push(`${key}=${mustGetObjId(value2)}`);
      });
      const value = serializedContexts.join(" ");
      if (value) {
        metaValue.c = value;
        add = true;
      }
    }
    if (add) {
      const elementID = getElementID(node);
      assertDefined(elementID);
      meta[elementID] = metaValue;
    }
    if (ctx.listeners) {
      ctx.listeners.forEach((qrls, key) => {
        qrls.forEach((qrl) => {
          listeners.push({
            key,
            qrl
          });
        });
      });
    }
  });
  for (const watch of collector.watches) {
    destroyWatch(watch);
    if (qDev) {
      if (watch.f & 4 /* IsDirty */) {
        logWarn("Serializing dirty watch. Looks like an internal error.");
      }
      if (!isConnected(watch)) {
        logWarn("Serializing disconneted watch. Looks like an internal error.");
      }
    }
  }
  if (qDev) {
    elementToIndex.forEach((value, el) => {
      if (getDocument(el) !== doc) {
        logWarn("element from different document", value, el.tagName);
      }
      if (!value) {
        logWarn("unconnected element", el.tagName, "\n");
      }
    });
  }
  return {
    state: {
      ctx: meta,
      objs: convertedObjs,
      subs
    },
    objs,
    listeners
  };
}
function getQwikJSON(parentElm) {
  let child = parentElm.lastElementChild;
  while (child) {
    if (child.tagName === "SCRIPT" && child.getAttribute("type") === "qwik/json") {
      return child;
    }
    child = child.previousElementSibling;
  }
  return void 0;
}
function getNodesInScope(parent, predicate) {
  const nodes = [];
  walkNodes(nodes, parent, predicate);
  return nodes;
}
function walkNodes(nodes, parent, predicate) {
  let child = parent.firstElementChild;
  while (child) {
    if (!isContainer(child)) {
      if (predicate(child)) {
        nodes.push(child);
      }
      walkNodes(nodes, child, predicate);
    }
    child = child.nextElementSibling;
  }
}
function reviveValues(objs, subs, getObject, containerState, containerEl) {
  for (let i = 0; i < objs.length; i++) {
    const value = objs[i];
    if (typeof value === "string") {
      if (value === UNDEFINED_PREFIX) {
        objs[i] = void 0;
      } else if (value === DOCUMENT_PREFIX) {
        objs[i] = getDocument(containerEl);
      } else if (value.startsWith(QRL_PREFIX)) {
        objs[i] = parseQRL(value.slice(1), containerEl);
      }
    } else {
      const sub = subs[i];
      if (sub) {
        const converted = /* @__PURE__ */ new Map();
        Object.entries(sub).forEach((entry) => {
          const el = getObject(entry[0]);
          if (!el) {
            logWarn("QWIK can not revive subscriptions because of missing element ID", entry, value);
            return;
          }
          const set = entry[1] === null ? null : new Set(entry[1]);
          converted.set(el, set);
        });
        _restoreQObject(value, containerState, converted);
      }
    }
  }
}
function reviveNestedObjects(obj, getObject) {
  if (obj && typeof obj == "object") {
    if (isQrl(obj)) {
      if (obj.capture && obj.capture.length > 0) {
        obj.captureRef = obj.capture.map(getObject);
        obj.capture = null;
      }
      return;
    } else if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        if (typeof value == "string") {
          obj[i] = getObject(value);
        } else {
          reviveNestedObjects(value, getObject);
        }
      }
    } else if (Object.getPrototypeOf(obj) === Object.prototype) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value == "string") {
            obj[key] = getObject(value);
          } else {
            reviveNestedObjects(value, getObject);
          }
        }
      }
    }
  }
}
function getObjectImpl(id, elements, objs, containerState) {
  var _a;
  if (id.startsWith(ELEMENT_ID_PREFIX)) {
    assertEqual(elements.has(id), true);
    return elements.get(id);
  }
  const index = strToInt(id);
  assertEqual(objs.length > index, true);
  const obj = objs[index];
  const needsProxy = id.endsWith("!");
  if (needsProxy && containerState) {
    return (_a = containerState.proxyMap.get(obj)) != null ? _a : readWriteProxy(obj, containerState);
  }
  return obj;
}
function normalizeObj(obj, doc) {
  var _a;
  if (obj === doc) {
    return DOCUMENT_PREFIX;
  }
  if (obj === void 0 || !shouldSerialize(obj)) {
    return UNDEFINED_PREFIX;
  }
  return (_a = getProxyTarget(obj)) != null ? _a : obj;
}
function collectValue(obj, collector) {
  const handled = collectQObjects(obj, collector);
  if (!handled) {
    collector.objSet.add(normalizeObj(obj, collector.doc));
  }
}
function collectProps(el, props, collector) {
  const subs = props && typeof props === "object" && props[QOjectSubsSymbol];
  if (subs && subs.has(el)) {
    collectElement(el, collector);
  }
}
function createCollector(doc, proxyMap) {
  return {
    seen: /* @__PURE__ */ new Set(),
    objSet: /* @__PURE__ */ new Set(),
    elements: [],
    watches: [],
    proxyMap,
    doc
  };
}
function collectQrl(obj, collector) {
  if (collector.seen.has(obj)) {
    return true;
  }
  collector.seen.add(obj);
  collector.objSet.add(normalizeObj(obj, collector.doc));
  if (obj.captureRef) {
    obj.captureRef.forEach((obj2) => collectValue(obj2, collector));
  }
}
function collectElement(el, collector) {
  if (collector.seen.has(el)) {
    return;
  }
  collector.seen.add(el);
  const ctx = tryGetContext(el);
  if (ctx) {
    collector.elements.push(el);
    if (ctx.props) {
      collectValue(ctx.props, collector);
    }
    if (ctx.renderQrl) {
      collectValue(ctx.renderQrl, collector);
    }
    ctx.seq.forEach((obj) => {
      collectValue(obj, collector);
    });
    ctx.refMap.array.forEach((obj) => {
      collectValue(obj, collector);
    });
    ctx.watches.forEach((watch) => {
      collectValue(watch, collector);
    });
    if (ctx.contexts) {
      ctx.contexts.forEach((obj) => {
        collectValue(obj, collector);
      });
    }
  }
}
function escapeText(str) {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
}
function unescapeText(str) {
  return str.replace(/\\x3C(\/?script)/g, "<$1");
}
function collectSubscriptions(subs, collector) {
  if (collector.seen.has(subs)) {
    return;
  }
  collector.seen.add(subs);
  Array.from(subs.keys()).forEach((key) => {
    if (isElement(key)) {
      collectElement(key, collector);
    } else {
      collectValue(key, collector);
    }
  });
}
function collectQObjects(obj, collector) {
  if (obj != null) {
    if (typeof obj === "object") {
      const hasTarget = !!obj[QOjectTargetSymbol];
      if (!hasTarget && isNode(obj)) {
        if (obj.nodeType === 1) {
          return true;
        }
        return false;
      }
      if (isQrl(obj)) {
        collectQrl(obj, collector);
        return true;
      }
      const proxied = hasTarget ? obj : collector.proxyMap.get(obj);
      const subs = proxied == null ? void 0 : proxied[QOjectSubsSymbol];
      if (subs) {
        collectSubscriptions(subs, collector);
      }
      obj = normalizeObj(obj, collector.doc);
    }
    if (typeof obj === "object") {
      if (collector.seen.has(obj)) {
        return true;
      }
      collector.seen.add(obj);
      collector.objSet.add(obj);
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          collectQObjects(obj[i], collector);
        }
      } else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            collectQObjects(obj[key], collector);
          }
        }
      }
      return true;
    }
    if (typeof obj === "string") {
      collector.objSet.add(obj);
      return true;
    }
  }
  return false;
}
function getProxyTarget(obj) {
  if (obj !== null && typeof obj === "object") {
    return obj[QOjectTargetSymbol];
  }
  return void 0;
}
function isContainer(el) {
  return el.hasAttribute(QContainerAttr);
}
function hasQId(el) {
  return el.hasAttribute(ELEMENT_ID);
}
var intToStr = (nu) => {
  return nu.toString(36);
};
var strToInt = (nu) => {
  return parseInt(nu, 36);
};

// packages/qwik/src/core/render/cursor.ts
var SVG_NS = "http://www.w3.org/2000/svg";
function smartUpdateChildren(ctx, elm, ch, mode, isSvg) {
  if (ch.length === 1 && ch[0].type === SkipRerender) {
    if (elm.firstChild !== null) {
      return;
    }
    ch = ch[0].children;
  }
  const oldCh = getChildren(elm, mode);
  if (oldCh.length > 0 && ch.length > 0) {
    return updateChildren(ctx, elm, oldCh, ch, isSvg);
  } else if (ch.length > 0) {
    return addVnodes(ctx, elm, void 0, ch, 0, ch.length - 1, isSvg);
  } else if (oldCh.length > 0) {
    return removeVnodes(ctx, oldCh, 0, oldCh.length - 1);
  }
}
function updateChildren(ctx, parentElm, oldCh, newCh, isSvg) {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  const results = [];
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      results.push(patchVnode(ctx, oldStartVnode, newStartVnode, isSvg));
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      results.push(patchVnode(ctx, oldEndVnode, newEndVnode, isSvg));
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      results.push(patchVnode(ctx, oldStartVnode, newEndVnode, isSvg));
      insertBefore(ctx, parentElm, oldStartVnode, oldEndVnode.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      results.push(patchVnode(ctx, oldEndVnode, newStartVnode, isSvg));
      insertBefore(ctx, parentElm, oldEndVnode, oldStartVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      if (oldKeyToIdx === void 0) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyToIdx[newStartVnode.key];
      if (idxInOld === void 0) {
        const newElm = createElm(ctx, newStartVnode, isSvg);
        results.push(then(newElm, (newElm2) => {
          insertBefore(ctx, parentElm, newElm2, oldStartVnode);
        }));
      } else {
        elmToMove = oldCh[idxInOld];
        if (!isTagName(elmToMove, newStartVnode.type)) {
          const newElm = createElm(ctx, newStartVnode, isSvg);
          results.push(then(newElm, (newElm2) => {
            insertBefore(ctx, parentElm, newElm2, oldStartVnode);
          }));
        } else {
          results.push(patchVnode(ctx, elmToMove, newStartVnode, isSvg));
          oldCh[idxInOld] = void 0;
          insertBefore(ctx, parentElm, elmToMove, oldStartVnode);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (newStartIdx <= newEndIdx) {
    const before = newCh[newEndIdx + 1] == null ? void 0 : newCh[newEndIdx + 1].elm;
    results.push(addVnodes(ctx, parentElm, before, newCh, newStartIdx, newEndIdx, isSvg));
  }
  let wait = promiseAll(results);
  if (oldStartIdx <= oldEndIdx) {
    wait = then(wait, () => {
      removeVnodes(ctx, oldCh, oldStartIdx, oldEndIdx);
    });
  }
  return wait;
}
function isComponentNode(node) {
  return node.props && OnRenderProp in node.props;
}
function getCh(elm) {
  return Array.from(elm.childNodes).filter(isNode2);
}
function getChildren(elm, mode) {
  switch (mode) {
    case "default":
      return getCh(elm);
    case "slot":
      return getCh(elm).filter(isChildSlot);
    case "root":
      return getCh(elm).filter(isChildComponent);
    case "fallback":
      return getCh(elm).filter(isFallback);
  }
}
function isNode2(elm) {
  const type = elm.nodeType;
  return type === 1 || type === 3;
}
function isFallback(node) {
  return node.nodeName === "Q:FALLBACK";
}
function isChildSlot(node) {
  return node.nodeName !== "Q:FALLBACK" && isChildComponent(node);
}
function isSlotTemplate(node) {
  return node.nodeName === "TEMPLATE" && node.hasAttribute(QSlotAttr);
}
function isChildComponent(node) {
  return node.nodeName !== "TEMPLATE" || !node.hasAttribute(QSlotAttr);
}
function splitBy(input, condition) {
  var _a;
  const output = {};
  for (const item of input) {
    const key = condition(item);
    const array = (_a = output[key]) != null ? _a : output[key] = [];
    array.push(item);
  }
  return output;
}
function patchVnode(rctx, elm, vnode, isSvg) {
  rctx.perf.visited++;
  vnode.elm = elm;
  const tag = vnode.type;
  if (tag === "#text") {
    if (elm.data !== vnode.text) {
      setProperty(rctx, elm, "data", vnode.text);
    }
    return;
  }
  if (tag === "#comment") {
    if (elm.data !== vnode.text) {
      setProperty(rctx, elm, "data", vnode.text);
    }
    return;
  }
  if (tag === Host || tag === SkipRerender) {
    return;
  }
  if (!isSvg) {
    isSvg = tag === "svg";
  }
  let promise;
  const props = vnode.props;
  const ctx = getContext(elm);
  const dirty = updateProperties(rctx, ctx, props, isSvg);
  const isSlot = tag === "q:slot";
  if (isSvg && vnode.type === "foreignObject") {
    isSvg = false;
  } else if (isSlot) {
    const currentComponent = rctx.components.length > 0 ? rctx.components[rctx.components.length - 1] : void 0;
    if (currentComponent) {
      currentComponent.slots.push(vnode);
    }
  }
  const isComponent = isComponentNode(vnode);
  if (dirty) {
    promise = renderComponent(rctx, ctx);
  }
  const ch = vnode.children;
  if (isComponent) {
    return then(promise, () => {
      const slotMaps = getSlots(ctx.component, elm);
      const splittedChidren = splitBy(ch, getSlotName);
      const promises = [];
      Object.entries(slotMaps.slots).forEach(([key, slotEl]) => {
        if (slotEl && !splittedChidren[key]) {
          const oldCh = getChildren(slotEl, "slot");
          if (oldCh.length > 0) {
            removeVnodes(rctx, oldCh, 0, oldCh.length - 1);
          }
        }
      });
      Object.entries(slotMaps.templates).forEach(([key, templateEl]) => {
        if (templateEl && !splittedChidren[key]) {
          removeNode(rctx, templateEl);
          slotMaps.templates[key] = void 0;
        }
      });
      Object.entries(splittedChidren).forEach(([key, ch2]) => {
        const slotElm = getSlotElement(rctx, slotMaps, elm, key);
        promises.push(smartUpdateChildren(rctx, slotElm, ch2, "slot", isSvg));
      });
      return then(promiseAll(promises), () => {
        removeTemplates(rctx, slotMaps);
      });
    });
  }
  const setsInnerHTML = checkInnerHTML(props);
  if (setsInnerHTML) {
    if (qDev && ch.length > 0) {
      logWarn("Node can not have children when innerHTML is set");
    }
    return;
  }
  return then(promise, () => {
    const mode = isSlot ? "fallback" : "default";
    return smartUpdateChildren(rctx, elm, ch, mode, isSvg);
  });
}
function addVnodes(ctx, parentElm, before, vnodes, startIdx, endIdx, isSvg) {
  const promises = [];
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    assertDefined(ch);
    promises.push(createElm(ctx, ch, isSvg));
  }
  return then(promiseAll(promises), (children) => {
    for (const child of children) {
      insertBefore(ctx, parentElm, child, before);
    }
  });
}
function removeVnodes(ctx, nodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = nodes[startIdx];
    if (ch) {
      removeNode(ctx, ch);
    }
  }
}
var refCount = 0;
var RefSymbol = Symbol();
function setSlotRef(ctx, hostElm, slotEl) {
  var _a;
  let ref = (_a = hostElm[RefSymbol]) != null ? _a : hostElm.getAttribute("q:sref");
  if (ref === null) {
    ref = intToStr(refCount++);
    hostElm[RefSymbol] = ref;
    setAttribute(ctx, hostElm, "q:sref", ref);
  }
  slotEl.setAttribute("q:sref", ref);
}
function getSlotElement(ctx, slotMaps, parentEl, slotName) {
  const slotEl = slotMaps.slots[slotName];
  if (slotEl) {
    return slotEl;
  }
  const templateEl = slotMaps.templates[slotName];
  if (templateEl) {
    return templateEl.content;
  }
  const template = createTemplate(ctx, slotName);
  prepend(ctx, parentEl, template);
  slotMaps.templates[slotName] = template;
  return template.content;
}
function createTemplate(ctx, slotName) {
  const template = createElement(ctx, "template", false);
  template.setAttribute(QSlotAttr, slotName);
  return template;
}
function removeTemplates(ctx, slotMaps) {
  Object.keys(slotMaps.templates).forEach((key) => {
    const template = slotMaps.templates[key];
    if (template && slotMaps.slots[key] !== void 0) {
      removeNode(ctx, template);
      slotMaps.templates[key] = void 0;
    }
  });
}
function resolveSlotProjection(ctx, hostElm, before, after) {
  Object.entries(before.slots).forEach(([key, slotEl]) => {
    if (slotEl && !after.slots[key]) {
      const template = createTemplate(ctx, key);
      const slotChildren = getChildren(slotEl, "slot");
      template.content.append(...slotChildren);
      hostElm.insertBefore(template, hostElm.firstChild);
      ctx.operations.push({
        el: template,
        operation: "slot-to-template",
        args: slotChildren,
        fn: () => {
        }
      });
    }
  });
  Object.entries(after.slots).forEach(([key, slotEl]) => {
    if (slotEl && !before.slots[key]) {
      const template = before.templates[key];
      if (template) {
        slotEl.appendChild(template.content);
        template.remove();
        ctx.operations.push({
          el: slotEl,
          operation: "template-to-slot",
          args: [template],
          fn: () => {
          }
        });
      }
    }
  });
}
function getSlotName(node) {
  var _a, _b;
  return (_b = (_a = node.props) == null ? void 0 : _a["q:slot"]) != null ? _b : "";
}
function createElm(rctx, vnode, isSvg) {
  rctx.perf.visited++;
  const tag = vnode.type;
  if (tag === "#text") {
    return vnode.elm = createTextNode(rctx, vnode.text);
  }
  if (!isSvg) {
    isSvg = tag === "svg";
  }
  const props = vnode.props;
  const elm = vnode.elm = createElement(rctx, tag, isSvg);
  const isComponent = isComponentNode(vnode);
  const ctx = getContext(elm);
  setKey(elm, vnode.key);
  updateProperties(rctx, ctx, props, isSvg);
  if (isSvg && tag === "foreignObject") {
    isSvg = false;
  }
  const currentComponent = rctx.components.length > 0 ? rctx.components[rctx.components.length - 1] : void 0;
  if (currentComponent) {
    const styleTag = currentComponent.styleClass;
    if (styleTag) {
      classlistAdd(rctx, elm, styleTag);
    }
    if (tag === "q:slot") {
      setSlotRef(rctx, currentComponent.hostElement, elm);
      currentComponent.slots.push(vnode);
    }
  }
  let wait;
  if (isComponent) {
    const renderQRL = props[OnRenderProp];
    ctx.renderQrl = renderQRL;
    wait = firstRenderComponent(rctx, ctx);
  } else {
    const setsInnerHTML = checkInnerHTML(props);
    if (setsInnerHTML) {
      if (qDev && vnode.children.length > 0) {
        logWarn("Node can not have children when innerHTML is set");
      }
      return elm;
    }
  }
  return then(wait, () => {
    let children = vnode.children;
    if (children.length > 0) {
      if (children.length === 1 && children[0].type === SkipRerender) {
        children = children[0].children;
      }
      const slotMap = isComponent ? getSlots(ctx.component, elm) : void 0;
      const promises = children.map((ch) => createElm(rctx, ch, isSvg));
      return then(promiseAll(promises), () => {
        let parent = elm;
        for (const node of children) {
          if (slotMap) {
            parent = getSlotElement(rctx, slotMap, elm, getSlotName(node));
          }
          parent.appendChild(node.elm);
        }
        return elm;
      });
    }
    return elm;
  });
}
var getSlots = (componentCtx, hostElm) => {
  var _a, _b, _c, _d, _e;
  const slots = {};
  const templates = {};
  const slotRef = hostElm.getAttribute("q:sref");
  const existingSlots = Array.from(hostElm.querySelectorAll(`q\\:slot[q\\:sref="${slotRef}"]`));
  const newSlots = (_a = componentCtx == null ? void 0 : componentCtx.slots) != null ? _a : EMPTY_ARRAY;
  const t = Array.from(hostElm.children).filter(isSlotTemplate);
  for (const elm of existingSlots) {
    slots[(_b = elm.getAttribute("name")) != null ? _b : ""] = elm;
  }
  for (const vnode of newSlots) {
    slots[(_d = (_c = vnode.props) == null ? void 0 : _c.name) != null ? _d : ""] = vnode.elm;
  }
  for (const elm of t) {
    templates[(_e = elm.getAttribute("q:slot")) != null ? _e : ""] = elm;
  }
  return { slots, templates };
};
var handleStyle = (ctx, elm, _, newValue) => {
  setAttribute(ctx, elm, "style", stringifyClassOrStyle(newValue, false));
  return true;
};
var handleClass = (ctx, elm, _, newValue) => {
  setAttribute(ctx, elm, "class", stringifyClassOrStyle(newValue, true));
  return true;
};
var checkBeforeAssign = (ctx, elm, prop, newValue) => {
  if (prop in elm) {
    if (elm[prop] !== newValue) {
      setProperty(ctx, elm, prop, newValue);
    }
  }
  return true;
};
var dangerouslySetInnerHTML = "dangerouslySetInnerHTML";
var setInnerHTML = (ctx, elm, _, newValue) => {
  if (dangerouslySetInnerHTML in elm) {
    setProperty(ctx, elm, dangerouslySetInnerHTML, newValue);
  } else if ("innerHTML" in elm) {
    setProperty(ctx, elm, "innerHTML", newValue);
  }
  return true;
};
var PROP_HANDLER_MAP = {
  style: handleStyle,
  class: handleClass,
  className: handleClass,
  value: checkBeforeAssign,
  checked: checkBeforeAssign,
  [dangerouslySetInnerHTML]: setInnerHTML
};
var ALLOWS_PROPS = ["class", "className", "style", "id", "q:slot"];
var HOST_PREFIX = "host:";
var SCOPE_PREFIX = /^(host|window|document):/;
function updateProperties(rctx, ctx, expectProps, isSvg) {
  if (!expectProps) {
    return false;
  }
  const elm = ctx.element;
  const isCmp = OnRenderProp in expectProps;
  const qwikProps = isCmp ? getPropsMutator(ctx, rctx.containerState) : void 0;
  for (let key of Object.keys(expectProps)) {
    if (key === "children" || key === OnRenderProp) {
      continue;
    }
    const newValue = expectProps[key];
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    const oldValue = ctx.cache.get(key);
    if (newValue === oldValue) {
      continue;
    }
    ctx.cache.set(key, newValue);
    if (key.startsWith("data-") || key.startsWith("aria-")) {
      setAttribute(rctx, elm, key, newValue);
      continue;
    }
    if (qwikProps) {
      const skipProperty = ALLOWS_PROPS.includes(key);
      const hasPrefix = SCOPE_PREFIX.test(key);
      if (!skipProperty && !hasPrefix) {
        qwikProps.set(key, newValue);
        continue;
      }
      const hPrefixed = key.startsWith(HOST_PREFIX);
      if (hPrefixed) {
        key = key.slice(HOST_PREFIX.length);
      }
    } else if (qDev && key.startsWith(HOST_PREFIX)) {
      logWarn(`${HOST_PREFIX} prefix can not be used in non components`);
      continue;
    }
    if (isOnProp(key)) {
      setEvent(rctx, ctx, key.slice(0, -3), newValue);
      continue;
    }
    if (isOn$Prop(key)) {
      setEvent(rctx, ctx, key.slice(0, -1), $(newValue));
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    if (exception) {
      if (exception(rctx, elm, key, newValue, oldValue)) {
        continue;
      }
    }
    if (!isSvg && key in elm) {
      setProperty(rctx, elm, key, newValue);
      continue;
    }
    setAttribute(rctx, elm, key, newValue);
  }
  return ctx.dirty;
}
function setAttribute(ctx, el, prop, value) {
  const fn = () => {
    if (value == null) {
      el.removeAttribute(prop);
    } else {
      el.setAttribute(prop, String(value));
    }
  };
  ctx.operations.push({
    el,
    operation: "set-attribute",
    args: [prop, value],
    fn
  });
}
function classlistAdd(ctx, el, hostStyleTag) {
  const fn = () => {
    el.classList.add(hostStyleTag);
  };
  ctx.operations.push({
    el,
    operation: "classlist-add",
    args: [hostStyleTag],
    fn
  });
}
function setProperty(ctx, node, key, value) {
  const fn = () => {
    try {
      node[key] = value;
    } catch (err) {
      logError("Set property", { node, key, value }, err);
    }
  };
  ctx.operations.push({
    el: node,
    operation: "set-property",
    args: [key, value],
    fn
  });
}
function createElement(ctx, expectTag, isSvg) {
  const el = isSvg ? ctx.doc.createElementNS(SVG_NS, expectTag) : ctx.doc.createElement(expectTag);
  el[CONTAINER] = ctx.containerEl;
  ctx.operations.push({
    el,
    operation: "create-element",
    args: [expectTag],
    fn: () => {
    }
  });
  return el;
}
function insertBefore(ctx, parent, newChild, refChild) {
  const fn = () => {
    parent.insertBefore(newChild, refChild ? refChild : null);
  };
  ctx.operations.push({
    el: parent,
    operation: "insert-before",
    args: [newChild, refChild],
    fn
  });
  return newChild;
}
function appendStyle(ctx, hostElement, styleTask) {
  const fn = () => {
    var _a;
    const containerEl = ctx.containerEl;
    const stylesParent = ctx.doc.documentElement === containerEl ? (_a = ctx.doc.head) != null ? _a : containerEl : containerEl;
    if (!stylesParent.querySelector(`style[q\\:style="${styleTask.styleId}"]`)) {
      const style = ctx.doc.createElement("style");
      style.setAttribute("q:style", styleTask.styleId);
      style.textContent = styleTask.content;
      stylesParent.insertBefore(style, stylesParent.firstChild);
    }
  };
  ctx.operations.push({
    el: hostElement,
    operation: "append-style",
    args: [styleTask],
    fn
  });
}
function prepend(ctx, parent, newChild) {
  const fn = () => {
    parent.insertBefore(newChild, parent.firstChild);
  };
  ctx.operations.push({
    el: parent,
    operation: "prepend",
    args: [newChild],
    fn
  });
}
function removeNode(ctx, el) {
  const fn = () => {
    const parent = el.parentNode;
    if (parent) {
      if (el.nodeType === 1) {
        const subsManager = ctx.containerState.subsManager;
        cleanupElement(el, subsManager);
        el.querySelectorAll(QHostSelector).forEach((el2) => cleanupElement(el2, subsManager));
      }
      parent.removeChild(el);
    } else if (qDev) {
      logWarn("Trying to remove component already removed", el);
    }
  };
  ctx.operations.push({
    el,
    operation: "remove",
    args: [],
    fn
  });
}
function cleanupElement(el, subsManager) {
  const ctx = tryGetContext(el);
  if (ctx) {
    cleanupContext(ctx, subsManager);
  }
}
function createTextNode(ctx, text) {
  return ctx.doc.createTextNode(text);
}
function executeContextWithSlots(ctx) {
  const before = ctx.roots.map((elm) => getSlots(void 0, elm));
  executeContext(ctx);
  const after = ctx.roots.map((elm) => getSlots(void 0, elm));
  assertEqual(before.length, after.length);
  for (let i = 0; i < before.length; i++) {
    resolveSlotProjection(ctx, ctx.roots[i], before[i], after[i]);
  }
}
function executeContext(ctx) {
  for (const op of ctx.operations) {
    op.fn();
  }
}
function printRenderStats(ctx) {
  var _a;
  const byOp = {};
  for (const op of ctx.operations) {
    byOp[op.operation] = ((_a = byOp[op.operation]) != null ? _a : 0) + 1;
  }
  const affectedElements = Array.from(new Set(ctx.operations.map((a) => a.el)));
  const stats = {
    byOp,
    roots: ctx.roots,
    hostElements: Array.from(ctx.hostElements),
    affectedElements,
    visitedNodes: ctx.perf.visited,
    operations: ctx.operations.map((v) => [v.operation, v.el, ...v.args])
  };
  const noOps = ctx.operations.length === 0;
  logDebug("Render stats.", noOps ? "No operations" : "", stats);
  return stats;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const child = children[i];
    if (child.nodeType === 1) {
      const key = getKey(child);
      if (key != null) {
        map[key] = i;
      }
    }
  }
  return map;
}
var KEY_SYMBOL = Symbol("vnode key");
function getKey(el) {
  let key = el[KEY_SYMBOL];
  if (key === void 0) {
    key = el[KEY_SYMBOL] = el.getAttribute("q:key");
  }
  return key;
}
function setKey(el, key) {
  if (typeof key === "string") {
    el.setAttribute("q:key", key);
  }
  el[KEY_SYMBOL] = key;
}
function sameVnode(elm, vnode2) {
  const isElement2 = elm.nodeType === 1;
  if (isElement2) {
    const isSameSel = elm.localName === vnode2.type;
    if (!isSameSel) {
      return false;
    }
    return getKey(elm) === vnode2.key;
  }
  return elm.nodeName === vnode2.type;
}
function isTagName(elm, tagName) {
  if (elm.nodeType === 1) {
    return elm.localName === tagName;
  }
  return elm.nodeName === tagName;
}
function checkInnerHTML(props) {
  return props && ("innerHTML" in props || dangerouslySetInnerHTML in props);
}
function stringifyClassOrStyle(obj, isClass) {
  if (obj == null)
    return "";
  if (typeof obj == "object") {
    let text = "";
    let sep = "";
    if (Array.isArray(obj)) {
      if (!isClass) {
        throw qError(601 /* Render_unsupportedFormat_obj_attr */, obj, "style");
      }
      for (let i = 0; i < obj.length; i++) {
        text += sep + obj[i];
        sep = " ";
      }
    } else {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (value) {
            text += isClass ? value ? sep + key : "" : sep + fromCamelToKebabCase(key) + ":" + value;
            sep = isClass ? " " : ";";
          }
        }
      }
    }
    return text;
  }
  return String(obj);
}

// packages/qwik/src/core/render/notify-render.ts
async function notifyRender(hostElement) {
  assertDefined(hostElement.getAttribute(QHostAttr));
  const containerEl = getContainer(hostElement);
  assertDefined(containerEl);
  const state = getContainerState(containerEl);
  if (state.platform.isServer && !qTest) {
    logWarn("Can not rerender in server platform");
    return void 0;
  }
  resumeIfNeeded(containerEl);
  const ctx = getContext(hostElement);
  assertDefined(ctx.renderQrl);
  if (ctx.dirty) {
    return state.renderPromise;
  }
  ctx.dirty = true;
  const activeRendering = state.hostsRendering !== void 0;
  if (activeRendering) {
    state.hostsStaging.add(hostElement);
    return state.renderPromise.then((ctx2) => {
      if (state.hostsNext.has(hostElement)) {
        return state.renderPromise;
      } else {
        return ctx2;
      }
    });
  } else {
    state.hostsNext.add(hostElement);
    return scheduleFrame(containerEl, state);
  }
}
function scheduleFrame(containerEl, containerState) {
  if (containerState.renderPromise === void 0) {
    containerState.renderPromise = containerState.platform.nextTick(() => renderMarked(containerEl, containerState));
  }
  return containerState.renderPromise;
}
var CONTAINER_STATE = Symbol("ContainerState");
function getContainerState(containerEl) {
  let set = containerEl[CONTAINER_STATE];
  if (!set) {
    containerEl[CONTAINER_STATE] = set = {
      proxyMap: /* @__PURE__ */ new WeakMap(),
      subsManager: createSubscriptionManager(),
      platform: getPlatform2(containerEl),
      watchNext: /* @__PURE__ */ new Set(),
      watchStaging: /* @__PURE__ */ new Set(),
      hostsNext: /* @__PURE__ */ new Set(),
      hostsStaging: /* @__PURE__ */ new Set(),
      renderPromise: void 0,
      hostsRendering: void 0
    };
  }
  return set;
}
async function renderMarked(containerEl, containerState) {
  const hostsRendering = containerState.hostsRendering = new Set(containerState.hostsNext);
  containerState.hostsNext.clear();
  await executeWatches(containerState, (watch) => {
    return (watch.f & 2 /* IsWatch */) !== 0;
  });
  containerState.hostsStaging.forEach((host) => {
    hostsRendering.add(host);
  });
  containerState.hostsStaging.clear();
  const doc = getDocument(containerEl);
  const platform = containerState.platform;
  const renderingQueue = Array.from(hostsRendering);
  sortNodes(renderingQueue);
  const ctx = {
    doc,
    containerState,
    hostElements: /* @__PURE__ */ new Set(),
    operations: [],
    roots: [],
    containerEl,
    components: [],
    perf: {
      visited: 0,
      timing: []
    }
  };
  for (const el of renderingQueue) {
    if (!ctx.hostElements.has(el)) {
      ctx.roots.push(el);
      try {
        await renderComponent(ctx, getContext(el));
      } catch (e) {
        logError("Render error", e);
      }
    }
  }
  if (ctx.operations.length === 0) {
    if (qDev) {
      if (typeof window !== "undefined" && window.document != null) {
        printRenderStats(ctx);
      }
    }
    postRendering(containerEl, containerState, ctx);
    return ctx;
  }
  return platform.raf(() => {
    executeContextWithSlots(ctx);
    if (qDev) {
      if (typeof window !== "undefined" && window.document != null) {
        printRenderStats(ctx);
      }
    }
    postRendering(containerEl, containerState, ctx);
    return ctx;
  });
}
async function postRendering(containerEl, containerState, ctx) {
  await executeWatches(containerState, (watch, stage) => {
    if ((watch.f & 1 /* IsEffect */) === 0) {
      return false;
    }
    if (stage) {
      return ctx.hostElements.has(watch.el);
    }
    return true;
  });
  containerState.hostsStaging.forEach((el) => {
    containerState.hostsNext.add(el);
  });
  containerState.hostsStaging.clear();
  containerState.hostsRendering = void 0;
  containerState.renderPromise = void 0;
  if (containerState.hostsNext.size + containerState.watchNext.size > 0) {
    scheduleFrame(containerEl, containerState);
  }
}
async function executeWatches(containerState, watchPred) {
  const watchPromises = [];
  containerState.watchNext.forEach((watch) => {
    if (watchPred(watch, false)) {
      watchPromises.push(then(watch.qrl.resolveIfNeeded(watch.el), () => watch));
      containerState.watchNext.delete(watch);
    }
  });
  do {
    containerState.watchStaging.forEach((watch) => {
      if (watchPred(watch, true)) {
        watchPromises.push(then(watch.qrl.resolveIfNeeded(watch.el), () => watch));
      } else {
        containerState.watchNext.add(watch);
      }
    });
    containerState.watchStaging.clear();
    if (watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches);
      await Promise.all(watches.map((watch) => {
        return runWatch(watch, containerState);
      }));
      watchPromises.length = 0;
    }
  } while (containerState.watchStaging.size > 0);
}
function sortNodes(elements) {
  elements.sort((a, b) => a.compareDocumentPosition(b) & 2 ? 1 : -1);
}
function sortWatches(watches) {
  watches.sort((a, b) => {
    if (a.el === b.el) {
      return a.i < b.i ? -1 : 1;
    }
    return (a.el.compareDocumentPosition(b.el) & 2) !== 0 ? 1 : -1;
  });
}

// packages/qwik/src/core/object/q-object.ts
function _restoreQObject(obj, containerState, subs) {
  return readWriteProxy(obj, containerState, subs);
}
function readWriteProxy(target, containerState, subs) {
  if (!target || typeof target !== "object")
    return target;
  const proxyMap = containerState.proxyMap;
  let proxy = proxyMap.get(target);
  if (proxy)
    return proxy;
  const manager = containerState.subsManager.getLocal(target, subs);
  proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager));
  proxyMap.set(target, proxy);
  return proxy;
}
var QOjectTargetSymbol = ":target:";
var QOjectAllSymbol = ":all:";
var QOjectSubsSymbol = ":subs:";
var QOjectOriginalProxy = ":proxy:";
var SetSubscriber = Symbol("SetSubscriber");
function unwrapProxy(proxy) {
  var _a;
  return (_a = getProxyTarget(proxy)) != null ? _a : proxy;
}
function wrap(value, containerState) {
  if (value && typeof value === "object") {
    if (isQrl(value)) {
      return value;
    }
    if (Object.isFrozen(value)) {
      return value;
    }
    const nakedValue = unwrapProxy(value);
    if (nakedValue !== value) {
      return value;
    }
    if (isNode(nakedValue)) {
      return value;
    }
    if (!shouldSerialize(nakedValue)) {
      return value;
    }
    if (qDev) {
      verifySerializable(value);
    }
    const proxy = containerState.proxyMap.get(value);
    return proxy ? proxy : readWriteProxy(value, containerState);
  } else {
    return value;
  }
}
var createSubscriptionManager = () => {
  const objToSubs = /* @__PURE__ */ new Map();
  const subsToObjs = /* @__PURE__ */ new Map();
  function clearSub(sub) {
    const subs = subsToObjs.get(sub);
    if (subs) {
      subs.forEach((s) => {
        s.delete(sub);
      });
      subsToObjs.delete(sub);
      subs.clear();
    }
  }
  function tryGetLocal(obj) {
    assertEqual(getProxyTarget(obj), void 0);
    return objToSubs.get(obj);
  }
  function trackSubToObj(subscriber, map) {
    let set = subsToObjs.get(subscriber);
    if (!set) {
      subsToObjs.set(subscriber, set = /* @__PURE__ */ new Set());
    }
    set.add(map);
  }
  function getLocal(obj, initialMap) {
    let local = tryGetLocal(obj);
    if (!local) {
      const map = !initialMap ? /* @__PURE__ */ new Map() : initialMap;
      map.forEach((_, key) => {
        trackSubToObj(key, map);
      });
      objToSubs.set(obj, local = {
        subs: map,
        addSub(subscriber, key) {
          if (key == null) {
            map.set(subscriber, null);
          } else {
            let sub = map.get(subscriber);
            if (sub === void 0) {
              map.set(subscriber, sub = /* @__PURE__ */ new Set());
            }
            if (sub) {
              sub.add(key);
            }
          }
          trackSubToObj(subscriber, map);
        },
        notifySubs(key) {
          map.forEach((value, subscriber) => {
            if (value === null || !key) {
              notifyChange(subscriber);
            } else if (value.has(key)) {
              notifyChange(subscriber);
            }
          });
        }
      });
    }
    return local;
  }
  return {
    tryGetLocal,
    getLocal,
    clearSub
  };
};
var ReadWriteProxyHandler = class {
  constructor(containerState, manager) {
    this.containerState = containerState;
    this.manager = manager;
  }
  get(target, prop) {
    let subscriber = this.subscriber;
    this.subscriber = void 0;
    if (typeof prop === "symbol") {
      return target[prop];
    }
    if (prop === QOjectTargetSymbol)
      return target;
    if (prop === QOjectSubsSymbol)
      return this.manager.subs;
    if (prop === QOjectOriginalProxy)
      return this.containerState.proxyMap.get(target);
    const invokeCtx = tryGetInvokeContext();
    if (invokeCtx) {
      if (invokeCtx.subscriber === null) {
        subscriber = void 0;
      } else if (!subscriber) {
        subscriber = invokeCtx.subscriber;
      }
    } else if (qDev && !qTest && !subscriber) {
    }
    if (prop === QOjectAllSymbol) {
      if (subscriber) {
        this.manager.addSub(subscriber);
      }
      return target;
    }
    const value = target[prop];
    if (typeof prop === "symbol") {
      return value;
    }
    if (subscriber) {
      const isArray = Array.isArray(target);
      this.manager.addSub(subscriber, isArray ? void 0 : prop);
    }
    return wrap(value, this.containerState);
  }
  set(target, prop, newValue) {
    if (typeof prop === "symbol") {
      if (prop === SetSubscriber) {
        this.subscriber = newValue;
      } else {
        target[prop] = newValue;
      }
      return true;
    }
    const unwrappedNewValue = unwrapProxy(newValue);
    if (qDev) {
      verifySerializable(unwrappedNewValue);
      const invokeCtx = tryGetInvokeContext();
      if (invokeCtx && invokeCtx.event === RenderEvent) {
        logWarn("State mutation inside render function. Move mutation to useWatch(), useClientEffect() or useServerMount()", invokeCtx.hostElement, prop);
      }
    }
    const isArray = Array.isArray(target);
    if (isArray) {
      target[prop] = unwrappedNewValue;
      this.manager.notifySubs();
      return true;
    }
    const oldValue = target[prop];
    if (oldValue !== unwrappedNewValue) {
      target[prop] = unwrappedNewValue;
      this.manager.notifySubs(prop);
    }
    return true;
  }
  has(target, property) {
    if (property === QOjectTargetSymbol)
      return true;
    if (property === QOjectSubsSymbol)
      return true;
    return Object.prototype.hasOwnProperty.call(target, property);
  }
  ownKeys(target) {
    let subscriber = this.subscriber;
    const invokeCtx = tryGetInvokeContext();
    if (invokeCtx) {
      if (invokeCtx.subscriber === null) {
        subscriber = void 0;
      } else if (!subscriber) {
        subscriber = invokeCtx.subscriber;
      }
    } else if (qDev && !qTest && !subscriber) {
    }
    if (subscriber) {
      this.manager.addSub(subscriber);
    }
    return Object.getOwnPropertyNames(target);
  }
};
function notifyChange(subscriber) {
  if (isElement(subscriber)) {
    notifyRender(subscriber);
  } else {
    notifyWatch(subscriber);
  }
}
function notifyWatch(watch) {
  const containerEl = getContainer(watch.el);
  const state = getContainerState(containerEl);
  watch.f |= 4 /* IsDirty */;
  const activeRendering = state.hostsRendering !== void 0;
  if (activeRendering) {
    state.watchStaging.add(watch);
  } else {
    state.watchNext.add(watch);
    scheduleFrame(containerEl, state);
  }
}
function verifySerializable(value) {
  if (value == null) {
    return null;
  }
  if (shouldSerialize(value)) {
    const type = typeof value;
    if (type === "object") {
      if (Array.isArray(value))
        return;
      if (Object.getPrototypeOf(value) === Object.prototype)
        return;
      if (isQrl(value))
        return;
      if (isElement(value))
        return;
      if (isDocument(value))
        return;
    }
    if (["boolean", "string", "number"].includes(type)) {
      return;
    }
    throw qError(0 /* TODO */, "Only primitive and object literals can be serialized", value);
  }
}
var noSerializeSet = /* @__PURE__ */ new WeakSet();
function shouldSerialize(obj) {
  if (obj !== null && (typeof obj == "object" || typeof obj === "function")) {
    return !noSerializeSet.has(obj);
  }
  return true;
}
function noSerialize(input) {
  noSerializeSet.add(input);
  return input;
}
function isConnected(sub) {
  if (isElement(sub)) {
    return !!tryGetContext(sub) || sub.isConnected;
  } else {
    return isConnected(sub.el);
  }
}
var MUTABLE = Symbol("mutable");
var isMutable = (v) => {
  return v && typeof v === "object" && v[MUTABLE] === true;
};

// packages/qwik/src/core/props/props-obj-map.ts
function newQObjectMap() {
  const array = [];
  return {
    array,
    get(index) {
      return array[index];
    },
    indexOf(obj) {
      const index = array.indexOf(obj);
      return index === -1 ? void 0 : index;
    },
    add(object) {
      const index = array.indexOf(object);
      if (index === -1) {
        array.push(object);
        return array.length - 1;
      }
      return index;
    }
  };
}

// packages/qwik/src/core/object/store.public.ts
function pauseContainer(elmOrDoc) {
  const doc = getDocument(elmOrDoc);
  const containerEl = isDocument(elmOrDoc) ? elmOrDoc.documentElement : elmOrDoc;
  const parentJSON = isDocument(elmOrDoc) ? elmOrDoc.body : containerEl;
  const data = snapshotState(containerEl);
  const script = doc.createElement("script");
  script.setAttribute("type", "qwik/json");
  script.textContent = escapeText(JSON.stringify(data.state, void 0, qDev ? "  " : void 0));
  parentJSON.appendChild(script);
  containerEl.setAttribute(QContainerAttr, "paused");
  return data;
}

// packages/qwik/src/core/props/props.ts
Error.stackTraceLimit = 9999;
var Q_CTX = "__ctx__";
function resumeIfNeeded(containerEl) {
  const isResumed = containerEl.getAttribute(QContainerAttr);
  if (isResumed === "paused") {
    resumeContainer(containerEl);
    if (qDev) {
      appendQwikDevTools(containerEl);
    }
  }
}
function appendQwikDevTools(containerEl) {
  containerEl["qwik"] = {
    pause: () => pauseContainer(containerEl),
    state: getContainerState(containerEl)
  };
}
function tryGetContext(element) {
  return element[Q_CTX];
}
function getContext(element) {
  let ctx = tryGetContext(element);
  if (!ctx) {
    const cache = /* @__PURE__ */ new Map();
    element[Q_CTX] = ctx = {
      element,
      cache,
      refMap: newQObjectMap(),
      dirty: false,
      seq: [],
      watches: [],
      props: void 0,
      renderQrl: void 0,
      component: void 0
    };
  }
  return ctx;
}
function cleanupContext(ctx, subsManager) {
  const el = ctx.element;
  ctx.watches.forEach((watch) => {
    subsManager.clearSub(watch);
    destroyWatch(watch);
  });
  if (ctx.renderQrl) {
    subsManager.clearSub(el);
  }
  ctx.component = void 0;
  ctx.renderQrl = void 0;
  ctx.seq.length = 0;
  ctx.watches.length = 0;
  ctx.cache.clear();
  ctx.dirty = false;
  ctx.refMap.array.length = 0;
  el[Q_CTX] = void 0;
}
var PREFIXES = ["document:on", "window:on", "on"];
var SCOPED = ["on-document", "on-window", "on"];
function normalizeOnProp(prop) {
  let scope = "on";
  for (let i = 0; i < PREFIXES.length; i++) {
    const prefix = PREFIXES[i];
    if (prop.startsWith(prefix)) {
      scope = SCOPED[i];
      prop = prop.slice(prefix.length);
    }
  }
  if (prop.startsWith("-")) {
    prop = prop.slice(1);
  } else {
    prop = prop.toLowerCase();
  }
  return `${scope}:${prop}`;
}
function setEvent(rctx, ctx, prop, value) {
  qPropWriteQRL(rctx, ctx, normalizeOnProp(prop), value);
}
function createProps(target, el, containerState) {
  const manager = containerState.subsManager.getLocal(target);
  return new Proxy(target, new PropsProxyHandler(el, containerState, manager));
}
function getPropsMutator(ctx, containerState) {
  let props = ctx.props;
  if (!ctx.props) {
    ctx.props = props = createProps({}, ctx.element, containerState);
  }
  const target = getProxyTarget(props);
  const manager = containerState.subsManager.getLocal(target);
  return {
    set(prop, value) {
      var _a, _b;
      const didSet = prop in target;
      let oldValue = target[prop];
      let mut = false;
      if (isMutable(oldValue)) {
        oldValue = oldValue.v;
      }
      value = unwrapSubscriber(value);
      target[prop] = value;
      if (isMutable(value)) {
        value = value.v;
        mut = true;
      }
      if (oldValue !== value) {
        if (qDev) {
          if (didSet && !mut && !isQrl(value)) {
            const displayName = (_b = (_a = ctx.renderQrl) == null ? void 0 : _a.getSymbol()) != null ? _b : ctx.element.localName;
            logError(`Props are immutable by default. If you need to change a value of a passed in prop, please wrap the prop with "mutable()" <${displayName} ${prop}={mutable(...)}>`, "\n - Component:", displayName, "\n - Prop:", prop, "\n - Old value:", oldValue, "\n - New value:", value);
          }
        }
        manager.notifySubs(prop);
      }
    }
  };
}
var PropsProxyHandler = class {
  constructor(hostElement, containerState, manager) {
    this.hostElement = hostElement;
    this.containerState = containerState;
    this.manager = manager;
  }
  get(target, prop) {
    if (typeof prop === "symbol") {
      return target[prop];
    }
    if (prop === QOjectTargetSymbol)
      return target;
    if (prop === QOjectSubsSymbol)
      return this.manager.subs;
    if (prop === QOjectOriginalProxy)
      return readWriteProxy(target, this.containerState);
    if (prop === QOjectAllSymbol) {
      this.manager.addSub(this.hostElement);
      return target;
    }
    const value = target[prop];
    if (typeof prop === "symbol") {
      return value;
    }
    if (isMutable(value)) {
      this.manager.addSub(this.hostElement, prop);
      return value.v;
    }
    return value;
  }
  set() {
    throw new Error("props are inmutable");
  }
  has(target, property) {
    if (property === QOjectTargetSymbol)
      return true;
    if (property === QOjectSubsSymbol)
      return true;
    return Object.prototype.hasOwnProperty.call(target, property);
  }
  ownKeys(target) {
    const subscriber = this.hostElement;
    this.manager.addSub(subscriber);
    return Object.getOwnPropertyNames(target);
  }
};

// packages/qwik/src/testing/util.ts
var import_url2 = require("url");
function toFileUrl(filePath) {
  return (0, import_url2.pathToFileURL)(filePath).href;
}
function applyDocumentConfig(doc, config) {
  if (doc && config) {
    if (config.baseURI) {
      appendConfig(doc, `baseURI`, config.baseURI);
    }
    if (config.protocol) {
      for (const protocol in config.protocol) {
        appendConfig(doc, `protocol.${protocol}`, config.protocol[protocol]);
      }
    }
  }
}
function appendConfig(doc, key, value) {
  const linkElm = doc.createElement("link");
  linkElm.setAttribute(`rel`, `q.${key}`);
  linkElm.setAttribute(`href`, value);
  doc.head.appendChild(linkElm);
}
var __self = typeof self !== "undefined" && typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && self;

// packages/qwik/src/testing/element-fixture.ts
var ElementFixture = class {
  constructor(options = {}) {
    this.window = createWindow();
    this.document = this.window.document;
    this.superParent = this.document.createElement("super-parent");
    this.parent = this.document.createElement("parent");
    this.host = this.document.createElement(options.tagName || "host");
    this.child = this.document.createElement("child");
    this.superParent.appendChild(this.parent);
    this.parent.appendChild(this.host);
    this.host.appendChild(this.child);
    this.document.body.appendChild(this.superParent);
    applyDocumentConfig(this.document, options);
  }
};

// packages/qwik/src/testing/jsx.ts
function toDOM(jsx2, parent) {
  const doc = parent ? parent.ownerDocument : createDocument();
  let element = doc.createElement(jsx2.type);
  for (const attrName in jsx2.props) {
    if (attrName !== "children") {
      const jsxValue = jsx2.props[attrName];
      element.setAttribute(attrName, isQrl(jsxValue) ? stringifyQRL(jsxValue, { element }) : jsxValue);
    }
  }
  if (parent) {
    parent.appendChild(element);
    if (isTemplate(element)) {
      element = element.content;
    }
  }
  jsx2.children.forEach((child) => {
    if (isJSXNode2(child)) {
      toDOM(child, element);
    } else {
      element.appendChild(doc.createTextNode(String(child)));
    }
  });
  return element;
}
var isJSXNode2 = (n) => {
  return n && typeof n === "object" && n.constructor.name === "JSXNodeImpl";
};
function isTemplate(node) {
  const tagName = node && node.tagName || "";
  return tagName.toUpperCase() == "TEMPLATE";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ElementFixture,
  applyDocumentConfig,
  createDocument,
  createWindow,
  getTestPlatform,
  isPromise,
  toDOM,
  toFileUrl
});
