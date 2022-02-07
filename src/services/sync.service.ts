import db from "../db";
import axios from "axios";
import {TABLES} from "../db/db.constants";

class SyncService {
    static async retryApiCalls() {
        const failedCalls = await db.table(TABLES.APICALLS).toArray();
        console.log(failedCalls);
        for (const fc of failedCalls) {
            if(fc.method && (fc.method.toLowerCase()!=='post' || fc.method.toLowerCase()!=='put' || fc.method.toLowerCase()!=='delete')) {
                const res = await axios({
                    url: fc.url,
                    method: fc.method,
                    data: fc.data && JSON.parse(fc.data)
                })
                console.log(fc.id, fc.method, res.data)
                await db.table(TABLES.APICALLS).delete(fc.id)
            }
        }
    }
}

export default SyncService;
