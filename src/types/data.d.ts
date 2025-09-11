type ValueOf<T> = T[keyof T];

type measurementLike = "bust" |
        "waist" |
        "abdomen" |
        "hip" |

        "center-length-front" |
        "center-length-back" |
        "full-length-front" |
        "full-length-back" |
        "shoulder-slope-front" |
        "shoulder-slope-back" |

        "new-strap" |
        "bust-depth" |
        "bust-radius" |
        "bust-span" |
        "side-length" |
        "back-neck" |
        "shoulder-length" |
        "across-shoulder-front" |
        "across-shoulder-back" |

        "across-chest" |
        "across-back" |
        "bust-arc" |
        "back-arc" |
        "waist-arc-front" |
        "waist-arc-back" |

        "dart-placement-front" |
        "dart-placement-back" |

        "abdomen-arc-front" |
        "abdomen-arc-back" |
        "hip-arc-front" |
        "hip-arc-back" |

        "crotch-depth" |
        "hip-depth-front" |
        "hip-depth-back" |
        "side-hip-depth" |
        "waist-to-knee" |
        "waist-to-ankle" |
        "waist-to-floor" |
        
        "crotch-length" |
        "vertical-trunk" |
        "upper-thigh" |
        "mid-thigh" |
        "knee" |
        "calf" |
        "ankle" |
        "foot-entry"

type systemLike = "joseph-armstrong";
type patternLike = "bodice"

// interface ISupport {

// }

interface ISystemsData {
    [key: systemLike]: {
        "supported_patterns": {
            id: patternLike,
            "display-name": string,
        }[],
        [key: patternLike]: {
            "measurements_needed": measurementLike[],
        }
    },
    "supported_systems": {
        id: systemLike,
        "display-name": string,
    }[],
}

type IMeas = Record<string, number>
interface IMeasurements {
    units: "in" | "cm" | "mm",
    measurements: IMeas;
}

export type { IMeasurements, IMeas, systemLike, patternLike, measurementLike, ISystemsData };