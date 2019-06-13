"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = prefixNamespace;

var _logTips = _interopRequireDefault(require("log-tips"));

var _utils = require("./utils");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function prefix(obj, namespace, type) {
  return Object.keys(obj).reduce(function (memo, key) {
    (0, _logTips["default"])(key.indexOf("".concat(namespace).concat(_constants.NAMESPACE_SEP)) !== 0, "[prefixNamespace]: ".concat(type, " ").concat(key, " should not be prefixed with namespace ").concat(namespace), 'warn');
    var newKey = "".concat(namespace).concat(_constants.NAMESPACE_SEP).concat(key);
    memo[newKey] = obj[key];
    return memo;
  }, {});
}

function prefixNamespace(model) {
  var namespace = model.namespace,
      reducers = model.reducers,
      effects = model.effects;

  if (reducers) {
    if ((0, _utils.isArray)(reducers)) {
      model.reducers[0] = prefix(reducers[0], namespace, 'reducer');
    } else {
      model.reducers = prefix(reducers, namespace, 'reducer');
    }
  }

  if (effects) {
    model.effects = prefix(effects, namespace, 'effect');
  }

  return model;
}