/**
 * Qwik Optimizer marker function.
 *
 * Use `$(...)` to tell Qwik Optimizer to extract the expression in `$(...)` into a lazy-loadable
 * resource referenced by `QRL`.
 *
 * @see `implicit$FirstArg` for additional `____$(...)` rules.
 *
 * In this example, `$(...)` is used to capture the callback function of `onmousemove` into a
 * lazy-loadable reference. This allows the code to refer to the function without actually
 * loading the function. In this example, the callback function does not get loaded until
 * `mousemove` event fires.
 *
 * ```tsx
 * useOnDocument(
 *   'mousemove',
 *   $((event) => console.log('mousemove', event))
 * );
 * ```
 *
 * In this code, the Qwik Optimizer detects `$(...)` and transforms the code into:
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
 * 2. If inlined function, then all lexically captured values must be:
 *    - importable (vars show up in `import`s or `export`s)
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
export declare const $: <T>(expression: T) => QRL<T>;

declare interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    download?: any;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    ping?: string | undefined;
    rel?: string | undefined;
    target?: HTMLAttributeAnchorTarget | undefined;
    type?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
}

declare interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string | undefined;
    coords?: string | undefined;
    download?: any;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    rel?: string | undefined;
    shape?: string | undefined;
    target?: string | undefined;
}

/**
 * @public
 */
export declare interface AriaAttributes {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    'aria-activedescendant'?: string | undefined;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    'aria-atomic'?: Booleanish | undefined;
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    'aria-busy'?: Booleanish | undefined;
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    'aria-colcount'?: number | undefined;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    'aria-colindex'?: number | undefined;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    'aria-colspan'?: number | undefined;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    'aria-controls'?: string | undefined;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | undefined;
    /**
     * Identifies the element (or elements) that describes the object.
     * @see aria-labelledby
     */
    'aria-describedby'?: string | undefined;
    /**
     * Identifies the element that provides a detailed, extended description for the object.
     * @see aria-describedby.
     */
    'aria-details'?: string | undefined;
    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * @see aria-hidden @see aria-readonly.
     */
    'aria-disabled'?: Booleanish | undefined;
    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated in ARIA 1.1
     */
    'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | undefined;
    /**
     * Identifies the element that provides an error message for the object.
     * @see aria-invalid @see aria-describedby.
     */
    'aria-errormessage'?: string | undefined;
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    'aria-expanded'?: Booleanish | undefined;
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    'aria-flowto'?: string | undefined;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    'aria-grabbed'?: Booleanish | undefined;
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined;
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    'aria-hidden'?: Booleanish | undefined;
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined;
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    'aria-keyshortcuts'?: string | undefined;
    /**
     * Defines a string value that labels the current element.
     * @see aria-labelledby.
     */
    'aria-label'?: string | undefined;
    /**
     * Identifies the element (or elements) that labels the current element.
     * @see aria-describedby.
     */
    'aria-labelledby'?: string | undefined;
    /** Defines the hierarchical level of an element within a structure. */
    'aria-level'?: number | undefined;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
    /** Indicates whether an element is modal when displayed. */
    'aria-modal'?: Booleanish | undefined;
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    'aria-multiline'?: Booleanish | undefined;
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    'aria-multiselectable'?: Booleanish | undefined;
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
     * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     * @see aria-controls.
     */
    'aria-owns'?: string | undefined;
    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     */
    'aria-placeholder'?: string | undefined;
    /**
     * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-setsize.
     */
    'aria-posinset'?: number | undefined;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    'aria-readonly'?: Booleanish | undefined;
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals' | undefined;
    /** Indicates that user input is required on the element before a form may be submitted. */
    'aria-required'?: Booleanish | undefined;
    /** Defines a human-readable, author-localized description for the role of an element. */
    'aria-roledescription'?: string | undefined;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    'aria-rowcount'?: number | undefined;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    'aria-rowindex'?: number | undefined;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    'aria-rowspan'?: number | undefined;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    'aria-selected'?: Booleanish | undefined;
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    'aria-setsize'?: number | undefined;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
    /** Defines the maximum allowed value for a range widget. */
    'aria-valuemax'?: number | undefined;
    /** Defines the minimum allowed value for a range widget. */
    'aria-valuemin'?: number | undefined;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    'aria-valuenow'?: number | undefined;
    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    'aria-valuetext'?: string | undefined;
}

declare type AriaRole = 'alert' | 'alertdialog' | 'application' | 'article' | 'banner' | 'button' | 'cell' | 'checkbox' | 'columnheader' | 'combobox' | 'complementary' | 'contentinfo' | 'definition' | 'dialog' | 'directory' | 'document' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell' | 'group' | 'heading' | 'img' | 'link' | 'list' | 'listbox' | 'listitem' | 'log' | 'main' | 'marquee' | 'math' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'navigation' | 'none' | 'note' | 'option' | 'presentation' | 'progressbar' | 'radio' | 'radiogroup' | 'region' | 'row' | 'rowgroup' | 'rowheader' | 'scrollbar' | 'search' | 'searchbox' | 'separator' | 'slider' | 'spinbutton' | 'status' | 'switch' | 'tab' | 'table' | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem' | (string & {});

declare interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {
}

declare interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string | undefined;
    target?: string | undefined;
}

declare type BivariantEventHandler<T extends Event> = {
    bivarianceHack(event: T, element: Element): any;
}['bivarianceHack'];

declare interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string | undefined;
}

declare type Booleanish = 'true' | 'false';

declare interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    formAction?: string | undefined;
    formEncType?: string | undefined;
    formMethod?: string | undefined;
    formNoValidate?: boolean | undefined;
    formTarget?: string | undefined;
    name?: string | undefined;
    type?: 'submit' | 'reset' | 'button' | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

declare interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string | undefined;
    width?: number | string | undefined;
}

declare interface ClassAttributes<T> {
}

declare interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
    span?: number | undefined;
}

declare interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
    span?: number | undefined;
    width?: number | string | undefined;
}

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
export declare const component$: <PROPS extends {}>(onMount: OnRenderFn<PROPS>, options?: ComponentOptions) => Component<PROPS>;

/**
 * Type representing the Qwik component.
 *
 * `Component` is the type returned by invoking `component$`.
 *
 * ```
 * interface MyComponentProps {
 *   someProp: string;
 * }
 * const MyComponent: Component<MyComponentProps> = component$((props: MyComponentProps) => {
 *   return <span>{props.someProp}</span>;
 * });
 * ```
 *
 * @public
 */
export declare type Component<PROPS extends {}> = FunctionComponent<PublicProps<PROPS>>;

/**
 * @public
 */
declare interface ComponentBaseProps extends PreventDefault, ComponentCustomEvents, ComponentKnownEvents {
    class?: string | {
        [className: string]: boolean;
    };
    className?: string | undefined;
    style?: CSSProperties | string | undefined;
    key?: string | number;
    id?: string | undefined;
    ref?: Ref<Element>;
    'q:slot'?: string;
    [key: `host:${string}`]: any;
    'host:tagName'?: JSXTagName;
    children?: JSXChildren;
}

declare interface ComponentCustomEvents {
    [key: `${'host'}on:${string}$`]: NativeEventHandler<Event>;
    [key: `${'window' | 'document'}:on${string}$`]: NativeEventHandler<Event> | undefined;
}

declare type ComponentKnownEvents = {
    [K in keyof QwikEventMap as `${'host' | 'window' | 'document'}:on${K}$`]?: NativeEventHandler<QwikEventMap[K]>;
};

/**
 * Declarative component options.
 *
 * @public
 */
export declare interface ComponentOptions {
    /**
     * Tag the name of the component's host element.
     *
     * Default value fo `tagName` is `div`. Override this value in situations where you want to use
     * a different tag name. Examples are:
     * - It is desirable to have component names directly in the HTML (WebComponent style)
     * - It is desirable to have a specific tag name for accessibility. For example, using `<button>`
     *   for `<MyCustomButton>` component.
     *
     * When a component is inserted into the render tree, the host element needs to be inserted
     * synchronously, while the component body is inserted asynchronously. The synchronous nature
     * of host element requires that the parent component needs to know the tag name of the child
     * component synchronously.
     */
    tagName?: JSXTagName;
}

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
export declare const componentQrl: <PROPS extends {}>(onRenderQrl: QRL<OnRenderFn<PROPS>>, options?: ComponentOptions) => Component<PROPS>;

/**
 * Context is a typesafe ID for your context.
 *
 * Context is a way to pass stores to the child components without prop-drilling.
 *
 * Use `createContext()` to create a `Context`. `Context` is just a serializable identifier for
 * the context. It is not the context value itself. See `useContextProvider()` and `useContext()`
 * for the values. Qwik needs a serializable ID for the context so that the it can track context
 * providers and consumers in a way that survives resumability.
 *
 * ## Example
 *
 * ```tsx
 * // Declare the Context type.
 * interface TodosStore {
 *   items: string[];
 * }
 * // Create a Context ID (no data is saved here.)
 * // You will use this ID to both create and retrieve the Context.
 * export const TodosContext = createContext<TodosStore>('Todos');
 *
 * // Example of providing context to child components.
 * export const App = component$(() => {
 *   useContextProvider(
 *     TodosContext,
 *     useStore<TodosStore>({
 *       items: ['Learn Qwik', 'Build Qwik app', 'Profit'],
 *     })
 *   );
 *
 *   return <Items />;
 * });
 *
 * // Example of retrieving the context provided by a parent component.
 * export const Items = component$(() => {
 *   const todos = useContext(TodosContext);
 *   return (
 *     <ul>
 *       {todos.items.map((item) => (
 *         <li>{item}</li>
 *       ))}
 *     </ul>
 *   );
 * });
 *
 * ```
 * @alpha
 */
