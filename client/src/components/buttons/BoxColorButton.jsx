import React from "react";
import { Button, Stack, Box } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";

/**
 BoxColorButton -Cycles through a palette of colors for annotation boxes
 Props:- value: current color string, onChange: (nextColor) => void,palette?: string[] (optional, default provided)
**/
export default function BoxColorButton({ value, onChange, palette }) {
  const colors = palette?.length
    ? palette
    : ["#e53935", "#1e88e5", "#43a047", "#fdd835", "#8e24aa"];

  const handleClick = () => {
    const idx = colors.indexOf(value);
    const next = idx === -1 ? colors[0] : colors[(idx + 1) % colors.length];
    onChange?.(next);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        variant="outlined"
        startIcon={<PaletteIcon />}
        onClick={handleClick}
      >
        Change Box Color
      </Button>
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: "8px",
          border: "1px solid rgba(0,0,0,0.15)",
          bgcolor: value || colors[0],
        }}
        title={`Current: ${value || colors[0]}`}
      />
    </Stack>
  );
}
