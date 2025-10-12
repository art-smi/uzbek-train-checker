export interface TrainResponse {
  data: {
    directions: {
      forward: {
        trains: Train[];
      };
    };
  };
  error: any;
}

export interface Train {
  type: string;
  number: string;
  departureDate: string;
  timeOnWay: string;
  originRoute: Route;
  arrivalDate: string;
  brand: string;
  cars: Car[];
  subRoute: SubRoute;
  trainId: string | null;
  comment: string | null;
}

export interface Route {
  depStationName: string;
  arvStationName: string;
}

export interface SubRoute {
  depStationName: string;
  depStationCode: string;
  arvStationName: string;
  arvStationCode: string;
}

export interface Car {
  type: string;
  freeSeats: number;
  tariffs: Tariff[];
}

export interface Tariff {
  classServiceType: string;
  freeSeats: number;
  tariff: number;
}