export declare interface Context<STATE extends object> {
    /**
     * Design-time property to store type information for the context.
     */
    readonly __brand_context_type__: STATE;
    /**
     * A unique ID for the context.
     */
    readonly id: string;
}

/**
 * Low-level API for platform abstraction.
 *
 * Different platforms (browser, node, service workers) may have different ways of handling
 * things such as `requestAnimationFrame` and imports. To make Qwik platform-independent Qwik
 * uses the `CorePlatform` API to access the platform API.
 *
 * `CorePlatform` also is responsible for importing symbols. The import map is different on the
 * client (browser) then on the server. For this reason, the server has a manifest that is used
 * to map symbols to javascript chunks. The manifest is encapsulated in `CorePlatform`, for this
 * reason, the `CorePlatform` can't be global as there may be multiple applications running at
 * server concurrently.
 *
 * This is a low-level API and there should not be a need for you to access this.
 *
 * @alpha
 */
export declare interface CorePlatform {
    /**
     * True of running on the server platform.
     *
     * @returns True if we are running on the server (not the browser.)
     */
    isServer: boolean;
    /**
     * Retrieve a symbol value from QRL.
     *
     * Qwik needs to lazy load data and closures. For this Qwik uses QRLs that are serializable
     * references of resources that are needed. The QRLs contain all the information necessary to
     * retrieved the reference using `importSymbol`.
     *
     * Why not use `import()`? Because `import()` is relative to the current file, and the current
     * file is always the Qwik framework. So QRLs have additional information that allows them to
     * serialize imports relative to application base rather than the Qwik framework file.
     *
     * @param element - The element against which the `url` is resolved. Used to locate the container
     * root and `q:base` attribute.
     * @param url - Relative URL retrieved from the attribute that needs to be resolved against the
     * container `q:base` attribute.
     * @param symbol - The name of the symbol to import.
     * @returns A promise that resolves to the imported symbol.
     */
    importSymbol: (element: Element, url: string | URL, symbol: string) => ValueOrPromise<any>;
    /**
     * Perform operation on next request-animation-frame.
     *
     * @param fn - The function to call when the next animation frame is ready.
     */
    raf: (fn: () => any) => Promise<any>;
    /**
     * Perform operation on next tick.
     *
     * @param fn - The function to call when the tick is ready.
     */
    nextTick: (fn: () => any) => Promise<any>;
    /**
     * Retrieve chunk name for the symbol.
     *
     * When the application is running on the server the symbols may be imported from different files
     * (as server build is typically a single javascript chunk.) For this reason, it is necessary to
     * convert the chunks from server format to client (browser) format. This is done by looking up
     * symbols (which are globally unique) in the manifest. (Manifest is the mapping of symbols to
     * the client chunk names.)
     *
     * @param symbolName - Resolve `symbolName` against the manifest and return the chunk that
     * contains the symbol.
     */
    chunkForSymbol: (symbolName: string) => [symbol: string, chunk: string] | undefined;
}

/**
 * Create a context ID to be used in your application.
 *
 * Context is a way to pass stores to the child components without prop-drilling.
 *
 * Use `createContext()` to create a `Context`. `Context` is just a serializable identifier for
 * the context. It is not the context value itself. See `useContextProvider()` and `useContext()`
 * for the values. Qwik needs a serializable ID for the context so that the it can track context
 * providers and consumers in a way that survives resumability.
 *
 * ## Example
 *
 * ```tsx
 * // Declare the Context type.
 * interface TodosStore {
 *   items: string[];
 * }
 * // Create a Context ID (no data is saved here.)
 * // You will use this ID to both create and retrieve the Context.
 * export const TodosContext = createContext<TodosStore>('Todos');
 *
 * // Example of providing context to child components.
 * export const App = component$(() => {
 *   useContextProvider(
 *     TodosContext,
 *     useStore<TodosStore>({
 *       items: ['Learn Qwik', 'Build Qwik app', 'Profit'],
 *     })
 *   );
 *
 *   return <Items />;
 * });
 *
 * // Example of retrieving the context provided by a parent component.
 * export const Items = component$(() => {
 *   const todos = useContext(TodosContext);
 *   return (
 *     <ul>
 *       {todos.items.map((item) => (
 *         <li>{item}</li>
 *       ))}
 *     </ul>
 *   );
 * });
 *
 * ```
 * @param name - The name of the context.
 * @alpha
 */
export declare const createContext: <STATE extends object>(name: string) => Context<STATE>;

declare interface CSSProperties {
    [key: string]: string | number;
}

declare interface CSSProperties_2 {
    [key: string]: string | number;
}

declare interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string | ReadonlyArray<string> | number | undefined;
}

declare interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string | undefined;
    dateTime?: string | undefined;
}

declare interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
    open?: boolean | undefined;
}

declare interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    open?: boolean | undefined;
}

/**
 * @public
 */
export declare interface DOMAttributes<T> extends QwikProps, QwikEvents {
    children?: JSXChildren;
    key?: string | number;
}

/**
 * @alpha
 */
export declare type EagernessOptions = 'visible' | 'load';

declare interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string | undefined;
    src?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
}

declare interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean | undefined;
    form?: string | undefined;
    name?: string | undefined;
}

declare interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    acceptCharset?: string | undefined;
    action?: string | undefined;
    autoComplete?: 'on' | 'off' | Omit<'on' | 'off', string> | undefined;
    encType?: string | undefined;
    method?: string | undefined;
    name?: string | undefined;
    noValidate?: boolean | undefined;
    target?: string | undefined;
}

/**
 * @public
 */
export declare const Fragment: FunctionComponent<{
    children?: any;
}>;

/**
 * @public
 */
export declare interface FunctionComponent<P = {}> {
    (props: P, key?: string): JSXNode | null;
}

/**
 * Retrieve the `CorePlatform`.
 *
 * The `CorePlatform` is also responsible for retrieving the Manifest, that contains mappings
 * from symbols to javascript import chunks. For this reason, `CorePlatform` can't be global, but
 * is specific to the application currently running. On server it is possible that many different
 * applications are running in a single server instance, and for this reason the `CorePlatform`
 * is associated with the application document.
 *
 * @param docOrNode - The document (or node) of the application for which the platform is needed.
 * @alpha
 */
export declare const getPlatform: (docOrNode: Document | Node) => CorePlatform;

/**
 * @public
 */
export declare function h<TYPE extends string | FunctionComponent<PROPS>, PROPS extends {} = {}>(type: TYPE, props: PROPS | null, ...children: any[]): JSXNode<TYPE>;

/**
 * @public
 */
export declare namespace h {
    export function h(type: any): JSXNode<any>;
    export function h(type: Node, data: any): JSXNode<any>;
    export function h(type: any, text: string): JSXNode<any>;
    export function h(type: any, children: Array<any>): JSXNode<any>;
    export function h(type: any, data: any, text: string): JSXNode<any>;
    export function h(type: any, data: any, children: Array<JSXNode<any> | undefined | null>): JSXNode<any>;
    export function h(sel: any, data: any | null, children: JSXNode<any>): JSXNode<any>;
    export namespace JSX {
        export interface Element extends QwikJSX.Element {
        }
        export interface IntrinsicAttributes extends QwikJSX.IntrinsicAttributes {
        }
        export interface IntrinsicElements extends QwikJSX.IntrinsicElements {
        }
        export interface ElementChildrenAttribute {
            children?: any;
        }
    }
}

/**
 * Low-level API used by the Optimizer to process `useWatch$()` API. This method
 * is not intended to be used by developers.
 * @alpha
 */
export declare const handleWatch: () => void;

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
export declare const Host: FunctionComponent<HostAttributes>;

declare interface HostAttributes extends HTMLAttributes<HTMLElement> {
    [key: string]: any;
}

declare type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {});

declare type HTMLAttributeReferrerPolicy = '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';

/**
 * @public
 */
export declare interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    accessKey?: string | undefined;
    className?: string | undefined;
    contentEditable?: Booleanish | 'inherit' | undefined;
    contextMenu?: string | undefined;
    dir?: 'ltr' | 'rtl' | 'auto' | undefined;
    draggable?: Booleanish | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    placeholder?: string | undefined;
    slot?: string | undefined;
    spellCheck?: Booleanish | undefined;
    style?: CSSProperties_2 | string | undefined;
    tabIndex?: number | undefined;
    title?: string | undefined;
    translate?: 'yes' | 'no' | undefined;
    radioGroup?: string | undefined;
    role?: AriaRole | undefined;
    about?: string | undefined;
    datatype?: string | undefined;
    inlist?: any;
    prefix?: string | undefined;
    property?: string | undefined;
    resource?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;
    autoCapitalize?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    itemRef?: string | undefined;
    results?: number | undefined;
    security?: string | undefined;
    unselectable?: 'on' | 'off' | undefined;
    /**
     * Hints at the type of data that might be entered by the user while editing the element or its contents
     * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
     */
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
    /**
     * Specify that a standard HTML element should behave like a defined custom built-in element
     * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
     */
    is?: string | undefined;
}

declare interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
    manifest?: string | undefined;
}

