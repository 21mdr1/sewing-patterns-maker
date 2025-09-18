import type { IModel, IPathLine, IPoint, IPathMap, IModelMap } from 'makerjs';
import type { IPointMap, INumberMap, IInstruction } from './geometryTypes';
import makerjs from 'makerjs';

const functionMapping = {
    pointFromPoint, pointOnLine, midPoint, squareLine, pointSquareOfTwoPoints, pointOnBisector
}

/**
 * Get a point based on another point.
 * @param point Point to base off of.
 * @param diff An array containing the x and y diffs.
 * @returns A point with the given modifiers.
*/
export function pointFromPoint(point: IPoint | IPoint[], diff: number[]): IPoint;
/**
 * Get a point based on another point.
 * @param point Point to base off of.
 * @param xDiff The change in x-coordinates to get to the new point.
 * @param yDiff The change in y-coordinates to get to the new point.
 * @returns A point with the given modifiers.
*/
export function pointFromPoint(point: IPoint | IPoint[], xDiff: number, yDiff: number): IPoint;
export function pointFromPoint(point: IPoint | IPoint[], diffOrXDiff: number[] | number, yDiff?: number): IPoint {
    let xDiff = diffOrXDiff;
    if (Array.isArray(point)) {
        point = point[0];
    }
    if (Array.isArray(xDiff)) {
        [ xDiff, yDiff ] = xDiff;
    }

    return [ point[0] + xDiff, point[1] + yDiff ];
}


/**
 * Get a point a certain distance away which is also on a specified line.
 * @param origin Point to base off of.
 * @param line Line the new point should be on.
 * @param dist Distance away from the origin point the new point should be.
 * @returns A point on the given line.
*/
export function pointOnLine(origin: IPoint | IPoint[], line: IPoint[] | IPathLine, dist: number): IPoint {
    if(Array.isArray(origin)) {
        origin = origin[0];
    }
    if(Array.isArray(line)) {
        line = new makerjs.paths.Line(line[0], line[1]);
    }

    const intersectPoints = makerjs.path.intersection(line, new makerjs.paths.Circle(origin, dist));
    if(!intersectPoints) {
        console.log("Error finding line, line at given length does not intersect");
        return null;
    }

    return intersectPoints.intersectionPoints[0];
}


/**
 * Get a point at the midpoint of two points.
 * @param points An array of two points.
 * @returns The midpoint of a and b.
*/
export function midPoint(points: IPoint[]): IPoint;
/**
 * Get a point at the midpoint of two points.
 * @param a First point.
 * @param b Second point.
 * @returns The midpoint of a and b.
*/
export function midPoint(a: IPoint, b: IPoint): IPoint;
export function midPoint(a: IPoint | IPoint[], b?: IPoint): IPoint {
    if(Array.isArray(a)) {
        [ a, b ] = a;
    }
    return makerjs.point.average(a, b);
}


/**
 * Get a line that is at a 90 degree angle from another line.
 * @param line Line to base off of.
 * @param length Length of the new line
 * @returns A line perpendicular to the line given.
*/
export function squareLine(line: IPathLine | IPoint[], length: number): IPoint[] {
    if(Array.isArray(line)) {
        line = new makerjs.paths.Line(line[0], line[1]);
    }

    // return new makerjs.paths.Line(
    //     makerjs.point.fromAngleOnCircle(
    //         makerjs.angle.ofLineInDegrees(line) - 90, 
    //         new makerjs.paths.Circle(makerjs.point.fromPathEnds(line)[0], length)
    //     ),
    //     makerjs.point.fromAngleOnCircle(
    //         makerjs.angle.ofLineInDegrees(line) + 90, 
    //         new makerjs.paths.Circle(makerjs.point.fromPathEnds(line)[0], length)
    //     )
    // );
    return [
        makerjs.point.fromAngleOnCircle(
            makerjs.angle.ofLineInDegrees(line) - 90, 
            new makerjs.paths.Circle(makerjs.point.fromPathEnds(line)[0], length)
        ),
        makerjs.point.fromAngleOnCircle(
            makerjs.angle.ofLineInDegrees(line) + 90, 
            new makerjs.paths.Circle(makerjs.point.fromPathEnds(line)[0], length)
        )
    ]
}


/**
 * Get a point on the intersection of two imaginary lines going through a and b which intersect at a 90 degree angle
 * @param points An array of two points.
 * @returns A point that is on the intersection.
*/
export function pointSquareOfTwoPoints(points: IPoint[]): IPoint;
/**
 * Get a point on the intersection of two imaginary lines going through a and b which intersect at a 90 degree angle
 * @param a First point.
 * @param b Second point.
 * @returns A point that is on the intersection.
*/
export function pointSquareOfTwoPoints(a: IPoint, b?: IPoint): IPoint;
export function pointSquareOfTwoPoints(a: IPoint | IPoint[], b?: IPoint): IPoint {
    if(Array.isArray(a)) {
        [ a, b ] = a;
    }
    return [a[0], b[1]];
}


