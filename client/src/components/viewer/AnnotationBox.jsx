import React from "react";
import { Box } from "@mui/material";

/** imgWidth, imgHeight-current displayed image size (px)
 naturalWidth, naturalHeight-original image size (px)*/
export default function AnnotationBox({
  x,
  y,
  width,
  height,
  color = "#e53935",
  imgWidth,
  imgHeight,
  naturalWidth = 0,
  naturalHeight = 0,
  scalePercent = 100,
}) {

  if (
    x == null || y == null ||
    width == null || height == null ||
    !imgWidth || !imgHeight
  ) return null;

  // Detect coordinate mode (normalized vs pixels)
  // const isNormalized =
  //   Math.max(x, y, width, height) <= 1 && Math.min(x, y, width, height) >= 0;

  // Convert to screen coordinates
  let left, top, boxW, boxH;
  // Normalized → multiply by current display size
  left = x * imgWidth;
  top = y * imgHeight;
  boxW = width * imgWidth;
  boxH = height * imgHeight;


  // if (isNormalized) {
  //   // Normalized → multiply by current display size
  //   left = x * imgWidth;
  //   top = y * imgHeight;
  //   boxW = width * imgWidth;
  //   boxH = height * imgHeight;
  // } else {
  //   // Pixels relative to original → scale to display
  //   const scaleX = naturalWidth ? imgWidth / naturalWidth : 1;
  //   const scaleY = naturalHeight ? imgHeight / naturalHeight : 1;
  //   left = x * scaleX;
  //   top = y * scaleY;
  //   boxW = width * scaleX;
  //   boxH = height * scaleY;
  // }

  if (boxW <= 0 || boxH <= 0) return null;

  // Apply scaling around box center(from the middle!!)
  let scale = scalePercent / 100;
  if (scale < 0.1) scale = 0.1;
  if (scale > 3) scale = 3;
  if (scale !== 1) {
    const centerX = left + boxW / 2;
    const centerY = top + boxH / 2;
    boxW *= scale;
    boxH *= scale;
    left = centerX - boxW / 2;
    top = centerY - boxH / 2;
  }


  return (
    <Box
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
