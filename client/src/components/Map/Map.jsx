import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";

import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const geoUrl = "/world.json";

const getColor = (d) => {
  if(!d) return '#ababab';
  switch(d['Status']) {
    case 'Visa not required': return '#22b14c';
    case 'eVisa / Visa on arrival': return '#79d343';
    case 'eVisa': return '#61c29c';
    case 'Visa on arrival': return '#b5e61d';
    case 'Internal passport': return '#1191e5';
    case 'Admission refused for tourists': return '#000000';
    case 'Visa required': return '#ababab';
    case 'Disputed': return '#000133';
    default: return '#ababab';
  }
};

const MapChart = ({setTooltipContent, setSidebarContent}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // get values for data
    csv(`/requirements.csv`).then((data) => {
      setData(data);
    });
  }, []);

  return (
    <ComposableMap
      projection = "geoMercator"
      projectionConfig = {{
        rotate: [-10, 0, 0],
        center: [0, -20],
        scale: 90
      }}
    >
      {/* <Sphere stroke="#E4E5E6" strokeWidth={0.5} /> */}
      {data.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              console.log(geo.id);
              const d = data.find((s) => s.ISO3 === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  backgroundColor="skyblue"
                  fill={getColor(d)}
                  style={{
                    default: {
                      outline: "none"
                    },
                    hover: {
                      opacity: 0.8,
                      cursor: 'pointer',
                      outline: "none"
                    },
                    pressed: {
                      opacity: 0.5,
                      outline: "none"
                    }
                  }}
                  onMouseEnter={() => {
                    setTooltipContent(`${geo.properties.name}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  onClick={() => {
                    setSidebarContent(`${geo.properties.name}`);
                  }}
                />
              );
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  );
};

export default MapChart;
