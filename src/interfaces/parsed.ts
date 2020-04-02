import { INativeForward } from '.';

export type TDefine = { [define: string]: any };

export interface IParsed {
  defines: TDefine;
  native: Array<INativeForward>;
  forward: Array<INativeForward>;
}
