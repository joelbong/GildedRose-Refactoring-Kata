import {
  GildedRose,
  Item,
  QualitySubceeded,
  QualityValueExceeded,
} from "@/gilded-rose";

describe("Gilded Rose - New item quality", () => {
  it("All items quality cannot be zero", () => {
    expect(() => new GildedRose([new Item("foo", 0, -1)])).toThrow(
      QualitySubceeded
    );
  });
  it("Items quality, except exception, cannot be bigger than 50", () => {
    expect(() => new GildedRose([new Item("foo", 0, 52)])).toThrow(
      QualityValueExceeded
    );
  });
  it("Sulfuras quality cannot be smaller than 80", () => {
    expect(
      () => new GildedRose([new Item("Sulfuras, Hand of Ragnaros", 0, 79)])
    ).toThrow(QualitySubceeded);
  });
  it("Sulfuras quality cannot be bigger than 80", () => {
    expect(
      () => new GildedRose([new Item("Sulfuras, Hand of Ragnaros", 0, 81)])
    ).toThrow(QualityValueExceeded);
  });
});
