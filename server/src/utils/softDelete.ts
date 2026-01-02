import db from "../db/knex";

export function activeOnly<T>(query: any): any {
  return query.where("active", true);
}

export async function softDelete(table: string, idCol: string, id: string) {
  return db(table).where(idCol, id).update({
    active: false,
    deleted_at: db.fn.now()
  });
}
