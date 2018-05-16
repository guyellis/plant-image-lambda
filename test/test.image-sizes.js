

const assert = require('assert');
const image = require('../src/image-sizes');

function getExpected(sizes) {
  const names = ['thumb', 'sm', 'md', 'lg', 'xl'];
  return sizes.map((size, index) => ({
    width: size,
    name: names[index],
  }));
}

describe('image', () => {
  it('should calculdate the cut image sizes', () => {
    let actual = image.calcSizes(300);
    let expected = getExpected([100, 300]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(50);
    expected = getExpected([50]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(499);
    expected = getExpected([100, 499]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(500);
    expected = getExpected([100, 500]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(501);
    expected = getExpected([100, 500, 501]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(750);
    expected = getExpected([100, 500, 750]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(1000);
    expected = getExpected([100, 500, 1000]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(1001);
    expected = getExpected([100, 500, 1000, 1001]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(1250);
    expected = getExpected([100, 500, 1000, 1250]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(1500);
    expected = getExpected([100, 500, 1000, 1500]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(1501);
    expected = getExpected([100, 500, 1000, 1500, 1501]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(1750);
    expected = getExpected([100, 500, 1000, 1500, 1750]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(1999);
    expected = getExpected([100, 500, 1000, 1500, 1999]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(2000);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(2001);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    assert.deepEqual(actual, expected);

    actual = image.calcSizes(3000);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    assert.deepEqual(actual, expected);
  });
});
