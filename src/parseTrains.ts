import { Train } from "./types";

interface ParsedTrain extends Pick<Train, 'number' | 'departureDate' | 'arrivalDate'> {
  carriages: Array<{ number: string; freeSeats: number }>;
}

// Read brand from env and validate
const TRAIN_BRAND = process.env.TRAIN_BRAND;
if (!TRAIN_BRAND) {
  throw new Error("Missing required environment variable: TRAIN_BRAND");
}

const parseBy = {
  brand: TRAIN_BRAND,
}

export const parseTrains = (trains: Train[]): ParsedTrain[] => {
  return trains.reduce((acc, train) => {
      if (!train.cars) return acc;
      if (train.cars.length === 0) return acc;
      if (train.brand !== parseBy.brand) return acc;

      const carriages = train.cars.map((car, index) => ({
        number: `${index + 1} (${car.type})`,
        freeSeats: car.freeSeats,
      }));

      acc.push({
        number: train.number,
        departureDate: train.departureDate,
        arrivalDate: train.arrivalDate,
        carriages,
      });

      return acc;
    }, [] as ParsedTrain[]);
}
