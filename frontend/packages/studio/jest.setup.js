import "@testing-library/jest-dom/extend-expect";
import { setConfig } from "next/config";
import config from "./next.config";
import axios from "axios";
axios.defaults.adapter = require("axios/lib/adapters/http");

config.publicRuntimeConfig.apiUrl = "http://backend";

setConfig(config);

const localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
