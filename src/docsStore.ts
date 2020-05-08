import { IParsed } from "./interfaces";
import { fetchSampInc, fetchActorInc, fetchHttpInc, fetchNPCInc, fetchObjectsInc, fetchPlayersInc, fetchSampDBInc, fetchVehiclesInc } from './requests';
import { parseInclude } from './parser';
import ora from "ora";

export class DocsStore {
  private constructor(
    public readonly a_samp: IParsed,
    public readonly a_actor: IParsed,
    public readonly a_http: IParsed,
    public readonly a_npc: IParsed,
    public readonly a_objects: IParsed,
    public readonly a_players: IParsed,
    public readonly a_sampdb: IParsed,
    public readonly a_vehicles: IParsed,
  ) {}

  public static async fromSampStdlib() {
    const parsingSpinner = ora('Parsing docs from samp-stdlib...').start();
    
    // A_SAMP
    const a_sampPromise = fetchSampInc().then(data => parseInclude(data, true, true));
    // A_ACTOR
    const a_actorPromise = fetchActorInc().then(data => parseInclude(data, true, true));
    // A_HTTP
    const a_httpPromise = fetchHttpInc().then(data => parseInclude(data, true, true));

    // A_NPC
    const a_npcPromise = fetchNPCInc().then(data => parseInclude(data, false, true));
    // Removed because it contains most of the things a_samp already has and you shouldn't include both in a pawn gamemode either

    // A_OBJECTS
    const a_objectsPromise = fetchObjectsInc().then(data => parseInclude(data, true, true));
    // A_PLAYERS
    const a_playersPromise = fetchPlayersInc().then(data => parseInclude(data, true, true));
    // A_SAMPDB
    const a_sampdbPromise = fetchSampDBInc().then(data => parseInclude(data, false, true));
    // A_VEHICLES
    const a_vehiclesPromise = fetchVehiclesInc().then(data => parseInclude(data, true, true));
    
    const results = await Promise.all([
      a_sampPromise,
      a_actorPromise,
      a_httpPromise,
      a_npcPromise,
      a_objectsPromise,
      a_playersPromise,
      a_sampdbPromise,
      a_vehiclesPromise,
    ]);

    parsingSpinner.succeed("Parsing docs finished.");

    return new DocsStore(...results);
  }
}

// Equals to `"a_samp" | "a_actor" | ...` etc.
export type ParsedModules = {
  [P in keyof DocsStore]: DocsStore[P] extends IParsed ? P : never;
}[keyof DocsStore];
