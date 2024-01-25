const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
    try {
        const sourcePath = path.join(__dirname, 'files');
        const destinationPath = path.join(__dirname, 'files-copy');

        await fs.mkdir(destinationPath, { recursive: true });

        const sourceFiles = await fs.readdir(sourcePath);
        const destinationFiles = await fs.readdir(destinationPath);

        for (const file of destinationFiles) {
            if (!sourceFiles.includes(file)) {
                const filePath = path.join(destinationPath, file);
                await fs.unlink(filePath);
            }
        }

        for (const file of sourceFiles) {
            const sourceFile = path.join(sourcePath, file);
            const destinationFile = path.join(destinationPath, file);

            // Копируем или обновляем файл
            await fs.copyFile(sourceFile, destinationFile);
        }

        console.log('Директория успешно скопирована.');
    } catch (error) {
        console.error('Ошибка при копировании директории:', error.message);
    }
}

(async () => {
    await copyDir();
})();
