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

  useEffect(() => {
    console.log('sidebar', sidebar);
  }, [sidebar]);

  return (
    <div className="app">
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
