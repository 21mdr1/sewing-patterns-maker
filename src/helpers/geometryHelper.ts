// import { exporter, paths } from "makerjs";
import makerjs from "makerjs";
import type { IModel, IPoint, IPathLine } from "makerjs";

const { 
    paths: { Line, Circle }, 
    angle: { ofLineInDegrees },
    path: { intersection },
    model: { addPath, addModel, convertUnits }, 
    models: { BezierCurve },
    point: { fromAngleOnCircle, average },
    measure: { pathLength }, 
} = makerjs;

const testMeasurements = {
    "full-length-front": 16.125,
    "across-shoulder-front": 7.5,
    "center-length-front": 14.125,
    "bust-arc": 9.5,
    "shoulder-slope-front": 17.0625,
    "bust-depth": 9.125,
    "shoulder-length": 5.125,
    "bust-span": 3.625,
    "across-chest": 6.5,
    "dart-placement-front": 3,
    "new-strap": 17,
    "side-length": 8.125,
    "waist-arc-front": 6.5,
    "bra-cup": "B"
}


function pointFromPoint(a: IPoint, xDiff: number = 0, yDiff: number = 0) {
    return [a[0] + xDiff, a[1] + yDiff ];
}

function lineFromPoints(a: IPoint, b: IPoint) {
    return new Line(a, b);
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
    return new Line(a, squarePoint(a, dir, dist));
}

function pointIntersecting(origin: IPoint, line: IPathLine, dist: number): IPoint | null {
    const intersectPoints = intersection(line, new Circle(origin, dist));
    if(!intersectPoints) {
        console.log("Error finding line, line at given length does not intersect");
        return null;
    }
    return intersectPoints.intersectionPoints[0];
}

function pointOnLine(start: IPoint, end: IPoint, dist: number) {
    const angle = ofLineInDegrees(new Line(start, end));
    const circle = new Circle(start, dist);
    return fromAngleOnCircle(angle, circle);
}

function pointSquareOfTwoPoints(a: IPoint, b: IPoint) {
    return [a[0], b[1]];
}

function midPoint(a: IPoint, b: IPoint) {
    return average(a, b);
}

function makeDart(a: IPoint, b: IPoint, c: IPoint, distFromC: number = 0) {
    const newB = pointOnLine(c, b, pathLength(new Line(c, a)));

    const deg = (ofLineInDegrees(new Line(a, c)) + ofLineInDegrees(new Line(newB, c))) / 2;

    const newTopPoint = fromAngleOnCircle(deg, new Circle(c, distFromC));

    const leg1 = new Line(newTopPoint, a);
    const leg2 = new Line(newTopPoint, newB);

    return [ newB, leg1, leg2 ];

}

const functions = {
    pointFromPoint, lineFromPoints, squareLine, pointIntersecting, pointOnLine, pointSquareOfTwoPoints, midPoint, squarePoint, makeDart, "makeBezierCurve": "makeBezierCurve"
}

interface IInstruction {
    action: (keyof typeof functions);
    parameters: any[];
    name: string;
    isFinal: boolean;
}

