// TODO: need to reduce with lcm?
type Rational = { num: bigint, den: bigint }

type Expr =
    | { kind: 'num', value: Rational }
    | { kind: 'sym', name: string }
    | { kind: 'add', terms: Expr[] }
    | { kind: 'mul', factors: Expr[] }
    | { kind: 'power', base: Expr, exp: Expr }
    | { kind: 'fn', name: 'sin' | 'cos' | 'tan' | 'ln' | 'exp', arg: Expr}

function compile(expr: Expr): number {
    return 0;
}