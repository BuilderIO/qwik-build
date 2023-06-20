/**
 * @license
 * @builder.io/qwik 1.1.5-dev20230620194537
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
import { isServer, isBrowser } from "@builder.io/qwik/build";

const implicit$FirstArg = fn => function(first, ...rest) {
    return fn.call(null, $(first), ...rest);
};

const qDev = !1;

const qInspector = !1;

const qSerialize = !0;

const qDynamicPlatform = !0;

const qTest = !1;

const qRuntimeQrl = !1;

const seal = () => {
    qDev;
};

const isNode$1 = value => value && "number" == typeof value.nodeType;

const isDocument = value => 9 === value.nodeType;

const isElement$1 = value => 1 === value.nodeType;

const isQwikElement = value => {
    const nodeType = value.nodeType;
    return 1 === nodeType || 111 === nodeType;
};

const isNodeElement = value => {
    const nodeType = value.nodeType;
    return 1 === nodeType || 111 === nodeType || 3 === nodeType;
};

const isVirtualElement = value => 111 === value.nodeType;

const isText = value => 3 === value.nodeType;

const isComment = value => 8 === value.nodeType;

const STYLE = "";

const logError = (message, ...optionalParams) => {
    const err = message instanceof Error ? message : createError(message);
    return console.error("%cQWIK ERROR", "", err.stack || err.message, ...printParams(optionalParams)), 
    err;
};

const createError = message => new Error(message);

const logErrorAndStop = (message, ...optionalParams) => logError(message, ...optionalParams);

const _printed = /*#__PURE__*/ new Set;

const logOnceWarn = () => {
    qDev;
};

const logWarn = () => {
    qDev;
};

const logDebug = () => {
    qDev;
};

const tryGetContext$1 = element => element._qc_;

const printParams = optionalParams => optionalParams;

const printElement = el => {
    const ctx = el._qc_;
    const isServer = /*#__PURE__*/ (() => "undefined" != typeof process && !!process.versions && !!process.versions.node)();
    return {
        tagName: el.tagName,
        renderQRL: ctx?.$componentQrl$?.getSymbol(),
        element: isServer ? void 0 : el,
        ctx: isServer ? void 0 : ctx
    };
};

const QError_stringifyClassOrStyle = 0;

const QError_verifySerializable = 3;

const QError_cannotRenderOverExistingContainer = 5;

const QError_setProperty = 6;

const QError_qrlIsNotFunction = 10;

const QError_dynamicImportFailed = 11;

const QError_unknownTypeArgument = 12;

const QError_notFoundContext = 13;

const QError_useMethodOutsideContext = 14;

const QError_immutableProps = 17;

const QError_useInvokeContext = 20;

const QError_containerAlreadyPaused = 21;

const QError_invalidJsxNodeType = 25;

const QError_trackUseStore = 26;

const QError_missingObjectId = 27;

const QError_invalidContext = 28;

const QError_canNotRenderHTML = 29;

const QError_qrlMissingContainer = 30;

const QError_qrlMissingChunk = 31;

const QError_invalidRefValue = 32;

const qError = (code, ...parts) => {
    const text = codeToText(code);
    return logErrorAndStop(text, ...parts);
};

const codeToText = code => `Code(${code})`;

const createPlatform = () => ({
    isServer,
    importSymbol(containerEl, url, symbolName) {
        if (isServer) {
            const hash = getSymbolHash(symbolName);
            const regSym = globalThis.__qwik_reg_symbols?.get(hash);
            if (regSym) {
                return regSym;
            }
        }
        if (!url) {
            throw qError(31, symbolName);
        }
        if (!containerEl) {
            throw qError(30, url, symbolName);
        }
        const urlDoc = toUrl(containerEl.ownerDocument, containerEl, url).toString();
        const urlCopy = new URL(urlDoc);
        urlCopy.hash = "", urlCopy.search = "";
        return import(urlCopy.href).then((mod => mod[symbolName]));
    },
    raf: fn => new Promise((resolve => {
        requestAnimationFrame((() => {
            resolve(fn());
        }));
    })),
    nextTick: fn => new Promise((resolve => {
        setTimeout((() => {
            resolve(fn());
        }));
    })),
    chunkForSymbol: (symbolName, chunk) => [ symbolName, chunk ?? "_" ]
});

const toUrl = (doc, containerEl, url) => {
    const baseURI = doc.baseURI;
    const base = new URL(containerEl.getAttribute("q:base") ?? baseURI, baseURI);
    return new URL(url, base);
};

let _platform = /*#__PURE__ */ createPlatform();

const setPlatform = plt => _platform = plt;

const getPlatform = () => _platform;

const isServerPlatform = () => _platform.isServer;

const ASSERT_DISCLAIMER = "Internal assert, this is likely caused by a bug in Qwik: ";

function assertDefined() {
    qDev;
}

function assertEqual() {
    qDev;
}

function assertFail() {
    qDev;
}

function assertTrue() {
    qDev;
}

function assertNumber() {
    qDev;
}

function assertString() {
    qDev;
}

function assertQwikElement() {
    qDev;
}

function assertElement() {
    qDev;
}

const isSerializableObject = v => {
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || null === proto;
};

const isObject = v => v && "object" == typeof v;

const isArray = v => Array.isArray(v);

const isString = v => "string" == typeof v;

const isFunction = v => "function" == typeof v;

const isPromise = value => value instanceof Promise;

const safeCall = (call, thenFn, rejectFn) => {
    try {
        const promise = call();
        return isPromise(promise) ? promise.then(thenFn, rejectFn) : thenFn(promise);
    } catch (e) {
        return rejectFn(e);
    }
};

const then = (promise, thenFn) => isPromise(promise) ? promise.then(thenFn) : thenFn(promise);

const promiseAll = promises => promises.some(isPromise) ? Promise.all(promises) : promises;

const promiseAllLazy = promises => promises.length > 0 ? Promise.all(promises) : promises;

const isNotNullable = v => null != v;

const delay = timeout => new Promise((resolve => {
    setTimeout(resolve, timeout);
}));

const EMPTY_ARRAY = [];

const EMPTY_OBJ = {};

const getDocument = node => {
    if ("undefined" != typeof document) {
        return document;
    }
    if (9 === node.nodeType) {
        return node;
    }
    const doc = node.ownerDocument;
    return assertDefined(doc, "doc must be defined"), doc;
};

const OnRenderProp = "q:renderFn";

const ComponentStylesPrefixContent = "⭐️";

const QSlot = "q:slot";

const QSlotRef = "q:sref";

const QSlotS = "q:s";

const QStyle = "q:style";

const QScopedStyle = "q:sstyle";

const QLocaleAttr = "q:locale";

const QContainerAttr = "q:container";

const QContainerSelector = "[q\\:container]";

const ResourceEvent = "qResource";

const ComputedEvent = "qComputed";

const RenderEvent = "qRender";

const ELEMENT_ID = "q:id";

const ELEMENT_ID_PREFIX = "#";

const fromCamelToKebabCase = text => text.replace(/([A-Z])/g, "-$1").toLowerCase();

const fromKebabToCamelCase = text => text.replace(/-./g, (x => x[1].toUpperCase()));

const directSetAttribute = (el, prop, value) => el.setAttribute(prop, value);

const directGetAttribute = (el, prop) => el.getAttribute(prop);

const directRemoveAttribute = (el, prop) => el.removeAttribute(prop);

const CONTAINER_STATE = Symbol("ContainerState");

const _getContainerState = containerEl => {
    let set = containerEl[CONTAINER_STATE];
    return set || (containerEl[CONTAINER_STATE] = set = createContainerState(containerEl, directGetAttribute(containerEl, "q:base") ?? "/")), 
    set;
};

const createContainerState = (containerEl, base) => {
    const containerState = {
        $containerEl$: containerEl,
        $elementIndex$: 0,
        $styleMoved$: !1,
        $proxyMap$: new WeakMap,
        $opsNext$: new Set,
        $watchNext$: new Set,
        $watchStaging$: new Set,
        $hostsNext$: new Set,
        $hostsStaging$: new Set,
        $styleIds$: new Set,
        $events$: new Set,
        $serverData$: {},
        $base$: base,
        $renderPromise$: void 0,
        $hostsRendering$: void 0,
        $pauseCtx$: void 0,
        $subsManager$: null
    };
    return seal(), containerState.$subsManager$ = createSubscriptionManager(containerState), 
    containerState;
};

const removeContainerState = containerEl => {
    delete containerEl[CONTAINER_STATE];
};

const setRef = (value, elm) => {
    if (isFunction(value)) {
        return value(elm);
    }
    if (isObject(value) && "value" in value) {
        return value.value = elm;
    }
    throw qError(32, value);
};

const SHOW_ELEMENT = 1;

const SHOW_COMMENT$1 = 128;

const FILTER_REJECT$1 = 2;

const FILTER_SKIP = 3;

const isContainer$1 = el => isElement$1(el) && el.hasAttribute("q:container");

const intToStr = nu => nu.toString(36);

const strToInt = nu => parseInt(nu, 36);

const getEventName = attribute => {
    const colonPos = attribute.indexOf(":");
    return attribute ? attribute.slice(colonPos + 1).replace(/-./g, (x => x[1].toUpperCase())) : attribute;
};

const ON_PROP_REGEX = /^(on|window:|document:)/;

const PREVENT_DEFAULT = "preventdefault:";

const isOnProp = prop => prop.endsWith("$") && ON_PROP_REGEX.test(prop);

const groupListeners = listeners => {
    if (0 === listeners.length) {
        return EMPTY_ARRAY;
    }
    if (1 === listeners.length) {
        const listener = listeners[0];
        return [ [ listener[0], [ listener[1] ] ] ];
    }
    const keys = [];
    for (let i = 0; i < listeners.length; i++) {
        const eventName = listeners[i][0];
        keys.includes(eventName) || keys.push(eventName);
    }
    return keys.map((eventName => [ eventName, listeners.filter((l => l[0] === eventName)).map((a => a[1])) ]));
};

const setEvent = (existingListeners, prop, input, containerEl) => {
    if (assertTrue(prop.endsWith("$"), "render: event property does not end with $", prop), 
    prop = normalizeOnProp(prop.slice(0, -1)), input) {
        if (isArray(input)) {
            const processed = input.flat(1 / 0).filter((q => null != q)).map((q => [ prop, ensureQrl(q, containerEl) ]));
            existingListeners.push(...processed);
        } else {
            existingListeners.push([ prop, ensureQrl(input, containerEl) ]);
        }
    }
    return prop;
};

const PREFIXES = [ "on", "window:on", "document:on" ];

const SCOPED = [ "on", "on-window", "on-document" ];

const normalizeOnProp = prop => {
    let scope = "on";
    for (let i = 0; i < PREFIXES.length; i++) {
        const prefix = PREFIXES[i];
        if (prop.startsWith(prefix)) {
            scope = SCOPED[i], prop = prop.slice(prefix.length);
            break;
        }
    }
    return scope + ":" + (prop = prop.startsWith("-") ? fromCamelToKebabCase(prop.slice(1)) : prop.toLowerCase());
};

const ensureQrl = (value, containerEl) => (assertQrl(value), value.$setContainer$(containerEl), 
value);

const getDomListeners = (elCtx, containerEl) => {
    const attributes = elCtx.$element$.attributes;
    const listeners = [];
    for (let i = 0; i < attributes.length; i++) {
        const {name, value} = attributes.item(i);
        if (name.startsWith("on:") || name.startsWith("on-window:") || name.startsWith("on-document:")) {
            const urls = value.split("\n");
            for (const url of urls) {
                const qrl = parseQRL(url, containerEl);
                qrl.$capture$ && inflateQrl(qrl, elCtx), listeners.push([ name, qrl ]);
            }
        }
    }
    return listeners;
};

function isElement(value) {
    return isNode(value) && 1 === value.nodeType;
}

function isNode(value) {
    return value && "number" == typeof value.nodeType;
}

const QObjectRecursive = 1;

const QObjectImmutable = 2;

const QOjectTargetSymbol = Symbol("proxy target");

const QObjectFlagsSymbol = Symbol("proxy flags");

const QObjectManagerSymbol = Symbol("proxy manager");

const _IMMUTABLE = Symbol("IMMUTABLE");

const _IMMUTABLE_PREFIX = "$$";

const _fnSignal = (fn, args, fnStr) => new SignalDerived(fn, args, fnStr);

const serializeDerivedSignalFunc = signal => {
    const fnBody = signal.$funcStr$;
    assertDefined(fnBody, "If qSerialize is true then fnStr must be provided.");
    let args = "";
    for (let i = 0; i < signal.$args$.length; i++) {
        args += `p${i},`;
    }
    return `(${args})=>(${fnBody})`;
};

var _a$1;

const _createSignal = (value, containerState, flags, subscriptions) => {
    const manager = containerState.$subsManager$.$createManager$(subscriptions);
    return new SignalImpl(value, manager, flags);
};

const QObjectSignalFlags = Symbol("proxy manager");

const SIGNAL_IMMUTABLE = 1;

const SIGNAL_UNASSIGNED = 2;

const SignalUnassignedException = Symbol("unassigned signal");

class SignalBase {}

class SignalImpl extends SignalBase {
    constructor(v, manager, flags) {
        super(), this[_a$1] = 0, this.untrackedValue = v, this[QObjectManagerSymbol] = manager, 
        this[QObjectSignalFlags] = flags;
    }
    valueOf() {
        qDev;
    }
    toString() {
        return `[Signal ${String(this.value)}]`;
    }
    toJSON() {
        return {
            value: this.value
        };
    }
    get value() {
        if (2 & this[QObjectSignalFlags]) {
            throw SignalUnassignedException;
        }
        const sub = tryGetInvokeContext()?.$subscriber$;
        return sub && this[QObjectManagerSymbol].$addSub$(sub), this.untrackedValue;
    }
    set value(v) {
        const manager = this[QObjectManagerSymbol];
        manager && this.untrackedValue !== v && (this.untrackedValue = v, manager.$notifySubs$());
    }
}

_a$1 = QObjectSignalFlags;

class SignalDerived extends SignalBase {
    constructor($func$, $args$, $funcStr$) {
        super(), this.$func$ = $func$, this.$args$ = $args$, this.$funcStr$ = $funcStr$;
    }
    get value() {
        return this.$func$.apply(void 0, this.$args$);
    }
}

class SignalWrapper extends SignalBase {
    constructor(ref, prop) {
        super(), this.ref = ref, this.prop = prop;
    }
    get [QObjectManagerSymbol]() {
        return getProxyManager(this.ref);
    }
    get value() {
        return this.ref[this.prop];
    }
    set value(value) {
        this.ref[this.prop] = value;
    }
}

const isSignal = obj => obj instanceof SignalBase;

const _wrapProp = (obj, prop) => {
    if (!isObject(obj)) {
        return obj[prop];
    }
    if (obj instanceof SignalBase) {
        return assertEqual(prop, "value", "Left side is a signal, prop must be value"), 
        obj;
    }
    const target = getProxyTarget(obj);
    if (target) {
        const signal = target["$$" + prop];
        if (signal) {
            return assertTrue(isSignal(signal), "$$ has to be a signal kind"), signal;
        }
        if (!0 !== target[_IMMUTABLE]?.[prop]) {
            return new SignalWrapper(obj, prop);
        }
    }
    const immutable = obj[_IMMUTABLE]?.[prop];
    return isSignal(immutable) ? immutable : _IMMUTABLE;
};

const _wrapSignal = (obj, prop) => {
    const r = _wrapProp(obj, prop);
    return r === _IMMUTABLE ? obj[prop] : r;
};

const getOrCreateProxy = (target, containerState, flags = 0) => {
    const proxy = containerState.$proxyMap$.get(target);
    return proxy || (0 !== flags && setObjectFlags(target, flags), createProxy(target, containerState, void 0));
};

const createProxy = (target, containerState, subs) => {
    assertEqual(unwrapProxy(target), target, "Unexpected proxy at this location", target), 
    assertTrue(!containerState.$proxyMap$.has(target), "Proxy was already created", target), 
    assertTrue(isObject(target), "Target must be an object"), assertTrue(isSerializableObject(target) || isArray(target), "Target must be a serializable object");
    const manager = containerState.$subsManager$.$createManager$(subs);
    const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager));
    return containerState.$proxyMap$.set(target, proxy), proxy;
};

const createPropsState = () => {
    const props = {};
    return setObjectFlags(props, 2), props;
};

const setObjectFlags = (obj, flags) => {
    Object.defineProperty(obj, QObjectFlagsSymbol, {
        value: flags,
        enumerable: !1
    });
};

const _restProps = (props, omit) => {
    const rest = {};
    for (const key in props) {
        omit.includes(key) || (rest[key] = props[key]);
    }
    return rest;
};

class ReadWriteProxyHandler {
    constructor($containerState$, $manager$) {
        this.$containerState$ = $containerState$, this.$manager$ = $manager$;
    }
    deleteProperty(target, prop) {
        if (2 & target[QObjectFlagsSymbol]) {
            throw qError(17);
        }
        return "string" == typeof prop && delete target[prop] && (this.$manager$.$notifySubs$(isArray(target) ? void 0 : prop), 
        !0);
    }
    get(target, prop) {
        if ("symbol" == typeof prop) {
            return prop === QOjectTargetSymbol ? target : prop === QObjectManagerSymbol ? this.$manager$ : target[prop];
        }
        const flags = target[QObjectFlagsSymbol] ?? 0;
        assertNumber(flags, "flags must be an number");
        const invokeCtx = tryGetInvokeContext();
        const recursive = 0 != (1 & flags);
        const hiddenSignal = target["$$" + prop];
        let subscriber;
        let value;
        if (invokeCtx && (subscriber = invokeCtx.$subscriber$), !(0 != (2 & flags)) || prop in target && !immutableValue(target[_IMMUTABLE]?.[prop]) || (subscriber = null), 
        hiddenSignal ? (assertTrue(isSignal(hiddenSignal), "$$ prop must be a signal"), 
        value = hiddenSignal.value, subscriber = null) : value = target[prop], subscriber) {
            const isA = isArray(target);
            this.$manager$.$addSub$(subscriber, isA ? void 0 : prop);
        }
        return recursive ? wrap(value, this.$containerState$) : value;
    }
    set(target, prop, newValue) {
        if ("symbol" == typeof prop) {
            return target[prop] = newValue, !0;
        }
        const flags = target[QObjectFlagsSymbol] ?? 0;
        assertNumber(flags, "flags must be an number");
        if (0 != (2 & flags)) {
            throw qError(17);
        }
        const unwrappedNewValue = 0 != (1 & flags) ? unwrapProxy(newValue) : newValue;
        if (isArray(target)) {
            return target[prop] = unwrappedNewValue, this.$manager$.$notifySubs$(), !0;
        }
        const oldValue = target[prop];
        return target[prop] = unwrappedNewValue, oldValue !== unwrappedNewValue && this.$manager$.$notifySubs$(prop), 
        !0;
    }
    has(target, property) {
        if (property === QOjectTargetSymbol) {
            return !0;
        }
        const hasOwnProperty = Object.prototype.hasOwnProperty;
        return !!hasOwnProperty.call(target, property) || !("string" != typeof property || !hasOwnProperty.call(target, "$$" + property));
    }
    ownKeys(target) {
        const flags = target[QObjectFlagsSymbol] ?? 0;
        assertNumber(flags, "flags must be an number");
        if (!(0 != (2 & flags))) {
            let subscriber = null;
            const invokeCtx = tryGetInvokeContext();
            invokeCtx && (subscriber = invokeCtx.$subscriber$), subscriber && this.$manager$.$addSub$(subscriber);
        }
        return isArray(target) ? Reflect.ownKeys(target) : Reflect.ownKeys(target).map((a => "string" == typeof a && a.startsWith("$$") ? a.slice(2) : a));
    }
    getOwnPropertyDescriptor(target, prop) {
        return isArray(target) || "symbol" == typeof prop ? Object.getOwnPropertyDescriptor(target, prop) : {
            enumerable: !0,
            configurable: !0
        };
    }
}

const immutableValue = value => value === _IMMUTABLE || isSignal(value);

const wrap = (value, containerState) => {
    if (isObject(value)) {
        if (Object.isFrozen(value)) {
            return value;
        }
        const nakedValue = unwrapProxy(value);
        if (nakedValue !== value) {
            return value;
        }
        if (fastSkipSerialize(nakedValue)) {
            return value;
        }
        if (isSerializableObject(nakedValue) || isArray(nakedValue)) {
            const proxy = containerState.$proxyMap$.get(nakedValue);
            return proxy || getOrCreateProxy(nakedValue, containerState, 1);
        }
    }
    return value;
};

const Q_CTX = "_qc_";

const HOST_FLAG_DIRTY = 1;

const HOST_FLAG_NEED_ATTACH_LISTENER = 2;

const HOST_FLAG_MOUNTED = 4;

const HOST_FLAG_DYNAMIC = 8;

const tryGetContext = element => element[Q_CTX];

const getContext = (el, containerState) => {
    assertQwikElement(el);
    const ctx = tryGetContext(el);
    if (ctx) {
        return ctx;
    }
    const elCtx = createContext(el);
    const elementID = directGetAttribute(el, "q:id");
    if (elementID) {
        const pauseCtx = containerState.$pauseCtx$;
        if (elCtx.$id$ = elementID, pauseCtx) {
            const {getObject, meta, refs} = pauseCtx;
            if (isElement(el)) {
                const refMap = refs[elementID];
                refMap && (assertTrue(isElement(el), "el must be an actual DOM element"), elCtx.$refMap$ = refMap.split(" ").map(getObject), 
                elCtx.li = getDomListeners(elCtx, containerState.$containerEl$));
            } else {
                const styleIds = el.getAttribute("q:sstyle");
                elCtx.$scopeIds$ = styleIds ? styleIds.split("|") : null;
                const ctxMeta = meta[elementID];
                if (ctxMeta) {
                    const seq = ctxMeta.s;
                    const host = ctxMeta.h;
                    const contexts = ctxMeta.c;
                    const watches = ctxMeta.w;
                    if (seq && (elCtx.$seq$ = seq.split(" ").map(getObject)), watches && (elCtx.$watches$ = watches.split(" ").map(getObject)), 
                    contexts) {
                        elCtx.$contexts$ = new Map;
                        for (const part of contexts.split(" ")) {
                            const [key, value] = part.split("=");
                            elCtx.$contexts$.set(key, getObject(value));
                        }
                    }
                    if (host) {
                        const [renderQrl, props] = host.split(" ");
                        if (elCtx.$flags$ = 4, renderQrl && (elCtx.$componentQrl$ = getObject(renderQrl)), 
                        props) {
                            const propsObj = getObject(props);
                            elCtx.$props$ = propsObj, setObjectFlags(propsObj, 2), propsObj[_IMMUTABLE] = getImmutableFromProps(propsObj);
                        } else {
                            elCtx.$props$ = createProxy(createPropsState(), containerState);
                        }
                    }
                }
            }
        }
    }
    return elCtx;
};

const getImmutableFromProps = props => {
    const immutable = {};
    const target = getProxyTarget(props);
    for (const key in target) {
        key.startsWith("$$") && (immutable[key.slice(2)] = target[key]);
    }
    return immutable;
};

const createContext = element => {
    const ctx = {
        $flags$: 0,
        $id$: "",
        $element$: element,
        $refMap$: [],
        li: [],
        $watches$: null,
        $seq$: null,
        $slots$: null,
        $scopeIds$: null,
        $appendStyles$: null,
        $props$: null,
        $vdom$: null,
        $componentQrl$: null,
        $contexts$: null,
        $dynamicSlots$: null,
        $parent$: null,
        $slotParent$: null
    };
    return seal(), element[Q_CTX] = ctx, ctx;
};

const cleanupContext = (elCtx, subsManager) => {
    elCtx.$watches$?.forEach((watch => {
        subsManager.$clearSub$(watch), destroyWatch(watch);
    })), elCtx.$componentQrl$ = null, elCtx.$seq$ = null, elCtx.$watches$ = null;
};

let _locale;

function getLocale(defaultLocale) {
    if (void 0 === _locale) {
        const ctx = tryGetInvokeContext();
        if (ctx && ctx.$locale$) {
            return ctx.$locale$;
        }
        if (void 0 !== defaultLocale) {
            return defaultLocale;
        }
        throw new Error("Reading `locale` outside of context.");
    }
    return _locale;
}

function withLocale(locale, fn) {
    const previousLang = _locale;
    try {
        return _locale = locale, fn();
    } finally {
        _locale = previousLang;
    }
}

function setLocale(locale) {
    _locale = locale;
}

let _context;

const tryGetInvokeContext = () => {
    if (!_context) {
        const context = "undefined" != typeof document && document && document.__q_context__;
        if (!context) {
            return;
        }
        return isArray(context) ? document.__q_context__ = newInvokeContextFromTuple(context) : context;
    }
    return _context;
};

const getInvokeContext = () => {
    const ctx = tryGetInvokeContext();
    if (!ctx) {
        throw qError(14);
    }
    return ctx;
};

const useInvokeContext = () => {
    const ctx = tryGetInvokeContext();
    if (!ctx || "qRender" !== ctx.$event$) {
        throw qError(20);
    }
    return assertDefined(ctx.$hostElement$, "invoke: $hostElement$ must be defined", ctx), 
    assertDefined(ctx.$waitOn$, "invoke: $waitOn$ must be defined", ctx), assertDefined(ctx.$renderCtx$, "invoke: $renderCtx$ must be defined", ctx), 
    assertDefined(ctx.$subscriber$, "invoke: $subscriber$ must be defined", ctx), ctx;
};

const useBindInvokeContext = callback => {
    if (null == callback) {
        return callback;
    }
    const ctx = getInvokeContext();
    return (...args) => invoke(ctx, callback.bind(void 0, ...args));
};

