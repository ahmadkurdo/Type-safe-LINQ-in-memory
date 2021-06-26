type Student = {
    Name: string
    Surname: string
    Grades: [
        {
            Grade: number
            CourseId: number
            CourseName: string
        }
    ]
}
let student: Student = {
    Name: 'Ahmed',
    Surname: 'Rashid',
    Grades: [
        {
            Grade: 10,
            CourseId: 10,
            CourseName: 'Math',
        },
    ],
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type Fun<a, b> = (_: a) => b

type Unpack<A> = A extends Array<infer b> ? b : never

export type IsOfType<A, B> = { [C in keyof A]: A[C] extends B ? C : never }[keyof A]

export type PickNested<A, K extends keyof A, b> = { [x in Exclude<keyof A, K>]: A[x] } & { [x in K]: b[] }

export const Omit = <A, B extends keyof A>(key: B, { [key]: _, ...values }: A): Omit<A, B> => values

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

const mergeObject = <a, b>(obj1: a, obj2: b) => ({ ...obj1, ...obj2 })
export interface QueryAble<T extends Object, U> {
    mapLeft<newT>(f: (_: T) => newT): QueryAble<newT, U>
    mapRight<newU>(f: (_: U) => newU): QueryAble<T, newU>
    include: <K extends IsOfType<T, Array<any>>, B extends Unpack<T[K]>, C extends keyof B>(
        key: K,
        f: Fun<InitialQueryAble<B>, QueryAble<Omit<B, C>, Pick<B, C>>>
    ) => QueryAble<Omit<T, K>, U & PickNested<T, K, Pick<B, C>>>
    select: <K extends keyof T>(...keys: K[]) => QueryAble<Omit<T, K>, U & Pick<T, K>>
    Run: () => U
}
export interface InitialQueryAble<U extends Object> {
    select: <K extends keyof U>(...keys: K[]) => QueryAble<Omit<U, K>, Pick<U, K>>
    run: () => U
}

export const MakeQueryAble = <A extends Object>(obj: A): InitialQueryAble<A> => ({
    select: function <K extends keyof A>(...keys: K[]): QueryAble<Omit<A, K>, Pick<A, K>> {
        return QueryAble(obj, pickMany(obj, keys))
    },
    run: () => obj,
})

export const QueryAble = <A extends Object, B>(obj: A, newObj: B): QueryAble<A, B> => ({
    mapLeft: function <newA>(f: (_: A) => newA): QueryAble<newA, B> {
        return QueryAble(f(obj), newObj)
    },
    mapRight: function <newB>(f: (_: B) => newB): QueryAble<A, newB> {
        return QueryAble(obj, f(newObj))
    },
    select: function <K extends keyof A>(this: QueryAble<A, B>, ...keys: K[]): QueryAble<Omit<A, K>, B & Pick<A, K>> {
        return this.mapRight((x) => mergeObject(x, pickMany(obj, keys))).mapLeft((x) => omitMany(x, keys))
    },

    include: function <K extends IsOfType<A, Array<any>>, E extends Unpack<A[K]>, C extends keyof E>(
        key: K,
        f: Fun<InitialQueryAble<E>, QueryAble<Omit<E, C>, Pick<E, C>>>
    ): QueryAble<Omit<A, K>, B & PickNested<A, K, Pick<E, C>>> {
        let arr = obj[key] as E[]
        return this.mapRight((b) =>
            mergeObject(b, { [key]: arr.map((x) => f(MakeQueryAble(x)).Run()) } as PickNested<A, K, Pick<E, C>>)
        ).mapLeft((x) => omitMany(x, [key]))
    },
    Run: () => newObj,
})

const test = MakeQueryAble(student)
    .select('Name')
    .select('Surname')
    .include('Grades', (g) => g.select('CourseName','Grade'))
    .Run()

console.log(test)


