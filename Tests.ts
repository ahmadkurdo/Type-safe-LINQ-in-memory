

type Queryable<T extends Object> = {
    value: T;
    select: <U extends keyof T>(p : U[]) => Pick<T,U>
       
 }
 
 type Student = {
   Name:string,
   Surname:string,
   Grades:[
     {
       Grade:number,
       CourseId:number
     }
   ],
 }
 let student : Student = {
   
     Name:'Ahmed',
     Surname:'Rashid',
     Grades:[
       {
         Grade:10,
         CourseId:10
       }
     ],
 
   }
 
 
 const d = include(student,'Grades', p => select(p, 'Grade','CourseId'))
 console.log(d)
 
 type Fun<a,b> = (_:a) => b
 
 export type isOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never  }[keyof T]
 
 export const Omit = <T, K extends keyof T>(key: K, { [key]: _, ...values }: T): Omit<T, K> => values
 
 
 export interface NestedQueryAble<fields extends Object> {
   lazy: <k extends isOfType<fields,Array<any>>, U extends Unpack<fields[k]>, A extends keyof U>(key:k, f:Fun<QueryAble<U>, QueryAble<Pick<U,A>>>) =>  QueryAble<fields>
 }
 
 export interface InlineQueryAble<fields extends Object> {
   lazy: <k extends keyof fields>(...keys:k[]) => QueryAble<Pick<fields,k>>
 }
 
 export interface QueryAble<T extends Object> {
     nested:NestedQueryAble<T>,
     inline:InlineQueryAble<T>,
     select: <k extends keyof T>(...keys:k[]) => QueryAble<Pick<T,k>>
     include: <k extends isOfType<T,Array<any>>, U extends Unpack<T[k]>, A extends keyof U>(key:k, f:Fun<QueryAble<U>, QueryAble<Pick<U,A>>>) => QueryAble< T >
     Run:() => T
   }
   
   export const NestedQueryAble = <fields extends Object>(fields:fields) : NestedQueryAble<fields> => ({
   lazy: <k extends isOfType<fields,Array<any>>, U extends Unpack<fields[k]>, A extends keyof U>(key:k, f:Fun<QueryAble<U>, QueryAble<Pick<U,A>>>) 
     :  QueryAble< fields > => 
     {
       let arr = fields[key] as U[]
       return MakeQueryAble({...fields, [key]:arr.map(x => f(MakeQueryAble(x)).Run())})
     }
 })
 
 export const InlineQueryAble = <fields extends Object>(fields:fields) : InlineQueryAble<fields> => ({
   lazy: <k extends keyof fields>(...keys:k[]) : QueryAble<Pick<fields,k>> => MakeQueryAble(pickMany(fields,keys))
 })
 export const MakeQueryAble = <T extends Object>(obj:T) : QueryAble<T> => ({  
     nested:NestedQueryAble(obj),
     inline:InlineQueryAble(obj),
     select : function<k extends keyof T>(this:QueryAble<T>, ...keys:k[]) : QueryAble< Pick<T,k>> {
       return this.inline.lazy(...keys)
     },
     include: function<k extends isOfType<T,Array<any>>, U extends Unpack<T[k]>, A extends keyof U>(key:k, f:Fun<QueryAble<U>, QueryAble<Pick<U,A>>>) : QueryAble< T>
     {
       return this.nested.lazy(key,f)
     },
     Run:()  => obj,
   })
   
   type Unpack<f> = f extends Array<infer A> ? A: never 
   
 
 
 export let pickMany = <T, K extends keyof T>(entity: T, props: K[]) => {
   return props.reduce((s, prop) => (s[prop] = entity[prop], s) , {} as Pick<T, K>)
 }
 
 
 const h2 = MakeQueryAble(student).include('Grades', g => g.select('Grade')).Run()
 console.log(h2)
 
 