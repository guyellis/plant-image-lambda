export const getError = (error: unknown): Error | undefined => {
  if (typeof error === 'string') {
    return new Error(error);
  }
  return error instanceof Error ? error : undefined;
};
