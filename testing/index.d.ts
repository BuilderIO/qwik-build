/**
 * @alpha
 */
declare interface ComponentCtx {
    $hostElement$: Element;
    $styleId$: string | undefined;
    $styleClass$: string | undefined;
    $styleHostClass$: string | undefined;
    $slots$: ProcessedJSXNode[];
}

/**
 * @alpha
 */
declare interface ContainerState {
    $proxyMap$: ObjToProxyMap;
    $subsManager$: SubscriptionManager;
    $platform$: CorePlatform;
    $watchNext$: Set<WatchDescriptor>;
    $watchStaging$: Set<WatchDescriptor>;
    $hostsNext$: Set<Element>;
    $hostsStaging$: Set<Element>;
    $hostsRendering$: Set<Element> | undefined;
    $renderPromise$: Promise<RenderContext> | undefined;
}

/**
 * @public
 */
declare interface CorePlatform {
    /**
     * Dynamic import()
     */
    isServer: boolean;
    /**
     * Dynamic import()
     */
    importSymbol: (element: Element, url: string | URL, symbol: string) => ValueOrPromise<any>;
    /**
     * Platform specific queue, such as process.nextTick() for Node
     * and requestAnimationFrame() for the browser.
     */
    raf: (fn: () => any) => Promise<any>;
    nextTick: (fn: () => any) => Promise<any>;
    /**
     * Takes a qrl and serializes into a string
     */
    chunkForSymbol: (symbolName: string) => [symbol: string, chunk: string] | undefined;
}

/**
 * Create emulated `Document` for server environment. Does not implement the full browser
 * `document` and `window` API. This api may be removed in the future.
 * @internal
 */
export declare function _createDocument(opts?: SerializeDocumentOptions): any;

/**
 * Utility timer function for performance profiling.
 * Returns a duration of 0 in environments that do not support performance.
 * @alpha
 */
export declare function createTimer(): () => number;

/**
 * Provides the qwikloader.js file as a string. Useful for tooling to inline the qwikloader
 * script into HTML.
 * @alpha
 */
export declare function getQwikLoaderScript(opts?: {
    events?: string[];
    debug?: boolean;
}): string;

/**
 * @alpha
 */
export declare interface GlobalInjections {
    tag: string;
    attributes?: {
        [key: string]: string;
    };
    location: 'head' | 'body';
    children?: string;
}

/**
 * @public
 */
declare interface InvokeContext {
    $url$: URL | null;
    $seq$: number;
    $doc$?: Document;
    $hostElement$?: Element;
    $element$?: Element;
    $event$: any;
    $qrl$?: QRL<any>;
    $waitOn$?: ValueOrPromise<any>[];
    $props$?: Props;
    $subscriber$?: Subscriber | null;
    $renderCtx$?: RenderContext;
}

/**
 * @public
 */
declare interface JSXNode<T = any> {
    type: T;
    props: Record<string, any> | null;
    key: string | number | null;
}

declare interface LocalSubscriptionManager {
    $subs$: SubscriberMap;
    $notifySubs$: (key?: string | undefined) => void;
    $addSub$: (subscriber: Subscriber, key?: string) => void;
}

/**
 * @alpha
 */
declare type NoSerialize<T> = (T & {
    __no_serialize__: true;
}) | undefined;

declare type ObjToProxyMap = WeakMap<any, any>;

/**
 * @public
 */
declare type OnRenderFn<PROPS> = (props: PROPS) => JSXNode<any> | null | (() => JSXNode<any>);

/**
 * @alpha
 */
export declare type PrefetchImplementation = 'link-prefetch-html' | 'link-prefetch' | 'link-preload-html' | 'link-preload' | 'link-modulepreload-html' | 'link-modulepreload' | 'worker-fetch' | 'none';

/**
 * @alpha
 */
export declare interface PrefetchResource {
    url: string;
    imports: PrefetchResource[];
}

/**
 * @alpha
 */
export declare interface PrefetchStrategy {
    implementation?: PrefetchImplementation;
    symbolsToPrefetch?: SymbolsToPrefetch;
}

declare interface ProcessedJSXNode {
    $type$: string;
    $props$: Record<string, any> | null;
    $children$: ProcessedJSXNode[];
    $key$: string | null;
    $elm$: Node | null;
    $text$: string;
}

/**
 * @public
 */
declare type Props<T extends {} = {}> = Record<string, any> & T;

