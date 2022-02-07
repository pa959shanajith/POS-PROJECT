
import Dexie from 'dexie';
const db: Dexie = new Dexie('pos');

db.version(1).stores(
    {
        employees: "id,name,pin,RoleId,ShopId,createdAt,updatedAt,Role",
        apiCalls: "id++,type,url,payload"
    },
)

export default db;


