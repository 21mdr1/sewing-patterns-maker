import { path, paths, angle, model, models, point, measure } from "makerjs";
import type { IModel, IPoint, IPathLine } from "makerjs";
import type { measurementLike, IMeas, IMeasurements, IInstruction } from "src/types/data";

// TO DO -> UPDATE P TO BE DEPENDENT ON BRA CUP
// Fix Q -> needs to substract BtoF

function pointFromPoint(a: IPoint, xDiff: number = 0, yDiff: number = 0) {
    return [a[0] + xDiff, a[1] + yDiff ];
}

function lineFromPoints(a: IPoint, b: IPoint) {
    return new paths.Line(a, b);
}

function squarePoint(a: IPoint, dir: "x+" | "x-" | "y+" | "y-", dist: number = 4) {
    if(dir == "x+") {
        return [a[0] + dist, a[1]];
    } else if(dir === "x-") {
        return [a[0] - dist, a[1]];
    } else if(dir === "y+") {
        return [a[0], a[1] + dist];
    } else if(dir === "y-") {
        return [a[0], a[1] - dist];
    }
}

function squareLine(a: IPoint, dir: "x+" | "x-" | "y+" | "y-", dist: number = 4) {
    return new paths.Line(a, squarePoint(a, dir, dist));
}

function pointIntersecting(origin: IPoint, line: IPathLine, dist: number): IPoint | null {
    const intersectPoints = path.intersection(line, new paths.Circle(origin, dist));
    if(!intersectPoints) {
        console.log("Error finding line, line at given length does not intersect");
        return null;
    }
    return intersectPoints.intersectionPoints[0];
}

function pointOnLine(start: IPoint, end: IPoint, dist: number) {
    const lineAngle = angle.ofLineInDegrees(new paths.Line(start, end));
    const circle = new paths.Circle(start, dist);
    return point.fromAngleOnCircle(lineAngle, circle);
}

function pointSquareOfTwoPoints(a: IPoint, b: IPoint) {
    return [a[0], b[1]];
}

function midPoint(a: IPoint, b: IPoint) {
    return point.average(a, b);
}

function makeDart(a: IPoint, b: IPoint, c: IPoint, distFromC: number = 0) {
    const newB = pointOnLine(c, b, measure.pathLength(new paths.Line(c, a)));

    const deg = (angle.ofLineInDegrees(new paths.Line(a, c)) + angle.ofLineInDegrees(new paths.Line(newB, c))) / 2;

    const newTopPoint = point.fromAngleOnCircle(deg, new paths.Circle(c, distFromC));

    const leg1 = new paths.Line(newTopPoint, a);
    const leg2 = new paths.Line(newTopPoint, newB);

    return [ newB, leg1, leg2 ];

}

function evaluate_measurements(name: measurementLike, ease: number, pos: boolean, meas: IMeas) {
    return (pos ? 1 : -1) * (meas[name] as number + ease);
}

function buildFromInstructions(instructions: IInstruction[], measObject: IMeasurements): IModel {
    const record = { 
        paths: {} as {[key: string]: IPathLine}, 
        points: {
            A: [0, 0]
        } as {[key: string]: IPoint},
        models: {} as {[key: string]: any},
    }
    const finalModel: IModel = { paths: {} }
    model.convertUnits(finalModel, "inch");

    for(const { action, name, parameters, isFinal } of instructions) {
        if(action === "pointFromPoint") {
            let [ a, xDiff, yDiff ] = parameters;

            if (Array.isArray(xDiff)) {
                xDiff = evaluate_measurements(xDiff[0], xDiff[1], xDiff[2], measObject.measurements);
            }
            if (Array.isArray(yDiff)) {
                yDiff = evaluate_measurements(yDiff[0], yDiff[1], yDiff[2], measObject.measurements);
            }

            const point = pointFromPoint(record.points[a], xDiff, yDiff);
            record.points[name] = point;
        } else if (action === "lineFromPoints") {
            const [ a, b ] = parameters;
            const line = lineFromPoints(record.points[a], record.points[b]);
            record.paths[name] = line;
            
            if(isFinal) { model.addPath(finalModel, line, name) }
        } else if (action === "squareLine") {
            const [ a, dir, dist ] = parameters;
            const line = squareLine(record.points[a], dir, dist);
            record.paths[name] = line;

            if(isFinal) { model.addPath(finalModel, line, name) }
        } else if (action === "squarePoint") {
            const [ a, dir, dist ] = parameters;
            const line = squarePoint(record.points[a], dir, dist);

            record.points[name] = line;
        } else if (action === "pointIntersecting") {
            let [ origin, line, dist ] = parameters;

            if(Array.isArray(dist)) {
                dist = evaluate_measurements(dist[0], dist[1], dist[2], measObject.measurements);
            }

            const point = pointIntersecting(record.points[origin], record.paths[line], dist);

            if(!point) {
                return { path: {} } as IModel;
            }

            record.points[name] = point;
        } else if (action === "pointOnLine") {
            let [ start, end, dist ] = parameters;

            if(Array.isArray(dist)) {
                dist = evaluate_measurements(dist[0], dist[1], dist[2], measObject.measurements);
            }

            const point = pointOnLine(record.points[start], record.points[end], dist);
            
            record.points[name] = point;
        } else if (action === "pointSquareOfTwoPoints") {
            const [ a, b ] = parameters;
            const point = pointSquareOfTwoPoints(record.points[a], record.points[b]);

            record.points[name] = point;
        } else if (action === "midPoint") {
            const [ a, b ] = parameters;
            const point = midPoint(record.points[a], record.points[b]);

            record.points[name] = point;
        } else if (action === "makeDart") {
            const [ a, b,  c, distFromC ] = parameters;
            const [ newB, leg1, leg2 ] = makeDart(record.points[a], record.points[b], record.points[c], distFromC);

            record.points[name] = newB as IPoint;

            if(isFinal) {
                model.addPath(finalModel, (leg1 as IPathLine), "leg1");
                model.addPath(finalModel, (leg2 as IPathLine), "leg2");
            }
        } else if (action === "makeBezierCurve") {
            const [ a, b, c, d ] = parameters;
            const curve = new models.BezierCurve(record.points[a], record.points[b], record.points[c], record.points[d]);

            record.models[name] = curve;
            
            if(isFinal) { model.addModel(finalModel, curve, name) }
        }
    }

    return finalModel;
}

export { buildFromInstructions };