function invoke(context, fn, ...args) {
    const previousContext = _context;
    let returnValue;
    try {
        _context = context, returnValue = fn.apply(this, args);
    } finally {
        _context = previousContext;
    }
    return returnValue;
}

const waitAndRun = (ctx, callback) => {
    const waitOn = ctx.$waitOn$;
    if (0 === waitOn.length) {
        const result = callback();
        isPromise(result) && waitOn.push(result);
    } else {
        waitOn.push(Promise.all(waitOn).then(callback));
    }
};

const newInvokeContextFromTuple = context => {
    const element = context[0];
    const container = element.closest("[q\\:container]");
    const locale = container?.getAttribute("q:locale") || void 0;
    return locale && setLocale(locale), newInvokeContext(locale, void 0, element, context[1], context[2]);
};

const newInvokeContext = (locale, hostElement, element, event, url) => {
    const ctx = {
        $seq$: 0,
        $hostElement$: hostElement,
        $element$: element,
        $event$: event,
        $url$: url,
        $locale$: locale,
        $qrl$: void 0,
        $renderCtx$: void 0,
        $subscriber$: void 0,
        $waitOn$: void 0
    };
    return seal(), ctx;
};

const getWrappingContainer = el => el.closest("[q\\:container]");

const untrack = fn => invoke(void 0, fn);

const trackInvocation = /*#__PURE__*/ newInvokeContext(void 0, void 0, void 0, "qRender");

const trackSignal = (signal, sub) => (trackInvocation.$subscriber$ = sub, invoke(trackInvocation, (() => signal.value)));

const _getContextElement = () => {
    const iCtx = tryGetInvokeContext();
    if (iCtx) {
        return iCtx.$element$ ?? iCtx.$hostElement$ ?? iCtx.$qrl$?.$setContainer$(void 0);
    }
};

const _getContextEvent = () => {
    const iCtx = tryGetInvokeContext();
    if (iCtx) {
        return iCtx.$event$;
    }
};

const _jsxBranch = input => {
    const iCtx = tryGetInvokeContext();
    if (iCtx && iCtx.$hostElement$ && iCtx.$renderCtx$) {
        getContext(iCtx.$hostElement$, iCtx.$renderCtx$.$static$.$containerState$).$flags$ |= 8;
    }
    return input;
};

const _waitUntilRendered = elm => {
    const containerEl = getWrappingContainer(elm);
    if (!containerEl) {
        return Promise.resolve();
    }
    return _getContainerState(containerEl).$renderPromise$ ?? Promise.resolve();
};

const useOn = (event, eventQrl) => {
    _useOn(createEventName(event, void 0), eventQrl);
};

const useOnDocument = (event, eventQrl) => {
    _useOn(createEventName(event, "document"), eventQrl);
};

const useOnWindow = (event, eventQrl) => {
    _useOn(createEventName(event, "window"), eventQrl);
};

const createEventName = (event, eventType) => {
    const formattedEventType = void 0 !== eventType ? eventType + ":" : "";
    return Array.isArray(event) ? event.map((e => `${formattedEventType}on-${e}`)) : `${formattedEventType}on-${event}`;
};

const _useOn = (eventName, eventQrl) => {
    if (eventQrl) {
        const invokeCtx = useInvokeContext();
        const elCtx = getContext(invokeCtx.$hostElement$, invokeCtx.$renderCtx$.$static$.$containerState$);
        assertQrl(eventQrl), "string" == typeof eventName ? elCtx.li.push([ normalizeOnProp(eventName), eventQrl ]) : elCtx.li.push(...eventName.map((name => [ normalizeOnProp(name), eventQrl ]))), 
        elCtx.$flags$ |= 2;
    }
};

const SkipRender = Symbol("skip render");

const SSRRaw = () => null;

const SSRComment = props => jsx(SSRRaw, {
    data: `\x3c!--${props.data}--\x3e`
}, null);

const SSRStreamBlock = props => [ jsx(SSRComment, {
    data: "qkssr-pu"
}), props.children, jsx(SSRComment, {
    data: "qkssr-po"
}) ];

const SSRStream = (props, key) => jsx(RenderOnce, {
    children: jsx(InternalSSRStream, props)
}, key);

const SSRHint = () => null;

const InternalSSRStream = () => null;

const useSequentialScope = () => {
    const iCtx = useInvokeContext();
    const i = iCtx.$seq$;
    const elCtx = getContext(iCtx.$hostElement$, iCtx.$renderCtx$.$static$.$containerState$);
    const seq = elCtx.$seq$ ? elCtx.$seq$ : elCtx.$seq$ = [];
    iCtx.$seq$++;
    return {
        get: seq[i],
        set: value => seq[i] = value,
        i,
        iCtx,
        elCtx
    };
};

const setAttribute = (staticCtx, el, prop, value) => {
    staticCtx.$operations$.push({
        $operation$: _setAttribute,
        $args$: [ el, prop, value ]
    });
};

const _setAttribute = (el, prop, value) => {
    if (null == value || !1 === value) {
        el.removeAttribute(prop);
    } else {
        const str = !0 === value ? "" : String(value);
        directSetAttribute(el, prop, str);
    }
};

const setProperty = (staticCtx, node, key, value) => {
    staticCtx.$operations$.push({
        $operation$: _setProperty,
        $args$: [ node, key, value ]
    });
};

const setPropertyPost = (staticCtx, node, key, value) => {
    staticCtx.$postOperations$.push({
        $operation$: _setProperty,
        $args$: [ node, key, value ]
    });
};

const _setProperty = (node, key, value) => {
    try {
        node[key] = null == value ? "" : value, null == value && isNode$1(node) && isElement$1(node) && node.removeAttribute(key);
    } catch (err) {
        logError(codeToText(6), {
            node,
            key,
            value
        }, err);
    }
};

const createElement = (doc, expectTag, isSvg) => isSvg ? doc.createElementNS(SVG_NS, expectTag) : doc.createElement(expectTag);

const insertBefore = (staticCtx, parent, newChild, refChild) => (staticCtx.$operations$.push({
    $operation$: directInsertBefore,
    $args$: [ parent, newChild, refChild || null ]
}), newChild);

const insertAfter = (staticCtx, parent, newChild, refChild) => (staticCtx.$operations$.push({
    $operation$: directInsertAfter,
    $args$: [ parent, newChild, refChild || null ]
}), newChild);

const appendChild = (staticCtx, parent, newChild) => (staticCtx.$operations$.push({
    $operation$: directAppendChild,
    $args$: [ parent, newChild ]
}), newChild);

const appendHeadStyle = (staticCtx, styleTask) => {
    staticCtx.$containerState$.$styleIds$.add(styleTask.styleId), staticCtx.$postOperations$.push({
        $operation$: _appendHeadStyle,
        $args$: [ staticCtx.$containerState$, styleTask ]
    });
};

const _appendHeadStyle = (containerState, styleTask) => {
    const containerEl = containerState.$containerEl$;
    const doc = getDocument(containerEl);
    const isDoc = doc.documentElement === containerEl;
    const headEl = doc.head;
    const style = doc.createElement("style");
    isDoc && !headEl && logWarn("document.head is undefined"), directSetAttribute(style, QStyle, styleTask.styleId), 
    directSetAttribute(style, "hidden", ""), style.textContent = styleTask.content, 
    isDoc && headEl ? directAppendChild(headEl, style) : directInsertBefore(containerEl, style, containerEl.firstChild);
};

const prepend = (staticCtx, parent, newChild) => {
    staticCtx.$operations$.push({
        $operation$: directPrepend,
        $args$: [ parent, newChild ]
    });
};

const directPrepend = (parent, newChild) => {
    directInsertBefore(parent, newChild, parent.firstChild);
};

const removeNode = (staticCtx, el) => {
    if (isQwikElement(el)) {
        cleanupTree(el, staticCtx, staticCtx.$containerState$.$subsManager$, !0);
    }
    staticCtx.$operations$.push({
        $operation$: _removeNode,
        $args$: [ el, staticCtx ]
    });
};

const _removeNode = el => {
    const parent = el.parentElement;
    parent && directRemoveChild(parent, el);
};

const createTemplate = (doc, slotName) => {
    const template = createElement(doc, "q:template", !1);
    return directSetAttribute(template, QSlot, slotName), directSetAttribute(template, "hidden", ""), 
    directSetAttribute(template, "aria-hidden", "true"), template;
};

const executeDOMRender = staticCtx => {
    for (const op of staticCtx.$operations$) {
        op.$operation$.apply(void 0, op.$args$);
    }
    resolveSlotProjection(staticCtx);
};

const getKey = el => directGetAttribute(el, "q:key");

const setKey = (el, key) => {
    null !== key && directSetAttribute(el, "q:key", key);
};

const resolveSlotProjection = staticCtx => {
    const subsManager = staticCtx.$containerState$.$subsManager$;
    for (const slotEl of staticCtx.$rmSlots$) {
        const key = getKey(slotEl);
        assertDefined(key, "slots must have a key");
        const slotChildren = getChildren(slotEl, isChildComponent);
        if (slotChildren.length > 0) {
            const sref = slotEl.getAttribute("q:sref");
            const hostCtx = staticCtx.$roots$.find((r => r.$id$ === sref));
            if (hostCtx) {
                const hostElm = hostCtx.$element$;
                if (hostElm.isConnected) {
                    if (getChildren(hostElm, isSlotTemplate).some((node => directGetAttribute(node, QSlot) === key))) {
                        cleanupTree(slotEl, staticCtx, subsManager, !1);
                    } else {
                        const template = createTemplate(staticCtx.$doc$, key);
                        for (const child of slotChildren) {
                            directAppendChild(template, child);
                        }
                        directInsertBefore(hostElm, template, hostElm.firstChild);
                    }
                } else {
                    cleanupTree(slotEl, staticCtx, subsManager, !1);
                }
            } else {
                cleanupTree(slotEl, staticCtx, subsManager, !1);
            }
        }
    }
    for (const [slotEl, hostElm] of staticCtx.$addSlots$) {
        const key = getKey(slotEl);
        assertDefined(key, "slots must have a key");
        const template = getChildren(hostElm, isSlotTemplate).find((node => node.getAttribute(QSlot) === key));
        template && (getChildren(template, isChildComponent).forEach((child => {
            directAppendChild(slotEl, child);
        })), template.remove());
    }
};

const printRenderStats = () => {
    qDev;
};

const VIRTUAL_SYMBOL = "__virtual";

const newVirtualElement = (doc, isSvg) => {
    const open = doc.createComment("qv ");
    const close = doc.createComment("/qv");
    return new VirtualElementImpl(open, close, isSvg);
};

const parseVirtualAttributes = str => {
    if (!str) {
        return {};
    }
    const attributes = str.split(" ");
    return Object.fromEntries(attributes.map((attr => {
        const index = attr.indexOf("=");
        return index >= 0 ? [ attr.slice(0, index), unescape(attr.slice(index + 1)) ] : [ attr, "" ];
    })));
};

const serializeVirtualAttributes = map => {
    const attributes = [];
    return Object.entries(map).forEach((([key, value]) => {
        attributes.push(value ? `${key}=${escape(value)}` : `${key}`);
    })), attributes.join(" ");
};

const SHOW_COMMENT = 128;

const FILTER_ACCEPT = 1;

const FILTER_REJECT = 2;

const walkerVirtualByAttribute = (el, prop, value) => el.ownerDocument.createTreeWalker(el, 128, {
    acceptNode(c) {
        const virtual = getVirtualElement(c);
        return virtual && directGetAttribute(virtual, prop) === value ? 1 : 2;
    }
});

const queryAllVirtualByAttribute = (el, prop, value) => {
    const walker = walkerVirtualByAttribute(el, prop, value);
    const pars = [];
    let currentNode = null;
    for (;currentNode = walker.nextNode(); ) {
        pars.push(getVirtualElement(currentNode));
    }
    return pars;
};

const escape = s => s.replace(/ /g, "+");

const unescape = s => s.replace(/\+/g, " ");

const VIRTUAL = ":virtual";

class VirtualElementImpl {
    constructor(open, close, isSvg) {
        this.open = open, this.close = close, this.isSvg = isSvg, this._qc_ = null, this.nodeType = 111, 
        this.localName = VIRTUAL, this.nodeName = VIRTUAL;
        const doc = this.ownerDocument = open.ownerDocument;
        this.$template$ = createElement(doc, "template", !1), this.$attributes$ = parseVirtualAttributes(open.data.slice(3)), 
        assertTrue(open.data.startsWith("qv "), "comment is not a qv"), open.__virtual = this, 
        seal();
    }
    insertBefore(node, ref) {
        const parent = this.parentElement;
        if (parent) {
            parent.insertBefore(node, ref || this.close);
        } else {
            this.$template$.insertBefore(node, ref);
        }
        return node;
    }
    remove() {
        const parent = this.parentElement;
        if (parent) {
            const ch = this.childNodes;
            assertEqual(this.$template$.childElementCount, 0, "children should be empty"), parent.removeChild(this.open), 
            this.$template$.append(...ch), parent.removeChild(this.close);
        }
    }
    appendChild(node) {
        return this.insertBefore(node, null);
    }
    insertBeforeTo(newParent, child) {
        const ch = this.childNodes;
        newParent.insertBefore(this.open, child);
        for (const c of ch) {
            newParent.insertBefore(c, child);
        }
        newParent.insertBefore(this.close, child), assertEqual(this.$template$.childElementCount, 0, "children should be empty");
    }
    appendTo(newParent) {
        this.insertBeforeTo(newParent, null);
    }
    get namespaceURI() {
        return this.parentElement?.namespaceURI ?? "";
    }
    removeChild(child) {
        this.parentElement ? this.parentElement.removeChild(child) : this.$template$.removeChild(child);
    }
    getAttribute(prop) {
        return this.$attributes$[prop] ?? null;
    }
    hasAttribute(prop) {
        return prop in this.$attributes$;
    }
    setAttribute(prop, value) {
        this.$attributes$[prop] = value, this.open.data = updateComment(this.$attributes$);
    }
    removeAttribute(prop) {
        delete this.$attributes$[prop], this.open.data = updateComment(this.$attributes$);
    }
    matches(_) {
        return !1;
    }
    compareDocumentPosition(other) {
        return this.open.compareDocumentPosition(other);
    }
    closest(query) {
        const parent = this.parentElement;
        return parent ? parent.closest(query) : null;
    }
    querySelectorAll(query) {
        const result = [];
        return getChildren(this, isNodeElement).forEach((el => {
            isQwikElement(el) && (el.matches(query) && result.push(el), result.concat(Array.from(el.querySelectorAll(query))));
        })), result;
    }
    querySelector(query) {
        for (const el of this.childNodes) {
            if (isElement$1(el)) {
                if (el.matches(query)) {
                    return el;
                }
                const v = el.querySelector(query);
                if (null !== v) {
                    return v;
                }
            }
        }
        return null;
    }
    get innerHTML() {
        return "";
    }
    set innerHTML(html) {
        const parent = this.parentElement;
        parent ? (this.childNodes.forEach((a => this.removeChild(a))), this.$template$.innerHTML = html, 
        parent.insertBefore(this.$template$.content, this.close)) : this.$template$.innerHTML = html;
    }
    get firstChild() {
        if (this.parentElement) {
            const first = this.open.nextSibling;
            return first === this.close ? null : first;
        }
        return this.$template$.firstChild;
    }
    get nextSibling() {
        return this.close.nextSibling;
    }
    get previousSibling() {
        return this.open.previousSibling;
    }
    get childNodes() {
        if (!this.parentElement) {
            return Array.from(this.$template$.childNodes);
        }
        const nodes = [];
        let node = this.open;
        for (;(node = node.nextSibling) && node !== this.close; ) {
            nodes.push(node);
        }
        return nodes;
    }
    get isConnected() {
        return this.open.isConnected;
    }
    get parentElement() {
        return this.open.parentElement;
    }
}

const updateComment = attributes => `qv ${serializeVirtualAttributes(attributes)}`;

const processVirtualNodes = node => {
    if (null == node) {
        return null;
    }
    if (isComment(node)) {
        const virtual = getVirtualElement(node);
        if (virtual) {
            return virtual;
        }
    }
    return node;
};

const getVirtualElement = open => {
    const virtual = open.__virtual;
    if (virtual) {
        return virtual;
    }
    if (open.data.startsWith("qv ")) {
        const close = findClose(open);
        return new VirtualElementImpl(open, close, open.parentElement?.namespaceURI === SVG_NS);
    }
    return null;
};

const findClose = open => {
    let node = open.nextSibling;
    let stack = 1;
    for (;node; ) {
        if (isComment(node)) {
            if (node.data.startsWith("qv ")) {
                stack++;
            } else if ("/qv" === node.data && (stack--, 0 === stack)) {
                return node;
            }
        }
        node = node.nextSibling;
    }
    assertFail("close not found");
};

const getRootNode = node => null == node ? null : isVirtualElement(node) ? node.open : node;

const createContextId = name => (assertTrue(/^[\w/.-]+$/.test(name), "Context name must only contain A-Z,a-z,0-9, _", name), 
/*#__PURE__*/ Object.freeze({
    id: fromCamelToKebabCase(name)
}));

const useContextProvider = (context, newValue) => {
    const {get, set, elCtx} = useSequentialScope();
    if (void 0 !== get) {
        return;
    }
    let contexts = elCtx.$contexts$;
    contexts || (elCtx.$contexts$ = contexts = new Map), contexts.set(context.id, newValue), 
    set(!0);
};

const useContext = (context, defaultValue) => {
    const {get, set, iCtx, elCtx} = useSequentialScope();
    if (void 0 !== get) {
        return get;
    }
    const value = resolveContext(context, elCtx, iCtx.$renderCtx$.$static$.$containerState$);
    if ("function" == typeof defaultValue) {
        return set(invoke(void 0, defaultValue, value));
    }
    if (void 0 !== value) {
        return set(value);
    }
    if (void 0 !== defaultValue) {
        return set(defaultValue);
    }
    throw qError(13, context.id);
};

const resolveContext = (context, hostCtx, containerState) => {
    const contextID = context.id;
    if (hostCtx) {
        let hostElement = hostCtx.$element$;
        let ctx = hostCtx.$slotParent$ ?? hostCtx.$parent$;
        for (;ctx; ) {
            if (hostElement = ctx.$element$, ctx.$contexts$) {
                const found = ctx.$contexts$.get(contextID);
                if (found) {
                    return found;
                }
                if (!0 === ctx.$contexts$.get("_")) {
                    break;
                }
            }
            ctx = ctx.$slotParent$ ?? ctx.$parent$;
        }
        if (hostElement.closest) {
            const value = queryContextFromDom(hostElement, containerState, contextID);
            if (void 0 !== value) {
                return value;
            }
        }
    }
};

const queryContextFromDom = (hostElement, containerState, contextId) => {
    let element = hostElement;
    for (;element; ) {
        let node = element;
        let virtual;
        for (;node && (virtual = findVirtual(node)); ) {
            const contexts = getContext(virtual, containerState)?.$contexts$;
            if (contexts && contexts.has(contextId)) {
                return contexts.get(contextId);
            }
            node = virtual;
        }
        element = element.parentElement;
    }
};

const findVirtual = el => {
    let node = el;
    let stack = 1;
    for (;node = node.previousSibling; ) {
        if (isComment(node)) {
            if ("/qv" === node.data) {
                stack++;
            } else if (node.data.startsWith("qv ") && (stack--, 0 === stack)) {
                return getVirtualElement(node);
            }
        }
    }
    return null;
};

const validateContext = context => {
    if (!isObject(context) || "string" != typeof context.id || 0 === context.id.length) {
        throw qError(28, context);
    }
};

const ERROR_CONTEXT = /*#__PURE__*/ createContextId("qk-error");

const handleError = (err, hostElement, rCtx) => {
    const elCtx = tryGetContext(hostElement);
    if (isServerPlatform()) {
        throw err;
    }
    {
        const errorStore = resolveContext(ERROR_CONTEXT, elCtx, rCtx.$static$.$containerState$);
        if (void 0 === errorStore) {
            throw err;
        }
        errorStore.error = err;
    }
};

const isRecoverable = err => !(err && err instanceof Error && "plugin" in err);

const executeComponent = (rCtx, elCtx) => {
    elCtx.$flags$ &= -2, elCtx.$flags$ |= 4, elCtx.$slots$ = [], elCtx.li.length = 0;
    const hostElement = elCtx.$element$;
    const componentQRL = elCtx.$componentQrl$;
    const props = elCtx.$props$;
    const newCtx = pushRenderContext(rCtx);
    const iCtx = newInvokeContext(rCtx.$static$.$locale$, hostElement, void 0, "qRender");
    const waitOn = iCtx.$waitOn$ = [];
    assertDefined(componentQRL, "render: host element to render must has a $renderQrl$:", elCtx), 
    assertDefined(props, "render: host element to render must has defined props", elCtx), 
    newCtx.$cmpCtx$ = elCtx, newCtx.$slotCtx$ = null, iCtx.$subscriber$ = [ 0, hostElement ], 
    iCtx.$renderCtx$ = rCtx, componentQRL.$setContainer$(rCtx.$static$.$containerState$.$containerEl$);
    const componentFn = componentQRL.getFn(iCtx);
    return safeCall((() => componentFn(props)), (jsxNode => waitOn.length > 0 ? Promise.all(waitOn).then((() => 1 & elCtx.$flags$ ? executeComponent(rCtx, elCtx) : {
        node: jsxNode,
        rCtx: newCtx
    })) : 1 & elCtx.$flags$ ? executeComponent(rCtx, elCtx) : {
        node: jsxNode,
        rCtx: newCtx
    }), (err => err === SignalUnassignedException ? Promise.all(waitOn).then((() => executeComponent(rCtx, elCtx))) : (handleError(err, hostElement, rCtx), 
    {
        node: SkipRender,
        rCtx: newCtx
    })));
};

const createRenderContext = (doc, containerState) => {
    const ctx = {
        $static$: {
            $doc$: doc,
            $locale$: containerState.$serverData$.locale,
            $containerState$: containerState,
            $hostElements$: new Set,
            $operations$: [],
            $postOperations$: [],
            $roots$: [],
            $addSlots$: [],
            $rmSlots$: [],
            $visited$: []
        },
        $cmpCtx$: null,
        $slotCtx$: null
    };
    return seal(), seal(), ctx;
};

const pushRenderContext = ctx => ({
    $static$: ctx.$static$,
    $cmpCtx$: ctx.$cmpCtx$,
    $slotCtx$: ctx.$slotCtx$
});

const serializeClassWithHost = (obj, hostCtx) => hostCtx && hostCtx.$scopeIds$ ? hostCtx.$scopeIds$.join(" ") + " " + serializeClass(obj) : serializeClass(obj);

const serializeClass = obj => obj ? isString(obj) ? obj.trim() : isArray(obj) ? obj.reduce(((result, o) => {
    const classList = serializeClass(o);
    return classList ? result ? `${result} ${classList}` : classList : result;
}), "") : Object.entries(obj).reduce(((result, [key, value]) => value ? result ? `${result} ${key.trim()}` : key.trim() : result), "") : "";

const stringifyStyle = obj => {
    if (null == obj) {
        return "";
    }
    if ("object" == typeof obj) {
        if (isArray(obj)) {
            throw qError(0, obj, "style");
        }
        {
            const chunks = [];
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (null != value) {
                        const normalizedKey = key.startsWith("--") ? key : fromCamelToKebabCase(key);
                        chunks.push(normalizedKey + ":" + value);
                    }
                }
            }
            return chunks.join(";");
        }
    }
    return String(obj);
};

const getNextIndex = ctx => intToStr(ctx.$static$.$containerState$.$elementIndex$++);

const setQId = (rCtx, elCtx) => {
    const id = getNextIndex(rCtx);
    elCtx.$id$ = id;
};

const jsxToString = data => isSignal(data) ? jsxToString(data.value) : null == data || "boolean" == typeof data ? "" : String(data);

function isAriaAttribute(prop) {
    return prop.startsWith("aria-");
}

const shouldWrapFunctional = (res, node) => !!node.key && (!isJSXNode(res) || !isFunction(res.type) && res.key != node.key);

const static_listeners = 1;

const static_subtree = 2;

const dangerouslySetInnerHTML = "dangerouslySetInnerHTML";

const version = "1.1.5-dev20230620194537";

const hashCode = (text, hash = 0) => {
    if (0 === text.length) {
        return hash;
    }
    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i), hash |= 0;
    }
    return Number(Math.abs(hash)).toString(36);
};

const styleKey = (qStyles, index) => (assertQrl(qStyles), `${hashCode(qStyles.$hash$)}-${index}`);

const styleContent = styleId => "⭐️" + styleId;

const serializeSStyle = scopeIds => {
    const value = scopeIds.join("|");
    if (value.length > 0) {
        return value;
    }
};

var _a;

const FLUSH_COMMENT = "\x3c!--qkssr-f--\x3e";

const IS_HEAD$1 = 1;

const IS_HTML = 4;

const IS_TEXT = 8;

const IS_INVISIBLE = 16;

const IS_PHASING = 32;

const IS_ANCHOR = 64;

const IS_BUTTON = 128;

const IS_TABLE = 256;

const IS_PHRASING_CONTAINER = 512;

const IS_IMMUTABLE$1 = 1024;

class MockElement {
    constructor(nodeType) {
        this.nodeType = nodeType, this[_a] = null, seal();
    }
}

_a = Q_CTX;

const createDocument = () => new MockElement(9);

