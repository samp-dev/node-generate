export type TIntSpecifier = 'i' | 'd' | 'I' | 'D';
export type TFloatSpecifier = 'f' | 'F';
export type TStringSpecifier = 's' | 'S';
export type TIntArraySpecifier = 'a' | 'A';
export type TFloatArraySpecifier = 'v' | 'V';
export type TSpecifier = TIntSpecifier | TFloatSpecifier | TStringSpecifier | TIntArraySpecifier | TFloatArraySpecifier;
