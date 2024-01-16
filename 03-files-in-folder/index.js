const fs = require('fs/promises');
const path = require('path');

const folderPath = '03-files-in-folder/secret-folder';

async function filesInfo(){
    try {
        const files = await fs.readdir(folderPath, { withFileTypes: true });

        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(folderPath, file.name);
                const fileStat = await fs.stat(filePath);

                const fileName = path.parse(file.name).name;
                const fileExtname = path.extname(file.name).slice(1);
                const fileSize = fileStat.size;

                console.log(`${fileName} - ${fileExtname} - ${fileSize} kb`);
            } else {
                console.error(`Error: ${file.name} is not a file.`);
            }
        }
    } catch (err) {
        console.error(`Error reading directory: ${err.message}`);
    }
}
(async () => {
    await filesInfo();
})();
