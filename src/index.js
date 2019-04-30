import React from 'react'
import log, { isString, isNode, isFn } from 'log-tips'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import dynamic from './dynamic'
import createZus from './zus-core/src'

function zus(opts = {}) {
  const app = createZus(opts, {})
  const oldAppStart = app.start
  app.router = router
  app.start = start
  return app

  function router(_router) {
    log(
      isFn(_router),
      `[app.router] router should be function, but got ${typeof _router}`
    )
    app._router = _router
  }
  function start(container) {
    // 允许 container 是字符串，然后用 querySelector 找元素
    if (isString(container)) {
      container = document.querySelector(container)
      log(container, `[app.start] container ${container} not found`)
    }

    // 并且是 HTMLElement
    log(
      !container || isNode(container),
      '[app.start] container should be HTMLElement'
    )

    // 路由必须提前注册
    log(app._router, '[app.start] router must be registered before app.start()')
    if (!app._store) {
      oldAppStart.call(app)
    }
    const store = app._store

    app._getProvider = getProvider.bind(null, store, app)

    // If has container, render; else, return react component
    if (container) {
      render(container, store, app, app._router)
      app._plugin.apply('onHmr')(render.bind(null, container, store, app))
      return false
    }
    return getProvider(store, this, this._router)
  }
}

function getProvider(store, app, router) {
  const DvaRoot = extraProps => (
    <Provider store={store}>{router({ app, ...extraProps })}</Provider>
  )
  return DvaRoot
}

function render(container, store, app, router) {
  ReactDOM.render(
    React.createElement(getProvider(store, app, router)),
    container
  )
}

export { zus as default, dynamic }
