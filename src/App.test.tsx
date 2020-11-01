import { DATANEWSHIPS } from "./data/dataShips";
import { FactionModel } from "./models/Models";
import { ShipUnit } from "./models/Units";
import { createNewFaction } from "./services/helpers/FactionHelpers";
import { createShipFromDesign, spaceCombatMain } from "./services/helpers/UnitHelpers";


describe("Combat Tester", () => {

  let ships: ShipUnit[] = [];
  let factions: FactionModel[] = [];

  beforeEach(() => {

    factions = [];
    factions.push(createNewFaction());
    factions.push(createNewFaction());

    ships.push(createShipFromDesign(DATANEWSHIPS[1], factions[0].id, {x: 10, y: 10}));
    // ships.push(createShipFromDesign(DATANEWSHIPS[2], factions[0].id, {x: 10, y: 10}));
    // ships.push(createShipFromDesign(DATANEWSHIPS[1], factions[0].id, {x: 10, y: 10}));

    ships.push(createShipFromDesign(DATANEWSHIPS[0], factions[1].id, {x: 10, y: 10}));
    ships.push(createShipFromDesign(DATANEWSHIPS[0], factions[1].id, {x: 10, y: 10}));
    // ships.push(createShipFromDesign(DATANEWSHIPS[0], factions[1].id, {x: 10, y: 10}));
    // ships.push(createShipFromDesign(DATANEWSHIPS[0], factions[1].id, {x: 10, y: 10}));
    // ships.push(createShipFromDesign(DATANEWSHIPS[0], factions[1].id, {x: 10, y: 10}));
    // ships.push(createShipFromDesign(DATANEWSHIPS[0], factions[1].id, {x: 10, y: 10}));

  });

  it("Combat Sim", () => {

    const combat = spaceCombatMain(ships, null);
    
    console.log(`COMBAT: \nRound: ${combat.round}\n`);

    
    console.log(combat.log.length);
    combat.log.length < 80 && console.log(combat.log);

    const uns: string[] = [];
    combat.units.forEach((s: ShipUnit) => {
      uns.push(`${s.factionId} ${s.name}(${s.type}) D:${s.damage}/${s.hull} EXP:${s.experience}`)
      // console.log(`${s.factionId} ${s.name} D:${s.damage}/${s.hull} EXP:${s.experience}`)
    });
    uns.push("Ship in the beginning");
    ships.forEach((s: ShipUnit) => {
      uns.push(`${s.factionId} ${s.name}(${s.type}) D:${s.damage}/${s.hull} EXP:${s.experience}`)
      // console.log(`${s.factionId} ${s.name} D:${s.damage}/${s.hull} EXP:${s.experience}`)
    })
    console.log(uns);
    
    // console.log("Units left", combat.units);
    // console.log(combat.log);


  });

})