/**
 * @license
 * @builder.io/qwik
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
// minification can replace the `globalThis.qDev` with `false`
// which will remove all dev code within from the build
const qDev = true;
const qTest = globalThis.describe !== undefined;

const EMPTY_ARRAY = [];
const EMPTY_OBJ = {};
if (qDev) {
    Object.freeze(EMPTY_ARRAY);
    Object.freeze(EMPTY_OBJ);
}

const STYLE = qDev
    ? `background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`
    : '';
const logError = (message, ...optionalParams) => {
    // eslint-disable-next-line no-console
    console.error('%cQWIK ERROR', STYLE, message, ...optionalParams);
};
const logWarn = (message, ...optionalParams) => {
    // eslint-disable-next-line no-console
    console.warn('%cQWIK WARN', STYLE, message, ...optionalParams);
};
const logDebug = (message, ...optionalParams) => {
    if (qDev) {
        // eslint-disable-next-line no-console
        console.debug('%cQWIK', STYLE, message, ...optionalParams);
    }
};

function assertDefined(value, text) {
    if (qDev) {
        if (value != null)
            return;
        throw newError(text || 'Expected defined value');
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
    debugger; // eslint-disable-line no-debugger
    const error = new Error(text);
    logError(error); // eslint-disable-line no-console
    return error;
}

/**
 * State factory of the component.
 */
/**
 * State factory of the component.
 */
const QHostAttr = 'q:host';
const OnRenderProp = 'q:renderFn';
/**
 * State factory of the component.
 */
const QHostSelector = '[q\\:host]';
/**
 * Component Styles.
 */
const ComponentScopedStyles = 'q:sstyle';
/**
 * Component style host prefix
 */
const ComponentStylesPrefixHost = '💎';
/**
 * Component style content prefix
 */
const ComponentStylesPrefixContent = '⭐️';
/**
 * `<some-element q:slot="...">`
 */
const QSlotAttr = 'q:slot';
const QCtxAttr = 'q:ctx';
const QContainerAttr = 'q:container';
const QContainerSelector = '[q\\:container]';
const RenderEvent = 'qRender';
const ELEMENT_ID = 'q:id';
const ELEMENT_ID_PREFIX = '#';

