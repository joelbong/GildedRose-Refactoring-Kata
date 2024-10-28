import { Item } from "@/item";
import { ItemExceptions } from "@/itemExceptions";
import {
  MAXIMUM_DEFAULT_QUALITY,
  MINIMUM_DEFAULT_QUALITY,
  MINIMUM_SELLIN_DAYS,
} from "@/defaults";

export interface ItemUpdater {
  updateQuality(item: Item): Item;
}

export class ItemUpdaterBase implements ItemUpdater {
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
    switch (name) {
      case ItemExceptions.AGED_BRIE: {
        return this.updateQualityValueAgedBrie(quality);
      }
      case ItemExceptions.SULFURAS: {
        return this.updateQualityValueSulfuras(quality);
      }
      case ItemExceptions.BACKSTAGE_PASSES: {
        return this.updateQualityValueBackstagePasses(sellIn, quality);
      }
      case ItemExceptions.CONJURED: {
        return this.updateQualityValueConjured(sellIn, quality);
      }
      default: {
        return this.updateDefault(sellIn, quality);
      }
    }
  }

  private updateDefault(sellIn: number, quality: number): number {
    if (sellIn < MINIMUM_SELLIN_DAYS) {
      return this.decreaseQuality(quality, 2);
    } else {
      return this.decreaseQuality(quality);
    }
  }

  private updateQualityValueAgedBrie(quality: number): number {
    return this.increaseQuality(quality);
  }

  private updateQualityValueSulfuras(quality: number): number {
    return quality;
  }

  private updateQualityValueBackstagePasses(
    sellIn: number,
    quality: number
  ): number {
    if (sellIn < MINIMUM_SELLIN_DAYS) {
      return MINIMUM_DEFAULT_QUALITY;
    } else if (sellIn <= 5) {
      return this.increaseQuality(quality, 3);
    } else if (sellIn <= 10) {
      return this.increaseQuality(quality, 2);
    }
    return this.increaseQuality(quality, 1);
  }

  private updateQualityValueConjured(sellIn: number, quality: number): number {
    if (sellIn < MINIMUM_SELLIN_DAYS) {
      return this.decreaseQuality(quality, 4);
    } else {
      return this.decreaseQuality(quality, 2);
    }
  }

  private decreaseQuality(quality: number, factor: number = 1): number {
    return Math.max(Math.floor(quality - factor), MINIMUM_DEFAULT_QUALITY);
  }

  private increaseQuality(quality: number, factor: number = 1): number {
    return Math.min(quality + factor, MAXIMUM_DEFAULT_QUALITY);
  }
}
