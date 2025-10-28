import React from "react";
import { Stack, Typography, Slider } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

/** ThresholdControl -  A slider to choose the minimum score (0.1) */

export default function ThresholdControl({ value = 0, onChange }) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TuneIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Threshold (score)
        </Typography>
      </Stack>
      <Slider
        value={value}
        min={0}
        max={1}
        step={0.01}
        onChange={(_, v) => onChange?.(Number(v))}
        valueLabelDisplay="auto"
        aria-label="Score threshold"
      />
    </Stack>
  );
}
