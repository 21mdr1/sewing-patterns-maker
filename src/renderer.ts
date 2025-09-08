import './index.css';
import { StyledSelect } from './components/form_components';
import { MeasurementForm } from './components/render_measurements';
import systems from "./data/pattern_systems.json";
import type { systemType, patternType } from "./types/data";

const systemContainer = document.querySelector(".measurements__system")
const patternContainer = document.querySelector(".measurements__pattern")
const measurementsContainer = document.querySelector(".measurements__container");
let selectedSystem = "";
let selectedPattern = "";

function handlePatternChange(event: Event) {
    MeasurementForm(
        systems[selectedSystem as systemType]
            [(event.target as HTMLSelectElement).value as patternType]
            .measurements_needed, 
        measurementsContainer,
        "in"
    );
                
    selectedPattern = (event.target as HTMLSelectElement).value;
}

function handleSystemChange(event: Event) {
    patternContainer.appendChild(StyledSelect({
        name: "pattern",
        label: "Pattern",

        options: systems[(event.target as HTMLSelectElement).value as systemType].supported_patterns,

        onChange: handlePatternChange
    }));

    selectedSystem = (event.target as HTMLSelectElement).value;
}


systemContainer.appendChild(StyledSelect({
    name: "system",
    label: "Pattern System",
    options: systems.supported_systems,
    onChange: handleSystemChange,
}));