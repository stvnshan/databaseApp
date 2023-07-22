const incident = require('../models/incident.js');
const victim = require('../models/victim.js');
const agency = require('../models/agency.js');
const city = require('../models/city.js');

let tc = 1;

const testFind = async (relation, params) => {
  res = await relation.find(params);
  console.log(`Test case #${tc++}:`);
  console.log(JSON.stringify(res));
  console.log();
}

const testFindBrief = async (relation, params) => {
  res = await relation.findBrief(params);
  console.log(`Test case #${tc++}:`);
  console.log(JSON.stringify(res));
  console.log();
}

const runSampleTests = async () => {
  try {
    // Incident
    console.log('Testing Incident schema...');
    const incidentTCs = [
      {id: 3}, {id: 1}, {idlow: 100}, {idhigh: 5}, {idlow: 3, idhigh: 5}, {agencyid: 73}, {agencyid: 1}, {agelow: 20, agehigh: 22},
      {victimname: 'Elliot'}, {victimname: 'Jones'}, {city: 'Wichita'}, {county: 'Mason'}, {county: 'Honolulu'},
      {state: 'CA'}, {state: 'NB'}, {agencyname: 'Abbeville County Sheriff\'s Office'},
      {agencyname: 'Sheriff'}, {idlow: 10, state: 'WA', agencyname: 'Police'}, {agehigh: 40, idhigh: 50, victimname: 'Max'},
      {county: 'St. Louis City', agencyname: 'Police', city: 'St. Louis'}
    ];

    for (let i = 0; i < incidentTCs.length; ++i) {
      await testFind(incident, incidentTCs[i]);
    }

    // Victim
    console.log('Testing Victim schema...');
    const victimTCs = [
      {id: 3}, {id: 1000}, {idlow: 1, idhigh: 3}, {idlow: 1000}, {idhigh: 10}, {agelow: 20, agehigh: 25},
      {agelow: 20, agehigh: 20}, {gender: 'male', agelow: 60}, {gender: 'female', idhigh: 10}, {name: 'Elliot'}, {name: 'Jeff'},
      {agelow: 20, name: 'Jake', idhigh: 1000}, {idlow: 10, gender: 'male', agehigh: 30}
    ];

    for (let i = 0; i < victimTCs.length; ++i) {
      await testFind(victim, victimTCs[i]);
    }

    // Agency
    console.log('Testing Agency schema...');
    const agencyTCs = [
      {id: 73}, {id: 340958}, {idlow: 20, idhigh: 50}, {idlow: 400}, {idhigh: 40}, {shootlow: 4, shoothigh: 4},
      {shootlow: 6}, {shoothigh: 1}, {shootlow: 10, shoothigh: 11}, {name: 'Abbeville County Sheriff\'s Office'},
      {name: 'Sheriff'}, {name: 'NaN'}, {state: 'WA'}, {state: 'NB'},
      {state: 'WA', name: 'Sheriff', idhigh: 100}, {shoothigh: 3, name: 'Police', idlow: 100},
      {idlow: 100, shootlow: 9, state: 'KY'}
    ];

    for (let i = 0; i < agencyTCs.length; ++i) {
      await testFind(agency, agencyTCs[i]);
    }

    const agencyBriefTCs = [
      {id: 491}, {name: 'Sheriff'}, {name: 'Abbeville County Sheriff\'s Office'}, {name: 'o'}
    ];

    for (let i = 0; i < agencyBriefTCs.length; ++i) {
      await testFindBrief(agency, agencyBriefTCs[i]);
    }

    // City
    console.log('Testing City schema...');
    const cityTCs = [
      {id: 1}, {id: 100}, {idlow: 1, idhigh: 3}, {idlow: 40}, {idhigh: 5}, {cityname: 'Shelton'}, {cityname: 'Seattle'},
      {county: 'Mason'}, {county: 'County'}, {state: 'CA'}, {state: 'NB'}, {cityname: 'Sh', state: 'WA'}, {idlow: 10, county: 'ea'}
    ];

    for (let i = 0; i < cityTCs.length; ++i) {
      await testFind(city, cityTCs[i]);
    }

  } catch (error) {
    console.error('Database SAMPLE unit testing error', error);
  }
}

const runProductionTests = async () => {
  try {
    // Incident
    console.log('Testing Incident schema...');
    const incidentTCs = [
      {id: 720}, {id: 1}, {idlow: 4001, idhigh: 4003}, {victimname: 'Elliot'}, {agencyname: 'Abbeville County Sheriff\'s Office'},
      {idhigh: 100, state: 'WA', agencyname: 'Police'}, {agehigh: 40, idlow: 5000, victimname: 'Cel'},
      {county: 'Mason', agencyname: 'Sheriff', city: 'Greenfield'},
      {idlow: 9000, state: 'WA', agencyname: 'Sheriff'}, {agehigh: 40, idhigh: 50, victimname: 'Max'},
      {county: 'St. Louis City', city: 'St. Louis', state: 'MO', idlow: 2400}
    ];

    for (let i = 0; i < incidentTCs.length; ++i) {
      await testFind(incident, incidentTCs[i]);
    }

    // Victim
    console.log('Testing Victim schema...');
    const victimTCs = [
      {id: 253}, {idlow: 1505, idhigh: 1507}, {idhigh: 3}, {name: 'Elliot'},
      {idlow: 5000, gender: 'male', agelow: 27, agehigh: 27}, {gender: 'female', idlow: 1000, name: 'Sam'},
      {agelow: 50, name: 'Jake', idhigh: 1000}, {idhigh: 5, gender: 'male', agehigh: 30}
    ];

    for (let i = 0; i < victimTCs.length; ++i) {
      await testFind(victim, victimTCs[i]);
    }

    // Agency
    console.log('Testing Agency schema...');
    const agencyTCs = [
      {id: 73}, {id: 340958}, {idlow: 500, idhigh: 510}, {idlow: 22000}, {idhigh: 3}, {shootlow: 100},
      {name: 'Abbeville County Sheriff\'s Office'}, {shootlow: 5, state: 'CA', name: 'Sheriff'},
      {state: 'WA', name: 'Sheriff', idhigh: 100}, {shootlow: 7, name: 'Police', idhigh: 100},
      {idlow: 100, shootlow: 9, state: 'KY'}
    ];

    for (let i = 0; i < agencyTCs.length; ++i) {
      await testFind(agency, agencyTCs[i]);
    }

    const agencyBriefTCs = [
      {id: 491}, {name: 'Abbeville County Sheriff\'s Office'}
    ];

    for (let i = 0; i < agencyBriefTCs.length; ++i) {
      await testFindBrief(agency, agencyBriefTCs[i]);
    }

    // City
    console.log('Testing City schema...');
    const cityTCs = [
      {id: 1}, {id: 100}, {idlow: 1, idhigh: 3}, {idhigh: 5}, {cityname: 'Shelton'}, {cityname: 'Seattle'},
      {county: 'Mason'}, {county: 'County'}, {cityname: 'Sh', state: 'WA'}, {idlow: 10, county: 'ea'}
    ];

    for (let i = 0; i < cityTCs.length; ++i) {
      await testFind(city, cityTCs[i]);
    }

  } catch (error) {
    console.error('Database PRODUCTION unit testing error', error);
  }
}

const testDatabase = async () => {
  try {
    if (process.env.ENVIRONMENT == 'sample') {
      await runSampleTests();
    } else if (process.env.ENVIRONMENT == 'production') {
      await runProductionTests();
    }

    console.log('Database unit testing complete');
  } catch (error) {
    console.error('Database unit testing error', error);
  }
}

module.exports = testDatabase;
