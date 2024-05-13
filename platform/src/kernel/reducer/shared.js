import * as constants from "../../constants";

export const initialState = {
  global: {},
  local: {},
  view: {},
};

function createView(state) {
  const result = {
    ...state.global,
  };
  for (const key in state.local) {
    result[key] = state.local[key][0].data;
  }
  for (const key in result) {
    if (result[key] === undefined) {
      delete result[key];
    }
  }
  return result;
}

function createSharedReducer() {
  return (state = initialState, action) => {
    switch (action.type) {
      case constants.CLEAR_SHARED: {
        return {
          ...initialState,
        };
      }
      case constants.SET_SHARED: {
        if (!action.payload.module) {
          const nextState = {
            global: {
              ...state.global,
              ...action.payload.data,
            },
            local: state.local,
          };

          return {
            global: nextState.global,
            local: nextState.local,
            view: createView(nextState),
          };
        }

        if (typeof action.payload.module !== "string" || action.payload.data.constructor !== Object) {
          return state;
        }

        let nextState = {
          global: state.global,
          local: state.local,
        };

        nextState.local = { ...state.local };
        const now = Date.now();

        for (const key in action.payload.data) {
          if (!nextState.local[key]) {
            nextState.local[key] = [{ ts: now, data: action.payload.data[key], module: action.payload.module }];
          } else {
            let index = -1;
            for (let i = 0; i < nextState.local[key].length; i++) {
              if (nextState.local[key][i].module === action.payload.module) {
                index = i;
                break;
              }
            }

            if (index === -1) {
              nextState.local[key].push({ ts: now, data: action.payload.data[key], module: action.payload.module });
            } else {
              nextState.local[key][index].ts = now;
              nextState.local[key][index].data = action.payload.data[key];
            }

            nextState.local[key].sort((a, b) => b.ts - a.ts);
          }
        }

        return {
          global: nextState.global,
          local: nextState.local,
          view: createView(nextState),
        };
      }
      case constants.MODULE_UNLOADED: {
        let changed = false;

        const nextState = {
          local: { ...state.local },
          global: state.global,
        };

        for (const key in nextState.local) {
          let index = -1;
          for (let i = 0; i < nextState.local[key].length; i++) {
            if (nextState.local[key][i].module === action.payload.module) {
              index = i;
              break;
            }
          }

          if (index === -1) {
            continue;
          }

          changed = true;

          nextState.local[key][index] = nextState.local[key][nextState.local[key].length - 1];
          nextState.local[key].pop();
          if (nextState.local[key].length === 0) {
            delete nextState.local[key];
          } else {
            nextState.local[key].sort((a, b) => b.ts - a.ts);
          }
        }

        if (!changed) {
          return state;
        }

        return {
          global: nextState.global,
          local: nextState.local,
          view: createView(nextState),
        };
      }
      default: {
        return state;
      }
    }
  };
}

export default createSharedReducer();