declare type HTMLInputAutocompleteAttribute = 'on' | 'off' | 'billing' | 'shipping' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix' | 'nickname' | 'username' | 'new-password' | 'current-password' | 'one-time-code' | 'organization-title' | 'organization' | 'street-address' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level4' | 'address-level3' | 'address-level2' | 'address-level1' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'url' | 'photo';

declare type HTMLInputTypeAttribute = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | (string & {});

declare interface HTMLWebViewElement_2 extends HTMLElement {
}

declare interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
    allow?: string | undefined;
    allowFullScreen?: boolean | undefined;
    allowTransparency?: boolean | undefined;
    /** @deprecated Deprecated */
    frameBorder?: number | string | undefined;
    height?: number | string | undefined;
    loading?: 'eager' | 'lazy' | undefined;
    /** @deprecated Deprecated */
    marginHeight?: number | undefined;
    /** @deprecated Deprecated */
    marginWidth?: number | undefined;
    name?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sandbox?: string | undefined;
    /** @deprecated Deprecated */
    scrolling?: string | undefined;
    seamless?: boolean | undefined;
    src?: string | undefined;
    srcDoc?: string | undefined;
    width?: number | string | undefined;
}

declare interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string | undefined;
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
    decoding?: 'async' | 'auto' | 'sync' | undefined;
    height?: number | string | undefined;
    loading?: 'eager' | 'lazy' | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    useMap?: string | undefined;
    width?: number | string | undefined;
}

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
 * For example, these function calls are equivalent:
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
 * @param fn - a function that should have its first argument automatically `$`.
 * @alpha
 */
export declare const implicit$FirstArg: <FIRST, REST extends any[], RET>(fn: (first: QRL<FIRST>, ...rest: REST) => RET) => (first: FIRST, ...rest: REST) => RET;

/**
 * @alpha
 */
export declare const inlinedQrl: <T>(symbol: T, symbolName: string, lexicalScopeCapture?: any[]) => QRL<T>;

declare interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string | undefined;
    alt?: string | undefined;
    autoComplete?: HTMLInputAutocompleteAttribute | Omit<HTMLInputAutocompleteAttribute, string> | undefined;
    autoFocus?: boolean | undefined;
    capture?: boolean | 'user' | 'environment' | undefined;
    checked?: boolean | undefined;
    crossOrigin?: string | undefined;
    disabled?: boolean | undefined;
    enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;
    form?: string | undefined;
    formAction?: string | undefined;
    formEncType?: string | undefined;
    formMethod?: string | undefined;
    formNoValidate?: boolean | undefined;
    formTarget?: string | undefined;
    height?: number | string | undefined;
    list?: string | undefined;
    max?: number | string | undefined;
    maxLength?: number | undefined;
    min?: number | string | undefined;
    minLength?: number | undefined;
    multiple?: boolean | undefined;
    name?: string | undefined;
    pattern?: string | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    size?: number | undefined;
    src?: string | undefined;
    step?: number | string | undefined;
    type?: HTMLInputTypeAttribute | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
    width?: number | string | undefined;
}

declare interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string | undefined;
    dateTime?: string | undefined;
}

declare interface IntrinsicElements {
    a: AnchorHTMLAttributes<HTMLAnchorElement>;
    abbr: HTMLAttributes<HTMLElement>;
    address: HTMLAttributes<HTMLElement>;
    area: AreaHTMLAttributes<HTMLAreaElement>;
    article: HTMLAttributes<HTMLElement>;
    aside: HTMLAttributes<HTMLElement>;
    audio: AudioHTMLAttributes<HTMLAudioElement>;
    b: HTMLAttributes<HTMLElement>;
    base: BaseHTMLAttributes<HTMLBaseElement>;
    bdi: HTMLAttributes<HTMLElement>;
    bdo: HTMLAttributes<HTMLElement>;
    big: HTMLAttributes<HTMLElement>;
    blockquote: BlockquoteHTMLAttributes<HTMLElement>;
    body: HTMLAttributes<HTMLBodyElement>;
    br: HTMLAttributes<HTMLBRElement>;
    button: ButtonHTMLAttributes<HTMLButtonElement>;
    canvas: CanvasHTMLAttributes<HTMLCanvasElement>;
    caption: HTMLAttributes<HTMLElement>;
    cite: HTMLAttributes<HTMLElement>;
    code: HTMLAttributes<HTMLElement>;
    col: ColHTMLAttributes<HTMLTableColElement>;
    colgroup: ColgroupHTMLAttributes<HTMLTableColElement>;
    data: DataHTMLAttributes<HTMLDataElement>;
    datalist: HTMLAttributes<HTMLDataListElement>;
    dd: HTMLAttributes<HTMLElement>;
    del: DelHTMLAttributes<HTMLElement>;
    details: DetailsHTMLAttributes<HTMLElement>;
    dfn: HTMLAttributes<HTMLElement>;
    dialog: DialogHTMLAttributes<HTMLDialogElement>;
    div: HTMLAttributes<HTMLDivElement>;
    dl: HTMLAttributes<HTMLDListElement>;
    dt: HTMLAttributes<HTMLElement>;
    em: HTMLAttributes<HTMLElement>;
    embed: EmbedHTMLAttributes<HTMLEmbedElement>;
    fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>;
    figcaption: HTMLAttributes<HTMLElement>;
    figure: HTMLAttributes<HTMLElement>;
    footer: HTMLAttributes<HTMLElement>;
    form: FormHTMLAttributes<HTMLFormElement>;
    h1: HTMLAttributes<HTMLHeadingElement>;
    h2: HTMLAttributes<HTMLHeadingElement>;
    h3: HTMLAttributes<HTMLHeadingElement>;
    h4: HTMLAttributes<HTMLHeadingElement>;
    h5: HTMLAttributes<HTMLHeadingElement>;
    h6: HTMLAttributes<HTMLHeadingElement>;
    head: HTMLAttributes<HTMLHeadElement>;
    header: HTMLAttributes<HTMLElement>;
    hgroup: HTMLAttributes<HTMLElement>;
    hr: HTMLAttributes<HTMLHRElement>;
    html: HtmlHTMLAttributes<HTMLHtmlElement>;
    i: HTMLAttributes<HTMLElement>;
    iframe: IframeHTMLAttributes<HTMLIFrameElement>;
    img: ImgHTMLAttributes<HTMLImageElement>;
    input: InputHTMLAttributes<HTMLInputElement>;
    ins: InsHTMLAttributes<HTMLModElement>;
    kbd: HTMLAttributes<HTMLElement>;
    keygen: KeygenHTMLAttributes<HTMLElement>;
    label: LabelHTMLAttributes<HTMLLabelElement>;
    legend: HTMLAttributes<HTMLLegendElement>;
    li: LiHTMLAttributes<HTMLLIElement>;
    link: LinkHTMLAttributes<HTMLLinkElement>;
    main: HTMLAttributes<HTMLElement>;
    map: MapHTMLAttributes<HTMLMapElement>;
    mark: HTMLAttributes<HTMLElement>;
    menu: MenuHTMLAttributes<HTMLElement>;
    menuitem: HTMLAttributes<HTMLElement>;
    meta: MetaHTMLAttributes<HTMLMetaElement>;
    meter: MeterHTMLAttributes<HTMLElement>;
    nav: HTMLAttributes<HTMLElement>;
    noindex: HTMLAttributes<HTMLElement>;
    noscript: HTMLAttributes<HTMLElement>;
    object: ObjectHTMLAttributes<HTMLObjectElement>;
    ol: OlHTMLAttributes<HTMLOListElement>;
    optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>;
    option: OptionHTMLAttributes<HTMLOptionElement>;
    output: OutputHTMLAttributes<HTMLElement>;
    p: HTMLAttributes<HTMLParagraphElement>;
    param: ParamHTMLAttributes<HTMLParamElement>;
    picture: HTMLAttributes<HTMLElement>;
    pre: HTMLAttributes<HTMLPreElement>;
    progress: ProgressHTMLAttributes<HTMLProgressElement>;
    q: QuoteHTMLAttributes<HTMLQuoteElement>;
    rp: HTMLAttributes<HTMLElement>;
    rt: HTMLAttributes<HTMLElement>;
    ruby: HTMLAttributes<HTMLElement>;
    s: HTMLAttributes<HTMLElement>;
    samp: HTMLAttributes<HTMLElement>;
    slot: SlotHTMLAttributes<HTMLSlotElement>;
    script: ScriptHTMLAttributes<HTMLScriptElement>;
    section: HTMLAttributes<HTMLElement>;
    select: SelectHTMLAttributes<HTMLSelectElement>;
    small: HTMLAttributes<HTMLElement>;
    source: SourceHTMLAttributes<HTMLSourceElement>;
    span: HTMLAttributes<HTMLSpanElement>;
    strong: HTMLAttributes<HTMLElement>;
    style: StyleHTMLAttributes<HTMLStyleElement>;
    sub: HTMLAttributes<HTMLElement>;
    summary: HTMLAttributes<HTMLElement>;
    sup: HTMLAttributes<HTMLElement>;
    table: TableHTMLAttributes<HTMLTableElement>;
    template: HTMLAttributes<HTMLTemplateElement>;
    tbody: HTMLAttributes<HTMLTableSectionElement>;
    td: TdHTMLAttributes<HTMLTableDataCellElement>;
    textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
    tfoot: HTMLAttributes<HTMLTableSectionElement>;
    th: ThHTMLAttributes<HTMLTableHeaderCellElement>;
    thead: HTMLAttributes<HTMLTableSectionElement>;
    time: TimeHTMLAttributes<HTMLElement>;
    title: HTMLAttributes<HTMLTitleElement>;
    tr: HTMLAttributes<HTMLTableRowElement>;
    track: TrackHTMLAttributes<HTMLTrackElement>;
    u: HTMLAttributes<HTMLElement>;
    ul: HTMLAttributes<HTMLUListElement>;
    video: VideoHTMLAttributes<HTMLVideoElement>;
    wbr: HTMLAttributes<HTMLElement>;
    webview: WebViewHTMLAttributes<HTMLWebViewElement_2>;
    svg: SVGProps<SVGSVGElement>;
    animate: SVGProps<SVGElement>;
    animateMotion: SVGProps<SVGElement>;
    animateTransform: SVGProps<SVGElement>;
    circle: SVGProps<SVGCircleElement>;
    clipPath: SVGProps<SVGClipPathElement>;
    defs: SVGProps<SVGDefsElement>;
    desc: SVGProps<SVGDescElement>;
    ellipse: SVGProps<SVGEllipseElement>;
    feBlend: SVGProps<SVGFEBlendElement>;
    feColorMatrix: SVGProps<SVGFEColorMatrixElement>;
    feComponentTransfer: SVGProps<SVGFEComponentTransferElement>;
    feComposite: SVGProps<SVGFECompositeElement>;
    feConvolveMatrix: SVGProps<SVGFEConvolveMatrixElement>;
    feDiffuseLighting: SVGProps<SVGFEDiffuseLightingElement>;
    feDisplacementMap: SVGProps<SVGFEDisplacementMapElement>;
    feDistantLight: SVGProps<SVGFEDistantLightElement>;
    feDropShadow: SVGProps<SVGFEDropShadowElement>;
    feFlood: SVGProps<SVGFEFloodElement>;
    feFuncA: SVGProps<SVGFEFuncAElement>;
    feFuncB: SVGProps<SVGFEFuncBElement>;
    feFuncG: SVGProps<SVGFEFuncGElement>;
    feFuncR: SVGProps<SVGFEFuncRElement>;
    feGaussianBlur: SVGProps<SVGFEGaussianBlurElement>;
    feImage: SVGProps<SVGFEImageElement>;
    feMerge: SVGProps<SVGFEMergeElement>;
    feMergeNode: SVGProps<SVGFEMergeNodeElement>;
    feMorphology: SVGProps<SVGFEMorphologyElement>;
    feOffset: SVGProps<SVGFEOffsetElement>;
    fePointLight: SVGProps<SVGFEPointLightElement>;
    feSpecularLighting: SVGProps<SVGFESpecularLightingElement>;
    feSpotLight: SVGProps<SVGFESpotLightElement>;
    feTile: SVGProps<SVGFETileElement>;
    feTurbulence: SVGProps<SVGFETurbulenceElement>;
    filter: SVGProps<SVGFilterElement>;
    foreignObject: SVGProps<SVGForeignObjectElement>;
    g: SVGProps<SVGGElement>;
    image: SVGProps<SVGImageElement>;
    line: SVGProps<SVGLineElement>;
    linearGradient: SVGProps<SVGLinearGradientElement>;
    marker: SVGProps<SVGMarkerElement>;
    mask: SVGProps<SVGMaskElement>;
    metadata: SVGProps<SVGMetadataElement>;
    mpath: SVGProps<SVGElement>;
    path: SVGProps<SVGPathElement>;
    pattern: SVGProps<SVGPatternElement>;
    polygon: SVGProps<SVGPolygonElement>;
    polyline: SVGProps<SVGPolylineElement>;
    radialGradient: SVGProps<SVGRadialGradientElement>;
    rect: SVGProps<SVGRectElement>;
    stop: SVGProps<SVGStopElement>;
    switch: SVGProps<SVGSwitchElement>;
    symbol: SVGProps<SVGSymbolElement>;
    text: SVGProps<SVGTextElement>;
    textPath: SVGProps<SVGTextPathElement>;
    tspan: SVGProps<SVGTSpanElement>;
    use: SVGProps<SVGUseElement>;
    view: SVGProps<SVGViewElement>;
}

