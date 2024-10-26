import {
  GildedRose,
  Item,
  QualityNegativeError,
  QualityValueExceeded,
} from "@/gilded-rose";

describe("Gilded Rose", () => {
  it("New item quality cannot be zero", () => {
    expect(() => new GildedRose([new Item("foo", 0, -1)])).toThrow(
      QualityNegativeError
    );
  });
  it("New item quality cannot be bigger than 50", () => {
    expect(() => new GildedRose([new Item("foo", 0, 52)])).toThrow(
      QualityValueExceeded
    );
  });
});
