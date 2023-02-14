// // https://twitter.com/mattpocockuk/status/1622730173446557697
// export type Prettify<T> = {
//   [K in keyof T]: T[K];
//   // eslint-disable-next-line @typescript-eslint/ban-types
// } & {};

// export type Prettify<T> = {
//   [Key in keyof T]: T[Key];
// } extends infer X
//   ? X
//   : never;

export type Prettify<T> = {
  [Key in keyof T]: T[Key];
} extends infer X
  ? X
  : never;
