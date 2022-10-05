/**
 * @license
 * @builder.io/qwik/optimizer 0.9.0
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
var qDev = true === globalThis.qDev;

var qSerialize = false !== globalThis.qSerialize;

var qDynamicPlatform = false !== globalThis.qDynamicPlatform;

var qTest = true === globalThis.qTest;

var qRuntimeQrl = true === globalThis.qRuntimeQrl;

var isNode = value => value && "number" === typeof value.nodeType;

var isElement = value => 1 === value.nodeType;

var STYLE = qDev ? "background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;" : "";

var logWarn = (message, ...optionalParams) => {
  qDev && console.warn("%cQWIK WARN", STYLE, message, ...printParams(optionalParams));
};

var tryGetContext = element => element._qc_;

var printParams = optionalParams => {
  if (qDev) {
    return optionalParams.map((p => {
      if (isNode(p) && isElement(p)) {
        return printElement(p);
      }
      return p;
    }));
  }
  return optionalParams;
};

var printElement = el => {
  const ctx = tryGetContext(el);
  const isServer = (() => "undefined" !== typeof process && !!process.versions && !!process.versions.node)();
  return {
    tagName: el.tagName,
    renderQRL: ctx?.$componentQrl$?.getSymbol(),
    element: isServer ? void 0 : el,
    ctx: isServer ? void 0 : ctx
  };
};

function createPath(opts = {}) {
  function assertPath(path) {
    if ("string" !== typeof path) {
      throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
    }
  }
  function normalizeStringPosix(path, allowAboveRoot) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for (let i = 0; i <= path.length; ++i) {
      if (i < path.length) {
        code = path.charCodeAt(i);
      } else {
        if (47 === code) {
          break;
        }
        code = 47;
      }
      if (47 === code) {
        if (lastSlash === i - 1 || 1 === dots) {} else if (lastSlash !== i - 1 && 2 === dots) {
          if (res.length < 2 || 2 !== lastSegmentLength || 46 !== res.charCodeAt(res.length - 1) || 46 !== res.charCodeAt(res.length - 2)) {
            if (res.length > 2) {
              const lastSlashIndex = res.lastIndexOf("/");
              if (lastSlashIndex !== res.length - 1) {
                if (-1 === lastSlashIndex) {
                  res = "";
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                }
                lastSlash = i;
                dots = 0;
                continue;
              }
            } else if (2 === res.length || 1 === res.length) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            res.length > 0 ? res += "/.." : res = "..";
            lastSegmentLength = 2;
          }
        } else {
          res.length > 0 ? res += "/" + path.slice(lastSlash + 1, i) : res = path.slice(lastSlash + 1, i);
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else {
        46 === code && -1 !== dots ? ++dots : dots = -1;
      }
    }
    return res;
  }
  function _format(sep2, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) {
      return base;
    }
    if (dir === pathObject.root) {
      return dir + base;
    }
    return dir + sep2 + base;
  }
  const resolve = function(...paths) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    let cwd;
    for (let i = paths.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      let path;
      if (i >= 0) {
        path = paths[i];
      } else {
        void 0 === cwd && (cwd = opts && "function" === typeof opts.cwd ? opts.cwd() : "undefined" !== typeof process && "function" === typeof process.cwd ? process.cwd() : "/");
        path = cwd;
      }
      assertPath(path);
      if (0 === path.length) {
        continue;
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = 47 === path.charCodeAt(0);
    }
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    return resolvedAbsolute ? resolvedPath.length > 0 ? "/" + resolvedPath : "/" : resolvedPath.length > 0 ? resolvedPath : ".";
  };
  const normalize = function(path) {
    assertPath(path);
    if (0 === path.length) {
      return ".";
    }
    const isAbsolute2 = 47 === path.charCodeAt(0);
    const trailingSeparator = 47 === path.charCodeAt(path.length - 1);
    path = normalizeStringPosix(path, !isAbsolute2);
    0 !== path.length || isAbsolute2 || (path = ".");
    path.length > 0 && trailingSeparator && (path += "/");
    if (isAbsolute2) {
      return "/" + path;
    }
    return path;
  };
  const isAbsolute = function(path) {
    assertPath(path);
    return path.length > 0 && 47 === path.charCodeAt(0);
  };
  const join = function(...paths) {
    if (0 === paths.length) {
      return ".";
    }
    let joined;
    for (let i = 0; i < paths.length; ++i) {
      const arg = paths[i];
      assertPath(arg);
      arg.length > 0 && (void 0 === joined ? joined = arg : joined += "/" + arg);
    }
    if (void 0 === joined) {
      return ".";
    }
    return normalize(joined);
  };
  const relative = function(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) {
      return "";
    }
    from = resolve(from);
    to = resolve(to);
    if (from === to) {
      return "";
    }
    let fromStart = 1;
    for (;fromStart < from.length; ++fromStart) {
      if (47 !== from.charCodeAt(fromStart)) {
        break;
      }
    }
    const fromEnd = from.length;
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    for (;toStart < to.length; ++toStart) {
      if (47 !== to.charCodeAt(toStart)) {
        break;
      }
    }
    const toEnd = to.length;
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (;i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (47 === to.charCodeAt(toStart + i)) {
            return to.slice(toStart + i + 1);
          }
          if (0 === i) {
            return to.slice(toStart + i);
          }
        } else {
          fromLen > length && (47 === from.charCodeAt(fromStart + i) ? lastCommonSep = i : 0 === i && (lastCommonSep = 0));
        }
        break;
      }
      const fromCode = from.charCodeAt(fromStart + i);
      const toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode) {
        break;
      }
      47 === fromCode && (lastCommonSep = i);
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      i !== fromEnd && 47 !== from.charCodeAt(i) || (0 === out.length ? out += ".." : out += "/..");
    }
    if (out.length > 0) {
      return out + to.slice(toStart + lastCommonSep);
    }
    toStart += lastCommonSep;
    47 === to.charCodeAt(toStart) && ++toStart;
    return to.slice(toStart);
  };
  const dirname = function(path) {
    assertPath(path);
    if (0 === path.length) {
      return ".";
    }
    let code = path.charCodeAt(0);
    const hasRoot = 47 === code;
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (47 === code) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (-1 === end) {
      return hasRoot ? "/" : ".";
    }
    if (hasRoot && 1 === end) {
      return "//";
    }
    return path.slice(0, end);
  };
  const basename = function(path, ext) {
    if (void 0 !== ext && "string" !== typeof ext) {
      throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (void 0 !== ext && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) {
        return "";
      }
      let extIdx = ext.length - 1;
      let firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (47 === code) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (-1 === firstNonSlashEnd) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code === ext.charCodeAt(extIdx)) {
              -1 === --extIdx && (end = i);
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      start === end ? end = firstNonSlashEnd : -1 === end && (end = path.length);
      return path.slice(start, end);
    }
    for (i = path.length - 1; i >= 0; --i) {
      if (47 === path.charCodeAt(i)) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (-1 === end) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (-1 === end) {
      return "";
    }
    return path.slice(start, end);
  };
  const extname = function(path) {
    assertPath(path);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i = path.length - 1; i >= 0; --i) {
      const code = path.charCodeAt(i);
      if (47 === code) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (-1 === end) {
        matchedSlash = false;
        end = i + 1;
      }
      46 === code ? -1 === startDot ? startDot = i : 1 !== preDotState && (preDotState = 1) : -1 !== startDot && (preDotState = -1);
    }
    if (-1 === startDot || -1 === end || 0 === preDotState || 1 === preDotState && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  };
  const format = function(pathObject) {
    if (null === pathObject || "object" !== typeof pathObject) {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format("/", pathObject);
  };
  const parse = function(path) {
    assertPath(path);
    const ret = {
      root: "",
      dir: "",
      base: "",
      ext: "",
      name: ""
    };
    if (0 === path.length) {
      return ret;
    }
    let code = path.charCodeAt(0);
    let start;
    const isAbsolute2 = 47 === code;
    if (isAbsolute2) {
      ret.root = "/";
      start = 1;
    } else {
      start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (;i >= start; --i) {
      code = path.charCodeAt(i);
      if (47 === code) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (-1 === end) {
        matchedSlash = false;
        end = i + 1;
      }
      46 === code ? -1 === startDot ? startDot = i : 1 !== preDotState && (preDotState = 1) : -1 !== startDot && (preDotState = -1);
    }
    if (-1 === startDot || -1 === end || 0 === preDotState || 1 === preDotState && startDot === end - 1 && startDot === startPart + 1) {
      -1 !== end && (ret.base = ret.name = 0 === startPart && isAbsolute2 ? path.slice(1, end) : path.slice(startPart, end));
    } else {
      if (0 === startPart && isAbsolute2) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }
    startPart > 0 ? ret.dir = path.slice(0, startPart - 1) : isAbsolute2 && (ret.dir = "/");
    return ret;
  };
  const sep = "/";
  const delimiter = ":";
  return {
    relative: relative,
    resolve: resolve,
    parse: parse,
    format: format,
    join: join,
    isAbsolute: isAbsolute,
    basename: basename,
    normalize: normalize,
    dirname: dirname,
    extname: extname,
    delimiter: delimiter,
    sep: sep,
    win32: null,
    posix: {
      relative: relative,
      resolve: resolve,
      parse: parse,
      format: format,
      join: join,
      isAbsolute: isAbsolute,
      basename: basename,
      normalize: normalize,
      dirname: dirname,
      extname: extname,
      delimiter: delimiter,
      sep: sep,
      win32: null,
      posix: null
    }
  };
}

var QWIK_BINDING_MAP = {
  darwin: {
    arm64: [ {
      platform: "darwin",
      arch: "arm64",
      abi: null,
      platformArchABI: "qwik.darwin-arm64.node"
    } ],
    x64: [ {
      platform: "darwin",
      arch: "x64",
      abi: null,
      platformArchABI: "qwik.darwin-x64.node"
    } ]
  },
  win32: {
    x64: [ {
      platform: "win32",
      arch: "x64",
      abi: "msvc",
      platformArchABI: "qwik.win32-x64-msvc.node"
    } ]
  }
};

var versions = {
  qwik: "0.9.0"
};

async function getSystem() {
  const sysEnv = getEnv();
  const sys = {
    dynamicImport: path => {
      throw new Error(`Qwik Optimizer sys.dynamicImport() not implemented, trying to import: "${path}"`);
    },
    strictDynamicImport: path => {
      throw new Error(`Qwik Optimizer sys.strictDynamicImport() not implemented, trying to import: "${path}"`);
    },
    path: null,
    cwd: () => "/",
    os: "unknown",
    env: sysEnv
  };
  sys.path = createPath(sys);
  sys.strictDynamicImport = sys.dynamicImport = path => import(path);
  false;
  if ("node" === sysEnv) {
    sys.path = await sys.dynamicImport("path");
    sys.cwd = () => process.cwd();
    sys.os = process.platform;
  }
  return sys;
}

var getPlatformInputFiles = async sys => {
  if ("function" === typeof sys.getInputFiles) {
    return sys.getInputFiles;
  }
  if ("node" === sys.env) {
    const fs = await sys.dynamicImport("fs");
    return async rootDir => {
      const getChildFilePaths = async dir => {
        const stats = await fs.promises.stat(dir);
        const flatted = [];
        if (stats.isDirectory()) {
          const dirItems = await fs.promises.readdir(dir);
          const files = await Promise.all(dirItems.map((async subdir => {
            const resolvedPath = sys.path.resolve(dir, subdir);
            const stats2 = await fs.promises.stat(resolvedPath);
            return stats2.isDirectory() ? getChildFilePaths(resolvedPath) : [ resolvedPath ];
          })));
          for (const file of files) {
            flatted.push(...file);
          }
        } else {
          flatted.push(dir);
        }
        return flatted.filter((a => extensions[sys.path.extname(a)]));
      };
      const filePaths = await getChildFilePaths(rootDir);
      const inputs = (await Promise.all(filePaths.map((async filePath => {
        const input = {
          code: await fs.promises.readFile(filePath, "utf8"),
          path: filePath
        };
        return input;
      })))).sort(((a, b) => {
        if (a.path < b.path) {
          return -1;
        }
        if (a.path > b.path) {
          return 1;
        }
        return 0;
      }));
      return inputs;
    };
  }
  return null;
};

async function loadPlatformBinding(sys) {
  const sysEnv = getEnv();
  if ("node" === sysEnv) {
    const platform = QWIK_BINDING_MAP[process.platform];
    if (platform) {
      const triples = platform[process.arch];
      if (triples) {
        for (const triple of triples) {
          try {
            {
              const module = await sys.dynamicImport("module");
              const mod2 = module.default.createRequire(import.meta.url)(`./bindings/${triple.platformArchABI}`);
              return mod2;
            }
          } catch (e) {
            logWarn(e);
          }
        }
      }
    }
  }
  false;
  if ("node" === sysEnv) {
    const url = await sys.dynamicImport("url");
    const __dirname2 = sys.path.dirname(url.fileURLToPath(import.meta.url));
    const wasmPath = sys.path.join(__dirname2, "bindings", "qwik_wasm_bg.wasm");
    const mod = await sys.dynamicImport("./bindings/qwik.wasm.mjs");
    const fs = await sys.dynamicImport("fs");
    return new Promise(((resolve, reject) => {
      fs.readFile(wasmPath, ((err, buf) => {
        null != err ? reject(err) : resolve(buf);
      }));
    })).then((buf => WebAssembly.compile(buf))).then((wasm => mod.default(wasm))).then((() => mod));
  }
  {
    const module = await sys.dynamicImport("./bindings/qwik.wasm.mjs");
    await module.default();
    return module;
  }
}

var getEnv = () => {
  if ("undefined" !== typeof Deno) {
    return "deno";
  }
  if ("undefined" !== typeof process && "undefined" !== typeof global && process.versions && process.versions.node) {
    return "node";
  }
  if ("undefined" !== typeof self && "undefined" !== typeof location && "undefined" !== typeof navigator && "function" === typeof fetch && "function" === typeof WorkerGlobalScope && "function" === typeof self.importScripts) {
    return "webworker";
  }
  if ("undefined" !== typeof window && "undefined" !== typeof document && "undefined" !== typeof location && "undefined" !== typeof navigator && "function" === typeof Window && "function" === typeof fetch) {
    return "browsermain";
  }
  return "unknown";
};

var extensions = {
  ".js": true,
  ".ts": true,
  ".tsx": true,
  ".jsx": true,
  ".mjs": true
};

var createOptimizer = async (optimizerOptions = {}) => {
  const sys = optimizerOptions?.sys || await getSystem();
  const binding = optimizerOptions?.binding || await loadPlatformBinding(sys);
  const optimizer = {
    transformModules: async opts => transformModulesSync(binding, opts),
    transformModulesSync: opts => transformModulesSync(binding, opts),
    transformFs: async opts => transformFsAsync(sys, binding, opts),
    transformFsSync: opts => transformFsSync(binding, opts),
    sys: sys
  };
  return optimizer;
};

var transformModulesSync = (binding, opts) => binding.transform_modules(convertOptions(opts));

var transformFsSync = (binding, opts) => {
  if (binding.transform_fs) {
    return binding.transform_fs(convertOptions(opts));
  }
  throw new Error("Not implemented");
};

var transformFsAsync = async (sys, binding, fsOpts) => {
  if (binding.transform_fs && !sys.getInputFiles) {
    return binding.transform_fs(convertOptions(fsOpts));
  }
  const getInputFiles = await getPlatformInputFiles(sys);
  if (getInputFiles) {
    const input = await getInputFiles(fsOpts.srcDir);
    for (const root of fsOpts.vendorRoots) {
      const rootFiles = await getInputFiles(root);
      input.push(...rootFiles);
    }
    input.forEach((file => {
      file.path = sys.path.relative(fsOpts.srcDir, file.path);
    }));
    const modulesOpts = {
      srcDir: fsOpts.srcDir,
      entryStrategy: fsOpts.entryStrategy,
      minify: fsOpts.minify,
      sourceMaps: fsOpts.sourceMaps,
      transpile: fsOpts.transpile,
      mode: fsOpts.mode,
      scope: fsOpts.scope,
      input: input
    };
    return binding.transform_modules(convertOptions(modulesOpts));
  }
  throw new Error("Not implemented");
};

var convertOptions = opts => {
  const output = {
    minify: "simplify",
    sourceMaps: false,
    transpile: false,
    explicitExtensions: false,
    mode: "lib",
    manualChunks: void 0,
    scope: void 0,
    stripExports: void 0
  };
  Object.entries(opts).forEach((([key, value]) => {
    null != value && (output[key] = value);
  }));
  output.entryStrategy = opts.entryStrategy?.type ?? "smart";
  output.manualChunks = opts.entryStrategy?.manual ?? void 0;
  return output;
};

function prioritorizeSymbolNames(manifest) {
  const symbols = manifest.symbols;
  return Object.keys(symbols).sort(((symbolNameA, symbolNameB) => {
    const a = symbols[symbolNameA];
    const b = symbols[symbolNameB];
    if ("event" === a.ctxKind && "event" !== b.ctxKind) {
      return -1;
    }
    if ("event" !== a.ctxKind && "event" === b.ctxKind) {
      return 1;
    }
    if ("event" === a.ctxKind && "event" === b.ctxKind) {
      const aIndex = EVENT_PRIORITY.indexOf(a.ctxName.toLowerCase());
      const bIndex = EVENT_PRIORITY.indexOf(b.ctxName.toLowerCase());
      if (aIndex > -1 && bIndex > -1) {
        if (aIndex < bIndex) {
          return -1;
        }
        if (aIndex > bIndex) {
          return 1;
        }
      } else {
        if (aIndex > -1) {
          return -1;
        }
        if (bIndex > -1) {
          return 1;
        }
      }
    } else if ("function" === a.ctxKind && "function" === b.ctxKind) {
      const aIndex = FUNCTION_PRIORITY.indexOf(a.ctxName.toLowerCase());
      const bIndex = FUNCTION_PRIORITY.indexOf(b.ctxName.toLowerCase());
      if (aIndex > -1 && bIndex > -1) {
        if (aIndex < bIndex) {
          return -1;
        }
        if (aIndex > bIndex) {
          return 1;
        }
      } else {
        if (aIndex > -1) {
          return -1;
        }
        if (bIndex > -1) {
          return 1;
        }
      }
    }
    if (!a.parent && b.parent) {
      return -1;
    }
    if (a.parent && !b.parent) {
      return 1;
    }
    if (a.hash < b.hash) {
      return -1;
    }
    if (a.hash > b.hash) {
      return 1;
    }
    return 0;
  }));
}

var EVENT_PRIORITY = [ "click", "dblclick", "contextmenu", "auxclick", "pointerdown", "pointerup", "pointermove", "pointerover", "pointerenter", "pointerleave", "pointerout", "pointercancel", "gotpointercapture", "lostpointercapture", "touchstart", "touchend", "touchmove", "touchcancel", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "wheel", "gesturestart", "gesturechange", "gestureend", "keydown", "keyup", "keypress", "input", "change", "search", "invalid", "beforeinput", "select", "focusin", "focusout", "focus", "blur", "submit", "reset", "scroll" ].map((n => `on${n.toLowerCase()}$`));

var FUNCTION_PRIORITY = [ "useWatch$", "useClientEffect$", "useEffect$", "component$", "useStyles$", "useStylesScoped$" ].map((n => n.toLowerCase()));

function sortBundleNames(manifest) {
  return Object.keys(manifest.bundles).sort(sortAlphabetical);
}

function updateSortAndPriorities(manifest) {
  const prioritorizedSymbolNames = prioritorizeSymbolNames(manifest);
  const prioritorizedSymbols = {};
  const prioritorizedMapping = {};
  for (const symbolName of prioritorizedSymbolNames) {
    prioritorizedSymbols[symbolName] = manifest.symbols[symbolName];
    prioritorizedMapping[symbolName] = manifest.mapping[symbolName];
  }
  const sortedBundleNames = sortBundleNames(manifest);
  const sortedBundles = {};
  for (const bundleName of sortedBundleNames) {
    sortedBundles[bundleName] = manifest.bundles[bundleName];
    const bundle = manifest.bundles[bundleName];
    Array.isArray(bundle.imports) && bundle.imports.sort(sortAlphabetical);
    Array.isArray(bundle.dynamicImports) && bundle.dynamicImports.sort(sortAlphabetical);
    const symbols = [];
    for (const symbolName of prioritorizedSymbolNames) {
      bundleName === prioritorizedMapping[symbolName] && symbols.push(symbolName);
    }
    if (symbols.length > 0) {
      symbols.sort(sortAlphabetical);
      bundle.symbols = symbols;
    }
  }
  manifest.symbols = prioritorizedSymbols;
  manifest.mapping = prioritorizedMapping;
  manifest.bundles = sortedBundles;
  return manifest;
}

function sortAlphabetical(a, b) {
  a = a.toLocaleLowerCase();
  b = b.toLocaleLowerCase();
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function getValidManifest(manifest) {
  if (null != manifest && null != manifest.mapping && "object" === typeof manifest.mapping && null != manifest.symbols && "object" === typeof manifest.symbols && null != manifest.bundles && "object" === typeof manifest.bundles) {
    return manifest;
  }
  return;
}

function generateManifestFromBundles(path, hooks, injections, outputBundles, opts) {
  const manifest = {
    symbols: {},
    mapping: {},
    bundles: {},
    injections: injections,
    version: "1",
    options: {
      target: opts.target,
      buildMode: opts.buildMode,
      forceFullBuild: opts.forceFullBuild,
      entryStrategy: opts.entryStrategy
    }
  };
  for (const hook of hooks) {
    const buildFilePath = `${hook.canonicalFilename}.${hook.extension}`;
    const outputBundle = outputBundles.find((b => Object.keys(b.modules).find((f => f.endsWith(buildFilePath)))));
    if (outputBundle) {
      const symbolName = hook.name;
      const bundleFileName = path.basename(outputBundle.fileName);
      manifest.mapping[symbolName] = bundleFileName;
      manifest.symbols[symbolName] = {
        origin: hook.origin,
        displayName: hook.displayName,
        canonicalFilename: hook.canonicalFilename,
        hash: hook.hash,
        ctxKind: hook.ctxKind,
        ctxName: hook.ctxName,
        captures: hook.captures,
        parent: hook.parent
      };
      addBundleToManifest(path, manifest, outputBundle, bundleFileName);
    }
  }
  for (const outputBundle of outputBundles) {
    const bundleFileName = path.basename(outputBundle.fileName);
    addBundleToManifest(path, manifest, outputBundle, bundleFileName);
  }
  return updateSortAndPriorities(manifest);
}

function addBundleToManifest(path, manifest, outputBundle, bundleFileName) {
  if (!manifest.bundles[bundleFileName]) {
    const buildDirName = path.dirname(outputBundle.fileName);
    const bundle = {
      size: outputBundle.size
    };
    const bundleImports = outputBundle.imports.filter((i => path.dirname(i) === buildDirName)).map((i => path.relative(buildDirName, i)));
    bundleImports.length > 0 && (bundle.imports = bundleImports);
    const bundleDynamicImports = outputBundle.dynamicImports.filter((i => path.dirname(i) === buildDirName)).map((i => path.relative(buildDirName, i)));
    bundleDynamicImports.length > 0 && (bundle.dynamicImports = bundleDynamicImports);
    const modulePaths = Object.keys(outputBundle.modules);
    modulePaths.length > 0 && (bundle.origins = modulePaths);
    manifest.bundles[bundleFileName] = bundle;
  }
}

function createPlugin(optimizerOptions = {}) {
  const id = `${Math.round(899 * Math.random()) + 100}`;
  const results = new Map;
  const transformedOutputs = new Map;
  let internalOptimizer = null;
  let addWatchFileCallback = () => {};
  let diagnosticsCallback = () => {};
  const opts = {
    target: "client",
    buildMode: "development",
    debug: false,
    rootDir: null,
    input: null,
    outDir: null,
    resolveQwikBuild: false,
    forceFullBuild: false,
    entryStrategy: null,
    srcDir: null,
    srcInputs: null,
    manifestInput: null,
    manifestOutput: null,
    transformedModuleOutput: null,
    vendorRoots: [],
    scope: null
  };
  const init = async () => {
    internalOptimizer || (internalOptimizer = await createOptimizer(optimizerOptions));
  };
  const getOptimizer = () => {
    if (!internalOptimizer) {
      throw new Error("Qwik plugin has not been initialized");
    }
    return internalOptimizer;
  };
  const getSys = () => {
    const optimizer = getOptimizer();
    return optimizer.sys;
  };
  const getPath = () => {
    const optimizer = getOptimizer();
    return optimizer.sys.path;
  };
  const normalizeOptions = inputOpts => {
    const updatedOpts = Object.assign({}, inputOpts);
    const optimizer = getOptimizer();
    const path = optimizer.sys.path;
    opts.debug = !!updatedOpts.debug;
    "ssr" === updatedOpts.target || "client" === updatedOpts.target || "lib" === updatedOpts.target ? opts.target = updatedOpts.target : opts.target = "client";
    "lib" === opts.target ? opts.buildMode = "development" : "production" === updatedOpts.buildMode || "development" === updatedOpts.buildMode ? opts.buildMode = updatedOpts.buildMode : opts.buildMode = "development";
    updatedOpts.entryStrategy && "object" === typeof updatedOpts.entryStrategy && (opts.entryStrategy = {
      ...updatedOpts.entryStrategy
    });
    opts.entryStrategy || ("ssr" === opts.target || "lib" === opts.target ? opts.entryStrategy = {
      type: "inline"
    } : "production" === opts.buildMode ? opts.entryStrategy = {
      type: "smart"
    } : opts.entryStrategy = {
      type: "hook"
    });
    "string" === typeof updatedOpts.rootDir && (opts.rootDir = updatedOpts.rootDir);
    "string" !== typeof opts.rootDir && (opts.rootDir = optimizer.sys.cwd());
    opts.rootDir = normalizePath(path.resolve(optimizer.sys.cwd(), opts.rootDir));
    let srcDir = normalizePath(path.resolve(opts.rootDir, SRC_DIR_DEFAULT));
    if ("string" === typeof updatedOpts.srcDir) {
      opts.srcDir = normalizePath(path.resolve(opts.rootDir, updatedOpts.srcDir));
      srcDir = opts.srcDir;
      opts.srcInputs = null;
    } else if (Array.isArray(updatedOpts.srcInputs)) {
      opts.srcInputs = [ ...updatedOpts.srcInputs ];
      opts.srcDir = null;
    } else {
      opts.srcDir = srcDir;
    }
    "boolean" === typeof updatedOpts.forceFullBuild ? opts.forceFullBuild = updatedOpts.forceFullBuild : opts.forceFullBuild = "hook" !== opts.entryStrategy.type && "inline" !== opts.entryStrategy.type || !!updatedOpts.srcInputs;
    if (false === opts.forceFullBuild && "hook" !== opts.entryStrategy.type && "inline" !== opts.entryStrategy.type) {
      console.error(`forceFullBuild cannot be false with entryStrategy ${opts.entryStrategy.type}`);
      opts.forceFullBuild = true;
    }
    if (false === opts.forceFullBuild && !!updatedOpts.srcInputs) {
      console.error('forceFullBuild reassigned to "true" since "srcInputs" have been provided');
      opts.forceFullBuild = true;
    }
    Array.isArray(opts.srcInputs) ? opts.srcInputs.forEach((i => {
      i.path = normalizePath(path.resolve(opts.rootDir, i.path));
    })) : "string" === typeof opts.srcDir && (opts.srcDir = normalizePath(path.resolve(opts.rootDir, normalizePath(opts.srcDir))));
    Array.isArray(updatedOpts.input) ? opts.input = updatedOpts.input : "string" === typeof updatedOpts.input ? opts.input = [ updatedOpts.input ] : "ssr" === opts.target ? opts.input = [ path.resolve(srcDir, "entry.ssr.tsx") ] : "client" === opts.target ? opts.input = [ path.resolve(srcDir, "root.tsx") ] : "lib" === opts.target && (opts.input = [ path.resolve(srcDir, "index.ts") ]);
    opts.input = opts.input.map((input => normalizePath(path.resolve(opts.rootDir, input))));
    "string" === typeof updatedOpts.outDir ? opts.outDir = normalizePath(path.resolve(opts.rootDir, normalizePath(updatedOpts.outDir))) : "ssr" === opts.target ? opts.outDir = normalizePath(path.resolve(opts.rootDir, SSR_OUT_DIR)) : "lib" === opts.target ? opts.outDir = normalizePath(path.resolve(opts.rootDir, LIB_OUT_DIR)) : opts.outDir = normalizePath(path.resolve(opts.rootDir, CLIENT_OUT_DIR));
    "function" === typeof updatedOpts.manifestOutput && (opts.manifestOutput = updatedOpts.manifestOutput);
    const clientManifest = getValidManifest(updatedOpts.manifestInput);
    clientManifest && (opts.manifestInput = clientManifest);
    "function" === typeof updatedOpts.transformedModuleOutput && (opts.transformedModuleOutput = updatedOpts.transformedModuleOutput);
    opts.vendorRoots = updatedOpts.vendorRoots ? updatedOpts.vendorRoots : [];
    opts.scope = updatedOpts.scope ?? null;
    "boolean" === typeof updatedOpts.resolveQwikBuild && (opts.resolveQwikBuild = updatedOpts.resolveQwikBuild);
    return {
      ...opts
    };
  };
  let hasValidatedSource = false;
  const validateSource = async resolver => {
    if (!hasValidatedSource) {
      hasValidatedSource = true;
      const sys = getSys();
      if ("node" === sys.env) {
        const fs = await sys.dynamicImport("fs");
        if (!fs.existsSync(opts.rootDir)) {
          throw new Error(`Qwik rootDir "${opts.rootDir}" not found.`);
        }
        if ("string" === typeof opts.srcDir && !fs.existsSync(opts.srcDir)) {
          throw new Error(`Qwik srcDir "${opts.srcDir}" not found.`);
        }
        for (const alias in opts.input) {
          const input = opts.input[alias];
          const resolved = await resolver(input);
          if (!resolved) {
            throw new Error(`Qwik input "${input}" not found.`);
          }
        }
      }
    }
  };
  const buildStart = async _ctx => {
    log("buildStart()", opts.buildMode, opts.forceFullBuild ? "full build" : "isolated build", opts.scope);
    if (opts.forceFullBuild) {
      const optimizer = getOptimizer();
      const path = getPath();
      let srcDir = "/";
      if ("string" === typeof opts.srcDir) {
        srcDir = normalizePath(opts.srcDir);
        log("buildStart() srcDir", opts.srcDir);
      } else if (Array.isArray(opts.srcInputs)) {
        optimizer.sys.getInputFiles = async rootDir => opts.srcInputs.map((i => {
          const relInput = {
            path: normalizePath(path.relative(rootDir, i.path)),
            code: i.code
          };
          return relInput;
        }));
        log(`buildStart() opts.srcInputs (${opts.srcInputs.length})`);
      }
      const vendorRoots = opts.vendorRoots;
      vendorRoots.length > 0 && log("vendorRoots", vendorRoots);
      log("transformedOutput.clear()");
      transformedOutputs.clear();
      const mode = "lib" === opts.target ? "lib" : "development" === opts.buildMode ? "dev" : "prod";
      const transformOpts = {
        srcDir: srcDir,
        vendorRoots: vendorRoots,
        entryStrategy: opts.entryStrategy,
        minify: "simplify",
        transpile: true,
        explicitExtensions: true,
        mode: mode,
        scope: opts.scope ? opts.scope : void 0
      };
      const result = await optimizer.transformFs(transformOpts);
      for (const output of result.modules) {
        const key = normalizePath(path.join(srcDir, output.path));
        log("buildStart() add transformedOutput", key, output.hook?.displayName);
        transformedOutputs.set(key, [ output, key ]);
      }
      diagnosticsCallback(result.diagnostics, optimizer, srcDir);
      results.set("@buildStart", result);
    }
  };
  const resolveId = async (_ctx, id2, importer, _resolveIdOpts) => {
    const path = getPath();
    if ("lib" === opts.target && id2.startsWith(QWIK_CORE_ID)) {
      return {
        external: true,
        id: id2
      };
    }
    if (opts.resolveQwikBuild && id2 === QWIK_BUILD_ID) {
      log("resolveId()", "Resolved", QWIK_BUILD_ID);
      return {
        id: normalizePath(path.resolve(opts.rootDir, QWIK_BUILD_ID)),
        moduleSideEffects: false
      };
    }
    if (id2.endsWith(QWIK_CLIENT_MANIFEST_ID)) {
      log("resolveId()", "Resolved", QWIK_CLIENT_MANIFEST_ID);
      if ("lib" === opts.target) {
        return {
          id: id2,
          external: true,
          moduleSideEffects: false
        };
      }
      return {
        id: normalizePath(path.resolve(opts.input[0], QWIK_CLIENT_MANIFEST_ID)),
        moduleSideEffects: false
      };
    }
    const parsedId = parseId(id2);
    let importeePathId = normalizePath(parsedId.pathId);
    if (importer) {
      importer = normalizePath(importer);
      log(`resolveId("${importeePathId}", "${importer}")`);
      const parsedImporterId = parseId(importer);
      const dir = path.dirname(parsedImporterId.pathId);
      importeePathId = parsedImporterId.pathId.endsWith(".html") && !importeePathId.endsWith(".html") ? normalizePath(path.join(dir, importeePathId)) : normalizePath(path.resolve(dir, importeePathId));
    } else {
      log(`resolveId("${importeePathId}"), No importer`);
    }
    const tryImportPathIds = [ forceJSExtension(importeePathId, path.extname(importeePathId)) ];
    for (const tryId of tryImportPathIds) {
      const transformedOutput = transformedOutputs.get(tryId);
      if (transformedOutput) {
        log(`resolveId() Resolved ${tryId} from transformedOutputs`);
        return {
          id: tryId + parsedId.query,
          moduleSideEffects: false
        };
      }
      log(`resolveId() id ${tryId} not found in transformedOutputs`);
    }
    return null;
  };
  const load = async (_ctx, id2, loadOpts = {}) => {
    if (opts.resolveQwikBuild && id2.endsWith(QWIK_BUILD_ID)) {
      log("load()", QWIK_BUILD_ID, opts.buildMode);
      return {
        moduleSideEffects: false,
        code: getQwikBuildModule(loadOpts)
      };
    }
    if (id2.endsWith(QWIK_CLIENT_MANIFEST_ID)) {
      log("load()", QWIK_CLIENT_MANIFEST_ID, opts.buildMode);
      return {
        moduleSideEffects: false,
        code: await getQwikServerManifestModule(loadOpts)
      };
    }
    const parsedId = parseId(id2);
    const path = getPath();
    id2 = normalizePath(parsedId.pathId);
    opts.forceFullBuild && (id2 = forceJSExtension(id2, path.extname(id2)));
    const transformedModule = transformedOutputs.get(id2);
    if (transformedModule) {
      log("load()", "Found", id2);
      let code = transformedModule[0].code;
      "ssr" === opts.target && (code = code.replace(/@qwik-client-manifest/g, normalizePath(path.resolve(opts.input[0], QWIK_CLIENT_MANIFEST_ID))));
      return {
        code: code,
        map: transformedModule[0].map,
        moduleSideEffects: false
      };
    }
    log("load()", "Not Found", id2);
    return null;
  };
  const transform = function(ctx, code, id2) {
    if (opts.forceFullBuild) {
      return null;
    }
    const optimizer = getOptimizer();
    const path = getPath();
    const {pathId: pathId} = parseId(id2);
    const {ext: ext, dir: dir, base: base} = path.parse(pathId);
    const normalizedID = normalizePath(pathId);
    const pregenerated = transformedOutputs.get(normalizedID);
    if (pregenerated) {
      log("transform() pregenerated, addWatchFile", normalizedID, pregenerated[1]);
      addWatchFileCallback(ctx, pregenerated[1]);
      return {
        moduleSideEffects: false,
        meta: {
          hook: pregenerated[0].hook
        }
      };
    }
    if (TRANSFORM_EXTS[ext] || TRANSFORM_REGEX.test(pathId)) {
      log("transform()", "Transforming", pathId);
      let filePath = base;
      opts.srcDir && (filePath = path.relative(opts.srcDir, pathId));
      filePath = normalizePath(filePath);
      const srcDir = opts.srcDir ? opts.srcDir : normalizePath(dir);
      const mode = "development" === opts.buildMode ? "dev" : "prod";
      const newOutput = optimizer.transformModulesSync({
        input: [ {
          code: code,
          path: filePath
        } ],
        entryStrategy: opts.entryStrategy,
        minify: "simplify",
        sourceMaps: "development" === opts.buildMode,
        transpile: true,
        explicitExtensions: true,
        srcDir: srcDir,
        mode: mode,
        scope: opts.scope ? opts.scope : void 0
      });
      diagnosticsCallback(newOutput.diagnostics, optimizer, srcDir);
      results.set(normalizePath(pathId), newOutput);
      for (const [id3, output] of results.entries()) {
        const justChanged = newOutput === output;
        const dir2 = normalizePath(opts.srcDir || path.dirname(id3));
        for (const mod of output.modules) {
          if (mod.isEntry) {
            const key = normalizePath(path.join(dir2, mod.path));
            transformedOutputs.set(key, [ mod, id3 ]);
            log("transform()", "emitting", justChanged, key);
          }
        }
      }
      const module = newOutput.modules.find((m => !m.isEntry));
      return {
        code: module.code,
        map: module.map,
        moduleSideEffects: false,
        meta: {
          hook: module.hook
        }
      };
    }
    log("transform()", "No Transforming", id2);
    return null;
  };
  const createOutputAnalyzer = () => {
    const outputBundles = [];
    const injections = [];
    const addBundle = b => outputBundles.push(b);
    const addInjection = b => injections.push(b);
    const generateManifest = async () => {
      const optimizer = getOptimizer();
      const path = optimizer.sys.path;
      const hooks = Array.from(results.values()).flatMap((r => r.modules)).map((mod => mod.hook)).filter((h => !!h));
      const manifest = generateManifestFromBundles(path, hooks, injections, outputBundles, opts);
      for (const symbol of Object.values(manifest.symbols)) {
        symbol.origin && (symbol.origin = normalizePath(symbol.origin));
      }
      for (const bundle of Object.values(manifest.bundles)) {
        bundle.origins && (bundle.origins = bundle.origins.map((abs => {
          const relPath = path.relative(opts.rootDir, abs);
          return normalizePath(relPath);
        })).sort());
      }
      return manifest;
    };
    return {
      addBundle: addBundle,
      addInjection: addInjection,
      generateManifest: generateManifest
    };
  };
  const getOptions = () => opts;
  const getTransformedOutputs = () => Array.from(transformedOutputs.values()).map((t => t[0]));
  const log = (...str) => {
    opts.debug && console.debug(`[QWIK PLUGIN: ${id}]`, ...str);
  };
  const onAddWatchFile = cb => {
    addWatchFileCallback = cb;
  };
  const onDiagnostics = cb => {
    diagnosticsCallback = cb;
  };
  const normalizePath = id2 => {
    if ("string" === typeof id2) {
      const sys = getSys();
      if ("win32" === sys.os) {
        const isExtendedLengthPath = /^\\\\\?\\/.test(id2);
        if (!isExtendedLengthPath) {
          const hasNonAscii = /[^\u0000-\u0080]+/.test(id2);
          hasNonAscii || (id2 = id2.replace(/\\/g, "/"));
        }
        return sys.path.posix.normalize(id2);
      }
      return sys.path.normalize(id2);
    }
    return id2;
  };
  function getQwikBuildModule(loadOpts) {
    const isServer = "ssr" === opts.target || !!loadOpts.ssr;
    return `// @builder.io/qwik/build\nexport const isServer = ${JSON.stringify(isServer)};\nexport const isBrowser = ${JSON.stringify(!isServer)};\n`;
  }
  async function getQwikServerManifestModule(loadOpts) {
    const isServer = "ssr" === opts.target || !!loadOpts.ssr;
    const manifest = isServer ? opts.manifestInput : null;
    return `// @qwik-client-manifest\nexport const manifest = ${JSON.stringify(manifest)};\n`;
  }
  return {
    buildStart: buildStart,
    createOutputAnalyzer: createOutputAnalyzer,
    getQwikBuildModule: getQwikBuildModule,
    getOptimizer: getOptimizer,
    getOptions: getOptions,
    getPath: getPath,
    getSys: getSys,
    getTransformedOutputs: getTransformedOutputs,
    init: init,
    load: load,
    log: log,
    normalizeOptions: normalizeOptions,
    normalizePath: normalizePath,
    onAddWatchFile: onAddWatchFile,
    onDiagnostics: onDiagnostics,
    resolveId: resolveId,
    transform: transform,
    validateSource: validateSource
  };
}

function parseId(originalId) {
  const [pathId, query] = originalId.split("?");
  const queryStr = query || "";
  return {
    originalId: originalId,
    pathId: pathId,
    query: queryStr ? `?${query}` : "",
    params: new URLSearchParams(queryStr)
  };
}

function forceJSExtension(id, ext) {
  if ("" === ext) {
    return id + ".js";
  }
  if (TRANSFORM_EXTS[ext]) {
    return removeExtension(id) + ".js";
  }
  return id;
}

function removeExtension(id) {
  return id.split(".").slice(0, -1).join(".");
}

var TRANSFORM_EXTS = {
  ".jsx": true,
  ".ts": true,
  ".tsx": true
};

var TRANSFORM_REGEX = /\.qwik\.(m|c)?js$/;

var QWIK_CORE_ID = "@builder.io/qwik";

var QWIK_BUILD_ID = "@builder.io/qwik/build";

var QWIK_JSX_RUNTIME_ID = "@builder.io/qwik/jsx-runtime";

var QWIK_JSX_DEV_RUNTIME_ID = "@builder.io/qwik/jsx-dev-runtime";

var QWIK_CLIENT_MANIFEST_ID = "@qwik-client-manifest";

var SRC_DIR_DEFAULT = "src";

var CLIENT_OUT_DIR = "dist";

var SSR_OUT_DIR = "server";

var LIB_OUT_DIR = "lib";

var Q_MANIFEST_FILENAME = "q-manifest.json";

function qwikRollup(qwikRollupOpts = {}) {
  const qwikPlugin = createPlugin(qwikRollupOpts.optimizerOptions);
  const rollupPlugin = {
    name: "rollup-plugin-qwik",
    api: {
      getOptimizer: () => qwikPlugin.getOptimizer(),
      getOptions: () => qwikPlugin.getOptions()
    },
    async options(inputOpts) {
      await qwikPlugin.init();
      inputOpts.onwarn = (warning, warn) => {
        if ("typescript" === warning.plugin && warning.message.includes("outputToFilesystem")) {
          return;
        }
        warn(warning);
      };
      const pluginOpts = {
        target: qwikRollupOpts.target,
        buildMode: qwikRollupOpts.buildMode,
        debug: qwikRollupOpts.debug,
        forceFullBuild: qwikRollupOpts.forceFullBuild ?? true,
        entryStrategy: qwikRollupOpts.entryStrategy,
        rootDir: qwikRollupOpts.rootDir,
        srcDir: qwikRollupOpts.srcDir,
        srcInputs: qwikRollupOpts.srcInputs,
        input: inputOpts.input,
        resolveQwikBuild: true,
        manifestOutput: qwikRollupOpts.manifestOutput,
        manifestInput: qwikRollupOpts.manifestInput,
        transformedModuleOutput: qwikRollupOpts.transformedModuleOutput
      };
      const opts = qwikPlugin.normalizeOptions(pluginOpts);
      inputOpts.input || (inputOpts.input = opts.input);
      "ssr" === opts.target && (inputOpts.treeshake = false);
      return inputOpts;
    },
    outputOptions: rollupOutputOpts => normalizeRollupOutputOptions(qwikPlugin.getPath(), qwikPlugin.getOptions(), rollupOutputOpts),
    async buildStart() {
      qwikPlugin.onAddWatchFile(((ctx, path) => {
        ctx.addWatchFile(path);
      }));
      qwikPlugin.onDiagnostics(((diagnostics, optimizer, srcDir) => {
        diagnostics.forEach((d => {
          const id = qwikPlugin.normalizePath(optimizer.sys.path.join(srcDir, d.file));
          "error" === d.category ? this.error(createRollupError(id, d)) : this.warn(createRollupError(id, d));
        }));
      }));
      await qwikPlugin.buildStart(this);
    },
    resolveId(id, importer) {
      if (id.startsWith("\0")) {
        return null;
      }
      return qwikPlugin.resolveId(this, id, importer);
    },
    load(id) {
      if (id.startsWith("\0")) {
        return null;
      }
      return qwikPlugin.load(this, id);
    },
    transform(code, id) {
      if (id.startsWith("\0")) {
        return null;
      }
      return qwikPlugin.transform(this, code, id);
    },
    async generateBundle(_, rollupBundle) {
      const opts = qwikPlugin.getOptions();
      if ("client" === opts.target) {
        const outputAnalyzer = qwikPlugin.createOutputAnalyzer();
        for (const fileName in rollupBundle) {
          const b = rollupBundle[fileName];
          "chunk" === b.type && outputAnalyzer.addBundle({
            fileName: fileName,
            modules: b.modules,
            imports: b.imports,
            dynamicImports: b.dynamicImports,
            size: b.code.length
          });
        }
        const optimizer = qwikPlugin.getOptimizer();
        const manifest = await outputAnalyzer.generateManifest();
        manifest.platform = {
          ...versions,
          rollup: this.meta?.rollupVersion || "",
          env: optimizer.sys.env,
          os: optimizer.sys.os
        };
        "node" === optimizer.sys.env && (manifest.platform.node = process.versions.node);
        "function" === typeof opts.manifestOutput && await opts.manifestOutput(manifest);
        "function" === typeof opts.transformedModuleOutput && await opts.transformedModuleOutput(qwikPlugin.getTransformedOutputs());
        this.emitFile({
          type: "asset",
          fileName: Q_MANIFEST_FILENAME,
          source: JSON.stringify(manifest, null, 2)
        });
      }
    }
  };
  return rollupPlugin;
}

function normalizeRollupOutputOptions(path, opts, rollupOutputOpts) {
  const outputOpts = {
    ...rollupOutputOpts
  };
  if ("ssr" === opts.target) {
    outputOpts.inlineDynamicImports = true;
    "production" === opts.buildMode && (outputOpts.assetFileNames || (outputOpts.assetFileNames = "build/q-[hash].[ext]"));
  } else if ("client" === opts.target) {
    if ("production" === opts.buildMode) {
      outputOpts.entryFileNames || (outputOpts.entryFileNames = "build/q-[hash].js");
      outputOpts.assetFileNames || (outputOpts.assetFileNames = "build/q-[hash].[ext]");
      outputOpts.chunkFileNames || (outputOpts.chunkFileNames = "build/q-[hash].js");
    } else {
      outputOpts.entryFileNames || (outputOpts.entryFileNames = "build/[name].js");
      outputOpts.assetFileNames || (outputOpts.assetFileNames = "build/[name].[ext]");
      outputOpts.chunkFileNames || (outputOpts.chunkFileNames = "build/[name].js");
    }
  }
  "client" === opts.target && (outputOpts.format = "es");
  outputOpts.dir || (outputOpts.dir = opts.outDir);
  "cjs" === outputOpts.format && "string" !== typeof outputOpts.exports && (outputOpts.exports = "auto");
  return outputOpts;
}

function createRollupError(id, diagnostic) {
  const loc = diagnostic.highlights[0] ?? {};
  const err = Object.assign(new Error(diagnostic.message), {
    id: id,
    plugin: "qwik",
    loc: {
      column: loc.startCol,
      line: loc.startLine
    },
    stack: ""
  });
  return err;
}

var ERROR_HOST = '\n<script>\n/**\n * Usage:\n *\n *  <errored-host></errored-host>\n *\n */\nclass ErroredHost extends HTMLElement {\n  get _root() {\n    return this.shadowRoot || this;\n  }\n\n  constructor() {\n    super();\n    const self = this;\n\n    this.state = {};\n    if (!this.props) {\n      this.props = {};\n    }\n\n    this.componentProps = ["children", "error"];\n\n    // used to keep track of all nodes created by show/for\n    this.nodesToDestroy = [];\n    // batch updates\n    this.pendingUpdate = false;\n\n    this.attachShadow({ mode: "open" });\n  }\n\n  destroyAnyNodes() {\n    // destroy current view template refs before rendering again\n    this.nodesToDestroy.forEach((el) => el.remove());\n    this.nodesToDestroy = [];\n  }\n\n  connectedCallback() {\n    this.getAttributeNames().forEach((attr) => {\n      const jsVar = attr.replace(/-/g, "");\n      const regexp = new RegExp(jsVar, "i");\n      this.componentProps.forEach((prop) => {\n        if (regexp.test(prop)) {\n          const attrValue = this.getAttribute(attr);\n          if (this.props[prop] !== attrValue) {\n            this.props[prop] = attrValue;\n          }\n        }\n      });\n    });\n\n    this._root.innerHTML = `\n\n      <template data-el="show-errored-host">\n      <div class="error">\n        <template data-el="div-errored-host-2">\n          \x3c!-- String(props.error) --\x3e\n        </template>\n      </div>\n      </template>\n\n      <div class="arrow">👇 Uncaught error happened here 👇\n        <span class="dev-tools">DevTools: Cmd+Alt+I</span>\n      </div>\n      <div class="div">\n        <slot></slot>\n      </div>\n\n      <style>\n        .error {\n          border-radius: 5px 5px 0px 0;\n          background: black;\n          color: white;\n          font-family: monospace;\n          font-size: 12px;\n          margin: 0;\n          padding: 10px;\n        }\n        .arrow {\n          background: #f47e81;\n          color: black;\n          font-size: 14px;\n          padding: 10px;\n          text-align: center;\n          font-family: sans-serif;\n        }\n        .dev-tools {\n          background: red;\n          padding: 2px 5px;\n          border-radius: 3px;\n          font-weight: 800;\n        }\n        .div {\n          outline: 5px solid red;\n          border-radius: 10px;\n        }\n      </style>`;\n    this.pendingUpdate = true;\n\n    this.render();\n    this.onMount();\n    this.pendingUpdate = false;\n    this.update();\n  }\n\n  showContent(el) {\n    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content\n    // grabs the content of a node that is between <template> tags\n    // iterates through child nodes to register all content including text elements\n    // attaches the content after the template\n\n    const elementFragment = el.content.cloneNode(true);\n    const children = Array.from(elementFragment.childNodes);\n    children.forEach((child) => {\n      if (el?.scope) {\n        child.scope = el.scope;\n      }\n      if (el?.context) {\n        child.context = el.context;\n      }\n      this.nodesToDestroy.push(child);\n    });\n    el.after(elementFragment);\n  }\n\n  onMount() {}\n\n  onUpdate() {}\n\n  update() {\n    if (this.pendingUpdate === true) {\n      return;\n    }\n    this.pendingUpdate = true;\n    this.render();\n    this.onUpdate();\n    this.pendingUpdate = false;\n  }\n\n  render() {\n    // re-rendering needs to ensure that all nodes generated by for/show are refreshed\n    this.destroyAnyNodes();\n    this.updateBindings();\n  }\n\n  updateBindings() {\n    this._root\n      .querySelectorAll("[data-el=\'show-errored-host\']")\n      .forEach((el) => {\n        const whenCondition = this.props.error;\n        if (whenCondition) {\n          this.showContent(el);\n        }\n      });\n\n    this._root\n      .querySelectorAll("[data-el=\'div-errored-host-2\']")\n      .forEach((el) => {\n        this.renderTextNode(el, String(this.props.error));\n      });\n  }\n\n  // Helper to render content\n  renderTextNode(el, text) {\n    const textNode = document.createTextNode(text);\n    if (el?.scope) {\n      textNode.scope = el.scope;\n    }\n    if (el?.context) {\n      textNode.context = el.context;\n    }\n    el.after(textNode);\n    this.nodesToDestroy.push(el.nextSibling);\n  }\n}\n\ncustomElements.define("errored-host", ErroredHost);\n<\/script>\n';

async function formatError(sys, err) {
  if (!err.loc && !err.frame) {
    const loc = findLocation(err);
    if (loc) {
      err.loc = loc;
      if (loc.file) {
        const fs = await sys.dynamicImport("fs");
        const {normalizePath: normalizePath} = await sys.strictDynamicImport("vite");
        err.id = normalizePath(err.loc.file);
        try {
          const code = fs.readFileSync(err.loc.file, "utf-8");
          err.frame = generateCodeFrame(code, err.loc);
        } catch {}
      }
    }
  }
  return err;
}

var findLocation = e => {
  const stack = e.stack;
  if ("string" === typeof stack) {
    const lines = stack.split("\n");
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s+at/.test(line)) {
        const start = line.indexOf("(/") + 1;
        const end = line.indexOf(")", start);
        if (start > 0 && end > start) {
          const path = line.slice(start, end);
          const parts = path.split(":");
          const nu0 = safeParseInt(parts[parts.length - 1]);
          const nu1 = safeParseInt(parts[parts.length - 2]);
          if ("number" === typeof nu0 && "number" === typeof nu1) {
            parts.length -= 2;
            return {
              file: parts.join(":"),
              line: nu1,
              column: nu0
            };
          }
          if ("number" === typeof nu0) {
            parts.length -= 1;
            return {
              file: parts.join(":"),
              line: nu0,
              column: void 0
            };
          }
          return {
            file: parts.join(":"),
            line: void 0,
            column: void 0
          };
        }
      }
    }
  }
  return;
};

