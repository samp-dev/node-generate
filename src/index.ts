import { typeDefinitions, globals, handlebarsHelper } from './generators';
import { DocsStore } from './docsStore';

async function generateAll() {
  const docsStore = await DocsStore.fromSampStdlib();
  handlebarsHelper.initHandlerbars();
  typeDefinitions.generate(docsStore);
  globals.generate();
}

generateAll();
