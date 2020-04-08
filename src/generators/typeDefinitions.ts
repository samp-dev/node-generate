import fs from 'fs-extra';
import Handlebars from 'handlebars';
import { constantCase } from 'constant-case';
import ora from 'ora';

import { fetchSampInc, fetchActorInc, fetchHttpInc, fetchObjectsInc, fetchPlayersInc, fetchSampDBInc, fetchVehiclesInc } from '../requests';
import { parseInclude } from '../parser';
import { IParsed, IParam, IPawnDoc } from '../interfaces';
import { EPaths } from '../enums';

let a_sampParsed: IParsed; 
let a_actorParsed: IParsed;
let a_httpParsed: IParsed;
// let a_npcParsed: IParsed;
let a_objectsParsed: IParsed;
let a_playersParsed: IParsed;
let a_sampdbParsed: IParsed;
let a_vehiclesParsed: IParsed;

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
    let r: string;
    if (t === 's') r = 'string';
    else if (t === 'a' || t === 'v') r = 'Array<number>';
    else r = 'number';
    return b ? `{${r}}` : r;
  },
});

export const generate = async () => {
  const generating = ora('Generating type definitions...').start();

  // A_SAMP
  const a_samp = await fetchSampInc();
  a_sampParsed = await parseInclude(a_samp, true, true);

  // A_ACTOR
  const a_actor = await fetchActorInc();
  a_actorParsed = await parseInclude(a_actor, true, true);

  // A_HTTP
  const a_http = await fetchHttpInc();
  a_httpParsed = await parseInclude(a_http, true, true);

  // A_NPC
  // const a_npc = await fetchNPCInc();
  // a_npcParsed = await parseInclude(a_npc, false, true);
  // Removed because it contains most of the things a_samp already has and you shouldn't include both in a pawn gamemode either

  // A_OBJECTS
  const a_objects = await fetchObjectsInc();
  a_objectsParsed = await parseInclude(a_objects, true, true);

  // A_PLAYERS
  const a_players = await fetchPlayersInc();
  a_playersParsed = await parseInclude(a_players, true, true);

  // A_SAMPDB
  const a_sampdb = await fetchSampDBInc();
  a_sampdbParsed = await parseInclude(a_sampdb, false, true);

  // A_VEHICLES
  const a_vehicles = await fetchVehiclesInc();
  a_vehiclesParsed = await parseInclude(a_vehicles, true, true);

  const eventsDefinitionsSpinner = ora('Generating event type definitions...').start();
  await generateEventsDefinitions();
  eventsDefinitionsSpinner.succeed('Events type definitions generated.');

  const sampDefinitionsSpinner = ora('Generating samp type definitions...').start();
  await generateSampDefinitions();
  sampDefinitionsSpinner.succeed('Samp type definitions generated.');

  generating.succeed('All type definitions generated.');
};

export const generateEventsDefinitions = async () => {
  const a_sampEvents = getEventConstants(a_sampParsed);
  const a_actorEvents = getEventConstants(a_actorParsed);
  const a_httpEvents = getEventConstants(a_httpParsed);
  // const a_npcEvents = getEventConstants(a_npcParsed);
  const a_objectsEvents = getEventConstants(a_objectsParsed);
  const a_playersEvents = getEventConstants(a_playersParsed);
  const a_sampdbEvents = getEventConstants(a_sampdbParsed);
  const a_vehiclesEvents = getEventConstants(a_vehiclesParsed);

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
  await fs.outputFile(EPaths.GENERATED_EVENTS, template({ eventConstants }));
};

export const generateSampDefinitions = async () => {
  const eventListenerAliases = ['on', 'addListener', 'addEventListener'];
  const removeEventListenerAliases = ['removeListener', 'removeEventListener'];

  const parsedIncludes = [
    a_sampParsed,
    a_actorParsed,
    a_httpParsed,
    // a_npcParsed,
    a_objectsParsed, 
    a_playersParsed, 
    a_sampdbParsed,
    a_vehiclesParsed,
  ];

  const template = Handlebars.compile(await fs.readFile(EPaths.TEMPLATE_SAMP, 'utf8'));
  await fs.outputFile(EPaths.GENERATED_SAMP, template({ eventListenerAliases, removeEventListenerAliases, parsedIncludes }));
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
