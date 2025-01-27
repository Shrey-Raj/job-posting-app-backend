import connectDB from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from 'axios';

const getWaterFootprintDetailsByProductName = asyncHandler(async (req, res) => {
  const { productName } = req.query;

  if (!productName) {
    throw new ApiError(400, "Query parameter 'productName' is required");
  }

  console.log("getting water footprint"); 
  const db = await connectDB();
  const collection = db.collection("water-footprint-info");

  const result = await collection.findOne({ crop_name: productName });

  if (!result) {
    throw new ApiError(404, `No water footprint data found for '${productName}'`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: result }, "Water footprint details retrieved successfully")
    );
});


const getWaterFootprintDetailsAll = asyncHandler(async (req, res) => {
  console.log("getting all water footprint details");
  const db = await connectDB();
  const collection = db.collection("water-footprint-info");

  const results = await collection.find({}).toArray(); 

  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: results }, "All water footprint details retrieved successfully")
    );
});

const getInsights = asyncHandler(async (req, res) => {

  const options = {
    method: 'GET',
    url: 'https://weather-api138.p.rapidapi.com/weather',
    params: { city_name: `${req.query.city_name}` },
    headers: {
      'X-RapidAPI-Host': 'weather-api138.p.rapidapi.com',
      'X-RapidAPI-Key': `${process.env.RAPIDAPI_KEY}`
    }
  };

  try {
    const response = await axios.request(options);
    return res.status(200).json(
      new ApiResponse(200, { data: response.data }, "Insights retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching insights");
  }
});





export { getWaterFootprintDetailsByProductName , getWaterFootprintDetailsAll, getInsights };
