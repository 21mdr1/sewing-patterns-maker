

type GeometricObject = Point | Line | Curve | Spline;

class Point {
    constructor(
        public name: string, 
        public from: GeometricObject, 
        public dx?: number, 
        public dy?: number,
        public angle?: number,
        public dist?: number,
    ) {
        
    }
    
    draw() {
        
    }
}

class Line {
    constructor(
        public name: string, 
        public a: Point, 
        public b: Point
    ) {
        
    }
}

/*
- `bezier(name, through=[<pt>...], handles=[...])`
- `intersect(name, A=<geom>, B=<geom>)`
- `offset_curve(name, of=<curve>, amount=?, side="left|right")`
- `annotate_notch(at=<pt>, type="single|double")`
*/

class Curve {

    constructor(
        public name: string,
        // public type: 'bezier' | 'arc' | 'line',
        public center: Point,
        public radius: number,
        public startDeg: number,
        public endDeg: number,
    ) {

    }

}

class Dart {
    constructor(
        public name: string,
        public legs: Point[],
        public intake: number,
    ) {

    }
}

class Spline {

}


// function intersect(line, circle) {

// }

// function offset(curve) {

// }

// function rotate(point, pivot) {

// }

// function reflect() {

// }

// function trim() {

// }

// function fillet() {

// }

// function booleanUnions() {
//     // for facings
// }

// function dartRotation() {

// }

