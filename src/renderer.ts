import './index.css';
import { Select } from './components/form_components';
import { MeasurementForm } from './components/render_measurements';
import systems from "./data/pattern_systems.json";
import { type systemType } from "./types/data";

const measurementsForm = document.querySelector(".measurements__form");
const systemContainer = document.querySelector(".measurements__container");
let selectedSystem = "";


const [ selectLabel, select ] = Select({
    classList: ["system__select"],
    optionClassList: ["system__option"],
    label: "Pattern System",
    labelClassList: ["system__label"],
    name: "system",
    onChange: (event) => {
        MeasurementForm( systems[(event.target as HTMLSelectElement).value as systemType].bodice.measurements_needed, systemContainer);
        selectedSystem = (event.target as HTMLSelectElement).value;
    },

    options: systems.supported_systems.map(system => ({value: system.id, text: system['display-name']})),
});

measurementsForm.prepend(select);
measurementsForm.prepend(selectLabel);