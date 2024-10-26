import {
  GildedRose,
  Item,
  QualitySubceeded,
  QualityValueExceeded,
} from "@/gilded-rose";

describe("Gilded Rose - New item quality", () => {
  test.concurrent("Quality cannot be zero", () => {
    expect(() => new GildedRose([new Item("foo", 0, -1)])).toThrow(
      QualitySubceeded
    );
  });
  test.concurrent("Quality cannot be bigger than 50", () => {
    expect(() => new GildedRose([new Item("foo", 0, 52)])).toThrow(
      QualityValueExceeded
    );
  });
});

describe("Gilded Rose - New item quality exceptions", () => {
  test.concurrent("Sulfuras quality cannot be smaller than 80", () => {
    expect(
      () => new GildedRose([new Item("Sulfuras, Hand of Ragnaros", 0, 79)])
    ).toThrow(QualitySubceeded);
  });
  test.concurrent("Sulfuras quality cannot be bigger than 80", () => {
    expect(
      () => new GildedRose([new Item("Sulfuras, Hand of Ragnaros", 0, 81)])
    ).toThrow(QualityValueExceeded);
  });
});

describe("Gilded Rose - Update quality", () => {
  test.concurrent.each([
    [5, 4],
    [0, -1],
    [-1, -2],
  ])("Sellin must decrease from %i to %i", (sellIn, expectedSellIn) => {
    const gildedRose = new GildedRose([new Item("foo", sellIn, 5)]);
    const updatedSellin = gildedRose.updateQuality()[0].sellIn;
    console.log("Sellin decrease", sellIn, expectedSellIn, updatedSellin);
    expect(updatedSellin).toBe(expectedSellIn);
  });
  test.concurrent.each([
    [5, 4],
    [0, 0],
  ])(
    "Quality where sell date HAS NOT passed must update from %d to %d",
    (quality, expectedQuality) => {
      const gildedRose = new GildedRose([new Item("foo", 5, quality)]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(expectedQuality);
    }
  );
  test.concurrent.each([
    [20, 10],
    [5, 2],
    [1, 0],
    [0, 0],
  ])(
    "Quality where sell date HAS passed must update from %d to %d",
    (quality, expectedQuality) => {
      const gildedRose = new GildedRose([new Item("foo", -1, quality)]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(expectedQuality);
    }
  );
});