var safeParseInt = nu => {
  try {
    return parseInt(nu, 10);
  } catch {
    return;
  }
};

var splitRE = /\r?\n/;

var range = 2;

function posToNumber(source, pos) {
  if ("number" === typeof pos) {
    return pos;
  }
  const lines = source.split(splitRE);
  const {line: line, column: column} = pos;
  let start = 0;
  for (let i = 0; i < line - 1; i++) {
    lines[i] && (start += lines[i].length + 1);
  }
  return start + column;
}

function generateCodeFrame(source, start = 0, end) {
  start = posToNumber(source, start);
  end = end || start;
  const lines = source.split(splitRE);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) {
          continue;
        }
        const line = j + 1;
        res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        if (j === i) {
          const pad = Math.max(start - (count - lineLength) + 1, 0);
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push("   |  " + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push("   |  " + "^".repeat(length));
          }
          count += lineLength + 1;
        }
      }
      break;
    }
  }
  return res.join("\n");
}

async function configureDevServer(server, opts, sys, path, isClientDevOnly, clientDevInput) {
  if ("function" !== typeof fetch && "node" === sys.env) {
    try {
      if (!globalThis.fetch) {
        const nodeFetch = await sys.strictDynamicImport("node-fetch");
        global.fetch = nodeFetch;
        global.Headers = nodeFetch.Headers;
        global.Request = nodeFetch.Request;
        global.Response = nodeFetch.Response;
      }
    } catch {
      console.warn("Global fetch() was not installed");
    }
  }
  server.middlewares.use((async (req, res, next) => {
    try {
      const domain = "http://" + (req.headers.host ?? "localhost");
      const url = new URL(req.originalUrl, domain);
      if (shouldSsrRender(req, url)) {
        const envData = {
          ...res._qwikEnvData,
          url: url.href
        };
        const status = "number" === typeof res.statusCode ? res.statusCode : 200;
        if (isClientDevOnly) {
          const relPath = path.relative(opts.rootDir, clientDevInput);
          const entryUrl = "/" + relPath.replace(/\\/g, "/");
          let html = getViteDevIndexHtml(entryUrl, envData);
          html = await server.transformIndexHtml(url.pathname, html);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "no-cache, no-store, max-age=0");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("X-Powered-By", "Qwik Vite Dev Server");
          res.writeHead(status);
          res.end(html);
          return;
        }
        const ssrModule = await server.ssrLoadModule(opts.input[0], {
          fixStacktrace: false
        });
        const render = ssrModule.default ?? ssrModule.render;
        if ("function" === typeof render) {
          const manifest = {
            symbols: {},
            mapping: {},
            bundles: {},
            injections: [],
            version: "1"
          };
          Array.from(server.moduleGraph.fileToModulesMap.entries()).forEach((entry => {
            entry[1].forEach((v => {
              const hook = v.info?.meta?.hook;
              let url2 = v.url;
              v.lastHMRTimestamp && (url2 += `?t=${v.lastHMRTimestamp}`);
              hook && (manifest.mapping[hook.name] = url2);
              const {pathId: pathId, query: query} = parseId(v.url);
              "" === query && pathId.endsWith(".css") && manifest.injections.push({
                tag: "link",
                location: "head",
                attributes: {
                  rel: "stylesheet",
                  href: url2
                }
              });
            }));
          }));
          const renderOpts = {
            debug: true,
            stream: res,
            snapshot: !isClientDevOnly,
            manifest: isClientDevOnly ? void 0 : manifest,
            symbolMapper: isClientDevOnly ? void 0 : (symbolName, mapper) => {
              if (mapper) {
                const hash = getSymbolHash(symbolName);
                return mapper[hash];
              }
            },
            prefetchStrategy: null,
            envData: envData
          };
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "no-cache, no-store, max-age=0");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("X-Powered-By", "Qwik Vite Dev Server");
          res.writeHead(status);
          const result = await render(renderOpts);
          if ("html" in result) {
            res.write(END_SSR_SCRIPT);
            res.end(result.html);
          } else {
            res.write(END_SSR_SCRIPT);
            res.end();
          }
        } else {
          next();
        }
      } else {
        next();
      }
    } catch (e) {
      server.ssrFixStacktrace(e);
      e instanceof Error && await formatError(sys, e);
      next(e);
    }
  }));
}

