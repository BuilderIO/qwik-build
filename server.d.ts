/// <reference path="./server-modules.d.ts" />

import type { QwikManifest } from './core/optimizer';
import type { SnapshotResult } from './core';
import type { StreamWriter } from './core';
import type { SymbolMapper } from './core/optimizer';
import type { SymbolMapperFn } from './core/optimizer';

/**
 * Utility timer function for performance profiling.
 * Returns a duration of 0 in environments that do not support performance.
 * @alpha
 */
export declare function createTimer(): () => number;

/**
 * `link-prefetch-html`: Render link rel=prefetch within the html
 *
 * `link-prefetch`: Use JS to add link rel=prefetch, add worker-fetch if not supported
 *
 * `link-preload-html`: Render link rel=preload within the html
 *
 * `link-preload`: Use JS to add link rel=preload, add worker-fetch if not supported
 *
 * `link-modulepreload-html`: Render link rel=modulepreload within the html
 *
 * `link-modulepreload`: Use JS to add link rel=modulepreload, add worker-fetch if not supported
 *
 * `worker-fetch`: Add worker-fetch JS
 *
 * `none`: Do not add any prefetch links
 *
 * @deprecated Use the `PrefetchImplementation` object options instead.
 * @alpha
 */
declare type DeprecatedPrefetchImplementation = 'link-prefetch-html' | 'link-prefetch' | 'link-preload-html' | 'link-preload' | 'link-modulepreload-html' | 'link-modulepreload' | 'worker-fetch' | 'none';

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
export declare interface InOrderAuto {
    strategy: 'auto';
}

/**
 * @alpha
 */
export declare interface InOrderDisabled {
    strategy: 'disabled';
}

/**
 * @alpha
 */
export declare type InOrderStreaming = InOrderAuto | InOrderDisabled;

/**
 * @alpha
 */
export declare interface PrefetchImplementation {
    /**
     * `js-append`: Use JS runtime to create each `<link>` and append to the body.
     *
     * `html-append`: Render each `<link>` within html, appended at the end of the body.
     */
    linkInsert?: 'js-append' | 'html-append' | null;
    /**
     * Value of the `<link rel="...">` attribute when link is used.
     * Defaults to `prefetch` if links are inserted.
     */
    linkRel?: 'prefetch' | 'preload' | 'modulepreload' | null;
    /**
     * `always`: Always include the worker fetch JS runtime.
     *
     * `no-link-support`: Only include the worker fetch JS runtime when the browser doesn't support `<link>` prefetch/preload/modulepreload.
     */
    workerFetchInsert?: 'always' | 'no-link-support' | null;
}

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
    implementation?: PrefetchImplementation | DeprecatedPrefetchImplementation;
    symbolsToPrefetch?: SymbolsToPrefetch;
}

/**
 * @alpha
 */
export declare interface QwikLoaderOptions {
    events?: string[];
    include?: 'always' | 'never' | 'auto';
    position?: 'top' | 'bottom';
}

/**
 * @alpha
 */
export declare type Render = RenderToString | RenderToStream;

/**
 * @alpha
 */
export declare interface RenderOptions extends SerializeDocumentOptions {
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
    qwikLoader?: QwikLoaderOptions;
    prefetchStrategy?: PrefetchStrategy | null;
    /**
     * When set, the app is serialized into a fragment. And the returned html is not a complete document.
     * Defaults to `undefined`
     */
    fragmentTagName?: string;
    envData?: Record<string, any>;
}

/**
 * @alpha
 */
export declare interface RenderResult {
    prefetchResources: PrefetchResource[];
    snapshotResult: SnapshotResult | null;
    timing: {
        createDocument: number;
        render: number;
        snapshot: number;
        toString: number;
    };
}

/**
 * @alpha
 */
export declare type RenderToStream = (opts: RenderToStreamOptions) => Promise<RenderToStreamResult>;

/**
 * Creates a server-side `document`, renders to root node to the document,
 * then serializes the document to a string.
 *
 * @alpha
 *
 */
export declare function renderToStream(rootNode: any, opts: RenderToStreamOptions): Promise<RenderToStreamResult>;

/**
 * @alpha
 */
export declare interface RenderToStreamOptions extends RenderOptions {
    stream: StreamWriter;
    streaming?: StreamingOptions;
}

/**
 * @alpha
 */
export declare interface RenderToStreamResult extends RenderResult {
}

/**
 * @alpha
 */
export declare type RenderToString = (opts: RenderToStringOptions) => Promise<RenderToStringResult>;

/**
 * Creates a server-side `document`, renders to root node to the document,
 * then serializes the document to a string.
 *
 * @alpha
 *
 */
export declare function renderToString(rootNode: any, opts?: RenderToStringOptions): Promise<RenderToStringResult>;

/**
 * @alpha
 */
export declare interface RenderToStringOptions extends RenderOptions {
}

/**
 * @alpha
 */
export declare interface RenderToStringResult extends RenderResult {
    html: string;
}

/**
 * @alpha
 */
export declare interface SerializeDocumentOptions {
    manifest?: QwikManifest;
    symbolMapper?: SymbolMapperFn;
    url?: URL | string;
    debug?: boolean;
}

/**
 * Applies NodeJS specific platform APIs to the passed in document instance.
 *
 * @alpha
 *
 */
export declare function setServerPlatform(document: any, opts: SerializeDocumentOptions, mapper: SymbolMapper | undefined): Promise<void>;

/**
 * @alpha
 */
export declare interface StreamingOptions {
    inOrder?: InOrderStreaming;
}

/**
 * auto: Prefetch all possible QRLs used by the document. Default
 *
 * @alpha
 */
export declare type SymbolsToPrefetch = 'auto' | ((opts: {
    manifest: QwikManifest;
}) => PrefetchResource[]);

/**
 * @public
 */
export declare const versions: {
    readonly qwik: string;
    readonly qwikDom: string;
};

export { }
