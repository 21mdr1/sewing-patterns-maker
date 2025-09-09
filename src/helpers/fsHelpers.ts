import fs from 'fs';
import path from 'path';
import { app, dialog } from 'electron';

export const rootDir = app.getAppPath();
export const userDataDir = path.join(rootDir, "measurements");

export function createDirectory(dir: string) {
    if(!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Successfully created directory ${dir}`);
        } catch(e) {
            console.log(`Error creating directory ${dir}: ${e}`);
        }
    } else {
        console.log(`Directory ${dir} already exists`);
    }
}

export function createFile(filePath: string) {
    createDirectory(path.dirname(filePath));

    if(!fs.existsSync(filePath)) {
        try {
            fs.writeFileSync(filePath, "", 'utf-8');
            console.log(`Successfully created file ${filePath}`);
        } catch(e) {
            console.log(`Error creating file ${filePath}: ${e}`);
        }
    }
}

export function writeData(filePath: string, data: any) {
    createDirectory(path.dirname(filePath));

    try {
        fs.writeFileSync(
            filePath,
            JSON.stringify(data, null, 2),
            'utf-8'
        );
        console.log(`Successfully wrote to file ${filePath}`);
    } catch(e) {
        console.log(`Error writing to file ${filePath}: ${e}`);
    }
}

export async function writeUsingDialog(data: any): Promise<void> {
    createDirectory(userDataDir);

    const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Select the File Path to Save",
        defaultPath: userDataDir,
        buttonLabel: "Save",
        filters: [{
            name: "Json Files",
            extensions: ['measurements.json'],
        }],
        properties: [],
    });

    if (!canceled) {
        writeData(filePath, data);
    }

}

export function readData(filePath: string): any {
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            console.log(`Error reading file ${filePath}: ${e}`);
        }
    } else {
        console.log(`Error reading file ${filePath}: File does not exist`);
        return null;
    }
}

export async function readUsingDialog(): Promise<any> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Select the File Open",
        defaultPath: userDataDir,
        buttonLabel: "Open",
        filters: [{
            name: "Json Files",
            extensions: ['measurements.json'],
        }],
        properties: [ 'openFile' ],
    });

    if (!canceled) {
        return readData(filePaths[0]);
    }
}