function getDocument(node) {
    if (typeof document !== 'undefined') {
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

const CONTAINER = Symbol('container');
function isStyleTask(obj) {
    return obj && typeof obj === 'object' && obj.type === 'style';
}
let _context;
function tryGetInvokeContext() {
    if (!_context) {
        const context = typeof document !== 'undefined' && document && document.__q_context__;
        if (!context) {
            return undefined;
        }
        if (Array.isArray(context)) {
            const element = context[0];
            const hostElement = getHostElement(element);
            assertDefined(element);
            return (document.__q_context__ = newInvokeContext(getDocument(element), hostElement, element, context[1], context[2]));
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
    }
    finally {
        const currentCtx = _context;
        _context = previousContext;
        if (currentCtx.waitOn && currentCtx.waitOn.length > 0) {
            // eslint-disable-next-line no-unsafe-finally
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
        event: event,
        url: url || null,
        qrl: undefined,
    };
}
/**
 * @alpha
 */
function useWaitOn(promise) {
    const ctx = getInvokeContext();
    (ctx.waitOn || (ctx.waitOn = [])).push(promise);
}
function getHostElement(el) {
    let foundSlot = false;
    let node = el;
    while (node) {
        const isHost = node.hasAttribute(QHostAttr);
        const isSlot = node.tagName === 'Q:SLOT';
        if (isHost) {
            if (!foundSlot) {
                break;
            }
            else {
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
    const ctx = getInvokeContext();
    const containerState = ctx.renderCtx?.containerState;
    if (!containerState) {
        throw new Error('Cant access containerState for existing context');
    }
    return containerState;
}

function flattenArray(array, dst) {
    // Yes this function is just Array.flat, but we need to run on old versions of Node.
    if (!dst)
        dst = [];
    for (const item of array) {
        if (Array.isArray(item)) {
            flattenArray(item, dst);
        }
        else {
            dst.push(item);
        }
    }
    return dst;
}

function isPromise(value) {
    return value instanceof Promise;
}
const then = (promise, thenFn, rejectFn) => {
    return isPromise(promise) ? promise.then(thenFn, rejectFn) : thenFn(promise);
};
const promiseAll = (promises) => {
    const hasPromise = promises.some(isPromise);
    if (hasPromise) {
        return Promise.all(promises);
    }
    return promises;
};

function isQrl(value) {
    return value instanceof QRLInternal;
}
class QRL {
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
        return this.refSymbol ?? this.symbol;
    }
    getCanonicalSymbol() {
        return getCanonicalSymbol(this.refSymbol ?? this.symbol);
    }
    async resolve(el) {
        if (el) {
            this.setContainer(el);
        }
        return qrlImport(this.el, this);
    }
    resolveIfNeeded(el) {
        return typeof this.symbolRef === 'function' ? this.symbolRef : this.resolve(el);
    }
    invokeFn(el, currentCtx, beforeFn) {
        return ((...args) => {
            const fn = this.resolveIfNeeded(el);
            return then(fn, (fn) => {
                if (typeof fn === 'function') {
                    const baseContext = currentCtx ?? newInvokeContext();
                    const context = {
                        ...baseContext,
                        qrl: this,
                    };
                    if (beforeFn) {
                        beforeFn();
                    }
                    return useInvoke(context, fn, ...args);
                }
                throw new Error('QRL is not a function');
            });
        });
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
}
const getCanonicalSymbol = (symbolName) => {
    const index = symbolName.lastIndexOf('_');
    if (index > -1) {
        return symbolName.slice(index + 1);
    }
    return symbolName;
};
const isSameQRL = (a, b) => {
    return a.getCanonicalSymbol() === b.getCanonicalSymbol();
};
const QRLInternal = QRL;

const createPlatform = (doc) => {
    const moduleCache = new Map();
    return {
        isServer: false,
        importSymbol(element, url, symbolName) {
            const urlDoc = toUrl(doc, element, url).toString();
            const urlCopy = new URL(urlDoc);
            urlCopy.hash = '';
            urlCopy.search = '';
            const importURL = urlCopy.href;
            const mod = moduleCache.get(importURL);
            if (mod) {
                return mod[symbolName];
            }
            return import(/* @vite-ignore */ importURL).then((mod) => {
                mod = findModule(mod);
                moduleCache.set(importURL, mod);
                return mod[symbolName];
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
            return undefined;
        },
    };
};
function findModule(module) {
    return Object.values(module).find(isModule) || module;
}
function isModule(module) {
    return typeof module === 'object' && module && module[Symbol.toStringTag] === 'Module';
}
/**
 * Convert relative base URI and relative URL into a fully qualified URL.
 *
 * @param base -`QRL`s are relative, and therefore they need a base for resolution.
 *    - `Element` use `base.ownerDocument.baseURI`
 *    - `Document` use `base.baseURI`
 *    - `string` use `base` as is
 *    - `QConfig` use `base.baseURI`
 * @param url - relative URL
 * @returns fully qualified URL.
 */
function toUrl(doc, element, url) {
    const containerEl = getContainer(element);
    const base = new URL(containerEl?.getAttribute('q:base') ?? doc.baseURI, doc.baseURI);
    return new URL(url, base);
}
/**
 * @public
 */
const setPlatform = (doc, plt) => (doc[DocumentPlatform] = plt);
/**
 * @public
 */
const getPlatform = (docOrNode) => {
    const doc = getDocument(docOrNode);
    return doc[DocumentPlatform] || (doc[DocumentPlatform] = createPlatform(doc));
};
const DocumentPlatform = /*@__PURE__*/ Symbol();

/**
 * @private
 */
function isHtmlElement(node) {
    return node ? node.nodeType === 1 : false;
}

function stringifyDebug(value) {
    if (value == null)
        return String(value);
    if (typeof value === 'function')
        return value.name;
    if (isHtmlElement(value))
        return stringifyElement(value);
    if (value instanceof URL)
        return String(value);
    if (typeof value === 'object')
        return JSON.stringify(value, function (key, value) {
            if (isHtmlElement(value))
                return stringifyElement(value);
            return value;
        });
    return String(value);
}
function stringifyElement(element) {
    let html = '<' + element.localName;
    const attributes = element.attributes;
    const names = [];
    for (let i = 0; i < attributes.length; i++) {
        names.push(attributes[i].name);
    }
    names.sort();
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        let value = element.getAttribute(name);
        if (value?.startsWith('file:/')) {
            value = value.replace(/(file:\/\/).*(\/.*)$/, (all, protocol, file) => protocol + '...' + file);
        }
        html +=
            ' ' + name + (value == null || value == '' ? '' : "='" + value.replace("'", '&apos;') + "'");
    }
    return html + '>';
}

var QError;
(function (QError) {
    // core 000-099
    QError[QError["TODO"] = 0] = "TODO";
    QError[QError["Core_qConfigNotFound_path"] = 1] = "Core_qConfigNotFound_path";
    QError[QError["Core_unrecognizedStack_frame"] = 2] = "Core_unrecognizedStack_frame";
    QError[QError["Core_noAttribute_atr1_element"] = 3] = "Core_noAttribute_atr1_element";
    QError[QError["Core_noAttribute_atr1_attr2_element"] = 4] = "Core_noAttribute_atr1_attr2_element";
    QError[QError["Core_missingProperty_name_props"] = 5] = "Core_missingProperty_name_props";
    QError[QError["Core_missingExport_name_url_props"] = 6] = "Core_missingExport_name_url_props";
    // QRL 100-199
    QError[QError["QRL_expectFunction_url_actual"] = 100] = "QRL_expectFunction_url_actual";
    // Injection 200-299
    QError[QError["Injector_noHost_element"] = 200] = "Injector_noHost_element";
    QError[QError["Injector_expectedSpecificInjector_expected_actual"] = 201] = "Injector_expectedSpecificInjector_expected_actual";
    QError[QError["Injector_notElement_arg"] = 202] = "Injector_notElement_arg";
    QError[QError["Injector_wrongMethodThis_expected_actual"] = 203] = "Injector_wrongMethodThis_expected_actual";
    QError[QError["Injector_missingSerializedState_entityKey_element"] = 204] = "Injector_missingSerializedState_entityKey_element";
    QError[QError["Injector_notFound_element"] = 206] = "Injector_notFound_element";
    QError[QError["Injector_eventInjectorNotSerializable"] = 207] = "Injector_eventInjectorNotSerializable";
    // Entities 300-399
    QError[QError["Entity_notValidKey_key"] = 300] = "Entity_notValidKey_key";
    QError[QError["Entity_keyAlreadyExists_key"] = 301] = "Entity_keyAlreadyExists_key";
    QError[QError["Entity_invalidAttribute_name"] = 303] = "Entity_invalidAttribute_name";
    QError[QError["Entity_missingExpandoOrState_attrName"] = 304] = "Entity_missingExpandoOrState_attrName";
    QError[QError["Entity_elementMissingEntityAttr_element_attr"] = 305] = "Entity_elementMissingEntityAttr_element_attr";
    QError[QError["Entity_noState_entity_props"] = 306] = "Entity_noState_entity_props";
    QError[QError["Entity_expected_obj"] = 307] = "Entity_expected_obj";
    QError[QError["Entity_overridesConstructor_entity"] = 308] = "Entity_overridesConstructor_entity";
    QError[QError["Entity_keyMissingParts_key_key"] = 309] = "Entity_keyMissingParts_key_key";
    QError[QError["Entity_no$type_entity"] = 310] = "Entity_no$type_entity";
    QError[QError["Entity_no$keyProps_entity"] = 311] = "Entity_no$keyProps_entity";
    QError[QError["Entity_no$qrl_entity"] = 312] = "Entity_no$qrl_entity";
    QError[QError["Entity_nameCollision_name_currentQrl_expectedQrl"] = 313] = "Entity_nameCollision_name_currentQrl_expectedQrl";
    QError[QError["Entity_keyTooManyParts_entity_parts_key"] = 314] = "Entity_keyTooManyParts_entity_parts_key";
    QError[QError["Entity_keyNameMismatch_key_name_entity_name"] = 315] = "Entity_keyNameMismatch_key_name_entity_name";
    QError[QError["Entity_stateMissingKey_state"] = 316] = "Entity_stateMissingKey_state";
    // Component 400-499
    QError[QError["Component_bindNeedsKey"] = 400] = "Component_bindNeedsKey";
    QError[QError["Component_bindNeedsValue"] = 401] = "Component_bindNeedsValue";
    QError[QError["Component_needsState"] = 402] = "Component_needsState";
    QError[QError["Component_needsInjectionContext_constructor"] = 403] = "Component_needsInjectionContext_constructor";
    QError[QError["Component_noProperty_propName_props_host"] = 404] = "Component_noProperty_propName_props_host";
    QError[QError["Component_notFound_component"] = 405] = "Component_notFound_component";
    QError[QError["Component_doesNotMatch_component_actual"] = 406] = "Component_doesNotMatch_component_actual";
    QError[QError["Component_noState_component_props"] = 408] = "Component_noState_component_props";
    // Provider 500-599
    QError[QError["Provider_unrecognizedFormat_value"] = 500] = "Provider_unrecognizedFormat_value";
    // Render 600-699
    QError[QError["Render_unexpectedJSXNodeType_type"] = 600] = "Render_unexpectedJSXNodeType_type";
    QError[QError["Render_unsupportedFormat_obj_attr"] = 601] = "Render_unsupportedFormat_obj_attr";
    QError[QError["Render_expectingEntity_entity"] = 602] = "Render_expectingEntity_entity";
    QError[QError["Render_expectingEntityArray_obj"] = 603] = "Render_expectingEntityArray_obj";
    QError[QError["Render_expectingEntityOrComponent_obj"] = 604] = "Render_expectingEntityOrComponent_obj";
    QError[QError["Render_stateMachineStuck"] = 699] = "Render_stateMachineStuck";
    // Event
    QError[QError["Event_emitEventRequiresName_url"] = 700] = "Event_emitEventRequiresName_url";
    QError[QError["Event_emitEventCouldNotFindListener_event_element"] = 701] = "Event_emitEventCouldNotFindListener_event_element";
})(QError || (QError = {}));
function qError(code, ...args) {
    if (qDev) {
        const text = codeToText(code);
        const parts = text.split('{}');
        const error = parts
            .map((value, index) => {
            return value + (index === parts.length - 1 ? '' : stringifyDebug(args[index]));
        })
            .join('');
        debugger; // eslint-disable-line no-debugger
        return new Error(error);
    }
    else {
        return new Error(`QError ` + code);
    }
}
function codeToText(code) {
    const area = {
        0: 'ERROR',
        1: 'QRL-ERROR',
        2: 'INJECTOR-ERROR',
        3: 'SERVICE-ERROR',
        4: 'COMPONENT-ERROR',
        5: 'PROVIDER-ERROR',
        6: 'RENDER-ERROR',
        7: 'EVENT-ERROR',
    }[Math.floor(code / 100)];
    const text = {
        [QError.TODO]: '{}',
        [QError.Core_qConfigNotFound_path]: "QConfig not found in path '{}'.",
        [QError.Core_unrecognizedStack_frame]: "Unrecognized stack format '{}'",
        [QError.Core_noAttribute_atr1_element]: "Could not find entity state '{}' at '{}' or any of it's parents.",
        [QError.Core_noAttribute_atr1_attr2_element]: "Could not find entity state '{}' ( or entity provider '{}') at '{}' or any of it's parents.",
        [QError.Core_missingProperty_name_props]: "Missing property '{}' in props '{}'.",
        [QError.Core_missingExport_name_url_props]: "Missing export '{}' from '{}'. Exported symbols are: {}",
        //////////////
        [QError.QRL_expectFunction_url_actual]: "QRL '${}' should point to function, was '{}'.",
        //////////////
        [QError.Injector_noHost_element]: "Can't find host element above '{}'.",
        [QError.Injector_expectedSpecificInjector_expected_actual]: "Provider is expecting '{}' but got '{}'.",
        [QError.Injector_notElement_arg]: "Expected 'Element' was '{}'.",
        [QError.Injector_wrongMethodThis_expected_actual]: "Expected injection 'this' to be of type '{}', but was of type '{}'.",
        [QError.Injector_missingSerializedState_entityKey_element]: "Entity key '{}' is found on '{}' but does not contain state. Was 'serializeState()' not run during dehydration?",
        [QError.Injector_notFound_element]: "No injector can be found starting at '{}'.",
        [QError.Injector_eventInjectorNotSerializable]: 'EventInjector does not support serialization.',
        //////////////
        [QError.Entity_notValidKey_key]: "Data key '{}' is not a valid key.\n" +
            '  - Data key can only contain characters (preferably lowercase) or number\n' +
            '  - Data key is prefixed with entity name\n' +
            "  - Data key is made up from parts that are separated with ':'.",
        [QError.Entity_keyAlreadyExists_key]: "A entity with key '{}' already exists.",
        [QError.Entity_invalidAttribute_name]: "'{}' is not a valid attribute. " +
            "Attributes can only contain 'a-z' (lowercase), '0-9', '-' and '_'.",
        [QError.Entity_missingExpandoOrState_attrName]: "Found '{}' but expando did not have entity and attribute did not have state.",
        [QError.Entity_elementMissingEntityAttr_element_attr]: "Element '{}' is missing entity attribute definition '{}'.",
        [QError.Entity_noState_entity_props]: "Unable to create state for entity '{}' with props '{}' because no state found and '$newState()' method was not defined on entity.",
        [QError.Entity_expected_obj]: "'{}' is not an instance of 'Entity'.",
        [QError.Entity_overridesConstructor_entity]: "'{}' overrides 'constructor' property preventing 'EntityType' retrieval.",
        [QError.Entity_no$keyProps_entity]: "Entity '{}' does not define '$keyProps'.",
        [QError.Entity_no$type_entity]: "Entity '{}' must have static '$type' property defining the name of the entity.",
        [QError.Entity_no$qrl_entity]: "Entity '{}' must have static '$qrl' property defining the import location of the entity.",
        [QError.Entity_nameCollision_name_currentQrl_expectedQrl]: "Name collision. Already have entity named '{}' with QRL '{}' but expected QRL '{}'.",
        [QError.Entity_keyMissingParts_key_key]: "Entity key '{}' is missing values. Expecting '{}:someValue'.",
        [QError.Entity_keyTooManyParts_entity_parts_key]: "Entity '{}' defines '$keyProps' as  '{}'. Actual key '{}' has more parts than entity defines.",
        [QError.Entity_keyNameMismatch_key_name_entity_name]: "Key '{}' belongs to entity named '{}', but expected entity '{}' with name '{}'.",
        [QError.Entity_stateMissingKey_state]: "Entity state is missing '$key'. Are you sure you passed in state? Got '{}'.",
        //////////////
        [QError.Component_bindNeedsKey]: "'bind:' must have an key. (Example: 'bind:key=\"propertyName\"').",
        [QError.Component_bindNeedsValue]: "'bind:id' must have a property name. (Example: 'bind:key=\"propertyName\"').",
        [QError.Component_needsState]: "Can't find state on host element.",
        [QError.Component_needsInjectionContext_constructor]: "Components must be instantiated inside an injection context. Use '{}.new(...)' for creation.",
        [QError.Component_noProperty_propName_props_host]: "Property '{}' not found in '{}' on component '{}'.",
        [QError.Component_notFound_component]: "Unable to find '{}' component.",
        [QError.Component_doesNotMatch_component_actual]: "Requesting component type '{}' does not match existing component instance '{}'.",
        [QError.Component_noState_component_props]: "Unable to create state for component '{}' with props '{}' because no state found and '$newState()' method was not defined on component.",
        //////////////
        [QError.Provider_unrecognizedFormat_value]: "Unrecognized expression format '{}'.",
        //////////////
        [QError.Render_unexpectedJSXNodeType_type]: 'Unexpected JSXNode<{}> type.',
        [QError.Render_unsupportedFormat_obj_attr]: "Value '{}' can't be written into '{}' attribute.",
        [QError.Render_expectingEntity_entity]: "Expecting entity object, got '{}'.",
        [QError.Render_expectingEntityArray_obj]: "Expecting array of entities, got '{}'.",
        [QError.Render_expectingEntityOrComponent_obj]: "Expecting Entity or Component got '{}'.",
        [QError.Render_stateMachineStuck]: 'Render state machine did not advance.',
        //////////////
        [QError.Event_emitEventRequiresName_url]: "Missing '$type' attribute in the '{}' url.",
        [QError.Event_emitEventCouldNotFindListener_event_element]: "Re-emitting event '{}' but no listener found at '{}' or any of its parents.",
    }[code];
    let textCode = '000' + code;
    textCode = textCode.slice(-3);
    return `${area}(Q-${textCode}): ${text}`;
}

function isNode$1(value) {
    return value && typeof value.nodeType == 'number';
}
function isDocument(value) {
    return value && value.nodeType == 9;
}
function isElement(value) {
    return isNode$1(value) && value.nodeType === 1;
}

// <docs markdown="../readme.md#$">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#$ instead)
/**
 * Qwik Optimizer marker function.
 *
 * Use `$(...)` to tell Qwik Optimizer to extract the expression in `$(...)` into a lazy-loadable
 * resource referenced by `QRL`.
 *
 * @see `implicit$FirstArg` for additional `____$(...)` rules.
 *
 * In this example `$(...)` is used to capture the callback function of `onmousemove` into
 * lazy-loadable reference. This allows the code to refer to the function without actually
 * loading the function. In this example, the callback function does not get loaded until
 * `mousemove` event fires.
 *
 * ```tsx
 * useOnDocument(
 *   'mousemove',
 *   $(() => console.log('mousemove'))
 * );
 * ```
 *
 * In this code the Qwik Optimizer detects `$(...)` and transforms the code into:
 *
 * ```tsx
 * // FILE: <current file>
 * useOnDocument('mousemove', qrl('./chunk-abc.js', 'onMousemove'));
 *
 * // FILE: chunk-abc.js
 * export const onMousemove = () => console.log('mousemove');
 * ```
 *
 * ## Special Rules
 *
 * The Qwik Optimizer places special rules on functions that can be lazy-loaded.
 *
 * 1. The expression of the `$(expression)` function must be importable by the system.
 * (expression shows up in `import` or has `export`)
 * 2. If inlined function then all lexically captured values must be:
 *    - importable (vars shows up in `import` or has `export`)
 *    - const (The capturing process differs from JS capturing in that writing to captured
 * variables does not update them, and therefore writes are forbidden. The best practice is that
 * all captured variables are constants.)
 *    - Must be runtime serializable.
 *
 * ```tsx
 * import { importedFn } from './import/example';
 *
 * export const greet = () => console.log('greet');
 * function topLevelFn() {}
 *
 * function myCode() {
 *   const store = useStore({});
 *   function localFn() {}
 *   // Valid Examples
 *   $(greet); // greet is importable
 *   $(importedFn); // importedFn is importable
 *   $(() => greet()); // greet is importable;
 *   $(() => importedFn()); // importedFn is importable
 *   $(() => console.log(store)); // store is serializable.
 *
 *   // Compile time errors
 *   $(topLevelFn); // ERROR: `topLevelFn` not importable
 *   $(() => topLevelFn()); // ERROR: `topLevelFn` not importable
 *
 *   // Runtime errors
 *   $(localFn); // ERROR: `localFn` fails serialization
 *   $(() => localFn()); // ERROR: `localFn` fails serialization
 * }
 *
 * ```
 *
 * @param expression - Expression which should be lazy loaded
 * @public
 */
// </docs>
function $(expression) {
    return runtimeQrl(expression);
}
// <docs markdown="../readme.md#implicit$FirstArg">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#implicit$FirstArg instead)
/**
 * Create a `____$(...)` convenience method from `___(...)`.
 *
 * It is very common for functions to take a lazy-loadable resource as a first argument. For this
 * reason, the Qwik Optimizer automatically extracts the first argument from any function which
 * ends in `$`.
 *
 * This means that `foo$(arg0)` and `foo($(arg0))` are equivalent with respect to Qwik Optimizer.
 * The former is just a shorthand for the latter.
 *
 * For example these function call are equivalent:
 *
 * - `component$(() => {...})` is same as `onRender($(() => {...}))`
 *
 * ```tsx
 * export function myApi(callback: QRL<() => void>): void {
 *   // ...
 * }
 *
 * export const myApi$ = implicit$FirstArg(myApi);
 * // type of myApi$: (callback: () => void): void
 *
 * // can be used as:
 * myApi$(() => console.log('callback'));
 *
 * // will be transpiled to:
 * // FILE: <current file>
 * myApi(qrl('./chunk-abc.js', 'callback'));
 *
 * // FILE: chunk-abc.js
 * export const callback = () => console.log('callback');
 * ```
 *
 * @param fn - function that should have its first argument automatically `$`.
 * @alpha
 */
// </docs>
function implicit$FirstArg(fn) {
    return function (first, ...rest) {
        return fn.call(null, $(first), ...rest);
    };
}

// <docs markdown="../readme.md#useHostElement">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useHostElement instead)
/**
 * Retrieves the Host Element of the current component.
 *
 * NOTE: `useHostElement` method can only be used in the synchronous portion of the callback
 * (before any `await` statements.)
 *
 * ```tsx
 * const Section = component$(
 *   () => {
 *     const hostElement = useHostElement();
 *     console.log(hostElement); // hostElement is a HTMLSectionElement
 *
 *     return <Host>I am a section</Host>;
 *   },
 *   {
 *     tagName: 'section',
 *   }
 * );
 * ```
 *
 * @public
 */
// </docs>
function useHostElement() {
    const ctx = getInvokeContext();
    assertEqual(ctx.event, RenderEvent);
    const element = ctx.hostElement;
    assertDefined(element);
    return element;
}

// <docs markdown="../readme.md#useStore">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStore instead)
/**
 * Creates a object that Qwik can track across serializations.
 *
 * Use `useStore` to create state for your application. The return object is a proxy which has a
 * unique ID. The ID of the object is used in the `QRL`s to refer to the store.
 *
 * ## Example
 *
 * Example showing how `useStore` is used in Counter example to keep track of count.
 *
 * ```tsx
 * const Stores = component$(() => {
 *   const counter = useCounter(1);
 *
 *   // Reactivity happens even for nested objects and arrays
 *   const userData = useStore({
 *     name: 'Manu',
 *     address: {
 *       address: '',
 *       city: '',
 *     },
 *     orgs: [],
 *   });
 *
 *   // useStore() can also accept a function to calculate the initial value
 *   const state = useStore(() => {
 *     return {
 *       value: expensiveInitialValue(),
 *     };
 *   });
 *
 *   return (
 *     <Host>
 *       <div>Counter: {counter.value}</div>
 *       <Child userData={userData} state={state} />
 *     </Host>
 *   );
 * });
 *
 * function useCounter(step: number) {
 *   // Multiple stores can be created in custom hooks for convenience and composability
 *   const counterStore = useStore({
 *     value: 0,
 *   });
 *   useClientEffect$(() => {
 *     // Only runs in the client
 *     const timer = setInterval(() => {
 *       counterStore.value += step;
 *     }, 500);
 *     return () => {
 *       clearInterval(timer);
 *     };
 *   });
 *   return counterStore;
 * }
 * ```
 *
 * @public
 */
// </docs>
function useStore(initialState) {
    const [store, setStore] = useSequentialScope();
    const hostElement = useHostElement();
    if (store != null) {
        return wrapSubscriber(store, hostElement);
    }
    const containerState = useContainerState();
    const value = typeof initialState === 'function' ? initialState() : initialState;
    const newStore = qObject(value, containerState);
    setStore(newStore);
    return wrapSubscriber(newStore, hostElement);
}
// <docs markdown="../readme.md#useRef">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useRef instead)
/**
 * It's a very thin wrapper around `useStore()` including the proper type signature to be passed
 * to the `ref` property in JSX.
 *
 * ```tsx
 * export function useRef<T = Element>(current?: T): Ref<T> {
 *   return useStore({ current });
 * }
 * ```
 *
 * ## Example
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const input = useRef<HTMLInputElement>();
 *
 *   useClientEffect$((track) => {
 *     const el = track(input, 'current')!;
 *     el.focus();
 *   });
 *
 *   return (
 *     <Host>
 *       <input type="text" ref={input} />
 *     </Host>
 *   );
 * });
 *
 * ```
 *
 * @public
 */
// </docs>
function useRef(current) {
    return useStore({ current });
}
/**
 * @alpha
 */
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

// <docs markdown="../readme.md#useLexicalScope">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useLexicalScope instead)
/**
 * Used by the Qwik Optimizer to restore the lexical scoped variables.
 *
 * This method should not be present in the application source code.
 *
 * NOTE: `useLexicalScope` method can only be used in the synchronous portion of the callback
 * (before any `await` statements.)
 *
 * @public
 */
// </docs>
function useLexicalScope() {
    const context = getInvokeContext();
    const hostElement = context.hostElement;
    const qrl = (context.qrl ??
        parseQRL(decodeURIComponent(String(context.url)), hostElement));
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

// <docs markdown="../readme.md#useDocument">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useDocument instead)
/**
 * Retrieves the document of the current element. It's important to use this method instead of
 * accessing `document` directly, because during SSR, the global document might not exist.
 *
 * NOTE: `useDocument` method can only be used in the synchronous portion of the callback (before
 * any `await` statements.)
 *
 * @alpha
 */
// </docs>
function useDocument() {
    const ctx = getInvokeContext();
    assertEqual(ctx.event, RenderEvent);
    const doc = ctx.doc;
    if (!doc) {
        throw new Error('Cant access document for existing context');
    }
    return doc;
}

var WatchFlags;
(function (WatchFlags) {
    WatchFlags[WatchFlags["IsEffect"] = 1] = "IsEffect";
    WatchFlags[WatchFlags["IsWatch"] = 2] = "IsWatch";
    WatchFlags[WatchFlags["IsDirty"] = 4] = "IsDirty";
    WatchFlags[WatchFlags["IsCleanup"] = 8] = "IsCleanup";
})(WatchFlags || (WatchFlags = {}));
/**
 * @alpha
 */
function handleWatch() {
    const [watch] = useLexicalScope();
    notifyWatch(watch);
}
// <docs markdown="../readme.md#useWatch">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useWatch instead)
/**
 * Reruns the `watchFn` when the observed inputs change.
 *
 * Use `useWatch` to observe changes on a set of inputs, and then re-execute the `watchFn` when
 * those inputs change.
 *
 * The `watchFn` only executes if the observed inputs change. To observe the inputs use the `obs`
 * function to wrap property reads. This creates subscriptions which will trigger the `watchFn`
 * to re-run.
 *
 * @see `Tracker`
 *
 * @public
 *
 * ## Example
 *
 * The `useWatch` function is used to observe the `state.count` property. Any changes to the
 * `state.count` cause the `watchFn` to execute which in turn updates the `state.doubleCount` to
 * the double of `state.count`.
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     count: 0,
 *     doubleCount: 0,
 *     debounced: 0,
 *   });
 *
 *   // Double count watch
 *   useWatch$((track) => {
 *     const count = track(store, 'count');
 *     store.doubleCount = 2 * count;
 *   });
 *
 *   // Debouncer watch
 *   useWatch$((track) => {
 *     const doubleCount = track(store, 'doubleCount');
 *     const timer = setTimeout(() => {
 *       store.debounced = doubleCount;
 *     }, 2000);
 *     return () => {
 *       clearTimeout(timer);
 *     };
 *   });
 *   return (
 *     <Host>
 *       <div>
 *         {store.count} / {store.doubleCount}
 *       </div>
 *       <div>{store.debounced}</div>
 *     </Host>
 *   );
 * });
 * ```
 *
 * @param watch - Function which should be re-executed when changes to the inputs are detected
 * @public
 */
// </docs>
function useWatchQrl(qrl, opts) {
    const [watch, setWatch, i] = useSequentialScope();
    if (!watch) {
        const el = useHostElement();
        const containerState = useContainerState();
        const watch = {
            qrl,
            el,
            f: WatchFlags.IsDirty | WatchFlags.IsWatch,
            i,
        };
        setWatch(true);
        getContext(el).watches.push(watch);
        useWaitOn(Promise.resolve().then(() => runWatch(watch, containerState)));
        const isServer = containerState.platform.isServer;
        if (isServer) {
            useRunWatch(watch, opts?.run);
        }
    }
}
// <docs markdown="../readme.md#useWatch">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useWatch instead)
/**
 * Reruns the `watchFn` when the observed inputs change.
 *
 * Use `useWatch` to observe changes on a set of inputs, and then re-execute the `watchFn` when
 * those inputs change.
 *
 * The `watchFn` only executes if the observed inputs change. To observe the inputs use the `obs`
 * function to wrap property reads. This creates subscriptions which will trigger the `watchFn`
 * to re-run.
 *
 * @see `Tracker`
 *
 * @public
 *
 * ## Example
 *
 * The `useWatch` function is used to observe the `state.count` property. Any changes to the
 * `state.count` cause the `watchFn` to execute which in turn updates the `state.doubleCount` to
 * the double of `state.count`.
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     count: 0,
 *     doubleCount: 0,
 *     debounced: 0,
 *   });
 *
 *   // Double count watch
 *   useWatch$((track) => {
 *     const count = track(store, 'count');
 *     store.doubleCount = 2 * count;
 *   });
 *
 *   // Debouncer watch
 *   useWatch$((track) => {
 *     const doubleCount = track(store, 'doubleCount');
 *     const timer = setTimeout(() => {
 *       store.debounced = doubleCount;
 *     }, 2000);
 *     return () => {
 *       clearTimeout(timer);
 *     };
 *   });
 *   return (
 *     <Host>
 *       <div>
 *         {store.count} / {store.doubleCount}
 *       </div>
 *       <div>{store.debounced}</div>
 *     </Host>
 *   );
 * });
 * ```
 *
 * @param watch - Function which should be re-executed when changes to the inputs are detected
 * @public
 */
// </docs>
const useWatch$ = implicit$FirstArg(useWatchQrl);
// <docs markdown="../readme.md#useClientEffect">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useClientEffect instead)
/**
 * ```tsx
 * const Timer = component$(() => {
 *   const store = useStore({
 *     count: 0,
 *   });
 *
 *   useClientEffect$(() => {
 *     // Only runs in the client
 *     const timer = setInterval(() => {
 *       store.count++;
 *     }, 500);
 *     return () => {
 *       clearInterval(timer);
 *     };
 *   });
 *
 *   return <Host>{store.count}</Host>;
 * });
 * ```
 *
 * @public
 */
// </docs>
function useClientEffectQrl(qrl, opts) {
    const [watch, setWatch, i] = useSequentialScope();
    if (!watch) {
        const el = useHostElement();
        const watch = {
            qrl,
            el,
            f: WatchFlags.IsEffect,
            i,
        };
        setWatch(true);
        getContext(el).watches.push(watch);
        useRunWatch(watch, opts?.run ?? 'visible');
        const doc = useDocument();
        if (doc['qO']) {
            doc['qO'].observe(el);
        }
    }
}
// <docs markdown="../readme.md#useClientEffect">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useClientEffect instead)
/**
 * ```tsx
 * const Timer = component$(() => {
 *   const store = useStore({
 *     count: 0,
 *   });
 *
 *   useClientEffect$(() => {
 *     // Only runs in the client
 *     const timer = setInterval(() => {
 *       store.count++;
 *     }, 500);
 *     return () => {
 *       clearInterval(timer);
 *     };
 *   });
 *
 *   return <Host>{store.count}</Host>;
 * });
 * ```
 *
 * @public
 */
// </docs>
const useClientEffect$ = implicit$FirstArg(useClientEffectQrl);
// <docs markdown="../readme.md#useServerMount">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useServerMount instead)
/**
 * Register's a server mount hook, that runs only in server when the component is first mounted.
 *
 * ## Example
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     users: [],
 *   });
 *
 *   useServerMount$(async () => {
 *     // This code will ONLY run once in the server, when the component is mounted
 *     store.users = await db.requestUsers();
 *   });
 *
 *   return (
 *     <Host>
 *       {store.users.map((user) => (
 *         <User user={user} />
 *       ))}
 *     </Host>
 *   );
 * });
 *
 * interface User {
 *   name: string;
 * }
 * function User(props: { user: User }) {
 *   return <div>Name: {props.user.name}</div>;
 * }
 * ```
 *
 * @see `useClientMount` `useMount`
 * @public
 */
// </docs>
function useServerMountQrl(mountQrl) {
    const [watch, setWatch] = useSequentialScope();
    if (!watch) {
        setWatch(true);
        const isServer = getPlatform(useDocument()).isServer;
        if (isServer) {
            useWaitOn(mountQrl.invoke());
        }
    }
}
// <docs markdown="../readme.md#useServerMount">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useServerMount instead)
/**
 * Register's a server mount hook, that runs only in server when the component is first mounted.
 *
 * ## Example
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     users: [],
 *   });
 *
 *   useServerMount$(async () => {
 *     // This code will ONLY run once in the server, when the component is mounted
 *     store.users = await db.requestUsers();
 *   });
 *
 *   return (
 *     <Host>
 *       {store.users.map((user) => (
 *         <User user={user} />
 *       ))}
 *     </Host>
 *   );
 * });
 *
 * interface User {
 *   name: string;
 * }
 * function User(props: { user: User }) {
 *   return <div>Name: {props.user.name}</div>;
 * }
 * ```
 *
 * @see `useClientMount` `useMount`
 * @public
 */
// </docs>
const useServerMount$ = implicit$FirstArg(useServerMountQrl);
// <docs markdown="../readme.md#useClientMount">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useClientMount instead)
/**
 * Register's a client mount hook, that runs only in client when the component is first mounted.
 *
 * ## Example
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     hash: ''
 *   });
 *
 *   useClientMount$(async () => {
 *     // This code will ONLY run once in the client, when the component is mounted
 *     store.hash = document.location.hash
 *   });
 *
 *   return (
 *     <Host>
 *       <p>The url hash is: ${store.hash}</p>
 *     </Host>
 *   );
 * });
 * ```
 *
 * @see `useServerMount` `useMount`
 *
 * @public
 */
// </docs>
function useClientMountQrl(mountQrl) {
    const [watch, setWatch] = useSequentialScope();
    if (!watch) {
        setWatch(true);
        const isServer = getPlatform(useDocument()).isServer;
        if (!isServer) {
            useWaitOn(mountQrl.invoke());
        }
    }
}
// <docs markdown="../readme.md#useClientMount">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useClientMount instead)
/**
 * Register's a client mount hook, that runs only in client when the component is first mounted.
 *
 * ## Example
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     hash: ''
 *   });
 *
 *   useClientMount$(async () => {
 *     // This code will ONLY run once in the client, when the component is mounted
 *     store.hash = document.location.hash
 *   });
 *
 *   return (
 *     <Host>
 *       <p>The url hash is: ${store.hash}</p>
 *     </Host>
 *   );
 * });
 * ```
 *
 * @see `useServerMount` `useMount`
 *
 * @public
 */
// </docs>
const useClientMount$ = implicit$FirstArg(useClientMountQrl);
// <docs markdown="../readme.md#useMount">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useMount instead)
/**
 * Register's a mount hook, that runs both in the server and the client when the component is
 * first mounted.
 *
 * ## Example
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     temp: 0,
 *   });
 *
 *   useMount$(async () => {
 *     // This code will run once whenever a component is mounted in the server, or in the client
 *     const res = await fetch('weather-api.example');
 *     const json = await res.json() as any;
 *     store.temp = json.temp;
 *   });
 *
 *   return (
 *     <Host>
 *       <p>The temperature is: ${store.temp}</p>
 *     </Host>
 *   );
 * });
 * ```
 *
 * @see `useServerMount` `useClientMount`
 * @public
 */
// </docs>
function useMountQrl(mountQrl) {
    const [watch, setWatch] = useSequentialScope();
    if (!watch) {
        setWatch(true);
        useWaitOn(mountQrl.invoke());
    }
}
// <docs markdown="../readme.md#useMount">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useMount instead)
/**
 * Register's a mount hook, that runs both in the server and the client when the component is
 * first mounted.
 *
 * ## Example
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     temp: 0,
 *   });
 *
 *   useMount$(async () => {
 *     // This code will run once whenever a component is mounted in the server, or in the client
 *     const res = await fetch('weather-api.example');
 *     const json = await res.json() as any;
 *     store.temp = json.temp;
 *   });
 *
 *   return (
 *     <Host>
 *       <p>The temperature is: ${store.temp}</p>
 *     </Host>
 *   );
 * });
 * ```
 *
 * @see `useServerMount` `useClientMount`
 * @public
 */
// </docs>
const useMount$ = implicit$FirstArg(useMountQrl);
function runWatch(watch, containerState) {
    if (!(watch.f & WatchFlags.IsDirty)) {
        logDebug('Watch is not dirty, skipping run', watch);
        return Promise.resolve(watch);
    }
    watch.f &= ~WatchFlags.IsDirty;
    const promise = new Promise((resolve) => {
        then(watch.running, () => {
            cleanupWatch(watch);
            const el = watch.el;
            const doc = getDocument(el);
            const invokationContext = newInvokeContext(doc, el, el, 'WatchEvent');
            const { subsManager } = containerState;
            const watchFn = watch.qrl.invokeFn(el, invokationContext, () => {
                subsManager.clearSub(watch);
            });
            const track = (obj, prop) => {
                const manager = subsManager.getLocal(getProxyTarget(obj) ?? obj);
                manager.addSub(watch, prop);
                if (prop) {
                    return obj[prop];
                }
                else {
                    return obj;
                }
            };
            return then(watchFn(track), (returnValue) => {
                if (typeof returnValue === 'function') {
                    watch.destroy = noSerialize(returnValue);
                }
                resolve(watch);
            });
        });
    });
    watch.running = noSerialize(promise);
    return promise;
}
const cleanupWatch = (watch) => {
    const destroy = watch.destroy;
    if (destroy) {
        watch.destroy = undefined;
        try {
            destroy();
        }
        catch (err) {
            logError(err);
        }
    }
};
const destroyWatch = (watch) => {
    if (watch.f & WatchFlags.IsCleanup) {
        watch.f &= ~WatchFlags.IsCleanup;
        const cleanup = watch.qrl.invokeFn(watch.el);
        cleanup();
    }
    else {
        cleanupWatch(watch);
    }
};
const useRunWatch = (watch, run) => {
    if (run === 'load') {
        useResumeQrl(getWatchHandlerQrl(watch));
    }
    else if (run === 'visible') {
        useVisibleQrl(getWatchHandlerQrl(watch));
    }
};
const getWatchHandlerQrl = (watch) => {
    const watchQrl = watch.qrl;
    const watchHandler = new QRLInternal(watchQrl.chunk, 'handleWatch', handleWatch, null, null, [watch]);
    watchHandler.refSymbol = watchQrl.symbol;
    return watchHandler;
};

const emitEvent = (el, eventName, detail, bubbles) => {
    if (el && typeof CustomEvent === 'function') {
        el.dispatchEvent(new CustomEvent(eventName, {
            detail,
            bubbles: bubbles,
            composed: bubbles,
        }));
    }
};

const UNDEFINED_PREFIX = '\u0010';
const QRL_PREFIX = '\u0011';
const DOCUMENT_PREFIX = '\u0012';
function resumeContainer(containerEl) {
    if (!isContainer(containerEl)) {
        logWarn('Skipping hydration because parent element is not q:container');
        return;
    }
    const doc = getDocument(containerEl);
    const isDocElement = containerEl === doc.documentElement;
    const parentJSON = isDocElement ? doc.body : containerEl;
    const script = getQwikJSON(parentJSON);
    if (!script) {
        logWarn('Skipping hydration qwik/json metadata was not found.');
        return;
    }
    script.remove();
    const containerState = getContainerState(containerEl);
    const meta = JSON.parse(unescapeText(script.textContent || '{}'));
    // Collect all elements
    const elements = new Map();
    getNodesInScope(containerEl, hasQId).forEach((el) => {
        const id = el.getAttribute(ELEMENT_ID);
        elements.set(ELEMENT_ID_PREFIX + id, el);
    });
    const getObject = (id) => {
        return getObjectImpl(id, elements, meta.objs, containerState);
    };
    // Revive proxies with subscriptions into the proxymap
    reviveValues(meta.objs, meta.subs, getObject, containerState, parentJSON);
    // Rebuild target objects
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
            ctx.refMap.array.push(...qobj.split(' ').map((part) => getObject(part)));
        }
        if (seq) {
            ctx.seq = seq.split(' ').map((part) => getObject(part));
        }
        if (watches) {
            ctx.watches = watches.split(' ').map((part) => getObject(part));
        }
        if (contexts) {
            contexts.split(' ').map((part) => {
                const [key, value] = part.split('=');
                if (!ctx.contexts) {
                    ctx.contexts = new Map();
                }
                ctx.contexts.set(key, getObject(value));
            });
        }
        // Restore sequence scoping
        if (host) {
            const [props, renderQrl] = host.split(' ');
            assertDefined(props);
            assertDefined(renderQrl);
            ctx.props = createProps(getObject(props), ctx.element, containerState);
            ctx.renderQrl = getObject(renderQrl);
        }
    });
    containerEl.setAttribute(QContainerAttr, 'resumed');
    logDebug('Container resumed');
    emitEvent(containerEl, 'qresume', undefined, true);
}
function hasContext(el) {
    return !!tryGetContext(el);
}
function snapshotState(containerEl) {
    const doc = getDocument(containerEl);
    const { subsManager, proxyMap, platform } = getContainerState(containerEl);
    const elementToIndex = new Map();
    const collector = createCollector(doc, proxyMap);
    // Collect all qObjected around the DOM
    const elements = getNodesInScope(containerEl, hasContext);
    elements.forEach((node) => {
        const ctx = tryGetContext(node);
        collectProps(node, ctx.props, collector);
        ctx.contexts?.forEach((ctx) => {
            collectValue(ctx, collector);
        });
        ctx.listeners?.forEach((listeners) => {
            for (const l of listeners) {
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
    // Convert objSet to array
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
    const objToId = new Map();
    let count = 0;
    for (const obj of objs) {
        objToId.set(obj, count);
        count++;
    }
    function getElementID(el) {
        let id = elementToIndex.get(el);
        if (id === undefined) {
            if (el.isConnected) {
                id = intToStr(elementToIndex.size);
                el.setAttribute(ELEMENT_ID, id);
                id = ELEMENT_ID_PREFIX + id;
            }
            else {
                id = null;
            }
            elementToIndex.set(el, id);
        }
        return id;
    }
    function getObjId(obj) {
        if (obj !== null && typeof obj === 'object') {
            const target = obj[QOjectTargetSymbol];
            const id = objToId.get(normalizeObj(target ?? obj, doc));
            if (id !== undefined) {
                const proxySuffix = target ? '!' : '';
                return intToStr(id) + proxySuffix;
            }
            if (!target && isNode$1(obj)) {
                if (obj.nodeType === 1) {
                    return getElementID(obj);
                }
                else {
                    logError('Can not serialize a HTML Node that is not an Element', obj);
                    return null;
                }
            }
        }
        else {
            const id = objToId.get(normalizeObj(obj, doc));
            if (id !== undefined) {
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
    const subs = objs
        .map((obj) => {
        const subs = subsManager.tryGetLocal(obj)?.subs;
        if (subs && subs.size > 0) {
            return Object.fromEntries(Array.from(subs.entries()).map(([sub, set]) => {
                const id = getObjId(sub);
                if (id !== null) {
                    return [id, set ? Array.from(set) : null];
                }
                else {
                    return [undefined, undefined];
                }
            }));
        }
        else {
            return null;
        }
    })
        .filter((a) => !!a);
    const serialize = (value) => {
        return getObjId(value) ?? value;
    };
    const qrlSerializeOptions = {
        platform,
        getObjId,
    };
    const convertedObjs = objs.map((obj) => {
        if (Array.isArray(obj)) {
            return obj.map(serialize);
        }
        else if (obj && typeof obj === 'object') {
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
    // Write back to the dom
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
            const value = ref.array.map((obj) => mustGetObjId(obj)).join(' ');
            if (value) {
                metaValue.r = value;
                add = true;
            }
        }
        if (elementCaptured && props) {
            const objs = [getProxyTarget(props)];
            if (renderQrl) {
                objs.push(renderQrl);
            }
            const value = objs.map((obj) => mustGetObjId(obj)).join(' ');
            if (value) {
                metaValue.h = value;
                add = true;
            }
        }
        if (watches.length > 0) {
            const value = watches
                .map((watch) => getObjId(watch))
                .filter((obj) => obj != null)
                .join(' ');
            if (value) {
                metaValue.w = value;
                add = true;
            }
        }
        if (elementCaptured && seq.length > 0) {
            const value = seq.map((obj) => mustGetObjId(obj)).join(' ');
            if (value) {
                metaValue.s = value;
                add = true;
            }
        }
        if (contexts) {
            const serializedContexts = [];
            contexts.forEach((value, key) => {
                serializedContexts.push(`${key}=${mustGetObjId(value)}`);
            });
            const value = serializedContexts.join(' ');
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
                        qrl,
                    });
                });
            });
        }
    });
    for (const watch of collector.watches) {
        destroyWatch(watch);
        if (qDev) {
            if (watch.f & WatchFlags.IsDirty) {
                logWarn('Serializing dirty watch. Looks like an internal error.');
            }
            if (!isConnected(watch)) {
                logWarn('Serializing disconneted watch. Looks like an internal error.');
            }
        }
    }
    // Sanity check of serialized element
    if (qDev) {
        elementToIndex.forEach((value, el) => {
            if (getDocument(el) !== doc) {
                logWarn('element from different document', value, el.tagName);
            }
            if (!value) {
                logWarn('unconnected element', el.tagName, '\n');
            }
        });
    }
    return {
        state: {
            ctx: meta,
            objs: convertedObjs,
            subs,
        },
        objs,
        listeners,
    };
}
function getQwikJSON(parentElm) {
    let child = parentElm.lastElementChild;
    while (child) {
        if (child.tagName === 'SCRIPT' && child.getAttribute('type') === 'qwik/json') {
            return child;
        }
        child = child.previousElementSibling;
    }
    return undefined;
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
        if (typeof value === 'string') {
            if (value === UNDEFINED_PREFIX) {
                objs[i] = undefined;
            }
            else if (value === DOCUMENT_PREFIX) {
                objs[i] = getDocument(containerEl);
            }
            else if (value.startsWith(QRL_PREFIX)) {
                objs[i] = parseQRL(value.slice(1), containerEl);
            }
        }
        else {
            const sub = subs[i];
            if (sub) {
                const converted = new Map();
                Object.entries(sub).forEach((entry) => {
                    const el = getObject(entry[0]);
                    if (!el) {
                        logWarn('QWIK can not revive subscriptions because of missing element ID', entry, value);
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
    if (obj && typeof obj == 'object') {
        if (isQrl(obj)) {
            if (obj.capture && obj.capture.length > 0) {
                obj.captureRef = obj.capture.map(getObject);
                obj.capture = null;
            }
            return;
        }
        else if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const value = obj[i];
                if (typeof value == 'string') {
                    obj[i] = getObject(value);
                }
                else {
                    reviveNestedObjects(value, getObject);
                }
            }
        }
        else if (Object.getPrototypeOf(obj) === Object.prototype) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (typeof value == 'string') {
                        obj[key] = getObject(value);
                    }
                    else {
                        reviveNestedObjects(value, getObject);
                    }
                }
            }
        }
    }
}
function getObjectImpl(id, elements, objs, containerState) {
    if (id.startsWith(ELEMENT_ID_PREFIX)) {
        assertEqual(elements.has(id), true);
        return elements.get(id);
    }
    const index = strToInt(id);
    assertEqual(objs.length > index, true);
    const obj = objs[index];
    const needsProxy = id.endsWith('!');
    if (needsProxy && containerState) {
        return containerState.proxyMap.get(obj) ?? readWriteProxy(obj, containerState);
    }
    return obj;
}
function normalizeObj(obj, doc) {
    if (obj === doc) {
        return DOCUMENT_PREFIX;
    }
    if (obj === undefined || !shouldSerialize(obj)) {
        return UNDEFINED_PREFIX;
    }
    return getProxyTarget(obj) ?? obj;
}
function collectValue(obj, collector) {
    const handled = collectQObjects(obj, collector);
    if (!handled) {
        collector.objSet.add(normalizeObj(obj, collector.doc));
    }
}
function collectProps(el, props, collector) {
    const subs = props && typeof props === 'object' && props[QOjectSubsSymbol];
    if (subs && subs.has(el)) {
        // The host element read the props
        collectElement(el, collector);
    }
}
function createCollector(doc, proxyMap) {
    return {
        seen: new Set(),
        objSet: new Set(),
        elements: [],
        watches: [],
        proxyMap,
        doc,
    };
}
function collectQrl(obj, collector) {
    if (collector.seen.has(obj)) {
        return true;
    }
    collector.seen.add(obj);
    collector.objSet.add(normalizeObj(obj, collector.doc));
    if (obj.captureRef) {
        obj.captureRef.forEach((obj) => collectValue(obj, collector));
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
    return str.replace(/<(\/?script)/g, '\\x3C$1');
}
function unescapeText(str) {
    return str.replace(/\\x3C(\/?script)/g, '<$1');
}
function collectSubscriptions(subs, collector) {
    if (collector.seen.has(subs)) {
        return;
    }
    collector.seen.add(subs);
    Array.from(subs.keys()).forEach((key) => {
        if (isElement(key)) {
            collectElement(key, collector);
        }
        else {
            collectValue(key, collector);
        }
    });
}
function collectQObjects(obj, collector) {
    if (obj != null) {
        if (typeof obj === 'object') {
            const hasTarget = !!obj[QOjectTargetSymbol];
            if (!hasTarget && isNode$1(obj)) {
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
            const subs = proxied?.[QOjectSubsSymbol];
            if (subs) {
                collectSubscriptions(subs, collector);
            }
            obj = normalizeObj(obj, collector.doc);
        }
        if (typeof obj === 'object') {
            if (collector.seen.has(obj)) {
                return true;
            }
            collector.seen.add(obj);
            collector.objSet.add(obj);
            if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    collectQObjects(obj[i], collector);
                }
            }
            else {
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        collectQObjects(obj[key], collector);
                    }
                }
            }
            return true;
        }
        if (typeof obj === 'string') {
            collector.objSet.add(obj);
            return true;
        }
    }
    return false;
}
function getProxyTarget(obj) {
    if (obj !== null && typeof obj === 'object') {
        return obj[QOjectTargetSymbol];
    }
    return undefined;
}
function isContainer(el) {
    return el.hasAttribute(QContainerAttr);
}
function hasQId(el) {
    return el.hasAttribute(ELEMENT_ID);
}
const intToStr = (nu) => {
    return nu.toString(36);
};
const strToInt = (nu) => {
    return parseInt(nu, 36);
};

function newQObjectMap() {
    const array = [];
    return {
        array,
        get(index) {
            return array[index];
        },
        indexOf(obj) {
            const index = array.indexOf(obj);
            return index === -1 ? undefined : index;
        },
        add(object) {
            const index = array.indexOf(object);
            if (index === -1) {
                array.push(object);
                return array.length - 1;
            }
            return index;
        },
    };
}

function fromCamelToKebabCase(text) {
    return text.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function debugStringify(value) {
    if (value != null && typeof value == 'object') {
        return String(value.constructor.name) + '\n' + safeJSONStringify(value);
    }
    return String(value);
}
function safeJSONStringify(value) {
    try {
        return JSON.stringify(value, null, '  ');
    }
    catch (e) {
        return String(e);
    }
}

const ON_PROP_REGEX = /^(window:|document:|)on([A-Z]|-.).*Qrl$/;
const ON$_PROP_REGEX = /^(window:|document:|)on([A-Z]|-.).*\$$/;
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
    for (const value of newQRLs) {
        const cp = value.copy();
        cp.setContainer(ctx.element);
        const capture = cp.capture;
        if (capture == null) {
            // we need to serialize the lexical scope references
            const captureRef = cp.captureRef;
            cp.capture =
                captureRef && captureRef.length
                    ? captureRef.map((ref) => String(ctx.refMap.add(ref)))
                    : EMPTY_ARRAY;
        }
        // Important we modify the array as it is cached.
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
        }
        else {
            ctx.element.setAttribute(kebabProp, newValue);
        }
    }
}
function getDomListeners(el) {
    const attributes = el.attributes;
    const listeners = new Map();
    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes.item(i);
        if (attr.name.startsWith('on:') ||
            attr.name.startsWith('on-window:') ||
            attr.name.startsWith('on-document:')) {
            let array = listeners.get(attr.name);
            if (!array) {
                listeners.set(attr.name, (array = []));
            }
            array.push(parseQRL(attr.value, el));
        }
    }
    return listeners;
}
function serializeQRLs(existingQRLs, ctx) {
    const platform = getPlatform(ctx.element);
    const element = ctx.element;
    const opts = {
        platform,
        element,
    };
    return existingQRLs
        .map((qrl) => (isPromise(qrl) ? '' : stringifyQRL(qrl, opts)))
        .filter((v) => !!v)
        .join('\n');
}

// <docs markdown="../readme.md#pauseContainer">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#pauseContainer instead)
/**
 * Serialize the current state of the application into DOM
 *
 * @alpha
 */
// </docs>
function pauseContainer(elmOrDoc) {
    const doc = getDocument(elmOrDoc);
    const containerEl = isDocument(elmOrDoc) ? elmOrDoc.documentElement : elmOrDoc;
    const parentJSON = isDocument(elmOrDoc) ? elmOrDoc.body : containerEl;
    const data = snapshotState(containerEl);
    const script = doc.createElement('script');
    script.setAttribute('type', 'qwik/json');
    script.textContent = escapeText(JSON.stringify(data.state, undefined, qDev ? '  ' : undefined));
    parentJSON.appendChild(script);
    containerEl.setAttribute(QContainerAttr, 'paused');
    return data;
}

Error.stackTraceLimit = 9999;
const Q_CTX = '__ctx__';
function resumeIfNeeded(containerEl) {
    const isResumed = containerEl.getAttribute(QContainerAttr);
    if (isResumed === 'paused') {
        resumeContainer(containerEl);
        if (qDev) {
            appendQwikDevTools(containerEl);
        }
    }
}
function appendQwikDevTools(containerEl) {
    containerEl['qwik'] = {
        pause: () => pauseContainer(containerEl),
        state: getContainerState(containerEl),
    };
}
function tryGetContext(element) {
    return element[Q_CTX];
}
function getContext(element) {
    let ctx = tryGetContext(element);
    if (!ctx) {
        const cache = new Map();
        element[Q_CTX] = ctx = {
            element,
            cache,
            refMap: newQObjectMap(),
            dirty: false,
            seq: [],
            watches: [],
            props: undefined,
            renderQrl: undefined,
            component: undefined,
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
    ctx.component = undefined;
    ctx.renderQrl = undefined;
    ctx.seq.length = 0;
    ctx.watches.length = 0;
    ctx.cache.clear();
    ctx.dirty = false;
    ctx.refMap.array.length = 0;
    el[Q_CTX] = undefined;
}
const PREFIXES = ['document:on', 'window:on', 'on'];
const SCOPED = ['on-document', 'on-window', 'on'];
function normalizeOnProp(prop) {
    let scope = 'on';
    for (let i = 0; i < PREFIXES.length; i++) {
        const prefix = PREFIXES[i];
        if (prop.startsWith(prefix)) {
            scope = SCOPED[i];
            prop = prop.slice(prefix.length);
        }
    }
    if (prop.startsWith('-')) {
        prop = prop.slice(1);
    }
    else {
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
                        const displayName = ctx.renderQrl?.getSymbol() ?? ctx.element.localName;
                        logError(`Props are immutable by default. If you need to change a value of a passed in prop, please wrap the prop with "mutable()" <${displayName} ${prop}={mutable(...)}>`, '\n - Component:', displayName, '\n - Prop:', prop, '\n - Old value:', oldValue, '\n - New value:', value);
                    }
                }
                manager.notifySubs(prop);
            }
        },
    };
}
class PropsProxyHandler {
    constructor(hostElement, containerState, manager) {
        this.hostElement = hostElement;
        this.containerState = containerState;
        this.manager = manager;
    }
    get(target, prop) {
        if (typeof prop === 'symbol') {
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
        if (typeof prop === 'symbol') {
            return value;
        }
        if (isMutable(value)) {
            this.manager.addSub(this.hostElement, prop);
            return value.v;
        }
        return value;
    }
    set() {
        throw new Error('props are inmutable');
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
}

/**
 * Place at the root of the component View to allow binding of attributes on the Host element.
 *
 * ```
 * <Host someAttr={someExpr} someAttrStatic="value">
 *   View content implementation.
 * </Host>
 * ```
 *
 * Qwik requires that components have [docs/HOST_ELEMENTS.ts] so that it is possible to have
 * asynchronous loading point. Host element is not owned by the component. At times it is
 * desirable for the component to render additional attributes on the host element. `<Host>`
 * servers that purpose.
 * @public
 */
const Host = { __brand__: 'host' };
/**
 * @public
 */
const SkipRerender = { __brand__: 'skip' };

function visitJsxNode(ctx, elm, jsxNode, isSvg) {
    if (jsxNode === undefined) {
        return smartUpdateChildren(ctx, elm, [], 'root', isSvg);
    }
    if (Array.isArray(jsxNode)) {
        return smartUpdateChildren(ctx, elm, jsxNode.flat(), 'root', isSvg);
    }
    else if (jsxNode.type === Host) {
        updateProperties(ctx, getContext(elm), jsxNode.props, isSvg);
        return smartUpdateChildren(ctx, elm, jsxNode.children || [], 'root', isSvg);
    }
    else {
        return smartUpdateChildren(ctx, elm, [jsxNode], 'root', isSvg);
    }
}

function hashCode(text, hash = 0) {
    if (text.length === 0)
        return hash;
    for (let i = 0; i < text.length; i++) {
        const chr = text.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Number(Math.abs(hash)).toString(36);
}

function styleKey(qStyles) {
    return qStyles && String(hashCode(qStyles.getCanonicalSymbol()));
}
function styleHost(styleId) {
    return styleId && ComponentStylesPrefixHost + styleId;
}
function styleContent(styleId) {
    return styleId && ComponentStylesPrefixContent + styleId;
}

/**
 * @public
 */
function jsx(type, props, key) {
    return new JSXNodeImpl(type, props, key);
}
class JSXNodeImpl {
    constructor(type, props, key = null) {
        this.type = type;
        this.props = props;
        this.children = EMPTY_ARRAY;
        this.text = undefined;
        this.key = null;
        if (key != null) {
            this.key = String(key);
        }
        if (props) {
            const children = processNode(props.children);
            if (children !== undefined) {
                if (Array.isArray(children)) {
                    this.children = children;
                }
                else {
                    this.children = [children];
                }
            }
        }
    }
}
function processNode(node) {
    if (node == null || typeof node === 'boolean') {
        return undefined;
    }
    if (isJSXNode(node)) {
        if (node.type === Host || node.type === SkipRerender) {
            return node;
        }
        else if (typeof node.type === 'function') {
            return processNode(node.type({ ...node.props, children: node.children }, node.key));
        }
        else {
            return node;
        }
    }
    else if (Array.isArray(node)) {
        return node.flatMap(processNode).filter((e) => e != null);
    }
    else if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
        const newNode = new JSXNodeImpl('#text', null, null);
        newNode.text = String(node);
        return newNode;
    }
    else {
        logWarn('Unvalid node, skipping');
        return undefined;
    }
}
const isJSXNode = (n) => {
    if (qDev) {
        if (n instanceof JSXNodeImpl) {
            return true;
        }
        if (n && typeof n === 'object' && n.constructor.name === JSXNodeImpl.name) {
            throw new Error(`Duplicate implementations of "JSXNodeImpl" found`);
        }
        return false;
    }
    else {
        return n instanceof JSXNodeImpl;
    }
};
/**
 * @public
 */
const Fragment = (props) => props.children;

const firstRenderComponent = (rctx, ctx) => {
    ctx.element.setAttribute(QHostAttr, '');
    return renderComponent(rctx, ctx);
};
const renderComponent = (rctx, ctx) => {
    ctx.dirty = false;
    const hostElement = ctx.element;
    const onRenderQRL = ctx.renderQrl;
    assertDefined(onRenderQRL);
    const props = ctx.props;
    assertDefined(props);
    // Component is not dirty any more
    rctx.containerState.hostsStaging.delete(hostElement);
    const newCtx = {
        ...rctx,
        components: [...rctx.components],
    };
    // Invoke render hook
    const invocatinContext = newInvokeContext(rctx.doc, hostElement, hostElement, RenderEvent);
    invocatinContext.subscriber = hostElement;
    invocatinContext.renderCtx = newCtx;
    const waitOn = (invocatinContext.waitOn = []);
    // Clean current subscription before render
    rctx.containerState.subsManager.clearSub(hostElement);
    // Resolve render function
    const onRenderFn = onRenderQRL.invokeFn(rctx.containerEl, invocatinContext);
    try {
        // Execution of the render function
        const renderPromise = onRenderFn(props);
        // Wait for results
        return then(renderPromise, (jsxNode) => {
            rctx.hostElements.add(hostElement);
            const waitOnPromise = promiseAll(waitOn);
            return then(waitOnPromise, (waitOnResolved) => {
                waitOnResolved.forEach((task) => {
                    if (isStyleTask(task)) {
                        appendStyle(rctx, hostElement, task);
                    }
                });
                if (typeof jsxNode === 'function') {
                    ctx.dirty = false;
                    jsxNode = jsxNode();
                }
                else if (ctx.dirty) {
                    logDebug('Dropping render. State changed during render.');
                    return renderComponent(rctx, ctx);
                }
                let componentCtx = ctx.component;
                if (!componentCtx) {
                    componentCtx = ctx.component = {
                        hostElement,
                        slots: [],
                        styleHostClass: undefined,
                        styleClass: undefined,
                        styleId: undefined,
                    };
                    const scopedStyleId = hostElement.getAttribute(ComponentScopedStyles) ?? undefined;
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
    }
    catch (err) {
        logError(err);
    }
};

const SVG_NS = 'http://www.w3.org/2000/svg';
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
    }
    else if (ch.length > 0) {
        return addVnodes(ctx, elm, undefined, ch, 0, ch.length - 1, isSvg);
    }
    else if (oldCh.length > 0) {
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
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newStartVnode)) {
            results.push(patchVnode(ctx, oldStartVnode, newStartVnode, isSvg));
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (sameVnode(oldEndVnode, newEndVnode)) {
            results.push(patchVnode(ctx, oldEndVnode, newEndVnode, isSvg));
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            results.push(patchVnode(ctx, oldStartVnode, newEndVnode, isSvg));
            insertBefore(ctx, parentElm, oldStartVnode, oldEndVnode.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (sameVnode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            results.push(patchVnode(ctx, oldEndVnode, newStartVnode, isSvg));
            insertBefore(ctx, parentElm, oldEndVnode, oldStartVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (idxInOld === undefined) {
                // New element
                const newElm = createElm(ctx, newStartVnode, isSvg);
                results.push(then(newElm, (newElm) => {
                    insertBefore(ctx, parentElm, newElm, oldStartVnode);
                }));
            }
            else {
                elmToMove = oldCh[idxInOld];
                if (!isTagName(elmToMove, newStartVnode.type)) {
                    const newElm = createElm(ctx, newStartVnode, isSvg);
                    results.push(then(newElm, (newElm) => {
                        insertBefore(ctx, parentElm, newElm, oldStartVnode);
                    }));
                }
                else {
                    results.push(patchVnode(ctx, elmToMove, newStartVnode, isSvg));
                    oldCh[idxInOld] = undefined;
                    insertBefore(ctx, parentElm, elmToMove, oldStartVnode);
                }
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    if (newStartIdx <= newEndIdx) {
        const before = newCh[newEndIdx + 1] == null ? undefined : newCh[newEndIdx + 1].elm;
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
    return Array.from(elm.childNodes).filter(isNode);
}
function getChildren(elm, mode) {
    switch (mode) {
        case 'default':
            return getCh(elm);
        case 'slot':
            return getCh(elm).filter(isChildSlot);
        case 'root':
            return getCh(elm).filter(isChildComponent);
        case 'fallback':
            return getCh(elm).filter(isFallback);
    }
}
function isNode(elm) {
    const type = elm.nodeType;
    return type === 1 || type === 3;
}
function isFallback(node) {
    return node.nodeName === 'Q:FALLBACK';
}
function isChildSlot(node) {
    return node.nodeName !== 'Q:FALLBACK' && isChildComponent(node);
}
function isSlotTemplate(node) {
    return node.nodeName === 'TEMPLATE' && node.hasAttribute(QSlotAttr);
}
function isChildComponent(node) {
    return node.nodeName !== 'TEMPLATE' || !node.hasAttribute(QSlotAttr);
}
function splitBy(input, condition) {
    const output = {};
    for (const item of input) {
        const key = condition(item);
        const array = output[key] ?? (output[key] = []);
        array.push(item);
    }
    return output;
}
function patchVnode(rctx, elm, vnode, isSvg) {
    rctx.perf.visited++;
    vnode.elm = elm;
    const tag = vnode.type;
    if (tag === '#text') {
        if (elm.data !== vnode.text) {
            setProperty(rctx, elm, 'data', vnode.text);
        }
        return;
    }
    if (tag === '#comment') {
        if (elm.data !== vnode.text) {
            setProperty(rctx, elm, 'data', vnode.text);
        }
        return;
    }
    if (tag === Host || tag === SkipRerender) {
        return;
    }
    if (!isSvg) {
        isSvg = tag === 'svg';
    }
    let promise;
    const props = vnode.props;
    const ctx = getContext(elm);
    const dirty = updateProperties(rctx, ctx, props, isSvg);
    const isSlot = tag === 'q:slot';
    if (isSvg && vnode.type === 'foreignObject') {
        isSvg = false;
    }
    else if (isSlot) {
        const currentComponent = rctx.components.length > 0 ? rctx.components[rctx.components.length - 1] : undefined;
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
            // Mark empty slots and remove content
            Object.entries(slotMaps.slots).forEach(([key, slotEl]) => {
                if (slotEl && !splittedChidren[key]) {
                    const oldCh = getChildren(slotEl, 'slot');
                    if (oldCh.length > 0) {
                        removeVnodes(rctx, oldCh, 0, oldCh.length - 1);
                    }
                }
            });
            // Mark empty slots and remove content
            Object.entries(slotMaps.templates).forEach(([key, templateEl]) => {
                if (templateEl && !splittedChidren[key]) {
                    removeNode(rctx, templateEl);
                    slotMaps.templates[key] = undefined;
                }
            });
            // Render into slots
            Object.entries(splittedChidren).forEach(([key, ch]) => {
                const slotElm = getSlotElement(rctx, slotMaps, elm, key);
                promises.push(smartUpdateChildren(rctx, slotElm, ch, 'slot', isSvg));
            });
            return then(promiseAll(promises), () => {
                removeTemplates(rctx, slotMaps);
            });
        });
    }
    const setsInnerHTML = checkInnerHTML(props);
    if (setsInnerHTML) {
        if (qDev && ch.length > 0) {
            logWarn('Node can not have children when innerHTML is set');
        }
        return;
    }
    return then(promise, () => {
        const mode = isSlot ? 'fallback' : 'default';
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
let refCount = 0;
const RefSymbol = Symbol();
function setSlotRef(ctx, hostElm, slotEl) {
    let ref = hostElm[RefSymbol] ?? hostElm.getAttribute('q:sref');
    if (ref === null) {
        ref = intToStr(refCount++);
        hostElm[RefSymbol] = ref;
        setAttribute(ctx, hostElm, 'q:sref', ref);
    }
    slotEl.setAttribute('q:sref', ref);
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
    const template = createElement(ctx, 'template', false);
    template.setAttribute(QSlotAttr, slotName);
    return template;
}
function removeTemplates(ctx, slotMaps) {
    Object.keys(slotMaps.templates).forEach((key) => {
        const template = slotMaps.templates[key];
        if (template && slotMaps.slots[key] !== undefined) {
            removeNode(ctx, template);
            slotMaps.templates[key] = undefined;
        }
    });
}
function resolveSlotProjection(ctx, hostElm, before, after) {
    Object.entries(before.slots).forEach(([key, slotEl]) => {
        if (slotEl && !after.slots[key]) {
            // Slot removed
            // Move slot to template
            const template = createTemplate(ctx, key);
            const slotChildren = getChildren(slotEl, 'slot');
            template.content.append(...slotChildren);
            hostElm.insertBefore(template, hostElm.firstChild);
            ctx.operations.push({
                el: template,
                operation: 'slot-to-template',
                args: slotChildren,
                fn: () => { },
            });
        }
    });
    Object.entries(after.slots).forEach(([key, slotEl]) => {
        if (slotEl && !before.slots[key]) {
            // Slot created
            // Move template to slot
            const template = before.templates[key];
            if (template) {
                slotEl.appendChild(template.content);
                template.remove();
                ctx.operations.push({
                    el: slotEl,
                    operation: 'template-to-slot',
                    args: [template],
                    fn: () => { },
                });
            }
        }
    });
}
function getSlotName(node) {
    return node.props?.['q:slot'] ?? '';
}
function createElm(rctx, vnode, isSvg) {
    rctx.perf.visited++;
    const tag = vnode.type;
    if (tag === '#text') {
        return (vnode.elm = createTextNode(rctx, vnode.text));
    }
    if (!isSvg) {
        isSvg = tag === 'svg';
    }
    const props = vnode.props;
    const elm = (vnode.elm = createElement(rctx, tag, isSvg));
    const isComponent = isComponentNode(vnode);
    const ctx = getContext(elm);
    setKey(elm, vnode.key);
    updateProperties(rctx, ctx, props, isSvg);
    if (isSvg && tag === 'foreignObject') {
        isSvg = false;
    }
    const currentComponent = rctx.components.length > 0 ? rctx.components[rctx.components.length - 1] : undefined;
    if (currentComponent) {
        const styleTag = currentComponent.styleClass;
        if (styleTag) {
            classlistAdd(rctx, elm, styleTag);
        }
        if (tag === 'q:slot') {
            setSlotRef(rctx, currentComponent.hostElement, elm);
            currentComponent.slots.push(vnode);
        }
    }
    let wait;
    if (isComponent) {
        // Run mount hook
        const renderQRL = props[OnRenderProp];
        ctx.renderQrl = renderQRL;
        wait = firstRenderComponent(rctx, ctx);
    }
    else {
        const setsInnerHTML = checkInnerHTML(props);
        if (setsInnerHTML) {
            if (qDev && vnode.children.length > 0) {
                logWarn('Node can not have children when innerHTML is set');
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
            const slotMap = isComponent ? getSlots(ctx.component, elm) : undefined;
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
const getSlots = (componentCtx, hostElm) => {
    const slots = {};
    const templates = {};
    const slotRef = hostElm.getAttribute('q:sref');
    const existingSlots = Array.from(hostElm.querySelectorAll(`q\\:slot[q\\:sref="${slotRef}"]`));
    const newSlots = componentCtx?.slots ?? EMPTY_ARRAY;
    const t = Array.from(hostElm.children).filter(isSlotTemplate);
    // Map slots
    for (const elm of existingSlots) {
        slots[elm.getAttribute('name') ?? ''] = elm;
    }
    // Map virtual slots
    for (const vnode of newSlots) {
        slots[vnode.props?.name ?? ''] = vnode.elm;
    }
    // Map templates
    for (const elm of t) {
        templates[elm.getAttribute('q:slot') ?? ''] = elm;
    }
    return { slots, templates };
};
const handleStyle = (ctx, elm, _, newValue) => {
    setAttribute(ctx, elm, 'style', stringifyClassOrStyle(newValue, false));
    return true;
};
const handleClass = (ctx, elm, _, newValue) => {
    setAttribute(ctx, elm, 'class', stringifyClassOrStyle(newValue, true));
    return true;
};
const checkBeforeAssign = (ctx, elm, prop, newValue) => {
    if (prop in elm) {
        if (elm[prop] !== newValue) {
            setProperty(ctx, elm, prop, newValue);
        }
    }
    return true;
};
const dangerouslySetInnerHTML = 'dangerouslySetInnerHTML';
const setInnerHTML = (ctx, elm, _, newValue) => {
    if (dangerouslySetInnerHTML in elm) {
        setProperty(ctx, elm, dangerouslySetInnerHTML, newValue);
    }
    else if ('innerHTML' in elm) {
        setProperty(ctx, elm, 'innerHTML', newValue);
    }
    return true;
};
const PROP_HANDLER_MAP = {
    style: handleStyle,
    class: handleClass,
    className: handleClass,
    value: checkBeforeAssign,
    checked: checkBeforeAssign,
    [dangerouslySetInnerHTML]: setInnerHTML,
};
const ALLOWS_PROPS = ['class', 'className', 'style', 'id', 'q:slot'];
const HOST_PREFIX = 'host:';
const SCOPE_PREFIX = /^(host|window|document):/;
function updateProperties(rctx, ctx, expectProps, isSvg) {
    if (!expectProps) {
        return false;
    }
    const elm = ctx.element;
    const isCmp = OnRenderProp in expectProps;
    const qwikProps = isCmp ? getPropsMutator(ctx, rctx.containerState) : undefined;
    for (let key of Object.keys(expectProps)) {
        if (key === 'children' || key === OnRenderProp) {
            continue;
        }
        const newValue = expectProps[key];
        if (key === 'ref') {
            newValue.current = elm;
            continue;
        }
        // Early exit if value didnt change
        const oldValue = ctx.cache.get(key);
        if (newValue === oldValue) {
            continue;
        }
        ctx.cache.set(key, newValue);
        // Check of data- or aria-
        if (key.startsWith('data-') || key.startsWith('aria-')) {
            setAttribute(rctx, elm, key, newValue);
            continue;
        }
        if (qwikProps) {
            const skipProperty = ALLOWS_PROPS.includes(key);
            const hasPrefix = SCOPE_PREFIX.test(key);
            if (!skipProperty && !hasPrefix) {
                // Qwik props
                qwikProps.set(key, newValue);
                continue;
            }
            const hPrefixed = key.startsWith(HOST_PREFIX);
            if (hPrefixed) {
                key = key.slice(HOST_PREFIX.length);
            }
        }
        else if (qDev && key.startsWith(HOST_PREFIX)) {
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
        // Check if its an exception
        const exception = PROP_HANDLER_MAP[key];
        if (exception) {
            if (exception(rctx, elm, key, newValue, oldValue)) {
                continue;
            }
        }
        // Check if property in prototype
        if (!isSvg && key in elm) {
            setProperty(rctx, elm, key, newValue);
            continue;
        }
        // Fallback to render attribute
        setAttribute(rctx, elm, key, newValue);
    }
    return ctx.dirty;
}
function setAttribute(ctx, el, prop, value) {
    const fn = () => {
        if (value == null) {
            el.removeAttribute(prop);
        }
        else {
            el.setAttribute(prop, String(value));
        }
    };
    ctx.operations.push({
        el,
        operation: 'set-attribute',
        args: [prop, value],
        fn,
    });
}
function classlistAdd(ctx, el, hostStyleTag) {
    const fn = () => {
        el.classList.add(hostStyleTag);
    };
    ctx.operations.push({
        el,
        operation: 'classlist-add',
        args: [hostStyleTag],
        fn,
    });
}
function setProperty(ctx, node, key, value) {
    const fn = () => {
        try {
            node[key] = value;
        }
        catch (err) {
            logError('Set property', { node, key, value }, err);
        }
    };
    ctx.operations.push({
        el: node,
        operation: 'set-property',
        args: [key, value],
        fn,
    });
}
function createElement(ctx, expectTag, isSvg) {
    const el = isSvg ? ctx.doc.createElementNS(SVG_NS, expectTag) : ctx.doc.createElement(expectTag);
    el[CONTAINER] = ctx.containerEl;
    ctx.operations.push({
        el,
        operation: 'create-element',
        args: [expectTag],
        fn: () => { },
    });
    return el;
}
function insertBefore(ctx, parent, newChild, refChild) {
    const fn = () => {
        parent.insertBefore(newChild, refChild ? refChild : null);
    };
    ctx.operations.push({
        el: parent,
        operation: 'insert-before',
        args: [newChild, refChild],
        fn,
    });
    return newChild;
}
function appendStyle(ctx, hostElement, styleTask) {
    const fn = () => {
        const containerEl = ctx.containerEl;
        const stylesParent = ctx.doc.documentElement === containerEl ? ctx.doc.head ?? containerEl : containerEl;
        if (!stylesParent.querySelector(`style[q\\:style="${styleTask.styleId}"]`)) {
            const style = ctx.doc.createElement('style');
            style.setAttribute('q:style', styleTask.styleId);
            style.textContent = styleTask.content;
            stylesParent.insertBefore(style, stylesParent.firstChild);
        }
    };
    ctx.operations.push({
        el: hostElement,
        operation: 'append-style',
        args: [styleTask],
        fn,
    });
}
function prepend(ctx, parent, newChild) {
    const fn = () => {
        parent.insertBefore(newChild, parent.firstChild);
    };
    ctx.operations.push({
        el: parent,
        operation: 'prepend',
        args: [newChild],
        fn,
    });
}
function removeNode(ctx, el) {
    const fn = () => {
        const parent = el.parentNode;
        if (parent) {
            if (el.nodeType === 1) {
                const subsManager = ctx.containerState.subsManager;
                cleanupElement(el, subsManager);
                el
                    .querySelectorAll(QHostSelector)
                    .forEach((el) => cleanupElement(el, subsManager));
            }
            parent.removeChild(el);
        }
        else if (qDev) {
            logWarn('Trying to remove component already removed', el);
        }
    };
    ctx.operations.push({
        el: el,
        operation: 'remove',
        args: [],
        fn,
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
    const before = ctx.roots.map((elm) => getSlots(undefined, elm));
    executeContext(ctx);
    const after = ctx.roots.map((elm) => getSlots(undefined, elm));
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
    const byOp = {};
    for (const op of ctx.operations) {
        byOp[op.operation] = (byOp[op.operation] ?? 0) + 1;
    }
    const affectedElements = Array.from(new Set(ctx.operations.map((a) => a.el)));
    const stats = {
        byOp,
        roots: ctx.roots,
        hostElements: Array.from(ctx.hostElements),
        affectedElements,
        visitedNodes: ctx.perf.visited,
        operations: ctx.operations.map((v) => [v.operation, v.el, ...v.args]),
    };
    const noOps = ctx.operations.length === 0;
    logDebug('Render stats.', noOps ? 'No operations' : '', stats);
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
const KEY_SYMBOL = Symbol('vnode key');
function getKey(el) {
    let key = el[KEY_SYMBOL];
    if (key === undefined) {
        key = el[KEY_SYMBOL] = el.getAttribute('q:key');
    }
    return key;
}
function setKey(el, key) {
    if (typeof key === 'string') {
        el.setAttribute('q:key', key);
    }
    el[KEY_SYMBOL] = key;
}
function sameVnode(elm, vnode2) {
    const isElement = elm.nodeType === 1;
    if (isElement) {
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
    return props && ('innerHTML' in props || dangerouslySetInnerHTML in props);
}
function stringifyClassOrStyle(obj, isClass) {
    if (obj == null)
        return '';
    if (typeof obj == 'object') {
        let text = '';
        let sep = '';
        if (Array.isArray(obj)) {
            if (!isClass) {
                throw qError(QError.Render_unsupportedFormat_obj_attr, obj, 'style');
            }
            for (let i = 0; i < obj.length; i++) {
                text += sep + obj[i];
                sep = ' ';
            }
        }
        else {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    if (value) {
                        text += isClass
                            ? value
                                ? sep + key
                                : ''
                            : sep + fromCamelToKebabCase(key) + ':' + value;
                        sep = isClass ? ' ' : ';';
                    }
                }
            }
        }
        return text;
    }
    return String(obj);
}

/**
 * Mark component for rendering.
 *
 * Use `notifyRender` method to mark a component for rendering at some later point in time.
 * This method uses `getPlatform(doc).queueRender` for scheduling of the rendering. The
 * default implementation of the method is to use `requestAnimationFrame` to do actual rendering.
 *
 * The method is intended to coalesce multiple calls into `notifyRender` into a single call for
 * rendering.
 *
 * @param hostElement - Host-element of the component to re-render.
 * @returns A promise which is resolved when the component has been rendered.
 * @public
 */
async function notifyRender(hostElement) {
    assertDefined(hostElement.getAttribute(QHostAttr));
    const containerEl = getContainer(hostElement);
    assertDefined(containerEl);
    const state = getContainerState(containerEl);
    if (state.platform.isServer && !qTest) {
        logWarn('Can not rerender in server platform');
        return undefined;
    }
    resumeIfNeeded(containerEl);
    const ctx = getContext(hostElement);
    assertDefined(ctx.renderQrl);
    if (ctx.dirty) {
        return state.renderPromise;
    }
    ctx.dirty = true;
    const activeRendering = state.hostsRendering !== undefined;
    if (activeRendering) {
        state.hostsStaging.add(hostElement);
        return state.renderPromise.then((ctx) => {
            if (state.hostsNext.has(hostElement)) {
                // TODO
                return state.renderPromise;
            }
            else {
                return ctx;
            }
        });
    }
    else {
        state.hostsNext.add(hostElement);
        return scheduleFrame(containerEl, state);
    }
}
function scheduleFrame(containerEl, containerState) {
    if (containerState.renderPromise === undefined) {
        containerState.renderPromise = containerState.platform.nextTick(() => renderMarked(containerEl, containerState));
    }
    return containerState.renderPromise;
}
const CONTAINER_STATE = Symbol('ContainerState');
function getContainerState(containerEl) {
    let set = containerEl[CONTAINER_STATE];
    if (!set) {
        containerEl[CONTAINER_STATE] = set = {
            proxyMap: new WeakMap(),
            subsManager: createSubscriptionManager(),
            platform: getPlatform(containerEl),
            watchNext: new Set(),
            watchStaging: new Set(),
            hostsNext: new Set(),
            hostsStaging: new Set(),
            renderPromise: undefined,
            hostsRendering: undefined,
        };
    }
    return set;
}
async function renderMarked(containerEl, containerState) {
    const hostsRendering = (containerState.hostsRendering = new Set(containerState.hostsNext));
    containerState.hostsNext.clear();
    await executeWatches(containerState, (watch) => {
        return (watch.f & WatchFlags.IsWatch) !== 0;
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
        hostElements: new Set(),
        operations: [],
        roots: [],
        containerEl,
        components: [],
        perf: {
            visited: 0,
            timing: [],
        },
    };
    for (const el of renderingQueue) {
        if (!ctx.hostElements.has(el)) {
            ctx.roots.push(el);
            try {
                await renderComponent(ctx, getContext(el));
            }
            catch (e) {
                logError('Render error', e);
            }
        }
    }
    // Early exist, no dom operations
    if (ctx.operations.length === 0) {
        if (qDev) {
            if (typeof window !== 'undefined' && window.document != null) {
                printRenderStats(ctx);
            }
        }
        postRendering(containerEl, containerState, ctx);
        return ctx;
    }
    return platform.raf(() => {
        executeContextWithSlots(ctx);
        if (qDev) {
            if (typeof window !== 'undefined' && window.document != null) {
                printRenderStats(ctx);
            }
        }
        postRendering(containerEl, containerState, ctx);
        return ctx;
    });
}
async function postRendering(containerEl, containerState, ctx) {
    await executeWatches(containerState, (watch, stage) => {
        if ((watch.f & WatchFlags.IsEffect) === 0) {
            return false;
        }
        if (stage) {
            return ctx.hostElements.has(watch.el);
        }
        return true;
    });
    // Clear staging
    containerState.hostsStaging.forEach((el) => {
        containerState.hostsNext.add(el);
    });
    containerState.hostsStaging.clear();
    containerState.hostsRendering = undefined;
    containerState.renderPromise = undefined;
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
        // Run staging effected
        containerState.watchStaging.forEach((watch) => {
            if (watchPred(watch, true)) {
                watchPromises.push(then(watch.qrl.resolveIfNeeded(watch.el), () => watch));
            }
            else {
                containerState.watchNext.add(watch);
            }
        });
        containerState.watchStaging.clear();
        // Wait for all promises
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
    elements.sort((a, b) => (a.compareDocumentPosition(b) & 2 ? 1 : -1));
}
function sortWatches(watches) {
    watches.sort((a, b) => {
        if (a.el === b.el) {
            return a.i < b.i ? -1 : 1;
        }
        return (a.el.compareDocumentPosition(b.el) & 2) !== 0 ? 1 : -1;
    });
}

function qObject(obj, proxyMap) {
    assertEqual(unwrapProxy(obj), obj, 'Unexpected proxy at this location');
    if (obj == null || typeof obj !== 'object') {
        // TODO(misko): centralize
        throw new Error(`Q-ERROR: Only objects can be wrapped in 'QObject', got ` + debugStringify(obj));
    }
    if (obj.constructor !== Object) {
        throw new Error(`Q-ERROR: Only objects literals can be wrapped in 'QObject', got ` + debugStringify(obj));
    }
    return readWriteProxy(obj, proxyMap);
}
function _restoreQObject(obj, containerState, subs) {
    return readWriteProxy(obj, containerState, subs);
}
/**
 * Creates a proxy which notifies of any writes.
 */
function readWriteProxy(target, containerState, subs) {
    if (!target || typeof target !== 'object')
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
const QOjectTargetSymbol = ':target:';
const QOjectAllSymbol = ':all:';
const QOjectSubsSymbol = ':subs:';
const QOjectOriginalProxy = ':proxy:';
const SetSubscriber = Symbol('SetSubscriber');
/**
 * @alpha
 */
function unwrapProxy(proxy) {
    return getProxyTarget(proxy) ?? proxy;
}
function wrap(value, containerState) {
    if (value && typeof value === 'object') {
        if (isQrl(value)) {
            return value;
        }
        if (Object.isFrozen(value)) {
            return value;
        }
        const nakedValue = unwrapProxy(value);
        if (nakedValue !== value) {
            // already a proxy return;
            return value;
        }
        if (isNode$1(nakedValue)) {
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
    }
    else {
        return value;
    }
}
const createSubscriptionManager = () => {
    const objToSubs = new Map();
    const subsToObjs = new Map();
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
        assertEqual(getProxyTarget(obj), undefined);
        return objToSubs.get(obj);
    }
    function trackSubToObj(subscriber, map) {
        let set = subsToObjs.get(subscriber);
        if (!set) {
            subsToObjs.set(subscriber, (set = new Set()));
        }
        set.add(map);
    }
    function getLocal(obj, initialMap) {
        let local = tryGetLocal(obj);
        if (!local) {
            const map = !initialMap ? new Map() : initialMap;
            map.forEach((_, key) => {
                trackSubToObj(key, map);
            });
            objToSubs.set(obj, (local = {
                subs: map,
                addSub(subscriber, key) {
                    if (key == null) {
                        map.set(subscriber, null);
                    }
                    else {
                        let sub = map.get(subscriber);
                        if (sub === undefined) {
                            map.set(subscriber, (sub = new Set()));
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
                        }
                        else if (value.has(key)) {
                            notifyChange(subscriber);
                        }
                    });
                },
            }));
        }
        return local;
    }
    return {
        tryGetLocal,
        getLocal,
        clearSub,
    };
};
class ReadWriteProxyHandler {
    constructor(containerState, manager) {
        this.containerState = containerState;
        this.manager = manager;
    }
    get(target, prop) {
        let subscriber = this.subscriber;
        this.subscriber = undefined;
        if (typeof prop === 'symbol') {
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
                subscriber = undefined;
            }
            else if (!subscriber) {
                subscriber = invokeCtx.subscriber;
            }
        }
        if (prop === QOjectAllSymbol) {
            if (subscriber) {
                this.manager.addSub(subscriber);
            }
            return target;
        }
        const value = target[prop];
        if (typeof prop === 'symbol') {
            return value;
        }
        if (subscriber) {
            const isArray = Array.isArray(target);
            this.manager.addSub(subscriber, isArray ? undefined : prop);
        }
        return wrap(value, this.containerState);
    }
    set(target, prop, newValue) {
        if (typeof prop === 'symbol') {
            if (prop === SetSubscriber) {
                this.subscriber = newValue;
            }
            else {
                target[prop] = newValue;
            }
            return true;
        }
        const unwrappedNewValue = unwrapProxy(newValue);
        if (qDev) {
            verifySerializable(unwrappedNewValue);
            const invokeCtx = tryGetInvokeContext();
            if (invokeCtx && invokeCtx.event === RenderEvent) {
                logWarn('State mutation inside render function. Move mutation to useWatch(), useClientEffect() or useServerMount()', invokeCtx.hostElement, prop);
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
                subscriber = undefined;
            }
            else if (!subscriber) {
                subscriber = invokeCtx.subscriber;
            }
        }
        if (subscriber) {
            this.manager.addSub(subscriber);
        }
        return Object.getOwnPropertyNames(target);
    }
}
function notifyChange(subscriber) {
    if (isElement(subscriber)) {
        notifyRender(subscriber);
    }
    else {
        notifyWatch(subscriber);
    }
}
function notifyWatch(watch) {
    const containerEl = getContainer(watch.el);
    const state = getContainerState(containerEl);
    watch.f |= WatchFlags.IsDirty;
    const activeRendering = state.hostsRendering !== undefined;
    if (activeRendering) {
        state.watchStaging.add(watch);
    }
    else {
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
        if (type === 'object') {
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
        if (['boolean', 'string', 'number'].includes(type)) {
            return;
        }
        throw qError(QError.TODO, 'Only primitive and object literals can be serialized', value);
    }
}
const noSerializeSet = /*#__PURE__*/ new WeakSet();
function shouldSerialize(obj) {
    if (obj !== null && (typeof obj == 'object' || typeof obj === 'function')) {
        return !noSerializeSet.has(obj);
    }
    return true;
}
// <docs markdown="../readme.md#noSerialize">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#noSerialize instead)
/**
 * @alpha
 */
// </docs>
function noSerialize(input) {
    noSerializeSet.add(input);
    return input;
}
/**
 * @alpha
 */
function immutable(input) {
    return Object.freeze(input);
}
/**
 * @alpha
 */
function mutable(v) {
    return {
        [MUTABLE]: true,
        v: unwrapSubscriber(v),
    };
}
function isConnected(sub) {
    if (isElement(sub)) {
        return !!tryGetContext(sub) || sub.isConnected;
    }
    else {
        return isConnected(sub.el);
    }
}
const MUTABLE = Symbol('mutable');
const isMutable = (v) => {
    return v && typeof v === 'object' && v[MUTABLE] === true;
};

/**
 * @alpha
 */
function wrapSubscriber(obj, subscriber) {
    if (obj && typeof obj === 'object') {
        const target = obj[QOjectTargetSymbol];
        if (!target) {
            return obj;
        }
        return new Proxy(obj, {
            get(target, prop) {
                if (prop === QOjectOriginalProxy) {
                    return target;
                }
                target[SetSubscriber] = subscriber;
                return target[prop];
            },
            ownKeys(target) {
                target[SetSubscriber] = subscriber;
                return Reflect.ownKeys(target);
            },
        });
    }
    return obj;
}
/**
 * @alpha
 */
function unwrapSubscriber(obj) {
    if (obj && typeof obj === 'object') {
        const proxy = obj[QOjectOriginalProxy];
        if (proxy) {
            return proxy;
        }
    }
    return obj;
}

let runtimeSymbolId = 0;
const RUNTIME_QRL = '/runtimeQRL';
const INLINED_QRL = '/inlinedQRL';
// https://regexr.com/68v72
const EXTRACT_IMPORT_PATH = /\(\s*(['"])([^\1]+)\1\s*\)/;
// https://regexr.com/690ds
const EXTRACT_SELF_IMPORT = /Promise\s*\.\s*resolve/;
// https://regexr.com/6a83h
const EXTRACT_FILE_NAME = /[\\/(]([\w\d.\-_]+\.(js|ts)x?):/;
function toInternalQRL(qrl) {
    assertEqual(isQrl(qrl), true);
    return qrl;
}
/**
 * Lazy-load a `QRL` symbol and return the lazy-loaded value.
 *
 * @see `QRL`
 *
 * @param element - Location of the URL to resolve against. This is needed to take `q:base` into
 * account.
 * @param qrl - QRL to load.
 * @returns A resolved QRL value as a Promise.
 */
function qrlImport(element, qrl) {
    const qrl_ = toInternalQRL(qrl);
    if (qrl_.symbolRef)
        return qrl_.symbolRef;
    if (qrl_.symbolFn) {
        return (qrl_.symbolRef = qrl_
            .symbolFn()
            .then((module) => (qrl_.symbolRef = module[qrl_.symbol])));
    }
    else {
        if (!element) {
            throw new Error(`QRL '${qrl_.chunk}#${qrl_.symbol || 'default'}' does not have an attached container`);
        }
        const symbol = getPlatform(element).importSymbol(element, qrl_.chunk, qrl_.symbol);
        return (qrl_.symbolRef = then(symbol, (ref) => {
            return (qrl_.symbolRef = ref);
        }));
    }
}
// <docs markdown="../readme.md#qrl">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#qrl instead)
/**
 * Used by Qwik Optimizer to point to lazy-loaded resources.
 *
 * This function should be used by the Qwik Optimizer only. The function should not be directly
 * referred to in the source code of the application.
 *
 * @see `QRL`, `$(...)`
 *
 * @param chunkOrFn - Chunk name (or function which is stringified to extract chunk name)
 * @param symbol - Symbol to lazy load
 * @param lexicalScopeCapture - a set of lexically scoped variables to capture.
 * @alpha
 */
// </docs>
function qrl(chunkOrFn, symbol, lexicalScopeCapture = EMPTY_ARRAY) {
    let chunk;
    let symbolFn = null;
    if (typeof chunkOrFn === 'string') {
        chunk = chunkOrFn;
    }
    else if (typeof chunkOrFn === 'function') {
        symbolFn = chunkOrFn;
        let match;
        const srcCode = String(chunkOrFn);
        if ((match = srcCode.match(EXTRACT_IMPORT_PATH)) && match[2]) {
            chunk = match[2];
        }
        else if ((match = srcCode.match(EXTRACT_SELF_IMPORT))) {
            const ref = 'QWIK-SELF';
            const frames = new Error(ref).stack.split('\n');
            const start = frames.findIndex((f) => f.includes(ref));
            const frame = frames[start + 2];
            match = frame.match(EXTRACT_FILE_NAME);
            if (!match) {
                chunk = 'main';
            }
            else {
                chunk = match[1];
            }
        }
        else {
            throw new Error('Q-ERROR: Dynamic import not found: ' + srcCode);
        }
    }
    else {
        throw new Error('Q-ERROR: Unknown type argument: ' + chunkOrFn);
    }
    // Unwrap subscribers
    unwrapLexicalScope(lexicalScopeCapture);
    const qrl = new QRLInternal(chunk, symbol, null, symbolFn, null, lexicalScopeCapture);
    const ctx = tryGetInvokeContext();
    if (ctx && ctx.element) {
        qrl.setContainer(ctx.element);
    }
    return qrl;
}
function runtimeQrl(symbol, lexicalScopeCapture = EMPTY_ARRAY) {
    return new QRLInternal(RUNTIME_QRL, 's' + runtimeSymbolId++, symbol, null, null, lexicalScopeCapture);
}
/**
 * @alpha
 */
function inlinedQrl(symbol, symbolName, lexicalScopeCapture = EMPTY_ARRAY) {
    // Unwrap subscribers
    return new QRLInternal(INLINED_QRL, symbolName, symbol, null, null, unwrapLexicalScope(lexicalScopeCapture));
}
function unwrapLexicalScope(lexicalScope) {
    if (Array.isArray(lexicalScope)) {
        for (let i = 0; i < lexicalScope.length; i++) {
            lexicalScope[i] = unwrapSubscriber(lexicalScope[i]);
        }
    }
    return lexicalScope;
}
function stringifyQRL(qrl, opts = {}) {
    const qrl_ = toInternalQRL(qrl);
    let symbol = qrl_.symbol;
    let chunk = qrl_.chunk;
    const refSymbol = qrl_.refSymbol ?? symbol;
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
    if (symbol && symbol !== 'default') {
        parts.push('#', symbol);
    }
    const capture = qrl_.capture;
    const captureRef = qrl_.captureRef;
    if (opts.getObjId) {
        if (captureRef && captureRef.length) {
            const capture = captureRef.map(opts.getObjId);
            parts.push(`[${capture.join(' ')}]`);
        }
    }
    else if (capture && capture.length > 0) {
        parts.push(`[${capture.join(' ')}]`);
    }
    const qrlString = parts.join('');
    if (qrl_.chunk === RUNTIME_QRL && element) {
        const qrls = element.__qrls__ || (element.__qrls__ = new Set());
        qrls.add(qrl);
    }
    return qrlString;
}
/**
 * `./chunk#symbol|symbol.propA.propB|[captures]
 */
function parseQRL(qrl, el) {
    const endIdx = qrl.length;
    const hashIdx = indexOf(qrl, 0, '#');
    const captureIdx = indexOf(qrl, hashIdx, '[');
    const chunkEndIdx = Math.min(hashIdx, captureIdx);
    const chunk = qrl.substring(0, chunkEndIdx);
    const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
    const symbolEndIdx = captureIdx;
    const symbol = symbolStartIdx == symbolEndIdx ? 'default' : qrl.substring(symbolStartIdx, symbolEndIdx);
    const captureStartIdx = captureIdx;
    const captureEndIdx = endIdx;
    const capture = captureStartIdx === captureEndIdx
        ? EMPTY_ARRAY
        : qrl.substring(captureStartIdx + 1, captureEndIdx - 1).split(' ');
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
        if (typeof symbolOrQrl == 'function' || typeof symbolOrQrl == 'string') {
            symbolOrQrl = runtimeQrl(symbolOrQrl);
        }
        else {
            // TODO(misko): centralize
            throw new Error(`Q-ERROR Only 'function's and 'string's are supported.`);
        }
    }
    return symbolOrQrl;
}

// <docs markdown="../readme.md#useCleanup">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useCleanup instead)
/**
 * A lazy-loadable reference to a component's cleanup hook.
 *
 * Invoked when the component is destroyed (removed from render tree), or paused as part of the
 * SSR serialization.
 *
 * Can be used to release resouces, abort network requets, stop timers...
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   useCleanup$(() => {
 *     // Executed after SSR (pause) or when the component gets removed from the DOM.
 *     // Can be used to release resouces, abort network requets, stop timers...
 *     console.log('component is destroyed');
 *   });
 *   return <div>Hello world</div>;
 * });
 * ```
 *
 * @alpha
 */
// </docs>
function useCleanupQrl(unmountFn) {
    const [watch, setWatch, i] = useSequentialScope();
    if (!watch) {
        const el = useHostElement();
        const watch = {
            qrl: unmountFn,
            el,
            f: WatchFlags.IsCleanup,
            i,
        };
        setWatch(true);
        getContext(el).watches.push(watch);
    }
}
// <docs markdown="../readme.md#useCleanup">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useCleanup instead)
/**
 * A lazy-loadable reference to a component's cleanup hook.
 *
 * Invoked when the component is destroyed (removed from render tree), or paused as part of the
 * SSR serialization.
 *
 * Can be used to release resouces, abort network requets, stop timers...
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   useCleanup$(() => {
 *     // Executed after SSR (pause) or when the component gets removed from the DOM.
 *     // Can be used to release resouces, abort network requets, stop timers...
 *     console.log('component is destroyed');
 *   });
 *   return <div>Hello world</div>;
 * });
 * ```
 *
 * @alpha
 */
// </docs>
const useCleanup$ = implicit$FirstArg(useCleanupQrl);
// <docs markdown="../readme.md#useResume">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useResume instead)
/**
 * A lazy-loadable reference to a component's on resume hook.
 *
 * The hook is eagerly invoked when the application resumes on the client. Because it is called
 * eagerly, this allows the component to resume even if no user interaction has taken place.
 *
 * Only called in the client.
 * Only called once.
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   useResume$(() => {
 *     // Eagerly invoked when the application resumes on the client
 *     console.log('called once in client');
 *   });
 *   return <div>Hello world</div>;
 * });
 * ```
 *
 * @see `useVisible`, `useClientEffect`
 *
 * @alpha
 */
// </docs>
function useResumeQrl(resumeFn) {
    useOn('qinit', resumeFn);
}
// <docs markdown="../readme.md#useResume">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useResume instead)
/**
 * A lazy-loadable reference to a component's on resume hook.
 *
 * The hook is eagerly invoked when the application resumes on the client. Because it is called
 * eagerly, this allows the component to resume even if no user interaction has taken place.
 *
 * Only called in the client.
 * Only called once.
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   useResume$(() => {
 *     // Eagerly invoked when the application resumes on the client
 *     console.log('called once in client');
 *   });
 *   return <div>Hello world</div>;
 * });
 * ```
 *
 * @see `useVisible`, `useClientEffect`
 *
 * @alpha
 */
// </docs>
const useResume$ = implicit$FirstArg(useResumeQrl);
// <docs markdown="../readme.md#useVisible">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useVisible instead)
/**
 * A lazy-loadable reference to a component's on visible hook.
 *
 * The hook is lazily invoked when the component becomes visible in the browser viewport.
 *
 * Only called in the client.
 * Only called once.
 *
 * @see `useResume`, `useClientEffect`
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({
 *     isVisible: false,
 *   });
 *   useVisible$(() => {
 *     // Invoked once when the component is visible in the browser's viewport
 *     console.log('called once in client when visible');
 *     store.isVisible = true;
 *   });
 *   return <div>{store.isVisible}</div>;
 * });
 * ```
 *
 * @alpha
 */
// </docs>
function useVisibleQrl(resumeFn) {
    useOn('qvisible', resumeFn);
}
// <docs markdown="../readme.md#useOn">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useOn instead)
/**
 * Register a listener on the current component's host element.
 *
 * Used to programmatically add event listeners. Useful from custom `use*` methods, which do not
 * have access to the JSX. Otherwise it's adding a JSX listener in the `<Host>` is a better idea.
 *
 * @see `useOn`, `useOnWindow`, `useOnDocument`.
 *
 * @alpha
 */
// </docs>
function useOn(event, eventFn) {
    const el = useHostElement();
    const ctx = getContext(el);
    qPropWriteQRL(undefined, ctx, `on:${event}`, eventFn);
}
// <docs markdown="../readme.md#useOnDocument">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useOnDocument instead)
/**
 * Register a listener on `document`.
 *
 * Used to programmatically add event listeners. Useful from custom `use*` methods, which do not
 * have access to the JSX.
 *
 * @see `useOn`, `useOnWindow`, `useOnDocument`.
 *
 * ```tsx
 * function useScroll() {
 *   useOnDocument(
 *     'scroll',
 *     $(() => {
 *       console.log('body scrolled');
 *     })
 *   );
 * }
 *
 * const Cmp = component$(() => {
 *   useScroll();
 *   return <Host>Profit!</Host>;
 * });
 * ```
 *
 * @alpha
 */
// </docs>
function useOnDocument(event, eventQrl) {
    const el = useHostElement();
    const ctx = getContext(el);
    qPropWriteQRL(undefined, ctx, `on-document:${event}`, eventQrl);
}
// <docs markdown="../readme.md#useOnWindow">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useOnWindow instead)
/**
 * Register a listener on `window`.
 *
 * Used to programmatically add event listeners. Useful from custom `use*` methods, which do not
 * have access to the JSX.
 *
 * @see `useOn`, `useOnWindow`, `useOnDocument`.
 *
 * ```tsx
 * function useAnalytics() {
 *   useOnWindow(
 *     'popstate',
 *     $(() => {
 *       console.log('navigation happened');
 *       // report to analytics
 *     })
 *   );
 * }
 *
 * const Cmp = component$(() => {
 *   useAnalytics();
 *   return <Host>Profit!</Host>;
 * });
 * ```
 *
 * @alpha
 */
// </docs>
function useOnWindow(event, eventFn) {
    const el = useHostElement();
    const ctx = getContext(el);
    qPropWriteQRL(undefined, ctx, `on-window:${event}`, eventFn);
}
// <docs markdown="../readme.md#useStyles">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStyles instead)
/**
 * A lazy-loadable reference to a component's styles.
 *
 * Component styles allow Qwik to lazy load the style information for the component only when
 * needed. (And avoid double loading it in case of SSR hydration.)
 *
 * ```tsx
 * import styles from './code-block.css?inline';
 *
 * export const CmpStyles = component$(() => {
 *   useStyles$(styles);
 *
 *   return <Host>Some text</Host>;
 * });
 * ```
 *
 * @see `useScopedStyles`.
 *
 * @public
 */
// </docs>
function useStylesQrl(styles) {
    _useStyles(styles, false);
}
// <docs markdown="../readme.md#useStyles">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStyles instead)
/**
 * A lazy-loadable reference to a component's styles.
 *
 * Component styles allow Qwik to lazy load the style information for the component only when
 * needed. (And avoid double loading it in case of SSR hydration.)
 *
 * ```tsx
 * import styles from './code-block.css?inline';
 *
 * export const CmpStyles = component$(() => {
 *   useStyles$(styles);
 *
 *   return <Host>Some text</Host>;
 * });
 * ```
 *
 * @see `useScopedStyles`.
 *
 * @public
 */
// </docs>
const useStyles$ = implicit$FirstArg(useStylesQrl);
// <docs markdown="../readme.md#useScopedStyles">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useScopedStyles instead)
/**
 * @see `useStyles`.
 *
 * @alpha
 */
// </docs>
function useScopedStylesQrl(styles) {
    _useStyles(styles, true);
}
// <docs markdown="../readme.md#useScopedStyles">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useScopedStyles instead)
/**
 * @see `useStyles`.
 *
 * @alpha
 */
// </docs>
const useScopedStyles$ = implicit$FirstArg(useScopedStylesQrl);
// <docs markdown="../readme.md#component">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#component instead)
/**
 * Declare a Qwik component that can be used to create UI.
 *
 * Use `component$` to declare a Qwik component. A Qwik component is a special kind of component
 * that allows the Qwik framework to lazy load and execute the component independently of other
 * Qwik components as well as lazy load the component's life-cycle hooks and event handlers.
 *
 * Side note: You can also declare regular (standard JSX) components that will have standard
 * synchronous behavior.
 *
 * Qwik component is a facade that describes how the component should be used without forcing the
 * implementation of the component to be eagerly loaded. A minimum Qwik definition consists of:
 *
 * ### Example:
 *
 * An example showing how to create a counter component:
 *
 * ```tsx
 * export interface CounterProps {
 *   initialValue?: number;
 *   step?: number;
 * }
 * export const Counter = component$((props: CounterProps) => {
 *   const state = useStore({ count: props.initialValue || 0 });
 *   return (
 *     <div>
 *       <span>{state.count}</span>
 *       <button onClick$={() => (state.count += props.step || 1)}>+</button>
 *     </div>
 *   );
 * });
 * ```
 *
 * - `component$` is how a component gets declared.
 * - `{ value?: number; step?: number }` declares the public (props) interface of the component.
 * - `{ count: number }` declares the private (state) interface of the component.
 *
 * The above can then be used like so:
 *
 * ```tsx
 * export const OtherComponent = component$(() => {
 *   return <Counter initialValue={100} />;
 * });
 * ```
 *
 * See also: `component`, `useCleanup`, `onResume`, `onPause`, `useOn`, `useOnDocument`,
 * `useOnWindow`, `useStyles`, `useScopedStyles`
 *
 * @public
 */
// </docs>
function componentQrl(onRenderQrl, options = {}) {
    const tagName = options.tagName ?? 'div';
    // Return a QComponent Factory function.
    return function QSimpleComponent(props, key) {
        const finalKey = onRenderQrl.getCanonicalSymbol() + ':' + (key ? key : '');
        return jsx(tagName, { [OnRenderProp]: onRenderQrl, ...props }, finalKey);
    };
}
// <docs markdown="../readme.md#component">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#component instead)
/**
 * Declare a Qwik component that can be used to create UI.
 *
 * Use `component$` to declare a Qwik component. A Qwik component is a special kind of component
 * that allows the Qwik framework to lazy load and execute the component independently of other
 * Qwik components as well as lazy load the component's life-cycle hooks and event handlers.
 *
 * Side note: You can also declare regular (standard JSX) components that will have standard
 * synchronous behavior.
 *
 * Qwik component is a facade that describes how the component should be used without forcing the
 * implementation of the component to be eagerly loaded. A minimum Qwik definition consists of:
 *
 * ### Example:
 *
 * An example showing how to create a counter component:
 *
 * ```tsx
 * export interface CounterProps {
 *   initialValue?: number;
 *   step?: number;
 * }
 * export const Counter = component$((props: CounterProps) => {
 *   const state = useStore({ count: props.initialValue || 0 });
 *   return (
 *     <div>
 *       <span>{state.count}</span>
 *       <button onClick$={() => (state.count += props.step || 1)}>+</button>
 *     </div>
 *   );
 * });
 * ```
 *
 * - `component$` is how a component gets declared.
 * - `{ value?: number; step?: number }` declares the public (props) interface of the component.
 * - `{ count: number }` declares the private (state) interface of the component.
 *
 * The above can then be used like so:
 *
 * ```tsx
 * export const OtherComponent = component$(() => {
 *   return <Counter initialValue={100} />;
 * });
 * ```
 *
 * See also: `component`, `useCleanup`, `onResume`, `onPause`, `useOn`, `useOnDocument`,
 * `useOnWindow`, `useStyles`, `useScopedStyles`
 *
 * @public
 */
// </docs>
function component$(onMount, options) {
    return componentQrl($(onMount), options);
}
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
            type: 'style',
            styleId,
            content: scoped ? styleText.replace(/�/g, styleId) : styleText,
        };
        return task;
    }));
}

/* eslint-disable */
/**
 * @public
 */
function h(type, props, ...children) {
    // Using legacy h() jsx transform and morphing it
    // so it can use the modern vdom structure
    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
    // https://www.typescriptlang.org/tsconfig#jsxImportSource
    const normalizedProps = {
        children: arguments.length > 2 ? flattenArray(children) : EMPTY_ARRAY,
    };
    let key;
    let i;
    for (i in props) {
        if (i == 'key')
            key = props[i];
        else
            normalizedProps[i] = props[i];
    }
    return new JSXNodeImpl(type, normalizedProps, key);
}

/**
 * @public
 */
const Slot = (props) => {
    const hasChildren = props.children || (Array.isArray(props.children) && props.children.length > 0);
    const newChildrem = !hasChildren
        ? []
        : jsx('q:fallback', {
            children: props.children,
        });
    return jsx('q:slot', {
        name: props.name,
        children: newChildrem,
    }, props.name);
};

/**
 * QWIK_VERSION
 * @public
 */
const version = "0.0.22";

/**
 * Render JSX.
 *
 * Use this method to render JSX. This function does reconciling which means
 * it always tries to reuse what is already in the DOM (rather then destroy and
 * recrate content.)
 *
 * @param parent - Element which will act as a parent to `jsxNode`. When
 *     possible the rendering will try to reuse existing nodes.
 * @param jsxNode - JSX to render
 * @alpha
 */
async function render(parent, jsxNode) {
    // If input is not JSX, convert it
    if (!isJSXNode(jsxNode)) {
        jsxNode = jsx(jsxNode, null);
    }
    const doc = getDocument(parent);
    const containerEl = getElement(parent);
    if (qDev && containerEl.hasAttribute('q:container')) {
        logError('You can render over a existing q:container. Skipping render().');
        return;
    }
    injectQContainer(containerEl);
    const containerState = getContainerState(containerEl);
    const ctx = {
        doc,
        containerState,
        hostElements: new Set(),
        operations: [],
        roots: [parent],
        components: [],
        containerEl,
        perf: {
            visited: 0,
            timing: [],
        },
    };
    await visitJsxNode(ctx, parent, processNode(jsxNode), false);
    executeContext(ctx);
    if (!qTest) {
        injectQwikSlotCSS(parent);
    }
    if (qDev) {
        appendQwikDevTools(containerEl);
        if (typeof window !== 'undefined' && window.document != null) {
            printRenderStats(ctx);
        }
    }
    const promises = [];
    ctx.hostElements.forEach((host) => {
        const elCtx = getContext(host);
        elCtx.watches.forEach((watch) => {
            if (watch.f & WatchFlags.IsDirty) {
                promises.push(runWatch(watch, containerState));
            }
        });
    });
    await Promise.all(promises);
    return ctx;
}
function injectQwikSlotCSS(docOrElm) {
    const doc = getDocument(docOrElm);
    const element = isDocument(docOrElm) ? docOrElm.head : docOrElm;
    const style = doc.createElement('style');
    style.setAttribute('id', 'qwik/base-styles');
    style.textContent = `q\\:slot{display:contents}q\\:fallback{display:none}q\\:fallback:last-child{display:contents}`;
    element.insertBefore(style, element.firstChild);
}
function getElement(docOrElm) {
    return isDocument(docOrElm) ? docOrElm.documentElement : docOrElm;
}
function injectQContainer(containerEl) {
    containerEl.setAttribute('q:version', version || '');
    containerEl.setAttribute(QContainerAttr, 'resumed');
}

/**
 * @alpha
 */
function createContext(name) {
    return Object.freeze({
        id: fromCamelToKebabCase(name),
    });
}
/**
 * @alpha
 */
function useContextProvider(context, newValue) {
    const [value, setValue] = useSequentialScope();
    if (value) {
        return;
    }
    const invokeContext = getInvokeContext();
    const hostElement = invokeContext.hostElement;
    const renderCtx = invokeContext.renderCtx;
    const ctx = getContext(hostElement);
    let contexts = ctx.contexts;
    if (!contexts) {
        ctx.contexts = contexts = new Map();
    }
    newValue = unwrapSubscriber(newValue);
    contexts.set(context.id, newValue);
    const serializedContexts = [];
    contexts.forEach((_, key) => {
        serializedContexts.push(`${key}`);
    });
    setAttribute(renderCtx, hostElement, QCtxAttr, serializedContexts.join(' '));
    setValue(true);
}
/**
 * @alpha
 */
function useContext(context) {
    const value = _useContext(context);
    return wrapSubscriber(value, useHostElement());
}
function _useContext(context) {
    const [value, setValue] = useSequentialScope();
    if (!value) {
        const invokeContext = getInvokeContext();
        let hostElement = invokeContext.hostElement;
        const components = invokeContext.renderCtx.components;
        for (let i = components.length - 1; i >= 0; i--) {
            hostElement = components[i].hostElement;
            const ctx = getContext(components[i].hostElement);
            if (ctx.contexts) {
                const found = ctx.contexts.get(context.id);
                if (found) {
                    setValue(found);
                    return found;
                }
            }
        }
        const foundEl = hostElement.closest(`[q\\:ctx*="${context.id}"]`);
        if (foundEl) {
            const value = getContext(foundEl).contexts.get(context.id);
            if (value) {
                setValue(value);
                return value;
            }
        }
        throw new Error(`not found state for useContext: ${context.id}`);
    }
    return value;
}

export { $, Fragment, Host, SkipRerender, Slot, component$, componentQrl, createContext, getPlatform, h, handleWatch, immutable, implicit$FirstArg, inlinedQrl, jsx, jsx as jsxDEV, jsx as jsxs, mutable, noSerialize, pauseContainer, qrl, render, setPlatform, unwrapSubscriber, useCleanup$, useCleanupQrl, useClientEffect$, useClientEffectQrl, useClientMount$, useClientMountQrl, useContext, useContextProvider, useDocument, useHostElement, useLexicalScope, useMount$, useMountQrl, useOn, useOnDocument, useOnWindow, useRef, useResume$, useResumeQrl, useScopedStyles$, useScopedStylesQrl, useSequentialScope, useServerMount$, useServerMountQrl, useStore, useStyles$, useStylesQrl, useWaitOn, useWatch$, useWatchQrl, version, wrapSubscriber };
//# sourceMappingURL=core.mjs.map
