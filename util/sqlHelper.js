const sqlHelper = {
    SelectSimple(table, data = null, cols = []) {
        let query = `SELECT * FROM ${table}`;
        const where = [];
        const values = [];

        if (data) {
            const fields = Object.keys(data);
            for (const field of fields) {
                where.push(`${field}=?`);
                values.push(data[field]);
            }
            query += ` WHERE ` + where.join(' AND ');
        }

        if (cols.length > 0) {
            query = query.replace('*', cols.join(', '));
        }

        return { query, values };
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
    }
};

module.exports = sqlHelper;