import { Item } from "@/item";
import { ItemExceptions } from "@/itemExceptions";

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
