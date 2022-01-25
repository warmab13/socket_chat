const { io } = require('../server');
const { Users } = require('../classes/users')
const { createMessage } = require('../utils/utils') 

const users = new Users();


io.on('connection', (client) => {
    client.on('enterChat', (data, callback)=>{
        if( !data.name || !data.room){
            return callback({
                error:true,
                msg: 'El nombre es necesario'
            });
        }

        client.join(data.room);

        let persons = users.addPerson( client.id, data.name, data.room );
        console.log("Persons", persons)

        let getPersons = users.getPersonsOnRoom(data.room)
        console.log("Get Persons", getPersons)
        client.broadcast.to(data.room).emit('personsList', getPersons);

        callback(users.getPersonsOnRoom(data.room));
    })

    client.on('createMessage', (data, callback)=>{
        let person = users.getPerson(client.id)
        let msg = createMessage(person.name, data.msg)
        client.broadcast.to(person.room).emit('createMessage', msg)
        client.broadcast.to(person.room).emit('createMessage', createMessage('Administrator', `${person.name} se unió`));
        callback(msg)
    })

    client.on('disconnect', ()=>{
        let personDeleted = users.deletePerson( client.id );
        console.log("Disconnect person deleted", personDeleted)

        client.broadcast.to(personDeleted.room).emit('createMessage', createMessage('Administrator', `${personDeleted.name} salió`));
        client.broadcast.to(personDeleted.room).emit('personsList', users.getPersonsOnRoom(personDeleted.room));
    });

    //Private Messages
    client.on('privateMessage', data=>{
        let person = users.getPerson(client.id)
        client.broadcast.to(data.para).emit('privateMessage', createMessage(person.name, data.msg))
    })
});