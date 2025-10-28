import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import RightPanel from "../components/layout/RightPanel";
import ImageViewer from "../components/viewer/ImageViewer";

/**top-level state holder- Shows annotations immediately after ShowAnnotationsButton fetches them.*/
export default function HomePage() {
    const [image, setImage] = useState(null);
    const [annotations, setAnnotations] = useState([]);

    const [color, setColor] = useState("#e53935");
    const [scalePercent, setScalePercent] = useState(100);
    const [threshold, setThreshold] = useState(0);

    const PANEL_WIDTH = 340;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#5f5c5cff" }}>
            <RightPanel
                width={PANEL_WIDTH}
                onImageResolved={(img) => {
                    setImage(img);
                    setAnnotations([]); // reset on image change
                }}
                onAnnotationsLoaded={(anns) => setAnnotations(Array.isArray(anns) ? anns : [])}
                color={color}
                onColorChange={setColor}
                scalePercent={scalePercent}
                onScaleChange={setScalePercent}
                threshold={threshold}
                onThresholdChange={setThreshold}
            />

            <Box
                sx={{
                    pr: `${PANEL_WIDTH + 24}px`,
                    pl: 2,
                    py: 2,
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <Paper
                    sx={{
                        width: "100%",
                        maxWidth: 1100,
                        minHeight: "70vh",
                        p: 2,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "transparent"
                    }}
                >
                    {image ? (
                        <ImageViewer
                            image={image}
                            annotations={annotations}  
                            color={color}
                            scalePercent={scalePercent}
                        />
                    ) : (
                        <Typography sx={{ opacity: 0.7 }}>
                            Choose an image from the right panel…
                        </Typography>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
