"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LiveScene = dynamic(() => import("./LiveScene"), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function LiveBackground() {
  // Default to false so the first client render matches the server (fallback),
  // then swap to the live scene after mount.
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {webgl ? (
        <LiveScene />
      ) : (
        <div className="bg-scene-static absolute inset-0" aria-hidden />
      )}
    </div>
  );
}
