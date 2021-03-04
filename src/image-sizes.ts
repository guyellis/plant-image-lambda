import { ImageSizeName, NoteImageSize } from './types/image-lambda-types';

type Bracket = {
  bracket: number;
  name: ImageSizeName;
}

/**
 * Calculate the sizes to be used for resizing the image based on the current size
 * @param width - the width of the original image
 * @return - an array of up to 4 elements representing the size
 * in each group
 */
export const calcSizes = (width: number): NoteImageSize[] => {
  if (width < 1) {
    throw new Error(`Unexpected width less than 1: ${width}`);
  }

  const brackets: Bracket[] = [{
    bracket: 100,
    name: 'thumb',
  }, {
    bracket: 500,
    name: 'sm',
  }, {
    bracket: 1000,
    name: 'md',
  }, {
    bracket: 1500,
    name: 'lg',
  }, {
    bracket: 2000,
    name: 'xl',
  }];

  return brackets.reduce(
    (acc: NoteImageSize[], { bracket, name }, index) => {
      let w;
      if (width > bracket) {
        w = bracket;
      } else if (index > 0 && width > brackets[index - 1].bracket && width <= bracket) {
        w = width;
      } else if (index === 0 && width <= bracket) {
        w = width;
      }
      if (w) {
        acc.push({ name, width: w });
      }
      return acc;
    }, [],
  );
};
