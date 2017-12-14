const mysql = require('mysql2');
const util = require('util');
const {
    hyphenToHump,
    humpToHyphen
} = require('./index');
const dbConfig = {
    'host': 'localhost',
    'port': '3306',
    'database': 'mydb',
    'user': 'root',
    'password': 'pwd123456'
}
const {
    database
} = dbConfig;

const pool = mysql.createPool(dbConfig);

//执行sql语句
const execQuery = (sql, values, callback) => {
    let errinfo;
    pool.getConnection((err, connection) => {
        if (err) {
            errinfo = 'DB-获取数据库连接异常！';
            console.log(errinfo);
            throw errinfo;
        } else {
            let querys = connection.query(sql, values, (err, rows) => {
                release(connection);
                if (err) {
                    errinfo = 'DB-SQL语句执行错误:' + err;
                    console.log(errinfo);
                    //throw errinfo;
                    callback(err);
                } else {
                    callback(err, rows);
                }
            });
            console.log(querys.sql);
        }
    });
}

const release = (connection) => {
    try {
        connection.release((error) => {
            if (error) {
                console.log('DB-关闭数据库连接异常！');
            }
        });
    } catch (err) {}
}

const execUpdate = (sql, values, callback) => {
    execQuery(sql, values, (error, result) => {
        if (callback) {
            callback(error, result);
        }
    });
}
/**
 * [处理返回结果集]
 * @param  {[Array]} error  [description]
 * @param  {[Array]} result [description]
 * @return {[type]}        [description]
 */
const handleResults = (error, results) => {
    if (results) {
        return {
            results,
            success: true,
            statusCode: 1
        }
    } else {
        return {
            results,
            success: false,
            error,
            statusCode: 0
        };
    }
}
/*================================== export ===========================================*/
/**
 * [执行SQL语句]
 * @param  {[String]} sql         [Required]
 * @return {[Object]}             
 */
const execSQL = (sql) => {
    return new Promise(resolve => {
        if (sql) {
            execQuery(sql, (error, results) => {
                resolve(handleResults(error, results));
            });
        } else {
            reject()
            // resolve(handleResults('参数错误！', null));
        }
    });
}

/**
 * [根据id查找]
 * @param  {[String]} tableName   [Required]
 * @param  {[Number]} id          [Required]
 * @return {[Object]}             
 */
const findById = (tableName, id) => {
    return new Promise(async(resolve, reject) => {
        if (!tableName || !id) {
            reject()
            // resolve(handleResults('参数错误！', null));
        } else {
            const values = {
                id
            };
            const alias = await _getColumnAlias(tableName);
            let sql = `select ${alias} from ?? where ?`;
            execQuery(sql, [tableName, values], (error, results) => {
                resolve(handleResults(error, results));
            });
        }
    });
}
/**
 * [通过指定的key查找]
 * @param  {[String]} tableName        [Required]
 * @param  {[JSONObject]} key          [Required]
 * @return {[Object]}                 
 */
const findByKey = (tableName, key) => {
    return new Promise(async resolve => {
        if (!tableName || !key) {
            reject()
            // resolve(handleResults('参数错误！', null));
        } else {
            const alias = await _getColumnAlias(tableName);
            let sql = `SELECT ${alias} FROM ?? WHERE ?`;
            execQuery(sql, [tableName, key], (error, results) => {
                resolve(handleResults(error, results));
            });
        }
    });
}

/**
 * [多条件查找]
 * @param  {[Object.String]} options.tableName   [Required]
 * @param  {[Object.String]} options.fields      [Optional 字段名]
 * @param  {[Object.Array]} options.where        [Optional 条件数组]
 * @param  {[Object.String]} options.order       [Optional 排序]
 * @param  {[Object.String]} options.group       [Optional 分组]
 * @return {[Object]}                            
 */
