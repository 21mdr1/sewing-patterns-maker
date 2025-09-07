interface IInput {
    type: "text" | "number",
    classList?: string[],
    placeholder?: string,
    name: string,
    label: string,
    labelClassList?: string[],
}

interface IText {
    classList: string[],
    text: string,
}

interface IDiv {
    classList: string[],
}

interface IOption {
    text: string,
    value: string,
}

interface ISelect {
    classList: string[],
    optionClassList: string[],
    label: string,
    labelClassList: string[],
    name: string,
    onChange?: (e: Event) => void;

    options: IOption[],
}