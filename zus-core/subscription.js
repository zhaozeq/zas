import log, { isFn } from 'log-tips'
import prefixedDispatch from './prefixedDispatch'

export function run(subs, model, app, onError) {
  const funcs = []
  const nonFuncs = []
  for (const key in subs) {
    if (Object.prototype.hasOwnProperty.call(subs, key)) {
      const sub = subs[key]
      const unlistener = sub(
        {
          dispatch: prefixedDispatch(app._store.dispatch, model),
          history: app._history
        },
        onError
      )
      if (isFn(unlistener)) {
        funcs.push(unlistener)
      } else {
        nonFuncs.push(key)
      }
    }
  }
  return { funcs, nonFuncs }
}

export function unlisten(unlisteners, namespace) {
  if (!unlisteners[namespace]) return

  const { funcs, nonFuncs } = unlisteners[namespace]
  log(
    nonFuncs.length === 0,
    `[app.unmodel] subscription should return unlistener function, check these subscriptions ${nonFuncs.join(
      ', '
    )}`,
    'warn'
  )
  for (const unlistener of funcs) {
    unlistener()
  }
  delete unlisteners[namespace]
}
