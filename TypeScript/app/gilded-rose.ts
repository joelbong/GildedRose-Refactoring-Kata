export class GildedRose {
  items: Array<Item>;
  private itemUpdater: ItemUpdater = new ItemUpdater();

  constructor(items = [] as Array<Item>) {
    this.items = items.map((item) =>
      this.itemUpdater.validateQualityValue(item)
    );
  }

  updateQuality() {
    this.items = this.items.map((item) => {
      return this.itemUpdater.updateQuality(item);
    });
    return this.items;
  }
}

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class ItemUpdater {
  validateQualityValue(item: Item) {
    if (item.quality < 0) {
      throw new QualitySubceeded(item, 0);
    }
    if (item.name !== "Sulfuras, Hand of Ragnaros" && item.quality > 50) {
      throw new QualityValueExceeded(item, 50);
    }
    if (item.name === "Sulfuras, Hand of Ragnaros") {
      if (item.quality < 80) {
        throw new QualitySubceeded(item, 80);
      } else if (item.quality > 80) {
        throw new QualityValueExceeded(item, 80);
      }
    }
    return item;
  }
  updateQuality(item: Item) {
    item.sellIn -= 1;
    if (item.quality > 0) {
      item.quality -= 1;
    }
    return item;
  }
}

class QualityValidationError extends Error {
  constructor(item: Item, errorMessage: string) {
    super(
      `${errorMessage} for item ${item.name} with quality ${item.quality} and sellIn ${item.sellIn}`
    );
    this.name = "QualityValidationError";
  }
}

export class QualitySubceeded extends QualityValidationError {
  constructor(item: Item, expectedValue: number) {
    super(item, `Quality cannot be less than ${expectedValue}`);
    this.name = "QualityNegativeError";
  }
}

export class QualityValueExceeded extends QualityValidationError {
  constructor(item: Item, expectedValue: number) {
    super(item, `Quality cannot be bigger than ${expectedValue}`);
    this.name = "QualityValueExceeded";
  }
}
