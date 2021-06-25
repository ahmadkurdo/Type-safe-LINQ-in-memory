

export type Pair<a, b> = {
    fst: a
    snd: b
    mapLeft: <c>(f: (_: a) => c) => Pair<c, b>
    mapRight: <d>(f: (_: b) => d) => Pair<a, d>
    map: <c, d>(f: (_: a) => c, g: (_: b) => d) => Pair<c, d>
}

export type IsNotOfType<A, B> = { [C in keyof A]: A[C] extends B ? never : C }[keyof A]


export type Unit = {}

export const Unit = {}


export type State<a, b> = Pair<List<a>, List<b>>

export const State = <a, b>(selectable: a[], selected?: b[]): State<a, b> =>
    MakePair(MakeList<a>(selectable), MakeList<b>(selected ? selected : []))


export const MakePair = <a, b>(fst: a, snd: b): Pair<a, b> => ({
    fst,
    snd,
    mapLeft: function <c>(f: (_: a) => c): Pair<c, b> {
        return MakePair<c, b>(f(this.fst), this.snd)
    },
    mapRight: function <d>(g: (_: b) => d): Pair<a, d> {
        return MakePair<a, d>(this.fst, g(this.snd))
    },
    map: function <c, d>(f: (_: a) => c, g: (_: b) => d): Pair<c, d> {
        return MakePair<c, d>(f(this.fst), g(this.snd))
    },
})

export type List<a> = {
    data: Array<a>
    head: () => a
    tail: () => List<a>
    isEmpty: () => Boolean
    size: () => number
    map: <b>(f: (_: a) => b) => List<b>
    concat: (l2: List<a>) => List<a>
    toArray: () => Array<a>,
    sort: <k extends IsNotOfType<a,List<any> | Array<any>>>(key:k, order: "ASC" | "DESC") => List<a>
}

export const MakeList = <a>(data: Array<a>): List<a> => ({
    data,
    head: function (): a {
        return this.data[0]
    },
    tail: function (): List<a> {
        return MakeList<a>(this.data.slice(1))
    },
    isEmpty: function (): Boolean {
        return this.data.length === 0
    },
    size: function (): number {
        return this.data.length
    },
    map: function <b>(f: (_: a) => b): List<b> {
        return MakeList<b>(this.data.map(f))
    },
    concat: function (l2: List<a>): List<a> {
        return MakeList<a>(this.data.concat(l2.data))
    },
    toArray: function (): Array<a> {
        return this.data
    },
    sort: function <k extends  IsNotOfType<a,List<any> | Array<any>>>(key:k, order: 'ASC' | 'DESC') : List<a>{
        return MakeList(data.sort((obj1, obj2) => {
            switch (order) {
                case 'ASC': {
                    return obj1[key] > obj2[key] ? 1 : -1
                }
                case 'DESC': {
                    return obj1[key] < obj2[key] ? 1 : -1
                }
            }
        }))
    }
})

export const zip = <a, b>(l1: List<a>, l2: List<b>): List<Pair<a, b>> =>
    l1.isEmpty() || l2.isEmpty()
        ? MakeList<Pair<a, b>>([])
        : MakeList<Pair<a, b>>([MakePair(l1.head(), l2.head())]).concat(zip(l1.tail(), l2.tail()))

export const mergeZip = <a, b>(lst: List<Pair<a, b>>): List<a & b> =>
    MakeList<a & b>(lst.map((x) => ({ ...x.fst, ...x.snd })).toArray())


