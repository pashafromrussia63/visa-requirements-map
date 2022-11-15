import React, { useState } from 'react';
import ReactTooltip from "react-tooltip";
import './App.scss';
import MapChart from './components/Map/Map';

function App() {
  const [content, setContent] = useState("");
  const [sidebar, setSidebar] = useState('');

  return (
    <div className="app">
      <div className="map">
        <div data-tip="">
          <MapChart setTooltipContent={setContent} setSidebarContent={setSidebar}/>
        </div>
        <ReactTooltip>{content}</ReactTooltip>
      </div>
      <button className='button' onClick={() => setSidebar('')}>Reset</button>
      <div
        className={`sidebar ${!!sidebar ? 'sidebar--isOpen' : ''}`}
      >{sidebar}</div>
    </div>
  );
}

export default App;
