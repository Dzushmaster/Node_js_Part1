const mssql = require('mssql');
let config = {
database: 'NODE_JS',
server: 'localhost',
port:1433,
user: 'Dzush',
password: 'Rfvbycrbq_1',
options: {trustServerCertificate: true}
};
function DB(cb){
    this.connect = mssql.connect(config, err =>{
        err?cb(err, null):cb(null, this.connect);
    });
//     this.users = (args, context)=>{
//         return (new mssql.Request())
//         .query('select TB.*, Repositories.name, Repositories.ownerId from TB join Repositories on TB.id = Repositories.id')
//         .then((r) => {
//             let zaps = (o) => { return {id: o.id, name: o.name, email: o.email, password: o.password, age: o.age}};
//             let zapp = (o) => { return {id: o.id, rep: [zaps(o)]}               };
//         let rc = [];
//         r.recordset.forEach((el, index) => {
//             if (index === 0)
//                 rc.push(zapp(el));
//             else if (rc[rc.length - 1].id !== el.id)
//                 rc.push(zapp(el));
//             else
//                 rc[rc.length - 1].rep.push(zaps(el));
//         });
//         console.log(rc)
//         return rc;
//     })
// }
    this.createUser = (args, context)=>{
        return (new mssql.Request())
        .input('id', mssql.NVarChar, args.id)
        .input('name', mssql.NVarChar, args.name)
        .input('email', mssql.NVarChar, args.email)
        .input('pass', mssql.NVarChar, args.password)
        .input('age', mssql.NVarChar, args.age)
        .query('insert TB values(@id, @name, @email, @pass, @age)')
        .then(r =>{ return user});
    }
}
exports.DB = (cb)=>{return new DB(cb)};