async function configurePreviewServer(middlewares, opts, sys, path) {
  const fs = await sys.dynamicImport("fs");
  const url = await sys.dynamicImport("url");
  const entryPreviewPaths = [ "mjs", "cjs", "js" ].map((ext => path.join(opts.rootDir, "server", `entry.preview.${ext}`)));
  const entryPreviewModulePath = entryPreviewPaths.find((p => fs.existsSync(p)));
  if (!entryPreviewModulePath) {
    return invalidPreviewMessage(middlewares, 'Unable to find output "server/entry.preview" module.\n\nPlease ensure "src/entry.preview.tsx" has been built before the "preview" command.');
  }
  try {
    const entryPreviewImportPath = url.pathToFileURL(entryPreviewModulePath).href;
    const previewModuleImport = await sys.strictDynamicImport(entryPreviewImportPath);
    let previewMiddleware = null;
    let preview404Middleware = null;
    if (previewModuleImport.default) {
      if ("function" === typeof previewModuleImport.default) {
        previewMiddleware = previewModuleImport.default;
      } else if ("object" === typeof previewModuleImport.default) {
        previewMiddleware = previewModuleImport.default.router;
        preview404Middleware = previewModuleImport.default.notFound;
      }
    }
    if ("function" !== typeof previewMiddleware) {
      return invalidPreviewMessage(middlewares, `Entry preview module "${entryPreviewModulePath}" does not export a default middleware function`);
    }
    middlewares.use(previewMiddleware);
    "function" === typeof preview404Middleware && middlewares.use(preview404Middleware);
  } catch (e) {
    return invalidPreviewMessage(middlewares, String(e));
  }
}

