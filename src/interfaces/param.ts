import { TSpecifier } from '.';

export interface IParam {
  name: string;
  type: TSpecifier;
  isReference: boolean;
  isVariadic: boolean;
  defaultValue?: any;
  defaultValueDefine?: string;
}
