import { Item } from "@/item";
import { ItemUpdater, ItemUpdaterBase } from "@/itemUpdater";
import {
  ItemQualityValidator,
  ItemQualityValidatorBase,
} from "@/itemQualityValidator";

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
