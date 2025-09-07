import './index.css';
import { Select } from './components/form_components';
import { MeasurementForm } from './components/render_measurements';
import systems from "./data/pattern_systems.json";
import type { systemType, patternType } from "./types/data";

const systemContainer = document.querySelector(".measurements__system")
const patternContainer = document.querySelector(".measurements__system")
const measurementsContainer = document.querySelector(".measurements__container");
let selectedSystem = "";
let selectedPattern = "";


const [ systemLabel, systemSelect ] = Select({
    name: "system",
    classList: ["system__select"],
    label: "Pattern System",
    labelClassList: ["system__label"],
    
    options: systems.supported_systems.map(system => ({value: system.id, text: system['display-name']})),
    optionClassList: ["system__option"],

    onChange: (event) => {
        const [ patternLabel, patternSelect ] = Select({
            name: "pattern",
            classList: ["system__select"],

            label: "Pattern",
            labelClassList: ["system__label"],

            optionClassList: ["system__option"],
            options: systems[(event.target as HTMLSelectElement).value as systemType].supported_patterns.map((el) => ({value: el.id, text: el['display-name']})),

            onChange: (e) => {
                MeasurementForm(systems[selectedSystem as systemType][(e.target as HTMLSelectElement).value as patternType].measurements_needed, measurementsContainer);
                
                selectedPattern = (event.target as HTMLSelectElement).value;
            }
        });
        
        patternContainer.appendChild(patternLabel);
        patternContainer.appendChild(patternSelect);
        
        selectedSystem = (event.target as HTMLSelectElement).value;
    },

});

systemContainer.appendChild(systemLabel);
systemContainer.appendChild(systemSelect);