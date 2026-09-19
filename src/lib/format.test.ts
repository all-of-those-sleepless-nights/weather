import { describe, expect, it } from "vitest";
import { formatPlace, formatTemperature, formatTimestamp } from "./format";

describe("formatTimestamp", () => {
  it("renders as DD-MM-YYYY hh:mma, matching the mockup", () => {
    expect(formatTimestamp(new Date("2022-09-01T09:41:00Z"))).toBe(
      "01-09-2022 09:41am",
    );
  });

  it("uses 12-hour time in the afternoon", () => {
    expect(formatTimestamp(new Date("2022-09-01T14:05:00Z"))).toBe(
      "01-09-2022 02:05pm",
    );
  });

  it("handles the midnight and noon boundaries", () => {
    expect(formatTimestamp(new Date("2022-09-01T00:00:00Z"))).toBe(
      "01-09-2022 12:00am",
    );
    expect(formatTimestamp(new Date("2022-09-01T12:00:00Z"))).toBe(
      "01-09-2022 12:00pm",
    );
  });

  it("shows the time in the searched city, not the viewer's timezone", () => {
    // 01:41 UTC is 09:41 in Johor, which is UTC+8.
    const eightHours = 8 * 60 * 60;

    expect(
      formatTimestamp(new Date("2022-09-01T01:41:00Z"), eightHours),
    ).toBe("01-09-2022 09:41am");
  });

  it("rolls the date over when the offset crosses midnight", () => {
    expect(
      formatTimestamp(new Date("2022-09-01T20:00:00Z"), 8 * 60 * 60),
    ).toBe("02-09-2022 04:00am");
  });
});

describe("formatTemperature", () => {
  it("rounds to whole degrees", () => {
    expect(formatTemperature(26.4)).toBe("26°");
    expect(formatTemperature(28.6)).toBe("29°");
    expect(formatTemperature(-0.4)).toBe("0°");
  });
});

describe("formatPlace", () => {
  it("joins city and country code", () => {
    expect(formatPlace("Johor", "MY")).toBe("Johor, MY");
  });
});
