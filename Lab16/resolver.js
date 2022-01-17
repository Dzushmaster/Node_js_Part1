const resolver = {
    getFaculties:(args, context)=>{
        return (args.FACULTY)?context.getFaculty(args, context) : context.getFaculties();
    },
    getPulpits:(args, context)=>{
        return (args.PULPIT)?context.getPuplit(args, context): context.getPulpits();
    },
    getSubjects:(args, context)=>{
        return (args.SUBJECT)?context.getSubject(args, context):context.getSubjects();
    },
    getTeachers:(args, context)=>{
        return (args.TEACHER)?context.getTeacher(args, context):context.getTeachers();
    },
    setFaculty: async(args, context)=>{
        let result = await context.updateFaculty(args, context);
        return (result == null)?context.insertFaculty(args, context):result;
    },
    setPulpit: async(args, context)=>{
        let result = await context.updatePulpit(args, context);
        return (result == null)?context.insertPulpit(args, context):result;
    },
    setSubject: async(args, context)=>{
        let result = await context.updateSubject(args, context);
        return (result == null)?context.insertSubject(args, context):result;
    },
    setTeacher: async(args, context)=>{
        let result = await context.updateTeacher(args, context);
        return (result == null)?context.insertTeacher(args, context):result;
    },
    delFaculty: async(args, context)=>{
        let result = await context.delFaculty(args, context);
        return result;
    },
    delPulpit: async(args, context)=>{
        let result = await context.delPulpit(args, context);
        return result;
    },
    delSubject: async(args, context)=>{
        let result = await context.delSubject(args, context);
        return result;
    },
    delTeacher: async(args, context)=>{
        let result = await context.delTeacher(args, context);
        return result;
    },
    getTeachersByFaculty:(args, context)=>{
        return context.getTeachersByFaculty(args, context);
    },
    getSubjectsByFaculties:(args, context)=>{
        return context.getSubjectsByFaculties(args, context);
    }
};
module.exports = resolver;