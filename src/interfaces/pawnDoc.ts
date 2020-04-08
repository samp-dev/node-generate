export interface IPawnDocParam {
  name: string;
  description: string;
};

export interface IPawnDoc {
  summary?: Array<string>;
  param?: Array<IPawnDocParam>;
  seealso?: Array<string>;
  remarks?: Array<string>;
  returns?: Array<string>;
}
