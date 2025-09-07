function Input(inputInfo: IInput) {
    const input = document.createElement("input");
    inputInfo.classList.forEach(classEl => input.classList.add(classEl));
    input.type = inputInfo.type;
    input.name = inputInfo.name;
    input.id = inputInfo.name;
    inputInfo.placeholder && (input.placeholder = inputInfo.placeholder);

    input.required = true;

    const label = document.createElement("label");
    label.htmlFor = inputInfo.name;
    inputInfo.labelClassList.forEach(classEl => label.classList.add(classEl));
    label.textContent = inputInfo.label;
    return [ label, input ];
}

function Select(selectInfo: ISelect) {
    const label = document.createElement("label");
    label.htmlFor = selectInfo.name;
    label.textContent = selectInfo.label;
    selectInfo.labelClassList.forEach(classEl => label.classList.add(classEl));

    const select = document.createElement("select");
    select.name = selectInfo.name;
    select.id = selectInfo.name;
    select.onchange = selectInfo.onChange;
    selectInfo.classList.forEach(classEl => select.classList.add(classEl));

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.text = "Coose Option"
    placeholder.disabled = true;
    placeholder.hidden = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    selectInfo.options.forEach(optionEl => {
        const option = document.createElement("option");
        option.value = optionEl.id;
        option.text = optionEl["display-name"];
        selectInfo.optionClassList.forEach(classEl => option.classList.add(classEl));

        select.appendChild(option);
    });

    return [ label, select ];
}

function Button({ classList, text, type = "submit", onChange }: IButton) {
    const button = document.createElement("button");
    classList.forEach(el => button.classList.add(el));
    button.textContent = text;

    button.type = type;
    button.onchange = onChange;

    return button;
}

function StyledSelect(info: ISelect) {
    const [ label, select ] = Select({
        classList: [ "styled-select__select" ],
        labelClassList: [ "styled-select__label" ],
        optionClassList: ["styled-options__options" ],
        ...info
    });

    const div = document.createElement("div");
    div.classList.add("styled-select__container");

    div.appendChild(label);
    div.appendChild(select);

    return div;
}

function StyledInput(info: IInput) {
    const [ label, input ] = Input({
        classList: [ "styled-input__input" ],
        labelClassList: [ "styled-input__label" ],
        ...info
    });

    const div = document.createElement("div");
    div.classList.add("styled-input__container");
    div.appendChild(label);
    div.appendChild(input);

    return div;
}

function StyledButton(info: IButton) {
    const button = Button({
        classList: [ 'styled-button' ],
        ...info
    });

    return button;
}

export { Input, Select, Button, StyledSelect, StyledInput, StyledButton };