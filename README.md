# Experimental implementation of fine-grained reactivity

The goal is to create a _modular_ implementation of fine-grained signals that can be used regardless of used framework (or vanilla JS).

- [x] simplest implementation
- [x] use proxies for a better API
- [x] split to derived/readonly and mutable signals
- [x] split implementation for Primitive and Object Signals???
- [x] recursively proxify objects
- [x] optimize to only notify object signal subscribers about which key has been updated (and array indecies)
- [x] overload mutation functions like .push to notify subscribers
- [ ] implement two-way binding helpers for HTML elements to bind signals to their values
- [ ] implement QOF helpers for inserting signals in templates as textContent and class names?? (maybe different package)
- [ ] implement a "each block" that keeps track of atomic changes