const findByConditions = ({
    tableName,
    fields,
    where: whereArr,
    order,
    group
}) => {
    return new Promise(async resolve => {
        // 获取别名
        const alias = await _getColumnAlias(tableName, fields);
        let sql = `SELECT ${alias} FROM ??`;
        // 组装 where
        sql = appendSqlWhere(sql, whereArr);
        sql = appendGroup(sql, group);
        sql = appendSqlOrder(sql, order);
        execQuery(sql, tableName, (error, results) => {
            resolve(handleResults(error, results));
        });
    });
}

/**
 * [添加记录]
 * @param  {[String]} options.tableName     [Required]
 * @param  {[JSONObject]} options.values    [Required]
 * @return {[Object]}                      
 */
const addRecord = ({
    tableName,
    values
}) => {
    return new Promise(async resolve => {
        if (!tableName || !values) {
            resolve(handleResults('参数错误！', null));
        } else {
            let sql = `INSERT INTO ??`;
            sql = appendSqlSet(sql, values);
            execUpdate(sql, tableName, (error, results) => {
                resolve(handleResults(error, results));
            });
        }
    });
}

/**
 * [更新记录]
 * @param  {[String]} options.tableName              [Required]
 * @param  {[JSONObject]} options.values             [Required]
 * @param  {[Array]} options.where:    whereArr      [Required]
 * @return {[Object]}                               
 */
const updateRecord = ({
    tableName,
    values,
    where: whereArr
}) => {
    return new Promise(async resolve => {
        if (!tableName || !values || !whereArr) {
            reject()
            // resolve(handleResults('参数错误！', null));
        } else {
            let sql = `UPDATE ??`;
            sql = appendSqlSet(sql, values);
            sql = appendSqlWhere(sql, whereArr);
            execUpdate(sql, tableName, (error, results) => {
                resolve(handleResults(error, results));
            });
        }
    });

}

/**
 * [删除记录]
 * @param  {[String]} options.tableName              [Required]
 * @param  {[Array]} options.where:    whereArr      [Required]
 * @return {[type]}                  
 */
const deleteRecord = ({
    tableName,
    where: whereArr
}) => {
    return new Promise(async resolve => {
        if (!tableName || !whereArr) {
            reject()
            // resolve(handleResults('参数错误！', null));
        } else {
            let sql = `DELETE from ??`;
            sql = appendSqlWhere(sql, whereArr);
            execUpdate(sql, tableName, (error, results) => {
                resolve(handleResults(error, results));
            });
        }
    });
}

//查询分页
const queryPage = (sql, values, page, size, callback) => {
    if (page > 0) {
        page--;
    } else {
        page = 0;
    }
    execQuery(sql + ' LIMIT ' + page * size + ',' + size, values, (rresult) => {
        const index = sql.toLocaleUpperCase().lastIndexOf(' FROM');
        sql = 'SELECT COUNT(*) count ' + sql.substring(index);
        execQuery(sql, values, (cresult) => {
            if (callback) {
                let pagenum = cresult[0].count / size;
                if (cresult[0].count % size > 0) {
                    pagenum++;
                }
                callback({
                    count: pagenum,
                    rows: rresult
                });
            }
        });
    });
}


/*============================= utils ==================================*/

/**
 * [组装 带 WHERE 的 SQL语句]
 * @param  {[String]} sql         [select语句] SELECT * FROM ??
 * @param  {[Array]} whereArr     [Optional 条件数组] ['a = 1', 'b > 2', "name = 'name'"]
 * @return {[String]}             [description]
 * SELECT * FROM ??{{ WHERE a = 1 AND b > 2 AND name = 'name'}}
 */
const appendSqlWhere = (sql, whereArr = []) => {
    if (Object.is(null, whereArr) || Object.is(undefined, whereArr) ||
        Object.is([], whereArr)) {
        return sql;
    } else {
        const whereStr = whereArr.join(' AND ').trim();
        return `${sql} WHERE ${whereStr}`;
    }
}
/**
 * [组装 SET语句]
 * @param  {[String]} sql       [sql] UPDATE ??
 * @param  {[Object]} values    [JSON] { a: 1, stu_id: 2, name: 'name' }
 * @return {[String]}           [description]
 * UPDATE ??{{ SET a = 1, stuId = 2, name = 'name'}}
 */
