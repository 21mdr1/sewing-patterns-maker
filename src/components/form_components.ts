function Input(inputInfo: IInput) {
    const input = document.createElement("input");
    inputInfo.classList.forEach(classEl => input.classList.add(classEl));
    input.type = inputInfo.type;
    input.name = inputInfo.name;
    input.id = inputInfo.name;
    input.placeholder= inputInfo.placeholder;

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
        option.value = optionEl.value;
        option.text = optionEl.text;
        selectInfo.optionClassList.forEach(classEl => option.classList.add(classEl));

        select.appendChild(option);
    });

    return [ label, select ];
}

export { Input, Select };