const _renderSSR = async (node, opts) => {
    const root = opts.containerTagName;
    const containerEl = createSSRContext(1).$element$;
    const containerState = createContainerState(containerEl, opts.base ?? "/");
    containerState.$serverData$.locale = opts.serverData?.locale;
    const doc = new MockElement(9);
    const rCtx = createRenderContext(doc, containerState);
    const headNodes = opts.beforeContent ?? [];
    const ssrCtx = {
        $static$: {
            $contexts$: [],
            $headNodes$: "html" === root ? headNodes : [],
            $locale$: opts.serverData?.locale,
            $textNodes$: new Map
        },
        $projectedChildren$: void 0,
        $projectedCtxs$: void 0,
        $invocationContext$: void 0
    };
    seal();
    let qRender = "ssr";
    opts.containerAttributes["q:render"] && (qRender = `${opts.containerAttributes["q:render"]}-${qRender}`);
    const containerAttributes = {
        ...opts.containerAttributes,
        "q:container": "paused",
        "q:version": version ?? "dev",
        "q:render": qRender,
        "q:base": opts.base,
        "q:locale": opts.serverData?.locale
    };
    const children = "html" === root ? [ node ] : [ headNodes, node ];
    "html" !== root && (containerAttributes.class = "qc📦" + (containerAttributes.class ? " " + containerAttributes.class : "")), 
    opts.serverData && (containerState.$serverData$ = opts.serverData), node = _jsxQ(root, null, containerAttributes, children, 3, null), 
    containerState.$hostsRendering$ = new Set, await Promise.resolve().then((() => renderRoot$1(node, rCtx, ssrCtx, opts.stream, containerState, opts)));
};

const renderRoot$1 = async (node, rCtx, ssrCtx, stream, containerState, opts) => {
    const beforeClose = opts.beforeClose;
    return await renderNode(node, rCtx, ssrCtx, stream, 0, beforeClose ? stream => {
        const result = beforeClose(ssrCtx.$static$.$contexts$, containerState, !1, ssrCtx.$static$.$textNodes$);
        return processData$1(result, rCtx, ssrCtx, stream, 0, void 0);
    } : void 0), rCtx;
};

const renderGenerator = async (node, rCtx, ssrCtx, stream, flags) => {
    stream.write(FLUSH_COMMENT);
    const generator = node.props.children;
    let value;
    if (isFunction(generator)) {
        const v = generator({
            write(chunk) {
                stream.write(chunk), stream.write(FLUSH_COMMENT);
            }
        });
        if (isPromise(v)) {
            return v;
        }
        value = v;
    } else {
        value = generator;
    }
    for await (const chunk of value) {
        await processData$1(chunk, rCtx, ssrCtx, stream, flags, void 0), stream.write(FLUSH_COMMENT);
    }
};

const renderNodeVirtual = (node, elCtx, extraNodes, rCtx, ssrCtx, stream, flags, beforeClose) => {
    const props = node.props;
    const renderQrl = props["q:renderFn"];
    if (renderQrl) {
        return elCtx.$componentQrl$ = renderQrl, renderSSRComponent(rCtx, ssrCtx, stream, elCtx, node, flags, beforeClose);
    }
    let virtualComment = "\x3c!--qv" + renderVirtualAttributes(props);
    const isSlot = "q:s" in props;
    const key = null != node.key ? String(node.key) : null;
    isSlot && (assertDefined(rCtx.$cmpCtx$?.$id$, "hostId must be defined for a slot"), 
    virtualComment += " q:sref=" + rCtx.$cmpCtx$.$id$), null != key && (virtualComment += " q:key=" + key), 
    virtualComment += "--\x3e", stream.write(virtualComment);
    const html = node.props[dangerouslySetInnerHTML];
    if (html) {
        return stream.write(html), void stream.write(CLOSE_VIRTUAL);
    }
    if (extraNodes) {
        for (const node of extraNodes) {
            renderNodeElementSync(node.type, node.props, stream);
        }
    }
    const promise = walkChildren(node.children, rCtx, ssrCtx, stream, flags);
    return then(promise, (() => {
        if (!isSlot && !beforeClose) {
            return void stream.write(CLOSE_VIRTUAL);
        }
        let promise;
        if (isSlot) {
            assertDefined(key, "key must be defined for a slot");
            const content = ssrCtx.$projectedChildren$?.[key];
            if (content) {
                const [rCtx, sCtx] = ssrCtx.$projectedCtxs$;
                const newSlotRctx = pushRenderContext(rCtx);
                newSlotRctx.$slotCtx$ = elCtx, ssrCtx.$projectedChildren$[key] = void 0, promise = processData$1(content, newSlotRctx, sCtx, stream, flags);
            }
        }
        return beforeClose && (promise = then(promise, (() => beforeClose(stream)))), then(promise, (() => {
            stream.write(CLOSE_VIRTUAL);
        }));
    }));
};

const CLOSE_VIRTUAL = "\x3c!--/qv--\x3e";

const renderAttributes = attributes => {
    let text = "";
    for (const prop in attributes) {
        if (prop === dangerouslySetInnerHTML) {
            continue;
        }
        const value = attributes[prop];
        null != value && (text += " " + ("" === value ? prop : prop + '="' + value + '"'));
    }
    return text;
};

const renderVirtualAttributes = attributes => {
    let text = "";
    for (const prop in attributes) {
        if ("children" === prop || prop === dangerouslySetInnerHTML) {
            continue;
        }
        const value = attributes[prop];
        null != value && (text += " " + ("" === value ? prop : prop + "=" + value));
    }
    return text;
};

const renderNodeElementSync = (tagName, attributes, stream) => {
    stream.write("<" + tagName + renderAttributes(attributes) + ">");
    if (!!emptyElements[tagName]) {
        return;
    }
    const innerHTML = attributes[dangerouslySetInnerHTML];
    null != innerHTML && stream.write(innerHTML), stream.write(`</${tagName}>`);
};

const renderSSRComponent = (rCtx, ssrCtx, stream, elCtx, node, flags, beforeClose) => (setComponentProps$1(rCtx, elCtx, node.props.props), 
then(executeComponent(rCtx, elCtx), (res => {
    const hostElement = elCtx.$element$;
    const newRCtx = res.rCtx;
    const iCtx = newInvokeContext(ssrCtx.$static$.$locale$, hostElement, void 0);
    iCtx.$subscriber$ = [ 0, hostElement ], iCtx.$renderCtx$ = newRCtx;
    const newSSrContext = {
        $static$: ssrCtx.$static$,
        $projectedChildren$: splitProjectedChildren(node.children, ssrCtx),
        $projectedCtxs$: [ rCtx, ssrCtx ],
        $invocationContext$: iCtx
    };
    const extraNodes = [];
    if (elCtx.$appendStyles$) {
        const array = !!(4 & flags) ? ssrCtx.$static$.$headNodes$ : extraNodes;
        for (const style of elCtx.$appendStyles$) {
            array.push(_jsxQ("style", {
                [QStyle]: style.styleId,
                [dangerouslySetInnerHTML]: style.content,
                hidden: ""
            }, null, null, 0, null));
        }
    }
    const newID = getNextIndex(rCtx);
    const scopeId = elCtx.$scopeIds$ ? serializeSStyle(elCtx.$scopeIds$) : void 0;
    const processedNode = _jsxC(node.type, {
        "q:sstyle": scopeId,
        "q:id": newID,
        children: res.node
    }, 0, node.key);
    return elCtx.$id$ = newID, ssrCtx.$static$.$contexts$.push(elCtx), renderNodeVirtual(processedNode, elCtx, extraNodes, newRCtx, newSSrContext, stream, flags, (stream => {
        if (2 & elCtx.$flags$) {
            const placeholderCtx = createSSRContext(1);
            const listeners = placeholderCtx.li;
            listeners.push(...elCtx.li), elCtx.$flags$ &= -3, placeholderCtx.$id$ = getNextIndex(rCtx);
            const attributes = {
                type: "placeholder",
                hidden: "",
                "q:id": placeholderCtx.$id$
            };
            ssrCtx.$static$.$contexts$.push(placeholderCtx);
            const groups = groupListeners(listeners);
            for (const listener of groups) {
                const eventName = normalizeInvisibleEvents(listener[0]);
                attributes[eventName] = serializeQRLs(listener[1], placeholderCtx), registerQwikEvent$1(eventName, rCtx.$static$.$containerState$);
            }
            renderNodeElementSync("script", attributes, stream);
        }
        return beforeClose ? then(renderQTemplates(rCtx, newSSrContext, ssrCtx, stream), (() => beforeClose(stream))) : renderQTemplates(rCtx, newSSrContext, ssrCtx, stream);
    }));
})));

const renderQTemplates = (rCtx, ssrCtx, parentSSRCtx, stream) => {
    const projectedChildren = ssrCtx.$projectedChildren$;
    if (projectedChildren) {
        const nodes = Object.keys(projectedChildren).map((slotName => {
            const value = projectedChildren[slotName];
            if (value) {
                return _jsxQ("q:template", {
                    [QSlot]: slotName,
                    hidden: "",
                    "aria-hidden": "true"
                }, null, value, 0, null);
            }
        }));
        return processData$1(nodes, rCtx, parentSSRCtx, stream, 0, void 0);
    }
};

const splitProjectedChildren = (children, ssrCtx) => {
    const flatChildren = flatVirtualChildren(children, ssrCtx);
    if (null === flatChildren) {
        return;
    }
    const slotMap = {};
    for (const child of flatChildren) {
        let slotName = "";
        isJSXNode(child) && (slotName = child.props[QSlot] ?? "");
        let array = slotMap[slotName];
        array || (slotMap[slotName] = array = []), array.push(child);
    }
    return slotMap;
};

const createSSRContext = nodeType => {
    const elm = new MockElement(nodeType);
    return createContext(elm);
};

const renderNode = (node, rCtx, ssrCtx, stream, flags, beforeClose) => {
    const tagName = node.type;
    const hostCtx = rCtx.$cmpCtx$;
    if ("string" == typeof tagName) {
        const key = node.key;
        const props = node.props;
        const immutable = node.immutableProps;
        const elCtx = createSSRContext(1);
        const elm = elCtx.$element$;
        const isHead = "head" === tagName;
        let openingElement = "<" + tagName;
        let useSignal = !1;
        let hasRef = !1;
        let classStr = "";
        let htmlStr = null;
        if (assertElement(elm), immutable) {
            for (const prop in immutable) {
                let value = immutable[prop];
                if (isOnProp(prop)) {
                    setEvent(elCtx.li, prop, value, void 0);
                    continue;
                }
                const attrName = processPropKey(prop);
                if (isSignal(value) && (assertDefined(hostCtx, "Signals can not be used outside the root"), 
                value = trackSignal(value, [ 1, elm, value, hostCtx.$element$, attrName ]), useSignal = !0), 
                prop === dangerouslySetInnerHTML) {
                    htmlStr = value;
                    continue;
                }
                prop.startsWith(PREVENT_DEFAULT) && registerQwikEvent$1(prop.slice(15), rCtx.$static$.$containerState$);
                const attrValue = processPropValue(attrName, value);
                null != attrValue && ("class" === attrName ? classStr = attrValue : "value" === attrName && "textarea" === tagName ? htmlStr = escapeHtml(attrValue) : isSSRUnsafeAttr(attrName) || (openingElement += " " + ("" === value ? attrName : attrName + '="' + escapeAttr(attrValue) + '"')));
            }
        }
        for (const prop in props) {
            let value = props[prop];
            if ("ref" === prop) {
                void 0 !== value && (setRef(value, elm), hasRef = !0);
                continue;
            }
            if (isOnProp(prop)) {
                setEvent(elCtx.li, prop, value, void 0);
                continue;
            }
            const attrName = processPropKey(prop);
            if (isSignal(value) && (assertDefined(hostCtx, "Signals can not be used outside the root"), 
            value = trackSignal(value, [ 2, hostCtx.$element$, value, elm, attrName ]), useSignal = !0), 
            prop === dangerouslySetInnerHTML) {
                htmlStr = value;
                continue;
            }
            prop.startsWith(PREVENT_DEFAULT) && registerQwikEvent$1(prop.slice(15), rCtx.$static$.$containerState$);
            const attrValue = processPropValue(attrName, value);
            null != attrValue && ("class" === attrName ? classStr = attrValue : "value" === attrName && "textarea" === tagName ? htmlStr = escapeHtml(attrValue) : isSSRUnsafeAttr(attrName) || (openingElement += " " + ("" === value ? attrName : attrName + '="' + escapeAttr(attrValue) + '"')));
        }
        const listeners = elCtx.li;
        if (hostCtx) {
            if (hostCtx.$scopeIds$?.length) {
                const extra = hostCtx.$scopeIds$.join(" ");
                classStr = classStr ? `${extra} ${classStr}` : extra;
            }
            2 & hostCtx.$flags$ && (listeners.push(...hostCtx.li), hostCtx.$flags$ &= -3);
        }
        if (isHead && (flags |= 1), tagName in invisibleElements && (flags |= 16), tagName in textOnlyElements && (flags |= 8), 
        classStr && (openingElement += ' class="' + escapeAttr(classStr) + '"'), listeners.length > 0) {
            const groups = groupListeners(listeners);
            const isInvisible = 0 != (16 & flags);
            for (const listener of groups) {
                const eventName = isInvisible ? normalizeInvisibleEvents(listener[0]) : listener[0];
                openingElement += " " + eventName + '="' + serializeQRLs(listener[1], elCtx) + '"', 
                registerQwikEvent$1(eventName, rCtx.$static$.$containerState$);
            }
        }
        if (null != key && (openingElement += ' q:key="' + escapeAttr(key) + '"'), hasRef || useSignal || listeners.length > 0) {
            if (hasRef || useSignal || listenersNeedId(listeners)) {
                const newID = getNextIndex(rCtx);
                openingElement += ' q:id="' + newID + '"', elCtx.$id$ = newID;
            }
            ssrCtx.$static$.$contexts$.push(elCtx);
        }
        if (1 & flags && (openingElement += " q:head"), openingElement += ">", stream.write(openingElement), 
        tagName in emptyElements) {
            return;
        }
        if (null != htmlStr) {
            return stream.write(String(htmlStr)), void stream.write(`</${tagName}>`);
        }
        "html" === tagName ? flags |= 4 : flags &= -5, 2 & node.flags && (flags |= 1024);
        const promise = processData$1(node.children, rCtx, ssrCtx, stream, flags);
        return then(promise, (() => {
            if (isHead) {
                for (const node of ssrCtx.$static$.$headNodes$) {
                    renderNodeElementSync(node.type, node.props, stream);
                }
                ssrCtx.$static$.$headNodes$.length = 0;
            }
            if (beforeClose) {
                return then(beforeClose(stream), (() => {
                    stream.write(`</${tagName}>`);
                }));
            }
            stream.write(`</${tagName}>`);
        }));
    }
    if (tagName === Virtual) {
        const elCtx = createSSRContext(111);
        return elCtx.$parent$ = rCtx.$cmpCtx$, elCtx.$slotParent$ = rCtx.$slotCtx$, hostCtx && 8 & hostCtx.$flags$ && addDynamicSlot(hostCtx, elCtx), 
        renderNodeVirtual(node, elCtx, void 0, rCtx, ssrCtx, stream, flags, beforeClose);
    }
    if (tagName === SSRRaw) {
        return void stream.write(node.props.data);
    }
    if (tagName === InternalSSRStream) {
        return renderGenerator(node, rCtx, ssrCtx, stream, flags);
    }
    const res = invoke(ssrCtx.$invocationContext$, tagName, node.props, node.key, node.flags, node.dev);
    return shouldWrapFunctional(res, node) ? renderNode(_jsxC(Virtual, {
        children: res
    }, 0, node.key), rCtx, ssrCtx, stream, flags, beforeClose) : processData$1(res, rCtx, ssrCtx, stream, flags, beforeClose);
};

const processData$1 = (node, rCtx, ssrCtx, stream, flags, beforeClose) => {
    if (null != node && "boolean" != typeof node) {
        if (!isString(node) && "number" != typeof node) {
            if (isJSXNode(node)) {
                return renderNode(node, rCtx, ssrCtx, stream, flags, beforeClose);
            }
            if (isArray(node)) {
                return walkChildren(node, rCtx, ssrCtx, stream, flags);
            }
            if (isSignal(node)) {
                const insideText = 8 & flags;
                const hostEl = rCtx.$cmpCtx$?.$element$;
                let value;
                if (hostEl) {
                    if (!insideText) {
                        const id = getNextIndex(rCtx);
                        value = trackSignal(node, 1024 & flags ? [ 3, "#" + id, node, "#" + id ] : [ 4, hostEl, node, "#" + id ]);
                        const str = jsxToString(value);
                        return ssrCtx.$static$.$textNodes$.set(str, id), void stream.write(`\x3c!--t=${id}--\x3e${escapeHtml(str)}\x3c!----\x3e`);
                    }
                    value = invoke(ssrCtx.$invocationContext$, (() => node.value));
                }
                return void stream.write(escapeHtml(jsxToString(value)));
            }
            return isPromise(node) ? (stream.write(FLUSH_COMMENT), node.then((node => processData$1(node, rCtx, ssrCtx, stream, flags, beforeClose)))) : void logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
        }
        stream.write(escapeHtml(String(node)));
    }
};

const walkChildren = (children, rCtx, ssrContext, stream, flags) => {
    if (null == children) {
        return;
    }
    if (!isArray(children)) {
        return processData$1(children, rCtx, ssrContext, stream, flags);
    }
    const len = children.length;
    if (1 === len) {
        return processData$1(children[0], rCtx, ssrContext, stream, flags);
    }
    if (0 === len) {
        return;
    }
    let currentIndex = 0;
    const buffers = [];
    return children.reduce(((prevPromise, child, index) => {
        const buffer = [];
        buffers.push(buffer);
        const rendered = processData$1(child, rCtx, ssrContext, prevPromise ? {
            write(chunk) {
                currentIndex === index ? stream.write(chunk) : buffer.push(chunk);
            }
        } : stream, flags);
        const next = () => {
            currentIndex++, buffers.length > currentIndex && buffers[currentIndex].forEach((chunk => stream.write(chunk)));
        };
        return isPromise(rendered) && prevPromise ? Promise.all([ rendered, prevPromise ]).then(next) : isPromise(rendered) ? rendered.then(next) : prevPromise ? prevPromise.then(next) : void currentIndex++;
    }), void 0);
};

const flatVirtualChildren = (children, ssrCtx) => {
    if (null == children) {
        return null;
    }
    const result = _flatVirtualChildren(children, ssrCtx);
    const nodes = isArray(result) ? result : [ result ];
    return 0 === nodes.length ? null : nodes;
};

const _flatVirtualChildren = (children, ssrCtx) => {
    if (null == children) {
        return null;
    }
    if (isArray(children)) {
        return children.flatMap((c => _flatVirtualChildren(c, ssrCtx)));
    }
    if (isJSXNode(children) && isFunction(children.type) && children.type !== SSRRaw && children.type !== InternalSSRStream && children.type !== Virtual) {
        const res = invoke(ssrCtx.$invocationContext$, children.type, children.props, children.key, children.flags);
        return flatVirtualChildren(res, ssrCtx);
    }
    return children;
};

const setComponentProps$1 = (rCtx, elCtx, expectProps) => {
    const keys = Object.keys(expectProps);
    const target = createPropsState();
    if (elCtx.$props$ = createProxy(target, rCtx.$static$.$containerState$), 0 === keys.length) {
        return;
    }
    const immutableMeta = target[_IMMUTABLE] = expectProps[_IMMUTABLE] ?? EMPTY_OBJ;
    for (const prop of keys) {
        "children" !== prop && prop !== QSlot && (isSignal(immutableMeta[prop]) ? target["$$" + prop] = immutableMeta[prop] : target[prop] = expectProps[prop]);
    }
};

const processPropKey = prop => "htmlFor" === prop ? "for" : prop;

const processPropValue = (prop, value) => "class" === prop ? serializeClass(value) : "style" === prop ? stringifyStyle(value) : isAriaAttribute(prop) || "draggable" === prop || "spellcheck" === prop ? null != value ? String(value) : value : !1 === value || null == value ? null : !0 === value ? "" : String(value);

const invisibleElements = {
    head: !0,
    style: !0,
    script: !0,
    link: !0,
    meta: !0
};

const textOnlyElements = {
    title: !0,
    style: !0,
    script: !0,
    noframes: !0,
    textarea: !0
};

const emptyElements = {
    area: !0,
    base: !0,
    basefont: !0,
    bgsound: !0,
    br: !0,
    col: !0,
    embed: !0,
    frame: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
};

const startPhasingContent = {
    p: !0,
    pre: !0
};

const htmlContent = {
    head: !0,
    body: !0
};

const tableContent = {
    tbody: !0,
    thead: !0,
    tfoot: !0,
    caption: !0,
    colgroup: !0
};

const headContent = {
    meta: !0,
    title: !0,
    link: !0,
    style: !0,
    script: !0,
    noscript: !0,
    template: !0,
    base: !0
};

const phasingContent = {
    a: !0,
    abbr: !0,
    area: !0,
    audio: !0,
    b: !0,
    bdi: !0,
    bdo: !0,
    br: !0,
    button: !0,
    canvas: !0,
    cite: !0,
    code: !0,
    command: !0,
    data: !0,
    datalist: !0,
    del: !0,
    dfn: !0,
    em: !0,
    embed: !0,
    i: !0,
    iframe: !0,
    img: !0,
    input: !0,
    ins: !0,
    itemprop: !0,
    kbd: !0,
    keygen: !0,
    label: !0,
    link: !0,
    map: !0,
    mark: !0,
    math: !0,
    meta: !0,
    meter: !0,
    noscript: !0,
    object: !0,
    option: !0,
    output: !0,
    picture: !0,
    progress: !0,
    q: !0,
    ruby: !0,
    s: !0,
    samp: !0,
    script: !0,
    select: !0,
    slot: !0,
    small: !0,
    span: !0,
    strong: !0,
    sub: !0,
    sup: !0,
    svg: !0,
    template: !0,
    textarea: !0,
    time: !0,
    u: !0,
    var: !0,
    video: !0,
    wbr: !0
};

const ESCAPE_HTML = /[&<>]/g;

const ESCAPE_ATTRIBUTES = /[&"]/g;

const registerQwikEvent$1 = (prop, containerState) => {
    containerState.$events$.add(getEventName(prop));
};

const escapeHtml = s => s.replace(ESCAPE_HTML, (c => {
    switch (c) {
      case "&":
        return "&amp;";

      case "<":
        return "&lt;";

      case ">":
        return "&gt;";

      default:
        return "";
    }
}));

const escapeAttr = s => s.replace(ESCAPE_ATTRIBUTES, (c => {
    switch (c) {
      case "&":
        return "&amp;";

      case '"':
        return "&quot;";

      default:
        return "";
    }
}));

const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;

const isSSRUnsafeAttr = name => unsafeAttrCharRE.test(name);

const listenersNeedId = listeners => listeners.some((l => l[1].$captureRef$ && l[1].$captureRef$.length > 0));

const addDynamicSlot = (hostCtx, elCtx) => {
    let dynamicSlots = hostCtx.$dynamicSlots$;
    dynamicSlots || (hostCtx.$dynamicSlots$ = dynamicSlots = []), dynamicSlots.includes(elCtx) || dynamicSlots.push(elCtx);
};

const normalizeInvisibleEvents = eventName => "on:qvisible" === eventName ? "on-document:qinit" : eventName;

const emitEvent$1 = (el, eventName, detail, bubbles) => {
    (isBrowser || "function" == typeof CustomEvent) && el && el.dispatchEvent(new CustomEvent(eventName, {
        detail,
        bubbles,
        composed: bubbles
    }));
};

const renderComponent = (rCtx, elCtx, flags) => {
    const justMounted = !(4 & elCtx.$flags$);
    const hostElement = elCtx.$element$;
    const containerState = rCtx.$static$.$containerState$;
    return containerState.$hostsStaging$.delete(elCtx), containerState.$subsManager$.$clearSub$(hostElement), 
    then(executeComponent(rCtx, elCtx), (res => {
        const staticCtx = rCtx.$static$;
        const newCtx = res.rCtx;
        const iCtx = newInvokeContext(rCtx.$static$.$locale$, hostElement);
        if (staticCtx.$hostElements$.add(hostElement), iCtx.$subscriber$ = [ 0, hostElement ], 
        iCtx.$renderCtx$ = newCtx, justMounted && elCtx.$appendStyles$) {
            for (const style of elCtx.$appendStyles$) {
                appendHeadStyle(staticCtx, style);
            }
        }
        const processedJSXNode = processData(res.node, iCtx);
        return then(processedJSXNode, (processedJSXNode => {
            const newVdom = wrapJSX(hostElement, processedJSXNode);
            const oldVdom = getVdom(elCtx);
            return then(smartUpdateChildren(newCtx, oldVdom, newVdom, flags), (() => {
                elCtx.$vdom$ = newVdom;
            }));
        }));
    }));
};

const getVdom = elCtx => (elCtx.$vdom$ || (elCtx.$vdom$ = domToVnode(elCtx.$element$)), 
elCtx.$vdom$);

class ProcessedJSXNodeImpl {
    constructor($type$, $props$, $immutableProps$, $children$, $flags$, $key$) {
        this.$type$ = $type$, this.$props$ = $props$, this.$immutableProps$ = $immutableProps$, 
        this.$children$ = $children$, this.$flags$ = $flags$, this.$key$ = $key$, this.$elm$ = null, 
        this.$text$ = "", this.$signal$ = null, this.$id$ = $type$ + ($key$ ? ":" + $key$ : ""), 
        seal();
    }
}

const processNode = (node, invocationContext) => {
    const {key, type, props, children, flags, immutableProps} = node;
    let textType = "";
    if (isString(type)) {
        textType = type;
    } else {
        if (type !== Virtual) {
            if (isFunction(type)) {
                const res = invoke(invocationContext, type, props, key, flags, node.dev);
                return shouldWrapFunctional(res, node) ? processNode(_jsxC(Virtual, {
                    children: res
                }, 0, key), invocationContext) : processData(res, invocationContext);
            }
            throw qError(25, type);
        }
        textType = VIRTUAL;
    }
    let convertedChildren = EMPTY_ARRAY;
    if (null != children) {
        return then(processData(children, invocationContext), (result => {
            void 0 !== result && (convertedChildren = isArray(result) ? result : [ result ]);
            const vnode = new ProcessedJSXNodeImpl(textType, props, immutableProps, convertedChildren, flags, key);
            return vnode;
        }));
    }
    {
        const vnode = new ProcessedJSXNodeImpl(textType, props, immutableProps, convertedChildren, flags, key);
        return vnode;
    }
};

const wrapJSX = (element, input) => {
    const children = void 0 === input ? EMPTY_ARRAY : isArray(input) ? input : [ input ];
    const node = new ProcessedJSXNodeImpl(":virtual", {}, null, children, 0, null);
    return node.$elm$ = element, node;
};

const processData = (node, invocationContext) => {
    if (null != node && "boolean" != typeof node) {
        if (isPrimitive(node)) {
            const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ, null, EMPTY_ARRAY, 0, null);
            return newNode.$text$ = String(node), newNode;
        }
        if (isJSXNode(node)) {
            return processNode(node, invocationContext);
        }
        if (isSignal(node)) {
            const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ, null, EMPTY_ARRAY, 0, null);
            return newNode.$signal$ = node, newNode;
        }
        if (isArray(node)) {
            const output = promiseAll(node.flatMap((n => processData(n, invocationContext))));
            return then(output, (array => array.flat(100).filter(isNotNullable)));
        }
        return isPromise(node) ? node.then((node => processData(node, invocationContext))) : node === SkipRender ? new ProcessedJSXNodeImpl(SKIP_RENDER_TYPE, EMPTY_OBJ, null, EMPTY_ARRAY, 0, null) : void logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
    }
};