const appendSqlSet = (sql, values) => {
    const arr = [];
    Object.keys(values).forEach(key => {
        const k = humpToHyphen(key);
        const v = values[key];
        arr.push(`\`${k}\` = '${v}'`);
    });
    const setSql = arr.join(', ').trim();
    return `${sql} SET ${setSql}`;
}

/**
 * [ORDER BY 语句]
 * @param  {[String]} sql   [description]
 * @param  {[String]} order [description]
 * @return {[String]}       [description]
 */
const appendSqlOrder = (sql, order) => {
    if (order) {
        order = hyphenToHump(order);
        return `${sql} ORDER BY ${order}`;
    } else {
        return sql;
    }

}
/**
 * [GROUP BY 语句]
 * @param  {[String]} sql   [description]
 * @param  {[String]} group [description]
 * @return {[String]}       [description]
 */
const appendGroup = (sql, group) => {
    if (group) {
        group = hyphenToHump(group);
        return `${sql} GROUP BY ${group}`;
    } else {
        return sql;
    }
}

/**
 * [将字段名 改为 驼峰式别名]
 * null | * => 全部转换
 * @param  {[String]} tableName   [description]
 * @param  {[String]} fields      [Optional参数]    id, stu_id, password'
 * @return {[String]}             [description] 'id AS id, stu_id AS stuId, password AS password'
 */
const _getColumnAlias = (tableName, fields = '*') => {
    let queryFieldsSql = '';
    // 输入为空 || 不输入 || 输入为 * 取全部字段
    if (Object.is(null, fields) || Object.is(undefined, fields) ||
        Object.is('*', fields.trim()) || Object.is('', fields.trim())) {
        queryFieldsSql = `select COLUMN_NAME as columnName from information_schema.COLUMNS where table_name = '${tableName}' and table_schema = '${database}';`;
        return new Promise(resolve => {
            execQuery(queryFieldsSql, tableName, (err, result) => {
                // result = [{ columnName:id}, {columnName:stu_id}, {columnName:password}]
                let fieldsArr = [];
                result.forEach(item => {
                    let {
                        columnName
                    } = item;
                    fieldsArr.push(columnName.trim());
                });
                const asSql = _parseFieldsArrToAliasSql(fieldsArr);
                resolve(asSql);
            });
        });
    } else {
        queryFieldsSql = fields;
        return new Promise(resolve => {
            const fieldsArr = queryFieldsSql.replace(/\s+/g, '').split(',');
            const asSql = _parseFieldsArrToAliasSql(fieldsArr);
            resolve(asSql);
        });
    }


}
/**
 * [将字段数组转为带驼峰式命名的SQL语句]
 * @param  {[Array]} arr  [去除空格的array]  ['id', 'stu_id', 'password']
 * @return {[String]}     [description]     id AS id, stu_id AS stuId, password AS password
 */
const _parseFieldsArrToAliasSql = (arr) => {
    // ['id', 'stu_id', 'password']
    //      ==>  id,stu_id,password,
    const t = arr.join(',') + ',';
    // id AS id, stu_id AS stuId, password AS password, //
    const asSql = t.replace(/\w+,/g, match => {
        const _field = match.substring(0, match.length - 1);
        const _alias = hyphenToHump(_field)
        return `\`${_field}\` AS \`${_alias}\`, `;
    });
    // id AS id, stu_id AS stuId, password AS password//
    return asSql.substring(0, asSql.length - 2);
}
module.exports = {
    queryPage,
    execSQL, // 执行SQL语句
    findById, // 根据id查找
    findByKey, // 根据字段查找
    findByConditions, // 多条件查找
    addRecord, // 添加记录
    updateRecord, // 更新记录
    deleteRecord, // 删除记录
}