import { Item, GildedRose, QualityNegativeError } from '@/gilded-rose';

describe('Gilded Rose', () => {
  it('New item quality cannot be zero', () => {
    expect(() => new GildedRose([new Item('foo', 0, -1)])).toThrow(QualityNegativeError)
  });
});
