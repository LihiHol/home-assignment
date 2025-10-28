import React, { useState } from "react";
import { Box, Paper, Divider } from "@mui/material";
import ImageSelector from "../selectors/ImageSelector";
import ShowAnnotationsButton from "../buttons/ShowAnnotationsButton";
import BoxColorButton from "../buttons/BoxColorButton";
import ResizeBoxesControl from "../controls/ResizeBoxesControl";
import ThresholdControl from "../controls/ThresholdControl";

/**  RightPanel - controls ->Annotations are fetched ONLY by the "View Annotations" button*/
export default function RightPanel({
  onImageResolved,
  onAnnotationsLoaded,
  width = 340,
  color,
  onColorChange,
  scalePercent,
  onScaleChange,
  threshold,
  onThresholdChange,
}) {
  const [image, setImage] = useState(null);
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        width,
        height: "100vh",
        px: 0,
        py: 0,
      }}
    >
      <Paper
        sx={{
          height: "100%",
          p: 2,
          display: "grid",
          alignContent: "start",
          gap: 3,
          bgcolor: "#ffffff",
        }}
      >
        {/* Image picker */}
        <ImageSelector
          onChange={(img) => {
            setImage(img);
            onImageResolved?.(img);
          }}
        />
        {/* Fetch only on button click */}
        <ShowAnnotationsButton
          image={image}
          threshold={threshold}
          onAnnotationsLoaded={onAnnotationsLoaded}
        />
        <Divider />
        {/* Color + Resize */}
        {onColorChange && <BoxColorButton value={color} onChange={onColorChange} />}
        {onScaleChange && <ResizeBoxesControl value={scalePercent} onChange={onScaleChange} />}
        <ThresholdControl value={threshold} onChange={onThresholdChange} />
      </Paper>
    </Box>
  );
}
