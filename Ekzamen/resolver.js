const resolver = {
    users:(args, context)=>{
    return context.users();
    },
    createUser: (args, context)=>{
        console.log('\n\n\n' + args + '\n\n\n');
        return (result == null)?context.createUser(args):result;
    }
}
module.exports = resolver;
