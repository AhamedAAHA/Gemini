import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BillScope",
    short_name: "BillScope",
    description: "Find the money you don't owe on your medical bill.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#030712",
  };
}
