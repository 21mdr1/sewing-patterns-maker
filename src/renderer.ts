import './index.css';
import { StyledSelect } from './components/form_components';
import { MeasurementForm, SaveAndLoadButtons } from './components/render_measurements';
import systems from "./data/pattern_systems.json";
import type { systemLike, patternLike } from "./types/data";

const systemContainer = document.querySelector(".measurements__system")
const patternContainer = document.querySelector(".measurements__pattern")
const measurementsContainer = document.querySelector(".measurements__container");
const form = document.querySelector(".measurements__form");
const buttonsContainer = document.querySelector(".buttons__container");

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

function handleSaveData(form: HTMLFormElement) {
    const data = {
        units: units,
        measurements: {

        } as {[key: string]: string}
    }

    for(const child of form) {
        if(child.tagName === "INPUT") {
            data.measurements[(child as HTMLInputElement).name] = (child as HTMLInputElement).value
        }
    }

    window.exchangeData.writeUsingDialog(data);
}

function handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();

    if((event.submitter as HTMLButtonElement).value === "save") {
        handleSaveData((event.target as HTMLFormElement));
    } else if ((event.submitter as HTMLButtonElement).value === "generate") {
        const system = ((event.target as HTMLFormElement)[0] as HTMLSelectElement).value
        const pattern = ((event.target as HTMLFormElement)[1] as HTMLSelectElement).value
        console.log(system, pattern);
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