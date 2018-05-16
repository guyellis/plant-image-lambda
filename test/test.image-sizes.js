

const image = require('../src/image-sizes');

function getExpected(sizes) {
  const names = ['thumb', 'sm', 'md', 'lg', 'xl'];
  return sizes.map((size, index) => ({
    width: size,
    name: names[index],
  }));
}

describe('image', () => {
  test('should calculate the cut image sizes', () => {
    let actual = image.calcSizes(300);
    let expected = getExpected([100, 300]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(50);
    expected = getExpected([50]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(499);
    expected = getExpected([100, 499]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(500);
    expected = getExpected([100, 500]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(501);
    expected = getExpected([100, 500, 501]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(750);
    expected = getExpected([100, 500, 750]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(1000);
    expected = getExpected([100, 500, 1000]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(1001);
    expected = getExpected([100, 500, 1000, 1001]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(1250);
    expected = getExpected([100, 500, 1000, 1250]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(1500);
    expected = getExpected([100, 500, 1000, 1500]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(1501);
    expected = getExpected([100, 500, 1000, 1500, 1501]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(1750);
    expected = getExpected([100, 500, 1000, 1500, 1750]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(1999);
    expected = getExpected([100, 500, 1000, 1500, 1999]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(2000);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(2001);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    expect(actual).toEqual(expected);

    actual = image.calcSizes(3000);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    expect(actual).toEqual(expected);
  });
});
