import { StyledButton, StyledInput } from "./form_components";
import measurements from "../data/measurement_datatypes.json";

function MeasurementForm(info: string[], parentNode: Element, unit: string) {
    for( let item of info ) {
        const measInfo = measurements.find(el => el.id === item);


        const div = StyledInput({
            type: "number",
            name: item,
            label: measInfo["display-name"],
        });

        const units = document.createElement("p");
        units.classList.add("measurements__unit");
        units.textContent = unit;

        div.appendChild(units);

        parentNode.appendChild(div);

    }

    parentNode.appendChild(StyledButton({text: "Generate Pattern"}));


    // save and load buttons
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("save-buttons_div");

    buttonsDiv.appendChild(StyledButton({text: "Save Measurements", type: "button"}));
    buttonsDiv.appendChild(StyledButton({text: "Load Measurements", type: "button"}));

    parentNode.appendChild(buttonsDiv);
}


export { MeasurementForm }