declare interface QContext {
    $cache$: Map<string, any>;
    $refMap$: QObjectMap;
    $element$: Element;
    $dirty$: boolean;
    $props$: Record<string, any> | undefined;
    $renderQrl$: QRL<OnRenderFn<any>> | undefined;
    $component$: ComponentCtx | undefined;
    $listeners$?: Map<string, QRL<any>[]>;
    $seq$: any[];
    $watches$: WatchDescriptor[];
    $contexts$?: Map<string, any>;
}

declare type QObject<T extends {}> = T & {
    __brand__: 'QObject';
};

declare interface QObjectMap {
    $add$(qObject: QObject<any>): number;
    $get$(index: number): QObject<any> | undefined;
    $indexOf$(object: QObject<any>): number | undefined;
    readonly $array$: QObject<any>[];
}

/**
 * The `QRL` type represents a lazy-loadable AND serializable resource.
 *
 * QRL stands for Qwik URL.
 *
 * Use `QRL` when you want to refer to a lazy-loaded resource. `QRL`s are most often used for
 * code (functions) but can also be used for other resources such as `string`s in the case of
 * styles.
 *
 * `QRL` is an opaque token that is generated by the Qwik Optimizer. (Do not rely on any
 * properties in `QRL` as it may change between versions.)
 *
 * ## Creating `QRL` references
 *
 * Creating `QRL` is done using `$(...)` function. `$(...)` is a special marker for the Qwik
 * Optimizer that marks that the code should be extracted into a lazy-loaded symbol.
 *
 * ```tsx
 * useOnDocument(
 *   'mousemove',
 *   $(() => console.log('mousemove'))
 * );
 * ```
 *
 * In the above code the Qwik Optimizer detects `$(...)` and transforms the code as shown below:
 *
 * ```tsx
 * // FILE: <current file>
 * useOnDocument('mousemove', qrl('./chunk-abc.js', 'onMousemove'));
 *
 * // FILE: chunk-abc.js
 * export const onMousemove = () => console.log('mousemove');
 * ```
 *
 * NOTE: `qrl(...)` is a result of Qwik Optimizer transformation. You should never have to invoke
 * this function directly in your application. The `qrl(...)` function should be invoked only
 * after Qwik Optimizer transformation.
 *
 * ## Using `QRL`s
 *
 * Use `QRL` type in your application when you want to get a lazy-loadable reference to a
 * resource (most likely a function).
 *
 * ```tsx
 * // Example of declaring a custom functions which takes callback as QRL.
 * export function useMyFunction(callback: QRL<() => void>) {
 *   doExtraStuff();
 *   // The callback passed to `onDocument` requires `QRL`.
 *   useOnDocument('mousemove', callback);
 * }
 * ```
 *
 * In the above example the way to think about the code is that you are not asking for a callback
 * function, but rather a reference to a lazy-loadable callback function. Specifically the
 * function loading should be delayed until it is actually needed. In the above example the
 * function would not load until after a `mousemove` event on `document` fires.
 *
 * ## Resolving `QRL` references
 *
 * At times it may be necessary to resolve a `QRL` reference to the actual value. This can be
 * performed using `qrlImport(..)` function.
 *
 * ```tsx
 * // Assume you have QRL reference to a greet function
 * const lazyGreet: QRL<() => void> = $(() => console.log('Hello World!'));
 *
 * // Use `qrlImport` to load / resolve the reference.
 * const greet: () => void = await lazyGreet.resolve(element);
 *
 * //  Invoke it
 * greet();
 * ```
 *
 * NOTE: `element` is needed because `QRL`s are relative and need a base location to resolve
 * against. The base location is encoded in the HTML in the form of `<div q:base="/url">`.
 *
 * ## Question: Why not just use `import()`?
 *
 * At first glance `QRL` serves the same purpose as `import()`. However, there are three subtle
 * differences that need to be taken into account.
 *
 * 1. `QRL`s must be serializable into HTML.
 * 2. `QRL`s must be resolved by framework relative to `q:base`.
 * 3. `QRL`s must be able to capture lexically scoped variables.
 * 4. `QRL`s encapsulate the difference between running with and without Qwik Optimizer.
 * 5. `QRL`s allow expressing lazy-loaded boundaries without thinking about chunk and symbol
 * names.
 *
 * Let's assume that you intend to write code such as this:
 *
 * ```typescript
 * return <button onClick={() => (await import('./chunk-abc.js')).onClick}>
 * ```
 *
 * The above code needs to be serialized into DOM such as:
 *
 * ```
 * <div q:base="/build/">
 *   <button on:lick="./chunk-abc.js#onClick">...</button>
 * </div>
 * ```
 *
 * 1. Notice there is no easy way to extract chunk (`./chunk-abc.js`) and symbol (`onClick`) into
 * HTML.
 * 2. Notice that even if you could extract it, the `import('./chunk-abc.js')` would become
 * relative to where the `import()` file is declared. Because it is our framework doing the load,
 * the `./chunk-abc.js` would become relative to the framework file. This is not correct, as it
 * should be relative to the original file generated by the bundler.
 * 3. Next the framework needs to resolve the `./chunk-abc.js` and needs a base location that is
 * encoded in the HTML.
 * 4. The QRL needs to be able to capture lexically scoped variables. (`import()` only allows
 * loading top-level symbols which don't capture variables.)
 * 5. As a developer you don't want to think about `import` and naming of the chunks and symbols.
 * You just want to say, this should be lazy.
 *
 * These are the main reasons why Qwik introduces its own concept of `QRL`.
 *
 * @see `$`
 *
 * @public
 */
