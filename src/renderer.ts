import './index.css';
import { Select } from './components/form_components';
import systems from "./data/pattern_systems.json";

const measurementsForm = document.querySelector(".measurements__form");
let selectedSystem = "";


const [ selectLabel, select ] = Select({
    classList: ["system__select"],
    optionClassList: ["system__option"],
    label: "Pattern System",
    labelClassList: ["system__label"],
    name: "system",
    onChange: (event) => {
        selectedSystem = (event.target as HTMLSelectElement).value;
    },

    options: [{value: "", text: "Choose"}].concat(systems.supported_systems.map(system => ({value: system.id, text: system['display-name']})) ),
});

measurementsForm.appendChild(selectLabel);
measurementsForm.appendChild(select);