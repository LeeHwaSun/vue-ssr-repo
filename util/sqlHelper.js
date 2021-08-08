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
    }
};

module.exports = sqlHelper;