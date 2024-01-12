const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
    const sourceDir = path.join(__dirname, 'files');
    const destinationDir = path.join(__dirname, 'files-copy');

    try {

        await fs.mkdir(destinationDir, { recursive: true });


        const files = await fs.readdir(sourceDir);


        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const destinationPath = path.join(destinationDir, file);

            await fs.copyFile(sourcePath, destinationPath);
        }

        console.log('Копирование завершено успешно');
    }  catch (err) {
        console.error(`Ошибка при копировании: ${err.message}`);
    }
}

(async () => {
    await copyDir();
})();