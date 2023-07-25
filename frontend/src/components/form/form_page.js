import React, { useState } from "react";
import axios from "axios";
import MainNav from "../shared/nav";
import {
  SearchField,
  SearchDateField,
  SearchDropdownField,
} from "../shared/search";

const apiHost = String(process.env.REACT_APP_API_HOST);

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
  'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
  'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
  'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
];

const IncidentForm = () => {

  let agencyExists = false;
  let agencyid = null;

  const [victimName, setVictimName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [raceSource, setRaceSource] = useState("");
  const [cityName, setCityName] = useState("");
  const [county, setCounty] = useState("");
  const [state, setState] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [threatType, setThreatType] = useState("");
  const [fleeStatus, setFleeStatus] = useState("");
  const [armedWith, setArmedWith] = useState("");
  const [mentalIllness, setMentalIllness] = useState("");
  const [bodyCameraOn, setBodyCameraOn] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const SubmitFormIfValid = async () => {
    // Check if Agency name exists
    try {
      const urlStr = apiHost.concat(
        `/agencybrief?name=${encodeURIComponent(agencyName)}`
      );
      console.log(urlStr);
      const response = await axios.get(urlStr);
      console.log(response);

      // Logic for checking if agency exists
      for (const agency of response.data) {
        if (agency.agencyname.toLowerCase() === agencyName.toLowerCase()) {
          agencyExists = true;
          agencyid = agency.agencyid;
          break;
        }
      }
      console.log('Agency exists:', agencyExists);
      if (!agencyExists) {
        return;
      }
    } catch (err) {
      console.error(err);
      return;
    }

    // Submit the incident via POST request
    try {
      const postData = {
        victimname: victimName,
        age: age,
        gender: gender,
        race: race,
        raceSource: raceSource,
        cityname: cityName,
        county: county,
        state: state,
        date: incidentDate,
        threatenType: threatType,
        fleeStatus: fleeStatus,
        armedWith: armedWith,
        wasMentalIllnessInvolved: mentalIllness,
        bodyCamera: bodyCameraOn,
        latitude: latitude,
        longitude: longitude,
        agencyid: [agencyid.toString()]
      };
      const urlStr = apiHost.concat(`/incident?`);
      console.log('POST data:\n', postData);
      const response = await axios.post(urlStr, postData);
      console.log(response);
      console.log('Submitted post request!')
    } catch (err) {
      console.error(err);
    }

    agencyExists = false;
    agencyid = null;
  };

  return (
    <div>
      <SearchField
        title={"Victim name"}
        placeholderText={""}
        setSearchQuery={setVictimName}
      />

      <SearchField
        title={"Agency name"}
        placeholderText={""}
        setSearchQuery={setAgencyName}
      />

      <SearchField 
        title={"Age"} 
        placeholderText={""} 
        setSearchQuery={setAge} 
      />

      <SearchDropdownField
        title={"Gender"}
        options={[
          "male",
          "female",
          "unspecified"
        ]}
        selectedOption={gender}
        handleOptionChange={setGender}
      />

      <SearchField 
        title={"Race"} 
        placeholderText={""} 
        setSearchQuery={setRace} 
      />

      <SearchField 
        title={"Race Source"} 
        placeholderText={""} 
        setSearchQuery={setRaceSource} 
      />

      <SearchField 
        title={"City Name"} 
        placeholderText={""} 
        setSearchQuery={setCityName} 
      />

      <SearchField 
        title={"County"} 
        placeholderText={""} 
        setSearchQuery={setCounty} 
      />

      <SearchDropdownField
        title={"State"} 
        options={states}
        selectedOption={state}
        handleOptionChange={setState}
      />

      <SearchDateField
        selectedDate={incidentDate}
        handleDateChange={setIncidentDate}
      />

      <SearchDropdownField
        title={"Threat type"}
        options={[
          "point",
          "move",
          "attack",
          "shoot",
          "accident",
          "threat",
          "undetermined",
          "flee",
        ]}
        selectedOption={threatType}
        handleOptionChange={setThreatType}
      />

      <SearchDropdownField
        title={"Flee status"}
        options={["not", "car", "foot", "other"]}
        selectedOption={fleeStatus}
        handleOptionChange={setFleeStatus}
      />

      <SearchDropdownField
        title={"Mental illness was involved"}
        options={["TRUE", "FALSE"]}
        selectedOption={mentalIllness}
        handleOptionChange={setMentalIllness}
      />

      <SearchDropdownField
        title={"Body camera was on"}
        options={["TRUE", "FALSE"]}
        selectedOption={bodyCameraOn}
        handleOptionChange={setBodyCameraOn}
      />

      <SearchField
        title={"Armed with"}
        placeholderText={""}
        setSearchQuery={setArmedWith}
      />

      <SearchField
        title={"Latitude"}
        placeholderText={""}
        setSearchQuery={setLatitude}
      />

      <SearchField
        title={"Longitude"}
        placeholderText={""}
        setSearchQuery={setLongitude}
      />

      <button style={{ marginLeft: "2rem" }} onClick={SubmitFormIfValid}>
        Submit Incident
      </button>
    </div>
  );
};

const FormPage = () => {
  return (
    <div>
      <MainNav />
      <h1>Incident Submission</h1>
      <IncidentForm />
    </div>
  );
};

export default FormPage;
