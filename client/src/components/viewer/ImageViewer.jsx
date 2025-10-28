import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { API_BASE } from "../../services/api";
import AnnotationBox from "./AnnotationBox";

/** Displays the image and draws annotation boxes. */
export default function ImageViewer({
  image,
  annotations = [],
  color = "#e53935",
  scalePercent = 100,
}) {
  const imgRef = useRef(null);
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  // Recalculate current on-screen size of the <img> for correct overlay
  const recalc = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDisplaySize({ w: Math.round(rect.width), h: Math.round(rect.height) });
  }, []);

  useEffect(() => {
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  const onImgLoad = (e) => {
    const img = e.currentTarget;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    recalc();
  };

  if (!image?.url) {
    return <Box sx={{ color: "#6b7280" }}>No image selected.</Box>;
  }

  const src = `${API_BASE}${image.url}`;

  return (
    <Box sx={{ width: "100%", display: "inline-block" }}>
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          lineHeight: 0,
          maxWidth: "100%",
        }}
      >
        {/* Base image */}
        <img
          ref={imgRef}
          src={src}
          alt={image.filename || "image"}
          onLoad={onImgLoad}
          style={{ display: "block", maxWidth: "100%", height: "auto", userSelect: "none" }}
          draggable={false}
        />
        {/* Overlay with boxes */}
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
          {annotations.map((ann, idx) => (
            <AnnotationBox
              key={ann.id || idx}
              {...ann}
              color={color}
              imgWidth={displaySize.w}
              imgHeight={displaySize.h}
              naturalWidth={naturalSize.w}
              naturalHeight={naturalSize.h}
              scalePercent={scalePercent}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
