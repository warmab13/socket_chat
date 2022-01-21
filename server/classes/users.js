
/**
 *{
     id: 'Asldjsadaosd-adsadf',
     name: 'Alonso',
     sala: 'Videogames'
 }
 */

class Users {

    constructor(){
        this.persons = [];
    }

    addPerson(id, name, room){
        let person = { id, name, room };

        this.persons.push(person);

        return this.persons;
    }

    getPerson(id){
        let person = this.persons.filter( person => person.id === id)[0];

        return person;
    }

    getPersons(){
        return this.persons;
    }

    getPersonsOnRoom(room){
        // ....
        let personsOnRoom = this.persons.filter( person => person.room === room);
        return personsOnRoom;
    }

    deletePerson(id){

        let ereasePerson = this.getPerson(id);

        this.persons = this.persons.filter( person => person.id !== id);

        return ereasePerson;
    }

}

module.exports = {
    Users
}