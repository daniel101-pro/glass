"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

// Dynamically import the R3F Canvas component (no SSR)
const FluidGlass = dynamic(() => import("./FluidGlass/FluidGlass"), {
  ssr: false,
  loading: () => null,
});

// Guard rendering to a single mount on client (avoids createRoot twice in dev)
export default function FluidGlassClient() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
        zIndex: 9999,
        // TEMP DEBUG BACKDROP to confirm mount (remove after verification)
        background: "rgba(0,255,255,0.02)",
      }}
    >
      <FluidGlass
        mode="lens"
        lensProps={{
          scale: 0.5,
          ior: 1.2,
          thickness: 8,
          chromaticAberration: 0.25,
          anisotropy: 0.02,
        }}
      />
    </div>
  );
}
