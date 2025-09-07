import { Input } from "./form_components";
import measurements from "../data/measurement_datatypes.json";

function MeasurementForm(info: string[], parentNode: Element) {
    for( let item of info ) {
        const measInfo = measurements.find(el => el.id === item);

        const [ label, input ] = Input({
            type: "number",
            classList: ["measurements__input"],
            placeholder: `Input ${ measInfo["display-name"] }`,
            name: item,
            label: measInfo["display-name"],
            labelClassList: ["measurements__label"],
        });

        parentNode.appendChild(label);
        parentNode.appendChild(input);
    }
}


export { MeasurementForm }