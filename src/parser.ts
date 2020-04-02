import nodeEval from 'node-eval';
import * as xml2js from 'xml2js';
import striptags from 'striptags';

import { INCLUDE_DOCUMENTED_NATIVE_FORWARD, INCLUDE_NATIVE_FORWARD, INCLUDE_DEFAULT_VALUE_SIZEOF, INCLUDE_DEFINE } from './patterns';
import { IParsed, TSpecifier, IPawnDoc, IParam, TDefine } from './interfaces';
import {  } from './interfaces/parsed';

export const parseInclude = async (content: string, hasCleanPawnDoc = false, isConstCorrect = false) => {
  const pattern = hasCleanPawnDoc ? INCLUDE_DOCUMENTED_NATIVE_FORWARD : INCLUDE_NATIVE_FORWARD;
  const parsed: IParsed = { defines: {}, native: [], forward: [] };
  
  let matches: RegExpExecArray | null;
  
  // Defines
  while ((matches = INCLUDE_DEFINE.exec(content)) !== null) {
    if (matches.index === INCLUDE_DEFINE.lastIndex)
      INCLUDE_DEFINE.lastIndex++;
      
    parsed.defines[matches[1]] = matches[2].replace(/\w+:/g, ''); // Remove tags
  }

  // Natives & Forwards
  while ((matches = pattern.exec(content)) !== null) {
    if (matches.index === pattern.lastIndex)
      pattern.lastIndex++;
      
    const pawnDoc = hasCleanPawnDoc ? await parsePawnDoc(matches[1].replace(/\/\/\/ /g, '')) : {};
    const type = <'native' | 'forward'>matches[+hasCleanPawnDoc + 1];
    const [returnsFloat, name] = parseName(matches[+hasCleanPawnDoc + 2]);
    const params = parseParams(matches[+hasCleanPawnDoc + 3], isConstCorrect, parsed.defines);

    parsed[type].push({ pawnDoc, type, returnsFloat: <boolean>returnsFloat, name: <string>name, params });
  }

  return parsed;
};

export const parseParams = (params: string, isConstCorrect = false, defines?: TDefine): Array<IParam> => {
  const splittedParams = params.replace('{Float,_}', '').split(',').map(p => p.trim().replace(INCLUDE_DEFAULT_VALUE_SIZEOF, ''));
  const parsedParams: Array<IParam> = [];

  for (let param of splittedParams) {
    if (param === '') // Function with no parameters
      break;

    let paramInfo: IParam = { name: '', type: 'i', isReference: false, isVariadic: false };
    const defaultValue = param.split('=').map(c => c.trim())[1];

    // Reference check
    if (param[0] === '&') {
      param = param.substring(1);
      paramInfo.isReference = true;
    }

    // Tag check
    if (param.includes(':')) {
      const splitted = param.split(':');
      param = splitted[1];

      if (splitted[0] === 'Float')
        paramInfo.type = 'f';

      if (splitted[1] === '...') { // variadic arguments
        paramInfo.isVariadic = true;
      }
    }

    // Array check
    if (param.includes('[]')) {
      param = param.replace('[]', '');

      // Array datatype check
      if (defaultValue && (defaultValue[0] === '{' || defaultValue[0] === '"')) {
        const arrayString = defaultValue.replace('{', '[').replace('}', ']').replace(/\w+\:/g, '');

        if (arrayString[0] === '[') {
          if (arrayString.includes('.')) // Float array
            paramInfo.type = 'v';
          else // Integer array
            paramInfo.type = 'a';
        } else // String
          paramInfo.type = 's';

        paramInfo.defaultValue = nodeEval(arrayString);
      } else {
        paramInfo.type = 's';

        if (isConstCorrect && !param.includes('const '))
          paramInfo.isReference = true;
      }
    }
    
    // const check
    if (param.startsWith('const ')) {
      param = param.replace('const ', '');
      paramInfo.isReference = false;
    }

    // Default value check (if not an array)
    if (defaultValue) {
      if (defines && Object.keys(defines).includes(defaultValue)) {
        try {
          paramInfo.defaultValue = nodeEval(defines[defaultValue]);
          paramInfo.defaultValueDefine = defaultValue;
        } catch {}
      } else {
        if (paramInfo.type === 'i')
          paramInfo.defaultValue = Number.parseInt(defaultValue);
        else if (paramInfo.type === 'f')
          paramInfo.defaultValue = Number.parseFloat(defaultValue);
      }
    }

    // vibe check 😎
    if (paramInfo.isReference)
      paramInfo.type = <TSpecifier>paramInfo.type.toUpperCase();

    paramInfo.name = (defaultValue ? param.split('=')[0] : param).trim();
    parsedParams.push(paramInfo);
  }

  return parsedParams;
};

export const parseName = (name: string) => {
  const splitted = name.split(':');
  return [splitted[1] && splitted[0] === 'Float', splitted[1] || splitted[0]];
};

export const parsePawnDoc = async (pawnDoc: string): Promise<IPawnDoc> => {
  const data = `<pawnDoc>${pawnDoc}</pawnDoc>`;
  const allowedTags = ['pawndoc', 'summary', 'param', 'seealso', 'remarks', 'returns'];
  const strippedData = striptags(data, allowedTags);

  try {
    const jsonValue = await xml2js.parseStringPromise(strippedData);
    jsonValue.pawnDoc.param = jsonValue.pawnDoc?.param?.map(param => ({ name: param.$.name, description: param._ }));
    jsonValue.pawnDoc.see = jsonValue.pawnDoc.seealso.map(seealso => seealso.$.name);
    delete jsonValue.pawnDoc.seealso;

    return jsonValue.pawnDoc;
  } catch {
    // Invalid xml
    return {};
  }
};
