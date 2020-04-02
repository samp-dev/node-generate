import { IParam, IPawnDoc } from '.';

export interface INativeForward {
  pawnDoc: IPawnDoc;
  type: 'native' | 'forward';
  returnsFloat: boolean;
  name: string;
  params: Array<IParam>;
}
