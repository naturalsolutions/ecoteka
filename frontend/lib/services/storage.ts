import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { tokenStorage, refreshTokenStorage } = publicRuntimeConfig;

const LocalStorageService = (function () {
  var _service: any;
  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }
  function _setAccessToken(token: string) {
    localStorage.setItem(tokenStorage, token);
  }
  function _setRefreshToken(token: string) {
    localStorage.setItem(refreshTokenStorage, token);
  }
  function _getAccessToken() {
    return localStorage.getItem(tokenStorage);
  }
  function _getRefreshToken() {
    return localStorage.getItem(refreshTokenStorage);
  }
  function _clearToken() {
    localStorage.removeItem(tokenStorage);
    localStorage.removeItem(refreshTokenStorage);
  }
  return {
    getService: _getService,
    setAccessToken: _setAccessToken,
    setRefreshToken: _setRefreshToken,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
  };
})();
export default LocalStorageService;
