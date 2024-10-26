export class GildedRose {
  items: Array<Item>;
  private itemQualityValidator = new ItemQualityValidator();
  private itemUpdater: ItemUpdater = new ItemUpdater();

  constructor(items = [] as Array<Item>) {
    this.items = items.map((item) =>
      this.itemQualityValidator.validateQuality(item)
    );
  }

  updateQuality() {
    this.items = this.items.map((item) => {
      return this.itemQualityValidator.validateQuality(
        this.itemUpdater.updateQuality(item)
      );
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

class ItemQualityValidator {
  validateQuality(item: Item) {
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
    return new Item(item.name, item.sellIn, item.quality);
  }
}

class ItemUpdater {
  updateQuality(item: Item): Item {
    const newSellIn = this.updateSellin(item.sellIn);
    const newQuality = this.updateQualityValue(item.quality, item.sellIn);
    return new Item(item.name, newSellIn, newQuality);
  }

  private updateSellin(sellIn: number): number {
    sellIn = sellIn -= 1;
    return sellIn;
  }

  private updateQualityValue(quality: number, sellIn: number): number {
    if (sellIn < 0) {
      return Math.max(Math.floor((quality /= 2)), 0);
    } else {
      return Math.max((quality -= 1), 0);
    }
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
