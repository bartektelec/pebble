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
