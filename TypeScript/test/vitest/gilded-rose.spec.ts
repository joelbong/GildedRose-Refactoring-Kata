import { Item } from "@/item";
import { GildedRose } from "@/gilded-rose";
import { ItemExceptions } from "@/itemExceptions";
import { QualitySubceeded, QualityValueExceeded } from "@/errors";

describe("Gilded Rose - New item quality", () => {
  test.concurrent("Valid item must be created", () => {
    const gildedRose = new GildedRose([new Item("foo", 5, 4)]);
    expect(gildedRose.items[0].name).toBe("foo");
    expect(gildedRose.items[0].sellIn).toBe(5);
    expect(gildedRose.items[0].quality).toBe(4);
  });
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
    "Quality where sell date HAS NOT passed must update from %i to %i",
    (quality, expectedQuality) => {
      const gildedRose = new GildedRose([new Item("foo", 5, quality)]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(expectedQuality);
    }
  );
  test.concurrent.each([
    [20, 18],
    [5, 3],
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
    ItemExceptions.AGED_BRIE + " increases in quality for sellIn %i",
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
    ItemExceptions.SULFURAS +
      " will not be updated as it cannot be sold. It sellin and quality must remain constant",
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
  test.concurrent(
    ItemExceptions.BACKSTAGE_PASSES +
      " increases in quality by 2 when sellIn is less or equal than 10 days but bigger than 5 days",
    () => {
      const gildedRose = new GildedRose([
        new Item(ItemExceptions.BACKSTAGE_PASSES, 8, 12),
      ]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(14);
    }
  );
  test.concurrent(
    ItemExceptions.BACKSTAGE_PASSES +
      " increases in quality by 3 when sellIn is less or equal than 5 days",
    () => {
      const gildedRose = new GildedRose([
        new Item(ItemExceptions.BACKSTAGE_PASSES, 4, 12),
      ]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(15);
    }
  );
  test.concurrent(
    ItemExceptions.BACKSTAGE_PASSES + " quality becomes 0 if sellIn is passed",
    () => {
      const gildedRose = new GildedRose([
        new Item(ItemExceptions.BACKSTAGE_PASSES, -1, 12),
      ]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(0);
    }
  );
  test.concurrent.each([
    [4, 47],
    [8, 48],
    [20, 49],
  ])(
    ItemExceptions.BACKSTAGE_PASSES +
      " quality can never be than bigger than 50 where sellIn is %i and quality is %i",
    (sellIn, quality) => {
      const gildedRose = new GildedRose([
        new Item(ItemExceptions.BACKSTAGE_PASSES, sellIn, quality),
      ]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(50);
    }
  );
  test.concurrent.each([
    [20, 12, 10],
    [-1, 12, 8],
    [-5, 0, 0],
  ])(
    ItemExceptions.CONJURED +
      " decreases in quality twice as fast as normal items where sellIn is %i and quality is %i ",
    (sellIn, quality, expectedQuality) => {
      const gildedRose = new GildedRose([
        new Item(ItemExceptions.CONJURED, sellIn, quality),
      ]);
      const updatedQuality = gildedRose.updateQuality()[0].quality;
      expect(updatedQuality).toBe(expectedQuality);
    }
  );
});
