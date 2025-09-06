function cm_to_in(num: number){
    return num / 2.54;
}

function in_to_cm(num: number) {
    return num * 2.54;
}

function cm_to_mm(num: number) {
    return num * 10;
}

function mm_to_cm(num: number) {
    return num / 10;
}

function in_to_mm(num: number) {
    return cm_to_mm(in_to_cm(num));
}

function mm_to_in(num: number) {
    return cm_to_in(mm_to_cm(num));
}


export { cm_to_in, in_to_cm, cm_to_mm, mm_to_cm, in_to_mm, mm_to_in };