declare interface QRL<TYPE = any> {
    __brand__QRL__: TYPE;
    getSymbol(): string;
    getHash(): string;
    resolve(container?: Element): Promise<TYPE>;
    resolveLazy(container?: Element): ValueOrPromise<TYPE>;
    invoke(...args: TYPE extends (...args: infer ARGS) => any ? ARGS : never): Promise<TYPE extends (...args: any[]) => infer RETURN ? RETURN : never>;
    invokeFn(el?: Element, context?: InvokeContext, beforeFn?: () => void): TYPE extends (...args: infer ARGS) => infer RETURN ? (...args: ARGS) => ValueOrPromise<RETURN> : never;
}

/**
 * @alpha
 */
export declare interface QwikBundle {
    size: number;
    symbols: string[];
    imports?: string[];
    dynamicImports?: string[];
}

/**
 * @alpha
 */
export declare interface QwikManifest {
    symbols: {
        [symbolName: string]: QwikSymbol;
    };
    mapping: {
        [symbolName: string]: string;
    };
    bundles: {
        [fileName: string]: QwikBundle;
    };
    injections?: GlobalInjections[];
    version: string;
    options?: {
        target?: string;
        buildMode?: string;
        forceFullBuild?: boolean;
        entryStrategy?: {
            [key: string]: any;
        };
    };
    platform?: {
        [name: string]: string;
    };
}

/**
 * @alpha
 */
export declare interface QwikSymbol {
    origin: string;
    displayName: string;
    hash: string;
    canonicalFilename: string;
    ctxKind: 'function' | 'event';
    ctxName: string;
    captures: boolean;
    parent: string | null;
}

/**
 * @public
 */
export declare type Render = (opts: RenderOptions) => Promise<RenderToStringResult>;

/**
 * @alpha
 */
declare interface RenderContext {
    $doc$: Document;
    $roots$: Element[];
    $hostElements$: Set<Element>;
    $operations$: RenderOperation[];
    $contexts$: QContext[];
    $currentComponent$: ComponentCtx | undefined;
    $containerState$: ContainerState;
    $containerEl$: Element;
    $perf$: RenderPerf;
}

/**
 * @alpha
 */
declare interface RenderOperation {
    $el$: Node;
    $operation$: string;
    $args$: any[];
    $fn$: () => void;
}

/**
 * @public
 */
export declare interface RenderOptions extends RenderToStringOptions {
}

/**
 * @alpha
 */
declare interface RenderPerf {
    $visited$: number;
}

/**
 * Creates a server-side `document`, renders to root node to the document,
 * then serializes the document to a string.
 * @public
 */
export declare function renderToString(rootNode: any, opts?: RenderToStringOptions): Promise<RenderToStringResult>;

/**
 * @public
 */
export declare interface RenderToStringOptions extends SerializeDocumentOptions {
    /**
     * Defaults to `true`
     */
    snapshot?: boolean;
    /**
     * Specifies the root of the JS files of the client build.
     * Setting a base, will cause the render of the `q:base` attribute in the `q:container` element.
     */
    base?: string;
    /**
     * Specifies if the Qwik Loader script is added to the document or not. Defaults to `{ include: true }`.
     */
    qwikLoader?: {
        events?: string[];
        include?: boolean | 'top' | 'bottom';
    };
    prefetchStrategy?: PrefetchStrategy | null;
    /**
     * When set, the app is serialized into a fragment. And the returned html is not a complete document.
     * Defaults to `undefined`
     */
    fragmentTagName?: string;
}

