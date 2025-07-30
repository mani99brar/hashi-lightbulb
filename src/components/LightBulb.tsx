// src/components/LightBulb.tsx
import React from "react";

export interface LightBulbProps {
  isOn: boolean;
}

const LightBulb: React.FC<LightBulbProps> = ({ isOn }) => (
  <div className={`body ${isOn ? "on" : ""}`}>
    <div className="hr" />
    <div className="hr2" />
    <div className="wire" />
    <div className="bulb">
      <span />
      <span />
    </div>
  </div>
);

export default LightBulb;
