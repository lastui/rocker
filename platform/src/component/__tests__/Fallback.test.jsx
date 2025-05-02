import { render, screen, cleanup, act } from "@testing-library/react";

import Fallback from "../Fallback";

describe("<Fallback />", () => {
  let requestAnimationFrameSpy;

  beforeEach(() => {
    jest.useFakeTimers();
    let time = 0;
    requestAnimationFrameSpy = jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      setTimeout(() => {
        time = time + 16;
        cb(time);
      }, 0);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    requestAnimationFrameSpy.mockRestore();
    cleanup();
  });

  it("does not render anything immediately", () => {
    const { unmount } = render(<Fallback children={() => <div data-testid="child-probe" />} />);

    expect(screen.queryByTestId("child-probe")).not.toBeInTheDocument();

    unmount();
  });

  it("render children after 1 second", () => {
    const { unmount } = render(<Fallback children={() => <div data-testid="child-probe" />} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("child-probe")).toBeInTheDocument();

    unmount();
  });

  it("should render immediate children", () => {
    const { unmount } = render(
      <Fallback>
        <div data-testid="child-probe" />
      </Fallback>,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByTestId("child-probe")).toBeInTheDocument();

    unmount();
  });
});
