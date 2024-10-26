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

describe("Gilded Rose - Update quality", () => {
  it("Items, except exceptions, must lower in sellin", () => {
    const gildedRose = new GildedRose([new Item("foo", 1, 5)]);
    const updatedSellin = gildedRose.updateQuality()[0].sellIn;
    expect(updatedSellin).toBe(0);
  });
  it("Items, except exceptions, must lower in quality", () => {
    const gildedRose = new GildedRose([new Item("foo", 1, 5)]);
    const updatedQuality = gildedRose.updateQuality()[0].quality;
    expect(updatedQuality).toBe(4);
  });
  it("Items, except exceptions, must not lower in quality if its already 0", () => {
    const gildedRose = new GildedRose([new Item("foo", 1, 0)]);
    const updatedQuality = gildedRose.updateQuality()[0].quality;
    expect(updatedQuality).toBe(0);
  });
});
