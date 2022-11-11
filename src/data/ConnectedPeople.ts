import { LinkedList } from "./LinkedList";

class Letter {
    public letter : string;
    public ts : EpochTimeStamp;

    constructor(letter : string, ts : EpochTimeStamp){
        this.letter = letter
        this.ts = ts
    }
}

class PersonInfo {
    public letters : LinkedList<Letter> = new LinkedList()
    public name : string;

    constructor(name : string, letter : Letter[] = []) {
        this.name = name
    }

    AddLetter(letter : string) {
        if(letter.length == 1) {
            let NewLetter = new Letter(letter, Date.now())
            this.letters.PushEnd(NewLetter)
        } else {
            console.error("tried to append a letter that was actually longer (or shorter) than a letter: " + letter)
        }
    }
}

export class ConnectedPeople {

    public people : Map<string, PersonInfo> = new Map()

    public AddLetter(name: string, letter: string) {
        let person = this.people.get(name)
        if(person == null) {
            person = new PersonInfo(name)
            this.people.set(name, person)
        }
        person.AddLetter(letter)
    }
}