import fs from 'fs-extra';
import Handlebars from 'handlebars';
import { constantCase } from 'constant-case';
import ora from 'ora';
import { IParsed } from '../interfaces';
import { EPaths } from '../enums';
import { DocsStore } from '../docsStore';

export const generate = async (docsStore: DocsStore) => {
  const generating = ora('Generating type definitions...').start();

  const eventsDefinitionsSpinner = ora('Generating event type definitions...').start();
  await generateEventsDefinitions(docsStore);
  eventsDefinitionsSpinner.succeed('Events type definitions generated.');

  const sampDefinitionsSpinner = ora('Generating samp type definitions...').start();
  await generateSampDefinitions(docsStore);
  sampDefinitionsSpinner.succeed('Samp type definitions generated.');

  generating.succeed('All type definitions generated.');
};

export const generateEventsDefinitions = async (docsStore: DocsStore) => {
  const a_sampEvents = getEventConstants(docsStore.a_samp);
  const a_actorEvents = getEventConstants(docsStore.a_actor);
  const a_httpEvents = getEventConstants(docsStore.a_http);
  // const a_npcEvents = getEventConstants(docsStore.a_npc);
  const a_objectsEvents = getEventConstants(docsStore.a_objects);
  const a_playersEvents = getEventConstants(docsStore.a_players);
  const a_sampdbEvents = getEventConstants(docsStore.a_sampdb);
  const a_vehiclesEvents = getEventConstants(docsStore.a_vehicles);

  const eventConstants = {
    ...a_sampEvents,
    ...a_actorEvents,
    ...a_httpEvents,
    // ...a_npcEvents,
    ...a_objectsEvents,
    ...a_playersEvents,
    ...a_sampdbEvents,
    ...a_vehiclesEvents
  };
  
  const template = Handlebars.compile(await fs.readFile(EPaths.TEMPLATE_EVENTS, 'utf8'));
  await fs.outputFile(EPaths.GENERATED_EVENT_TYPES, template({ eventConstants }));
};

export const generateSampDefinitions = async (docsStore: DocsStore) => {
  const eventListenerAliases = ['on', 'addListener', 'addEventListener'];
  const removeEventListenerAliases = ['removeListener', 'removeEventListener'];

  const parsedIncludes = [
    docsStore.a_samp,
    docsStore.a_actor,
    docsStore.a_http,
    // docsStore.a_npc,
    docsStore.a_objects, 
    docsStore.a_players, 
    docsStore.a_sampdb,
    docsStore.a_vehicles,
  ];

  const template = Handlebars.compile(await fs.readFile(EPaths.TEMPLATE_SAMP, 'utf8'));
  await fs.outputFile(EPaths.GENERATED_SAMP_TYPES, template({ eventListenerAliases, removeEventListenerAliases, parsedIncludes }));
};

export const getEventConstants = (parsed: IParsed) => {
  const events = {};

  for (const forward of parsed.forward) {
    const constant = constantCase(forward.name.replace('On', 'Event'));
    events[constant] = forward.name;
  }

  return events;
};

export const applyFixes = () => {}; // Apply fixes to generated code
