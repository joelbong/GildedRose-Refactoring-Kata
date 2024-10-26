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
      return item;
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
      throw new QualityNegativeError(item);
    }
    if (item.name !== "Sulfuras, Hand of Ragnaros" || item.quality > 50) {
      throw new QualityValueExceeded(item, 50);
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

export class QualityNegativeError extends QualityValidationError {
  constructor(item: Item) {
    super(item, "Quality cannot be less than 0");
    this.name = "QualityNegativeError";
  }
}

export class QualityValueExceeded extends QualityValidationError {
  constructor(item: Item, expectedValue: number) {
    super(item, `Quality cannot be bigger than ${expectedValue}`);
    this.name = "QualityValueExceeded";
  }
}
