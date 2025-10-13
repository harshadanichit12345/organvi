/// <reference types="vite/client" />
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID, // from .env
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2025-01-01",
});
