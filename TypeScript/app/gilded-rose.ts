export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class ItemQuality {
  static validateQuality(item: Item) {
    if (item.quality < 0) {
      throw new QualityNegativeError();
    }
    return item;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items.map((item) => ItemQuality.validateQuality(item));
  }

  updateQuality() {
    this.items = this.items.map((item) => {
      return item;
    });
  }

  getItems() {
    return this.items;
  }
}

class QualityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QualityValidationError";
  }
}

export class QualityNegativeError extends QualityValidationError {
  constructor() {
    super("Quality cannot be less than 0");
    this.name = "QualityValidationError";
  }
}
