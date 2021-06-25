import { List, MakeList, MakePair, mergeZip, Pair, zip } from './List'

type Student = {
    Name: string
    Surname: string
    Grades: [
        {
            Grade: number
            CourseId: number
            CourseName: string
            Teachers: Teacher[]
        }
    ]
}

type Teacher = {
    Name: string
    Surname: string
    Profession: string
}

let student1: Student = {
    Name: 'Ahmed',
    Surname: 'Rashid',
    Grades: [
        {
            Grade: 10,
            CourseId: 10,
            CourseName: 'Chemistry',
            Teachers: [
                { Name: 'Mohammed', Surname: 'Abbadi', Profession: 'Softwaren Eningeer' },
                { Name: 'Francesco', Surname: 'Di Giacomo', Profession: 'Softwaren Architect' },
            ],
        },
    ],
}

let student2: Student = {
    Name: 'Ali',
    Surname: 'G',
    Grades: [
        {
            Grade: 5,
            CourseId: 6,
            CourseName: 'Biology',
            Teachers: [
                { Name: 'Mohammed', Surname: 'Abbadi', Profession: 'Softwaren Eningeer' },
                { Name: 'Francesco', Surname: 'Di Giacomo', Profession: 'Softwaren Architect' },
            ],
        },
    ],
}

let student3: Student = {
    Name: 'Mohammed',
    Surname: 'Ali',
    Grades: [
        {
            Grade: 8,
            CourseId: 15,
            CourseName: 'Math',
            Teachers: [
                { Name: 'Mohammed', Surname: 'Abbadi', Profession: 'Softwaren Eningeer' },
                { Name: 'Francesco', Surname: 'Di Giacomo', Profession: 'Softwaren Architect' },
            ],
        },
    ],
}

type Fun<A, B> = (_: A) => B

type Unpack<A> = A extends Array<infer b> ? b : never

export type Query<a, b> = Pair<List<a>, List<b>>

export type IsOfType<A, B> = { [C in keyof A]: A[C] extends B ? C : never }[keyof A]

export type PickNested<A, K extends keyof A, b> = { [x in Exclude<keyof A, K>]: A[x] } & { [x in K]: b[] }

type Unit = {}


export let pickMany = <T, K extends keyof T>(entity: T, props: K[]) => {
    return props.reduce((s, prop) => ((s[prop] = entity[prop]), s), {} as Pick<T, K>)
}

export let omitOne = <T, K extends keyof T>(entity: T, prop: K): Omit<T, K> => {
    const { [prop]: deleted, ...newState } = entity
    return newState
}

export let omitMany = <T, K extends keyof T>(entity: T, props: K[]): Omit<T, K> => {
    let result = entity as Omit<T, K>
    props.forEach((prop) => {
        result = omitOne(result, prop as unknown as keyof Omit<T, K>) as Omit<T, K>
    })
    return result
}

export type QueryAble<a, b> = {
    select: <k extends keyof a>(...keys: k[]) => QueryAble<Omit<a, k>, Pick<a, k>>
    OrderBy: <k extends keyof a>( f: (x1:b,x2:b) => number) => QueryAble<a,b>
    include: <k extends IsOfType<a, Array<any>>, d extends Unpack<a[k]>, c extends keyof d>(
        key: k,
        f: Fun<InitialQueryAble<d>, QueryAble<Omit<d, c>, Pick<d, c>>>
    ) => QueryAble<Omit<a, k>, b & Pick<a, k>>
    run: () => Array<b>
}
export type InitialQueryAble<a> = {
    select: <k extends keyof a>(...keys: k[]) => QueryAble<Omit<a, k>, Pick<a, k>>
}


export const MakeQueryAble = <a, b>(obj: Query<a, b>): QueryAble<a, b> => ({
    select: function <k extends keyof a>(...keys: k[]): QueryAble<Omit<a, k>, b & Pick<a, k>> {
        return MakeQueryAble(
            obj.map(
                (left) => left.map((x) => omitMany(x, keys)),
                (right) =>
                    mergeZip(
                        zip(
                            right,
                            obj.fst.map((x) => pickMany(x, keys))
                        )
                    )
            )
        )
    },
    OrderBy: function<k extends keyof a>( f: (x1:b,x2:b) => number) : QueryAble<a,b> {
        
        
        return MakeQueryAble(obj.mapRight( x => MakeList(x.toArray().sort(f))))
    },
    include: function <k extends IsOfType<a, Array<any>>, d extends Unpack<a[k]>, c extends keyof d>(
        key: k,
        f: Fun<InitialQueryAble<d>, QueryAble<Omit<d, c>, Pick<d, c>>>
    ): QueryAble<Omit<a, k>, b & Pick<a, k>> {
        return MakeQueryAble(
            obj.map(
                (left) => left.map((x) => omitOne(x, key)),
                (right) =>
                    mergeZip(
                        zip(
                            right,
                            obj.fst.map((x) => ({ [key]: f(makeInitialQuerAble(State(x[key] as any))).run() } as any))
                        )
                    )
            )
        )
    },
    run: function (): Array<b> {
        return obj.snd.toArray()
    },
})

export const State = <a, b>(x: a[], y?: b[]): Query<a, b> =>
    MakePair(MakeList<a>(x), MakeList<b>(y ? y : []))

export const makeInitialQuerAble = <a>(state: Query<a, Unit>): InitialQueryAble<a> => ({
    select: function <k extends keyof a>(...keys: k[]): QueryAble<Omit<a, k>, Pick<a, k>> {
        return MakeQueryAble(
            state.map(
                (left) => left.map((x) => omitMany(x, keys)),
                (right) => state.fst.map((x) => pickMany(x, keys))
            )
        )
    },
})

const data = State<Student, Unit>([student1, student2, student3])
const vvvv = makeInitialQuerAble(data)
    .select('Surname')
    .include('Grades', (g) => g.select('Grade').include('Teachers', (t) => t.select('Profession','Name','Surname')))
    .OrderBy((g1,g2) => g1.Grades[0].Grade - g2.Grades[0].Grade)
    .run()

console.log(vvvv)