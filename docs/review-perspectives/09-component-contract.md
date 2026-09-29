# Component Contract Reviewer

## Perspective

A production component is a small, predictable contract, not a collection of props.
This card checks ownership of state, composition, refs and failure states before visual
details make a weak API expensive to change. WhileUI owns opinionated primitives and
proven blocks; it does not expose configuration for hypothetical callers.

## Review Process

1. **Write the contract in plain language** — value owner, events, ref, parts and states.
2. **Trace every public prop** to a real call site and observable behaviour.
3. **Exercise the state matrix** — default, controlled, disabled, loading, error,
   interrupted and unmounted where applicable.
4. **Check its layer** — primitive, block or application concern.

## Key Questions

- Is state controlled or uncontrolled? If both are supported, do `value`/`defaultValue`
  and `onValueChange` follow the same semantics throughout the library?
- Does controlled state come directly from props instead of being mirrored through an
  effect and rendered one frame late?
- Are callbacks emitted once, with the documented value, and safe when async?
- Does disabled or loading state prevent duplicate activation while preserving the
  correct accessible state? Does loading avoid changing the control's geometry?
- Is the ref forwarded to the element a caller reasonably expects? Is any imperative
  handle small, necessary and covered by a contract test?
- For compound components, does context contain only shared component state? Is its
  value stable, and can parts fail clearly when used outside their root?
- Is `asChild` genuinely required? Does it preserve refs, handlers, accessibility props
  and styles rather than silently replacing the child's contract?
- Could a caller compose this from existing primitives without duplicating behaviour?
  If yes, should this stay in the consuming app until a second call site proves a block?
- Is product copy, navigation, authentication, billing, analytics or domain state
  leaking into the package?
- Does every public prop have a real consumer or showcase case? Could any compatibility
  alias or unused variant be deleted while callers are under our control?

## Red Flags

- Mirroring a controlled prop into state with `useEffect`.
- Boolean combinations such as `isOpen`, `visible`, `active` and `expanded` describing
  the same state.
- A callback prop accepted but discarded, transformed inconsistently, or called during
  render.
- A loading control that can still activate, changes width, or loses its accessible
  name.
- `cloneElement` or `asChild` around a context provider without explicit merge tests.
- A provider value object recreated on every render for unchanged state.
- A block importing an application store, route, service or product copy.
- A new option added only to avoid updating a caller we own.

## Green Flags

- A narrow prop surface with one obvious state model.
- Tests read like consumer-visible contracts and survive an internal rewrite.
- Compound parts share state without forcing rerenders on unrelated changes.
- A product-shaped composition stays local until reuse proves its boundary.

## Codebase-Specific Patterns

- Styling variants use exported `tv()` recipes; they do not become behavioural flags.
- Parent variants flow to text/icon parts through a memoized context value.
- String children may receive the standard text treatment; element children retain
  ownership of their rendering.
- New families start `experimental`. Contract evidence plus active product integration
  makes them `candidate`; every gate in `PLAN.md` is required for `stable`.
- Contract tests use `jest-expo` and the shared RNTL render helper. Public imports are
  also compiled through `fixtures/type-smoke`.
