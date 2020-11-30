const _ = require('lodash');

function hierarchicalRow(flatRow) {
    return _.reduce(flatRow, (row, value, fullKey) => {
        if (fullKey.includes('__')) {
            const [key, subkey] = fullKey.split('__');

            if (!row[key]) {
                row[key] = {};
            }

            row[key][subkey] = value;
        } else {
            row[fullKey] = value;
        }

        return row;
    }, {});
}

module.exports.getHierarchical = (rows) => {
    if (Array.isArray(rows)) {
        return rows.map(hierarchicalRow);
    }

    return hierarchicalRow(rows);
};