const isPrimitive = obj => isString(obj) || "number" == typeof obj;

const resumeIfNeeded = containerEl => {
    "paused" === directGetAttribute(containerEl, "q:container") && (resumeContainer(containerEl), 
    appendQwikDevTools(containerEl));
};

const getPauseState = containerEl => {
    const doc = getDocument(containerEl);
    const script = getQwikJSON(containerEl === doc.documentElement ? doc.body : containerEl, "type");
    if (script) {
        return JSON.parse(unescapeText(script.firstChild.data) || "{}");
    }
};

const _deserializeData = (data, element) => {
    const obj = JSON.parse(data);
    if ("object" != typeof obj) {
        return null;
    }
    const {_objs, _entry} = obj;
    if (void 0 === _objs || void 0 === _entry) {
        return null;
    }
    let doc = {};
    let containerState = {};
    if (isNode$1(element) && isQwikElement(element)) {
        const containerEl = getWrappingContainer(element);
        containerEl && (containerState = _getContainerState(containerEl), doc = containerEl.ownerDocument);
    }
    const parser = createParser(containerState, doc);
    for (let i = 0; i < _objs.length; i++) {
        const value = _objs[i];
        isString(value) && (_objs[i] = value === UNDEFINED_PREFIX ? void 0 : parser.prepare(value));
    }
    const getObject = id => _objs[strToInt(id)];
    for (const obj of _objs) {
        reviveNestedObjects(obj, getObject, parser);
    }
    return getObject(_entry);
};

const resumeContainer = containerEl => {
    if (!isElement$1(el = containerEl) || !el.hasAttribute("q:container")) {
        return void logWarn("Skipping hydration because parent element is not q:container");
    }
    var el;
    const pauseState = containerEl._qwikjson_ ?? getPauseState(containerEl);
    if (containerEl._qwikjson_ = null, !pauseState) {
        return void logWarn("Skipping hydration qwik/json metadata was not found.");
    }
    const doc = getDocument(containerEl);
    const parentJSON = containerEl === doc.documentElement ? doc.body : containerEl;
    const inlinedFunctions = getQwikInlinedFuncs(parentJSON);
    const containerState = _getContainerState(containerEl);
    const elements = new Map;
    const text = new Map;
    let node = null;
    let container = 0;
    const elementWalker = doc.createTreeWalker(containerEl, 128);
    for (;node = elementWalker.nextNode(); ) {
        const data = node.data;
        if (0 === container) {
            if (data.startsWith("qv ")) {
                const id = getID(data);
                id >= 0 && elements.set(id, node);
            } else if (data.startsWith("t=")) {
                const id = data.slice(2);
                const index = strToInt(id);
                const textNode = getTextNode(node);
                elements.set(index, textNode), text.set(index, textNode.data);
            }
        }
        "cq" === data ? container++ : "/cq" === data && container--;
    }
    const slotPath = 0 !== containerEl.getElementsByClassName("qc📦").length;
    containerEl.querySelectorAll("[q\\:id]").forEach((el => {
        if (slotPath && el.closest("[q\\:container]") !== containerEl) {
            return;
        }
        const id = directGetAttribute(el, "q:id");
        assertDefined(id, "resume: element missed q:id", el);
        const index = strToInt(id);
        elements.set(index, el);
    }));
    const parser = createParser(containerState, doc);
    const finalized = new Map;
    const revived = new Set;
    const getObject = id => (assertTrue("string" == typeof id && id.length > 0, "resume: id must be an non-empty string, got:", id), 
    finalized.has(id) ? finalized.get(id) : computeObject(id));
    const computeObject = id => {
        if (id.startsWith("#")) {
            const elementId = id.slice(1);
            const index = strToInt(elementId);
            assertTrue(elements.has(index), "missing element for id:", elementId);
            const rawElement = elements.get(index);
            if (assertDefined(rawElement, "missing element for id:", elementId), isComment(rawElement)) {
                if (!rawElement.isConnected) {
                    return void finalized.set(id, void 0);
                }
                const close = findClose(rawElement);
                const virtual = new VirtualElementImpl(rawElement, close, rawElement.parentElement?.namespaceURI === SVG_NS);
                return finalized.set(id, virtual), getContext(virtual, containerState), virtual;
            }
            return isElement$1(rawElement) ? (finalized.set(id, rawElement), getContext(rawElement, containerState), 
            rawElement) : (finalized.set(id, rawElement), rawElement);
        }
        if (id.startsWith("@")) {
            const funcId = id.slice(1);
            const index = strToInt(funcId);
            const func = inlinedFunctions[index];
            return assertDefined(func, "missing inlined function for id:", funcId), func;
        }
        if (id.startsWith("*")) {
            const elementId = id.slice(1);
            const index = strToInt(elementId);
            assertTrue(elements.has(index), "missing element for id:", elementId);
            const str = text.get(index);
            return assertDefined(str, "missing element for id:", elementId), finalized.set(id, str), 
            str;
        }
        const index = strToInt(id);
        const objs = pauseState.objs;
        assertTrue(objs.length > index, "resume: index is out of bounds", id);
        let value = objs[index];
        isString(value) && (value = value === UNDEFINED_PREFIX ? void 0 : parser.prepare(value));
        let obj = value;
        for (let i = id.length - 1; i >= 0; i--) {
            const transform = OBJECT_TRANSFORMS[id[i]];
            if (!transform) {
                break;
            }
            obj = transform(obj, containerState);
        }
        return finalized.set(id, obj), isPrimitive(value) || revived.has(index) || (revived.add(index), 
        reviveSubscriptions(value, index, pauseState.subs, getObject, containerState, parser), 
        reviveNestedObjects(value, getObject, parser)), obj;
    };
    containerState.$elementIndex$ = 1e5, containerState.$pauseCtx$ = {
        getObject,
        meta: pauseState.ctx,
        refs: pauseState.refs
    }, directSetAttribute(containerEl, "q:container", "resumed"), logDebug(), emitEvent$1(containerEl, "qresume", void 0, !0);
};

const reviveSubscriptions = (value, i, objsSubs, getObject, containerState, parser) => {
    const subs = objsSubs[i];
    if (subs) {
        const converted = [];
        let flag = 0;
        for (const sub of subs) {
            if (sub.startsWith("_")) {
                flag = parseInt(sub.slice(1), 10);
            } else {
                const parsed = parseSubscription(sub, getObject);
                parsed && converted.push(parsed);
            }
        }
        if (flag > 0 && setObjectFlags(value, flag), !parser.subs(value, converted)) {
            const proxy = containerState.$proxyMap$.get(value);
            proxy ? getProxyManager(proxy).$addSubs$(converted) : createProxy(value, containerState, converted);
        }
    }
};

const reviveNestedObjects = (obj, getObject, parser) => {
    if (!parser.fill(obj, getObject) && obj && "object" == typeof obj) {
        if (isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                obj[i] = getObject(obj[i]);
            }
        } else if (isSerializableObject(obj)) {
            for (const key in obj) {
                obj[key] = getObject(obj[key]);
            }
        }
    }
};

const unescapeText = str => str.replace(/\\x3C(\/?script)/g, "<$1");

const getQwikInlinedFuncs = parentElm => {
    const elm = getQwikJSON(parentElm, "q:func");
    return elm?.qFuncs ?? EMPTY_ARRAY;
};

const getQwikJSON = (parentElm, attribute) => {
    let child = parentElm.lastElementChild;
    for (;child; ) {
        if ("SCRIPT" === child.tagName && "qwik/json" === directGetAttribute(child, attribute)) {
            return child;
        }
        child = child.previousElementSibling;
    }
};

const getTextNode = mark => {
    const nextNode = mark.nextSibling;
    if (isText(nextNode)) {
        return nextNode;
    }
    {
        const textNode = mark.ownerDocument.createTextNode("");
        return mark.parentElement.insertBefore(textNode, mark), textNode;
    }
};

const appendQwikDevTools = containerEl => {
    containerEl.qwik = {
        pause: () => pauseContainer(containerEl),
        state: _getContainerState(containerEl)
    };
};

const getID = stuff => {
    const index = stuff.indexOf("q:id=");
    return index > 0 ? strToInt(stuff.slice(index + 5)) : -1;
};

const _jsxQ = (type, mutableProps, immutableProps, children, flags, key) => {
    assertString(type, "jsx type must be a string");
    const processed = null == key ? null : String(key);
    const node = new JSXNodeImpl(type, mutableProps ?? EMPTY_OBJ, immutableProps, children, flags, processed);
    return validateJSXNode(node), seal(), node;
};

const _jsxS = (type, mutableProps, immutableProps, flags, key, dev) => {
    let children = null;
    return mutableProps && "children" in mutableProps && (children = mutableProps.children, 
    delete mutableProps.children), _jsxQ(type, mutableProps, immutableProps, children, flags, key, dev);
};

const _jsxC = (type, mutableProps, flags, key) => {
    const processed = null == key ? null : String(key);
    const props = mutableProps ?? EMPTY_OBJ;
    const node = new JSXNodeImpl(type, props, null, props.children, flags, processed);
    return "string" == typeof type && mutableProps && delete mutableProps.children, 
    validateJSXNode(node), seal(), node;
};

const jsx = (type, props, key) => {
    const processed = null == key ? null : String(key);
    const children = untrack((() => {
        const c = props.children;
        return "string" == typeof type && delete props.children, c;
    }));
    isString(type) && "className" in props && (props.class = props.className, delete props.className);
    const node = new JSXNodeImpl(type, props, null, children, 0, processed);
    return validateJSXNode(node), seal(), node;
};

const SKIP_RENDER_TYPE = ":skipRender";

class JSXNodeImpl {
    constructor(type, props, immutableProps, children, flags, key = null) {
        this.type = type, this.props = props, this.immutableProps = immutableProps, this.children = children, 
        this.flags = flags, this.key = key;
    }
}

const Virtual = props => props.children;

const RenderOnce = (props, key) => new JSXNodeImpl(Virtual, EMPTY_OBJ, null, props.children, 2, key);

const validateJSXNode = () => {
    qDev;
};

const printObjectLiteral = obj => `{ ${Object.keys(obj).map((key => `"${key}"`)).join(", ")} }`;

const isJSXNode = n => n instanceof JSXNodeImpl;

const isValidJSXChild = node => !node || (node === SkipRender || (!(!isString(node) && "number" != typeof node && "boolean" != typeof node) || (!!isJSXNode(node) || (isArray(node) ? node.every(isValidJSXChild) : isSignal(node) ? isValidJSXChild(node.value) : !!isPromise(node)))));

const Fragment = props => props.children;

const HTMLFragment = props => jsx(Virtual, props);

const jsxDEV = (type, props, key, _isStatic, opts) => {
    const processed = null == key ? null : String(key);
    const children = untrack((() => {
        const c = props.children;
        return "string" == typeof type && delete props.children, c;
    }));
    isString(type) && "className" in props && (props.class = props.className, delete props.className);
    const node = new JSXNodeImpl(type, props, null, children, 0, processed);
    return node.dev = {
        stack: (new Error).stack,
        ...opts
    }, validateJSXNode(node), seal(), node;
};

const createJSXError = (message, node) => {
    const error = new Error(message);
    return node.dev ? (error.stack = `JSXError: ${message}\n${filterStack(node.dev.stack, 1)}`, 
    error) : error;
};

const filterStack = (stack, offset = 0) => stack.split("\n").slice(offset).join("\n");

const SVG_NS = "http://www.w3.org/2000/svg";

const IS_SVG = 1;

const IS_HEAD = 2;

const IS_IMMUTABLE = 4;

const CHILDREN_PLACEHOLDER = [];

const smartUpdateChildren = (ctx, oldVnode, newVnode, flags) => {
    assertQwikElement(oldVnode.$elm$);
    const ch = newVnode.$children$;
    if (1 === ch.length && ch[0].$type$ === SKIP_RENDER_TYPE) {
        return void (newVnode.$children$ = oldVnode.$children$);
    }
    const elm = oldVnode.$elm$;
    let filter = isChildComponent;
    if (oldVnode.$children$ === CHILDREN_PLACEHOLDER) {
        "HEAD" === elm.nodeName && (filter = isHeadChildren, flags |= 2);
    }
    const oldCh = getVnodeChildren(oldVnode, filter);
    return oldCh.length > 0 && ch.length > 0 ? diffChildren(ctx, elm, oldCh, ch, flags) : oldCh.length > 0 && 0 === ch.length ? removeChildren(ctx.$static$, oldCh, 0, oldCh.length - 1) : ch.length > 0 ? addChildren(ctx, elm, null, ch, 0, ch.length - 1, flags) : void 0;
};

const getVnodeChildren = (oldVnode, filter) => {
    const oldCh = oldVnode.$children$;
    return oldCh === CHILDREN_PLACEHOLDER ? oldVnode.$children$ = getChildrenVnodes(oldVnode.$elm$, filter) : oldCh;
};

const diffChildren = (ctx, parentElm, oldCh, newCh, flags) => {
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
    const staticCtx = ctx.$static$;
    for (;oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx; ) {
        if (null == oldStartVnode) {
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (null == oldEndVnode) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (null == newStartVnode) {
            newStartVnode = newCh[++newStartIdx];
        } else if (null == newEndVnode) {
            newEndVnode = newCh[--newEndIdx];
        } else if (oldStartVnode.$id$ === newStartVnode.$id$) {
            results.push(diffVnode(ctx, oldStartVnode, newStartVnode, flags)), oldStartVnode = oldCh[++oldStartIdx], 
            newStartVnode = newCh[++newStartIdx];
        } else if (oldEndVnode.$id$ === newEndVnode.$id$) {
            results.push(diffVnode(ctx, oldEndVnode, newEndVnode, flags)), oldEndVnode = oldCh[--oldEndIdx], 
            newEndVnode = newCh[--newEndIdx];
        } else if (oldStartVnode.$key$ && oldStartVnode.$id$ === newEndVnode.$id$) {
            assertDefined(oldStartVnode.$elm$, "oldStartVnode $elm$ must be defined"), assertDefined(oldEndVnode.$elm$, "oldEndVnode $elm$ must be defined"), 
            results.push(diffVnode(ctx, oldStartVnode, newEndVnode, flags)), insertAfter(staticCtx, parentElm, oldStartVnode.$elm$, oldEndVnode.$elm$), 
            oldStartVnode = oldCh[++oldStartIdx], newEndVnode = newCh[--newEndIdx];
        } else if (oldEndVnode.$key$ && oldEndVnode.$id$ === newStartVnode.$id$) {
            assertDefined(oldStartVnode.$elm$, "oldStartVnode $elm$ must be defined"), assertDefined(oldEndVnode.$elm$, "oldEndVnode $elm$ must be defined"), 
            results.push(diffVnode(ctx, oldEndVnode, newStartVnode, flags)), insertBefore(staticCtx, parentElm, oldEndVnode.$elm$, oldStartVnode.$elm$), 
            oldEndVnode = oldCh[--oldEndIdx], newStartVnode = newCh[++newStartIdx];
        } else {
            if (void 0 === oldKeyToIdx && (oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)), 
            idxInOld = oldKeyToIdx[newStartVnode.$key$], void 0 === idxInOld) {
                const newElm = createElm(ctx, newStartVnode, flags, results);
                insertBefore(staticCtx, parentElm, newElm, oldStartVnode?.$elm$);
            } else if (elmToMove = oldCh[idxInOld], elmToMove.$type$ !== newStartVnode.$type$) {
                const newElm = createElm(ctx, newStartVnode, flags, results);
                then(newElm, (newElm => {
                    insertBefore(staticCtx, parentElm, newElm, oldStartVnode?.$elm$);
                }));
            } else {
                results.push(diffVnode(ctx, elmToMove, newStartVnode, flags)), oldCh[idxInOld] = void 0, 
                assertDefined(elmToMove.$elm$, "elmToMove $elm$ must be defined"), insertBefore(staticCtx, parentElm, elmToMove.$elm$, oldStartVnode.$elm$);
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    if (newStartIdx <= newEndIdx) {
        results.push(addChildren(ctx, parentElm, null == newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].$elm$, newCh, newStartIdx, newEndIdx, flags));
    }
    let wait = promiseAll(results);
    return oldStartIdx <= oldEndIdx && (wait = then(wait, (() => {
        removeChildren(staticCtx, oldCh, oldStartIdx, oldEndIdx);
    }))), wait;
};

const getChildren = (elm, filter) => {
    const end = isVirtualElement(elm) ? elm.close : null;
    const nodes = [];
    let node = elm.firstChild;
    for (;(node = processVirtualNodes(node)) && (filter(node) && nodes.push(node), node = node.nextSibling, 
    node !== end); ) {}
    return nodes;
};

const getChildrenVnodes = (elm, filter) => getChildren(elm, filter).map(getVnodeFromEl);

const getVnodeFromEl = el => isElement$1(el) ? tryGetContext(el)?.$vdom$ ?? domToVnode(el) : domToVnode(el);

const domToVnode = node => {
    if (isQwikElement(node)) {
        const t = new ProcessedJSXNodeImpl(node.localName, {}, null, CHILDREN_PLACEHOLDER, 0, getKey(node));
        return t.$elm$ = node, t;
    }
    if (isText(node)) {
        const t = new ProcessedJSXNodeImpl(node.nodeName, EMPTY_OBJ, null, CHILDREN_PLACEHOLDER, 0, null);
        return t.$text$ = node.data, t.$elm$ = node, t;
    }
    assertFail("Invalid node type");
};

const isHeadChildren = node => {
    const type = node.nodeType;
    return 1 === type ? node.hasAttribute("q:head") : 111 === type;
};

const isSlotTemplate = node => "Q:TEMPLATE" === node.nodeName;

const isChildComponent = node => {
    const type = node.nodeType;
    if (3 === type || 111 === type) {
        return !0;
    }
    if (1 !== type) {
        return !1;
    }
    const nodeName = node.nodeName;
    return "Q:TEMPLATE" !== nodeName && ("HEAD" === nodeName ? node.hasAttribute("q:head") : "STYLE" !== nodeName || !node.hasAttribute(QStyle));
};

const splitChildren = input => {
    const output = {};
    for (const item of input) {
        const key = getSlotName(item);
        (output[key] ?? (output[key] = new ProcessedJSXNodeImpl(VIRTUAL, {
            "q:s": ""
        }, null, [], 0, key))).$children$.push(item);
    }
    return output;
};

const diffVnode = (rCtx, oldVnode, newVnode, flags) => {
    assertEqual(oldVnode.$type$, newVnode.$type$, "old and new vnodes type must be the same"), 
    assertEqual(oldVnode.$key$, newVnode.$key$, "old and new vnodes key must be the same"), 
    assertEqual(oldVnode.$id$, newVnode.$id$, "old and new vnodes key must be the same");
    const elm = oldVnode.$elm$;
    const tag = newVnode.$type$;
    const staticCtx = rCtx.$static$;
    const containerState = staticCtx.$containerState$;
    const currentComponent = rCtx.$cmpCtx$;
    if (assertDefined(elm, "while patching element must be defined"), assertDefined(currentComponent, "while patching current component must be defined"), 
    newVnode.$elm$ = elm, "#text" === tag) {
        staticCtx.$visited$.push(elm);
        const signal = newVnode.$signal$;
        return signal && (newVnode.$text$ = jsxToString(trackSignal(signal, [ 4, currentComponent.$element$, signal, elm ]))), 
        void setProperty(staticCtx, elm, "data", newVnode.$text$);
    }
    assertQwikElement(elm);
    const props = newVnode.$props$;
    const vnodeFlags = newVnode.$flags$;
    const elCtx = getContext(elm, containerState);
    if (tag !== VIRTUAL) {
        let isSvg = 0 != (1 & flags);
        if (isSvg || "svg" !== tag || (flags |= 1, isSvg = !0), props !== EMPTY_OBJ) {
            0 == (1 & vnodeFlags) && (elCtx.li.length = 0);
            const values = oldVnode.$props$;
            newVnode.$props$ = values;
            for (const prop in props) {
                let newValue = props[prop];
                if ("ref" !== prop) {
                    if (isOnProp(prop)) {
                        const normalized = setEvent(elCtx.li, prop, newValue, containerState.$containerEl$);
                        addQwikEvent(staticCtx, elm, normalized);
                    } else {
                        isSignal(newValue) && (newValue = trackSignal(newValue, [ 1, currentComponent.$element$, newValue, elm, prop ])), 
                        "class" === prop ? newValue = serializeClassWithHost(newValue, currentComponent) : "style" === prop && (newValue = stringifyStyle(newValue)), 
                        values[prop] !== newValue && (values[prop] = newValue, smartSetProperty(staticCtx, elm, prop, newValue, isSvg));
                    }
                } else {
                    assertElement(elm), void 0 !== newValue && setRef(newValue, elm);
                }
            }
        }
        if (2 & vnodeFlags) {
            return;
        }
        isSvg && "foreignObject" === tag && (flags &= -2);
        if (void 0 !== props[dangerouslySetInnerHTML]) {
            return void 0;
        }
        if ("textarea" === tag) {
            return;
        }
        return smartUpdateChildren(rCtx, oldVnode, newVnode, flags);
    }
    if ("q:renderFn" in props) {
        const cmpProps = props.props;
        setComponentProps(containerState, elCtx, cmpProps);
        let needsRender = !!(1 & elCtx.$flags$);
        return needsRender || elCtx.$componentQrl$ || elCtx.$element$.hasAttribute("q:id") || (setQId(rCtx, elCtx), 
        elCtx.$componentQrl$ = cmpProps["q:renderFn"], assertQrl(elCtx.$componentQrl$), 
        needsRender = !0), needsRender ? then(renderComponent(rCtx, elCtx, flags), (() => renderContentProjection(rCtx, elCtx, newVnode, flags))) : renderContentProjection(rCtx, elCtx, newVnode, flags);
    }
    if ("q:s" in props) {
        return assertDefined(currentComponent.$slots$, "current component slots must be a defined array"), 
        void currentComponent.$slots$.push(newVnode);
    }
    if (dangerouslySetInnerHTML in props) {
        setProperty(staticCtx, elm, "innerHTML", props[dangerouslySetInnerHTML]);
    } else if (!(2 & vnodeFlags)) {
        return smartUpdateChildren(rCtx, oldVnode, newVnode, flags);
    }
};

const renderContentProjection = (rCtx, hostCtx, vnode, flags) => {
    if (2 & vnode.$flags$) {
        return;
    }
    const staticCtx = rCtx.$static$;
    const splittedNewChildren = splitChildren(vnode.$children$);
    const slotMaps = getSlotMap(hostCtx);
    for (const key in slotMaps.slots) {
        if (!splittedNewChildren[key]) {
            const slotEl = slotMaps.slots[key];
            const oldCh = getChildrenVnodes(slotEl, isChildComponent);
            if (oldCh.length > 0) {
                const slotCtx = tryGetContext(slotEl);
                slotCtx && slotCtx.$vdom$ && (slotCtx.$vdom$.$children$ = []), removeChildren(staticCtx, oldCh, 0, oldCh.length - 1);
            }
        }
    }
    for (const key in slotMaps.templates) {
        const templateEl = slotMaps.templates[key];
        templateEl && !splittedNewChildren[key] && (slotMaps.templates[key] = void 0, removeNode(staticCtx, templateEl));
    }
    return promiseAll(Object.keys(splittedNewChildren).map((slotName => {
        const newVdom = splittedNewChildren[slotName];
        const slotCtx = getSlotCtx(staticCtx, slotMaps, hostCtx, slotName, rCtx.$static$.$containerState$);
        const oldVdom = getVdom(slotCtx);
        const slotRctx = pushRenderContext(rCtx);
        const slotEl = slotCtx.$element$;
        slotRctx.$slotCtx$ = slotCtx, slotCtx.$vdom$ = newVdom, newVdom.$elm$ = slotEl;
        let newFlags = -2 & flags;
        slotEl.isSvg && (newFlags |= 1);
        const index = staticCtx.$addSlots$.findIndex((slot => slot[0] === slotEl));
        return index >= 0 && staticCtx.$addSlots$.splice(index, 1), smartUpdateChildren(slotRctx, oldVdom, newVdom, newFlags);
    })));
};

const addChildren = (ctx, parentElm, before, vnodes, startIdx, endIdx, flags) => {
    const promises = [];
    for (;startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx];
        assertDefined(ch, "render: node must be defined at index", startIdx, vnodes);
        const elm = createElm(ctx, ch, flags, promises);
        insertBefore(ctx.$static$, parentElm, elm, before);
    }
    return promiseAllLazy(promises);
};

const removeChildren = (staticCtx, nodes, startIdx, endIdx) => {
    for (;startIdx <= endIdx; ++startIdx) {
        const ch = nodes[startIdx];
        ch && (assertDefined(ch.$elm$, "vnode elm must be defined"), removeNode(staticCtx, ch.$elm$));
    }
};

const getSlotCtx = (staticCtx, slotMaps, hostCtx, slotName, containerState) => {
    const slotEl = slotMaps.slots[slotName];
    if (slotEl) {
        return getContext(slotEl, containerState);
    }
    const templateEl = slotMaps.templates[slotName];
    if (templateEl) {
        return getContext(templateEl, containerState);
    }
    const template = createTemplate(staticCtx.$doc$, slotName);
    const elCtx = createContext(template);
    return elCtx.$parent$ = hostCtx, prepend(staticCtx, hostCtx.$element$, template), 
    slotMaps.templates[slotName] = template, elCtx;
};

const getSlotName = node => node.$props$[QSlot] ?? "";

const createElm = (rCtx, vnode, flags, promises) => {
    const tag = vnode.$type$;
    const doc = rCtx.$static$.$doc$;
    const currentComponent = rCtx.$cmpCtx$;
    if ("#text" === tag) {
        const signal = vnode.$signal$;
        const elm = doc.createTextNode(vnode.$text$);
        if (signal) {
            assertDefined(currentComponent, "signals can not be used outside components");
            elm.data = vnode.$text$ = jsxToString(trackSignal(signal, 4 & flags ? [ 3, elm, signal, elm ] : [ 4, currentComponent.$element$, signal, elm ]));
        }
        return vnode.$elm$ = elm;
    }
    let elm;
    let isSvg = !!(1 & flags);
    isSvg || "svg" !== tag || (flags |= 1, isSvg = !0);
    const isVirtual = tag === VIRTUAL;
    const props = vnode.$props$;
    const staticCtx = rCtx.$static$;
    const containerState = staticCtx.$containerState$;
    isVirtual ? elm = newVirtualElement(doc, isSvg) : "head" === tag ? (elm = doc.head, 
    flags |= 2) : (elm = createElement(doc, tag, isSvg), flags &= -3), 2 & vnode.$flags$ && (flags |= 4), 
    vnode.$elm$ = elm;
    const elCtx = createContext(elm);
    if (elCtx.$parent$ = rCtx.$cmpCtx$, elCtx.$slotParent$ = rCtx.$slotCtx$, isVirtual) {
        if ("q:renderFn" in props) {
            const renderQRL = props["q:renderFn"];
            assertQrl(renderQRL);
            const target = createPropsState();
            const manager = containerState.$subsManager$.$createManager$();
            const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager));
            const expectProps = props.props;
            if (containerState.$proxyMap$.set(target, proxy), elCtx.$props$ = proxy, expectProps !== EMPTY_OBJ) {
                const immutableMeta = target[_IMMUTABLE] = expectProps[_IMMUTABLE] ?? EMPTY_OBJ;
                for (const prop in expectProps) {
                    if ("children" !== prop && prop !== QSlot) {
                        const immutableValue = immutableMeta[prop];
                        isSignal(immutableValue) ? target["$$" + prop] = immutableValue : target[prop] = expectProps[prop];
                    }
                }
            }
            setQId(rCtx, elCtx), elCtx.$componentQrl$ = renderQRL;
            const wait = then(renderComponent(rCtx, elCtx, flags), (() => {
                let children = vnode.$children$;
                if (0 === children.length) {
                    return;
                }
                1 === children.length && children[0].$type$ === SKIP_RENDER_TYPE && (children = children[0].$children$);
                const slotMap = getSlotMap(elCtx);
                const p = [];
                const splittedNewChildren = splitChildren(children);
                for (const slotName in splittedNewChildren) {
                    const newVnode = splittedNewChildren[slotName];
                    const slotCtx = getSlotCtx(staticCtx, slotMap, elCtx, slotName, staticCtx.$containerState$);
                    const slotRctx = pushRenderContext(rCtx);
                    const slotEl = slotCtx.$element$;
                    slotRctx.$slotCtx$ = slotCtx, slotCtx.$vdom$ = newVnode, newVnode.$elm$ = slotEl;
                    let newFlags = -2 & flags;
                    slotEl.isSvg && (newFlags |= 1);
                    for (const node of newVnode.$children$) {
                        const nodeElm = createElm(slotRctx, node, newFlags, p);
                        assertDefined(node.$elm$, "vnode elm must be defined"), assertEqual(nodeElm, node.$elm$, "vnode elm must be defined"), 
                        appendChild(staticCtx, slotEl, nodeElm);
                    }
                }
                return promiseAllLazy(p);
            }));
            return isPromise(wait) && promises.push(wait), elm;
        }
        if ("q:s" in props) {
            assertDefined(currentComponent, "slot can only be used inside component"), assertDefined(currentComponent.$slots$, "current component slots must be a defined array"), 
            el = elm, null !== (key = vnode.$key$) && directSetAttribute(el, "q:key", key), 
            directSetAttribute(elm, "q:sref", currentComponent.$id$), directSetAttribute(elm, "q:s", ""), 
            currentComponent.$slots$.push(vnode), staticCtx.$addSlots$.push([ elm, currentComponent.$element$ ]);
        } else if (dangerouslySetInnerHTML in props) {
            return setProperty(staticCtx, elm, "innerHTML", props[dangerouslySetInnerHTML]), 
            elm;
        }
    } else {
        if (vnode.$immutableProps$ && setProperties(staticCtx, elCtx, currentComponent, vnode.$immutableProps$, isSvg, !0), 
        props !== EMPTY_OBJ && (elCtx.$vdom$ = vnode, vnode.$props$ = setProperties(staticCtx, elCtx, currentComponent, props, isSvg, !1)), 
        isSvg && "foreignObject" === tag && (isSvg = !1, flags &= -2), currentComponent) {
            const scopedIds = currentComponent.$scopeIds$;
            scopedIds && scopedIds.forEach((styleId => {
                elm.classList.add(styleId);
            })), 2 & currentComponent.$flags$ && (elCtx.li.push(...currentComponent.li), currentComponent.$flags$ &= -3);
        }
        for (const listener of elCtx.li) {
            addQwikEvent(staticCtx, elm, listener[0]);
        }
        if (void 0 !== props[dangerouslySetInnerHTML]) {
            return elm;
        }
        isSvg && "foreignObject" === tag && (isSvg = !1, flags &= -2);
    }
    var el, key;
    let children = vnode.$children$;
    if (0 === children.length) {
        return elm;
    }
    1 === children.length && children[0].$type$ === SKIP_RENDER_TYPE && (children = children[0].$children$);
    const nodes = children.map((ch => createElm(rCtx, ch, flags, promises)));
    for (const node of nodes) {
        directAppendChild(elm, node);
    }
    return elm;
};

