class Node<T> {
    public next?: Node<T>
    public previous?: Node<T>
    public value: T

    constructor(value : T) {
        this.next = undefined
        this.previous = undefined
        this.value = value
    }
}

export class LinkedList<T> {
    public count : number = 0
    private start? : Node<T>
    private end? : Node<T>

    constructor(){
        this.start = undefined;
        this.end = undefined;
    }

    PushEnd(value : T){
        let newNode = new Node(value)
        let oldEnd = this.GetEnd()
        if(oldEnd != undefined) {
            oldEnd.next = newNode
        }
        newNode.previous = oldEnd
        if(this.start == undefined) {
            this.start = newNode
        }
        this.end = newNode
    }

    PopStart(): Node<T> | undefined {
        let oldStart = this.GetStart()
        if(oldStart != undefined) {
            let newStart = oldStart.next
            if(newStart != undefined) {
                newStart.previous = undefined;
            }
            this.start = newStart
        }
        return oldStart
    }

    GetEnd() : Node<T> | undefined {
        return this.end
    }

    GetStart() : Node<T> | undefined {
        return this.start
    }
}