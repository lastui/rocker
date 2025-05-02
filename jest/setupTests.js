import matchers from "@testing-library/jest-dom/matchers";
import { TextEncoder, TextDecoder } from "util";
import "whatwg-fetch";

global.IS_REACT_ACT_ENVIRONMENT = true;

Object.assign(global, { TextDecoder, TextEncoder });

global.expect.extend(matchers);

top.document.timeline = { currentTime: 0 };

jest.mock("@linaria/react", () => {
  function styled(tag) {
    return jest.fn(() => tag);
  }
  return {
    styled: new Proxy(styled, {
      get(ref, prop) {
        return ref(prop);
      },
    }),
  };
});

jest.mock("@linaria/core", () => ({
  css: jest.fn(() => ""),
}));
