import got from 'got';

import { EUrls } from './enums';

// Fetch a_samp.inc from samp-stdlib
export const fetchSampInc = async () => {
  return await got.get(EUrls.A_SAMP).text();
};

// Fetch a_actor.inc from samp-stdlib
export const fetchActorInc = async () => {
  return await got.get(EUrls.A_ACTOR).text();
};

// Fetch a_http.inc from samp-stdlib
export const fetchHttpInc = async () => {
  return await got.get(EUrls.A_HTTP).text();
};

// Fetch a_npc.inc from samp-stdlib
export const fetchNPCInc = async () => {
  return await got.get(EUrls.A_NPC).text();
};

// Fetch a_objects.inc from samp-stdlib
export const fetchObjectsInc = async () => {
  return await got.get(EUrls.A_OBJECTS).text();
};

// Fetch a_players.inc from samp-stdlib
export const fetchPlayersInc = async () => {
  return await got.get(EUrls.A_PLAYERS).text();
};

// Fetch a_sampdb.inc from samp-stdlib
export const fetchSampDBInc = async () => {
  return await got.get(EUrls.A_SAMPDB).text();
};

// Fetch a_vehicles.inc from samp-stdlib
export const fetchVehiclesInc = async () => {
  return await got.get(EUrls.A_VEHICLES).text();
};
