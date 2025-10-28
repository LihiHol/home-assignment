import React from "react";
import { Box } from "@mui/material";
import { API_BASE } from "../../services/api";

export default function ViewerCard({ image }) {
    if (!image?.url) {
        return <Box sx={{ color: "#6b7280" }}>No image selected.</Box>;
    }

    const src = `${API_BASE}${image.url}`; //server returns relative url like "/images/foo.jpg"

    return (
        <Box sx={{ width: "100%", display: "grid", placeItems: "center" }}>
            <img
                src={src}
                alt={image.filename || "image"}
                style={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    userSelect: "none",
                }}
                draggable={false}
            />
        </Box>
    );
}