/**
 * @public
 */
declare const jsx: <T extends string | FunctionComponent<PROPS>, PROPS>(type: T, props: PROPS, key?: string | number) => JSXNode<T>;
export { jsx }
export { jsx as jsxDEV }
export { jsx as jsxs }

declare type JSXChildren = string | number | boolean | null | undefined | Function | RegExp | JSXChildren[] | Promise<JSXChildren> | JSXNode<any>;

/**
 * @public
 */
export declare interface JSXNode<T = any> {
    type: T;
    props: Record<string, any> | null;
    key: string | number | null;
}

/**
 * @public
 */
declare type JSXTagName = keyof HTMLElementTagNameMap | Omit<string, keyof HTMLElementTagNameMap>;

declare interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean | undefined;
    challenge?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    keyType?: string | undefined;
    keyParams?: string | undefined;
    name?: string | undefined;
}

declare interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string | undefined;
    htmlFor?: string | undefined;
}

declare interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string | ReadonlyArray<string> | number | undefined;
}

declare interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
    as?: string | undefined;
    crossOrigin?: string | undefined;
    href?: string | undefined;
    hrefLang?: string | undefined;
    integrity?: string | undefined;
    media?: string | undefined;
    imageSrcSet?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    rel?: string | undefined;
    sizes?: string | undefined;
    type?: string | undefined;
    charSet?: string | undefined;
}

declare interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string | undefined;
}

declare interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoPlay?: boolean | undefined;
    controls?: boolean | undefined;
    controlsList?: string | undefined;
    crossOrigin?: string | undefined;
    loop?: boolean | undefined;
    mediaGroup?: string | undefined;
    muted?: boolean | undefined;
    playsInline?: boolean | undefined;
    preload?: string | undefined;
    src?: string | undefined;
}

declare interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string | undefined;
}

declare interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
    charSet?: string | undefined;
    content?: string | undefined;
    httpEquiv?: string | undefined;
    name?: string | undefined;
    media?: string | undefined;
}

declare interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string | undefined;
    high?: number | undefined;
    low?: number | undefined;
    max?: number | string | undefined;
    min?: number | string | undefined;
    optimum?: number | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

/**
 * @alpha
 */
export declare type MountFn<T> = () => ValueOrPromise<T>;

declare const MUTABLE: unique symbol;

/**
 * Mark property as mutable.
 *
 * Qwik assumes that all bindings in components are immutable by default. This is done for two
 * reasons:
 *
 * 1. JSX does not allow Qwik runtime to know if a binding is static or mutable.
 *    `<Example valueA={123} valueB={exp}>` At runtime there is no way to know if `valueA` is
 * immutable.
 * 2. If Qwik assumes that properties are immutable, then it can do a better job data-shaking the
 * amount of code that needs to be serialized to the client.
 *
 * Because Qwik assumes that bindings are immutable by default, it needs a way for a developer to
 * let it know that binding is mutable. `mutable()` function serves that purpose.
 * `<Example valueA={123} valueB={mutable(exp)}>`. In this case, the Qwik runtime can correctly
 * recognize that the `Example` props are mutable and need to be serialized.
 *
 * See: [Mutable Props Tutorial](http://qwik.builder.io/tutorial/props/mutable) for an example
 *
 * @alpha
 */
export declare const mutable: <T>(v: T) => MutableWrapper<T>;

/**
 * @public
 */
declare type MutableProps<PROPS extends {}> = {
    [K in keyof PROPS]: PROPS[K] | MutableWrapper<PROPS[K]>;
};

/**
 * A marker object returned by `mutable()` to identify that the binding is mutable.
 *
 * @alpha
 */
export declare interface MutableWrapper<T> {
    /**
     * A marker symbol.
     */
    [MUTABLE]: true;
    /**
     * Mutable value.
     */
    v: T;
}

/**
 * @public
 */
declare type NativeEventHandler<T extends Event = Event> = BivariantEventHandler<T> | BivariantEventHandler<T>[];

/**
 * @alpha
 */
export declare type NoSerialize<T> = (T & {
    __no_serialize__: true;
}) | undefined;

/**
 * Marks a property on a store as non-serializable.
 *
 * At times it is necessary to store values on a store that are non-serializable. Normally this
 * is a runtime error as Store wants to eagerly report when a non-serializable property is
 * assigned to it.
 *
 * You can use `noSerialize()` to mark a value as non-serializable. The value is persisted in the
 * Store but does not survive serialization. The implication is that when your application is
 * resumed, the value of this object will be `undefined`. You will be responsible for recovering
 * from this.
 *
 * See: [noSerialize Tutorial](http://qwik.builder.io/tutorial/store/no-serialize)
 *
 * @alpha
 */
export declare const noSerialize: <T extends object | undefined>(input: T) => NoSerialize<T>;

declare interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
    classID?: string | undefined;
    data?: string | undefined;
    form?: string | undefined;
    height?: number | string | undefined;
    name?: string | undefined;
    type?: string | undefined;
    useMap?: string | undefined;
    width?: number | string | undefined;
    wmode?: string | undefined;
}

declare interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
    reversed?: boolean | undefined;
    start?: number | undefined;
    type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
}

/**
 * @public
 */
export declare type OnRenderFn<PROPS> = (props: PROPS) => JSXNode<any> | null | (() => JSXNode<any>);

declare interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean | undefined;
    label?: string | undefined;
}

