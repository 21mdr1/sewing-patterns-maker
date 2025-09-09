import fs from 'fs';
import path from 'path';
import { app } from 'electron';

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
    if(!fs.existsSync(filePath)) {
        try {
            fs.writeFileSync(filePath, "", 'utf-8');
            console.log(`Successfully created file ${filePath}`);
        } catch(e) {
            console.log(`Error creating file ${filePath}: ${e}`);
        }
    }
}

export function writeData(dir: string, filePath: string, data: any) {
    filePath = filePath + ".json";
    createDirectory(dir);
    createFile(path.join(dir, filePath));

    try {
        fs.writeFileSync(
            path.join(dir, filePath),
            JSON.stringify(data, null, 2),
            'utf-8'
        );
        console.log(`Successfully wrote to file ${filePath}`);
    } catch(e) {
        console.log(`Error writing to file ${filePath}: ${e}`);
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