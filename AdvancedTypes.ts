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



/*
!Record<Keys,Type>
*Constructs an object type whose property keys are Keys and whose property values are Type. 
*This utility can be used to map the properties of a type to another type.
*/

interface CatInfo {
    age: number;
    breed: string;
  }
  
  type CatName = "miffy" | "boris" | "mordred";
  
  const cats: Record<CatName, CatInfo> = {
    miffy: { age: 10, breed: "Persian" },
    boris: { age: 5, breed: "Maine Coon" },
    mordred: { age: 16, breed: "British Shorthair" },
  };
  
/*
!Pick<Type, Keys>
*Constructs a type by picking 
*the set of properties Keys (string literal or union of string literals) from Type.

*/
interface Todo {
    title: string;
    description: string;
    completed: boolean;
  }
  
  type TodoPreview = Pick<Todo, "title" | "completed">;
  
  const todo: TodoPreview = {
    title: "Clean room",
    completed: false,
  };

/*
!Omit<Type, Keys>
*Constructs a type by picking all properties from Type 
*and then removing Keys (string literal or union of string literals).
 */ 
  type TodoInfo = Omit<Todo, "completed" | "createdAt">;
  
  const todoInfo: TodoInfo = {
    title: "Pick up kids",
    description: "Kindergarten closes at 5pm",
  };
  
  todoInfo;
  // ^ = const todoInfo: TodoInfo

/*
!keyof operator
*The keyof keyword is an indexed type query operator. 
*It yields a union containing the possible property names/keys of its operand. 
*Most of the time, keyof precedes object literal types, especially user-defined types. 
*It can be used against primitive types, however not very useful.
*/
// Predefined Types
type KeyofAny = keyof any; // string | number | symbol 🤔

// You don't see these everyday 😬
type KeyofBoolean = keyof boolean; // "valueOf"
type KeyofString = keyof string; //  number | "charAt" |  ...Union of Object.getOwnPropertyNames(String.prototype)
type KeyofNumber = keyof number; //  "toFixed" |  ...Union of Object.getOwnPropertyNames(Number.prototype)
type KeyofSymbol = keyof symbol; // "toString" |  "valueOf"
type KeyofVoid = keyof void; // never
type KeyofNull = keyof null; // never
type KeyofUndefined = keyof undefined; // never

//Enums
enum Preference {
  TYPESCRIPT,
  JAVASCRIPT,
}
type KeyofEnum = keyof Preference; // "toString" | "toFixed" ...Object.getOwnPropertyNames(Number.prototype)

// String literal type
type KeyofString = keyof 'Literal'; // Same as string. String literal types are subtypes of String primitive types.

// Array literal type
type KeyofArray = keyof []; // number | Union of Object.getOwnPropertyNames(Array.prototype)

//Tuple literal type
type KeyofTuple = keyof [number, number]; // number | number | Union of Object.getOwnPropertyNames(Array.prototype)

// Very important 🔥🔥!!

// object literal type
interface Rectangle {
  type: 'Quadrilateral';
  length: number;
  width: number;
}

type keyofInterface = keyof Rectangle; // 'type' 

/*
!Let’s look at a example.
*Take this hypothetical register form with a “tonne” of fields. 
*We are required to validate and track errors for each field! Equipped with keyof;
*/

interface FormFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDay: string;
    birthMonth: string;
    birthYear: string;
    consented: boolean;
    confirmationPassword: string;
  }
  
  // Create a union of string literal types
  type FieldNames = keyof FormFields; // "firstName" | "lastName" .... | "consented"
  
  type FieldErrors = { [field in FieldNames]: boolean }; // { firstName: boolean; lastName: boolean; .... consented: boolean; }

/*Another example
Very recently I learnt about the power of JSON.stringify replacer function. Let’s create a type-safe half baked JSON.
stringify that accepts an object with a very specific shape, whose values are only primitives 😄 to keep it simple.*/

declare function stringify<Input extends object>(source: Input,
  replacer?: (
    key: keyof Input,
    value: Input[keyof Input],
  ) => string | boolean | number,
  spacer?: string | number,
): string;

interface Person {
  name: string;
  age: number;
  beard: boolean;
}

const pawel: Person = { name: 'Pawel', age: 1, beard: true };

// ok
stringify(pawel, (key, value) => (key === 'age' ? 23 : value));

// ops Error, this condition will always return 'false'
// since the types '"name" | "age" | "beard"' and '"height"' have no overlap.
stringify(pawel, (key, value) => (key === 'height' ? 23 : value));

// Error {} is not assignable to `string | number | boolean`
stringify(pawel, (key, value) => (key === 'age' ? {} : value));

interface Person {
    name: string;
    age: number;
    beard: boolean;
  }
  
  type Values = Person[keyof Person]; // string | number | boolean


/*
!Typeof operator
*The typeof keyword can be used in an expression or in a type query. When used in an expression, 
*the type of the expression will be a string thus the string primitive type of the evaluation of the expression. 
*The dual and more useful of this is type querying with typeof which we will see a bit later.
*/

const x = 42;
const y = typeof x; // Use in an expression


function pluck<T, K extends keyof T>(obj:T, propertyName: K[]) : T[K] { as [Key in keyof Type]: undefined extends Type[Key] ? never : Key } 
    
const l = pluck({name: {dob:99}, company: 'Asos'}, ['name'])


interface Course {
    title : string
    author : string
}
const course : Course = {
    title: 'Mathmatics',
    author : 'Ahmed'
}
type Freeze<T> = {
   readonly [P in keyof T]: T[P]
}
const freezedCourse : Freeze<Course> = course

type RemoveUndefinable<Type> = {
  [Key in keyof Type]: undefined extends Type[Key] ? never : Key
}[keyof Type];

type RemoveNullableProperties<Type> = {
  [Key in RemoveUndefinable<Type>]: Type[Key]
};

type TestRemoveNullableProperties = RemoveNullableProperties<{
  id: number;
  name: string;
  property?: string;
}>;

type f = RemoveUndefinable<{
  id: number;
  name: string;
  property?: string;
}>

type h = {kind: string} & {readonly kind: string}
//!----------------------------------------------------------------
const fieldValues = {
  name: "Test User",
  level: 10,
  description: "asdfasdf"
};

const result = {
  name: true,
  level: true,
  description: "Minimum of 10 characters required!"
};

type ValidationResult<T, U> = Partial<{ [Key in keyof T]: U }>;

type Validation<T, U> = (fields: T) => ValidationResult<T, U>;
const hasLength = <T>(len: number, input: string | Array<T>) =>
  input.length >= len;

const hasUserName = (input: string) => hasLength(1, input) ? true : "Name is required.";
const hasValidDescription = (input: string) => hasLength(10, input) ? true : "Description requires a minimum of 10 characters.";

type FieldValues = typeof fieldValues;

const validationRules = [
  ({ name }: FieldValues) => ({name: hasUserName(name)}),
  ({ description }: FieldValues) => ({ description: hasValidDescription(description)})];

  const validate = <T, U = boolean | string>(validations: Validation<T, U>[],fields: T
): ValidationResult<T, U> =>
    validations.map(validation => validation(fields)).reduce((acc, a) => Object.assign(acc, a), {});

const validate2 = <T, U = boolean | string>(
      validations: Validation<T, U>[],
      fields: T
    ): ValidationResult<T, U> =>
      validations.reduce(
        (acc, validation) => Object.assign(acc, validation(fields)),
        {}
      );

const fieldValues1 = {
        name: "Test User",
        level: 10,
        description: "Test"
      };

const h = validate2(validationRules, fieldValues1)