const path = require('path');
const fs = require('fs');

const admBoardModel = {
    async skinList() {
        const skinPath = path.join(__dirname, "../../../src/views/board/skins");
        const files = fs.readdirSync(skinPath, { withFileTypes : true });
        const skins = [];
        files.forEach(p => {
            if (p.isDirectory()) {
                skins.push(p.name);
            }
        });
        return skins;
    },
};

module.exports = admBoardModel;