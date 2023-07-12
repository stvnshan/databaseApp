const pool = require('./pool');
const incident = require('../models/incident.js');
const victim = require('../models/victim.js');
const agency = require('../models/agency.js');
const city = require('../models/city.js');

let tc = 0;

const pdb = (arg) => {
  console.log(`Test case #${tc++}:`);
  console.log(JSON.stringify(arg));
  console.log();
}

const runSampleTests = async () => {
  try {
    // Incident
    console.log("Testing Incident schema...");
    res = await incident.findByID(3);
    pdb(res);
    res = await incident.findByID(1);
    pdb(res);
    res = await incident.findByRangeID();
    pdb(res);
    res = await incident.findByRangeID(3, 5);
    pdb(res);
    res = await incident.findByAgencyID(73);
    pdb(res);
    res = await incident.findByAgencyID(1);
    pdb(res);
    res = await incident.findByRangeAge(10, 30);
    pdb(res);
    res = await incident.searchByVictimName("Elliot");
    pdb(res);
    res = await incident.searchByVictimName("Jones");
    pdb(res);
    res = await incident.searchByVictimName("");
    pdb(res);
    res = await incident.searchByCityName("Wichita");
    pdb(res);
    res = await incident.searchByCityName("");
    pdb(res);
    res = await incident.searchByCounty("Mason");
    pdb(res);
    res = await incident.searchByCounty("Honolulu");
    pdb(res);
    res = await incident.searchByCounty("");
    pdb(res);
    res = await incident.searchByState("CA");
    pdb(res);
    res = await incident.searchByState("NB");
    pdb(res);
    res = await incident.searchByState("");
    pdb(res);
    res = await incident.searchByAgencyName("Abbeville County Sheriff's Office");
    pdb(res);
    res = await incident.searchByAgencyName("Sheriff");
    pdb(res);
    res = await incident.searchByAgencyName("");
    pdb(res);

    // Victim
    console.log("Testing Victim schema...");
    res = await victim.findByID(3);
    pdb(res);
    res = await victim.findByID(1000);
    pdb(res);
    res = await victim.findByRangeID(0, 10);
    pdb(res);
    res = await victim.findByRangeID(1, 3);
    pdb(res);
    res = await victim.findByRangeID();
    pdb(res);
    res = await victim.findByRangeAge(0, 10);
    pdb(res);
    res = await victim.findByRangeAge(20, 30);
    pdb(res);
    res = await victim.findByRangeAge(30, 50);
    pdb(res);
    res = await victim.findByGender("male");
    pdb(res);
    res = await victim.findByGender("female");
    pdb(res);
    res = await victim.findByGender("");
    pdb(res);
    res = await victim.searchByName("Elliot");
    pdb(res);
    res = await victim.searchByName("Jeff");
    pdb(res);
    res = await victim.searchByName("");
    pdb(res);

    // Agency
    console.log("Testing Agency schema...");
    res = await agency.findByID(73);
    pdb(res);
    res = await agency.findByID(340958);
    pdb(res);
    res = await agency.findByRangeTotalIncidents(0, 1);
    pdb(res);
    res = await agency.findByRangeTotalIncidents(0, 5);
    pdb(res);
    res = await agency.findByRangeTotalIncidents(0, 100);
    pdb(res);
    res = await agency.findByRangeTotalIncidents(100, 200);
    pdb(res);
    res = await agency.findByRangeID(0, 100);
    pdb(res);
    res = await agency.findByRangeID(1000, 2000);
    pdb(res);
    res = await agency.findByRangeID(3450934, 3984571);
    pdb(res);
    res = await agency.findByRangeID();
    pdb(res);
    res = await agency.searchByName("Abbeville County Sheriff's Office");
    pdb(res);
    res = await agency.searchByName("Sheriff");
    pdb(res);
    res = await agency.searchByName("NaN");
    pdb(res);
    res = await agency.searchByName("");
    pdb(res);
    res = await agency.searchByState("WA");
    pdb(res);
    res = await agency.searchByState("NB");
    pdb(res);

    // City
    console.log("Testing City schema...");
    res = await city.findByID(1);
    pdb(res);
    res = await city.findByID(100);
    pdb(res);
    res = await city.findByRangeID(1, 3);
    pdb(res);
    res = await city.findByRangeID(200, 201);
    pdb(res);
    res = await city.findByRangeID();
    pdb(res);
    res = await city.searchByName("Shelton");
    pdb(res);
    res = await city.searchByName("Seattle");
    pdb(res);
    res = await city.searchByName("");
    pdb(res);
    res = await city.searchByCounty("Mason");
    pdb(res);
    res = await city.searchByCounty("Aenami");
    pdb(res);
    res = await city.searchByCounty("");
    pdb(res);
    res = await city.searchByState("CA");
    pdb(res);
    res = await city.searchByState("NB");
    pdb(res);
    res = await city.searchByState("");
    pdb(res);
  } catch (error) {
    console.error("Database SAMPLE unit testing error", error);
  }
}

const runProductionTests = async () => {
  try {
    // Incident
    res = await incident.findByID(720);
    pdb(res);
    res = await incident.searchByVictimName("Elliot");
    pdb(res);
    res = await victim.findByRangeAge(37, 37);
    pdb(res);
    res = await incident.searchByAgencyName("Abbeville County Sheriff's Office");
    pdb(res);

    // Victim
    res = await victim.findByID(253);
    pdb(res);
    res = await victim.findByRangeID(1500, 1505);
    pdb(res);
    res = await victim.findByRangeAge(50, 50);
    pdb(res);
    res = await victim.searchByName("McCallum");
    pdb(res);

    // Agency
    res = await agency.findByID(75);
    pdb(res);
    res = await agency.findByRangeTotalIncidents(12, 13);
    pdb(res);
    res = await agency.searchByName("Abbeville County Sheriff's Office");
    pdb(res);

    // City
    res = await city.findByID(1);
    pdb(res);
    res = await city.searchByName("Seattle");
    pdb(res);
    res = await city.searchByCounty("Mason");
    pdb(res);

  } catch (error) {
    console.error("Database PRODUCTION unit testing error", error);
  }
}

const testDatabase = async () => {
  try {
    let res;

    if (process.env.ENVIRONMENT == 'sample') {
      await runSampleTests();
    } else if (process.env.ENVIRONMENT == 'production') {
      await runProductionTests();
    }

    console.log("Database unit testing complete");
  } catch (error) {
    console.error("Database unit testing error", error);
  }
}

module.exports = testDatabase;
