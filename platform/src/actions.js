import * as C from './constants';

export const init = () =>
  ({
      type: C.INIT,
  })

export const setAvailableModules = (modules = []) =>
  ({
      type: C.SET_AVAILABLE_MODULES,
      payload: {
        modules,
      },
  })

export const setEntryPointModule = (entrypoint) =>
  ({
      type: C.SET_ENTRYPOINT_MODULE,
      payload: {
        entrypoint,
      },
  })

export const loadModule = (name) =>
  ({
      type: C.LOAD_MODULE,
      payload: {
        name,
      },
  })
