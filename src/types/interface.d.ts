export interface IEnv {
    desktop: boolean,
    isProd: () => Promise<boolean>,
}

export interface IDataExchange {
    writeData: (filePath: string, data: any) => void,
    writeUsingDialog: (data: any) => void,
    readData: (filePath: string) => Promise<any>,
    readUsingDialog: () => Promise<any>,
}

declare global {
    interface Window {
        env: IEnv,
        exchangeData: IDataExchange,
    }
}