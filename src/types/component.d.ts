interface IInput {
    type: "text" | "number",
    classList?: string[],
    placeholder?: string,
    name: string,
    label: string,
    labelClassList?: string[],
}

interface IOption {
    id: string,
    "display-name": string,
}

interface ISelect {
    classList?: string[],
    optionClassList?: string[],
    label: string,
    labelClassList?: string[],
    name: string,
    onChange?: (e: Event) => void;

    options: IOption[],
}

interface IButton {
    classList?: string[],
    type?: "submit" | "reset" | "button";
    text: string;
    onChange?: (e: Event) => void;
}