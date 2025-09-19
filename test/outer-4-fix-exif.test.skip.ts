// import { mockLogger, mockGM as MockGM } from './helper';
// import { fixExif } from '../src/outer-4-fix-exif';
// import { ConvertToJpgResponse } from '../src/outer-3-convert-to-jpg';

// eslint-disable-next-line jest/no-commented-out-tests
// describe('fixExif', () => {
// eslint-disable-next-line jest/no-commented-out-tests
//   test('should throw if toBuffer rejects', async () => {
//     MockGM.prototype.toBuffer = (_: any, cb: Function): void => cb('fake-toBuffer-error');
//     const gm = new MockGM();

//     const req = {
//       data: {
//         buffer: 'fake-buffer',
//       },
//       deps: {
//         gm,
//         logger: mockLogger,
//       },
//     } as unknown as ConvertToJpgResponse;

//     try {
//       await fixExif(req);
//     } catch (err) {
//       expect(err).toEqual('fake-toBuffer-error');
//     }

//     expect(mockLogger.error).toHaveBeenCalledTimes(1);
//     expect.assertions(2);
//   });
// });
