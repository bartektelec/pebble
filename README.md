# Experimental implementation of fine-grained reactivity

The goal is to create a _modular_ implementation of fine-grained signals that can be used regardless of used framework (or vanilla JS).

- [x] simplest implementation
- [x] use proxies for a better API
- [x] split to derived/readonly and mutable signals
- [x] split implementation for Primitive and Object Signals???
- [x] recursively proxify objects
- [x] optimize to only notify object signal subscribers about which key has been updated (and array indecies)
- [x] overload mutation functions like .push to notify subscribers
- [x] implement two-way binding helpers for HTML elements to bind signals to their values
- [x] implement QOF helpers for inserting signals in templates as textContent and class names?? (maybe different package)
- [ ] implement a fragment element that unwraps around a parent
- [ ] implement if block that only takes care of partial template changes
- [ ] implement a "each block" that keeps track of atomic changes
- [ ] traverse ast to perform binding logic on each node
- [ ] walk ast to assign unique static IDs to each element that can be bound with generated JS script

# NOTES

In order to make the each block react to each index instead of whole object change, the fragment element needs to be created, then each child of that fragment will need to be bound to an atomic signal change, possibly performing a check on a computed signal output could help memoizing the state instead of always forcing a render
