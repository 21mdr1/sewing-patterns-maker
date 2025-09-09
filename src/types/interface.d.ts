export interface IEnv {
    isProd: boolean,
    rootDir: () => string,
    writeData: (filePath: string, data: any) => void,
    writeUsingDialog: (data: any) => void,
    readData: (filePath: string) => Promise<any>,
    readUsingDialog: () => Promise<any>,
}

declare global {
    interface Window {
        env: IEnv,
    }
}