const instructions: IInstruction[] = [
    {
        action: "pointFromPoint",
        parameters: ["A", 0, -(testMeasurements["full-length-front"] + 1/8)],
        name: "B",
        isFinal: false,
    },
    {
        action: "pointFromPoint",
        name: "C",
        parameters: [ "A", -(testMeasurements["across-shoulder-front"] - 1/8), 0],
        isFinal: false,
    },
    {
        action: "lineFromPoints",
        name: "AtoC",
        parameters: ["A", "C"],
        isFinal: false,
    },
    {
        action: "squareLine",
        name: "CLine",
        parameters: ["C", "y-", 3],
        isFinal: false,
    },
    {
        action: "pointFromPoint",
        name: "D",
        parameters: ["B", 0, testMeasurements["center-length-front"]],
        isFinal: false,
    },
    {
        action: "lineFromPoints",
        name: "BtoD",
        parameters: ["B", "D"],
        isFinal: true,
    },
    {
        action: "pointFromPoint",
        name: "E",
        parameters: ["B", -(testMeasurements["bust-arc"] + 1/4) , 0],
        isFinal: false,
    },
    {
        action: "squareLine",
        name: "ELine",
        parameters: ["E", "y+", 11],
        isFinal: false,
    },
    {
        action: "pointIntersecting",
        name: "G",
        parameters: ["B", "CLine", testMeasurements["shoulder-slope-front"] + 1/8],
        isFinal: false,
    },
    {
        action: "pointOnLine",
        name: "H",
        parameters: ["G", "B", testMeasurements["bust-depth"]],
        isFinal: false,
    },
    {
        action: "pointIntersecting",
        name: "I",
        parameters: ["G", "AtoC", testMeasurements["shoulder-length"]],
        isFinal: false,
    },
    {
        action: "lineFromPoints",
        name: "GtoI",
        parameters: ["G", "I"],
        isFinal: true,
    }, 
    {
        action: "pointSquareOfTwoPoints",
        name: "J",
        parameters: ["B", "H"],
        isFinal: false,
    },
    {
        action: "pointFromPoint",
        name: "K",
        parameters: ["J", -(testMeasurements["bust-span"] + 1/4), 0],
        isFinal: false,
    },
    {
        action: "midPoint",
        name: "L",
        parameters: ["D", "J"],
        isFinal: false,
    },
    {
        action: "pointFromPoint",
        name: "M",
        parameters: ["L", -(testMeasurements["across-chest"] + 1/4), 0],
        isFinal: false,
    },
    {
        action: "pointFromPoint",
        name: "F",
        parameters: ["B", - testMeasurements["dart-placement-front"], 0],
        isFinal: false,
    },
    {
        action: "squarePoint",
        name: "F1",
        parameters: [ "F", "y-", 3/16 ],
        isFinal: false,
    },
    {
        action: "pointIntersecting",
        name: "N",
        parameters: ["I", "ELine", testMeasurements["new-strap"] + 1/8],
        isFinal: false,
    },
    {
        action: "pointFromPoint",
        name: "O",
        parameters: ["N", 0, testMeasurements["side-length"]],
        isFinal: false,
    },
    {
        action: "pointFromPoint",
        name: "P",
        parameters: ["N", -5/4, 0], // update to be based on cup size
        isFinal: false,
    },
    {
        action: "pointOnLine",
        name: "P1",
        parameters: ["O", "P", testMeasurements["side-length"]],
        isFinal: false,
    },
    {
        action: "lineFromPoints",
        name: "OtoP",
        parameters: ["O", "P1"],
        isFinal: true,
    },
    {
        action: "pointOnLine",
        name: "Q",
        parameters: ["P1", "F", testMeasurements["waist-arc-front"] + 1/4],
        isFinal: false,
    },
    {
        action: "makeDart",
        name: "R",
        parameters: ["F1", "Q", "K", 5/8],
        isFinal: true,
    }, 
    {
        action: "midPoint",
        name: "PQ",
        parameters: ["P", "Q"],
        isFinal: false
    },
    {
        action: "makeBezierCurve",
        name: "PtoR",
        parameters: ["P1", "PQ","R", "R"],
        isFinal: true,
    },
    {
        action: "midPoint",
        name: "BF",
        parameters: ["B", "F"],
        isFinal: false
    },
    {
        action: "makeBezierCurve",
        name: "BtoF",
        parameters: ["B", "BF", "F1", "F1"],
        isFinal: true,
    },
    {
        action: "pointSquareOfTwoPoints",
        name: "MO",
        parameters: ["M", "O"],
        isFinal: false,
    },
    {
        action: "makeBezierCurve",
        name: "GtoO",
        parameters: ["G", "M", "MO", "O"],
        isFinal: true,
    },
    {
        action: "pointSquareOfTwoPoints",
        name: "ID",
        parameters: ["I", "D"],
        isFinal: false,
    },
    {
        action: "makeBezierCurve",
        name: "ItoD",
        parameters: ["I", "ID", "D", "D"],
        isFinal: true,
    }
];

function buildFromInstructions(instructions: IInstruction[]): IModel {
    const record = { 
        paths: {} as {[key: string]: IPathLine}, 
        points: {
            A: [0, 0]
        } as {[key: string]: IPoint},
        models: {

        } as {[key: string]: any},
    }
    const model: IModel = { paths: {} }
    convertUnits(model, "inch");

    for(const { action, name, parameters, isFinal } of instructions) {
        if(action === "pointFromPoint") {
            const [ a, xDiff, yDiff ] = parameters;
            const point = pointFromPoint(record.points[a], xDiff, yDiff);
            record.points[name] = point;
        } else if (action === "lineFromPoints") {
            const [ a, b ] = parameters;
            const line = lineFromPoints(record.points[a], record.points[b]);
            record.paths[name] = line;
            
            if(isFinal) { addPath(model, line, name) }
        } else if (action === "squareLine") {
            const [ a, dir, dist ] = parameters;
            const line = squareLine(record.points[a], dir, dist);
            record.paths[name] = line;

            if(isFinal) { addPath(model, line, name) }
        } else if (action === "squarePoint") {
            const [ a, dir, dist ] = parameters;
            const line = squarePoint(record.points[a], dir, dist);

            record.points[name] = line;
        } else if (action === "pointIntersecting") {
            const [ origin, line, dist ] = parameters;
            const point = pointIntersecting(record.points[origin], record.paths[line], dist);

            if(!point) {
                return { path: {} } as IModel;
            }

            record.points[name] = point;
        } else if (action === "pointOnLine") {
            const [ start, end, dist ] = parameters;
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
            console.log(record.points);
        } else if (action === "makeDart") {
            const [ a, b,  c, distFromC ] = parameters;
            const [ newB, leg1, leg2 ] = makeDart(record.points[a], record.points[b], record.points[c], distFromC);

            record.points[name] = newB as IPoint;

            if(isFinal) {
                addPath(model, (leg1 as IPathLine), "leg1");
                addPath(model, (leg2 as IPathLine), "leg2");
            }
        } else if (action === "makeBezierCurve") {
            const [ a, b, c, d ] = parameters;
            const curve = new BezierCurve(record.points[a], record.points[b], record.points[c], record.points[d]);

            record.models[name] = curve;
            console.log(record.models);
            
            if(isFinal) { addModel(model, curve, name) }
        }
    }

    return model;
}

export { buildFromInstructions, instructions };
