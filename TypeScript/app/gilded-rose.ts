export class GildedRose {
  items: Array<Item>;
  private itemQualityValidator: ItemQualityValidator;
  private itemUpdater: ItemUpdater;

  constructor(
    items = [] as Array<Item>,
    itemQualityValidator = new ItemQualityValidatorBase(),
    itemUpdater = new ItemUpdaterBase()
  ) {
    this.itemQualityValidator = itemQualityValidator;
    this.itemUpdater = itemUpdater;
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

export enum ItemExceptions {
  SULFURAS = "Sulfuras, Hand of Ragnaros",
  AGED_BRIE = "Aged Brie",
  BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert",
  CONJURED = "Conjured Mana Cake",
}

interface ItemQualityValidator {
  validateQuality(item: Item): Item;
}

class ItemQualityValidatorBase implements ItemQualityValidator {
  validateQuality(item: Item): Item {
    if (item.quality < 0) {
      throw new QualitySubceeded(item, 0);
    }
    if (item.name === ItemExceptions.SULFURAS) {
      if (item.quality < 80) {
        throw new QualitySubceeded(item, 80);
      } else if (item.quality > 80) {
        throw new QualityValueExceeded(item, 80);
      }
    } else if (item.quality > 50) {
      throw new QualityValueExceeded(item, 50);
    }
    return new Item(item.name, item.sellIn, item.quality);
  }
}

interface ItemUpdater {
  updateQuality(item: Item): Item;
}

class ItemUpdaterBase implements ItemUpdater {
  updateQuality(item: Item): Item {
    const newSellIn = this.updateSellin(item.name, item.sellIn);
    const newQuality = this.updateQualityValue(
      item.name,
      item.quality,
      item.sellIn
    );
    return new Item(item.name, newSellIn, newQuality);
  }

  private updateSellin(name: string, sellIn: number): number {
    if (name === ItemExceptions.SULFURAS) {
      return this.updateSellInSulfuras(sellIn);
    }
    return sellIn - 1;
  }

  private updateSellInSulfuras(sellIn: number): number {
    return sellIn;
  }

  private updateQualityValue(
    name: string,
    quality: number,
    sellIn: number
  ): number {
    if (name === ItemExceptions.AGED_BRIE) {
      return this.updateQualityValueAgedBrie(quality);
    }
    if (name === ItemExceptions.SULFURAS) {
      return this.updateQualityValueSulfuras(quality);
    }
    if (name === ItemExceptions.BACKSTAGE_PASSES) {
      return this.updateQualityValueBackstagePasses(sellIn, quality);
    }
    if (name === ItemExceptions.CONJURED) {
      return this.updateQualityValueConjured(sellIn, quality);
    }
    if (sellIn < 0) {
      return Math.max(Math.floor(quality / 2), 0);
    } else {
      return Math.max(quality - 1, 0);
    }
  }

  private updateQualityValueAgedBrie(quality: number): number {
    if (quality < 50) {
      return quality + 1;
    }
    return quality;
  }

  private updateQualityValueSulfuras(quality: number): number {
    return quality;
  }

  private updateQualityValueBackstagePasses(
    sellIn: number,
    quality: number
  ): number {
    if (sellIn < 0) {
      return 0;
    } else if (sellIn <= 5) {
      return Math.min(quality * 3, 50);
    } else if (sellIn <= 10) {
      return Math.min(quality * 2, 50);
    }
    return Math.min(quality + 1, 50);
  }

  private updateQualityValueConjured(sellIn: number, quality: number): number {
    if (sellIn < 0) {
      return Math.max(Math.floor(quality / 4), 0);
    } else {
      return Math.max(quality / 2, 0);
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
