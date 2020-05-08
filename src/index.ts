import { typeDefinitions, globals, handlebarsHelper, wrappers } from './generators';
import { DocsStore } from './docsStore';

import ora from 'ora';

async function generateAll() {
  const generating = ora('Generating definitions...').start();

  const docsStore = await DocsStore.fromSampStdlib();
  handlebarsHelper.initHandlerbars();
  await typeDefinitions.generate(docsStore);
  await wrappers.generate(docsStore);
  await globals.generate();

  generating.succeed('All type definitions generated.');
}

generateAll();
