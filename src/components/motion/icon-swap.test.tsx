import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { IconSwap } from "./icon-swap";

/**
 * The suite runs with `prefers-reduced-motion: reduce` (see src/test/setup.ts),
 * so these assertions cover the branch that most needs protecting: the one
 * where the animation is skipped entirely and the icon must still be there.
 */
describe("IconSwap", () => {
  it("renders the current icon", () => {
    render(
      <IconSwap swapKey="idle">
        <span data-testid="icon">search</span>
      </IconSwap>,
    );

    expect(screen.getByTestId("icon")).toHaveTextContent("search");
  });

  it("leaves exactly one icon behind after a swap", () => {
    const { rerender } = render(
      <IconSwap swapKey="idle">
        <span data-testid="icon">search</span>
      </IconSwap>,
    );

    rerender(
      <IconSwap swapKey="busy">
        <span data-testid="icon">loading</span>
      </IconSwap>,
    );

    expect(screen.getByTestId("icon")).toHaveTextContent("loading");
  });

  it("keeps the caller's box classes on the wrapper", () => {
    render(
      <IconSwap swapKey="idle" className="size-5">
        <span data-testid="icon">search</span>
      </IconSwap>,
    );

    expect(screen.getByTestId("icon").parentElement).toHaveClass("size-5");
  });
});
