# Syntax
Should be as easy and intuitive as possible, Svelte had a right idea of hijacking the let keyword and scanning the file with the compiler in order to figure out the dependencies. 
From the user perspective this is extremely easy to use as all the values are pure variables, not wrapped in any kind of Proxy object (like Vue) but can be truly reactive (unlike React)
Angular does that with decorators that probably apply proxy to the component logic to hijack the getter and setter.
Solid does the great thing with signals but the React'y syntax makes it more difficult to use and will again require different wrappers for any JS library that a user would want to use with it

