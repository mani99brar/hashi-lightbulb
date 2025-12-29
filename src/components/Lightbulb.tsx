import React from "react";

interface LightbulbProps {
  isOn: boolean | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Lightbulb({
  isOn,
  className = "",
  size = "md",
}: LightbulbProps) {
  const lightbulbStyles = `
    .wrapper { 
      min-height: 100px; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
    }
    .bulb { 
      position: relative; 
      width: 80px; 
      height: 80px; 
      background: #666; 
      border-radius: 50%; 
      transform: rotate(180deg); 
      margin: -50px auto 0; 
    }
    .bulb::before { 
      content: ''; 
      position: absolute; 
      top: -50px; 
      left: 22.5px; 
      width: 35px; 
      height: 80px; 
      background: #666; 
      border-top: 30px solid #000; 
      border-radius: 10px; 
    }
    .bulb span:nth-child(1),
    .bulb span:nth-child(2) { 
      position: absolute; 
      display: block; 
      width: 30px; 
      height: 30px; 
      background: transparent; 
    }
    .bulb span:nth-child(1) { 
      top: -16px; 
      left: -4px; 
      transform: rotate(342deg); 
      border-bottom-right-radius: 40px; 
      box-shadow: 20px 20px 0 10px #666; 
    }
    .bulb span:nth-child(2) { 
      top: -16px; 
      right: -4px; 
      transform: rotate(17deg); 
      border-bottom-left-radius: 40px; 
      box-shadow: -20px 20px 0 10px #666; }
    
    .bulb-container.on .bulb { 
      background: #fff; 
      box-shadow: 0 0 30px #fff, 0 0 60px #fff, 0 0 90px #fff, 0 0 120px #fff; 
    }
    .bulb-container.on .bulb::before { background: #fff; }
    .bulb-container.on .bulb::after { 
      content: ''; 
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%); 
      width: 120px; 
      height: 120px; 
      background: #fff; 
      border-radius: 50%; 
      filter: blur(40px); 
    }
    .bulb-container.on .bulb span:nth-child(1) { 
      box-shadow: 20px 20px 0 10px #fff; 
    }
    .bulb-container.on .bulb span:nth-child(2) { 
      box-shadow: -20px 20px 0 10px #fff; 
    }
  `;

  const sizeStyles = {
    sm: "scale-75",
    md: "",
    lg: "scale-125",
  };

  const statusClass = isOn === null ? "opacity-50" : isOn ? "on" : "";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: lightbulbStyles }} />
      <div className={`wrapper ${sizeStyles[size]} ${className}`}>
        <div className={`bulb-container ${statusClass}`}>
          <div className="bulb">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </>
  );
}
