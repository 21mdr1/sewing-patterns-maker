import './index.css';
import { StyledSelect } from './components/form_components';
import { MeasurementForm, SaveAndLoadButtons } from './components/render_measurements';
import systems from "./data/pattern_systems.json";
import type { systemLike, patternLike } from "./types/data";

const systemContainer = document.querySelector(".measurements__system")
const patternContainer = document.querySelector(".measurements__pattern")
const measurementsContainer = document.querySelector(".measurements__container");
const buttonsContainer = document.querySelector(".buttons__container");

let selectedSystem = "";
let selectedPattern = "";
let measurementData = {};

async function handleLoadData() {
    const data = await window.exchangeData.readUsingDialog()
    measurementData = data;

    measurementsContainer.innerHTML = "";

    MeasurementForm(
        systems[selectedSystem as systemLike][selectedPattern as patternLike].measurements_needed, 
        measurementsContainer,
        data.units,
        data.measurements
    );
}


function handlePatternChange(event: Event) {
    MeasurementForm(
        systems[selectedSystem as systemLike]
            [(event.target as HTMLSelectElement).value as patternLike]
            .measurements_needed, 
        measurementsContainer,
        "in"
    );

    SaveAndLoadButtons(
        buttonsContainer,
        () => {},
        handleLoadData
    )
                
    selectedPattern = (event.target as HTMLSelectElement).value;
}

function handleSystemChange(event: Event) {
    patternContainer.appendChild(StyledSelect({
        name: "pattern",
        label: "Pattern",

        options: systems[(event.target as HTMLSelectElement).value as systemLike].supported_patterns,

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