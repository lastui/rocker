import React from "react";

import register from "../register";

describe("register", () => {
  beforeEach(() => {
    top.__SANDBOX_SCOPE__ = {};
  });

  afterEach(() => {
    delete top.__SANDBOX_SCOPE__;
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
      expect(top.__SANDBOX_SCOPE__.BUILD_ID).not.toBeDefined();
    });

    it("accepts string", () => {
      register({ BUILD_ID: "2" });
      expect(top.__SANDBOX_SCOPE__.BUILD_ID).toEqual("2");
    });
  });

  describe("component", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { component: 1 };

      register(scope);
      expect(top.__SANDBOX_SCOPE__.component).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(`attribute "component" provided in registerModule is not function or React.Component`);
    });

    it("accepts React Component", () => {
      class ClassComponent extends React.Component {
        render() {
          return <React.Fragment />;
        }
      }
      register({ component: ClassComponent });
      expect(top.__SANDBOX_SCOPE__.component).toEqual(ClassComponent);
    });

    it("accepts function", () => {
      const functionComponent = () => null;
      register({ component: functionComponent });
      expect(top.__SANDBOX_SCOPE__.component).toEqual(functionComponent);
    });
  });

  describe("fallback", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { fallback: 1 };

      register(scope);
      expect(top.__SANDBOX_SCOPE__.fallback).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(`attribute "fallback" provided in registerModule is not function or React.Component`);
    });

    it("accepts React Component", () => {
      class ClassFallback extends React.Component {
        render() {
          return <React.Fragment />;
        }
      }
      register({ fallback: ClassFallback });
      expect(top.__SANDBOX_SCOPE__.fallback).toEqual(ClassFallback);
    });

    it("accepts function", () => {
      const functionFallback = () => null;
      register({ fallback: functionFallback });
      expect(top.__SANDBOX_SCOPE__.fallback).toEqual(functionFallback);
    });
  });

  describe("reducers", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      register({ reducers: 1 });
      expect(top.__SANDBOX_SCOPE__.reducers).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(`attribute \"reducers\" provided in registerModule is not plain object`);
    });

    it("accepts plain object", () => {
      const reducers = {
        a: 1,
      };
      register({ reducers });
      expect(top.__SANDBOX_SCOPE__.reducers).toEqual(reducers);
    });
  });

  describe("middleware", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { middleware: 1 };

      register(scope);
      expect(top.__SANDBOX_SCOPE__.middleware).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"middleware\" provided in registerModule is not function or async function`,
      );
    });

    it("accepts function", () => {
      const middleware = function () {};
      register({ middleware });
      expect(top.__SANDBOX_SCOPE__.middleware).toEqual(middleware);
    });

    it("accepts async function", () => {
      const middleware = async function () {};
      register({ middleware });
      expect(top.__SANDBOX_SCOPE__.middleware).toEqual(middleware);
    });

    it("does not accept generator function", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const middleware = function* () {};
      register({ middleware });
      expect(top.__SANDBOX_SCOPE__.middleware).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"middleware\" provided in registerModule is not function or async function`,
      );
    });

    it("does not accept async generator function", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const middleware = async function* () {};
      register({ middleware });
      expect(top.__SANDBOX_SCOPE__.middleware).not.toBeDefined();
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
      expect(top.__SANDBOX_SCOPE__.saga).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"saga\" provided in registerModule is not generator function or async generator function`,
      );
    });

    it("does not accept function", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const saga = function () {};
      register({ saga });
      expect(top.__SANDBOX_SCOPE__.saga).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"saga\" provided in registerModule is not generator function or async generator function`,
      );
    });

    it("does not accept async function", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});

      const saga = async function () {};
      register({ saga });
      expect(top.__SANDBOX_SCOPE__.saga).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(
        `attribute \"saga\" provided in registerModule is not generator function or async generator function`,
      );
    });

    it("accepts generator function", () => {
      const saga = function* () {};
      register({ saga });
      expect(top.__SANDBOX_SCOPE__.saga).toEqual(saga);
    });

    it("accepts async generator function", () => {
      const saga = async function* () {};
      register({ saga });
      expect(top.__SANDBOX_SCOPE__.saga).toEqual(saga);
    });
  });

  describe("props", () => {
    it("does not accept invalid type", () => {
      const spy = jest.spyOn(console, "error");
      spy.mockImplementation(() => {});
      const scope = { props: 1 };

      register(scope);
      expect(top.__SANDBOX_SCOPE__.props).not.toBeDefined();
      expect(spy).toHaveBeenLastCalledWith(`attribute \"props\" provided in registerModule is not plain object`);
    });

    it("accepts plain object", () => {
      const props = {
        a: 1,
      };
      register({ props });
      expect(top.__SANDBOX_SCOPE__.props).toEqual(props);
    });
  });
});
