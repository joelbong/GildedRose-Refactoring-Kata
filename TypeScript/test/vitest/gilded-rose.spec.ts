import {
  GildedRose,
  Item,
  QualitySubceeded,
  QualityValueExceeded,
  ItemExceptions,
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
  test.concurrent(
    ItemExceptions.SULFURAS + " quality cannot be smaller than 80",
    () => {
      expect(
        () => new GildedRose([new Item(ItemExceptions.SULFURAS, 0, 79)])
      ).toThrow(QualitySubceeded);
    }
  );
  test.concurrent(
    ItemExceptions.SULFURAS + " quality cannot be bigger than 80",
    () => {
      expect(
        () => new GildedRose([new Item(ItemExceptions.SULFURAS, 0, 81)])
      ).toThrow(QualityValueExceeded);
    }
  );
});

describe("Gilded Rose - Update quality", () => {
  test.concurrent.each([
    [5, 4],
    [0, -1],
    [-1, -2],
  ])("Sellin must decrease from %i to %i", (sellIn, expectedSellIn) => {
    const gildedRose = new GildedRose([new Item("foo", sellIn, 5)]);
    const updatedSellin = gildedRose.updateQuality()[0].sellIn;
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
    "Quality where sell date HAS passed must update from %i to %i",
    (quality, expectedQuality) => {
      const gildedRose = new GildedRose([new Item("foo", -1, quality)]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(expectedQuality);
    }
  );
});

describe("Gilded Rose - Update quality exceptions", () => {
  test.concurrent.each([[5], [-5]])(
    ItemExceptions.AGED_BRIE + " increases in quality for sellIn $i",
    (sellIn) => {
      const gildedRose = new GildedRose([
        new Item(ItemExceptions.AGED_BRIE, sellIn, 20),
      ]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(21);
    }
  );
  test.concurrent(
    ItemExceptions.AGED_BRIE +
      " cannot increases in quality if it's value is 50",
    () => {
      const gildedRose = new GildedRose([
        new Item(ItemExceptions.AGED_BRIE, 5, 50),
      ]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(50);
    }
  );
  test.concurrent(
    ItemExceptions.SULFURAS + " will not be updated as it cannot be sold",
    () => {
      const gildedRose = new GildedRose([
        new Item(ItemExceptions.SULFURAS, 5, 80),
      ]);
      const updatedItem = gildedRose.updateQuality()[0];
      const updatedSellin = updatedItem.sellIn;
      const updatedQuality = updatedItem.quality;
      expect(updatedSellin).toBe(5);
      expect(updatedQuality).toBe(80);
    }
  );
});
