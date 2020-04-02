export const INCLUDE_DOCUMENTED_NATIVE_FORWARD = /(\/\/\/[\s\S]*?\>)\n(\w+) (\S+)\(\s*(.*)\s*\)\;/g;
export const INCLUDE_NATIVE_FORWARD = /(\w+) (\S+)\(\s*(.*)\s*\)\;/g;
export const INCLUDE_DEFAULT_VALUE_SIZEOF = /\s=\ssizeof.*/g;
export const INCLUDE_DEFINE = /\#define\s+(\w+)[^\S\n]+(.*)/g;
