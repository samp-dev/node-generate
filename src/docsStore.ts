import { IParsed } from "./interfaces";
import { fetchSampInc, fetchActorInc, fetchHttpInc, fetchObjectsInc, fetchPlayersInc, fetchSampDBInc, fetchVehiclesInc } from './requests';
import { parseInclude } from './parser';

export class DocsStore {
  private constructor(
    public readonly a_samp: IParsed,
    public readonly a_actor: IParsed,
    public readonly a_http: IParsed,
    // public readonly a_npc: IParsed,
    public readonly a_objects: IParsed,
    public readonly a_players: IParsed,
    public readonly a_sampdb: IParsed,
    public readonly a_vehicles: IParsed,
  ) {}

  public static async fromSampStdlib() {
    // A_SAMP
    const a_samp = await fetchSampInc();
    const a_sampParsed = await parseInclude(a_samp, true, true);

    // A_ACTOR
    const a_actor = await fetchActorInc();
    const a_actorParsed = await parseInclude(a_actor, true, true);

    // A_HTTP
    const a_http = await fetchHttpInc();
    const a_httpParsed = await parseInclude(a_http, true, true);

    // A_NPC
    // const a_npc = await fetchNPCInc();
    // a_npcParsed = await parseInclude(a_npc, false, true);
    // Removed because it contains most of the things a_samp already has and you shouldn't include both in a pawn gamemode either

    // A_OBJECTS
    const a_objects = await fetchObjectsInc();
    const a_objectsParsed = await parseInclude(a_objects, true, true);

    // A_PLAYERS
    const a_players = await fetchPlayersInc();
    const a_playersParsed = await parseInclude(a_players, true, true);

    // A_SAMPDB
    const a_sampdb = await fetchSampDBInc();
    const a_sampdbParsed = await parseInclude(a_sampdb, false, true);

    // A_VEHICLES
    const a_vehicles = await fetchVehiclesInc();
    const a_vehiclesParsed = await parseInclude(a_vehicles, true, true);

    return new DocsStore(
      a_sampParsed,
      a_actorParsed,
      a_httpParsed,
      // a_npcParsed,
      a_objectsParsed,
      a_playersParsed,
      a_sampdbParsed,
      a_vehiclesParsed,
    );
  }
}