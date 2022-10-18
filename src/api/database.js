import AxiosConfig from '../config/axiosConfig'

let http = AxiosConfig.axiosService

export const listConns = params => http.get('/database/list-conns', params)

// export const listConns = params => {
//     return [{ name: "test", "id": 1 }];
// }

export const deleteConn = params => http.delete('/database/delete-conn/' + params)

export const updateConn = params => http.post('/database/update-conn', params)

export const saveConn = params => http.post('/database/save-conn', params)

export const listDbs = params => {
    // console.log(params)
    // return [{
    //     name: 'test', type: 'database', connId: '1', database: 'test', leaf: 'false', tables: [
    //         {
    //             name: 'table1', type: 'table', connId: '1', database: 'test', leaf: 'true', connName: 'test'
    //         }
    //     ]
    // },
    // { name: 'test2', type: 'database', connId: '2', database: 'test2' }];
    return http.get('/database/list-dbs/' + params)
}

export const listTables = params => {
    return http.get('/database/list-tables/' + params.connId + '/' + params.database)
}

export const listSupportTypes = () => {
    return http.get('/database/list-types')
}

export const runSql = params => {
    // console.log(params)
    // return {
    //     tableData: [{
    //         date: '2016-05-02',
    //         name: '王小虎',
    //         address: '上海市普陀区金沙江路 1518 弄'
    //     }, {
    //         date: '2016-05-04',
    //         name: '王小虎',
    //         address: '上海市普陀区金沙江路 1517 弄'
    //     }, {
    //         date: '2016-05-01',
    //         name: '王小虎',
    //         address: '上海市普陀区金沙江路 1519 弄'
    //     }, {
    //         date: '2016-05-03',
    //         name: '王小虎',
    //         address: '上海市普陀区金沙江路 1516 弄'
    //     }],
    //     tableMeta: [{ name: "date", label: "时间" }, { name: "name", label: "名称" }, { name: "address", label: "地址" }]
    // }
    return http.post('/database/run-sql', params)
}
