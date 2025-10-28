import React, { useRef, useState } from "react";
import { getImageByName } from "../../services/api"
import { Stack, Button, Typography, CircularProgress } from "@mui/material";
import PanelButton from "../buttons/PanelButton";
/**
  Image selector: User picks file and I resolve it from backend by filename
  If found, emit the server image object (id, filename, url, width, height)
**/
export default function ImageSelector({ value, onChange }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const openPicker = () => inputRef.current?.click();

  const onFile = async (e) => {
    setErr("");
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await getImageByName(file.name);
      onChange?.(data); // { id, filename, url, width, height }
    } catch {
      setErr("Image not found in DB. Pick a file that exists on the server.");
    } finally {
      setLoading(false);
      e.target.value = ""; // reset input
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" onChange={onFile} hidden />
      <PanelButton variant="contained" onClick={openPicker} disabled={loading}>
        {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Choose from File System"}
      </PanelButton>
      {err && <Typography color="error" variant="body2">{err}</Typography>}
    </Stack>
  );
}

