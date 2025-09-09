export interface IEnv {
    isProd: boolean,
    rootDir: () => string,
    writeData: (dir: string, filePath: string, data: any) => void,
    readData: (filePath: string) => Promise<any>,
}

declare global {
    interface Window {
        env: IEnv,
    }
}