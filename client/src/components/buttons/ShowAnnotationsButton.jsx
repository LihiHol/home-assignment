import React, { useEffect, useState, useRef } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import { listAnnotationsByImageId } from "../../services/api";
import PanelButton from "./PanelButton";

/** Show or hides annotations for a given image */
export default function ShowAnnotationsButton({
  image,
  threshold = 0,
  onAnnotationsLoaded,
}) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  // Load annotations only when "View" clicked and active
  useEffect(() => {
    if (!active || !image?.id) return;

    const fetchAnnotations = async () => {
      try {
        setError("");
        setLoading(true);
        abortRef.current?.abort?.();
        const ac = new AbortController();
        abortRef.current = ac;

        const { data } = await listAnnotationsByImageId(
          image.id,
          threshold,
          { signal: ac.signal }
        );
        onAnnotationsLoaded?.(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") setError("Failed to load annotations");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnotations();
    return () => abortRef.current?.abort?.();
  }, [active, image?.id]); // threshold is intentionally ignored

  const toggle = () => {
    if (active) {
      setActive(false);
      onAnnotationsLoaded?.([]); // clear on hide
    } else {
      setActive(true);
    }
  };

  return (
    <>
      <PanelButton
        variant="contained"
        onClick={toggle}
        disabled={!image}
        sx={{
          bgcolor: active ? "#374151" : "#111827",
          color: "#fff",
          "&:hover": { bgcolor: active ? "#4b5563" : "#374151" },
        }}
      >
        {loading && active ? (
          <CircularProgress size={20} sx={{ color: "#fff" }} />
        ) : active ? (
          "Hide Annotations"
        ) : (
          "View Annotations"
        )}
      </PanelButton>
      {error && <Alert severity="warning" sx={{ mt: 1 }}>{error}</Alert>}
    </>
  );
}