declare interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean | undefined;
    label?: string | undefined;
    selected?: boolean | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

declare interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string | undefined;
    htmlFor?: string | undefined;
    name?: string | undefined;
}

declare interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

/**
 * Serialize the current state of the application into DOM
 *
 * @alpha
 */
export declare const pauseContainer: (elmOrDoc: Element | Document, defaultParentJSON?: Element) => Promise<SnapshotResult>;

declare type PreventDefault = {
    [K in keyof QwikEventMap as `prevent${'default' | 'Default'}:${Lowercase<K>}`]?: boolean;
};

declare interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
    max?: number | string | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

/**
 * @public
 */
export declare interface PropFnInterface<ARGS extends any[], RET> {
    (...args: ARGS): Promise<RET>;
}

/**
 * @public
 */
export declare type PropFunction<T extends Function> = T extends (...args: infer ARGS) => infer RET ? PropFnInterface<ARGS, RET> : never;

/**
 * @public
 */
export declare type Props<T extends {} = {}> = Record<string, any> & T;

/**
 * Infers `Props` from the component.
 *
 * ```typescript
 * export const OtherComponent = component$(() => {
 *   return $(() => <Counter value={100} />);
 * });
 * ```
 *
 * @public
 */
export declare type PropsOf<COMP extends Component<any>> = COMP extends Component<infer PROPS> ? NonNullable<PROPS> : never;

/**
 * @public
 */
export declare type PublicProps<PROPS extends {}> = MutableProps<PROPS> & ComponentBaseProps;

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
 *   $((event) => console.log('mousemove', event))
 * );
 * ```
 *
 * In the above code, the Qwik Optimizer detects `$(...)` and transforms the code as shown below:
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
 * after the Qwik Optimizer transformation.
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
 * In the above example, the way to think about the code is that you are not asking for a
 * callback function but rather a reference to a lazy-loadable callback function. Specifically,
 * the function loading should be delayed until it is actually needed. In the above example, the
 * function would not load until after a `mousemove` event on `document` fires.
 *
 * ## Resolving `QRL` references
 *
 * At times it may be necessary to resolve a `QRL` reference to the actual value. This can be
 * performed using `QRL.resolve(..)` function.
 *
 * ```tsx
 * // Assume you have QRL reference to a greet function
 * const lazyGreet: QRL<() => void> = $(() => console.log('Hello World!'));
 *
 * // Use `qrlImport` to load / resolve the reference.
 * const greet: () => void = await lazyGreet.resolve();
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
 * At first glance, `QRL` serves the same purpose as `import()`. However, there are three subtle
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
 * 3. Next, the framework needs to resolve the `./chunk-abc.js` and needs a base location that is
 * encoded in the HTML.
 * 4. The QRL needs to be able to capture lexically scoped variables. (`import()` only allows
 * loading top-level symbols which don't capture variables.)
 * 5. As a developer, you don't want to think about `import` and naming the chunks and symbols.
 * You just want to say: "this should be lazy."
 *
 * These are the main reasons why Qwik introduces its own concept of `QRL`.
 *
 * @see `$`
 *
 * @public
 */
export declare interface QRL<TYPE = any> {
    __brand__QRL__: TYPE;
    /**
     * Resolve the QRL of closure and invoke it.
     * @param args - Clousure arguments.
     * @returns A promise of the return value of the closure.
     */
    (...args: TYPE extends (...args: infer ARGS) => any ? ARGS : never): Promise<TYPE extends (...args: any[]) => infer RETURN ? Awaited<RETURN> : never>;
    /**
     * Resolve the QRL and return the actual value.
     */
    resolve(el?: Element): Promise<TYPE>;
    getSymbol(): string;
    getHash(): string;
}

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
export declare const qrl: <T = any>(chunkOrFn: string | (() => Promise<any>), symbol: string, lexicalScopeCapture?: any[]) => QRL<T>;

declare interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string | undefined;
}

declare interface QwikCustomEvents {
    [key: `${'document:' | 'window:' | ''}on${string}$`]: NativeEventHandler<Event> | undefined;
}

declare interface QwikCustomHTMLAttributes<T> extends HTMLAttributes<T> {
    [key: string]: any;
}

declare interface QwikCustomHTMLElement extends HTMLElement {
}

/**
 * @public
 */
export declare interface QwikDOMAttributes extends DOMAttributes<any> {
}

declare type QwikEventMap = {
    Copy: ClipboardEvent;
    CopyCapture: ClipboardEvent;
    Cut: ClipboardEvent;
    CutCapture: ClipboardEvent;
    Paste: ClipboardEvent;
    PasteCapture: ClipboardEvent;
    CompositionEnd: CompositionEvent;
    CompositionEndCapture: CompositionEvent;
    CompositionStart: CompositionEvent;
    CompositionStartCapture: CompositionEvent;
    CompositionUpdate: CompositionEvent;
    CompositionUpdateCapture: CompositionEvent;
    Focus: FocusEvent;
    FocusCapture: FocusEvent;
    Focusin: FocusEvent;
    FocusinCapture: FocusEvent;
    Focusout: FocusEvent;
    FocusoutCapture: FocusEvent;
    Blur: FocusEvent;
    BlurCapture: FocusEvent;
    Change: Event;
    ChangeCapture: Event;
    Input: Event;
    InputCapture: Event;
    Reset: Event;
    ResetCapture: Event;
    Submit: Event;
    SubmitCapture: Event;
    Invalid: Event;
    InvalidCapture: Event;
    Load: Event;
    LoadCapture: Event;
    Error: Event;
    ErrorCapture: Event;
    KeyDown: KeyboardEvent;
    KeyDownCapture: KeyboardEvent;
    KeyPress: KeyboardEvent;
    KeyPressCapture: KeyboardEvent;
    KeyUp: KeyboardEvent;
    KeyUpCapture: KeyboardEvent;
    AuxClick: MouseEvent;
    Click: MouseEvent;
    ClickCapture: MouseEvent;
    ContextMenu: MouseEvent;
    ContextMenuCapture: MouseEvent;
    DblClick: MouseEvent;
    DblClickCapture: MouseEvent;
    Drag: DragEvent;
    DragCapture: DragEvent;
    DragEnd: DragEvent;
    DragEndCapture: DragEvent;
    DragEnter: DragEvent;
    DragEnterCapture: DragEvent;
    DragExit: DragEvent;
    DragExitCapture: DragEvent;
    DragLeave: DragEvent;
    DragLeaveCapture: DragEvent;
    DragOver: DragEvent;
    DragOverCapture: DragEvent;
    DragStart: DragEvent;
    DragStartCapture: DragEvent;
    Drop: DragEvent;
    DropCapture: DragEvent;
    MouseDown: MouseEvent;
    MouseDownCapture: MouseEvent;
    MouseEnter: MouseEvent;
    MouseLeave: MouseEvent;
    MouseMove: MouseEvent;
    MouseMoveCapture: MouseEvent;
    MouseOut: MouseEvent;
    MouseOutCapture: MouseEvent;
    MouseOver: MouseEvent;
    MouseOverCapture: MouseEvent;
    MouseUp: MouseEvent;
    MouseUpCapture: MouseEvent;
    TouchCancel: TouchEvent;
    TouchCancelCapture: TouchEvent;
    TouchEnd: TouchEvent;
    TouchEndCapture: TouchEvent;
    TouchMove: TouchEvent;
    TouchMoveCapture: TouchEvent;
    TouchStart: TouchEvent;
    TouchStartCapture: TouchEvent;
    PointerDown: PointerEvent;
    PointerDownCapture: PointerEvent;
    PointerMove: PointerEvent;
    PointerMoveCapture: PointerEvent;
    PointerUp: PointerEvent;
    PointerUpCapture: PointerEvent;
    PointerCancel: PointerEvent;
    PointerCancelCapture: PointerEvent;
    PointerEnter: PointerEvent;
    PointerEnterCapture: PointerEvent;
    PointerLeave: PointerEvent;
    PointerLeaveCapture: PointerEvent;
    PointerOver: PointerEvent;
    PointerOverCapture: PointerEvent;
    PointerOut: PointerEvent;
    PointerOutCapture: PointerEvent;
    GotPointerCapture: PointerEvent;
    GotPointerCaptureCapture: PointerEvent;
    LostPointerCapture: PointerEvent;
    LostPointerCaptureCapture: PointerEvent;
    Scroll: UIEvent;
    ScrollCapture: UIEvent;
    Wheel: WheelEvent;
    WheelCapture: WheelEvent;
    AnimationStart: AnimationEvent;
    AnimationStartCapture: AnimationEvent;
    AnimationEnd: AnimationEvent;
    AnimationEndCapture: AnimationEvent;
    AnimationIteration: AnimationEvent;
    AnimationIterationCapture: AnimationEvent;
    TransitionEnd: TransitionEvent;
    TransitionEndCapture: TransitionEvent;
};

/**
 * @public
 */
declare interface QwikEvents extends QwikKnownEvents, QwikCustomEvents {
    'document:onLoad$'?: BivariantEventHandler<Event>;
    'document:onScroll$'?: BivariantEventHandler<Event>;
    'document:onVisible$'?: BivariantEventHandler<Event>;
    'document:onVisibilityChange$'?: BivariantEventHandler<Event>;
}

/**
 * @public
 */
declare interface QwikIntrinsicAttributes {
}

/**
 * @public
 */
export declare interface QwikIntrinsicElements extends IntrinsicElements {
    script: QwikScriptHTMLAttributes<HTMLScriptElement>;
    [key: string]: QwikCustomHTMLAttributes<QwikCustomHTMLElement>;
}

