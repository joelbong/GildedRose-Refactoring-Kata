import { Item } from "@/item";
import { ItemExceptions } from "@/itemExceptions";
import { QualitySubceeded, QualityValueExceeded } from "@/errors";

export interface ItemQualityValidator {
  validateQuality(item: Item): Item;
}

export class ItemQualityValidatorBase implements ItemQualityValidator {
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