const getSlots = elCtx => {
    const slots = elCtx.$slots$;
    if (!slots) {
        return assertDefined(elCtx.$element$.parentElement, "component should be already attached to the dom"), 
        elCtx.$slots$ = readDOMSlots(elCtx);
    }
    return slots;
};

const getSlotMap = elCtx => {
    const slotsArray = getSlots(elCtx);
    const slots = {};
    const templates = {};
    const t = Array.from(elCtx.$element$.childNodes).filter(isSlotTemplate);
    for (const vnode of slotsArray) {
        assertQwikElement(vnode.$elm$), slots[vnode.$key$ ?? ""] = vnode.$elm$;
    }
    for (const elm of t) {
        templates[directGetAttribute(elm, QSlot) ?? ""] = elm;
    }
    return {
        slots,
        templates
    };
};

const readDOMSlots = elCtx => {
    const parent = elCtx.$element$.parentElement;
    return assertDefined(parent, "component should be already attached to the dom"), 
    queryAllVirtualByAttribute(parent, "q:sref", elCtx.$id$).map(domToVnode);
};

const handleStyle = (ctx, elm, newValue) => (setProperty(ctx, elm.style, "cssText", newValue), 
!0);

const handleClass = (ctx, elm, newValue) => (assertTrue(null == newValue || "string" == typeof newValue, "class newValue must be either nullish or string", newValue), 
elm.namespaceURI === SVG_NS ? setAttribute(ctx, elm, "class", newValue) : setProperty(ctx, elm, "className", newValue), 
!0);

const checkBeforeAssign = (ctx, elm, newValue, prop) => (prop in elm && elm[prop] !== newValue && ("SELECT" === elm.tagName ? ctx.$postOperations$.push({
    $operation$: _setProperty,
    $args$: [ elm, prop, newValue ]
}) : setProperty(ctx, elm, prop, newValue)), !0);

const forceAttribute = (ctx, elm, newValue, prop) => (setAttribute(ctx, elm, prop.toLowerCase(), newValue), 
!0);

const setInnerHTML = (ctx, elm, newValue) => (setProperty(ctx, elm, "innerHTML", newValue), 
!0);

const noop = () => !0;

const PROP_HANDLER_MAP = {
    style: handleStyle,
    class: handleClass,
    value: checkBeforeAssign,
    checked: checkBeforeAssign,
    href: forceAttribute,
    list: forceAttribute,
    form: forceAttribute,
    tabIndex: forceAttribute,
    download: forceAttribute,
    innerHTML: noop,
    [dangerouslySetInnerHTML]: setInnerHTML
};

const smartSetProperty = (staticCtx, elm, prop, newValue, isSvg) => {
    if (isAriaAttribute(prop)) {
        return void setAttribute(staticCtx, elm, prop, null != newValue ? String(newValue) : newValue);
    }
    const exception = PROP_HANDLER_MAP[prop];
    exception && exception(staticCtx, elm, newValue, prop) || (isSvg || !(prop in elm) ? (prop.startsWith(PREVENT_DEFAULT) && registerQwikEvent(prop.slice(15)), 
    setAttribute(staticCtx, elm, prop, newValue)) : setProperty(staticCtx, elm, prop, newValue));
};

const setProperties = (staticCtx, elCtx, hostCtx, newProps, isSvg, immutable) => {
    const values = {};
    const elm = elCtx.$element$;
    for (const prop in newProps) {
        let newValue = newProps[prop];
        if ("ref" !== prop) {
            if (isOnProp(prop)) {
                setEvent(elCtx.li, prop, newValue, staticCtx.$containerState$.$containerEl$);
            } else {
                if (isSignal(newValue) && (assertDefined(hostCtx, "Signals can only be used in components"), 
                newValue = trackSignal(newValue, immutable ? [ 1, elm, newValue, hostCtx.$element$, prop ] : [ 2, hostCtx.$element$, newValue, elm, prop ])), 
                "class" === prop) {
                    if (newValue = serializeClassWithHost(newValue, hostCtx), !newValue) {
                        continue;
                    }
                } else {
                    "style" === prop && (newValue = stringifyStyle(newValue));
                }
                values[prop] = newValue, smartSetProperty(staticCtx, elm, prop, newValue, isSvg);
            }
        } else {
            assertElement(elm), void 0 !== newValue && setRef(newValue, elm);
        }
    }
    return values;
};

const setComponentProps = (containerState, elCtx, expectProps) => {
    let props = elCtx.$props$;
    if (props || (elCtx.$props$ = props = createProxy(createPropsState(), containerState)), 
    expectProps === EMPTY_OBJ) {
        return;
    }
    const manager = getProxyManager(props);
    assertDefined(manager, "props have to be a proxy, but it is not", props);
    const target = getProxyTarget(props);
    assertDefined(target, "props have to be a proxy, but it is not", props);
    const immutableMeta = target[_IMMUTABLE] = expectProps[_IMMUTABLE] ?? EMPTY_OBJ;
    for (const prop in expectProps) {
        if ("children" !== prop && prop !== QSlot && !immutableMeta[prop]) {
            const value = expectProps[prop];
            target[prop] !== value && (target[prop] = value, manager.$notifySubs$(prop));
        }
    }
};

const cleanupTree = (elm, staticCtx, subsManager, stopSlots) => {
    if (subsManager.$clearSub$(elm), isQwikElement(elm)) {
        if (stopSlots && elm.hasAttribute("q:s")) {
            return void staticCtx.$rmSlots$.push(elm);
        }
        const ctx = tryGetContext(elm);
        ctx && cleanupContext(ctx, subsManager);
        const end = isVirtualElement(elm) ? elm.close : null;
        let node = elm.firstChild;
        for (;(node = processVirtualNodes(node)) && (cleanupTree(node, staticCtx, subsManager, !0), 
        node = node.nextSibling, node !== end); ) {}
    }
};

const executeContextWithTransition = async ctx => {
    isBrowser && document.__q_view_transition__ && (document.__q_view_transition__ = void 0, 
    document.startViewTransition) ? await document.startViewTransition((() => executeDOMRender(ctx))).finished : executeDOMRender(ctx);
};

const directAppendChild = (parent, child) => {
    isVirtualElement(child) ? child.appendTo(parent) : parent.appendChild(child);
};

const directRemoveChild = (parent, child) => {
    isVirtualElement(child) ? child.remove() : parent.removeChild(child);
};

const directInsertAfter = (parent, child, ref) => {
    isVirtualElement(child) ? child.insertBeforeTo(parent, ref?.nextSibling ?? null) : parent.insertBefore(child, ref?.nextSibling ?? null);
};

const directInsertBefore = (parent, child, ref) => {
    isVirtualElement(child) ? child.insertBeforeTo(parent, getRootNode(ref)) : parent.insertBefore(child, getRootNode(ref));
};

const createKeyToOldIdx = (children, beginIdx, endIdx) => {
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
        const key = children[i].$key$;
        null != key && (map[key] = i);
    }
    return map;
};

const addQwikEvent = (staticCtx, elm, prop) => {
    prop.startsWith("on:") || setAttribute(staticCtx, elm, prop, ""), registerQwikEvent(prop);
};

const registerQwikEvent = prop => {
    var _a;
    {
        const eventName = getEventName(prop);
        try {
            ((_a = globalThis).qwikevents || (_a.qwikevents = [])).push(eventName);
        } catch (err) {
            logWarn(err);
        }
    }
};

const useLexicalScope = () => {
    const context = getInvokeContext();
    let qrl = context.$qrl$;
    if (qrl) {
        assertQrl(qrl), assertDefined(qrl.$captureRef$, "invoke: qrl $captureRef$ must be defined inside useLexicalScope()", qrl);
    } else {
        const el = context.$element$;
        assertDefined(el, "invoke: element must be defined inside useLexicalScope()", context);
        const container = getWrappingContainer(el);
        assertDefined(container, "invoke: cant find parent q:container of", el), qrl = parseQRL(decodeURIComponent(String(context.$url$)), container), 
        assertQrl(qrl), resumeIfNeeded(container);
        const elCtx = getContext(el, _getContainerState(container));
        inflateQrl(qrl, elCtx);
    }
    return qrl.$captureRef$;
};

const executeSignalOperation = (staticCtx, operation) => {
    try {
        const type = operation[0];
        switch (type) {
          case 1:
          case 2:
            {
                let elm;
                let hostElm;
                1 === type ? (elm = operation[1], hostElm = operation[3]) : (elm = operation[3], 
                hostElm = operation[1]);
                const elCtx = tryGetContext(elm);
                if (null == elCtx) {
                    return;
                }
                const prop = operation[4];
                const isSVG = elm.namespaceURI === SVG_NS;
                staticCtx.$containerState$.$subsManager$.$clearSignal$(operation);
                let value = trackSignal(operation[2], operation.slice(0, -1));
                "class" === prop ? value = serializeClassWithHost(value, tryGetContext(hostElm)) : "style" === prop && (value = stringifyStyle(value));
                const vdom = getVdom(elCtx);
                if (vdom.$props$[prop] === value) {
                    return;
                }
                return vdom.$props$[prop] = value, smartSetProperty(staticCtx, elm, prop, value, isSVG);
            }

          case 3:
          case 4:
            {
                const elm = operation[3];
                if (!staticCtx.$visited$.includes(elm)) {
                    staticCtx.$containerState$.$subsManager$.$clearSignal$(operation);
                    const value = trackSignal(operation[2], operation.slice(0, -1));
                    return setProperty(staticCtx, elm, "data", jsxToString(value));
                }
            }
        }
    } catch (e) {}
};

const notifyChange = (subAction, containerState) => {
    if (0 === subAction[0]) {
        const host = subAction[1];
        isSubscriberDescriptor(host) ? notifyWatch(host, containerState) : notifyRender(host, containerState);
    } else {
        notifySignalOperation(subAction, containerState);
    }
};

const notifyRender = (hostElement, containerState) => {
    const server = isServerPlatform();
    server || resumeIfNeeded(containerState.$containerEl$);
    const elCtx = getContext(hostElement, containerState);
    if (assertDefined(elCtx.$componentQrl$, "render: notified host element must have a defined $renderQrl$", elCtx), 
    1 & elCtx.$flags$) {
        return;
    }
    elCtx.$flags$ |= 1;
    if (void 0 !== containerState.$hostsRendering$) {
        containerState.$hostsStaging$.add(elCtx);
    } else {
        if (server) {
            return void logWarn("Can not rerender in server platform");
        }
        containerState.$hostsNext$.add(elCtx), scheduleFrame(containerState);
    }
};

const notifySignalOperation = (op, containerState) => {
    const activeRendering = void 0 !== containerState.$hostsRendering$;
    containerState.$opsNext$.add(op), activeRendering || scheduleFrame(containerState);
};

const notifyWatch = (watch, containerState) => {
    if (watch.$flags$ & WatchFlagsIsDirty) {
        return;
    }
    watch.$flags$ |= WatchFlagsIsDirty;
    void 0 !== containerState.$hostsRendering$ ? containerState.$watchStaging$.add(watch) : (containerState.$watchNext$.add(watch), 
    scheduleFrame(containerState));
};

const scheduleFrame = containerState => (void 0 === containerState.$renderPromise$ && (containerState.$renderPromise$ = getPlatform().nextTick((() => renderMarked(containerState)))), 
containerState.$renderPromise$);

const _hW = () => {
    const [watch] = useLexicalScope();
    notifyWatch(watch, _getContainerState(getWrappingContainer(watch.$el$)));
};

const renderMarked = async containerState => {
    const containerEl = containerState.$containerEl$;
    const doc = getDocument(containerEl);
    try {
        const rCtx = createRenderContext(doc, containerState);
        const staticCtx = rCtx.$static$;
        const hostsRendering = containerState.$hostsRendering$ = new Set(containerState.$hostsNext$);
        containerState.$hostsNext$.clear(), await executeTasksBefore(containerState, rCtx), 
        containerState.$hostsStaging$.forEach((host => {
            hostsRendering.add(host);
        })), containerState.$hostsStaging$.clear();
        const signalOperations = Array.from(containerState.$opsNext$);
        containerState.$opsNext$.clear();
        const renderingQueue = Array.from(hostsRendering);
        if (sortNodes(renderingQueue), !containerState.$styleMoved$ && renderingQueue.length > 0) {
            containerState.$styleMoved$ = !0;
            (containerEl === doc.documentElement ? doc.body : containerEl).querySelectorAll("style[q\\:style]").forEach((el => {
                containerState.$styleIds$.add(directGetAttribute(el, QStyle)), appendChild(staticCtx, doc.head, el);
            }));
        }
        for (const elCtx of renderingQueue) {
            const el = elCtx.$element$;
            if (!staticCtx.$hostElements$.has(el) && elCtx.$componentQrl$) {
                assertTrue(el.isConnected, "element must be connected to the dom"), staticCtx.$roots$.push(elCtx);
                try {
                    await renderComponent(rCtx, elCtx, getFlags(el.parentElement));
                } catch (err) {
                    logError(err);
                }
            }
        }
        return signalOperations.forEach((op => {
            executeSignalOperation(staticCtx, op);
        })), staticCtx.$operations$.push(...staticCtx.$postOperations$), 0 === staticCtx.$operations$.length ? (printRenderStats(), 
        void await postRendering(containerState, rCtx)) : (await executeContextWithTransition(staticCtx), 
        printRenderStats(), postRendering(containerState, rCtx));
    } catch (err) {
        logError(err);
    }
};

const getFlags = el => {
    let flags = 0;
    return el && (el.namespaceURI === SVG_NS && (flags |= 1), "HEAD" === el.tagName && (flags |= 2)), 
    flags;
};

const postRendering = async (containerState, rCtx) => {
    const hostElements = rCtx.$static$.$hostElements$;
    await executeTasksAfter(containerState, rCtx, ((watch, stage) => 0 != (watch.$flags$ & WatchFlagsIsVisibleTask) && (!stage || hostElements.has(watch.$el$)))), 
    containerState.$hostsStaging$.forEach((el => {
        containerState.$hostsNext$.add(el);
    })), containerState.$hostsStaging$.clear(), containerState.$hostsRendering$ = void 0, 
    containerState.$renderPromise$ = void 0;
    containerState.$hostsNext$.size + containerState.$watchNext$.size + containerState.$opsNext$.size > 0 && (containerState.$renderPromise$ = renderMarked(containerState));
};

const executeTasksBefore = async (containerState, rCtx) => {
    const containerEl = containerState.$containerEl$;
    const resourcesPromises = [];
    const watchPromises = [];
    const isWatch = watch => 0 != (watch.$flags$ & WatchFlagsIsTask);
    const isResourceWatch = watch => 0 != (watch.$flags$ & WatchFlagsIsResource);
    containerState.$watchNext$.forEach((watch => {
        isWatch(watch) && (watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), (() => watch))), 
        containerState.$watchNext$.delete(watch)), isResourceWatch(watch) && (resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), (() => watch))), 
        containerState.$watchNext$.delete(watch));
    }));
    do {
        if (containerState.$watchStaging$.forEach((watch => {
            isWatch(watch) ? watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), (() => watch))) : isResourceWatch(watch) ? resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), (() => watch))) : containerState.$watchNext$.add(watch);
        })), containerState.$watchStaging$.clear(), watchPromises.length > 0) {
            const watches = await Promise.all(watchPromises);
            sortTasks(watches), await Promise.all(watches.map((watch => runSubscriber(watch, containerState, rCtx)))), 
            watchPromises.length = 0;
        }
    } while (containerState.$watchStaging$.size > 0);
    if (resourcesPromises.length > 0) {
        const resources = await Promise.all(resourcesPromises);
        sortTasks(resources), resources.forEach((watch => runSubscriber(watch, containerState, rCtx)));
    }
};

const executeTasksAfter = async (containerState, rCtx, watchPred) => {
    const watchPromises = [];
    const containerEl = containerState.$containerEl$;
    containerState.$watchNext$.forEach((watch => {
        watchPred(watch, !1) && (watch.$el$.isConnected && watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), (() => watch))), 
        containerState.$watchNext$.delete(watch));
    }));
    do {
        if (containerState.$watchStaging$.forEach((watch => {
            watch.$el$.isConnected && (watchPred(watch, !0) ? watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), (() => watch))) : containerState.$watchNext$.add(watch));
        })), containerState.$watchStaging$.clear(), watchPromises.length > 0) {
            const watches = await Promise.all(watchPromises);
            sortTasks(watches);
            for (const watch of watches) {
                runSubscriber(watch, containerState, rCtx);
            }
            watchPromises.length = 0;
        }
    } while (containerState.$watchStaging$.size > 0);
};

const sortNodes = elements => {
    elements.sort(((a, b) => 2 & a.$element$.compareDocumentPosition(getRootNode(b.$element$)) ? 1 : -1));
};

const sortTasks = watches => {
    watches.sort(((a, b) => a.$el$ === b.$el$ ? a.$index$ < b.$index$ ? -1 : 1 : 0 != (2 & a.$el$.compareDocumentPosition(getRootNode(b.$el$))) ? 1 : -1));
};

const WatchFlagsIsVisibleTask = 1;

const WatchFlagsIsTask = 2;

const WatchFlagsIsResource = 4;

const WatchFlagsIsComputed = 8;

const WatchFlagsIsDirty = 16;

const WatchFlagsIsCleanup = 32;

const useTaskQrl = (qrl, opts) => {
    const {get, set, iCtx, i, elCtx} = useSequentialScope();
    if (get) {
        return;
    }
    assertQrl(qrl);
    const containerState = iCtx.$renderCtx$.$static$.$containerState$;
    const watch = new Task(WatchFlagsIsDirty | WatchFlagsIsTask, i, elCtx.$element$, qrl, void 0);
    set(!0), qrl.$resolveLazy$(containerState.$containerEl$), elCtx.$watches$ || (elCtx.$watches$ = []), 
    elCtx.$watches$.push(watch), waitAndRun(iCtx, (() => runWatch(watch, containerState, iCtx.$renderCtx$))), 
    isServerPlatform() && useRunWatch(watch, opts?.eagerness);
};

const useComputedQrl = qrl => {
    const {get, set, iCtx, i, elCtx} = useSequentialScope();
    if (get) {
        return get;
    }
    assertQrl(qrl);
    const containerState = iCtx.$renderCtx$.$static$.$containerState$;
    const signal = _createSignal(void 0, containerState, 3, void 0);
    const watch = new Task(WatchFlagsIsDirty | WatchFlagsIsTask | 8, i, elCtx.$element$, qrl, signal);
    return qrl.$resolveLazy$(containerState.$containerEl$), elCtx.$watches$ || (elCtx.$watches$ = []), 
    elCtx.$watches$.push(watch), waitAndRun(iCtx, (() => runComputed(watch, containerState, iCtx.$renderCtx$))), 
    set(signal);
};

