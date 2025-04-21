const path = require("path");

module.exports = {
    process(_src, filename) {
        return {
            code: `module.exports = ${JSON.stringify(path.basename(filename))};`,
        };
    }
};
