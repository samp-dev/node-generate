import fs from 'fs-extra';
import Handlebars from 'handlebars';
import ora from 'ora';
import { EPaths } from '../enums';
import { DocsStore, ParsedModules } from '../docsStore';

export const generate = async (docsStore: DocsStore) => {
  // TODO: generate default values
  const generating = ora('Generating native wrappers definitions...').start();
  await generateNativeWrappers(docsStore);
  generating.succeed('All native wrappers generated.');
};

const generateNativeWrappers = async (docsStore: DocsStore) => {
  const moduleNames: Array<ParsedModules> = [
    "a_samp", 
    "a_actor",
    "a_http",
    "a_npc",
    "a_objects", 
    "a_players", 
    "a_sampdb",
    "a_vehicles",
  ];

  const wrapperTemplate = Handlebars.compile(await fs.readFile(EPaths.TEMPLATE_WRAPPERS, 'utf8'));
  const indexTemplate = Handlebars.compile(await fs.readFile(EPaths.TEMPLATE_WRAPPERS_INDEX, 'utf8'));
  await Promise.all(moduleNames.map(moduleName => {
    const module = docsStore[moduleName];
    return fs.outputFile(generatedWrapperPath(moduleName), wrapperTemplate({ module }));
  }));

  await fs.outputFile(generatedWrapperPath("index"), indexTemplate({ moduleNames }));
};

function generatedWrapperPath(moduleName: string) {
  return `${EPaths.GENERATED_WRAPPERS_FOLDER}/${moduleName}.ts`;
}
