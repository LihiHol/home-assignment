import { styled, Button } from "@mui/material";

/** Unified styled button for RightPanel controls **/
const PanelButton = styled(Button)(() => ({
  height: 46,
  width: "100%",
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 8,
  backgroundColor: "#111827",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#374151",
  },
}));

export default PanelButton;
