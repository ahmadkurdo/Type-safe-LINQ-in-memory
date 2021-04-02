/*
!type SomeType = T extends U ? X : Y
*/
type SomeType = string
type MyConditionalType = SomeType extends string ? string : null

function someFunction<T>(value: T) {
    //Nesting the types
    type A = T extends boolean ? 'TYPE A' : T extends string ? 'TYPE B' : T extends number ? 'Type C' : 'Type D'
    const otherFunction = (someArg: T extends boolean ? 'Type A' : 'Type B') => {}
    return otherFunction
}
const resultTypeB = someFunction('')
const resultTypeA = someFunction(true)

/*
*Distributive property of a conditional type
*never is used to describe some type that will not happen or does not exist
*/
type StringOrNot<T> = T extends string ? string : never 

type AUnion = string | boolean | never

// *type Exclude<T, U> = T extends U ? never : T;

type ResultType = Exclude<'a' | 'b' | 'c' | 'd', 'a'>

/*
*The way typescript does the check above is as follows, it goes through all the types of T and checks them against U:
    ! 'a' extends 'a' ? never : 'a' => never  
    ! 'b' extends 'a' ? never : 'b' => b  
    ! 'c' extends 'a' ? never : 'c' => c  
    ! 'a' extends 'a' ? never : 'd' => d
    *so the type of  ResultType will be => 'b' | 'c' | 'd'
*Suppose that we had Exclude<'a' | 'b' | 'c' | 'd' , 'a' | 'b'> in this case it would have done two checks one for a and on for b like in the above example
*/
type MyType<T> = [T] extends [string | number] ? T : never

type MyResult = MyType<9 | 'kj'>
// *it selects all the types which extend string or number


type InferSomething<T> = T extends infer U ? U : never
type inferred = InferSomething<'I am a string'>

type InferSomething2<T> = T extends {a : infer A, b : number} ? A : any
type inferred2 = InferSomething2<{a:'HelloWorld', b: 1}>

type InferSomething3<T> = T extends {a : infer A, b : infer B} ? A & B : any
type inferred3 = InferSomething3<{a:{somepropA:'HelloWorld'}, b: {somepropB:1}}>

/*
!Mapped type 

A mapped type allows us to create a new type by iterating a list of properties.
'PropA' | 'PropB' | 'PropC'       => {
                                        propA: ...
                                        PropB: ...
                                        Propc: ...
                                    }

*/

type Properties = 'PropA' | 'PropB' | 'PropC'
type MymappedType = {
    [P in Properties]: P
}

type MymappedType2<T> = {
    [P in keyof T]?: T[P] | null
}
type y = MymappedType2<{a: 'a', b :'b'}>

type Pick1<T,Properties extends keyof T> = {
     [P in Properties] : T[P]
}
type z = Pick1<{a: 'a', b: 'b'}, 'a'>