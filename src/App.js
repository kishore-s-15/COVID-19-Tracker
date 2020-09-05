import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import Table from './Table.js';
import InfoBox from './InfoBox.js';
import Map from './Map.js';
import LineGraph from './LineGraph.js';
import './App.css';
import { sortData, prettyPrintStat } from './utils.js';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(['worldwide']);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapzoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2 
        }));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode.name}`;

    await fetch(url).then(response => response.json())
      .then(data => {
        // Changing the country
        setCountry(countryCode);

        // Saving the data into countryInfo
        setCountryInfo(data);

        // Setting the map latitude and longitude
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      });
    
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange = {onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
              active={casesType === "cases"}
              isRed
              onClick={e => setCasesType('cases')}
              title={<strong>Cornavirus Cases</strong>}
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox 
              active={casesType === "recovered"} 
              onClick={e => setCasesType('recovered')}
              title={<strong>Recovered</strong>} 
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox 
              active={casesType === "deaths"} 
              isRed
              onClick={e => setCasesType('deaths')}
              title={<strong>Deaths</strong>} 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
    
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            {/* Table */}
            <Table countries={tableData}/>

            {/* Graph */}
            <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType}/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