/**
 * Get a point on the bisector (exact middle) of an angle that is a certain distance away from the vector.
 * @param angle An array of three points representing an angle.
 * @param dist The distance from the second point (vertex) that the new point should be.
 * @returns A point midway between the legs of the angle.
*/
export function pointOnBisector(angle: IPoint[], dist: number): IPoint {
    return makerjs.point.fromAngleOnCircle(
        (
            makerjs.angle.ofPointInDegrees(angle[1], angle[0]) 
            + makerjs.angle.ofPointInDegrees(angle[1], angle[2])
        ) / 2,
        new makerjs.paths.Circle(angle[1], dist)
    );
}


/**
 * A model is a composite object which may contain a map of paths, or a map of models recursively.
 *
 * Example:
 * ```
 * let m = {
 *     paths: {
 *       "line1": { type: 'line', origin: [0, 0], end: [1, 1] },
 *       "line2": { type: 'line', origin: [0, 0], end: [-1, -1] }
 *     }
 * };
 * ```
 */
export class CustomModel implements IModel {
    origin?: IPoint;
    paths?: IPathMap;
    models?: IModelMap;
    units?: string;
    points?: IPointMap;
    measurements?: INumberMap;
    /**
     * Class for a model, a composite object with child paths and models. 
     * 
     * @param measurements A mapping of measurement names to their number value.
     * @param units The units of the model. Defaults to inches.
     */
    constructor(measurements: INumberMap = {}, units: string = "in") {
        this.paths = {}
        this.models = {}
        this.points = { "A": [0, 0] }
        this.units = units;
        this.measurements = measurements;
    }
    /**
     * Add a point as a child. This is basically equivalent to:
     * ```
     * parentModel.points[childPointId] = pointId;
     * ```
     * with additional checks taht make it safe for cascading.
     * Note that any points will not be exported with the model.
     * 
     * @param point The point to add.
     * @param id The id of the point.
     * @returns The original model (for cascading).
     */
    addPoint(point: IPoint, id: string) {
        let i = 0; let newId = id;
        while (newId in this.points) {
            i++; newId = [ id, i ].join('_');
        }

        this.points[newId] = point;
        return this;
    }
    /**
     * Add a path as a child. This is basically equivalent to:
     * ```
     * parentModel.paths[childPathId] = childPath;
     * ```
     * with additional checks that make it safe for cascading.
     * 
     * @param path The path to add.
     * @param id The id of the path.
     * @returns The original model (for cascading).
     */
    addPath(path: IPathLine, id: string) {
        return makerjs.model.addPath(this, path, id);
    }
    /**
     * Add a model as a child of another model. This is basically equivalent to:
     * ```
     * parentModel.models[childModelId] = childModel;
     * ```
     * with additional checks that make it safe for cascading.
     * 
     * @param model The model to add.
     * @param id The id of the model.
     * @returns The original model (for cascading).
     */
    addModel(model: IModel, id: string) {
        return makerjs.model.addModel(this, model, id);
    }
    /**
     * Calculates a point to add to the model from existing points and lines through a specific method (function);
     * 
     * @param instruction an object containing all the information to make the new point.
     */
    calculatePoint({ type, name, points = [], lines = [], func, measure = [] }: IInstruction & {func: keyof typeof functionMapping}) {
        const evaledPts = points.map(pt => this.points[pt]);
        const evaledLns = lines.map(ln => 
            new makerjs.paths.Line(this.points[ln[0]], this.points[ln[1]])
        );
        const evaledMeas = measure.map(measInput => measInput.map(meas => {
            if(typeof(meas) === "number") {
                return meas as number;
            }
            if(typeof(meas) === "string") {
                return this.measurements[meas as string];
            }
            if(Array.isArray(meas)) {
                if(typeof(meas[0]) === "string" && typeof(meas[1]) === "string") {
                    meas = [
                        this.points[meas[0]],
                        this.points[meas[1]]
                    ]
                }
                return makerjs.measure.pointDistance((meas as IPoint[])[0], (meas as IPoint[])[1]);
            }
        }).reduce((a, b) => a + b));

        switch (type) {
            case "point": 
                this.addPoint(
                    (functionMapping[func] as Function)(...evaledPts, ...evaledLns, ...evaledMeas),
                    name
                )
                break;
            case "line":
                this.connectPoints(...[points[0], points[1]], "line");
                break;
            case "bezier":
                this.connectPoints(...[points[0], points[1]], "bezier");
                break; 
        }

        return this;

    }

    /**
     * Connects two points with a curve and saves it to the model.
     * 
     * @param point1 First point to connect.
     * @param point2 Second point to connect.
     * @param curve Type of curve to connect the points with.
     * @returns The original model (for cascading).
     */
    connectPoints(point1: string | IPoint, point2: string | IPoint, curve: "line" | "bezier" = "line") {
        point1 = typeof(point1) === "string" ? this.points[point1] : point1;
        point2 = typeof(point2) === "string" ? this.points[point2] : point2;

        if(curve === "line") {
            return this.addPath(new makerjs.paths.Line(point1, point2), "finalLine");
        } else if (curve === "bezier") {

        }
    }
}