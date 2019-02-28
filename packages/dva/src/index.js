import React from 'react';
import log, { isString, isNode, isFn } from 'log-tips';
import createHashHistory from 'history/createHashHistory';
import { routerMiddleware, routerReducer as routing } from 'react-router-redux';
import { Provider } from 'react-redux';
import * as core from '../../zus-core/src/index';

export default function (opts = {}) {
  const history = opts.history || createHashHistory();
  const createOpts = {
    initialReducer: {
      routing,
    },
    setupMiddlewares(middlewares) {
      return [routerMiddleware(history), ...middlewares];
    },
    setupApp(app) {
      console.log('setupApp', app);
      app._history = patchHistory(history);
    },
  };

  const app = core.create(opts, createOpts);
  const oldAppStart = app.start;
  app.router = router;
  app.start = start;
  return app;

  function router(_router) {
    log(isFn(_router), `[app.router] router should be function, but got ${typeof _router}`);
    app._router = _router;
  }

  function start(container) {
    // 允许 container 是字符串，然后用 querySelector 找元素
    if (isString(container)) {
      container = document.querySelector(container);
      log(container, `[app.start] container ${container} not found`);
    }

    // 并且是 HTMLElement
    log(!container || isNode(container), '[app.start] container should be HTMLElement');

    // 路由必须提前注册
    log(app._router, '[app.start] router must be registered before app.start()');
    if (!app._store) {
      oldAppStart.call(app);
      console.log(app._store, 'app._store');
    }
    const store = app._store;

    // export _getProvider for HMR
    // ref: https://github.com/dvajs/dva/issues/469
    app._getProvider = getProvider.bind(null, store, app);

    // If has container, render; else, return react component
    if (container) {
      render(container, store, app, app._router);
      app._plugin.apply('onHmr')(render.bind(null, container, store, app));
    } else {
      return getProvider(store, this, this._router);
    }
  }
}

function getProvider(store, app, router) {
  const DvaRoot = extraProps => (
    <Provider store={store}>{router({ app, history: app._history, ...extraProps })}</Provider>
  );
  return DvaRoot;
}

function render(container, store, app, router) {
  const ReactDOM = require('react-dom'); // eslint-disable-line
  ReactDOM.render(React.createElement(getProvider(store, app, router)), container);
}

function patchHistory(history) {
  const oldListen = history.listen;
  history.listen = callback => {
    callback(history.location);
    return oldListen.call(history, callback);
  };
  return history;
}
