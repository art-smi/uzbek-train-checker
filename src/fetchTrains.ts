import { TrainResponse } from "./types";

export const fetchTrains = async (): Promise<TrainResponse> => {
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
      "x-xsrf-token": "2c85b89a-52b0-44e7-aac7-95d374e580da",
      "cookie": "XSRF-TOKEN=2c85b89a-52b0-44e7-aac7-95d374e580da; _ga=GA1.1.1153079391.1760286288; __stripe_mid=8efbc012-f439-4091-ab2d-a28faf29d51b272513; __stripe_sid=83424e4c-f2ed-497f-a5ef-f9133e8419eef49c66; _ga_R5LGX7P1YR=GS2.1.s1760286287$o1$g1$t1760286339$j8$l0$h0",
      "Referer": "https://eticket.railway.uz/ru/pages/trains-page"
    },
    "body": "{\"directions\":{\"forward\":{\"date\":\"2025-10-14\",\"depStationCode\":\"2900800\",\"arvStationCode\":\"2900000\"}}}",
    "method": "POST"
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trains: ${response.statusText}`);
  }

  return response.json() as Promise<TrainResponse>;
};
