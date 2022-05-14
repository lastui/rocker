import React from "react";

import register from "../register";

describe("register", () => {
  beforeEach(() => {
    window.__SANDBOX_SCOPE__ = {};
  });

  afterEach(() => {
    delete window.__SANDBOX_SCOPE__;
  });

  it("is defined", () => {
    expect(register).toBeDefined();
  });

  it("is function", () => {
    expect(typeof register).toEqual("function");
  });

  it("falsy argument does nothing", () => {
    expect(() => register(0)).not.toThrow();
    expect(() => register()).not.toThrow();
    expect(() => register(null)).not.toThrow();
    expect(() => register(false)).not.toThrow();
  });

  it("object argument is accepted", () => {
    expect(() => register(new Object())).not.toThrow();
    expect(() => register({})).not.toThrow();
  });

  it("invalid argument is rejected", () => {
    expect(() => register(1)).toThrow("registerModule accepts only plain object");
    expect(() => register("1")).toThrow("registerModule accepts only plain object");
    expect(() => register([])).toThrow("registerModule accepts only plain object");
  });

  describe("BUILD_ID", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      register({ BUILD_ID: 1 });
      expect(spy).toHaveBeenCalledWith(`implicit attribute "BUILD_ID" provided in registerModule is not string`);
      expect(window.__SANDBOX_SCOPE__.BUILD_ID).not.toBeDefined();
    });

    it("accepts string", () => {
      register({ BUILD_ID: "2" });
      expect(window.__SANDBOX_SCOPE__.BUILD_ID).toEqual("2");
    });
  });

  describe("Main", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { Main: 1 };

      register(scope);
      expect(window.__SANDBOX_SCOPE__.Main).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute "Main" provided in registerModule is not function or React.Component`,
      );
    });

    it("accepts React Component", () => {
      class Main extends React.Component {
        render() {
          return <React.Fragment />;
        }
      }
      register({ Main });
      expect(window.__SANDBOX_SCOPE__.Main).toEqual(Main);
    });

    it("accepts function", () => {
      const Main = () => null;
      register({ Main });
      expect(window.__SANDBOX_SCOPE__.Main).toEqual(Main);
    });
  });

  describe("Error", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { Error: 1 };

      register(scope);
      expect(window.__SANDBOX_SCOPE__.Error).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute "Error" provided in registerModule is not function or React.Component`,
      );
    });

    it("accepts React Component", () => {
      class ErrorFallback extends React.Component {
        render() {
          return <React.Fragment />;
        }
      }
      register({ Error: ErrorFallback });
      expect(window.__SANDBOX_SCOPE__.Error).toEqual(ErrorFallback);
    });

    it("accepts function", () => {
      const ErrorFallback = () => null;
      register({ Error: ErrorFallback });
      expect(window.__SANDBOX_SCOPE__.Error).toEqual(ErrorFallback);
    });
  });

  describe("reducer", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { reducer: 1 };

      register(scope);
      expect(window.__SANDBOX_SCOPE__.reducer).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(`attribute \"reducer\" provided in registerModule is not plain object`);
    });

    it("accepts plain object", () => {
      const reducer = {
        a: 1,
      };
      register({ reducer });
      expect(window.__SANDBOX_SCOPE__.reducer).toEqual(reducer);
    });
  });

  describe("middleware", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { middleware: 1 };

      register(scope);
      expect(window.__SANDBOX_SCOPE__.middleware).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"middleware\" provided in registerModule is not function or async function`,
      );
    });

    it("accepts function", () => {
      const middleware = function (a) {};
      register({ middleware });
      expect(window.__SANDBOX_SCOPE__.middleware).toEqual(middleware);
    });

    it("accepts async function", () => {
      const middleware = async function (b) {};
      register({ middleware });
      expect(window.__SANDBOX_SCOPE__.middleware).toEqual(middleware);
    });

    it("does not accept generator function", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const middleware = function* (c) {};
      register({ middleware });
      expect(window.__SANDBOX_SCOPE__.middleware).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"middleware\" provided in registerModule is not function or async function`,
      );
    });

    it("does not accept async generator function", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const middleware = async function* (d) {};
      register({ middleware });
      expect(window.__SANDBOX_SCOPE__.middleware).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"middleware\" provided in registerModule is not function or async function`,
      );
    });
  });

  describe("saga", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { saga: 1 };

      register(scope);
      expect(window.__SANDBOX_SCOPE__.saga).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"saga\" provided in registerModule is not generator function or async generator function`,
      );
    });

    it("does not accept function", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const saga = function (a) {};
      register({ saga });
      expect(window.__SANDBOX_SCOPE__.saga).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"saga\" provided in registerModule is not generator function or async generator function`,
      );
    });

    it("does not accept async function", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const saga = async function (b) {};
      register({ saga });
      expect(window.__SANDBOX_SCOPE__.saga).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"saga\" provided in registerModule is not generator function or async generator function`,
      );
    });

    it("accepts generator function", () => {
      const saga = function* (c) {};
      register({ saga });
      expect(window.__SANDBOX_SCOPE__.saga).toEqual(saga);
    });

    it("accepts async generator function", () => {
      const saga = async function* (d) {};
      register({ saga });
      expect(window.__SANDBOX_SCOPE__.saga).toEqual(saga);
    });
  });

  describe("props", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { props: 1 };

      register(scope);
      expect(window.__SANDBOX_SCOPE__.props).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(`attribute \"props\" provided in registerModule is not plain object`);
    });

    it("accepts plain object", () => {
      const props = {
        a: 1,
      };
      register({ props });
      expect(window.__SANDBOX_SCOPE__.props).toEqual(props);
    });
  });
});