const useComputed$ = implicit$FirstArg(useComputedQrl);

const useTask$ = /*#__PURE__*/ implicit$FirstArg(useTaskQrl);

const useVisibleTaskQrl = (qrl, opts) => {
    const {get, set, i, iCtx, elCtx} = useSequentialScope();
    const eagerness = opts?.strategy ?? "intersection-observer";
    if (get) {
        return void (isServerPlatform() && useRunWatch(get, eagerness));
    }
    assertQrl(qrl);
    const watch = new Task(WatchFlagsIsVisibleTask, i, elCtx.$element$, qrl, void 0);
    const containerState = iCtx.$renderCtx$.$static$.$containerState$;
    elCtx.$watches$ || (elCtx.$watches$ = []), elCtx.$watches$.push(watch), set(watch), 
    useRunWatch(watch, eagerness), isServerPlatform() || (qrl.$resolveLazy$(containerState.$containerEl$), 
    notifyWatch(watch, containerState));
};

const useVisibleTask$ = /*#__PURE__*/ implicit$FirstArg(useVisibleTaskQrl);

const isResourceTask = watch => 0 != (watch.$flags$ & WatchFlagsIsResource);

const isComputedTask = watch => 0 != (8 & watch.$flags$);

const runSubscriber = async (watch, containerState, rCtx) => (assertEqual(!!(watch.$flags$ & WatchFlagsIsDirty), !0, "Resource is not dirty", watch), 
isResourceTask(watch) ? runResource(watch, containerState, rCtx) : isComputedTask(watch) ? runComputed(watch, containerState, rCtx) : runWatch(watch, containerState, rCtx));

const runResource = (watch, containerState, rCtx, waitOn) => {
    watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
    const iCtx = newInvokeContext(rCtx.$static$.$locale$, watch.$el$, void 0, "WatchEvent");
    const {$subsManager$: subsManager} = containerState;
    iCtx.$renderCtx$ = rCtx;
    const watchFn = watch.$qrl$.getFn(iCtx, (() => {
        subsManager.$clearSub$(watch);
    }));
    const cleanups = [];
    const resource = watch.$state$;
    assertDefined(resource, 'useResource: when running a resource, "watch.r" must be a defined.', watch);
    const resourceTarget = unwrapProxy(resource);
    const opts = {
        track: (obj, prop) => {
            if (isFunction(obj)) {
                const ctx = newInvokeContext();
                return ctx.$renderCtx$ = rCtx, ctx.$subscriber$ = [ 0, watch ], invoke(ctx, obj);
            }
            const manager = getProxyManager(obj);
            return manager ? manager.$addSub$([ 0, watch ], prop) : logErrorAndStop(codeToText(26), obj), 
            prop ? obj[prop] : isSignal(obj) ? obj.value : obj;
        },
        cleanup(callback) {
            cleanups.push(callback);
        },
        cache(policy) {
            let milliseconds = 0;
            milliseconds = "immutable" === policy ? 1 / 0 : policy, resource._cache = milliseconds;
        },
        previous: resourceTarget._resolved
    };
    let resolve;
    let reject;
    let done = !1;
    const setState = (resolved, value) => !done && (done = !0, resolved ? (done = !0, 
    resource.loading = !1, resource._state = "resolved", resource._resolved = value, 
    resource._error = void 0, resolve(value)) : (done = !0, resource.loading = !1, resource._state = "rejected", 
    resource._error = value, reject(value)), !0);
    invoke(iCtx, (() => {
        resource._state = "pending", resource.loading = !isServerPlatform(), resource.value = new Promise(((r, re) => {
            resolve = r, reject = re;
        }));
    })), watch.$destroy$ = noSerialize((() => {
        done = !0, cleanups.forEach((fn => fn()));
    }));
    const promise = safeCall((() => then(waitOn, (() => watchFn(opts)))), (value => {
        setState(!0, value);
    }), (reason => {
        setState(!1, reason);
    }));
    const timeout = resourceTarget._timeout;
    return timeout > 0 ? Promise.race([ promise, delay(timeout).then((() => {
        setState(!1, new Error("timeout")) && cleanupWatch(watch);
    })) ]) : promise;
};

const runWatch = (watch, containerState, rCtx) => {
    watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
    const hostElement = watch.$el$;
    const iCtx = newInvokeContext(rCtx.$static$.$locale$, hostElement, void 0, "WatchEvent");
    iCtx.$renderCtx$ = rCtx;
    const {$subsManager$: subsManager} = containerState;
    const watchFn = watch.$qrl$.getFn(iCtx, (() => {
        subsManager.$clearSub$(watch);
    }));
    const cleanups = [];
    watch.$destroy$ = noSerialize((() => {
        cleanups.forEach((fn => fn()));
    }));
    const opts = {
        track: (obj, prop) => {
            if (isFunction(obj)) {
                const ctx = newInvokeContext();
                return ctx.$subscriber$ = [ 0, watch ], invoke(ctx, obj);
            }
            const manager = getProxyManager(obj);
            return manager ? manager.$addSub$([ 0, watch ], prop) : logErrorAndStop(codeToText(26), obj), 
            prop ? obj[prop] : obj;
        },
        cleanup(callback) {
            cleanups.push(callback);
        }
    };
    return safeCall((() => watchFn(opts)), (returnValue => {
        isFunction(returnValue) && cleanups.push(returnValue);
    }), (reason => {
        handleError(reason, hostElement, rCtx);
    }));
};

const runComputed = (watch, containerState, rCtx) => {
    assertSignal(watch.$state$), watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
    const hostElement = watch.$el$;
    const iCtx = newInvokeContext(rCtx.$static$.$locale$, hostElement, void 0, "ComputedEvent");
    iCtx.$subscriber$ = [ 0, watch ], iCtx.$renderCtx$ = rCtx;
    const {$subsManager$: subsManager} = containerState;
    const watchFn = watch.$qrl$.getFn(iCtx, (() => {
        subsManager.$clearSub$(watch);
    }));
    return safeCall(watchFn, (returnValue => untrack((() => {
        const signal = watch.$state$;
        signal[QObjectSignalFlags] &= -3, signal.untrackedValue = returnValue, signal[QObjectManagerSymbol].$notifySubs$();
    }))), (reason => {
        handleError(reason, hostElement, rCtx);
    }));
};

const cleanupWatch = watch => {
    const destroy = watch.$destroy$;
    if (destroy) {
        watch.$destroy$ = void 0;
        try {
            destroy();
        } catch (err) {
            logError(err);
        }
    }
};

const destroyWatch = watch => {
    if (32 & watch.$flags$) {
        watch.$flags$ &= -33;
        (0, watch.$qrl$)();
    } else {
        cleanupWatch(watch);
    }
};

const useRunWatch = (watch, eagerness) => {
    "visible" === eagerness || "intersection-observer" === eagerness ? useOn("qvisible", getWatchHandlerQrl(watch)) : "load" === eagerness || "document-ready" === eagerness ? useOnDocument("qinit", getWatchHandlerQrl(watch)) : "idle" !== eagerness && "document-idle" !== eagerness || useOnDocument("qidle", getWatchHandlerQrl(watch));
};

const getWatchHandlerQrl = watch => {
    const watchQrl = watch.$qrl$;
    return createQRL(watchQrl.$chunk$, "_hW", _hW, null, null, [ watch ], watchQrl.$symbol$);
};

const isSubscriberDescriptor = obj => isObject(obj) && obj instanceof Task;

const serializeWatch = (watch, getObjId) => {
    let value = `${intToStr(watch.$flags$)} ${intToStr(watch.$index$)} ${getObjId(watch.$qrl$)} ${getObjId(watch.$el$)}`;
    return watch.$state$ && (value += ` ${getObjId(watch.$state$)}`), value;
};

const parseTask = data => {
    const [flags, index, qrl, el, resource] = data.split(" ");
    return new Task(strToInt(flags), strToInt(index), el, qrl, resource);
};

class Task {
    constructor($flags$, $index$, $el$, $qrl$, $state$) {
        this.$flags$ = $flags$, this.$index$ = $index$, this.$el$ = $el$, this.$qrl$ = $qrl$, 
        this.$state$ = $state$;
    }
}

const _serializeData = async data => {
    const containerState = {};
    const collector = createCollector(containerState);
    let promises;
    for (collectValue(data, collector, !1); (promises = collector.$promises$).length > 0; ) {
        collector.$promises$ = [], await Promise.all(promises);
    }
    const objs = Array.from(collector.$objSet$.keys());
    let count = 0;
    const objToId = new Map;
    for (const obj of objs) {
        objToId.set(obj, intToStr(count)), count++;
    }
    if (collector.$noSerialize$.length > 0) {
        const undefinedID = objToId.get(void 0);
        assertDefined(undefinedID, "undefined ID must be defined");
        for (const obj of collector.$noSerialize$) {
            objToId.set(obj, undefinedID);
        }
    }
    const mustGetObjId = obj => {
        let suffix = "";
        if (isPromise(obj)) {
            const promiseValue = getPromiseValue(obj);
            if (!promiseValue) {
                throw qError(27, obj);
            }
            obj = promiseValue.value, suffix += promiseValue.resolved ? "~" : "_";
        }
        if (isObject(obj)) {
            const target = getProxyTarget(obj);
            target && (suffix += "!", obj = target);
        }
        const key = objToId.get(obj);
        if (void 0 === key) {
            throw qError(27, obj);
        }
        return key + suffix;
    };
    const convertedObjs = objs.map((obj => {
        if (null === obj) {
            return null;
        }
        const typeObj = typeof obj;
        switch (typeObj) {
          case "undefined":
            return UNDEFINED_PREFIX;

          case "number":
            if (!Number.isFinite(obj)) {
                break;
            }
            return obj;

          case "string":
          case "boolean":
            return obj;
        }
        const value = serializeValue(obj, mustGetObjId, collector, containerState);
        if (void 0 !== value) {
            return value;
        }
        if ("object" === typeObj) {
            if (isArray(obj)) {
                return obj.map(mustGetObjId);
            }
            if (isSerializableObject(obj)) {
                const output = {};
                for (const key in obj) {
                    output[key] = mustGetObjId(obj[key]);
                }
                return output;
            }
        }
        throw qError(3, obj);
    }));
    return JSON.stringify({
        _entry: mustGetObjId(data),
        _objs: convertedObjs
    });
};

const pauseContainer = async (elmOrDoc, defaultParentJSON) => {
    const doc = getDocument(elmOrDoc);
    const documentElement = doc.documentElement;
    const containerEl = isDocument(elmOrDoc) ? documentElement : elmOrDoc;
    if ("paused" === directGetAttribute(containerEl, "q:container")) {
        throw qError(21);
    }
    const parentJSON = defaultParentJSON ?? (containerEl === doc.documentElement ? doc.body : containerEl);
    const containerState = _getContainerState(containerEl);
    const contexts = getNodesInScope(containerEl, hasContext);
    directSetAttribute(containerEl, "q:container", "paused");
    for (const elCtx of contexts) {
        const elm = elCtx.$element$;
        const listeners = elCtx.li;
        if (elCtx.$scopeIds$) {
            const value = serializeSStyle(elCtx.$scopeIds$);
            value && elm.setAttribute("q:sstyle", value);
        }
        if (elCtx.$id$ && elm.setAttribute("q:id", elCtx.$id$), isElement$1(elm) && listeners.length > 0) {
            const groups = groupListeners(listeners);
            for (const listener of groups) {
                elm.setAttribute(listener[0], serializeQRLs(listener[1], elCtx));
            }
        }
    }
    const data = await _pauseFromContexts(contexts, containerState, (el => isNode$1(el) && isText(el) ? getTextID(el, containerState) : null));
    const qwikJson = doc.createElement("script");
    directSetAttribute(qwikJson, "type", "qwik/json"), qwikJson.textContent = escapeText(JSON.stringify(data.state, void 0, void 0)), 
    parentJSON.appendChild(qwikJson);
    const extraListeners = Array.from(containerState.$events$, (s => JSON.stringify(s)));
    const eventsScript = doc.createElement("script");
    return eventsScript.textContent = `window.qwikevents||=[];window.qwikevents.push(${extraListeners.join(", ")})`, 
    parentJSON.appendChild(eventsScript), data;
};

const _pauseFromContexts = async (allContexts, containerState, fallbackGetObjId, textNodes) => {
    const collector = createCollector(containerState);
    textNodes?.forEach(((_, key) => {
        collector.$seen$.add(key);
    }));
    let hasListeners = !1;
    for (const ctx of allContexts) {
        if (ctx.$watches$) {
            for (const watch of ctx.$watches$) {
                isResourceTask(watch) && collector.$resources$.push(watch.$state$), destroyWatch(watch);
            }
        }
    }
    for (const ctx of allContexts) {
        const el = ctx.$element$;
        const ctxListeners = ctx.li;
        for (const listener of ctxListeners) {
            if (isElement$1(el)) {
                const qrl = listener[1];
                const captured = qrl.$captureRef$;
                if (captured) {
                    for (const obj of captured) {
                        collectValue(obj, collector, !0);
                    }
                }
                collector.$qrls$.push(qrl), hasListeners = !0;
            }
        }
    }
    if (!hasListeners) {
        return {
            state: {
                refs: {},
                ctx: {},
                objs: [],
                subs: []
            },
            objs: [],
            funcs: [],
            qrls: [],
            resources: collector.$resources$,
            mode: "static"
        };
    }
    let promises;
    for (;(promises = collector.$promises$).length > 0; ) {
        collector.$promises$ = [], await Promise.all(promises);
    }
    const canRender = collector.$elements$.length > 0;
    if (canRender) {
        for (const elCtx of collector.$deferElements$) {
            collectElementData(elCtx, collector, elCtx.$element$);
        }
        for (const ctx of allContexts) {
            collectProps(ctx, collector);
        }
    }
    for (;(promises = collector.$promises$).length > 0; ) {
        collector.$promises$ = [], await Promise.all(promises);
    }
    const elementToIndex = new Map;
    const objs = Array.from(collector.$objSet$.keys());
    const objToId = new Map;
    const getObjId = obj => {
        let suffix = "";
        if (isPromise(obj)) {
            const promiseValue = getPromiseValue(obj);
            if (!promiseValue) {
                return null;
            }
            obj = promiseValue.value, suffix += promiseValue.resolved ? "~" : "_";
        }
        if (isObject(obj)) {
            const target = getProxyTarget(obj);
            if (target) {
                suffix += "!", obj = target;
            } else if (isQwikElement(obj)) {
                const elID = (el => {
                    let id = elementToIndex.get(el);
                    return void 0 === id && (id = getQId(el), id || console.warn("Missing ID", el), 
                    elementToIndex.set(el, id)), id;
                })(obj);
                return elID ? "#" + elID + suffix : null;
            }
        }
        const id = objToId.get(obj);
        if (id) {
            return id + suffix;
        }
        const textId = textNodes?.get(obj);
        return textId ? "*" + textId : fallbackGetObjId ? fallbackGetObjId(obj) : null;
    };
    const mustGetObjId = obj => {
        const key = getObjId(obj);
        if (null === key) {
            throw qError(27, obj);
        }
        return key;
    };
    const subsMap = new Map;
    for (const obj of objs) {
        const subs = getManager(obj, containerState)?.$subs$;
        if (!subs) {
            continue;
        }
        const flags = getProxyFlags(obj) ?? 0;
        const converted = [];
        1 & flags && converted.push(flags);
        for (const sub of subs) {
            const host = sub[1];
            0 === sub[0] && isNode$1(host) && isVirtualElement(host) && !collector.$elements$.includes(tryGetContext(host)) || converted.push(sub);
        }
        converted.length > 0 && subsMap.set(obj, converted);
    }
    objs.sort(((a, b) => (subsMap.has(a) ? 0 : 1) - (subsMap.has(b) ? 0 : 1)));
    let count = 0;
    for (const obj of objs) {
        objToId.set(obj, intToStr(count)), count++;
    }
    if (collector.$noSerialize$.length > 0) {
        const undefinedID = objToId.get(void 0);
        assertDefined(undefinedID, "undefined ID must be defined");
        for (const obj of collector.$noSerialize$) {
            objToId.set(obj, undefinedID);
        }
    }
    const subs = [];
    for (const obj of objs) {
        const value = subsMap.get(obj);
        if (null == value) {
            break;
        }
        subs.push(value.map((s => "number" == typeof s ? `_${s}` : serializeSubscription(s, getObjId))).filter(isNotNullable));
    }
    assertEqual(subs.length, subsMap.size, "missing subscriptions to serialize", subs, subsMap);
    const convertedObjs = objs.map((obj => {
        if (null === obj) {
            return null;
        }
        const typeObj = typeof obj;
        switch (typeObj) {
          case "undefined":
            return UNDEFINED_PREFIX;

          case "number":
            if (!Number.isFinite(obj)) {
                break;
            }
            return obj;

          case "string":
          case "boolean":
            return obj;
        }
        const value = serializeValue(obj, mustGetObjId, collector, containerState);
        if (void 0 !== value) {
            return value;
        }
        if ("object" === typeObj) {
            if (isArray(obj)) {
                return obj.map(mustGetObjId);
            }
            if (isSerializableObject(obj)) {
                const output = {};
                for (const key in obj) {
                    const id = getObjId(obj[key]);
                    null !== id && (output[key] = id);
                }
                return output;
            }
        }
        throw qError(3, obj);
    }));
    const meta = {};
    const refs = {};
    for (const ctx of allContexts) {
        const node = ctx.$element$;
        const elementID = ctx.$id$;
        const ref = ctx.$refMap$;
        const props = ctx.$props$;
        const contexts = ctx.$contexts$;
        const watches = ctx.$watches$;
        const renderQrl = ctx.$componentQrl$;
        const seq = ctx.$seq$;
        const metaValue = {};
        const elementCaptured = isVirtualElement(node) && collector.$elements$.includes(ctx);
        if (assertDefined(elementID, "pause: can not generate ID for dom node", node), ref.length > 0) {
            assertElement(node);
            const value = mapJoin(ref, mustGetObjId, " ");
            value && (refs[elementID] = value);
        } else if (canRender) {
            let add = !1;
            if (elementCaptured) {
                assertDefined(renderQrl, "renderQrl must be defined");
                const propsId = getObjId(props);
                metaValue.h = mustGetObjId(renderQrl) + (propsId ? " " + propsId : ""), add = !0;
            } else {
                const propsId = getObjId(props);
                propsId && (metaValue.h = " " + propsId, add = !0);
            }
            if (watches && watches.length > 0) {
                const value = mapJoin(watches, getObjId, " ");
                value && (metaValue.w = value, add = !0);
            }
            if (elementCaptured && seq && seq.length > 0) {
                const value = mapJoin(seq, mustGetObjId, " ");
                metaValue.s = value, add = !0;
            }
            if (contexts) {
                const serializedContexts = [];
                contexts.forEach(((value, key) => {
                    const id = getObjId(value);
                    id && serializedContexts.push(`${key}=${id}`);
                }));
                const value = serializedContexts.join(" ");
                value && (metaValue.c = value, add = !0);
            }
            add && (meta[elementID] = metaValue);
        }
    }
    return {
        state: {
            refs,
            ctx: meta,
            objs: convertedObjs,
            subs
        },
        objs,
        funcs: collector.$inlinedFunctions$,
        resources: collector.$resources$,
        qrls: collector.$qrls$,
        mode: canRender ? "render" : "listeners"
    };
};

const mapJoin = (objects, getObjectId, sep) => {
    let output = "";
    for (const obj of objects) {
        const id = getObjectId(obj);
        null !== id && ("" !== output && (output += sep), output += id);
    }
    return output;
};

const getNodesInScope = (parent, predicate) => {
    const results = [];
    const v = predicate(parent);
    void 0 !== v && results.push(v);
    const walker = parent.ownerDocument.createTreeWalker(parent, 129, {
        acceptNode(node) {
            if (isContainer(node)) {
                return 2;
            }
            const v = predicate(node);
            return void 0 !== v && results.push(v), 3;
        }
    });
    for (;walker.nextNode(); ) {}
    return results;
};

const collectProps = (elCtx, collector) => {
    const parentCtx = elCtx.$parent$;
    const props = elCtx.$props$;
    if (parentCtx && props && !isEmptyObj(props) && collector.$elements$.includes(parentCtx)) {
        const subs = getProxyManager(props)?.$subs$;
        const el = elCtx.$element$;
        if (subs) {
            for (const sub of subs) {
                0 === sub[0] ? (sub[1] !== el && collectSubscriptions(getProxyManager(props), collector, !1), 
                collectElement(sub[1], collector)) : (collectValue(props, collector, !1), collectSubscriptions(getProxyManager(props), collector, !1));
            }
        }
    }
};

const createCollector = containerState => ({
    $containerState$: containerState,
    $seen$: new Set,
    $objSet$: new Set,
    $prefetch$: 0,
    $noSerialize$: [],
    $inlinedFunctions$: [],
    $resources$: [],
    $elements$: [],
    $qrls$: [],
    $deferElements$: [],
    $promises$: []
});

const collectDeferElement = (el, collector) => {
    const ctx = tryGetContext(el);
    collector.$elements$.includes(ctx) || (collector.$elements$.push(ctx), collector.$prefetch$++, 
    8 & ctx.$flags$ ? collectElementData(ctx, collector, !0) : collector.$deferElements$.push(ctx), 
    collector.$prefetch$--);
};

const collectElement = (el, collector) => {
    const ctx = tryGetContext(el);
    if (ctx) {
        if (collector.$elements$.includes(ctx)) {
            return;
        }
        collector.$elements$.push(ctx), collectElementData(ctx, collector, el);
    }
};

const collectElementData = (elCtx, collector, dynamicCtx) => {
    if (elCtx.$props$ && !isEmptyObj(elCtx.$props$) && (collectValue(elCtx.$props$, collector, dynamicCtx), 
    collectSubscriptions(getProxyManager(elCtx.$props$), collector, dynamicCtx)), elCtx.$componentQrl$ && collectValue(elCtx.$componentQrl$, collector, dynamicCtx), 
    elCtx.$seq$) {
        for (const obj of elCtx.$seq$) {
            collectValue(obj, collector, dynamicCtx);
        }
    }
    if (elCtx.$watches$) {
        const map = collector.$containerState$.$subsManager$.$groupToManagers$;
        for (const obj of elCtx.$watches$) {
            map.has(obj) && collectValue(obj, collector, dynamicCtx);
        }
    }
    if (!0 === dynamicCtx && (collectContext(elCtx, collector), elCtx.$dynamicSlots$)) {
        for (const slotCtx of elCtx.$dynamicSlots$) {
            collectContext(slotCtx, collector);
        }
    }
};

const collectContext = (elCtx, collector) => {
    for (;elCtx; ) {
        if (elCtx.$contexts$) {
            for (const obj of elCtx.$contexts$.values()) {
                collectValue(obj, collector, !0);
            }
            if (!0 === elCtx.$contexts$.get("_")) {
                break;
            }
        }
        elCtx = elCtx.$slotParent$ ?? elCtx.$parent$;
    }
};

const escapeText = str => str.replace(/<(\/?script)/g, "\\x3C$1");

const collectSubscriptions = (manager, collector, leaks) => {
    if (collector.$seen$.has(manager)) {
        return;
    }
    collector.$seen$.add(manager);
    const subs = manager.$subs$;
    assertDefined(subs, "subs must be defined");
    for (const key of subs) {
        const type = key[0];
        if (type > 0 && collectValue(key[2], collector, leaks), !0 === leaks) {
            const host = key[1];
            isNode$1(host) && isVirtualElement(host) ? 0 === type && collectDeferElement(host, collector) : collectValue(host, collector, !0);
        }
    }
};

const PROMISE_VALUE = Symbol();

const resolvePromise = promise => promise.then((value => (promise[PROMISE_VALUE] = {
    resolved: !0,
    value
}, value)), (value => (promise[PROMISE_VALUE] = {
    resolved: !1,
    value
}, value)));

const getPromiseValue = promise => promise[PROMISE_VALUE];

const collectValue = (obj, collector, leaks) => {
    if (null !== obj) {
        const objType = typeof obj;
        switch (objType) {
          case "function":
          case "object":
            {
                const seen = collector.$seen$;
                if (seen.has(obj)) {
                    return;
                }
                if (seen.add(obj), fastSkipSerialize(obj)) {
                    return collector.$objSet$.add(void 0), void collector.$noSerialize$.push(obj);
                }
                const input = obj;
                const target = getProxyTarget(obj);
                if (target) {
                    if (seen.has(obj = target)) {
                        return;
                    }
                    seen.add(obj);
                    const mutable = 0 == (2 & getProxyFlags(obj));
                    if (leaks && mutable && collectSubscriptions(getProxyManager(input), collector, leaks), 
                    fastWeakSerialize(input)) {
                        return void collector.$objSet$.add(obj);
                    }
                }
                if (collectDeps(obj, collector, leaks)) {
                    return void collector.$objSet$.add(obj);
                }
                if (isPromise(obj)) {
                    return void collector.$promises$.push((promise = obj, promise.then((value => (promise[PROMISE_VALUE] = {
                        resolved: !0,
                        value
                    }, value)), (value => (promise[PROMISE_VALUE] = {
                        resolved: !1,
                        value
                    }, value)))).then((value => {
                        collectValue(value, collector, leaks);
                    })));
                }
                if ("object" === objType) {
                    if (isNode$1(obj)) {
                        return;
                    }
                    if (isArray(obj)) {
                        for (let i = 0; i < obj.length; i++) {
                            collectValue(input[i], collector, leaks);
                        }
                    } else if (isSerializableObject(obj)) {
                        for (const key in obj) {
                            collectValue(input[key], collector, leaks);
                        }
                    }
                }
                break;
            }

          case "string":
            if (collector.$seen$.has(obj)) {
                return;
            }
        }
    }
    var promise;
    collector.$objSet$.add(obj);
};

