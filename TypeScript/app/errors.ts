import { Item } from "@/item";

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
