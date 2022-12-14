import React, { useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import ReactTooltip from "react-tooltip";
import './App.scss';
import MapChart from './components/Map/Map';
import { ReactComponent as CrossIcon } from './assets/icons/cross.svg';

function App() {
  const [content, setContent] = useState("");
  const [sidebar, setSidebar] = useState({
    name: '',
    iso2: '',
    status: '',
    stay: 0,
    cost: '',
    notes: ''
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
      color: '#32cd32',
      label: 'Visa on arrival / eVisa'
    },
    {
      color: '#79d343',
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

  const getColor = (label: string) => {
    return mapLegend.find((item) => item.label === label)?.color;
  }

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
        style={{backgroundColor: getColor(sidebar.status)}}
      >
        <CrossIcon
          className='sidebar-close'
          onClick={() => setSidebarVisibility(false)}
        />
        <div className="sidebar-flag">
          {
            sidebar.iso2 ?  <CircleFlag countryCode={sidebar.iso2} height="200" /> : null
          }
        </div>
        <div className="sidebar-label sidebar-label--title">{sidebar.name}</div>
        <div className="sidebar-label">{sidebar.status}</div>
        {
          (sidebar.stay) ? <div  className="sidebar-label">Duration of stay: {sidebar.stay}</div> : null
        }
        {
          (sidebar.cost) ? <div  className="sidebar-label">Visa fee: {sidebar.cost}</div> : null
        }
        {
          (sidebar.notes) ? <div  className="sidebar-label">Notes: {sidebar.notes}</div> : null
        }
      </div>
    </div>
  );
}

export default App;
