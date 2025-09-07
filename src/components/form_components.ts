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
    selectInfo.labelClassList.forEach(classEl => label.classList.add(classEl));

    const select = document.createElement("select");
    select.name = selectInfo.name;
    select.id = selectInfo.name;
    selectInfo.classList.forEach(classEl => select.classList.add(classEl));

    selectInfo.options.forEach(optionEl => {
        const option = document.createElement("option");
        option.value = optionEl.value;
        option.text = optionEl.text;
        selectInfo.optionClassList.forEach(classEl => option.classList.add(classEl));

        select.appendChild(option);
    });

    selectInfo.onChange && select.addEventListener("change", selectInfo.onChange);

    return [ label, select ];
}

export { Input, Select };