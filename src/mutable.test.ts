import { mut } from "./mutable";
import { effect } from "./effect";
import { create_internal_context } from "./ctx";

const ctx = create_internal_context();

describe("mut object", () => {
  it("should preserve how object is passed", () => {
    const count = mut(ctx)({ age: 42 });

    expect(count.age).toEqual(42);
  });

  it("should mutate the value", () => {
    const count = mut(ctx)({ age: 42 });

    count.age++;

    expect(count.age).toEqual(43);
  });

  it("should initialize a subscriber", () => {
    const count = mut(ctx)({ age: 42 });
    let doubled = 0;

    effect(ctx)(() => (doubled = count.age * 2));

    expect(doubled).toEqual(84);
  });

  it("should notify a subscriber when changed", () => {
    const count = mut(ctx)({ age: 42 });
    let doubled = 0;

    effect(ctx)(() => (doubled = count.age * 2));

    count.age = 50;

    expect(doubled).toEqual(100);
  });

  it("should notify multiple subscribers about a change", () => {
    const count = mut(ctx)({ age: 42 });
    let doubled = 0;
    let triple = 0;
    effect(ctx)(() => {
      doubled = count.age * 2;
    });
    effect(ctx)(() => {
      triple = count.age * 3;
    });

    count.age = 100;

    expect(doubled).toEqual(200);
    expect(triple).toEqual(300);
  });

  it("should only notify subscribers interested in a specific key", () => {
    const state = mut(ctx)({ name: "Adam", lastName: "Smith" });
    let upperLastName = "";
    const fn = vi.fn();

    effect(ctx)(() => {
      upperLastName = state.lastName.toUpperCase();
      fn();
    });

    expect(fn).toBeCalledTimes(1);

    state.lastName = "Brown";
    expect(fn).toBeCalledTimes(2);

    state.name = "John";
    expect(fn).toBeCalledTimes(2);
  });

  it("for arrays should only update the row that has been changed", () => {
    const state = mut(ctx)([1, 2, 3, 4, 5]);
    const doubled: number[] = [];
    const fn = vi.fn();

    state.forEach((x, i) => {
      effect(ctx)(() => {
        doubled[i] = state[i]! * 2;
        fn();
      });
    });

    expect(fn).toBeCalledTimes(5);

    state[2] = 10;

    expect(fn).toBeCalledTimes(6);
    expect(doubled[2]).toEqual(20);
  });

  it("for nested objects should recursively proxify", () => {
    const personState = mut(ctx)({
      name: {
        first: "adam",
        last: "smith",
      },
      age: 42,
    });

    let upperFirst = "";
    let doubleAge = 0;

    const fn1 = vi.fn();
    const fn2 = vi.fn();

    effect(ctx)(() => {
      upperFirst = personState.name.first.toUpperCase();
      fn1();
    });

    effect(ctx)(() => {
      doubleAge = personState.age * 2;
      fn2();
    });

    expect(fn1).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(1);
    expect(upperFirst).toEqual("ADAM");
    expect(doubleAge).toEqual(84);

    personState.name.first = "john";
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(1);
    expect(upperFirst).toEqual("JOHN");

    personState.age = 69;
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(2);
    expect(doubleAge).toEqual(69 * 2);
  });

  it("should work with nested objects of 3 levels", () => {
    const personState = mut(ctx)({
      personal: {
        name: {
          first: "adam",
          last: "smith",
        },
      },

      friends: ["michael", "jessica"],
    });

    let upperFirst = "";
    let friendCount = 0;

    const fn1 = vi.fn();
    const fn2 = vi.fn();

    effect(ctx)(() => {
      upperFirst = personState.personal.name.first.toUpperCase();
      fn1();
    });

    effect(ctx)(() => {
      friendCount = personState.friends.length;
      fn2();
    });

    expect(fn1).toBeCalledTimes(1);
    expect(fn2).toBeCalledTimes(1);
    expect(upperFirst).toEqual("ADAM");
    expect(friendCount).toEqual(2);

    personState.personal.name.first = "john";
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(1);
    expect(upperFirst).toEqual("JOHN");

    personState.friends = [...personState.friends, "anna"];
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(2);
    expect(friendCount).toEqual(3);
  });

  it("should react to adding array elements", () => {
    const friendsList = mut(ctx)([1, 2, 3]);
    let count = 0;
    const fn = vi.fn();
    effect(ctx)(() => {
      count = friendsList.length;
      fn();
    });
    expect(count).toEqual(3);

    friendsList.push(4);

    expect(count).toEqual(4);
  });

  it("should react to adding new keys (primitive)", () => {
    const friendsList = mut(ctx)([1, 2, 3]);
    let count = 0;
    const fn = vi.fn();
    effect(ctx)(() => {
      count = friendsList.length;
      fn();
    });
    expect(count).toEqual(3);

    friendsList[3] = 4;

    expect(count).toEqual(4);
  });

  it.skip("should react to adding new keys (object)", () => {
    type TestState = {
      age: number;
      location?: {
        city: {
          street: string;
        };
      };
    };
    const friendsList = mut(ctx)<TestState>({
      age: 10,
    });
    let address: undefined | string = undefined;
    const fn = vi.fn();

    effect(ctx)(() => {
      address = friendsList.location?.city?.street.toLowerCase();
      fn();
    });

    expect(address).toEqual(undefined);

    friendsList.location = { city: { street: "Some Ave 123" } };
    expect(address).toEqual("some ave 123");

    friendsList.location.city.street = "Wall Street 321";
    expect(address).toEqual("wall street 321");
  });
});

describe("mut primitive", () => {
  it("should wrap primitive in an object", () => {
    const count = mut(ctx)(42);

    expect(count.value).toEqual(42);
  });
  it("should mutate the value", () => {
    const count = mut(ctx)(42);

    count.value++;

    expect(count.value).toEqual(43);
  });

  it("should initialize a subscriber", () => {
    const count = mut(ctx)(42);
    let doubled = 0;

    effect(ctx)(() => (doubled = count.value * 2));

    expect(doubled).toEqual(84);
  });

  it("should notify a subscriber when changed", () => {
    const count = mut(ctx)(42);
    let doubled = 0;

    effect(ctx)(() => (doubled = count.value * 2));

    count.value = 50;

    expect(doubled).toEqual(100);
  });

  it("should notify multiple subscribers about a change", () => {
    const count = mut(ctx)(42);
    let doubled = 0;
    let triple = 0;

    effect(ctx)(() => {
      doubled = count.value * 2;
    });

    effect(ctx)(() => {
      triple = count.value * 3;
    });

    count.value = 100;

    expect(doubled).toEqual(200);
    expect(triple).toEqual(300);
  });
});