const isContainer = el => isElement$1(el) && el.hasAttribute("q:container");

const hasContext = el => {
    const node = processVirtualNodes(el);
    if (isQwikElement(node)) {
        const ctx = tryGetContext(node);
        if (ctx && ctx.$id$) {
            return ctx;
        }
    }
};

const getManager = (obj, containerState) => {
    if (!isObject(obj)) {
        return;
    }
    if (obj instanceof SignalImpl) {
        return getProxyManager(obj);
    }
    const proxy = containerState.$proxyMap$.get(obj);
    return proxy ? getProxyManager(proxy) : void 0;
};

const getQId = el => {
    const ctx = tryGetContext(el);
    return ctx ? ctx.$id$ : null;
};

const getTextID = (node, containerState) => {
    const prev = node.previousSibling;
    if (prev && isComment(prev) && prev.data.startsWith("t=")) {
        return "#" + prev.data.slice(2);
    }
    const doc = node.ownerDocument;
    const id = intToStr(containerState.$elementIndex$++);
    const open = doc.createComment(`t=${id}`);
    const close = doc.createComment("");
    const parent = node.parentElement;
    return parent.insertBefore(open, node), parent.insertBefore(close, node.nextSibling), 
    "#" + id;
};

const isEmptyObj = obj => 0 === Object.keys(obj).length;

