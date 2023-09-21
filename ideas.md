# Syntax
Should be as easy and intuitive as possible, Svelte had a right idea of hijacking the let keyword and scanning the file with the compiler in order to figure out the dependencies. 
From the user perspective this is extremely easy to use as all the values are pure variables, not wrapped in any kind of Proxy object (like Vue) but can be truly reactive (unlike React)
Angular does that with decorators that probably apply proxy to the component logic to hijack the getter and setter.
Solid does the great thing with signals but the React'y syntax makes it more difficult to use and will again require different wrappers for any JS library that a user would want to use with it
Ideally the syntax should be the same in .js files as in the component files

Because of JS limitations and no operator overloading only objects get and set functions can be hijacked that means a state either is an object itself or needs to be wrapped in another object. 
A signal needs a way to understand that it's being called in order to bind the dependencies for state updates.

Destiny operator would be a great thing to have, and currently only svelte has implemented something similar, the reactive assignment syntax $:

I assume it could be doable to both define the states and reactive function calls with a simple $ function.
$ is already known to be a reactive operator convention in Svelte and RxJS

```ts
const couter = $(0);

counter.set(1);

const doubled = $(() => counter.value * 2)
```
that would already be a valid js syntax as of today
maybe even using the callback function to define a derived variable could be omitted

the issue here is we need to convert the state to an object
an alternative syntax could be like
Vue
state.value = newValue // allows most freedom
state.value to read

Vue2
data.counter // data would be a proxy

SolidJS
setState() 
state() // using a fn to get the value but a little easier to remember than .value

Leptos
state.set()
state.get()


Maybe it would be an idea to have a separate function to grab the current value from the state
sort of like svelte stores, but that still an overhead

#() for static get
