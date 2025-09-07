import { StyledButton, StyledInput } from "./form_components";
import measurements from "../data/measurement_datatypes.json";

function MeasurementForm(info: string[], parentNode: Element) {
    for( let item of info ) {
        const measInfo = measurements.find(el => el.id === item);

        parentNode.appendChild(StyledInput({
            type: "number",
            name: item,
            label: measInfo["display-name"],
        }));

    }

    parentNode.appendChild(StyledButton({text: "Generate Pattern"}));
}


export { MeasurementForm }