/**
 * @public
 */
export declare interface RenderToStringResult {
    prefetchResources: PrefetchResource[];
    snapshotResult: SnapshotResult | null;
    html: string;
    timing: {
        createDocument: number;
        render: number;
        toString: number;
    };
}

/**
 * Serializes the given `document` to a string. Additionally, will serialize the
 * Qwik component state and optionally add Qwik protocols to the document.
 * @public
 */
export declare function serializeDocument(docOrEl: Document | Element, opts?: SerializeDocumentOptions): string;

/**
 * @public
 */
declare interface SerializeDocumentOptions {
    manifest?: QwikManifest;
    symbolMapper?: SymbolMapperFn;
    url?: URL | string;
    html?: string;
    debug?: boolean;
}

/**
 * Applies NodeJS specific platform APIs to the passed in document instance.
 * @public
 */
export declare function setServerPlatform(document: any, opts: SerializeDocumentOptions, mapper: SymbolMapper | undefined): Promise<void>;

/**
 * @public
 */
declare interface SnapshotListener {
    key: string;
    qrl: QRL<any>;
}

declare type SnapshotMeta = Record<string, SnapshotMetaValue>;

/**
 * @public
 */
declare interface SnapshotMetaValue {
    r?: string;
    w?: string;
    s?: string;
    h?: string;
    c?: string;
}

/**
 * @public
 */
export declare interface SnapshotResult {
    state: SnapshotState;
    listeners: SnapshotListener[];
    objs: any[];
}

/**
 * @public
 */
declare interface SnapshotState {
    ctx: SnapshotMeta;
    objs: any[];
    subs: any[];
}

/**
 * @alpha
 */
declare type Subscriber = WatchDescriptor | Element;

declare type SubscriberMap = Map<Subscriber, Set<string> | null>;

declare interface SubscriptionManager {
    $tryGetLocal$(obj: any): LocalSubscriptionManager | undefined;
    $getLocal$(obj: any, map?: SubscriberMap): LocalSubscriptionManager;
    $clearSub$: (sub: Subscriber) => void;
}

declare type SymbolMapper = Record<string, [symbol: string, chunk: string]>;

/**
 * @alpha
 */
declare type SymbolMapperFn = (symbolName: string, mapper: SymbolMapper | undefined) => [symbol: string, chunk: string] | undefined;

/**
 * auto: Prefetch all possible QRLs used by the document. Default
 *
 * @alpha
 */
declare type SymbolsToPrefetch = 'auto' | ((opts: {
    manifest: QwikManifest;
}) => PrefetchResource[]);

/**
 * Used to signal to Qwik which state should be watched for changes.
 *
 * The `Tracker` is passed into the `watchFn` of `useWatch`. It is intended to be used to wrap
 * state objects in a read proxy which signals to Qwik which properties should be watched for
 * changes. A change to any of the properties cause the `watchFn` to re-run.
 *
 * ## Example
 *
 * The `obs` passed into the `watchFn` is used to mark `state.count` as a property of interest.
 * Any changes to the `state.count` property will cause the `watchFn` to re-run.
 *
 * ```tsx
 * const Cmp = component$(() => {
 *   const store = useStore({ count: 0, doubleCount: 0 });
 *   useWatch$((track) => {
 *     const count = track(store, 'count');
 *     store.doubleCount = 2 * count;
 *   });
 *   return (
 *     <div>
 *       <span>
 *         {store.count} / {store.doubleCount}
 *       </span>
 *       <button onClick$={() => store.count++}>+</button>
 *     </div>
 *   );
 * });
 * ```
 *
 * @see `useWatch`
 *
 * @public
 */
declare interface Tracker {
    <T extends {}>(obj: T): T;
    <T extends {}, B extends keyof T>(obj: T, prop: B): T[B];
}

/**
 * Type representing a value which is either resolve or a promise.
 * @public
 */
declare type ValueOrPromise<T> = T | Promise<T>;

/**
 * @public
 */
export declare const versions: {
    readonly qwik: string;
    readonly qwikDom: string;
};

/**
 * @alpha
 */
declare interface WatchDescriptor {
    qrl: QRL<WatchFn>;
    el: Element;
    f: number;
    i: number;
    destroy?: NoSerialize<() => void>;
    running?: NoSerialize<Promise<WatchDescriptor>>;
}

/**
 * @alpha
 */
declare type WatchFn = (track: Tracker) => ValueOrPromise<void | (() => void)>;

export { }