/**
 * @public
 */
export declare namespace QwikJSX {
    export interface Element extends JSXNode {
    }
    export interface IntrinsicAttributes extends QwikIntrinsicAttributes {
    }
    export interface ElementChildrenAttribute {
        children: any;
    }
    export interface IntrinsicElements extends QwikIntrinsicElements {
    }
}

declare type QwikKnownEvents = {
    [K in keyof QwikEventMap as `${'document:' | 'window:' | ''}on${K}$`]?: NativeEventHandler<QwikEventMap[K]>;
};

declare interface QwikProps extends PreventDefault {
    class?: string | {
        [className: string]: boolean;
    };
    innerHTML?: string;
    dangerouslySetInnerHTML?: string;
    ref?: Ref<Element>;
    /**
     *
     */
    'q:slot'?: string;
    /**
     * URL against which relative QRLs should be resolved to.
     */
    'q:obj'?: string;
    'q:host'?: string;
    'q:version'?: string;
    'q:container'?: '';
}

declare interface QwikScriptHTMLAttributes<T> extends ScriptHTMLAttributes<T> {
    events?: string[];
}

/**
 * @alpha
 */
export declare interface Ref<T> {
    current: T | undefined;
}

/**
 * Render JSX.
 *
 * Use this method to render JSX. This function does reconciling which means
 * it always tries to reuse what is already in the DOM (rather then destroy and
 * recreate content.)
 *
 * @param parent - Element which will act as a parent to `jsxNode`. When
 *     possible the rendering will try to reuse existing nodes.
 * @param jsxNode - JSX to render
 * @alpha
 */
export declare const render: (parent: Element | Document, jsxNode: JSXNode<unknown> | FunctionComponent<any>, opts?: RenderOptions) => Promise<void>;

/**
 * @alpha
 */
export declare interface RenderOptions {
    allowRerender?: boolean;
    userContext?: Record<string, any>;
}

/**
 * @alpha
 */
export declare const Resource: <T>(props: ResourceProps<T>) => JSXNode;

/**
 * @alpha
 */
export declare interface ResourceCtx<T> {
    track: Tracker;
    cleanup(callback: () => void): void;
    previous: T | undefined;
}

/**
 * @alpha
 */
declare type ResourceFn<T> = (ctx: ResourceCtx<T>) => ValueOrPromise<T>;

/**
 * @alpha
 */
declare interface ResourceOptions {
    timeout?: number;
}

/**
 * @alpha
 */
export declare interface ResourcePending<T> {
    __brand: 'resource';
    state: 'pending';
    promise: Promise<T>;
    resolved: undefined;
    error: undefined;
    timeout?: number;
}

/**
 * @alpha
 */
export declare interface ResourceProps<T> {
    resource: ResourceReturn<T>;
    onResolved: (value: T) => JSXNode;
    onPending?: () => JSXNode;
    onRejected?: (reason: any) => JSXNode;
}

/**
 * @alpha
 */
export declare interface ResourceRejected<T> {
    __brand: 'resource';
    state: 'rejected';
    promise: Promise<T>;
    resolved: undefined;
    error: NoSerialize<any>;
    timeout?: number;
}

/**
 * @alpha
 */
export declare interface ResourceResolved<T> {
    __brand: 'resource';
    state: 'resolved';
    promise: Promise<T>;
    resolved: T;
    error: undefined;
    timeout?: number;
}

/**
 * @alpha
 */
export declare type ResourceReturn<T> = ResourcePending<T> | ResourceResolved<T> | ResourceRejected<T>;

declare interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
    async?: boolean | undefined;
    /** @deprecated Deprecated */
    charSet?: string | undefined;
    crossOrigin?: string | undefined;
    defer?: boolean | undefined;
    integrity?: string | undefined;
    noModule?: boolean | undefined;
    nonce?: string | undefined;
    referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    src?: string | undefined;
    type?: string | undefined;
}

declare interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    autoComplete?: HTMLInputAutocompleteAttribute | Omit<HTMLInputAutocompleteAttribute, string> | undefined;
    autoFocus?: boolean | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    multiple?: boolean | undefined;
    name?: string | undefined;
    required?: boolean | undefined;
    size?: number | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
}

/**
 * Sets the `CorePlatform`.
 *
 * This is useful to override the platform in tests to change the behavior of,
 * `requestAnimationFrame`, and import resolution.
 *
 * @param doc - The document of the application for which the platform is needed.
 * @param platform - The platform to use.
 * @alpha
 */
export declare const setPlatform: (doc: Document, plt: CorePlatform) => CorePlatform;

/**
 * @public
 */
export declare const SkipRerender: FunctionComponent<{}>;

/**
 * @public
 */
export declare const Slot: FunctionComponent<{
    name?: string;
    children?: any;
}>;

declare interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string | undefined;
}

/**
 * @public
 */
declare interface SnapshotListener {
    key: string;
    qrl: QRL<any>;
    el: Element;
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
    mode: 'render' | 'listeners' | 'static';
    pendingContent: Promise<string>[];
}

/**
 * @public
 */
export declare interface SnapshotState {
    ctx: SnapshotMeta;
    objs: any[];
    subs: any[];
}

declare interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string | undefined;
    media?: string | undefined;
    sizes?: string | undefined;
    src?: string | undefined;
    srcSet?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
}

declare interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    media?: string | undefined;
    nonce?: string | undefined;
    scoped?: boolean | undefined;
    type?: string | undefined;
}

