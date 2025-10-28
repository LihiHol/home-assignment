import React from "react";
import { Button, Stack, Box } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";

/** BoxColorButton -Cycles through a palette of colors for annotation boxes**/
export default function BoxColorButton({ value, onChange, palette }) {
  const colors = palette?.length
    ? palette
    : ["#e53935", "#1e88e5", "#43a047", "#fdd835", "#8e24aa"];

  const handleClick = () => {
    let nextColor;
    if (!value) {
      nextColor = colors[0];
    }
    else if (value === colors[colors.length - 1]) {
      nextColor = colors[0];
    }
    else {
      const currentIndex = colors.indexOf(value);
      nextColor = colors[currentIndex + 1];
    }
    onChange && onChange(nextColor);
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
