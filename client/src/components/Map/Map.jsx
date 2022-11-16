import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import './Map.scss';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

const geoUrl = "/world.json";

const getColor = (d) => {
  if(!d) return '#ababab';
  switch(d.status) {
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

const MapChart = ({setTooltipContent, setSidebarContent, setSidebarVisibility}) => {
  const [data, setData] = useState([]);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const mapWidth = 800;
  const mapHeight = 600;

  const markers = [
    { name: "Andorra", id: 'AND', coordinates: [1.5218, 42.5063] },
    { name: "San Marino", id: 'SMR', coordinates: [12.4578, 43.9424] },
    { name: "Liechtenstein", id: 'LIE', coordinates: [9.5209, 47.1410] },
    { name: "Monaco", id: 'MCO', coordinates: [7.4246, 43.7384] },
    { name: 'Malta', id: 'MLT', coordinates: [14.3754, 35.9375] },
    { name: 'Bahrain', id: 'BHR', coordinates: [50.0000, 27.0000] },
    { name: 'Maldives', id: 'MDV', coordinates: [73.5093, 4.1755] },
    { name: 'Seychelles', id: 'SYC', coordinates: [55.4920, -4.6796]},
    { name: 'Comoros', id: 'COM', coordinates: [43.2473, -11.7172] },
    { name: 'Cape Verde', id: 'CPV', coordinates: [-23.5133, 14.9330] },
    { name: 'Sao Tome and Principe', id: 'STP', coordinates: [6.6131, 0.1864] }
  ];

  function handleZoomIn() {
    if (position.zoom >= 5) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

  useEffect(() => {
    // get values for data
    csv(`/requirements.csv`).then((data) => {
      setData(data);
    });
  }, []);

  return (
    <div className="map">
      <ComposableMap
        projection = "geoMercator"
        projectionConfig = {{
          rotate: [-10, 0, 0],
          center: [0, -20],
          scale: 90
        }}
      >
        {data.length > 0 && (
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            translateExtent={[
              [-10, -10],
              [mapWidth + 10, mapHeight + 10]
            ]}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = data.find((s) => s.iso3 === geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
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
                        setSidebarVisibility(true);
                        setSidebarContent(d);
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {markers.map(({ name, coordinates, id }) => {
              const country = data.find((requirement) => requirement.iso3 === id);
              return <Marker
                key={name}
                coordinates={coordinates}
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
                  setTooltipContent(`${name}`);
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                }}
                onClick={() => {
                  setSidebarVisibility(true);
                  console.log(country);
                  setSidebarContent(country);
                }}
        >
                  <circle r={2} fill={getColor(country)} stroke='#fff'/>
              </Marker>
            })
          }
          </ZoomableGroup>
        )}
      </ComposableMap>
      <div className="controls">
          <button onClick={handleZoomIn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button onClick={handleZoomOut}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
  );
};

export default MapChart;
