import * as React from "react";
const Star = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    viewBox="0 0 15 15"
    {...props}
  >
    <path
      style={{
        fill: "none",
        strokeWidth: 10,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        stroke: "#fff",
        strokeOpacity: 1,
        strokeMiterlimit: 4,
      }}
      d="m49.61 49.61-16.33-5.548-13.81 10.312.218-17.234-14.062-9.953 16.453-5.11 5.11-16.453 9.953 14.063 17.234-.22L44.063 33.28Zm0 0"
      transform="scale(.25)"
    />
    <path
      style={{
        fillRule: "evenodd",
        fill: "#ffe940",
        fillOpacity: 1,
        strokeWidth: 5,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        stroke: "#000",
        strokeOpacity: 1,
        strokeMiterlimit: 4,
      }}
      d="m49.61 49.61-16.33-5.548-13.81 10.312.218-17.234-14.062-9.953 16.453-5.11 5.11-16.453 9.953 14.063 17.234-.22L44.063 33.28Zm0 0"
      transform="scale(.25)"
    />
  </svg>
);
export default Star;
