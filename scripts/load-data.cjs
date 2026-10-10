const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
module.exports = function load(extra = {}) {
  const storage = new Map();
  const sandbox = {
    window: { dispatchEvent() {} },
    document: {
      querySelectorAll() {
        return [];
      },
    },
    CustomEvent: class {
      constructor(type, options) {
        this.type = type;
        this.detail = options && options.detail;
      }
    },
    localStorage: {
      getItem(key) {
        return storage.get(key) || null;
      },
      setItem(key, value) {
        storage.set(key, value);
      },
    },
    URLSearchParams,
    URL,
    location: {
      href: "http://localhost/pages/comparar.html",
      pathname: "/pages/comparar.html",
    },
    ...extra,
  };
  const context = vm.createContext(sandbox);
  for (const file of [
    "data/products.js",
    "data/catalog-2026.js",
    "js/products.js",
    "js/search.js",
    "js/recommendation.js",
    "js/comparison-model.js",
    "js/comparator.js",
  ])
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, {
      filename: file,
    });
  return {
    context,
    store: context.window.TechAlbum.store,
    comparator: context.window.TechAlbum.comparator,
    recommendation: context.window.TechAlbum.recommendation,
    data: context.window.TECHALBUM_DATA,
    storage,
  };
};
