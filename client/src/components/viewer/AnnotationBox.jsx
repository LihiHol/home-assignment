import React from "react";
import { Box } from "@mui/material";

/**
 AnnotationBox
 Props:
 x, y, width, height
 imgWidth, imgHeight          : current displayed image size (px)
 naturalWidth, naturalHeight  : original image size (px)
 color                        : border color for the box
 score?                       : optional tooltip
 scalePercent?                : 100 = original; scales around box center
 */
export default function AnnotationBox({
  x,
  y,
  width,
  height,
  score,
  color = "#e53935",
  imgWidth,
  imgHeight,
  naturalWidth = 0,
  naturalHeight = 0,
  scalePercent = 100,
}) {
  if (
    [x, y, width, height].some((v) => v === undefined || v === null) ||
    !imgWidth ||
    !imgHeight
  ) {
    return null;
  }

  // Detect coordinate mode (normalized vs pixels)
  const isNormalized =
    Math.max(x, y, width, height) <= 1 && Math.min(x, y, width, height) >= 0;

  // Convert to screen coordinates
  let left, top, boxW, boxH;

  if (isNormalized) {
    // Normalized → multiply by current display size
    left = x * imgWidth;
    top = y * imgHeight;
    boxW = width * imgWidth;
    boxH = height * imgHeight;
  } else {
    // Pixels relative to original → scale to display
    const scaleX = naturalWidth ? imgWidth / naturalWidth : 1;
    const scaleY = naturalHeight ? imgHeight / naturalHeight : 1;
    left = x * scaleX;
    top = y * scaleY;
    boxW = width * scaleX;
    boxH = height * scaleY;
  }

  if (boxW <= 0 || boxH <= 0) return null;

  // Apply user scaling (10..300% allowed by UI), around the box center
  const s = Math.max(10, Math.min(300, Number(scalePercent))) / 100;
  if (s !== 1) {
    const cx = left + boxW / 2;
    const cy = top + boxH / 2;
    const newW = boxW * s;
    const newH = boxH * s;
    left = cx - newW / 2;
    top = cy - newH / 2;
    boxW = newW;
    boxH = newH;
  }

  return (
    <Box
      title={score != null ? `score: ${Number(score).toFixed(2)}` : undefined}
      sx={{
        position: "absolute",
        left,
        top,
        width: boxW,
        height: boxH,
        border: `2px solid ${color}`,
        borderRadius: "6px",
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    />
  );
}
