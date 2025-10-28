import React from "react";
import { Stack, Typography, Slider, TextField } from "@mui/material";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

/**  Controls annotation box size by percentage (100% = original)*/
export default function ResizeBoxesControl({ value = 100, onChange }) {
  const min = 10;
  const max = 300;

  const handleSlider = (_, v) => {
    onChange?.(Number(v));
  };

  const handleInput = (e) => {
    const raw = Number(e.target.value);
    if (Number.isNaN(raw)) return;
    const clamped = Math.min(max, Math.max(min, raw));
    onChange?.(clamped);
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <ZoomOutMapIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Resize Boxes (%)
        </Typography>
      </Stack>

      <Slider
        value={value}
        min={min}
        max={max}
        step={5}
        onChange={handleSlider}
        valueLabelDisplay="auto"
        aria-label="Resize boxes percentage"
      />

      <TextField
        type="number"
        size="small"
        value={value}
        onChange={handleInput}
        inputProps={{ min, max, step: 5 }}
        helperText="100% = original size (scales around center)"
      />
    </Stack>
  );
}
