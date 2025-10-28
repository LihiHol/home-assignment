import axios from "axios";

export const API_BASE = "http://localhost:8000"; 
export const api = axios.create({ baseURL: API_BASE });

export const getImageByName = (filename) =>
  api.get("/api/images/by-name", { params: { filename } });

export const listAnnotationsByImageId = (imageId, minScore = 0) =>
  api.get("/api/annotations/by-id", { params: { image_id: imageId, min_score: minScore } });