function invalidPreviewMessage(middlewares, msg) {
  console.log(`\n❌ ${msg}\n`);
  middlewares.use(((_, res) => {
    res.writeHead(400, {
      "Content-Type": "text/plain"
    });
    res.end(msg);
  }));
}

var FS_PREFIX = "/@fs/";

var VALID_ID_PREFIX = "/@id/";

var VITE_PUBLIC_PATH = "/@vite/";

var internalPrefixes = [ FS_PREFIX, VALID_ID_PREFIX, VITE_PUBLIC_PATH ];

var InternalPrefixRE = new RegExp(`^(?:${internalPrefixes.join("|")})`);

var shouldSsrRender = (req, url) => {
  const pathname = url.pathname;
  if (/\.[\w?=&]+$/.test(pathname) && !pathname.endsWith(".html")) {
    return false;
  }
  if (pathname.includes("__vite_ping")) {
    return false;
  }
  if (pathname.includes("__open-in-editor")) {
    return false;
  }
  if (url.searchParams.has("html-proxy")) {
    return false;
  }
  if ("false" === url.searchParams.get("ssr")) {
    return false;
  }
  if (InternalPrefixRE.test(url.pathname)) {
    return false;
  }
  const acceptHeader = req.headers.accept || "";
  if (!acceptHeader.includes("text/html")) {
    return false;
  }
  return true;
};

