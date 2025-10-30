import { TrainResponse } from "./types";

export const fetchTrains = async (): Promise<TrainResponse> => {
  // Read values from environment
  const XSRF_TOKEN = process.env.XSRF_TOKEN;
  const TRAIN_DATE = process.env.TRAIN_DATE;
  const DEP_STATION_CODE = process.env.DEP_STATION_CODE;
  const ARV_STATION_CODE = process.env.ARV_STATION_CODE;

  // Validate required env vars
  if (!XSRF_TOKEN || !TRAIN_DATE || !DEP_STATION_CODE || !ARV_STATION_CODE) {
    throw new Error(
      "Missing required environment variables. Ensure XSRF_TOKEN, TRAIN_DATE, DEP_STATION_CODE and ARV_STATION_CODE are set."
    );
  }

  // Build request body dynamically
  const body = JSON.stringify({
    directions: {
      forward: {
        date: TRAIN_DATE,
        depStationCode: DEP_STATION_CODE,
        arvStationCode: ARV_STATION_CODE,
      },
    },
  });

  const response = await fetch("https://eticket.railway.uz/api/v3/handbook/trains/list", {
    "headers": {
      "accept": "application/json",
      "accept-language": "ru",
      "content-type": "application/json",
      "device-type": "BROWSER",
      "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      // inject XSRF token from env
      "x-xsrf-token": XSRF_TOKEN,
      // minimal cookie including token; keep other cookie parts out of source-controlled code
      "cookie": `XSRF-TOKEN=${XSRF_TOKEN}`
    },
    "body": body,
    "method": "POST"
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trains: ${response.statusText}`);
  }

  return response.json() as Promise<TrainResponse>;
};
