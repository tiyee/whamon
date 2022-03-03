/** @format */

export interface ICache {
    set: (key: string, value: string, expired: number) => void
    get: (key: string) => string
    delete: (...keys: [string]) => number
}

export class Memcache implements ICache {
    set = (key: string, value: string, expired: number) => {}
    get = (key: string): string => {
        return key
    }
    delete = (keys: string): number => {
        return 0
    }
}

interface LRUNode<T> {
    data: T
    node: DCLinkNode<number>
}

class LRUCache<T> {
    cap: number = 100
    size: number = 0
    private readonly link: DCLink<number>
    private readonly storage: LRUNode<T>[]
    private readonly freeList: number[]
    private readonly mapping: Map<string, number>
    public constructor() {
        this.link = new DCLink<number>()
        this.storage = new Array<LRUNode<T>>()
        this.freeList = new Array<number>()
        this.mapping = new Map<string, number>()
    }
    public set(key: string, value: T): void {
        if (this.mapping.has(key)) {
            const idx = this.mapping.get(key)
            if (idx) {
                this.storage[idx].data = value
                this.emit(this.storage[idx].node)
                return
            }
        }
        if (this.freeList.length > 0) {
            const idx = this.freeList.pop()
            if (idx) {
                const lNode = this.storage[idx]
                lNode.data = value
                this.mapping.set(key, idx)
                this.size++
                this.emit(this.storage[idx].node)
                return
            }
        }
        const idx = this.size - 1
        const node = this.link.prepend(this.link.head(), this.link.malloc(idx))
        this.storage.push({node, data: value})
        this.size++
        if (this.size > this.cap) {
            this.trim()
        }
    }
    private emit(node: DCLinkNode<number>): void {
        this.link.eject(node)
        this.link.prepend(this.link.head(), node)
    }
    private trim(): void {}
    public get(key: string): T | null {
        if (key in this.mapping) {
            const idx = this.mapping.get(key)
            if (idx) {
                this.emit(this.storage[idx].node)
                return this.storage[idx].data
            }
        }
        return null
    }
}
