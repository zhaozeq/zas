import { createStore, applyMiddleware, compose } from 'redux'
import log from 'log-tips'
import window from 'global/window'
import { returnSelf } from './utils'

export default ({
  reducers,
  initialState,
  plugin,
  sagaMiddleware,
  promiseMiddleware,
  createOpts: { setupMiddlewares = returnSelf }
}) => {
  // extra enhancers
  const extraEnhancers = plugin.get('extraEnhancers')
  log(
    Array.isArray(extraEnhancers),
    `[app.start] extraEnhancers should be array, but got ${typeof extraEnhancers}`
  )

  const extraMiddlewares = plugin.get('onAction')
  const middlewares = setupMiddlewares([
    promiseMiddleware,
    sagaMiddleware,
    extraMiddlewares.flat()
  ])

  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose

  const enhancers = [applyMiddleware(...middlewares), ...extraEnhancers]

  return createStore(reducers, initialState, composeEnhancers(...enhancers))
}