import { Html } from "@react-three/drei";
import React from "react";

interface StationLabelProps {
  position: [number, number, number];
  number?: string;
  label: string;
}

const CONTAINER_STYLE: React.CSSProperties = {
  fontFamily: "'Instrument Serif', serif",
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  minWidth: "300px",
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  textAlign: "center",
  pointerEvents: "none",
  userSelect: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
};

const NUMBER_STYLE: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  lineHeight: "1.1",
};

const LABEL_STYLE_BASE: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.03em",
};

export const StationLabel = ({ position, number, label }: StationLabelProps) => {
  return (
    <Html position={[position[0], position[1] + 1.0, position[2]]} center distanceFactor={10}>
      <div style={CONTAINER_STYLE}>
        {number && <div style={NUMBER_STYLE}>{number}</div>}
        <div
          style={{
            ...LABEL_STYLE_BASE,
            marginTop: number ? "2px" : "0px",
          }}
        >
          {label}
        </div>
      </div>
    </Html>
  );
};
