import { DetailReport } from "../models/Report";
import { deleteItemsWhere, getItem } from "./apiFirebaseGeneral";


const COLLECTION = "Reports";


export async function apiLoadReport(reportId: string): Promise<DetailReport|null> {
    const report = await getItem<DetailReport>(COLLECTION, reportId);
    if(!report) {
        return null;
    }
    return report;
}


export async function apiDeleteReportsForGame(gameId: string): Promise<void> {
    return await deleteItemsWhere(COLLECTION, ["gameId", "==", gameId]);
}