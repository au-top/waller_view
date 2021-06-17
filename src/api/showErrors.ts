import axios from "axios";
import { baseConfig } from "./base";
import { PackageStruct } from "./treaty";

export interface ErrorStruct {
    _id: string;
    level: number;
    appName: string;
    appVersion: string;
    allErrorInfo: string;
    clientId: string;
    minErrorInfo: string;
    otherInfo: Record<string, string>;
    token: string;
    recvTime: number;
    sourceIp: string;
}

export interface Statistics {
    ALL: {
        100: number;
        200: number;
        300: number;
    };
    "24": {
        100: number;
        200: number;
        300: number;
    };
}

export async function getShowErrorStruct(): Promise<Array<ErrorStruct>> {
    const ewShowRes = await axios.post<PackageStruct<ErrorStruct[]>>(
        "/ew/show",
        {
            passwd: baseConfig.passwd,
        },
        {
            baseURL: baseConfig.url,
        }
    );
    if ((ewShowRes.data.code = 200)) {
        return ewShowRes.data.data;
    } else {
        throw ewShowRes.data;
    }
}

export async function getStatistics(): Promise<Statistics> {
    const ewShowRes = await axios.post<PackageStruct<Statistics>>(
        "/ew/statistics",
        {
            passwd: baseConfig.passwd,
        },
        {
            baseURL: baseConfig.url,
        }
    );
    if ((ewShowRes.data.code = 200)) {
        return ewShowRes.data.data;
    } else {
        throw ewShowRes.data;
    }
}
