export const getError = (error: unknown): Error | undefined => error instanceof Error ? error : undefined;
