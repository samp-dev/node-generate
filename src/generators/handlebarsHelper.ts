import { IParam, IPawnDoc } from '../interfaces';
import Handlebars from 'handlebars';

export function initHandlerbars() {
  Handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and: (v1, v2) => v1 && v2,
    or: (v1, v2) => v1 || v2,
  });
    
  Handlebars.registerHelper({
    // has variadic params
    hvp: (pa: Array<IParam>) => pa.some(p => p.isVariadic),
    // specifier values string
    svs: (pa: Array<IParam>) => pa.map(p => p.isReference ? p.type.toUpperCase() : p.type).join(''),
    // specifier values without references
    svw: (pa: Array<IParam>) => pa.filter(p => !p.isReference),
    // specifier values without references length
    svwl: (pa: Array<IParam>) => pa.filter(p => !p.isReference).length,
    // reference values string
    rvs: (pa: Array<IParam>) => pa.filter(p => p.isReference).map(p => p.type.toUpperCase()).join(''),
    // reference values length
    rvl: (pa: Array<IParam>) => pa.filter(p => p.isReference).length,

    // pawndoc param description
    ppd: (pd: IPawnDoc, pa: IParam) => pd.param?.find(pdpa => pdpa.name === pa.name)?.description,
    // typescript type for specifier 
    tts: (t: IParam['type'], b = false) => {
      const type = referenceToTsType(t);
      return b ? `{${type}}` : type;
    },
    restriction: (param: IParam) => {
        if (param.type === 'i' || param.type === 'd') {
          return "Must be a whole number."
        } else if (param.type === 'a') {
          return "All numbers must be whole";
        }
        return null;
    },
    outputtype: (params: Array<IParam>) => {
      const types = params.filter(p => p.isReference).map(r => referenceToTsType(r.type));
      if (!types.length) {
        return "number";
      } 
      if (types.length === 1) {
        return types[0];
      }
      return `[${types.join(", ")}]`;
    }
  });
}

function referenceToTsType(t: IParam['type']) {
  switch (t) {
    case 's':
    case 'S':
      return "string";
    case 'f':
    case 'F':
    case 'd':
    case 'D':
    case 'i': 
    case 'I':
      return "number";
    case 'a':
    case 'A':
    case 'v':
    case 'V':
      return "Array<number>";
  }
}
