export const requiredDefined = value => {
    if(value === null || value === undefined) {
        return 'Ce champ est obligatoire!';
    }

    return true;
}

export const requiredText = value => {
    if(value === '') {
        return 'Veuillez remplir ce champ!';
    }

    return true;
}

export const requiredPositiveNumber = value => {
    if(value <= 0) {
        return 'Ce champ doit avoir une valeur positive!';
    }

    return true;
}