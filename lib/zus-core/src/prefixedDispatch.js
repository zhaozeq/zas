"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = prefixedDispatch;

var _logTips = _interopRequireDefault(require("log-tips"));

var _constants = require("./constants");

var _prefixType = _interopRequireDefault(require("./prefixType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function prefixedDispatch(dispatch, model) {
  return function (action) {
    var type = action.type;
    (0, _logTips["default"])(type, 'dispatch: action should be a plain Object with type');
    (0, _logTips["default"])(type.indexOf("".concat(model.namespace).concat(_constants.NAMESPACE_SEP)) !== 0, "dispatch: ".concat(type, " should not be prefixed with namespace ").concat(model.namespace), 'warn');
    return dispatch(_objectSpread({}, action, {
      type: (0, _prefixType["default"])(type, model)
    }));
  };
}