# Experimental implementation of fine-grained reactivity

The goal is to create a _modular_ implementation of fine-grained signals that can be used regardless of used framework (or vanilla JS).

- [X] simplest implementation
- [X] use proxies for a better API
- [ ] split implementation for Primitive and Object Signals???
- [ ] recursively proxify objects
- [ ] optimize to only notify object signal subscribers about which key has been updated (and array indecies)
- [ ] overload mutation functions like .push to notify subscribers
