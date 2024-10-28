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
      return Math.max(Math.floor(quality / 2), MINIMUM_DEFAULT_QUALITY);
    } else {
      return Math.max(quality - 1, MINIMUM_DEFAULT_QUALITY);
    }
  }

  private updateQualityValueAgedBrie(quality: number): number {
    if (quality < MAXIMUM_DEFAULT_QUALITY) {
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
    if (sellIn < MINIMUM_SELLIN_DAYS) {
      return 0;
    } else if (sellIn <= 5) {
      return Math.min(quality * 3, MAXIMUM_DEFAULT_QUALITY);
    } else if (sellIn <= 10) {
      return Math.min(quality * 2, MAXIMUM_DEFAULT_QUALITY);
    }
    return Math.min(quality + 1, MAXIMUM_DEFAULT_QUALITY);
  }

  private updateQualityValueConjured(sellIn: number, quality: number): number {
    if (sellIn < MINIMUM_SELLIN_DAYS) {
      return Math.max(Math.floor(quality / 4), MINIMUM_DEFAULT_QUALITY);
    } else {
      return Math.max(quality / 2, MINIMUM_DEFAULT_QUALITY);
    }
  }
}
