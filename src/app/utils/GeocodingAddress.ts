// controllers/map.controller.ts
import { Request, Response } from "express";

// utils/googleMap.ts
import { Client } from "@googlemaps/google-maps-services-js";
import http from 'http-status-codes';
import AppError from "../errorHerlpers/AppError";
export const googleClient = new Client({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCoordinates = async (req: Request, res: Response) => {
  try {
    const { lat, long } = req.body;

    if (!lat || !long) {
      throw new AppError(http.NOT_FOUND, "lat and long required");
    }

    const response = await googleClient.reverseGeocode({
      params: {
        latlng: `${lat},${long}`,
        key: process.env.GOOGLE_MAP_API_KEY!,
      },
    });

    const result = response.data.results?.[0];

    if (!result) {
      throw new AppError(http.NOT_FOUND, "No address found");
    }

    const components = result.address_components;

    const city =
      components.find((c: any) =>
        c.types.includes("locality")
      )?.long_name;

    const area =
      components.find((c: any) =>
        c.types.includes("sublocality") ||
        c.types.includes("neighborhood")
      )?.long_name;

    const country =
      components.find((c: any) =>
        c.types.includes("country")
      )?.long_name;

    const fullAddress = [area, city, country]
      .filter(Boolean)
      .join(", ");



    return fullAddress

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new AppError(http.BAD_REQUEST, "Failed to get address");
  }
};