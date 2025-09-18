import type { IPoint } from "makerjs";
export interface IPointMap { 
     [id: string]: IPoint 
}
export interface INumberMap { 
     [id: string]: number 
}

export type measurementLike = number | string | string[] | IPoint[];

export interface IInstruction {
     type: "point" | "line" | "bezier",
     name: string,
     points?: string[],
     lines?: string[][],
     func: string,
     measure?: measurementLike[][],
}