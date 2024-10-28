import { Item } from "@/item";
import { ItemExceptions } from "@/itemExceptions";
import { QualitySubceeded, QualityValueExceeded } from "@/errors";
import {
  MINIMUM_DEFAULT_QUALITY,
  MAXIMUM_DEFAULT_QUALITY,
  MAXIMUM_SULFURAS_QUALITY,
} from "@/defaults";

export interface ItemQualityValidator {
  validateQuality(item: Item): Item;
}

export class ItemQualityValidatorBase implements ItemQualityValidator {
  validateQuality(item: Item): Item {
    if (item.quality < MINIMUM_DEFAULT_QUALITY) {
      throw new QualitySubceeded(item, MINIMUM_DEFAULT_QUALITY);
    }
    if (item.name === ItemExceptions.SULFURAS) {
      if (item.quality < MAXIMUM_SULFURAS_QUALITY) {
        throw new QualitySubceeded(item, MAXIMUM_SULFURAS_QUALITY);
      } else if (item.quality > MAXIMUM_SULFURAS_QUALITY) {
        throw new QualityValueExceeded(item, MAXIMUM_SULFURAS_QUALITY);
      }
    } else if (item.quality > MAXIMUM_DEFAULT_QUALITY) {
      throw new QualityValueExceeded(item, MAXIMUM_DEFAULT_QUALITY);
    }
    return new Item(item.name, item.sellIn, item.quality);
  }
}
