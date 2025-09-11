import './index.css';
import { StyledSelect } from './components/form_components';
import { MeasurementForm, SaveAndLoadButtons } from './components/render_measurements';
import systems from "./data/pattern_systems.json";
import type { systemLike, patternLike, IInstruction } from "./types/data";
import { buildFromInstructions } from './helpers/geometryHelper';
import { exporter } from 'makerjs';

const systemContainer = document.querySelector(".measurements__system")
const patternContainer = document.querySelector(".measurements__pattern")
const measurementsContainer = document.querySelector(".measurements__container");
const form = document.querySelector(".measurements__form");
const buttonsContainer = document.querySelector(".buttons__container");
const output = document.querySelector(".output");


let selectedSystem = "";
let selectedPattern = "";
let measurementData = {};
let units = "in";

async function handleLoadData() {
    const data = await window.exchangeData.readUsingDialog()

    if (data) {
        measurementData = data;
    
        measurementsContainer.innerHTML = "";
    
        MeasurementForm(
            systems[selectedSystem as systemLike][selectedPattern as patternLike].measurements_needed, 
            measurementsContainer,
            data.units,
            data.measurements
        );
    }
}

function formatData(form: HTMLFormElement) {
    const data = {
        units: units,
        measurements: {

        } as {[key: string]: number}
    }

    for(const child of form) {
        if(child.tagName === "INPUT") {
            data.measurements[(child as HTMLInputElement).name] = Number((child as HTMLInputElement).value);
        }
    }

    return data;
}

function handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();
    const data = formatData((event.target as HTMLFormElement));

    if((event.submitter as HTMLButtonElement).value === "save") {
        window.exchangeData.writeUsingDialog(data);
    } else if ((event.submitter as HTMLButtonElement).value === "generate") {
        const instructions = systems[selectedSystem as systemLike][selectedPattern as patternLike].instructions as IInstruction[];

        output.innerHTML = exporter.toSVG(buildFromInstructions(instructions, data));

        const svg = document.querySelector("svg");
        svg?.classList.add("svg__container");
    }
}

form.addEventListener("submit", handleFormSubmit);

function handlePatternChange(event: Event) {
    MeasurementForm(
        systems[selectedSystem as systemLike]
            [(event.target as HTMLSelectElement).value as patternLike]
            .measurements_needed, 
        measurementsContainer,
        units
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