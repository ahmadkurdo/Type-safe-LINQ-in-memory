export interface Fun<a, b> {
    (_: a): b
    then: <c>(otherFunction: Fun<b, c>) => Fun<a, c>
}

export let Fun = <a, b>(f: (_: a) => b): Fun<a, b> => {
    let fun = f as Fun<a, b>
    fun.then = function <c>(
        this: Fun<a, b>,
        otherFunction: Fun<b, c>
    ): Fun<a, c> {
        return Fun((x) => otherFunction(this(x)))
    }
    return fun
}
