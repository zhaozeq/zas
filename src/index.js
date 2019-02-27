import log, { isString, isNode } from 'log-tips';

const app = {};

app.start = start;

function start(container) {
  // 允许 container 是字符串，然后用 querySelector 找元素
  if (isString(container)) {
    container = document.querySelector(container);
    log(container, `container ${container} not found`);
  }

  // 并且是 HTMLElement
  invariant(!container || isNode(container), '[app.start] container should be HTMLElement');

  // 路由必须提前注册
  // invariant(
  //   app._router,
  //   `[app.start] router must be registered before app.start()`
  // )
  if (!app._store) {
    oldAppStart.call(app);
    console.log(app._store, 'app._store');
  }
  const store = app._store;

  app._getProvider = getProvider.bind(null, store, app);

  // If has container, render; else, return react component
  if (container) {
    render(container, store, app, app._router);
    app._plugin.apply('onHmr')(render.bind(null, container, store, app));
  } else {
    return getProvider(store, this, this._router);
  }
}
