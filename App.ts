type Queryable<T extends Object> = {
    value: T
    select: <U extends keyof T>(p: U[]) => Pick<T, U>
}

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
            CourseName:'Math'
        },
    ],
}

type Fun<a, b> = (_: a) => b

type Unpack<a> = a extends Array<infer b> ? b : never

export type isOfType<a, b> = { [c in keyof a]: a[c] extends b ? c : never }[keyof a]

export type PickNested<a, k extends keyof a, b> = { [x in Exclude<keyof a, k>]: a[x] } & { [x in k]: b[] }

export const Omit = <a, b extends keyof a>(key: b, { [key]: _, ...values }: a): Omit<a, b> => values

export interface QueryAble<a extends Object> {
    select: <k extends keyof a>(...keys: k[]) => QueryAble<Pick<a, k>>
    include: <k extends isOfType<a, Array<any>>, b extends Unpack<a[k]>, c extends keyof b>(
        key: k,
        f: Fun<QueryAble<b>, QueryAble<Pick<b, c>>>
    ) => QueryAble<PickNested<a, k, Pick<b, c>>>
    Run: () => a
}

export const MakeQueryAble = <a extends Object>(obj: a): QueryAble<a> => ({
    select: function <k extends keyof a>(this: QueryAble<a>, ...keys: k[]): QueryAble<Pick<a, k>> {
        return MakeQueryAble(pickMany(obj, keys))
    },
    include: function <k extends isOfType<a, Array<any>>, b extends Unpack<a[k]>, c extends keyof b>(
        key: k,
        f: Fun<QueryAble<b>, QueryAble<Pick<b, c>>>
    ): QueryAble<PickNested<a, k, Pick<b, c>>> {
        let arr = obj[key] as b[]
        return MakeQueryAble({ ...obj, [key]: arr.map((x) => f(MakeQueryAble(x)).Run()) })
    },
    Run: () => obj,
})

export let pickMany = <T, K extends keyof T>(entity: T, props: K[]) => {
    return props.reduce((s, prop) => ((s[prop] = entity[prop]), s), {} as Pick<T, K>)
}

const h2 = MakeQueryAble(student).include('Grades', (g) => g.select('CourseName','Grade')).Run()
console.group(h2.Grades[0])
