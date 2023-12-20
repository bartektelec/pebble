import { computed } from "./computed";
import { mut } from "./mutable";
import { create_internal_context } from "./ctx";

const ctx = create_internal_context();

describe("computed", () => {
  it("should derive a state from other state", () => {
    const name = mut(ctx)("adam");
    const upperName = computed(ctx)(() =>
      name.value.toUpperCase(),
    );

    expect(upperName.value).toEqual("ADAM");
  });

  it("should derive from multiple states", () => {
    const x = mut(ctx)(1);
    const y = mut(ctx)(1);
    const result = computed(ctx)(() => x.value * y.value);

    expect(result.value).toEqual(1);

    x.value = 2;
    expect(result.value).toEqual(2);

    y.value = 5;
    expect(result.value).toEqual(10);
  });

  it("should derive from multiple keys in same state", () => {
    const n = mut(ctx)({
      x: 2,
      y: 2,
    });
    const fn = vi.fn();

    const result = computed(ctx)(() => {
      fn();
      return n.x * n.y;
    });

    expect(result.value).toEqual(4);
    expect(fn).toBeCalledTimes(1);
    n.x = 4;

    expect(fn).toBeCalledTimes(2);
    expect(result.value).toEqual(8);
  });

  it("should derive from multiple keys in same state (nested)", () => {
    const n = mut(ctx)({
      x: {
        value: 2,
      },
      y: 2,
    });
    const fn = vi.fn();

    const result = computed(ctx)(() => {
      fn();
      return n.x.value * n.y;
    });

    expect(result.value).toEqual(4);
    expect(fn).toBeCalledTimes(1);
    n.x.value = 4;

    expect(fn).toBeCalledTimes(2);
    expect(result.value).toEqual(8);

    n.y = 4;

    expect(fn).toBeCalledTimes(3);
    expect(result.value).toEqual(16);
  });
});
