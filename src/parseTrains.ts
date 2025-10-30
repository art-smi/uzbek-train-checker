import { Train } from "./types";

interface ParsedTrain extends Pick<Train, 'number' | 'departureDate' | 'arrivalDate'> {
  carriages: Array<{ number: string; freeSeats: number }>;
}

// Read brand from env and validate
const TRAIN_BRAND = process.env.TRAIN_BRAND;
if (!TRAIN_BRAND) {
  throw new Error("Missing required environment variable: TRAIN_BRAND");
}

// Read minimum available seats from env (default to 1 if not specified)
const MIN_AVAILABLE_SEATS = process.env.MIN_AVAILABLE_SEATS
  ? parseInt(process.env.MIN_AVAILABLE_SEATS, 10)
  : 1;

const parseBy = {
  brand: TRAIN_BRAND,
  minSeats: MIN_AVAILABLE_SEATS,
}

export const parseTrains = (trains: Train[]): ParsedTrain[] => {
  return trains.reduce((acc, train) => {
      if (!train.cars) return acc;
      if (train.cars.length === 0) return acc;
      if (train.brand !== parseBy.brand) return acc;

      // Filter trains that have at least one car with minimum required free seats
      const hasAvailableSeats = train.cars.some(car => car.freeSeats >= parseBy.minSeats);
      if (!hasAvailableSeats) return acc;

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