var DEV_ERROR_HANDLING = "\n<script>\n\ndocument.addEventListener('qerror', ev => {\n  const ErrorOverlay = customElements.get('vite-error-overlay');\n  if (!ErrorOverlay) {\n    return;\n  }\n  const err = ev.detail.error;\n  const overlay = new ErrorOverlay(err);\n  document.body.appendChild(overlay);\n});\n<\/script>";

var PERF_WARNING = '\n<script>\nif (!window.__qwikViteLog) {\n  window.__qwikViteLog = true;\n  console.debug("%c⭐️ Qwik Dev SSR Mode","background: #0c75d2; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;","App is running in SSR development mode!\\n - Additional JS is loaded by Vite for debugging and live reloading\\n - Rendering performance might not be optimal\\n - Delayed interactivity because prefetching is disabled\\n - Vite dev bundles do not represent production output\\n\\nProduction build can be tested running \'npm run preview\'");\n}\n<\/script>';

var END_SSR_SCRIPT = `\n<script type="module" src="/@vite/client"><\/script>\n${DEV_ERROR_HANDLING}\n${ERROR_HOST}\n${PERF_WARNING}\n`;

function getViteDevIndexHtml(entryUrl, envData) {
  return `<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <script type="module">\n    async function main() {\n      const mod = await import("${entryUrl}?${VITE_DEV_CLIENT_QS}=");\n      if (mod.default) {\n        const envData = JSON.parse(${JSON.stringify(JSON.stringify(envData))})\n        mod.default({\n          envData,\n        });\n      }\n    }\n    main();\n    <\/script>\n    ${DEV_ERROR_HANDLING}\n  </body>\n</html>`;
}