declare interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    class?: string | {
        [className: string]: boolean;
    } | undefined;
    className?: string;
    color?: string | undefined;
    height?: number | string | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    max?: number | string | undefined;
    media?: string | undefined;
    method?: string | undefined;
    min?: number | string | undefined;
    name?: string | undefined;
    style?: CSSProperties_2 | string | undefined;
    target?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
    role?: string | undefined;
    tabindex?: number | undefined;
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
    'accent-height'?: number | string | undefined;
    accumulate?: 'none' | 'sum' | undefined;
    additive?: 'replace' | 'sum' | undefined;
    'alignment-baseline'?: 'auto' | 'baseline' | 'before-edge' | 'text-before-edge' | 'middle' | 'central' | 'after-edge' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | 'inherit' | undefined;
    allowReorder?: 'no' | 'yes' | undefined;
    alphabetic?: number | string | undefined;
    amplitude?: number | string | undefined;
    'arabic-form'?: 'initial' | 'medial' | 'terminal' | 'isolated' | undefined;
    ascent?: number | string | undefined;
    attributeName?: string | undefined;
    attributeType?: string | undefined;
    autoReverse?: Booleanish | undefined;
    azimuth?: number | string | undefined;
    baseFrequency?: number | string | undefined;
    'baseline-shift'?: number | string | undefined;
    baseProfile?: number | string | undefined;
    bbox?: number | string | undefined;
    begin?: number | string | undefined;
    bias?: number | string | undefined;
    by?: number | string | undefined;
    calcMode?: number | string | undefined;
    'cap-height'?: number | string | undefined;
    clip?: number | string | undefined;
    'clip-path'?: string | undefined;
    clipPathUnits?: number | string | undefined;
    'clip-rule'?: number | string | undefined;
    'color-interpolation'?: number | string | undefined;
    'color-interpolation-filters'?: 'auto' | 's-rGB' | 'linear-rGB' | 'inherit' | undefined;
    'color-profile'?: number | string | undefined;
    'color-rendering'?: number | string | undefined;
    contentScriptType?: number | string | undefined;
    contentStyleType?: number | string | undefined;
    cursor?: number | string;
    cx?: number | string | undefined;
    cy?: number | string | undefined;
    d?: string | undefined;
    decelerate?: number | string | undefined;
    descent?: number | string | undefined;
    diffuseConstant?: number | string | undefined;
    direction?: number | string | undefined;
    display?: number | string | undefined;
    divisor?: number | string | undefined;
    'dominant-baseline'?: number | string | undefined;
    dur?: number | string | undefined;
    dx?: number | string | undefined;
    dy?: number | string | undefined;
    'edge-mode'?: number | string | undefined;
    elevation?: number | string | undefined;
    'enable-background'?: number | string | undefined;
    end?: number | string | undefined;
    exponent?: number | string | undefined;
    externalResourcesRequired?: number | string | undefined;
    fill?: string | undefined;
    'fill-opacity'?: number | string | undefined;
    'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
    filter?: string | undefined;
    filterRes?: number | string | undefined;
    filterUnits?: number | string | undefined;
    'flood-color'?: number | string | undefined;
    'flood-opacity'?: number | string | undefined;
    focusable?: number | string | undefined;
    'font-family'?: string | undefined;
    'font-size'?: number | string | undefined;
    'font-size-adjust'?: number | string | undefined;
    'font-stretch'?: number | string | undefined;
    'font-style'?: number | string | undefined;
    'font-variant'?: number | string | undefined;
    'font-weight'?: number | string | undefined;
    format?: number | string | undefined;
    fr?: number | string | undefined;
    from?: number | string | undefined;
    fx?: number | string | undefined;
    fy?: number | string | undefined;
    g1?: number | string | undefined;
    g2?: number | string | undefined;
    'glyph-name'?: number | string | undefined;
    'glyph-orientation-horizontal'?: number | string | undefined;
    'glyph-orientation-vertical'?: number | string | undefined;
    glyphRef?: number | string | undefined;
    gradientTransform?: string | undefined;
    gradientUnits?: string | undefined;
    hanging?: number | string | undefined;
    'horiz-adv-x'?: number | string | undefined;
    'horiz-origin-x'?: number | string | undefined;
    href?: string | undefined;
    ideographic?: number | string | undefined;
    'image-rendering'?: number | string | undefined;
    in2?: number | string | undefined;
    in?: string | undefined;
    intercept?: number | string | undefined;
    k1?: number | string | undefined;
    k2?: number | string | undefined;
    k3?: number | string | undefined;
    k4?: number | string | undefined;
    k?: number | string | undefined;
    kernelMatrix?: number | string | undefined;
    kernelUnitLength?: number | string | undefined;
    kerning?: number | string | undefined;
    keyPoints?: number | string | undefined;
    keySplines?: number | string | undefined;
    keyTimes?: number | string | undefined;
    lengthAdjust?: number | string | undefined;
    'letter-spacing'?: number | string | undefined;
    'lighting-color'?: number | string | undefined;
    limitingConeAngle?: number | string | undefined;
    local?: number | string | undefined;
    'marker-end'?: string | undefined;
    markerHeight?: number | string | undefined;
    'marker-mid'?: string | undefined;
    'marker-start'?: string | undefined;
    markerUnits?: number | string | undefined;
    markerWidth?: number | string | undefined;
    mask?: string | undefined;
    maskContentUnits?: number | string | undefined;
    maskUnits?: number | string | undefined;
    mathematical?: number | string | undefined;
    mode?: number | string | undefined;
    numOctaves?: number | string | undefined;
    offset?: number | string | undefined;
    opacity?: number | string | undefined;
    operator?: number | string | undefined;
    order?: number | string | undefined;
    orient?: number | string | undefined;
    orientation?: number | string | undefined;
    origin?: number | string | undefined;
    overflow?: number | string | undefined;
    'overline-position'?: number | string | undefined;
    'overline-thickness'?: number | string | undefined;
    'paint-order'?: number | string | undefined;
    panose1?: number | string | undefined;
    path?: string | undefined;
    pathLength?: number | string | undefined;
    patternContentUnits?: string | undefined;
    patternTransform?: number | string | undefined;
    patternUnits?: string | undefined;
    'pointer-events'?: number | string | undefined;
    points?: string | undefined;
    pointsAtX?: number | string | undefined;
    pointsAtY?: number | string | undefined;
    pointsAtZ?: number | string | undefined;
    preserveAlpha?: number | string | undefined;
    preserveAspectRatio?: string | undefined;
    primitiveUnits?: number | string | undefined;
    r?: number | string | undefined;
    radius?: number | string | undefined;
    refX?: number | string | undefined;
    refY?: number | string | undefined;
    'rendering-intent'?: number | string | undefined;
    repeatCount?: number | string | undefined;
    repeatDur?: number | string | undefined;
    requiredextensions?: number | string | undefined;
    requiredFeatures?: number | string | undefined;
    restart?: number | string | undefined;
    result?: string | undefined;
    rotate?: number | string | undefined;
    rx?: number | string | undefined;
    ry?: number | string | undefined;
    scale?: number | string | undefined;
    seed?: number | string | undefined;
    'shape-rendering'?: number | string | undefined;
    slope?: number | string | undefined;
    spacing?: number | string | undefined;
    specularConstant?: number | string | undefined;
    specularExponent?: number | string | undefined;
    speed?: number | string | undefined;
    spreadMethod?: string | undefined;
    startOffset?: number | string | undefined;
    stdDeviation?: number | string | undefined;
    stemh?: number | string | undefined;
    stemv?: number | string | undefined;
    stitchTiles?: number | string | undefined;
    'stop-color'?: string | undefined;
    'stop-opacity'?: number | string | undefined;
    'strikethrough-position'?: number | string | undefined;
    'strikethrough-thickness'?: number | string | undefined;
    string?: number | string | undefined;
    stroke?: string | undefined;
    'stroke-dasharray'?: string | number | undefined;
    'stroke-dashoffset'?: string | number | undefined;
    'stroke-linecap'?: 'butt' | 'round' | 'square' | 'inherit' | undefined;
    'stroke-linejoin'?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined;
    'stroke-miterlimit'?: string | undefined;
    'stroke-opacity'?: number | string | undefined;
    'stroke-width'?: number | string | undefined;
    surfaceScale?: number | string | undefined;
    systemLanguage?: number | string | undefined;
    tableValues?: number | string | undefined;
    targetX?: number | string | undefined;
    targetY?: number | string | undefined;
    'text-anchor'?: string | undefined;
    'text-decoration'?: number | string | undefined;
    textLength?: number | string | undefined;
    'text-rendering'?: number | string | undefined;
    to?: number | string | undefined;
    transform?: string | undefined;
    u1?: number | string | undefined;
    u2?: number | string | undefined;
    'underline-position'?: number | string | undefined;
    'underline-thickness'?: number | string | undefined;
    unicode?: number | string | undefined;
    'unicode-bidi'?: number | string | undefined;
    'unicode-range'?: number | string | undefined;
    'units-per-em'?: number | string | undefined;
    'v-alphabetic'?: number | string | undefined;
    values?: string | undefined;
    'vector-effect'?: number | string | undefined;
    version?: string | undefined;
    'vert-adv-y'?: number | string | undefined;
    'vert-origin-x'?: number | string | undefined;
    'vert-origin-y'?: number | string | undefined;
    'v-hanging'?: number | string | undefined;
    'v-ideographic'?: number | string | undefined;
    viewBox?: string | undefined;
    viewTarget?: number | string | undefined;
    visibility?: number | string | undefined;
    'v-mathematical'?: number | string | undefined;
    widths?: number | string | undefined;
    'word-spacing'?: number | string | undefined;
    'writing-mode'?: number | string | undefined;
    x1?: number | string | undefined;
    x2?: number | string | undefined;
    x?: number | string | undefined;
    'x-channel-selector'?: string | undefined;
    'x-height'?: number | string | undefined;
    xlinkActuate?: string | undefined;
    xlinkArcrole?: string | undefined;
    xlinkHref?: string | undefined;
    xlinkRole?: string | undefined;
    xlinkShow?: string | undefined;
    xlinkTitle?: string | undefined;
    xlinkType?: string | undefined;
    xmlBase?: string | undefined;
    xmlLang?: string | undefined;
    xmlns?: string | undefined;
    xmlSpace?: string | undefined;
    y1?: number | string | undefined;
    y2?: number | string | undefined;
    y?: number | string | undefined;
    yChannelSelector?: string | undefined;
    z?: number | string | undefined;
    zoomAndPan?: string | undefined;
}

declare interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
}

declare interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    cellPadding?: number | string | undefined;
    cellSpacing?: number | string | undefined;
    summary?: string | undefined;
    width?: number | string | undefined;
}

declare interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
    colSpan?: number | undefined;
    headers?: string | undefined;
    rowSpan?: number | undefined;
    scope?: string | undefined;
    abbr?: string | undefined;
    height?: number | string | undefined;
    width?: number | string | undefined;
    valign?: 'top' | 'middle' | 'bottom' | 'baseline' | undefined;
}

declare interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoComplete?: HTMLInputAutocompleteAttribute | Omit<HTMLInputAutocompleteAttribute, string> | undefined;
    autoFocus?: boolean | undefined;
    cols?: number | undefined;
    dirName?: string | undefined;
    disabled?: boolean | undefined;
    form?: string | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    name?: string | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    required?: boolean | undefined;
    rows?: number | undefined;
    value?: string | ReadonlyArray<string> | number | undefined;
    wrap?: string | undefined;
}

declare interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
    colSpan?: number | undefined;
    headers?: string | undefined;
    rowSpan?: number | undefined;
    scope?: string | undefined;
    abbr?: string | undefined;
}

declare interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
    dateTime?: string | undefined;
}

/**
 * Used to signal to Qwik which state should be watched for changes.
 *
 * The `Tracker` is passed into the `watchFn` of `useWatch`. It is intended to be used to wrap
 * state objects in a read proxy which signals to Qwik which properties should be watched for
 * changes. A change to any of the properties causes the `watchFn` to rerun.
 *
 * ## Example
 *
 * The `obs` passed into the `watchFn` is used to mark `state.count` as a property of interest.
 * Any changes to the `state.count` property will cause the `watchFn` to rerun.
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
export declare interface Tracker {
    <T extends {}>(obj: T): T;
    <T extends {}, B extends keyof T>(obj: T, prop: B): T[B];
}

declare interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
    default?: boolean | undefined;
    kind?: string | undefined;
    label?: string | undefined;
    src?: string | undefined;
    srcLang?: string | undefined;
}

/**
 * A lazy-loadable reference to a component's cleanup hook.
 *
 * Invoked when the component is destroyed (removed from render tree), or paused as part of the
 * SSR serialization.
 *
 * It can be used to release resources, abort network requests, stop timers...
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
export declare const useCleanup$: (first: () => void) => void;

/**
 * A lazy-loadable reference to a component's cleanup hook.
 *
 * Invoked when the component is destroyed (removed from render tree), or paused as part of the
 * SSR serialization.
 *
 * It can be used to release resources, abort network requests, stop timers...
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
export declare const useCleanupQrl: (unmountFn: QRL<() => void>) => void;

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
export declare const useClientEffect$: (first: WatchFn, opts?: UseEffectOptions | undefined) => void;

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
export declare const useClientEffectQrl: (qrl: QRL<WatchFn>, opts?: UseEffectOptions) => void;

/**
 * Retrive Context value.
 *
 * Use `useContext()` to retrieve the value of context in a component. To retrieve a value a
 * parent component needs to invoke `useContextProvider()` to assign a value.
 *
 * ## Example
 *
 * ```tsx
 * // Declare the Context type.
 * interface TodosStore {
 *   items: string[];
 * }
 * // Create a Context ID (no data is saved here.)
 * // You will use this ID to both create and retrieve the Context.
 * export const TodosContext = createContext<TodosStore>('Todos');
 *
 * // Example of providing context to child components.
 * export const App = component$(() => {
 *   useContextProvider(
 *     TodosContext,
 *     useStore<TodosStore>({
 *       items: ['Learn Qwik', 'Build Qwik app', 'Profit'],
 *     })
 *   );
 *
 *   return <Items />;
 * });
 *
 * // Example of retrieving the context provided by a parent component.
 * export const Items = component$(() => {
 *   const todos = useContext(TodosContext);
 *   return (
 *     <ul>
 *       {todos.items.map((item) => (
 *         <li>{item}</li>
 *       ))}
 *     </ul>
 *   );
 * });
 *
 * ```
 * @param context - The context to retrieve a value from.
 * @alpha
 */
