/** @format */

interface DCLinkNode<T> {
    element: T
    prev: DCLinkNode<T> | null
    next: DCLinkNode<T> | null
}
//  DoublyCircularLinkedList
class DCLink<T> {
    private _head: DCLinkNode<T> | null
    private _size: number
    constructor() {
        this._head = null
        this._size = 0
    }
    malloc = (value: T): DCLinkNode<T> => {
        return {element: value, prev: null, next: null}
    }
    init = (value: T): DCLinkNode<T> => {
        const tmp = this.malloc(value)
        this._head = tmp
        tmp.prev = tmp
        tmp.next = tmp
        this._size++
        return tmp
    }
    _init = (tmp: DCLinkNode<T>) => {
        this._head = tmp
        tmp.prev = tmp
        tmp.next = tmp
        this._size++
        return tmp
    }
    append = (node: DCLinkNode<T> | null, src: DCLinkNode<T>): DCLinkNode<T> => {
        if (node === null) {
            this._init(src)
            return src
        }
        if (node.next) {
            node.next.prev = src
            src.next = node.next
            src.prev = node
            node.next = src
            this._size++
        }
        return src
    }
    prepend = (node: DCLinkNode<T> | null, src: DCLinkNode<T>): DCLinkNode<T> => {
        if (node === null) {
            this._init(src)
            return src
        }

        if (node.prev) {
            this.append(node.prev, src)
        }
        if (this._head === node) {
            this._head = src
        }
        return src
    }
    eject = (node: DCLinkNode<T>): void => {}
    size = (): number => {
        return this._size
    }
    isEmpty = (): boolean => {
        return this._size === 0
    }
    remove = (node: DCLinkNode<T>): void => {
        if (node === null || this._size === 0) return
        if (this._size === 1) {
            this._head = null
            this._size = 0
        }
        node.prev = null
        node.next = null
        return
    }
    head = (): DCLinkNode<T> | null => {
        return this._head
    }
}
