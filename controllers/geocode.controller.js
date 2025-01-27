import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const reverseGeocode = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    throw new ApiError(400, "Latitude and Longitude is required");
  }

  const options = {
    method: "GET",
    url: "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse",
    params: {
      lat: lat,
      lon: lon,
      zoom: "10",
      addressdetails: "1",
      namedetails: "0",
      "accept-language": "en",
      format: "json",
      polygon_text: "0",
      polygon_kml: "0",
      polygon_svg: "0",
      polygon_geojson: "0",
      polygon_threshold: "0.0",
      limit: "1",
    },
    headers: {
      "x-rapidapi-key": process.env.GEOCODE_API_KEY,
      "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
    },
  };

  const { data } = await axios.request(options);

  const address = {
    country: data.address.country,
    city: data.address.city,
    state_district: data.address.state_district,
    postcode: data.address.postcode,
    state: data.address.state,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { address }, "Address fetched successfully"));
});

export { reverseGeocode };
