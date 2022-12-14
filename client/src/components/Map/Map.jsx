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
    case 'Visa on arrival / eVisa': return '#32cd32';
    case 'eVisa': return '#61c29c';
    case 'Visa on arrival': return '#79d343';
    case 'Internal passport': return '#1191e5';
    case 'Admission refused for tourists': return '#000000';
    case 'Visa required': return '#ababab';
    case 'Disputed': return '#000133';
    default: return '#ababab';
  }
};

const MapChart = ({setTooltipContent, setSidebarContent, setSidebarVisibility}) => {
  const [data, setData] = useState([]);
  const [position, setPosition] = useState({ coordinates: [76.2673, 9.9312], zoom: 4 });

  const mapWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const mapHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  // const mapWidth = 800;
  // const mapHeight = 1700;

  const markers = [
    { name: "Andorra", id: 'AND', coordinates: [1.5218, 42.5063] },
    { name: "San Marino", id: 'SMR', coordinates: [12.4578, 43.9424] },
    { name: "Liechtenstein", id: 'LIE', coordinates: [9.5209, 47.1410] },
    { name: "Monaco", id: 'MCO', coordinates: [7.4246, 43.7384] },
    { name: 'Malta', id: 'MLT', coordinates: [14.3754, 35.9375], isIsland: true },
    { name: 'Bahrain', id: 'BHR', coordinates: [50.5876, 26.2235] },
    { name: 'Hong Kong', id: 'HKG', coordinates: [114.5000, 22.5000], isIsland: true },
    { name: 'Macau', id: 'MAC', coordinates: [113.5000, 22.0000], isIsland: true },
    { name: 'Maldives', id: 'MDV', coordinates: [73.5093, 4.1755], isIsland: true },
    { name: 'Seychelles', id: 'SYC', coordinates: [55.4920, -4.6796], isIsland: true},
    { name: 'Comoros', id: 'COM', coordinates: [43.2473, -11.7172], isIsland: true },
    { name: 'Mauritius', id: 'MUS', coordinates: [57.5522, -20.3484] },
    { name: 'Cape Verde', id: 'CPV', coordinates: [-23.5133, 14.9330], isIsland: true },
    { name: 'Sao Tome and Principe', id: 'STP', coordinates: [6.6131, 0.1864], isIsland: true },
    { name: 'Antigua and Barbuda', id: 'ATG', coordinates: [-61.8468, 17.1274], isIsland: true },
    { name: 'Barbados', id: 'BRB', coordinates: [-59.6132, 13.1060], isIsland: true },
    { name: 'Dominica', id: 'DMA', coordinates: [-61.3710, 15.4150], isIsland: true },
    { name: 'Grenada', id: 'GRD', coordinates: [-61.6790, 12.1165], isIsland: true },
    { name: 'Saint Kitts and Nevis', id: 'KNA', coordinates: [-62.7830, 17.3578], isIsland: true },
    { name: 'Saint Lucia', id: 'LCA', coordinates: [-60.9789, 13.9094], isIsland: true },
    { name: 'Saint Vincent and the Grenadines', id: 'VCT', coordinates: [-61.2872, 12.9843], isIsland: true },
    { name: 'Singapore', id: 'SGP', coordinates: [103.8198, 1.3521] },
    { name: 'Palau', id: 'PLW', coordinates: [134.5825, 7.5150] },
    { name: 'Nauru', id: 'NRU', coordinates: [166.9315, -0.5228] },
    { name: 'Tuvalu', id: 'TUV', coordinates: [177.6493, -7.1095] },
    { name: 'Tonga', id: 'TON', coordinates: [-175.1982, -21.1790] },
    { name: 'Samoa', id: 'WSM', coordinates: [-172.1046, -13.7590] },
    { name: 'Micronesia', id: 'FSM', coordinates: [150.5508, 7.4256] },
    { name: 'Marshall Islands', id: 'MHL', coordinates: [171.1845, 7.1315] },
    { name: 'Kiribati', id: 'KIR', coordinates: [-157.3768, 1.8369] },
  ];

  function handleZoomIn() {
    if (position.zoom >= 16) return;
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
        width={mapWidth}
        height={mapHeight}
      >
        {data.length > 0 && (
          <ZoomableGroup
            className="map-zoomableGroup"
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            translateExtent={[
              [-100, -200],
              [mapWidth + 100, mapHeight + 100]
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
                      stroke="#ffffff"
                      strokeWidth="0.1"
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
                        setTooltipContent("");
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {markers.map(({ name, coordinates, id,  isIsland }) => {
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
                  setSidebarContent(country);
                  setTooltipContent("");
                }}
        >
                  <circle
                    r="1"
                    fill={getColor(country)}
                    stroke='#fff'
                    strokeWidth="0.1"
                  />
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
