export const parseHalfPrice = price => {
    var hp = price / 2;

    if(hp % 1 != 0) {
        var precision = hp.toPrecision(3);

        if(precision.split('.')[1].length > 2) {
            const val = precision.substring(0, precision.split('.')[0].length + 3);

            return val;
        }

        return Number(precision);
    }

    return hp;
}