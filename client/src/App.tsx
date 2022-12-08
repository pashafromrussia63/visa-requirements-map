import React, { useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import ReactTooltip from "react-tooltip";
import './App.scss';
import MapChart from './components/Map/Map';

function App() {
  const [content, setContent] = useState("");
  const [sidebar, setSidebar] = useState({
    name: '',
    iso2: '',
    status: '',
    stay: 0
  });
  const [sidebarVisiblity, setSidebarVisibility] = useState(false);

  const mapLegend = [
    {
      color: '#1191e5',
      label: 'Internal passport'
    },
    {
      color: '#22b14c',
      label: 'Visa not required'
    },
    {
      color: '#79d343',
      label: 'eVisa / Visa on arrival'
    },
    {
      color: '#b5e61d',
      label: 'Visa on arrival'
    },
    {
      color: '#61c29c',
      label: 'eVisa'
    },
    {
      color: '#ababab',
      label: 'Visa required'
    },
    {
      color: '#000000',
      label: 'Admission refused for tourists'
    },
    {
      color: '#000133',
      label: 'Disputed'
    },
  ]

  useEffect(() => {
    console.log('sidebar', sidebar);
  }, [sidebar]);

  return (
    <div className="app">
      <div className="legend">
        {
          mapLegend.map((item) => (
            <div
              key={item.label}
              className="legend-item"
            >
              <div className="legend-swatch" style={{backgroundColor: item.color}}></div>
              <span className="legend-label">{item.label}</span>
            </div>
          ))
        }
      </div>
      <div className="map">
        <div data-tip="">
          <MapChart setTooltipContent={setContent} setSidebarContent={setSidebar} setSidebarVisibility={setSidebarVisibility}/>
        </div>
        <ReactTooltip>{content}</ReactTooltip>
      </div>
      <div
        className={`sidebar ${sidebarVisiblity ? 'sidebar--isOpen' : ''}`}
      >
        <button className='button' onClick={() => setSidebarVisibility(false)}>X</button>
        <div className="sidebar-flag">
          {
            sidebar.iso2 ?  <CircleFlag countryCode={sidebar.iso2} height="200" /> : null
          }
        </div>
        <div>{sidebar.name}</div>
        <div>{sidebar.status}</div>
        {
          (sidebar.stay) ? <div>Duration of stay: {sidebar.stay}</div> : null
        }
      </div>
    </div>
  );
}

export default App;
