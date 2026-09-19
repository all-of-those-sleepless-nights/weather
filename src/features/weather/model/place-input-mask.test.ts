import { describe, expect, it } from "vitest";
import { maskPlaceInput } from "./place-input-mask";

describe("maskPlaceInput", () => {
  it("leaves a well-formed entry alone", () => {
    expect(maskPlaceInput("Kuala Lumpur, Malaysia")).toBe(
      "Kuala Lumpur, Malaysia",
    );
  });

  it("turns any character that cannot be in a place name into the separator", () => {
    expect(maskPlaceInput("Johor/MY")).toBe("Johor,MY");
    expect(maskPlaceInput("Johor;MY")).toBe("Johor,MY");
    expect(maskPlaceInput("Johor|MY")).toBe("Johor,MY");
  });

  it("keeps only the first separator", () => {
    expect(maskPlaceInput("Johor,MY,extra")).toBe("Johor,MYextra");
    expect(maskPlaceInput("a;b;c;d")).toBe("a,bcd");
  });

  it("preserves the punctuation real place names carry", () => {
    expect(maskPlaceInput("Stratford-upon-Avon")).toBe("Stratford-upon-Avon");
    expect(maskPlaceInput("L'Aquila")).toBe("L'Aquila");
    expect(maskPlaceInput("St. Louis")).toBe("St. Louis");
    expect(maskPlaceInput("Ōsaka")).toBe("Ōsaka");
  });

  it("is prefix-stable, which is what keeps the caret in place", () => {
    const typed = "Johor;MY";
    for (let cut = 0; cut <= typed.length; cut++) {
      expect(maskPlaceInput(typed).startsWith(maskPlaceInput(typed.slice(0, cut)))).toBe(true);
    }
  });
});
