/* c8 ignore start */
import * as constants from "../../constants";

const initialState = {};
/* c8 ignore stop */

function createView(globalShared, localShared) {
  const result = {};
  for (const key in globalShared) {
    result[key] = globalShared[key];
  }
  for (const key in localShared) {
    if (localShared[key][0].data === undefined) {
      continue;
    }
    result[key] = localShared[key][0].data;
  }
  return result;
}

function createSharedReducer() {
  const localShared = {};
  const globalShared = {};

  return (state = initialState, action) => {
    switch (action.type) {
      case constants.CLEAR_SHARED: {
        for (let key in localShared) {
          delete localShared[key];
        }
        for (let key in globalShared) {
          delete globalShared[key];
        }
        return {};
      }
      case constants.SET_SHARED: {
        if (!action.payload.module) {
          for (const key in action.payload.data) {
            if (action.payload.data[key] === undefined) {
              delete globalShared[key];
            } else {
              globalShared[key] = action.payload.data[key];
            }
          }

          return createView(globalShared, localShared);
        }

        if (typeof action.payload.module !== "string" || !action.payload.data || action.payload.data.constructor !== Object) {
          return state;
        }

        let changed = false;

        for (const key in action.payload.data) {
          changed = true;
          if (key in localShared) {
            let index = -1;
            for (let i = 0; i < localShared[key].length; i++) {
              if (localShared[key][i].module === action.payload.module) {
                index = i;
                break;
              }
            }

            if (index === -1) {
              localShared[key].unshift({ data: action.payload.data[key], module: action.payload.module });
            } else {
              const item = localShared[key].splice(index, 1);
              item.data = action.payload.data[key];
              localShared[key].unshift(item);
            }
          } else {
            localShared[key] = [{ data: action.payload.data[key], module: action.payload.module }];
          }
        }

        if (!changed) {
          return state;
        }

        return createView(globalShared, localShared);
      }
      case constants.MODULE_UNLOADED: {
        let changed = false;

        for (const key in localShared) {
          let index = -1;
          for (let i = 0; i < localShared[key].length; i++) {
            if (localShared[key][i].module === action.payload.module) {
              index = i;
              break;
            }
          }

          if (index === -1) {
            continue;
          }

          changed = true;

          if (localShared[key].length === 1) {
            delete localShared[key];
          } else {
            const stop = localShared[key].length - 1;
            while (index < stop) {
              localShared[key][index] = localShared[key][++index];
            }
            localShared[key].pop();
          }
        }

        if (!changed) {
          return state;
        }

        return createView(globalShared, localShared);
      }
      default: {
        return state;
      }
    }
  };
}

/* c8 ignore start */
export { initialState };

export default createSharedReducer();
/* c8 ignore stop */