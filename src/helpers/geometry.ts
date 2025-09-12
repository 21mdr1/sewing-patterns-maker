import type { IPathLine, IPoint } from 'makerjs';
import type { IMeasurement, IMeasurementUnitialized, nameNumberMapping, namePointMapping } from './geometryTypes';
import makerjs from 'makerjs';
/**
 * Class for measurements.
 */
export class Measurement implements IMeasurement {
    type: "number" | "named" | "distance";
    value: number;
    name?: string;
    points?: IPoint[];
    /**
     * Class for a measurement represented by a number, a name, or a distance between two points.
     *
     * Example:
     * ```
     * const meas = new Measurement("number", 7);
     * ```
     *
     * @param type The type of measurement.
     * @param value The representation of the measurement. For a number measurement this will be a number. For a named measurement it will be a name, and for a distance measurement it will be two points.
     * @param nameMapping An object containing the mappings of the names to their number values.
     * @param pointMapping An object containing the mappings of the point names to their respective points.
    */
    constructor(type: "number" | "named" | "distance", value: number | string | string[], nameMapping?: nameNumberMapping, pointMapping?: namePointMapping) {
        this.type = type;

        switch(this.type) {
            case "number":
                this.value = value as number;
                break;
            case "named":
                this.name = value as string;
                this.value = nameMapping[this.name];
                break;
            case "distance":
                this.points = [
                    pointMapping[(value as string[])[0]], 
                    pointMapping[(value as string[])[1]]
                ];
                this.value = makerjs.measure.pointDistance(this.points[0], this.points[1])
        }
    }
    /**
     * Evaluate the measurement into a number.
     * @returns The represented measurement evaluated as a number.
     */
    evaluate(): number { return this.value }
    /**
     * Add another measurement onto this measurement.
     * @param b Another Measurement object.
     * @returns A measurement object with the added value of the two measurement objects.
     */
    add(b: IMeasurement): Measurement {
        return new Measurement("number", this.evaluate() + b.evaluate());
    }
}

/**
 * Class for measurements before they have a name and point mapping is assigned.
 */
export class UninitializedMeasurement implements IMeasurementUnitialized {
    type: "number" | "named" | "distance";
    value: number | string | string[];

    /**
     * Class for a measurement represented by a number, a name, or a distance between two points. This holds the data before we have a mapping for the names and points.
     *
     * Example:
     * ```
     * const meas = new UninitializedMeasurement("number", 7);
     * ```
     *
     * @param type The type of measurement.
     * @param value The representation of the measurement. For a number measurement this will be a number. For a named measurement it will be a name, and for a distance measurement it will be two points.
    */
    constructor(type: "number" | "named" | "distance", value: number | string | string[]) {
        this.type = type;
        this.value = value;
    }

    /**
     * Initialized this measurement into a full measurement object
     * @param nameMapping An object containing the mappings of the names to their number values.
     * @param pointMapping An object containing the mappings of the point names to their respective points.
     * @returns A measurement object with the initialized measurement
     */
    initialize(nameMapping?: nameNumberMapping, pointMapping?: namePointMapping): IMeasurement {
        return new Measurement(this.type, this.value, nameMapping, pointMapping);
    }
}


/**
 * Add a set of measurements.
 * @params The measurements to be added. Also accepts an array containing the measurements.
 * @returns A measurement object representing the added values.
*/
export function addMeasurements(...rest: IMeasurement[] | IMeasurement[][]): IMeasurement {
    if(Array.isArray(rest[0])) { rest = rest[0] }

    return (rest as IMeasurement[]).reduce((a, b) => a.add(b));
}

/**
 * Get a point based on another point.
 * @param point Point to base off of.
 * @param xDiff The change in x-coordinates to get to the new point.
 * @param yDiff The change in y-coordinates to get to the new point.
 * @returns A point with the given modifiers.
*/
export function pointFromPoint(point: IPoint, xDiff: IMeasurement, yDiff: IMeasurement): IPoint {
    return [ point[0] + xDiff.evaluate(), point[1] + yDiff.evaluate() ];
}

/**
 * Get a point a certain distance away which is also on a specified line.
 * @param origin Point to base off of.
 * @param line Line the new point should be on.
 * @param dist Distance away from the origin point the new point should be.
 * @returns A point on the given line.
*/
export function pointOnLine(origin: IPoint, line: IPoint[] | IPathLine, dist: IMeasurement): IPoint {
    if(Array.isArray(line)) {
        line = new makerjs.paths.Line(line[0], line[1]);
    }

    const intersectPoints = makerjs.path.intersection(line, new makerjs.paths.Circle(origin, dist.evaluate()));
    if(!intersectPoints) {
        console.log("Error finding line, line at given length does not intersect");
        return null;
    }

    return intersectPoints.intersectionPoints[0];
}

/**
 * Get a point at the midpoint of two points.
 * @param a First point.
 * @param b Second point.
 * @returns The midpoint of a and b.
*/
export function midPoint(a: IPoint, b: IPoint): IPoint {
    return makerjs.point.average(a, b);
}

/**
 * Get a line that is at a 90 degree angle from another line.
 * @param line Line to base off of.
 * @param direction Which direction the 90 degrees should be measured towards
 * @param length Length of the new line
 * @returns A line perpendicular to the line given.
*/
export function squareLine(line: IPathLine | IPoint[], dir: "+" | "-", length: IMeasurement): IPathLine {
    if(Array.isArray(line)) {
        line = new makerjs.paths.Line(line[0], line[1]);
    }

    return new makerjs.paths.Line(
        makerjs.point.fromPathEnds(line)[0], 
        makerjs.point.fromAngleOnCircle(
            makerjs.angle.ofLineInDegrees(line) + (dir === "+" ? 1 : -1) * 90, 
            new makerjs.paths.Circle(makerjs.point.fromPathEnds(line)[0], length.evaluate())
        )
    );
}

/**
 * Get a point on the intersection of two imaginary lines going through a and b which intersect at a 90 degree angle
 * @param a First point.
 * @param b Second point.
 * @returns A point that is on the intersection.
*/
export function pointSquareOfTwoPoints(a: IPoint, b: IPoint): IPoint {
    return [a[0], b[1]];
}

/**
 * Get a point on the bisector (exact middle) of an angle that is a certain distance away from the vector.
 * @param angle An array of three points representing an angle.
 * @param dist The distance from the second point (vertex) that the new point should be.
 * @returns A point midway between the legs of the angle.
*/
export function poinOnBisector(angle: IPoint[], dist: IMeasurement): IPoint {
    return makerjs.point.fromAngleOnCircle(
        (
            makerjs.angle.ofPointInDegrees(angle[1], angle[0]) 
            + makerjs.angle.ofPointInDegrees(angle[1], angle[2])
        ) / 2,
        new makerjs.paths.Circle(angle[1], dist.evaluate())
    );
}