var VITE_DEV_CLIENT_QS = "qwik-vite-dev-client";

var getSymbolHash = symbolName => {
  const index = symbolName.lastIndexOf("_");
  if (index > -1) {
    return symbolName.slice(index + 1);
  }
  return symbolName;
};

var QWIK_LOADER_DEFAULT_MINIFIED = '((e,t)=>{const n="__q_context__",o=window,a=new Set,i=t=>e.querySelectorAll(t),r=(e,t,n=t.type)=>{i("[on"+e+"\\\\:"+n+"]").forEach((o=>c(o,e,t,n)))},s=(e,t)=>new CustomEvent(e,{detail:t}),l=(t,n)=>(t=t.closest("[q\\\\:container]"),new URL(n,new URL(t.getAttribute("q:base"),e.baseURI))),c=async(t,o,a,i=a.type)=>{const r="on"+o+":"+i;t.hasAttribute("preventdefault:"+i)&&a.preventDefault();const s=t._qc_,c=null==s?void 0:s.li.filter((e=>e[0]===r));if(c&&c.length>0){for(const e of c)await e[1].getFn([t,a],(()=>t.isConnected))(a,t);return}const u=t.getAttribute(r);if(u)for(const o of u.split("\\n")){const i=l(t,o),r=d(i),s=performance.now(),c=b(await import(i.href.split("#")[0]))[r],u=e[n];if(t.isConnected)try{e[n]=[t,a,i],f("qsymbol",{symbol:r,element:t,reqTime:s}),await c(a,t)}finally{e[n]=u}}},f=(t,n)=>{e.dispatchEvent(s(t,n))},b=e=>Object.values(e).find(u)||e,u=e=>"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag],d=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",p=e=>e.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),v=async e=>{let t=p(e.type),n=e.target;for(r("-document",e,t);n&&n.getAttribute;)await c(n,"",e,t),n=e.bubbles&&!0!==e.cancelBubble?n.parentElement:null},w=e=>{r("-window",e,p(e.type))},y=()=>{var n;const r=e.readyState;if(!t&&("interactive"==r||"complete"==r)&&(t=1,f("qinit"),(null!=(n=o.requestIdleCallback)?n:o.setTimeout).bind(o)((()=>f("qidle"))),a.has("qvisible"))){const e=i("[on\\\\:qvisible]"),t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),c(n.target,"",s("qvisible",n)))}));e.forEach((e=>t.observe(e)))}},q=(e,t,n,o=!1)=>e.addEventListener(t,n,{capture:o}),g=t=>{for(const n of t)a.has(n)||(q(e,n,v,!0),q(o,n,w),a.add(n))};if(!e.qR){const t=o.qwikevents;Array.isArray(t)&&g(t),o.qwikevents={push:(...e)=>g(e)},q(e,"readystatechange",y),y()}})(document);';