export declare const useContext: <STATE extends object>(context: Context<STATE>) => STATE;

/**
 * Assign a value to a Context.
 *
 * Use `useContextProvider()` to assign a value to a context. The assignment happens in the
 * component's function. Once assign use `useContext()` in any child component to retrieve the
 * value.
 *
 * Context is a way to pass stores to the child components without prop-drilling.
 *
 * ## Example
 *
 * ```tsx
 * // Declare the Context type.
 * interface TodosStore {
 *   items: string[];
 * }
 * // Create a Context ID (no data is saved here.)
 * // You will use this ID to both create and retrieve the Context.
 * export const TodosContext = createContext<TodosStore>('Todos');
 *
 * // Example of providing context to child components.
 * export const App = component$(() => {
 *   useContextProvider(
 *     TodosContext,
 *     useStore<TodosStore>({
 *       items: ['Learn Qwik', 'Build Qwik app', 'Profit'],
 *     })
 *   );
 *
 *   return <Items />;
 * });
 *
 * // Example of retrieving the context provided by a parent component.
 * export const Items = component$(() => {
 *   const todos = useContext(TodosContext);
 *   return (
 *     <ul>
 *       {todos.items.map((item) => (
 *         <li>{item}</li>
 *       ))}
 *     </ul>
 *   );
 * });
 *
 * ```
 * @param context - The context to assign a value to.
 * @param value - The value to assign to the context.
 * @alpha
 */
export declare const useContextProvider: <STATE extends object>(context: Context<STATE>, newValue: STATE) => void;

/**
 * Retrieves the document of the current element. It's important to use this method instead of
 * accessing `document` directly because during SSR, the global document might not exist.
 *
 * NOTE: `useDocument` method can only be used in the synchronous portion of the callback (before
 * any `await` statements.)
 *
 * @alpha
 */
export declare const useDocument: () => Document;

/**
 * @alpha
 */
export declare interface UseEffectOptions {
    /**
     * - `visible`: run the effect when the element is visible.
     * - `load`: eagerly run the effect when the application resumes.
     */
    eagerness?: EagernessOptions;
}

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
export declare const useHostElement: () => Element;

/**
 * Used by the Qwik Optimizer to restore the lexically scoped variables.
 *
 * This method should not be present in the application source code.
 *
 * NOTE: `useLexicalScope` method can only be used in the synchronous portion of the callback
 * (before any `await` statements.)
 *
 * @public
 */
export declare const useLexicalScope: <VARS extends any[]>() => VARS;

/**
 * Register a server mount hook that runs only in the server when the component is first mounted.
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
 *     const json = (await res.json()) as any;
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
 * @see `useServerMount`
 * @public
 */
export declare const useMount$: <T>(first: MountFn<T>) => ResourceReturn<T>;

/**
 * Register a server mount hook that runs only in the server when the component is first mounted.
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
 *     const json = (await res.json()) as any;
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
 * @see `useServerMount`
 * @public
 */
export declare const useMountQrl: <T>(mountQrl: QRL<MountFn<T>>) => ResourceReturn<T>;

/**
 * Register a listener on the current component's host element.
 *
 * Used to programmatically add event listeners. Useful from custom `use*` methods, which do not
 * have access to the JSX. Otherwise, it's adding a JSX listener in the `<Host>` is a better
 * idea.
 *
 * @see `useOn`, `useOnWindow`, `useOnDocument`.
 *
 * @alpha
 */
export declare const useOn: (event: string, eventQrl: QRL<(ev: Event) => void>) => void;

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
 *     $((event) => {
 *       console.log('body scrolled', event);
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
export declare const useOnDocument: (event: string, eventQrl: QRL<(ev: Event) => void>) => void;

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
 *     $((event) => {
 *       console.log('navigation happened', event);
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
export declare const useOnWindow: (event: string, eventQrl: QRL<(ev: Event) => void>) => void;

/**
 * It's a very thin wrapper around `useStore()`, including the proper type signature to be passed
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
export declare const useRef: <T extends Element = Element>(current?: T | undefined) => Ref<T>;

/**
 * @alpha
 */
export declare const useResource$: <T>(generatorFn: ResourceFn<T>) => ResourceReturn<T>;

/**
 * @alpha
 */
export declare const useResourceQrl: <T>(qrl: QRL<ResourceFn<T>>, opts?: ResourceOptions) => ResourceReturn<T>;

/**
 * @see `useStyles`.
 *
 * @alpha
 */
export declare const useScopedStyles$: (first: string) => void;

/**
 * @see `useStyles`.
 *
 * @alpha
 */
export declare const useScopedStylesQrl: (styles: QRL<string>) => void;

/**
 * Register's a server mount hook that runs only in the server when the component is first
 * mounted.
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
 * @see `useMount`
 * @public
 */
export declare const useServerMount$: <T>(first: MountFn<T>) => ResourceReturn<T>;

/**
 * Register's a server mount hook that runs only in the server when the component is first
 * mounted.
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
 * @see `useMount`
 * @public
 */
export declare const useServerMountQrl: <T>(mountQrl: QRL<MountFn<T>>) => ResourceReturn<T>;

/**
 * Creates an object that Qwik can track across serializations.
 *
 * Use `useStore` to create a state for your application. The returned object is a proxy that has
 * a unique ID. The ID of the object is used in the `QRL`s to refer to the store.
 *
 * ## Example
 *
 * Example showing how `useStore` is used in Counter example to keep track of the count.
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
export declare const useStore: <STATE extends object>(initialState: STATE | (() => STATE), opts?: UseStoreOptions) => STATE;

declare interface UseStoreOptions {
    recursive?: boolean;
    reactive?: boolean;
}

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
export declare const useStyles$: (first: string) => void;

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
export declare const useStylesQrl: (styles: QRL<string>) => void;

/**
 * @alpha
 */
export declare function useUserContext<T>(key: string): T | undefined;

/**
 * @alpha
 */
export declare function useUserContext<T, B = T>(key: string, defaultValue: B): T | B;

/**
 * Reruns the `watchFn` when the observed inputs change.
 *
 * Use `useWatch` to observe changes on a set of inputs, and then re-execute the `watchFn` when
 * those inputs change.
 *
 * The `watchFn` only executes if the observed inputs change. To observe the inputs, use the
 * `obs` function to wrap property reads. This creates subscriptions that will trigger the
 * `watchFn` to rerun.
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
export declare const useWatch$: (first: WatchFn, opts?: UseEffectOptions | undefined) => void;

/**
 * Reruns the `watchFn` when the observed inputs change.
 *
 * Use `useWatch` to observe changes on a set of inputs, and then re-execute the `watchFn` when
 * those inputs change.
 *
 * The `watchFn` only executes if the observed inputs change. To observe the inputs, use the
 * `obs` function to wrap property reads. This creates subscriptions that will trigger the
 * `watchFn` to rerun.
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
export declare const useWatchQrl: (qrl: QRL<WatchFn>, opts?: UseEffectOptions) => void;

/**
 * Type representing a value which is either resolve or a promise.
 * @public
 */
export declare type ValueOrPromise<T> = T | Promise<T>;

/**
 * 0.0.39
 * @public
 */
export declare const version: string;

declare interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
    height?: number | string | undefined;
    playsInline?: boolean | undefined;
    poster?: string | undefined;
    width?: number | string | undefined;
    disablePictureInPicture?: boolean | undefined;
    disableRemotePlayback?: boolean | undefined;
}

/**
 * @alpha
 */
export declare type WatchFn = (track: Tracker) => ValueOrPromise<void | (() => void)>;

declare interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
    allowFullScreen?: boolean | undefined;
    allowpopups?: boolean | undefined;
    autoFocus?: boolean | undefined;
    autosize?: boolean | undefined;
    blinkfeatures?: string | undefined;
    disableblinkfeatures?: string | undefined;
    disableguestresize?: boolean | undefined;
    disablewebsecurity?: boolean | undefined;
    guestinstance?: string | undefined;
    httpreferrer?: string | undefined;
    nodeintegration?: boolean | undefined;
    partition?: string | undefined;
    plugins?: boolean | undefined;
    preload?: string | undefined;
    src?: string | undefined;
    useragent?: string | undefined;
    webpreferences?: string | undefined;
}

export { }
