export const arrToObj = <T>(a: T[]): { [key: string]: T } => a.reduce((acc, curr) => ({ ...acc, curr }), {});