var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    ((doc, hasInitialized) => {\n        const win = window;\n        const events =  new Set;\n        const querySelectorAll = query => doc.querySelectorAll(query);\n        const broadcast = (infix, ev, type = ev.type) => {\n            querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, ev, type)));\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element.getAttribute("q:base"), doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {\n            const attrName = "on" + onPrefix + ":" + eventName;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const ctx = element._qc_;\n            const qrls = null == ctx ? void 0 : ctx.li.filter((li => li[0] === attrName));\n            if (qrls && qrls.length > 0) {\n                for (const q of qrls) {\n                    await q[1].getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    const symbolName = getSymbolName(url);\n                    const reqTime = performance.now();\n                    const handler = findModule(await import(url.href.split("#")[0]))[symbolName];\n                    const previousCtx = doc.__q_context__;\n                    if (element.isConnected) {\n                        try {\n                            doc.__q_context__ = [ element, ev, url ];\n                            emitEvent("qsymbol", {\n                                symbol: symbolName,\n                                element: element,\n                                reqTime: reqTime\n                            });\n                            await handler(ev, element);\n                        } finally {\n                            doc.__q_context__ = previousCtx;\n                        }\n                    }\n                }\n            }\n        };\n        const emitEvent = (eventName, detail) => {\n            doc.dispatchEvent(createEvent(eventName, detail));\n        };\n        const findModule = module => Object.values(module).find(isModule) || module;\n        const isModule = module => "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const camelToKebab = str => str.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n        const processDocumentEvent = async ev => {\n            let type = camelToKebab(ev.type);\n            let element = ev.target;\n            broadcast("-document", ev, type);\n            while (element && element.getAttribute) {\n                await dispatch(element, "", ev, type);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev, camelToKebab(ev.type));\n        };\n        const processReadyStateChange = () => {\n            var _a;\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                emitEvent("qinit");\n                (null != (_a = win.requestIdleCallback) ? _a : win.setTimeout).bind(win)((() => emitEvent("qidle")));\n                if (events.has("qvisible")) {\n                    const results = querySelectorAll("[on\\\\:qvisible]");\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addEventListener = (el, eventName, handler, capture = !1) => el.addEventListener(eventName, handler, {\n            capture: capture\n        });\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    addEventListener(doc, eventName, processDocumentEvent, !0);\n                    addEventListener(win, eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            addEventListener(doc, "readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';

var DEDUPE = [ QWIK_CORE_ID, QWIK_JSX_RUNTIME_ID, QWIK_JSX_DEV_RUNTIME_ID ];

