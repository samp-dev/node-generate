import fs from 'fs-extra';
import Handlebars from 'handlebars';
import ora from 'ora';

import { EPaths } from '../enums';

export const generate = async () => {
  const generating = ora('Generating global constants...').start();
  await generateGlobalConstants();
  generating.succeed('All global constants generated.');
};

export const generateGlobalConstants = async () => {
  const globalConstants = {
    '__resname': 'string',
  };
  
  const template = Handlebars.compile(await fs.readFile(EPaths.TEMPLATE_GLOBALS, 'utf8'));
  await fs.outputFile(EPaths.GENERATED_GLOBAL_TYPES, template({ globalConstants }));
};

export const applyFixes = () => {}; // Apply fixes to generated code
