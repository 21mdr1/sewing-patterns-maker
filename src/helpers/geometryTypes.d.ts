import { IPoint } from "makerjs";

export type nameNumberMapping = Record<string, number>;
export type namePointMapping = Record<string, IPoint>;

export interface IMeasurementUnitialized {
     type: "number" | "named" | "distance";
     value: number | string | string[];

     initialize: (nameMapping?: nameNumberMapping, pointMapping?: namePointMapping) => IMeasurement;
}

export interface IMeasurement {
    type: "number" | "named" | "distance";
    value?: number;
     name?: string;
     points?: IPoint[];

    evaluate: () => number;
    add: (b: IMeasurement) => IMeasurement;
}

export interface IInstruction {
     newPoint?: string,
     method: string;
     from: IPoint[],
     change: IMeasurement[][],
}