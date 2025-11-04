export type MulterFiles<T extends string> = {
  [k in T]?: Express.Multer.File[];
};