function qwikVite(qwikViteOpts = {}) {
  let isClientDevOnly = false;
  let clientDevInput;
  let tmpClientManifestPath;
  let viteCommand = "serve";
  const injections = [];
  const qwikPlugin = createPlugin(qwikViteOpts.optimizerOptions);
  const vitePlugin = {
    name: "vite-plugin-qwik",
    enforce: "pre",
    api: {
      getOptimizer: () => qwikPlugin.getOptimizer(),
      getOptions: () => qwikPlugin.getOptions()
    },
    async config(viteConfig, viteEnv) {
      await qwikPlugin.init();
      const sys = qwikPlugin.getSys();
      const path = qwikPlugin.getPath();
      qwikPlugin.log(`vite config(), command: ${viteEnv.command}, env.mode: ${viteEnv.mode}`);
      isClientDevOnly = "serve" === viteEnv.command && "ssr" !== viteEnv.mode;
      viteCommand = viteEnv.command;
      let target;
      target = viteConfig.build?.ssr || "ssr" === viteEnv.mode ? "ssr" : "lib" === viteEnv.mode ? "lib" : "client";
      let buildMode;
      buildMode = "production" === viteEnv.mode ? "production" : "development" === viteEnv.mode ? "development" : "build" === viteEnv.command && "client" === target ? "production" : "development";
      let forceFullBuild = true;
      if ("serve" === viteEnv.command) {
        qwikViteOpts.entryStrategy = {
          type: "hook"
        };
        forceFullBuild = false;
      } else {
        forceFullBuild = true;
      }
      const shouldFindVendors = "client" === target || "serve" === viteCommand;
      const vendorRoots = shouldFindVendors ? await findQwikRoots(sys, path.join(sys.cwd(), "package.json")) : [];
      const pluginOpts = {
        target: target,
        buildMode: buildMode,
        debug: qwikViteOpts.debug,
        entryStrategy: qwikViteOpts.entryStrategy,
        rootDir: viteConfig.root,
        resolveQwikBuild: "build" === viteEnv.command,
        transformedModuleOutput: qwikViteOpts.transformedModuleOutput,
        forceFullBuild: forceFullBuild,
        vendorRoots: vendorRoots.map((v => v.path))
      };
      "serve" === viteEnv.command && (qwikViteOpts.entryStrategy = {
        type: "hook"
      });
      if ("ssr" === target) {
        "string" === typeof viteConfig.build?.ssr ? pluginOpts.input = viteConfig.build.ssr : pluginOpts.input = qwikViteOpts.ssr?.input;
        pluginOpts.outDir = qwikViteOpts.ssr?.outDir;
        pluginOpts.manifestInput = qwikViteOpts.ssr?.manifestInput;
      } else if ("client" === target) {
        pluginOpts.input = qwikViteOpts.client?.input;
        pluginOpts.outDir = qwikViteOpts.client?.outDir;
        pluginOpts.manifestOutput = qwikViteOpts.client?.manifestOutput;
      } else {
        "object" === typeof viteConfig.build?.lib && (pluginOpts.input = viteConfig.build?.lib.entry);
        pluginOpts.outDir = viteConfig.build?.outDir;
      }
      if ("node" === sys.env) {
        const fs = await sys.dynamicImport("fs");
        try {
          const rootDir = pluginOpts.rootDir ?? sys.cwd();
          const packageJsonPath = sys.path.join(rootDir, "package.json");
          const pkgString = await fs.promises.readFile(packageJsonPath, "utf-8");
          try {
            const data = JSON.parse(pkgString);
            "string" === typeof data.name && (pluginOpts.scope = data.name);
          } catch (e) {
            console.error(e);
          }
        } catch (e) {}
        const nodeOs = await sys.dynamicImport("os");
        tmpClientManifestPath = path.join(nodeOs.tmpdir(), "vite-plugin-qwik-q-manifest.json");
        if ("ssr" === target && !pluginOpts.manifestInput) {
          try {
            const clientManifestStr = await fs.promises.readFile(tmpClientManifestPath, "utf-8");
            pluginOpts.manifestInput = JSON.parse(clientManifestStr);
          } catch (e) {}
        }
      }
      const opts = qwikPlugin.normalizeOptions(pluginOpts);
      globalThis.QWIK_MANIFEST = pluginOpts.manifestInput;
      globalThis.QWIK_CLIENT_OUT_DIR = qwikPlugin.normalizePath(sys.path.resolve(opts.rootDir, qwikViteOpts.client?.outDir || CLIENT_OUT_DIR));
      clientDevInput = "string" === typeof qwikViteOpts.client?.devInput ? path.resolve(opts.rootDir, qwikViteOpts.client.devInput) : opts.srcDir ? path.resolve(opts.srcDir, CLIENT_DEV_INPUT) : path.resolve(opts.rootDir, "src", CLIENT_DEV_INPUT);
      clientDevInput = qwikPlugin.normalizePath(clientDevInput);
      const vendorIds = vendorRoots.map((v => v.id));
      const updatedViteConfig = {
        resolve: {
          dedupe: [ ...DEDUPE, ...vendorIds ],
          conditions: []
        },
        esbuild: "development" !== opts.buildMode && {
          logLevel: "error",
          jsx: "preserve"
        },
        optimizeDeps: {
          exclude: [ "@vite/client", "@vite/env", QWIK_CORE_ID, QWIK_JSX_RUNTIME_ID, QWIK_JSX_DEV_RUNTIME_ID, QWIK_BUILD_ID, QWIK_CLIENT_MANIFEST_ID, ...vendorIds ]
        },
        build: {
          outDir: opts.outDir,
          rollupOptions: {
            input: opts.input,
            preserveEntrySignatures: "exports-only",
            output: normalizeRollupOutputOptions(path, opts, {}),
            treeshake: {
              moduleSideEffects: false
            },
            onwarn: (warning, warn) => {
              if ("typescript" === warning.plugin && warning.message.includes("outputToFilesystem")) {
                return;
              }
              warn(warning);
            }
          },
          polyfillModulePreload: false,
          dynamicImportVarsOptions: {
            exclude: [ /./ ]
          }
        }
      };
      if ("development" === buildMode) {
        globalThis.qDev = true;
        const qDevKey = "globalThis.qDev";
        updatedViteConfig.define = {
          [qDevKey]: viteConfig?.define?.[qDevKey] ?? true
        };
      }
      if ("ssr" === opts.target) {
        if ("serve" === viteCommand) {
          updatedViteConfig.ssr = {
            noExternal: vendorIds
          };
        } else {
          updatedViteConfig.publicDir = false;
          updatedViteConfig.build.ssr = true;
          "production" === buildMode && (updatedViteConfig.build.minify = "esbuild");
        }
        "boolean" === typeof viteConfig.build?.emptyOutDir ? updatedViteConfig.build.emptyOutDir = viteConfig.build.emptyOutDir : updatedViteConfig.build.emptyOutDir = false;
      } else if ("client" === opts.target) {
        "production" === buildMode && (updatedViteConfig.resolve.conditions = [ "min" ]);
        isClientDevOnly && (updatedViteConfig.build.rollupOptions.input = clientDevInput);
      } else {
        "lib" === opts.target && (updatedViteConfig.build.minify = false);
      }
      return updatedViteConfig;
    },
    async buildStart() {
      const resolver = this.resolve.bind(this);
      await qwikPlugin.validateSource(resolver);
      qwikPlugin.onAddWatchFile(((ctx, path) => {
        ctx.addWatchFile(path);
      }));
      qwikPlugin.onDiagnostics(((diagnostics, optimizer, srcDir) => {
        diagnostics.forEach((d => {
          const id = qwikPlugin.normalizePath(optimizer.sys.path.join(srcDir, d.file));
          "error" === d.category ? this.error(createRollupError(id, d)) : this.warn(createRollupError(id, d));
        }));
      }));
      await qwikPlugin.buildStart(this);
    },
    resolveId(id, importer, resolveIdOpts) {
      if (id.startsWith("\0")) {
        return null;
      }
      if (isClientDevOnly && id === VITE_CLIENT_MODULE) {
        return id;
      }
      return qwikPlugin.resolveId(this, id, importer, resolveIdOpts);
    },
    load(id, loadOpts) {
      if (id.startsWith("\0")) {
        return null;
      }
      id = qwikPlugin.normalizePath(id);
      const opts = qwikPlugin.getOptions();
      if (isClientDevOnly && id === VITE_CLIENT_MODULE) {
        return getViteDevModule(opts);
      }
      if ("serve" === viteCommand && id.endsWith(QWIK_CLIENT_MANIFEST_ID)) {
        return {
          code: "export const manifest = undefined;"
        };
      }
      return qwikPlugin.load(this, id, loadOpts);
    },
    transform(code, id) {
      if (id.startsWith("\0")) {
        return null;
      }
      if (isClientDevOnly) {
        const parsedId = parseId(id);
        parsedId.params.has(VITE_DEV_CLIENT_QS) && (code = updateEntryDev(code));
      }
      return qwikPlugin.transform(this, code, id);
    },
    async generateBundle(_, rollupBundle) {
      const opts = qwikPlugin.getOptions();
      if ("client" === opts.target) {
        const outputAnalyzer = qwikPlugin.createOutputAnalyzer();
        for (const fileName in rollupBundle) {
          const b = rollupBundle[fileName];
          "chunk" === b.type ? outputAnalyzer.addBundle({
            fileName: fileName,
            modules: b.modules,
            imports: b.imports,
            dynamicImports: b.dynamicImports,
            size: b.code.length
          }) : fileName.endsWith(".css") && injections.push({
            tag: "link",
            location: "head",
            attributes: {
              rel: "stylesheet",
              href: `/${fileName}`
            }
          });
        }
        for (const i of injections) {
          outputAnalyzer.addInjection(i);
        }
        const optimizer = qwikPlugin.getOptimizer();
        const manifest = await outputAnalyzer.generateManifest();
        manifest.platform = {
          ...versions,
          vite: "",
          rollup: this.meta?.rollupVersion || "",
          env: optimizer.sys.env,
          os: optimizer.sys.os
        };
        "node" === optimizer.sys.env && (manifest.platform.node = process.versions.node);
        const clientManifestStr = JSON.stringify(manifest, null, 2);
        this.emitFile({
          type: "asset",
          fileName: Q_MANIFEST_FILENAME,
          source: clientManifestStr
        });
        "function" === typeof opts.manifestOutput && await opts.manifestOutput(manifest);
        "function" === typeof opts.transformedModuleOutput && await opts.transformedModuleOutput(qwikPlugin.getTransformedOutputs());
        const sys = qwikPlugin.getSys();
        if (tmpClientManifestPath && "node" === sys.env) {
          const fs = await sys.dynamicImport("fs");
          await fs.promises.writeFile(tmpClientManifestPath, clientManifestStr);
        }
      }
    },
    async writeBundle(_, rollupBundle) {
      const opts = qwikPlugin.getOptions();
      if ("ssr" === opts.target) {
        const sys = qwikPlugin.getSys();
        if ("node" === sys.env) {
          const outputs = Object.keys(rollupBundle);
          const patchModuleFormat = async bundeName => {
            try {
              const bundleFileName = sys.path.basename(bundeName);
              const ext = sys.path.extname(bundleFileName);
              if (bundleFileName.startsWith("entry.") && !bundleFileName.includes("preview") && (".mjs" === ext || ".cjs" === ext)) {
                const extlessName = sys.path.basename(bundleFileName, ext);
                const js = `${extlessName}.js`;
                const moduleName = extlessName + ext;
                const hasJsScript = outputs.some((f => sys.path.basename(f) === js));
                if (!hasJsScript) {
                  const bundleOutDir = sys.path.dirname(bundeName);
                  const fs = await sys.dynamicImport("fs");
                  await fs.promises.writeFile(sys.path.join(opts.outDir, bundleOutDir, js), `import("./${moduleName}").catch((e) => { console.error(e); process.exit(1); });`);
                }
              }
            } catch (e) {
              console.error("patchModuleFormat", e);
            }
          };
          await Promise.all(outputs.map(patchModuleFormat));
        }
      }
    },
    async configureServer(server) {
      const opts = qwikPlugin.getOptions();
      const sys = qwikPlugin.getSys();
      const path = qwikPlugin.getPath();
      await configureDevServer(server, opts, sys, path, isClientDevOnly, clientDevInput);
    },
    configurePreviewServer: server => async () => {
      const opts = qwikPlugin.getOptions();
      const sys = qwikPlugin.getSys();
      const path = qwikPlugin.getPath();
      await configurePreviewServer(server.middlewares, opts, sys, path);
    },
    handleHotUpdate(ctx) {
      qwikPlugin.log("handleHotUpdate()", ctx);
      if (ctx.file.endsWith(".css")) {
        qwikPlugin.log("handleHotUpdate()", "force css reload");
        ctx.server.ws.send({
          type: "full-reload"
        });
        return [];
      }
    }
  };
  return vitePlugin;
}

function updateEntryDev(code) {
  code = code.replace(/("|')@builder.io\/qwik("|')/g, `'${VITE_CLIENT_MODULE}'`);
  return code;
}

function getViteDevModule(opts) {
  const qwikLoader = JSON.stringify(opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED);
  return `// Qwik Vite Dev Module\nimport { render as qwikRender } from '@builder.io/qwik';\n\nexport async function render(document, rootNode, opts) {\n\n  await qwikRender(document, rootNode, opts);\n\n  let qwikLoader = document.getElementById('qwikloader');\n  if (!qwikLoader) {\n    qwikLoader = document.createElement('script');\n    qwikLoader.id = 'qwikloader';\n    qwikLoader.innerHTML = ${qwikLoader};\n    const parent = document.head ?? document.body ?? document.documentElement;\n    parent.appendChild(qwikLoader);\n  }\n\n  if (!window.__qwikViteLog) {\n    window.__qwikViteLog = true;\n    console.debug("%c⭐️ Qwik Client Mode","background: #0c75d2; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;","Do not use this mode in production!\\n - No portion of the application is pre-rendered on the server\\n - All of the application is running eagerly in the browser\\n - Optimizer/Serialization/Deserialization code is not exercised!");\n  }\n}`;
}

var findQwikRoots = async (sys, packageJsonPath) => {
  if ("node" === sys.env) {
    const fs = await sys.dynamicImport("fs");
    const {resolvePackageData: resolvePackageData} = await sys.strictDynamicImport("vite");
    try {
      const data = await fs.promises.readFile(packageJsonPath, {
        encoding: "utf-8"
      });
      try {
        const packageJson = JSON.parse(data);
        const dependencies = packageJson.dependencies;
        const devDependencies = packageJson.devDependencies;
        const packages = [];
        "object" === typeof dependencies && packages.push(...Object.keys(dependencies));
        "object" === typeof devDependencies && packages.push(...Object.keys(devDependencies));
        const basedir = sys.cwd();
        const qwikDirs = packages.map((id => {
          const pkgData = resolvePackageData(id, basedir);
          if (pkgData) {
            const qwikPath = pkgData.data.qwik;
            if (qwikPath) {
              return {
                id: id,
                path: sys.path.resolve(pkgData.dir, qwikPath)
              };
            }
          }
        })).filter(isNotNullable);
        return qwikDirs;
      } catch (e) {
        console.error(e);
      }
    } catch (e) {}
  }
  return [];
};

var isNotNullable = v => null != v;

var VITE_CLIENT_MODULE = "@builder.io/qwik/vite-client";

var CLIENT_DEV_INPUT = "entry.dev.tsx";

export { createOptimizer, qwikRollup, qwikVite, versions };