const EXTRACT_IMPORT_PATH = /\(\s*(['"])([^\1]+)\1\s*\)/;

const EXTRACT_SELF_IMPORT = /Promise\s*\.\s*resolve/;

const EXTRACT_FILE_NAME = /[\\/(]([\w\d.\-_]+\.(js|ts)x?):/;

const announcedQRL = /*#__PURE__*/ new Set;

const qrl = (chunkOrFn, symbol, lexicalScopeCapture = EMPTY_ARRAY, stackOffset = 0) => {
    let chunk = null;
    let symbolFn = null;
    if (isFunction(chunkOrFn)) {
        symbolFn = chunkOrFn;
        {
            let match;
            const srcCode = String(chunkOrFn);
            if ((match = srcCode.match(EXTRACT_IMPORT_PATH)) && match[2]) {
                chunk = match[2];
            } else {
                if (!(match = srcCode.match(EXTRACT_SELF_IMPORT))) {
                    throw qError(11, srcCode);
                }
                {
                    const ref = "QWIK-SELF";
                    const frames = new Error(ref).stack.split("\n");
                    const start = frames.findIndex((f => f.includes(ref)));
                    match = frames[start + 2 + stackOffset].match(EXTRACT_FILE_NAME), chunk = match ? match[1] : "main";
                }
            }
        }
    } else {
        if (!isString(chunkOrFn)) {
            throw qError(12, chunkOrFn);
        }
        chunk = chunkOrFn;
    }
    return announcedQRL.has(symbol) && (announcedQRL.add(symbol), emitEvent("qprefetch", {
        symbols: [ getSymbolHash(symbol) ]
    })), createQRL(chunk, symbol, null, symbolFn, null, lexicalScopeCapture, null);
};

const inlinedQrl = (symbol, symbolName, lexicalScopeCapture = EMPTY_ARRAY) => createQRL(null, symbolName, symbol, null, null, lexicalScopeCapture, null);

const _noopQrl = (symbolName, lexicalScopeCapture = EMPTY_ARRAY) => createQRL(null, symbolName, null, null, null, lexicalScopeCapture, null);

const qrlDEV = (chunkOrFn, symbol, opts, lexicalScopeCapture = EMPTY_ARRAY) => {
    const newQrl = qrl(chunkOrFn, symbol, lexicalScopeCapture, 1);
    return newQrl.dev = opts, newQrl;
};

const inlinedQrlDEV = (symbol, symbolName, opts, lexicalScopeCapture = EMPTY_ARRAY) => {
    const qrl = inlinedQrl(symbol, symbolName, lexicalScopeCapture);
    return qrl.dev = opts, qrl;
};

const serializeQRL = (qrl, opts = {}) => {
    assertTrue(true, "In order to serialize a QRL, qSerialize must be true"), assertQrl(qrl);
    let symbol = qrl.$symbol$;
    let chunk = qrl.$chunk$;
    const refSymbol = qrl.$refSymbol$ ?? symbol;
    const platform = getPlatform();
    if (platform) {
        const result = platform.chunkForSymbol(refSymbol, chunk);
        result && (chunk = result[1], qrl.$refSymbol$ || (symbol = result[0]));
    }
    if (!chunk) {
        throw qError(31, qrl.$symbol$);
    }
    chunk.startsWith("./") && (chunk = chunk.slice(2));
    let output = `${chunk}#${symbol}`;
    const capture = qrl.$capture$;
    const captureRef = qrl.$captureRef$;
    return captureRef && captureRef.length ? opts.$getObjId$ ? output += `[${mapJoin(captureRef, opts.$getObjId$, " ")}]` : opts.$addRefMap$ && (output += `[${mapJoin(captureRef, opts.$addRefMap$, " ")}]`) : capture && capture.length > 0 && (output += `[${capture.join(" ")}]`), 
    output;
};

const serializeQRLs = (existingQRLs, elCtx) => {
    assertElement(elCtx.$element$);
    const opts = {
        $addRefMap$: obj => addToArray(elCtx.$refMap$, obj)
    };
    return mapJoin(existingQRLs, (qrl => serializeQRL(qrl, opts)), "\n");
};

const parseQRL = (qrl, containerEl) => {
    const endIdx = qrl.length;
    const hashIdx = indexOf(qrl, 0, "#");
    const captureIdx = indexOf(qrl, hashIdx, "[");
    const chunkEndIdx = Math.min(hashIdx, captureIdx);
    const chunk = qrl.substring(0, chunkEndIdx);
    const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
    const symbol = symbolStartIdx == captureIdx ? "default" : qrl.substring(symbolStartIdx, captureIdx);
    const capture = captureIdx === endIdx ? EMPTY_ARRAY : qrl.substring(captureIdx + 1, endIdx - 1).split(" ");
    const iQrl = createQRL(chunk, symbol, null, null, capture, null, null);
    return containerEl && iQrl.$setContainer$(containerEl), iQrl;
};

const indexOf = (text, startIdx, char) => {
    const endIdx = text.length;
    const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
    return -1 == charIdx ? endIdx : charIdx;
};

const addToArray = (array, obj) => {
    const index = array.indexOf(obj);
    return -1 === index ? (array.push(obj), String(array.length - 1)) : String(index);
};

const inflateQrl = (qrl, elCtx) => (assertDefined(qrl.$capture$, "invoke: qrl capture must be defined inside useLexicalScope()", qrl), 
qrl.$captureRef$ = qrl.$capture$.map((idx => {
    const int = parseInt(idx, 10);
    const obj = elCtx.$refMap$[int];
    return assertTrue(elCtx.$refMap$.length > int, "out of bounds inflate access", idx), 
    obj;
})));

const _regSymbol = (symbol, hash) => (void 0 === globalThis.__qwik_reg_symbols && (globalThis.__qwik_reg_symbols = new Map), 
globalThis.__qwik_reg_symbols.set(hash, symbol), symbol);

const useResourceQrl = (qrl, opts) => {
    const {get, set, i, iCtx, elCtx} = useSequentialScope();
    if (null != get) {
        return get;
    }
    assertQrl(qrl);
    const containerState = iCtx.$renderCtx$.$static$.$containerState$;
    const resource = createResourceReturn(containerState, opts);
    const watch = new Task(WatchFlagsIsDirty | WatchFlagsIsResource, i, elCtx.$element$, qrl, resource);
    const previousWait = Promise.all(iCtx.$waitOn$.slice());
    return runResource(watch, containerState, iCtx.$renderCtx$, previousWait), elCtx.$watches$ || (elCtx.$watches$ = []), 
    elCtx.$watches$.push(watch), set(resource), resource;
};

const useResource$ = (generatorFn, opts) => useResourceQrl($(generatorFn), opts);

const Resource = props => {
    const isBrowser = !isServerPlatform();
    const resource = props.value;
    let promise;
    if (isResourceReturn(resource)) {
        if (isBrowser) {
            if (props.onRejected && (resource.value.catch((() => {})), "rejected" === resource._state)) {
                return props.onRejected(resource._error);
            }
            if (props.onPending) {
                const state = resource._state;
                if ("resolved" === state) {
                    return props.onResolved(resource._resolved);
                }
                if ("pending" === state) {
                    return props.onPending();
                }
                if ("rejected" === state) {
                    throw resource._error;
                }
            }
            if (void 0 !== untrack((() => resource._resolved))) {
                return props.onResolved(resource._resolved);
            }
        }
        promise = resource.value;
    } else if (resource instanceof Promise) {
        promise = resource;
    } else {
        if (!isSignal(resource)) {
            return props.onResolved(resource);
        }
        promise = Promise.resolve(resource.value);
    }
    return jsx(Fragment, {
        children: promise.then(useBindInvokeContext(props.onResolved), useBindInvokeContext(props.onRejected))
    });
};

const _createResourceReturn = opts => ({
    __brand: "resource",
    value: void 0,
    loading: !isServerPlatform(),
    _resolved: void 0,
    _error: void 0,
    _state: "pending",
    _timeout: opts?.timeout ?? -1,
    _cache: 0
});

const createResourceReturn = (containerState, opts, initialPromise) => {
    const result = _createResourceReturn(opts);
    result.value = initialPromise;
    return createProxy(result, containerState, void 0);
};

const isResourceReturn = obj => isObject(obj) && "resource" === obj.__brand;

const serializeResource = (resource, getObjId) => {
    const state = resource._state;
    return "resolved" === state ? `0 ${getObjId(resource._resolved)}` : "pending" === state ? "1" : `2 ${getObjId(resource._error)}`;
};

const parseResourceReturn = data => {
    const [first, id] = data.split(" ");
    const result = _createResourceReturn(void 0);
    return result.value = Promise.resolve(), "0" === first ? (result._state = "resolved", 
    result._resolved = id, result.loading = !1) : "1" === first ? (result._state = "pending", 
    result.value = new Promise((() => {})), result.loading = !0) : "2" === first && (result._state = "rejected", 
    result._error = id, result.loading = !1), result;
};

const Slot = props => _jsxC(Virtual, {
    "q:s": ""
}, 0, props.name ?? "");

const UNDEFINED_PREFIX = "";

const QRLSerializer = {
    $prefix$: "",
    $test$: v => isQrl(v),
    $collect$: (v, collector, leaks) => {
        if (v.$captureRef$) {
            for (const item of v.$captureRef$) {
                collectValue(item, collector, leaks);
            }
        }
        0 === collector.$prefetch$ && collector.$qrls$.push(v);
    },
    $serialize$: (obj, getObjId) => serializeQRL(obj, {
        $getObjId$: getObjId
    }),
    $prepare$: (data, containerState) => parseQRL(data, containerState.$containerEl$),
    $fill$: (qrl, getObject) => {
        qrl.$capture$ && qrl.$capture$.length > 0 && (qrl.$captureRef$ = qrl.$capture$.map(getObject), 
        qrl.$capture$ = null);
    }
};

const TaskSerializer = {
    $prefix$: "",
    $test$: v => isSubscriberDescriptor(v),
    $collect$: (v, collector, leaks) => {
        collectValue(v.$qrl$, collector, leaks), v.$state$ && (collectValue(v.$state$, collector, leaks), 
        !0 === leaks && v.$state$ instanceof SignalImpl && collectSubscriptions(v.$state$[QObjectManagerSymbol], collector, !0));
    },
    $serialize$: (obj, getObjId) => serializeWatch(obj, getObjId),
    $prepare$: data => parseTask(data),
    $fill$: (watch, getObject) => {
        watch.$el$ = getObject(watch.$el$), watch.$qrl$ = getObject(watch.$qrl$), watch.$state$ && (watch.$state$ = getObject(watch.$state$));
    }
};

const ResourceSerializer = {
    $prefix$: "",
    $test$: v => isResourceReturn(v),
    $collect$: (obj, collector, leaks) => {
        collectValue(obj.value, collector, leaks), collectValue(obj._resolved, collector, leaks);
    },
    $serialize$: (obj, getObjId) => serializeResource(obj, getObjId),
    $prepare$: data => parseResourceReturn(data),
    $fill$: (resource, getObject) => {
        if ("resolved" === resource._state) {
            resource._resolved = getObject(resource._resolved), resource.value = Promise.resolve(resource._resolved);
        } else if ("rejected" === resource._state) {
            const p = Promise.reject(resource._error);
            p.catch((() => null)), resource._error = getObject(resource._error), resource.value = p;
        }
    }
};

const URLSerializer = {
    $prefix$: "",
    $test$: v => v instanceof URL,
    $serialize$: obj => obj.href,
    $prepare$: data => new URL(data),
    $fill$: void 0
};

const DateSerializer = {
    $prefix$: "",
    $test$: v => v instanceof Date,
    $serialize$: obj => obj.toISOString(),
    $prepare$: data => new Date(data),
    $fill$: void 0
};

const RegexSerializer = {
    $prefix$: "",
    $test$: v => v instanceof RegExp,
    $serialize$: obj => `${obj.flags} ${obj.source}`,
    $prepare$: data => {
        const space = data.indexOf(" ");
        const source = data.slice(space + 1);
        const flags = data.slice(0, space);
        return new RegExp(source, flags);
    },
    $fill$: void 0
};

const ErrorSerializer = {
    $prefix$: "",
    $test$: v => v instanceof Error,
    $serialize$: obj => obj.message,
    $prepare$: text => {
        const err = new Error(text);
        return err.stack = void 0, err;
    },
    $fill$: void 0
};

const DocumentSerializer = {
    $prefix$: "",
    $test$: v => isDocument(v),
    $serialize$: void 0,
    $prepare$: (_, _c, doc) => doc,
    $fill$: void 0
};

const SERIALIZABLE_STATE = Symbol("serializable-data");

const ComponentSerializer = {
    $prefix$: "",
    $test$: obj => isQwikComponent(obj),
    $serialize$: (obj, getObjId) => {
        const [qrl] = obj[SERIALIZABLE_STATE];
        return serializeQRL(qrl, {
            $getObjId$: getObjId
        });
    },
    $prepare$: (data, containerState) => {
        const qrl = parseQRL(data, containerState.$containerEl$);
        return componentQrl(qrl);
    },
    $fill$: (component, getObject) => {
        const [qrl] = component[SERIALIZABLE_STATE];
        qrl.$capture$ && qrl.$capture$.length > 0 && (qrl.$captureRef$ = qrl.$capture$.map(getObject), 
        qrl.$capture$ = null);
    }
};

const DerivedSignalSerializer = {
    $prefix$: "",
    $test$: obj => obj instanceof SignalDerived,
    $collect$: (obj, collector, leaks) => {
        if (obj.$args$) {
            for (const arg of obj.$args$) {
                collectValue(arg, collector, leaks);
            }
        }
    },
    $serialize$: (signal, getObjID, collector) => {
        const serialized = serializeDerivedSignalFunc(signal);
        let index = collector.$inlinedFunctions$.indexOf(serialized);
        return index < 0 && (collector.$inlinedFunctions$.push(serialized), index = collector.$inlinedFunctions$.length - 1), 
        mapJoin(signal.$args$, getObjID, " ") + " @" + intToStr(index);
    },
    $prepare$: data => {
        const ids = data.split(" ");
        const args = ids.slice(0, -1);
        const fn = ids[ids.length - 1];
        return new SignalDerived(fn, args, fn);
    },
    $fill$: (fn, getObject) => {
        assertString(fn.$func$, "fn.$func$ should be a string"), fn.$func$ = getObject(fn.$func$), 
        fn.$args$ = fn.$args$.map(getObject);
    }
};

const SignalSerializer = {
    $prefix$: "",
    $test$: v => v instanceof SignalImpl,
    $collect$: (obj, collector, leaks) => {
        collectValue(obj.untrackedValue, collector, leaks);
        return !0 === leaks && 0 == (1 & obj[QObjectSignalFlags]) && collectSubscriptions(obj[QObjectManagerSymbol], collector, !0), 
        obj;
    },
    $serialize$: (obj, getObjId) => getObjId(obj.untrackedValue),
    $prepare$: (data, containerState) => new SignalImpl(data, containerState?.$subsManager$?.$createManager$(), 0),
    $subs$: (signal, subs) => {
        signal[QObjectManagerSymbol].$addSubs$(subs);
    },
    $fill$: (signal, getObject) => {
        signal.untrackedValue = getObject(signal.untrackedValue);
    }
};

const SignalWrapperSerializer = {
    $prefix$: "",
    $test$: v => v instanceof SignalWrapper,
    $collect$(obj, collector, leaks) {
        if (collectValue(obj.ref, collector, leaks), fastWeakSerialize(obj.ref)) {
            const localManager = getProxyManager(obj.ref);
            isTreeShakeable(collector.$containerState$.$subsManager$, localManager, leaks) && collectValue(obj.ref[obj.prop], collector, leaks);
        }
        return obj;
    },
    $serialize$: (obj, getObjId) => `${getObjId(obj.ref)} ${obj.prop}`,
    $prepare$: data => {
        const [id, prop] = data.split(" ");
        return new SignalWrapper(id, prop);
    },
    $fill$: (signal, getObject) => {
        signal.ref = getObject(signal.ref);
    }
};

const NoFiniteNumberSerializer = {
    $prefix$: "",
    $test$: v => "number" == typeof v,
    $serialize$: v => String(v),
    $prepare$: data => Number(data),
    $fill$: void 0
};

const URLSearchParamsSerializer = {
    $prefix$: "",
    $test$: v => v instanceof URLSearchParams,
    $serialize$: obj => obj.toString(),
    $prepare$: data => new URLSearchParams(data),
    $fill$: void 0
};

const FormDataSerializer = {
    $prefix$: "",
    $test$: v => "undefined" != typeof FormData && v instanceof globalThis.FormData,
    $serialize$: formData => {
        const array = [];
        return formData.forEach(((value, key) => {
            array.push("string" == typeof value ? [ key, value ] : [ key, value.name ]);
        })), JSON.stringify(array);
    },
    $prepare$: data => {
        const array = JSON.parse(data);
        const formData = new FormData;
        for (const [key, value] of array) {
            formData.append(key, value);
        }
        return formData;
    },
    $fill$: void 0
};

const JSXNodeSerializer = {
    $prefix$: "",
    $test$: v => isJSXNode(v),
    $collect$: (node, collector, leaks) => {
        collectValue(node.children, collector, leaks), collectValue(node.props, collector, leaks), 
        collectValue(node.immutableProps, collector, leaks);
        let type = node.type;
        type === Slot ? type = ":slot" : type === Fragment && (type = ":fragment"), collectValue(type, collector, leaks);
    },
    $serialize$: (node, getObjID) => {
        let type = node.type;
        return type === Slot ? type = ":slot" : type === Fragment && (type = ":fragment"), 
        `${getObjID(type)} ${getObjID(node.props)} ${getObjID(node.immutableProps)} ${getObjID(node.children)} ${node.flags}`;
    },
    $prepare$: data => {
        const [type, props, immutableProps, children, flags] = data.split(" ");
        return new JSXNodeImpl(type, props, immutableProps, children, parseInt(flags, 10));
    },
    $fill$: (node, getObject) => {
        node.type = getResolveJSXType(getObject(node.type)), node.props = getObject(node.props), 
        node.immutableProps = getObject(node.immutableProps), node.children = getObject(node.children);
    }
};

const BigIntSerializer = {
    $prefix$: "",
    $test$: v => "bigint" == typeof v,
    $serialize$: v => v.toString(),
    $prepare$: data => BigInt(data),
    $fill$: void 0
};

const DATA = Symbol();

const SetSerializer = {
    $prefix$: "",
    $test$: v => v instanceof Set,
    $collect$: (set, collector, leaks) => {
        set.forEach((value => collectValue(value, collector, leaks)));
    },
    $serialize$: (v, getObjID) => Array.from(v).map(getObjID).join(" "),
    $prepare$: data => {
        const set = new Set;
        return set[DATA] = data, set;
    },
    $fill$: (set, getObject) => {
        const data = set[DATA];
        set[DATA] = void 0, assertString(data, "SetSerializer should be defined");
        for (const id of data.split(" ")) {
            set.add(getObject(id));
        }
    }
};

const MapSerializer = {
    $prefix$: "",
    $test$: v => v instanceof Map,
    $collect$: (map, collector, leaks) => {
        map.forEach(((value, key) => {
            collectValue(value, collector, leaks), collectValue(key, collector, leaks);
        }));
    },
    $serialize$: (map, getObjID) => {
        const result = [];
        return map.forEach(((value, key) => {
            result.push(getObjID(key) + " " + getObjID(value));
        })), result.join(" ");
    },
    $prepare$: data => {
        const set = new Map;
        return set[DATA] = data, set;
    },
    $fill$: (set, getObject) => {
        const data = set[DATA];
        set[DATA] = void 0, assertString(data, "SetSerializer should be defined");
        const items = data.split(" ");
        assertTrue(items.length % 2 == 0, "MapSerializer should have even number of items");
        for (let i = 0; i < items.length; i += 2) {
            set.set(getObject(items[i]), getObject(items[i + 1]));
        }
    }
};

const serializers = [ QRLSerializer, SignalSerializer, SignalWrapperSerializer, TaskSerializer, ResourceSerializer, URLSerializer, DateSerializer, RegexSerializer, ErrorSerializer, DerivedSignalSerializer, FormDataSerializer, URLSearchParamsSerializer, ComponentSerializer, NoFiniteNumberSerializer, JSXNodeSerializer, BigIntSerializer, SetSerializer, MapSerializer, DocumentSerializer ];

const collectorSerializers = /*#__PURE__*/ serializers.filter((a => a.$collect$));

const canSerialize = obj => {
    for (const s of serializers) {
        if (s.$test$(obj)) {
            return !0;
        }
    }
    return !1;
};

const collectDeps = (obj, collector, leaks) => {
    for (const s of collectorSerializers) {
        if (s.$test$(obj)) {
            return s.$collect$(obj, collector, leaks), !0;
        }
    }
    return !1;
};

const serializeValue = (obj, getObjID, collector, containerState) => {
    for (const s of serializers) {
        if (s.$test$(obj)) {
            let value = s.$prefix$;
            return s.$serialize$ && (value += s.$serialize$(obj, getObjID, collector, containerState)), 
            value;
        }
    }
};

const createParser = (containerState, doc) => {
    const fillMap = new Map;
    const subsMap = new Map;
    return {
        prepare(data) {
            for (const s of serializers) {
                const prefix = s.$prefix$;
                if (data.startsWith(prefix)) {
                    const value = s.$prepare$(data.slice(prefix.length), containerState, doc);
                    return s.$fill$ && fillMap.set(value, s), s.$subs$ && subsMap.set(value, s), value;
                }
            }
            return data;
        },
        subs(obj, subs) {
            const serializer = subsMap.get(obj);
            return !!serializer && (serializer.$subs$(obj, subs, containerState), !0);
        },
        fill(obj, getObject) {
            const serializer = fillMap.get(obj);
            return !!serializer && (serializer.$fill$(obj, getObject, containerState), !0);
        }
    };
};

const OBJECT_TRANSFORMS = {
    "!": (obj, containerState) => containerState.$proxyMap$.get(obj) ?? getOrCreateProxy(obj, containerState),
    "~": obj => Promise.resolve(obj),
    _: obj => Promise.reject(obj)
};

const isTreeShakeable = (manager, target, leaks) => {
    if ("boolean" == typeof leaks) {
        return leaks;
    }
    const localManager = manager.$groupToManagers$.get(leaks);
    return !!(localManager && localManager.length > 0) && (1 !== localManager.length || localManager[0] !== target);
};

const getResolveJSXType = type => ":slot" === type ? Slot : ":fragment" === type ? Fragment : type;

const verifySerializable = (value, preMessage) => {
    const seen = new Set;
    return _verifySerializable(value, seen, "_", preMessage);
};

const _verifySerializable = (value, seen, ctx, preMessage) => {
    const unwrapped = unwrapProxy(value);
    if (null == unwrapped) {
        return value;
    }
    if (shouldSerialize(unwrapped)) {
        if (seen.has(unwrapped)) {
            return value;
        }
        if (seen.add(unwrapped), canSerialize(unwrapped)) {
            return value;
        }
        const typeObj = typeof unwrapped;
        switch (typeObj) {
          case "object":
            if (isPromise(unwrapped)) {
                return value;
            }
            if (isNode$1(unwrapped)) {
                return value;
            }
            if (isArray(unwrapped)) {
                let expectIndex = 0;
                return unwrapped.forEach(((v, i) => {
                    if (i !== expectIndex) {
                        throw qError(3, unwrapped);
                    }
                    _verifySerializable(v, seen, ctx + "[" + i + "]"), expectIndex = i + 1;
                })), value;
            }
            if (isSerializableObject(unwrapped)) {
                for (const [key, item] of Object.entries(unwrapped)) {
                    _verifySerializable(item, seen, ctx + "." + key);
                }
                return value;
            }
            break;

          case "boolean":
          case "string":
          case "number":
            return value;
        }
        let message = "";
        if (message = preMessage || "Value cannot be serialized", "_" !== ctx && (message += ` in ${ctx},`), 
        "object" === typeObj) {
            message += ` because it's an instance of "${value?.constructor.name}". You might need to use 'noSerialize()' or use an object literal instead. Check out https://qwik.builder.io/docs/advanced/dollar/`;
        } else if ("function" === typeObj) {
            const fnName = value.name;
            message += ` because it's a function named "${fnName}". You might need to convert it to a QRL using $(fn):\n\nconst ${fnName} = $(${String(value)});\n\nPlease check out https://qwik.builder.io/docs/advanced/qrl/ for more information.`;
        }
        throw console.error("Trying to serialize", value), createError(message);
    }
    return value;
};

const noSerializeSet = /*#__PURE__*/ new WeakSet;

const weakSerializeSet = /*#__PURE__*/ new WeakSet;

const shouldSerialize = obj => !isObject(obj) && !isFunction(obj) || !noSerializeSet.has(obj);

const fastSkipSerialize = obj => noSerializeSet.has(obj);

const fastWeakSerialize = obj => weakSerializeSet.has(obj);

const noSerialize = input => (null != input && noSerializeSet.add(input), input);

const _weakSerialize = input => (weakSerializeSet.add(input), input);

const isConnected = sub => isSubscriberDescriptor(sub) ? isConnected(sub.$el$) : !!tryGetContext(sub) || sub.isConnected;

const unwrapProxy = proxy => isObject(proxy) ? getProxyTarget(proxy) ?? proxy : proxy;

const getProxyTarget = obj => obj[QOjectTargetSymbol];

const getProxyManager = obj => obj[QObjectManagerSymbol];

const getProxyFlags = obj => obj[QObjectFlagsSymbol];

const serializeSubscription = (sub, getObjId) => {
    const type = sub[0];
    const host = "string" == typeof sub[1] ? sub[1] : getObjId(sub[1]);
    if (!host) {
        return;
    }
    let base = type + " " + host;
    let key;
    if (0 === type) {
        key = sub[2];
    } else {
        const signalID = getObjId(sub[2]);
        if (!signalID) {
            return;
        }
        if (type <= 2) {
            key = sub[5], base += ` ${signalID} ${must(getObjId(sub[3]))} ${sub[4]}`;
        } else if (type <= 4) {
            key = sub[4];
            base += ` ${signalID} ${"string" == typeof sub[3] ? sub[3] : must(getObjId(sub[3]))}`;
        } else {
            assertFail("Should not get here");
        }
    }
    return key && (base += ` ${encodeURI(key)}`), base;
};

const parseSubscription = (sub, getObject) => {
    const parts = sub.split(" ");
    const type = parseInt(parts[0], 10);
    assertTrue(parts.length >= 2, "At least 2 parts");
    const host = getObject(parts[1]);
    if (!host) {
        return;
    }
    if (isSubscriberDescriptor(host) && !host.$el$) {
        return;
    }
    const subscription = [ type, host ];
    return 0 === type ? (assertTrue(parts.length <= 3, "Max 3 parts"), subscription.push(safeDecode(parts[2]))) : type <= 2 ? (assertTrue(5 === parts.length || 6 === parts.length, "Type 1 has 5"), 
    subscription.push(getObject(parts[2]), getObject(parts[3]), parts[4], safeDecode(parts[5]))) : type <= 4 && (assertTrue(4 === parts.length || 5 === parts.length, "Type 2 has 4"), 
    subscription.push(getObject(parts[2]), getObject(parts[3]), safeDecode(parts[4]))), 
    subscription;
};

const safeDecode = str => {
    if (void 0 !== str) {
        return decodeURI(str);
    }
};

const createSubscriptionManager = containerState => {
    const groupToManagers = new Map;
    const manager = {
        $groupToManagers$: groupToManagers,
        $createManager$: initialMap => new LocalSubscriptionManager(groupToManagers, containerState, initialMap),
        $clearSub$: group => {
            const managers = groupToManagers.get(group);
            if (managers) {
                for (const manager of managers) {
                    manager.$unsubGroup$(group);
                }
                groupToManagers.delete(group), managers.length = 0;
            }
        },
        $clearSignal$: signal => {
            const managers = groupToManagers.get(signal[1]);
            if (managers) {
                for (const manager of managers) {
                    manager.$unsubEntry$(signal);
                }
            }
        }
    };
    return seal(), manager;
};

class LocalSubscriptionManager {
    constructor($groupToManagers$, $containerState$, initialMap) {
        this.$groupToManagers$ = $groupToManagers$, this.$containerState$ = $containerState$, 
        this.$subs$ = [], initialMap && this.$addSubs$(initialMap), seal();
    }
    $addSubs$(subs) {
        this.$subs$.push(...subs);
        for (const sub of this.$subs$) {
            this.$addToGroup$(sub[1], this);
        }
    }
    $addToGroup$(group, manager) {
        let managers = this.$groupToManagers$.get(group);
        managers || this.$groupToManagers$.set(group, managers = []), managers.includes(manager) || managers.push(manager);
    }
    $unsubGroup$(group) {
        const subs = this.$subs$;
        for (let i = 0; i < subs.length; i++) {
            subs[i][1] === group && (subs.splice(i, 1), i--);
        }
    }
    $unsubEntry$(entry) {
        const [type, group, signal, elm] = entry;
        const subs = this.$subs$;
        if (1 === type || 2 === type) {
            const prop = entry[4];
            for (let i = 0; i < subs.length; i++) {
                const sub = subs[i];
                sub[0] === type && sub[1] === group && sub[2] === signal && sub[3] === elm && sub[4] === prop && (subs.splice(i, 1), 
                i--);
            }
        } else if (3 === type || 4 === type) {
            for (let i = 0; i < subs.length; i++) {
                const sub = subs[i];
                sub[0] === type && sub[1] === group && sub[2] === signal && sub[3] === elm && (subs.splice(i, 1), 
                i--);
            }
        }
    }
    $addSub$(sub, key) {
        const subs = this.$subs$;
        const group = sub[1];
        0 === sub[0] && subs.some((([_type, _group, _key]) => 0 === _type && _group === group && _key === key)) || (subs.push([ ...sub, key ]), 
        this.$addToGroup$(group, this));
    }
    $notifySubs$(key) {
        const subs = this.$subs$;
        for (const sub of subs) {
            const compare = sub[sub.length - 1];
            key && compare && compare !== key || notifyChange(sub, this.$containerState$);
        }
    }
}

const must = a => {
    if (null == a) {
        throw logError("must be non null", a);
    }
    return a;
};

const isQrl = value => "function" == typeof value && "function" == typeof value.getSymbol;

const createQRL = (chunk, symbol, symbolRef, symbolFn, capture, captureRef, refSymbol) => {
    let _containerEl;
    const setContainer = el => (_containerEl || (_containerEl = el), _containerEl);
    const resolve = async containerEl => {
        if (containerEl && setContainer(containerEl), null !== symbolRef) {
            return symbolRef;
        }
        if (null !== symbolFn) {
            return symbolRef = symbolFn().then((module => symbolRef = module[symbol]));
        }
        {
            const symbol2 = getPlatform().importSymbol(_containerEl, chunk, symbol);
            return symbolRef = then(symbol2, (ref => symbolRef = ref));
        }
    };
    const resolveLazy = containerEl => null !== symbolRef ? symbolRef : resolve(containerEl);
    function invokeFn(currentCtx, beforeFn) {
        return (...args) => {
            const start = now();
            const fn = resolveLazy();
            return then(fn, (fn => {
                if (isFunction(fn)) {
                    if (beforeFn && !1 === beforeFn()) {
                        return;
                    }
                    const context = {
                        ...createInvocationContext(currentCtx),
                        $qrl$: QRL
                    };
                    return void 0 === context.$event$ && (context.$event$ = this), emitUsedSymbol(symbol, context.$element$, start), 
                    invoke.call(this, context, fn, ...args);
                }
                throw qError(10);
            }));
        };
    }
    const createInvocationContext = invoke => null == invoke ? newInvokeContext() : isArray(invoke) ? newInvokeContextFromTuple(invoke) : invoke;
    const invokeQRL = async function(...args) {
        const fn = invokeFn.call(this, tryGetInvokeContext());
        return await fn(...args);
    };
    const resolvedSymbol = refSymbol ?? symbol;
    const hash = getSymbolHash(resolvedSymbol);
    const QRL = invokeQRL;
    const qrl = Object.assign(invokeQRL, {
        getSymbol: () => resolvedSymbol,
        getHash: () => hash,
        getCaptured: () => captureRef,
        resolve,
        $resolveLazy$: resolveLazy,
        $setContainer$: setContainer,
        $chunk$: chunk,
        $symbol$: symbol,
        $refSymbol$: refSymbol,
        $hash$: hash,
        getFn: invokeFn,
        $capture$: capture,
        $captureRef$: captureRef,
        dev: null
    });
    return seal(), qrl;
};

const getSymbolHash = symbolName => {
    const index = symbolName.lastIndexOf("_");
    return index > -1 ? symbolName.slice(index + 1) : symbolName;
};

function assertQrl() {
    qDev;
}

function assertSignal() {
    qDev;
}

const EMITTED = /*#__PURE__*/ new Set;

const emitUsedSymbol = (symbol, element, reqTime) => {
    EMITTED.has(symbol) || (EMITTED.add(symbol), emitEvent("qsymbol", {
        symbol,
        element,
        reqTime
    }));
};

const emitEvent = (eventName, detail) => {
    isServerPlatform() || "object" != typeof document || document.dispatchEvent(new CustomEvent(eventName, {
        bubbles: !1,
        detail
    }));
};

const now = () => isServerPlatform() ? 0 : "object" == typeof performance ? performance.now() : 0;

let runtimeSymbolId = 0;

const $ = expression => createQRL(null, "s" + runtimeSymbolId++, expression, null, null, null, null);

const eventQrl = qrl => qrl;

const event$ = implicit$FirstArg(eventQrl);

const componentQrl = componentQrl => {
    function QwikComponent(props, key, flags) {
        assertQrl(componentQrl), assertNumber(flags, "The Qwik Component was not invoked correctly");
        const hash = componentQrl.$hash$.slice(0, 4);
        return _jsxC(Virtual, {
            "q:renderFn": componentQrl,
            [QSlot]: props[QSlot],
            [_IMMUTABLE]: props[_IMMUTABLE],
            children: props.children,
            props
        }, flags, hash + ":" + (key || ""));
    }
    return QwikComponent[SERIALIZABLE_STATE] = [ componentQrl ], QwikComponent;
};

const isQwikComponent = component => "function" == typeof component && void 0 !== component[SERIALIZABLE_STATE];

const component$ = onMount => componentQrl($(onMount));

const flattenArray = (array, dst) => {
    dst || (dst = []);
    for (const item of array) {
        isArray(item) ? flattenArray(item, dst) : dst.push(item);
    }
    return dst;
};

function h(type, props, ...children) {
    const normalizedProps = {
        children: arguments.length > 2 ? flattenArray(children) : void 0
    };
    let key;
    let i;
    for (i in props) {
        "key" == i ? key = props[i] : normalizedProps[i] = props[i];
    }
    return "string" == typeof type && !key && "dangerouslySetInnerHTML" in normalizedProps && (key = "innerhtml"), 
    jsx(type, normalizedProps, key);
}

const render = async (parent, jsxNode, opts) => {
    isJSXNode(jsxNode) || (jsxNode = jsx(jsxNode, null));
    const doc = getDocument(parent);
    const containerEl = getElement(parent);
    injectQContainer(containerEl);
    const containerState = _getContainerState(containerEl);
    const serverData = opts?.serverData;
    serverData && Object.assign(containerState.$serverData$, serverData);
    const rCtx = createRenderContext(doc, containerState);
    return containerState.$hostsRendering$ = new Set, containerState.$styleMoved$ = !0, 
    await renderRoot(rCtx, containerEl, jsxNode, doc, containerState, containerEl), 
    await postRendering(containerState, rCtx), {
        cleanup() {
            cleanupContainer(rCtx, containerEl);
        }
    };
};

const renderRoot = async (rCtx, parent, jsxNode) => {
    const staticCtx = rCtx.$static$;
    try {
        const processedNodes = await processData(jsxNode);
        const rootJsx = domToVnode(parent);
        await smartUpdateChildren(rCtx, rootJsx, wrapJSX(parent, processedNodes), 0);
    } catch (err) {
        logError(err);
    }
    staticCtx.$operations$.push(...staticCtx.$postOperations$), executeDOMRender(staticCtx), 
    printRenderStats();
};

const getElement = docOrElm => isDocument(docOrElm) ? docOrElm.documentElement : docOrElm;

const injectQContainer = containerEl => {
    directSetAttribute(containerEl, "q:version", version ?? "dev"), directSetAttribute(containerEl, "q:container", "resumed"), 
    directSetAttribute(containerEl, "q:render", "dom");
};

function cleanupContainer(renderCtx, container) {
    cleanupTree(container, renderCtx.$static$, renderCtx.$static$.$containerState$.$subsManager$, !0), 
    delete container[CONTAINER_STATE], directRemoveAttribute(container, "q:version"), 
    directRemoveAttribute(container, "q:container"), directRemoveAttribute(container, "q:render"), 
    container.replaceChildren();
}

const useStore = (initialState, opts) => {
    const {get, set, iCtx} = useSequentialScope();
    if (null != get) {
        return get;
    }
    const value = isFunction(initialState) ? invoke(void 0, initialState) : initialState;
    if (!1 === opts?.reactive) {
        return set(value), value;
    }
    {
        const newStore = getOrCreateProxy(value, iCtx.$renderCtx$.$static$.$containerState$, opts?.deep ?? !0 ? 1 : 0);
        return set(newStore), newStore;
    }
};

const useId = () => {
    const {get, set, elCtx, iCtx} = useSequentialScope();
    if (null != get) {
        return get;
    }
    const containerBase = iCtx.$renderCtx$?.$static$?.$containerState$?.$base$ || "";
    return set(`${containerBase ? hashCode(containerBase) : ""}-${elCtx.$componentQrl$?.getHash() || ""}-${getNextIndex(iCtx.$renderCtx$) || ""}`);
};

function useServerData(key, defaultValue) {
    const ctx = tryGetInvokeContext();
    return ctx?.$renderCtx$?.$static$.$containerState$.$serverData$[key] ?? defaultValue;
}

const STYLE_CACHE = /*#__PURE__*/ new Map;

const getScopedStyles = (css, scopeId) => {
    let styleCss = STYLE_CACHE.get(scopeId);
    return styleCss || STYLE_CACHE.set(scopeId, styleCss = scopeStylesheet(css, scopeId)), 
    styleCss;
};

const scopeStylesheet = (css, scopeId) => {
    const end = css.length;
    const out = [];
    const stack = [];
    let idx = 0;
    let lastIdx = idx;
    let mode = rule;
    let lastCh = 0;
    for (;idx < end; ) {
        const chIdx = idx;
        let ch = css.charCodeAt(idx++);
        ch === BACKSLASH && (idx++, ch = A);
        const arcs = STATE_MACHINE[mode];
        for (let i = 0; i < arcs.length; i++) {
            const arc = arcs[i];
            const [expectLastCh, expectCh, newMode] = arc;
            if ((expectLastCh === lastCh || expectLastCh === ANY || expectLastCh === IDENT && isIdent(lastCh) || expectLastCh === WHITESPACE && isWhiteSpace(lastCh)) && (expectCh === ch || expectCh === ANY || expectCh === IDENT && isIdent(ch) || expectCh === NOT_IDENT && !isIdent(ch) && ch !== DOT || expectCh === WHITESPACE && isWhiteSpace(ch)) && (3 == arc.length || lookAhead(arc))) {
                if (arc.length > 3 && (ch = css.charCodeAt(idx - 1)), newMode === EXIT || newMode == EXIT_INSERT_SCOPE) {
                    if (newMode === EXIT_INSERT_SCOPE) {
                        if (mode !== starSelector || shouldNotInsertScoping()) {
                            if (!isChainedSelector(ch)) {
                                insertScopingSelector(idx - (expectCh == NOT_IDENT ? 1 : expectCh == CLOSE_PARENTHESIS ? 2 : 0));
                            }
                        } else {
                            isChainedSelector(ch) ? flush(idx - 2) : insertScopingSelector(idx - 2), lastIdx++;
                        }
                    }
                    expectCh === NOT_IDENT && (idx--, ch = lastCh);
                    do {
                        mode = stack.pop() || rule, mode === pseudoGlobal && (flush(idx - 1), lastIdx++);
                    } while (isSelfClosingRule(mode));
                } else {
                    stack.push(mode), mode === pseudoGlobal && newMode === rule ? (flush(idx - 8), lastIdx = idx) : newMode === pseudoElement && insertScopingSelector(chIdx), 
                    mode = newMode;
                }
                break;
            }
        }
        lastCh = ch;
    }
    return flush(idx), out.join("");
    function flush(idx) {
        out.push(css.substring(lastIdx, idx)), lastIdx = idx;
    }
    function insertScopingSelector(idx) {
        mode === pseudoGlobal || shouldNotInsertScoping() || (flush(idx), out.push(".", "⭐️", scopeId));
    }
    function lookAhead(arc) {
        let prefix = 0;
        if (css.charCodeAt(idx) === DASH) {
            for (let i = 1; i < 10; i++) {
                if (css.charCodeAt(idx + i) === DASH) {
                    prefix = i + 1;
                    break;
                }
            }
        }
        words: for (let arcIndx = 3; arcIndx < arc.length; arcIndx++) {
            const txt = arc[arcIndx];
            for (let i = 0; i < txt.length; i++) {
                if ((css.charCodeAt(idx + i + prefix) | LOWERCASE) !== txt.charCodeAt(i)) {
                    continue words;
                }
            }
            return idx += txt.length + prefix, !0;
        }
        return !1;
    }
    function shouldNotInsertScoping() {
        return -1 !== stack.indexOf(pseudoGlobal) || -1 !== stack.indexOf(atRuleSelector);
    }
};

const isIdent = ch => ch >= _0 && ch <= _9 || ch >= A && ch <= Z || ch >= a && ch <= z || ch >= 128 || ch === UNDERSCORE || ch === DASH;

const isChainedSelector = ch => ch === COLON || ch === DOT || ch === OPEN_BRACKET || ch === HASH || isIdent(ch);

const isSelfClosingRule = mode => mode === atRuleBlock || mode === atRuleSelector || mode === atRuleInert || mode === pseudoGlobal;

const isWhiteSpace = ch => ch === SPACE || ch === TAB || ch === NEWLINE || ch === CARRIAGE_RETURN;

const rule = 0;

const elementClassIdSelector = 1;

const starSelector = 2;

const pseudoClassWithSelector = 3;

const pseudoClass = 4;

const pseudoGlobal = 5;

const pseudoElement = 6;

const attrSelector = 7;

const inertParenthesis = 8;

const inertBlock = 9;

const atRuleSelector = 10;

const atRuleBlock = 11;

const atRuleInert = 12;

const body = 13;

const stringSingle = 14;

const stringDouble = 15;

const commentMultiline = 16;

const EXIT = 17;

const EXIT_INSERT_SCOPE = 18;

const ANY = 0;

const IDENT = 1;

const NOT_IDENT = 2;

const WHITESPACE = 3;

const TAB = 9;

const NEWLINE = 10;

const CARRIAGE_RETURN = 13;

const SPACE = 32;

const DOUBLE_QUOTE = 34;

const HASH = 35;

const SINGLE_QUOTE = 39;

const OPEN_PARENTHESIS = 40;

const CLOSE_PARENTHESIS = 41;

const STAR = 42;

const DASH = 45;

const DOT = 46;

const FORWARD_SLASH = 47;

const _0 = 48;

const _9 = 57;

const COLON = 58;

const SEMICOLON = 59;

const AT = 64;

const A = 65;

const Z = 90;

const OPEN_BRACKET = 91;

const CLOSE_BRACKET = 93;

const BACKSLASH = 92;

const UNDERSCORE = 95;

const LOWERCASE = 32;

const a = 97;

const z = 122;

const OPEN_BRACE = 123;

const CLOSE_BRACE = 125;

const STRINGS_COMMENTS = [ [ ANY, 39, 14 ], [ ANY, 34, 15 ], [ ANY, 47, 16, "*" ] ];

const STATE_MACHINE = [ [ [ ANY, 42, starSelector ], [ ANY, OPEN_BRACKET, 7 ], [ ANY, COLON, pseudoElement, ":", "before", "after", "first-letter", "first-line" ], [ ANY, COLON, pseudoGlobal, "global" ], [ ANY, COLON, 3, "has", "host-context", "not", "where", "is", "matches", "any" ], [ ANY, COLON, 4 ], [ ANY, IDENT, 1 ], [ ANY, DOT, 1 ], [ ANY, HASH, 1 ], [ ANY, 64, atRuleSelector, "keyframe" ], [ ANY, 64, atRuleBlock, "media", "supports" ], [ ANY, 64, atRuleInert ], [ ANY, 123, 13 ], [ 47, 42, 16 ], [ ANY, 59, EXIT ], [ ANY, 125, EXIT ], [ ANY, CLOSE_PARENTHESIS, EXIT ], ...STRINGS_COMMENTS ], [ [ ANY, NOT_IDENT, EXIT_INSERT_SCOPE ] ], [ [ ANY, NOT_IDENT, EXIT_INSERT_SCOPE ] ], [ [ ANY, 40, rule ], [ ANY, NOT_IDENT, EXIT_INSERT_SCOPE ] ], [ [ ANY, 40, 8 ], [ ANY, NOT_IDENT, EXIT_INSERT_SCOPE ] ], [ [ ANY, 40, rule ], [ ANY, NOT_IDENT, EXIT ] ], [ [ ANY, NOT_IDENT, EXIT ] ], [ [ ANY, 93, EXIT_INSERT_SCOPE ], [ ANY, 39, 14 ], [ ANY, 34, 15 ] ], [ [ ANY, CLOSE_PARENTHESIS, EXIT ], ...STRINGS_COMMENTS ], [ [ ANY, 125, EXIT ], ...STRINGS_COMMENTS ], [ [ ANY, 125, EXIT ], [ WHITESPACE, IDENT, 1 ], [ ANY, COLON, pseudoGlobal, "global" ], [ ANY, 123, 13 ], ...STRINGS_COMMENTS ], [ [ ANY, 123, rule ], [ ANY, 59, EXIT ], ...STRINGS_COMMENTS ], [ [ ANY, 59, EXIT ], [ ANY, 123, 9 ], ...STRINGS_COMMENTS ], [ [ ANY, 125, EXIT ], [ ANY, 123, 13 ], [ ANY, 40, 8 ], ...STRINGS_COMMENTS ], [ [ ANY, 39, EXIT ] ], [ [ ANY, 34, EXIT ] ], [ [ 42, 47, EXIT ] ] ];

const useStylesQrl = styles => {
    _useStyles(styles, (str => str), !1);
};

const useStyles$ = /*#__PURE__*/ implicit$FirstArg(useStylesQrl);

const useStylesScopedQrl = styles => ({
    scopeId: "⭐️" + _useStyles(styles, getScopedStyles, !0)
});

const useStylesScoped$ = /*#__PURE__*/ implicit$FirstArg(useStylesScopedQrl);

const _useStyles = (styleQrl, transform, scoped) => {
    assertQrl(styleQrl);
    const {get, set, iCtx, i, elCtx} = useSequentialScope();
    if (get) {
        return get;
    }
    const styleId = (index = i, assertQrl(qStyles = styleQrl), `${hashCode(qStyles.$hash$)}-${index}`);
    var qStyles, index;
    const containerState = iCtx.$renderCtx$.$static$.$containerState$;
    if (set(styleId), elCtx.$appendStyles$ || (elCtx.$appendStyles$ = []), elCtx.$scopeIds$ || (elCtx.$scopeIds$ = []), 
    scoped && elCtx.$scopeIds$.push(styleContent(styleId)), containerState.$styleIds$.has(styleId)) {
        return styleId;
    }
    containerState.$styleIds$.add(styleId);
    const value = styleQrl.$resolveLazy$(containerState.$containerEl$);
    const appendStyle = styleText => {
        assertDefined(elCtx.$appendStyles$, "appendStyles must be defined"), elCtx.$appendStyles$.push({
            styleId,
            content: transform(styleText, styleId)
        });
    };
    return isPromise(value) ? iCtx.$waitOn$.push(value.then(appendStyle)) : appendStyle(value), 
    styleId;
};

const useSignal = initialState => {
    const {get, set, iCtx} = useSequentialScope();
    if (null != get) {
        return get;
    }
    const containerState = iCtx.$renderCtx$.$static$.$containerState$;
    const value = isFunction(initialState) && !isQwikComponent(initialState) ? invoke(void 0, initialState) : initialState;
    return set(_createSignal(value, containerState, 0, void 0));
};

const useErrorBoundary = () => {
    const store = useStore({
        error: void 0
    });
    return useOn("error-boundary", qrl("/runtime", "error", [ store ])), useContextProvider(ERROR_CONTEXT, store), 
    store;
};

export { $, Fragment, HTMLFragment, RenderOnce, Resource, SSRComment, SSRHint, SSRRaw, SSRStream, SSRStreamBlock, SkipRender, Slot, _IMMUTABLE, _deserializeData, _fnSignal, _getContextElement, _getContextEvent, _hW, _jsxBranch, _jsxC, _jsxQ, _jsxS, _noopQrl, _pauseFromContexts, _regSymbol, _renderSSR, _restProps, _serializeData, verifySerializable as _verifySerializable, _waitUntilRendered, _weakSerialize, _wrapProp, _wrapSignal, component$, componentQrl, createContextId, h as createElement, event$, eventQrl, getLocale, getPlatform, h, implicit$FirstArg, inlinedQrl, inlinedQrlDEV, jsx, jsxDEV, jsx as jsxs, noSerialize, qrl, qrlDEV, render, setPlatform, untrack, useComputed$, useComputedQrl, useContext, useContextProvider, useErrorBoundary, useId, useLexicalScope, useOn, useOnDocument, useOnWindow, useResource$, useResourceQrl, useServerData, useSignal, useStore, useStyles$, useStylesQrl, useStylesScoped$, useStylesScopedQrl, useTask$, useTaskQrl, useVisibleTask$, useVisibleTaskQrl, version, withLocale };
