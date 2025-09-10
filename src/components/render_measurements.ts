import { StyledButton, StyledInput } from "./form_components";
import measurements from "../data/measurement_datatypes.json";

function MeasurementForm(info: string[], parentNode: Element, unit: string, data?: {[key: string]: number}) {
    for( let item of info ) {
        const measInfo = measurements.find(el => el.id === item);

        const div = StyledInput({
            type: "number",
            name: item,
            label: measInfo["display-name"],
            value: data ? data[item] ?  data[item] : undefined : undefined,
        });

        const units = document.createElement("p");
        units.classList.add("measurements__unit");
        units.textContent = unit;

        div.appendChild(units);

        parentNode.appendChild(div);

    }

    parentNode.appendChild(StyledButton({text: "Generate Pattern"}));
}

function SaveAndLoadButtons(parentNode: Element, onClickSave?: (e: Event) => void, onClickLoad?: (e: Event) => void) {
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("save-buttons_div");

    buttonsDiv.appendChild(StyledButton({text: "Save Measurements", type: "button", onClick: onClickSave}));
    buttonsDiv.appendChild(StyledButton({text: "Load Measurements", type: "button", onClick: onClickLoad}));

    parentNode.appendChild(buttonsDiv);
}


export { MeasurementForm, SaveAndLoadButtons }