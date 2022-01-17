const sql = require('mssql');

const config = {
    database: 'NODE_JS',
    server: 'localhost',
    port:1433,
    user: 'Dzush',
    password: 'Rfvbycrbq_1',
    options: {trustServerCertificate: true}
};
class DB {
    constructor()
    {
        this.connectionPool = new sql.ConnectionPool(config).connect().then(pool =>{
            console.log('Connected to MS SQL server');
            return pool;
        }).catch(err => console.log('Connection failed: ', err));
    }

    getFacult() {
        return this.connectionPool.then(pool => 
            pool.request().query('select * from faculty'))
    }
    getPulp(){
        return this.connectionPool.then(pool=>
            pool.request().query('SELECT * FROM PULPIT'))
    }
    getSub(){
        return this.connectionPool.then(pool=>
            pool.request().query('select * from subject'))
    }
    getAud_Type(){
        return this.connectionPool.then(pool=>
            pool.request().query('select * from auditorium_type'))
    }
    getAud(){
        return this.connectionPool.then(pool=>
            pool.request().query('select * from auditorium'))
    }

    postFacult(facult, facultName){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('faculty', sql.NVarChar, facult)
                .input('faculty_name', sql.NVarChar, facultName)
                .query('insert into faculty(faculty, faculty_name) values (@faculty, @faculty_name)')
        });
    }
    postPulp(pulpit, pulpit_name, faculty){
        console.log('--------------------------------------------' + pulpit);
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .input('pulpit_name', sql.NVarChar, pulpit_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('insert into pulpit(pulpit, pulpit_name, faculty) values (@pulpit, @pulpit_name, @faculty)')
        });
    }
    postSub(subject, subject_name, pulpit){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subject_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('insert into subject(subject, subject_name, pulpit) values (@subject, @subject_name, @pulpit)')
        });
    }
    postAud_Type(auditorium_type, auditorium_typename){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_typename', sql.NVarChar, auditorium_typename)
                .query('insert into auditorium_type(auditorium_type, auditorium_typename) values (@auditorium_type, @auditorium_typename)')
        });
    }
    postAud(auditorium, auditorium_name, auditorium_capacity, auditorium_type){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium_name)
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_capacity', sql.Numeric, auditorium_capacity)
                .query('insert into auditorium(auditorium, auditorium_name, auditorium_capacity, auditorium_type) values (@auditorium, @auditorium_name, @auditorium_capacity, @auditorium_type)')
        });
    }

    putFacult(facult, facultName){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('faculty', sql.NVarChar, facult)
                .input('faculty_name', sql.NVarChar, facultName)
                .query('update dbo.FACULTY SET faculty_name = @faculty_name where faculty = @faculty')
        });
    }
    putPulp(pulpit, pulpit_name, faculty){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('faculty', sql.NVarChar, faculty)
                .input('pulpit_name', sql.NVarChar, pulpit_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('update dbo.PULPIT SET pulpit_name = @pulpit_name, faculty = @faculty where pulpit = @pulpit')
        });
    }
    putSub(subject, subject_name, pulpit){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subject_name)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('update dbo.SUBJECT SET subject_name = @subject_name, puplit = @pulpit where subject = @subject')
        });
    }
    putAud_Type(auditorium_type, auditorium_typename){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_typename', sql.NVarChar, auditorium_typename)
                .query('update dbo.auditorium_type set auditorium_typename = @auditorium_typename where auditorium_type = @auditorium_type')
        });
    }
    putAud(auditorium, auditorium_name, auditorium_capacity, auditorium_type){
        return this.connectionPool.then(pool=>{
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium_name)
                .input('auditorium_type', sql.NVarChar, auditorium_type)
                .input('auditorium_capacity', sql.Numeric, auditorium_capacity)
                .query('update dbo.auditorium set auditorium_name = @auditorium_name, auditorium_type = @auditorium_type, auditorium_capacity = @auditorium_capacity where auditorium = @auditorium')
        });
    }

    deleteFaculty(faculty){
        return this.connectionPool.then(pool =>{
            return pool.request()
            .input('faculty', sql.NVarChar, faculty)
            .query('delete dbo.faculty where faculty = @faculty')
        });
    }
    deletePulp(pulpit){
        return this.connectionPool.then( pool => {
            return pool.request()
            .input('pulpit', sql.NVarChar, pulpit)
            .query('delete pulpit where pulpit = @pulpit')
        });
    }
    deleteSub(subject){
        return this.connectionPool.then(pool =>{
            return pool.request()
            .input('sub', sql.NVarChar, subject)
            .query('delete subject where subject = @sub')
        });
    }
    deleteAud_Type(type){
        return this.connectionPool.then(pool =>{
            return pool.request()
            .input('type', sql.NVarChar, type)
            .query('delete auditorium_type where auditorium_type = @type')
        });
    }
    deleteAud(aud){
        return this.connectionPool.then(pool=>{
            return pool.request()
            .input('aud', sql.NVarChar, aud)
            .query('delete auditorium where auditorium = @aud');
        });
    }
    findFacult(facult){
        return this.connectionPool.then(pool =>{
            return pool.request()
            .input('facult', sql.NVarChar, facult)
            .query('select * from faculty where faculty = @facult');
        })
    }
    findPulp(pulp){
        return this.connectionPool.then(pool =>{
            return pool.request()
            .input('pulp', sql.NVarChar, pulp)
            .query('select * from pulpit where pulpit = @pulp');
        })
    }
    findSub(sub){
        return this.connectionPool.then(pool =>{
            return pool.request()
            .input('sub', sql.NVarChar, sub)
            .query('select * from subject where subject = @sub');
        })
    }
    findAud_TP(type){
        return this.connectionPool.then(pool =>{
            return pool.request()
            .input('type', sql.VarChar, type)
            .query('select * from auditorium_type where auditorium_type = @type');
        })
    }
    findAud(aud){
        return this.connectionPool.then(pool =>{
            return pool.request()
            .input('aud', sql.VarChar, aud)
            .query('select * from dbo.auditorium where auditorium = @aud');
        })
    }

}
module.exports = DB;