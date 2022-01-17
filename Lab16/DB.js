const mssql = require('mssql');
const config = {
    database: 'NODE_JS',
    server: 'localhost',
    port:1433,
    user: 'Dzush',
    password: 'Rfvbycrbq_1',
    options: {trustServerCertificate: true}
};
function DB(cb){
    this.getFaculties = ()=>{
        return (new mssql.Request())
        .query('SELECT * FROM FACULTY')
        .then((r) =>{ return r.recordset; });
    };
    this.getPulpits = ()=>{
        return (new mssql.Request())
        .query('SELECT * FROM PULPIT')
        .then(r => { return r.recordset; });
    }
    this.getSubjects = ()=>{
        return (new mssql.Request())
        .query('SELECT * FROM SUBJECT')
        .then(r =>{ return r.recordset; });
    }
    this.getTeachers = ()=>{
        return (new mssql.Request())
        .query('SELECT * FROM TEACHER')
        .then(r =>{ return r.recordset; });
    }
    this.getFaculty = (args, context)=>{
        return (new mssql.Request())
        .input('f', mssql.NVarChar, args.FACULTY)
        .query('SELECT TOP(1) * FROM FACULTY WHERE FACULTY = @f')
        .then(r =>{ return r.recordset; });
    }
    this.getPulpit = (args, context)=>{
        return (new mssql.Request())
        .input('p', mssql.NVarChar, args.PULPIT)
        .query('SELECT TOP(1) * FROM PULPIT WHERE PULPIT = @p')
        .then(r =>{ return r.recordset; });
    }
    this.getSubject = (args, context)=>{
        return (new mssql.Request())
        .input('s', mssql.NVarChar, args.SUBJECT)
        .query('SELECT TOP(1) * FROM SUBJECT WHERE SUBJECT = @s')
        .then(r =>{ return r.recordset; });

    }
    this.getTeacher = (args, context)=>{
        return (new mssql.Request())
        .input('t', mssql.NVarChar, args.PULPIT)
        .query('SELECT TOP(1) * FROM TEACHER WHERE TEACHER = @t')
        .then(r =>{ return r.recordset; });
    }
    this.delFaculty = (args, context)=>{
        return (new mssql.Request())
        .input('f', mssql.NVarChar, args.FACULTY)
        .query('DELETE FROM FACULTY WHERE FACULTY = @f')
        .then(r =>{ return r.rowsAffected[0] == 0 ? false : true;})
    }
    this.delPulpit = (args, context)=>{
        return (new mssql.Request())
        .input('p', mssql.NVarChar, args.PULPIT)
        .query('DELETE FROM PULPIT WHERE PULPIT = @p')
        .then(r =>{ return r.rowsAffected[0] == 0 ? false : true;})
    }
    this.delSubject = (args, context)=>{
        return (new mssql.Request())
        .input('s', mssql.NVarChar, args.SUBJECT)
        .query('DELETE FROM SUBJECT WHERE SUBJECT = @s')
        .then(r =>{ return r.rowsAffected[0] == 0 ? false: true;})
    }
    this.delTeacher = (args, context)=>{
        return (new mssql.Request())
        .input('t', mssql.NVarChar, args.TEACHER)
        .query('DELETE FROM TEACHER WHERE TEACHER = @t')
        .then(r =>{ return r.rowsAffected[0] == 0 ? false : true;})
    }
    this.insertFaculty = (args, context)=>{
        return (new mssql.Request())
        .input('f', mssql.NVarChar, args.FACULTY)
        .input('fn', mssql.NVarChar, args.FACULTY_NAME)
        .query('INSERT FACULTY(FACULTY, FACULTY_NAME) VALUES(@f, @fn)')
        .then(r =>{ return args});
    }
    this.insertPulpit = (args, context)=>{
        return (new mssql.Request())
        .input('p', mssql.NVarChar, args.PULPIT)
        .input('pn', mssql.NVarChar, args.PULPIT_NAME)
        .input('f', mssql.NVarChar, args.FACULTY)
        .query('INSERT PULPIT(PULPIT, PULPIT_NAME, FACULTY) VALUES(@p, @pn, @f)')
        .then(r => { return args});
    }
    this.insertSubject = (args, context)=>{
        return (new mssql.Request())
        .input('s', mssql.NVarChar, args.SUBJECT)
        .input('sb', mssql.NVarChar, args.SUBJECT_NAME)
        .input('p', mssql.NVarChar, args.PULPIT)
        .query('INSERT SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) VALUES(@s, @sb, @p)')
        .then(r => {return args});
    }
    this.insertTeacher = (args, context)=>{
        return (new mssql.Request())
        .input('t', mssql.NVarChar, args.TEACHER)
        .input('tn', mssql.NVarChar, args.TEACHER_NAME)
        .input('p', mssql.NVarChar, args.PULPIT)
        .query('INSERT TEACHER(TEACHER, TEACHER_NAME, PULPIT) VALUES(@t, @tn, @p)')
        .then(r => {return args});
    }
    this.updateFaculty = (args, context)=>{
        return (new mssql.Request())
        .input('f', mssql.NVarChar, args.FACULTY)
        .input('fn', mssql.NVarChar, args.FACULTY_NAME)
        .query('UPDATE FACULTY SET FACULTY_NAME = @fn WHERE FACULTY = @f')
        .then(r =>{ return r.rowsAffected[0] == 0 ? null : args;})
    }
    this.updatePulpit = (args, context)=>{
        return (new mssql.Request())
        .input('p', mssql.NVarChar, args.PULPIT)
        .input('pn', mssql.NVarChar, args.PULPIT_NAME)
        .input('f', mssql.NVarChar, args.FACULTY)
        .query('UPDATE PULPIT SET PULPIT_NAME = @pn, FACULTY = @f WHERE PULPIT = @p')
        .then(r =>{ return r.rowsAffected[0] == 0 ? null : args;})
    }
    this.updateSubject = (args, context)=>{
        return (new mssql.Request())
        .input('s', mssql.NVarChar, args.SUBJECT)
        .input('sn', mssql.NVarChar, args.SUBJECT_NAME)
        .input('p', mssql.NVarChar, args.PULPIT)
        .query('UPDATE SUBJECT SET SUBJECT_NAME = @sn, PULPIT = @p WHERE SUBJECT = @s')
        .then(r =>{ return r.rowsAffected[0] == 0 ? null : args;})
    }
    this.updateTeacher = (args, context)=>{
        return (new mssql.Request())
        .input('t', mssql.NVarChar, args.TEACHER)
        .input('tn', mssql.NVarChar, args.TEACHER_NAME)
        .input('p', mssql.NVarChar, args.PULPIT)
        .query('UPDATE TEACHER SET TEACHER_NAME = @tn, PULPIT = @p WHERE TEACHER = @t')
        .then(r =>{ return r.rowsAffected[0] == 0 ? null : args;})
    }
    this.getTeachersByFaculty = (args, context) => {
        console.log(args);
        return (new mssql.Request())
            .input('f', mssql.NVarChar, args.FACULTY)
            .query('select TEACHER.*, PULPIT.FACULTY from TEACHER ' +
                'join PULPIT on TEACHER.PULPIT = PULPIT.PULPIT ' +
                `join FACULTY on PULPIT.FACULTY = FACULTY.FACULTY where FACULTY.FACULTY = @f`)
            .then((r) => {
                let zaps = (o) => { return {TEACHER: o.TEACHER, TEACHER_NAME: o.TEACHER_NAME, PULPIT: o.PULPIT}};
                let zapp = (o) => { return {FACULTY: o.FACULTY, TEACHERS: [zaps(o)]}               };
                let rc = [];
                r.recordset.forEach((el, index) => {
                    if (index === 0)
                        rc.push(zapp(el));
                    else if (rc[rc.length - 1].FACULTY !== el.FACULTY)
                        rc.push(zapp(el));
                    else
                        rc[rc.length - 1].TEACHERS.push(zaps(el));
                });
                console.log(rc)
                return rc;
            })
    };

    this.getSubjectsByFaculties = (args, context) => {
        return (new mssql.Request())
            .input('f', mssql.NVarChar, args.FACULTY)
            .query('select SUBJECT.*, PULPIT.PULPIT_NAME, PULPIT.FACULTY from SUBJECT ' +
                'join PULPIT on subject.PULPIT = PULPIT.PULPIT ' +
                'join FACULTY on PULPIT.FACULTY = FACULTY.FACULTY where FACULTY.FACULTY = @f')
            .then((r) => {
                let zaps = (o) => {return {SUBJECT: o.SUBJECT, SUBJECT_NAME: o.SUBJECT_NAME, PULPIT: o.PULPIT}};
                let zapp = (o) => {return {PULPIT: o.PULPIT, PULPIT_NAME: o.PULPIT_NAME, FACULTY: o.FACULTY, SUBJECTS:[zaps(o)]}};
                let rc = [];
                r.recordset.forEach((el, index) => {
                    if (index === 0)
                        rc.push(zapp(el));
                    else if (rc[rc.length - 1].PULPIT !== el.PULPIT)
                        rc.push(zapp(el));
                    else
                        rc[rc.length - 1].SUBJECTS.push(zaps(el));
                });
                console.log(rc)
                return rc;
            });
    };
    this.connect = mssql.connect(config, err =>{
        err?cb(err, null):cb(null, this.connect);
    });
}
exports.DB = (cb)=>{return new DB(cb)};