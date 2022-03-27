const sqlHelper = {
    SelectSimple(table, data = null, cols = [], sort=null) {
        let query = `SELECT * FROM ${table}`;
        const where = [];
        const values = [];

        if (data) {
            const fields = Object.keys(data);
            for (const field of fields) {
                where.push(`${field}=?`);
                values.push(data[field]);
            }
            if (where.length > 0) {
                query += ` WHERE ` + where.join(' AND ');
            }
        }

        // 선택 필드
        if (cols.length > 0) {
            query = query.replace('*', cols.join(', '));
        }

        // 정렬 규칙
        if (sort) {
            let sorts = [];
            const keys = Object.keys(sort);
            for (const key of keys) {
                const val = sort[key];
                sorts.push(key + (sort[key] ? ' ASC ' : ' DESC '));
            }
            if (sorts.length) {
                query += ` ORDER BY ` + sorts.join(', ');
            }
        }

        return { query, values };
    },
    SelectLimit(table, options, cols = []) {
        // 검색
        let where = "";
        let whereArr = [];
        let values = [];
        if (options.stf && options.stx && options.stc) {
            for (let i in options.stf) {
                const field = options.stf[i];
                const text = options.stx[i];
                const compare = options.stc[i];
                if (field && text) {
                    switch (compare) {
                        case "like" :
                            whereArr.push(` ${field} LIKE ? `);
                            values.push(`%${text}%`);
                            break;
                        case "null" :
                            whereArr.push(` ${field} IS NULL `);
                            break;
                        case "not" :
                            whereArr.push(` ${field} IS NOT NULL `);
                            break;
                        case "lt" :
                            whereArr.push(` ${field} < ? `);
                            values.push(text);
                            break;
                        case "lte" :
                            whereArr.push(` ${field} <= ? `);
                            values.push(text);
                            break;
                        case "eq" :
                            whereArr.push(` ${field} = ? `);
                            values.push(text);
                            break;
                        case "ne" :
                            whereArr.push(` ${field} != ? `);
                            values.push(text);
                            break;
                        case "gt" :
                            whereArr.push(` ${field} > ? `);
                            values.push(text);
                            break;
                        case "gte" :
                            whereArr.push(` ${field} >= ? `);
                            values.push(text);
                            break;
                    }
                }
            }
        }
        if (whereArr.length) {
            where = ` WHERE ` + whereArr.join(' AND ');
        }

        // 정렬
        let order = "";
        let orderArr = [];
        if (options.sortBy && options.sortDesc) {
            for (let i in options.sortBy) {
                let sort = options.sortBy[i];
                let desc = options.sortDesc[i];
                if (typeof(desc) == 'boolean') {
                    sort += desc ? " ASC " : " DESC ";
                } else {
                    sort += desc == 'true' ? " ASC " : " DESC ";
                }
                orderArr.push(sort);
            }
        }
        if (orderArr.length) {
            order = " ORDER BY " + orderArr.join(", ");
        }

        // 페이지네이션
        let limit = "";
        if (options.page && options.itemsPerPage) {
            const start = ( options.page - 1 ) * options.itemsPerPage;
            limit = ` LIMIT ${start}, ${options.itemsPerPage}`;
        }

        let query = `SELECT * FROM ${table} ${where} ${order} ${limit}`;
        if (cols.length) {
            query = query.replace('*', cols.join(', '));
        }

        let countQuery = `SELECT COUNT(*) AS totalItems FROM ${table} ${where}`;
        return { query, countQuery, values };
    },
    Insert(table, data) {
        let query = `INSERT INTO ${table} ({1}) VALUES ({2})`;
        const fields = Object.keys(data);
        const prepare = new Array(fields.length).fill('?').join(', ');
        const values = [];
        for (const field of fields) {
            values.push(data[field]);
        }

        query = query.replace('{1}', fields.join(', '));
        query = query.replace('{2}', prepare);

        return { query, values };
    },
    InsertBulk(table, datas){
        let sql;
        let prepare; // (?,?,?)
        for (const i in datas) {
            const data = datas[i];
            const keys = Object.keys(data);
            if (i == 0) {
                sql = sqlHelper.Insert(table, data);
                prepare = new Array(keys.length).fill('?').join(', ');
            } else {
                sql.query += `, (${prepare})`;
                for (const key of keys) {
                    sql.values.push(data[key]);
                }
            }
        }
        return sql;
    },
    Update(table, data, where) {
        let query = `UPDATE ${table} SET {1} WHERE {2}`;
        const keys = Object.keys(data);
        const sets = [];
        const values = [];
        for (const key of keys) {
            sets.push(`${key}=?`);
            values.push(data[key]);
        }
        query = query.replace('{1}', sets.join(', '));

        const whereKeys = Object.keys(where);
        const wheres = [];
        for (const key of whereKeys) {
            wheres.push(`${key}=?`);
            values.push(where[key]);
        }

        query = query.replace('{2}', wheres.join(' AND '));

        return { query, values };
    },
    DeleteSimple(table, data) {
        let query = `DELETE FROM ${table}`;
        const where = [];
        const values = [];

        if (data) {
            const fields = Object.keys(data);
            for (const field of fields) {
                where.push(`${field}=?`);
                values.push(data[field]);
            }
            query += ` WHERE ` + where.join(' AND ');
        } else {
            throw new Error('WHERE가 없습니다.');
        }

        return { query, values };
    },
    InsertOrUpdate(table, data) {
        let query = `INSERT INTO ${table} ({1}) VALUES ({2}) ON DUPLICATE KEY UPDATE {3}`;
        const keys = Object.keys(data);
        const prepare = new Array(keys.length).fill('?').join(', ');
        const values = [];
        const sets = [];
        for (const key of keys) {
            values.push(data[key]);
            sets.push(`${key}=?`);
        }

        query = query.replace('{1}', keys.join(', '));
        query = query.replace('{2}', prepare);
        query = query.replace('{3}', sets.join(', '));
        return { query, values : values.concat(values) };
    },
};

module.exports = sqlHelper;