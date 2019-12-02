import { calcSizes } from '../src/image-sizes';
import { ImageSize } from '../src/types';

function getExpected(sizes: number[]): ImageSize[] {
  const names = ['thumb', 'sm', 'md', 'lg', 'xl'];
  return sizes.map((width: number, index: number) => ({
    width,
    // eslint-disable-next-line security/detect-object-injection
    name: names[index],
  }));
}

describe('image', () => {
  test('should calculate the cut image sizes', () => {
    let actual: ImageSize[] = calcSizes(300);
    let expected = getExpected([100, 300]);
    expect(actual).toEqual(expected);

    actual = calcSizes(50);
    expected = getExpected([50]);
    expect(actual).toEqual(expected);

    actual = calcSizes(499);
    expected = getExpected([100, 499]);
    expect(actual).toEqual(expected);

    actual = calcSizes(500);
    expected = getExpected([100, 500]);
    expect(actual).toEqual(expected);

    actual = calcSizes(501);
    expected = getExpected([100, 500, 501]);
    expect(actual).toEqual(expected);

    actual = calcSizes(750);
    expected = getExpected([100, 500, 750]);
    expect(actual).toEqual(expected);

    actual = calcSizes(1000);
    expected = getExpected([100, 500, 1000]);
    expect(actual).toEqual(expected);

    actual = calcSizes(1001);
    expected = getExpected([100, 500, 1000, 1001]);
    expect(actual).toEqual(expected);

    actual = calcSizes(1250);
    expected = getExpected([100, 500, 1000, 1250]);
    expect(actual).toEqual(expected);

    actual = calcSizes(1500);
    expected = getExpected([100, 500, 1000, 1500]);
    expect(actual).toEqual(expected);

    actual = calcSizes(1501);
    expected = getExpected([100, 500, 1000, 1500, 1501]);
    expect(actual).toEqual(expected);

    actual = calcSizes(1750);
    expected = getExpected([100, 500, 1000, 1500, 1750]);
    expect(actual).toEqual(expected);

    actual = calcSizes(1999);
    expected = getExpected([100, 500, 1000, 1500, 1999]);
    expect(actual).toEqual(expected);

    actual = calcSizes(2000);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    expect(actual).toEqual(expected);

    actual = calcSizes(2001);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    expect(actual).toEqual(expected);

    actual = calcSizes(3000);
    expected = getExpected([100, 500, 1000, 1500, 2000]);
    expect(actual).toEqual(expected);
  });

  test('should throw if size is under 1', () => {
    try {
      calcSizes(0);
    } catch (e) {
      expect(e.message).toBe('Unexpected width less than 1: 0');
    }
    expect.assertions(1);
  });
});
