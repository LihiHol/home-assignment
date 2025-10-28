import React, { useState } from "react";
import { CircularProgress, Alert } from "@mui/material";
import { listAnnotationsByImageId } from "../../services/api";
import PanelButton from "./PanelButton";

/** Fetch annotations only on button click; click again to hide. */
export default function ShowAnnotationsButton({ image, threshold = 0, onAnnotationsLoaded }) {
  const [active, setActive] = useState(false);     // view/hide state
  const [loading, setLoading] = useState(false);   
  const [error, setError] = useState("");          

  const handleClick = async () => {
    // If no image selected → do nothing
    if (!image?.id) return;

    // If already active → hide & clear
    if (active) {
      setActive(false);
      onAnnotationsLoaded?.([]);
      return;
    }

    // Otherwise fetch and show
    try {
      setError("");
      setLoading(true);
      const { data } = await listAnnotationsByImageId(image.id, threshold);
      onAnnotationsLoaded?.(Array.isArray(data) ? data : []);
      setActive(true);
    } catch {
      setError("Failed to load annotations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PanelButton
        onClick={handleClick}
        disabled={!image}
        variant="contained"
        sx={{
          bgcolor: active ? "#374151" : "#111827",
          color: "#fff",
          "&:hover": { bgcolor: active ? "#4b5563" : "#374151" },
        }}
      >
        {loading && active ? <CircularProgress size={20} sx={{ color: "#fff" }}/> 
                           : active ? "Hide Annotations" : "View Annotations"}
      </PanelButton>

      {error && <Alert severity="warning" sx={{ mt: 1 }}>{error}</Alert>}
    </>
  );
}
