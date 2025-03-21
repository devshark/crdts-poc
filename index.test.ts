import { LastWriteWins, KeyNotFoundError, ElementSet } from "./index";

describe("LastWriteWins", () => {
  let lww: LastWriteWins<string>;

  beforeEach(() => {
    lww = new LastWriteWins<string>();
  });

  describe("set method", () => {
    it("should set a value when the key does not exist", () => {
      const value: ElementSet<string> = {
        value: "test-value",
        timestamp: Date.now(),
      };
      lww.set("key1", value);
      expect(lww.get("key1")).toBe(value.value);
    });

    it("should override the value when timestamp is newer", () => {
      const oldValue: ElementSet<string> = {
        value: "old-value",
        timestamp: 100,
      };
      const newValue: ElementSet<string> = {
        value: "new-value",
        timestamp: 200,
      };

      lww.set("key1", oldValue);
      lww.set("key1", newValue);

      expect(lww.get("key1")).toBe(newValue.value);
    });

    it("should keep the old value when timestamp is older", () => {
      const newerValue: ElementSet<string> = {
        value: "newer-value",
        timestamp: 200,
      };
      const olderValue: ElementSet<string> = {
        value: "older-value",
        timestamp: 100,
      };

      lww.set("key1", newerValue);
      lww.set("key1", olderValue);

      expect(lww.get("key1")).toBe(newerValue.value);
    });

    it("should keep the current value when timestamps are the same (bias)", () => {
      const firstValue: ElementSet<string> = {
        value: "first-value",
        timestamp: 100,
      };
      const secondValue: ElementSet<string> = {
        value: "second-value",
        timestamp: 100,
      };

      lww.set("key1", firstValue);
      lww.set("key1", secondValue);

      expect(lww.get("key1")).toBe(firstValue.value);
    });

    it("should handle multiple keys independently", () => {
      const value1: ElementSet<string> = { value: "value-1", timestamp: 100 };
      const value2: ElementSet<string> = { value: "value-2", timestamp: 200 };

      lww.set("key1", value1);
      lww.set("key2", value2);

      expect(lww.get("key1")).toBe(value1.value);
      expect(lww.get("key2")).toBe(value2.value);
    });

    it("should handle conflict resolution correctly across multiple operations", () => {
      // Set initial values
      const value1: ElementSet<string> = { value: "value-1", timestamp: 100 };
      const value2: ElementSet<string> = { value: "value-2", timestamp: 200 };
      const value3: ElementSet<string> = { value: "value-3", timestamp: 150 };

      lww.set("key1", value1);
      expect(lww.get("key1")).toBe(value1.value);

      // Update with newer timestamp
      lww.set("key1", value2);
      expect(lww.get("key1")).toBe(value2.value);

      // Try to update with older timestamp
      lww.set("key1", value3);
      expect(lww.get("key1")).toBe(value2.value);

      // Try to update with newer timestamp again
      const value4: ElementSet<string> = { value: "value-4", timestamp: 250 };
      lww.set("key1", value4);
      expect(lww.get("key1")).toBe(value4.value);
    });
  });

  describe("get method", () => {
    it("should return the value for an existing key", () => {
      const value: ElementSet<string> = {
        value: "test-value",
        timestamp: Date.now(),
      };
      lww.set("key1", value);
      expect(lww.get("key1")).toBe(value.value);
    });

    it("should throw KeyNotFoundError for a non-existent key", () => {
      expect(() => lww.get("non-existent")).toThrow(KeyNotFoundError);
      expect(() => lww.get("non-existent")).toThrow(
        "Key non-existent not found"
      );
    });

    it("should throw KeyNotFoundError with the correct message format", () => {
      const keyName = "special-key";
      expect(() => lww.get(keyName)).toThrow(`Key ${keyName} not found`);
    });
  });

  describe("getSet method", () => {
    it("should return the ElementSet for an existing key", () => {
      const value: ElementSet<string> = { value: "test-value", timestamp: 123 };
      lww.set("key1", value);

      const result = lww.getSet("key1");
      expect(result).toEqual(value);
    });

    it("should throw KeyNotFoundError for a non-existent key", () => {
      expect(() => lww.getSet("non-existent")).toThrow(KeyNotFoundError);
    });

    it("should return the exact same object reference", () => {
      const value: ElementSet<string> = { value: "test-value", timestamp: 123 };
      lww.set("key1", value);

      const result = lww.getSet("key1");
      expect(result).toBe(value); // Using .toBe() checks for object identity
    });
  });

  describe("remove method", () => {
    it("should remove a key from the database", () => {
      const value: ElementSet<string> = {
        value: "test-value",
        timestamp: Date.now(),
      };
      lww.set("key1", value);

      expect(lww.get("key1")).toBe(value.value);

      lww.remove("key1");

      expect(() => lww.get("key1")).toThrow(KeyNotFoundError);
    });

    it("should not throw an error when removing a non-existent key", () => {
      expect(() => lww.remove("non-existent")).not.toThrow();
    });

    it("should allow adding a key back after removal", () => {
      const value1: ElementSet<string> = { value: "value-1", timestamp: 100 };
      const value2: ElementSet<string> = { value: "value-2", timestamp: 200 };

      lww.set("key1", value1);
      expect(lww.get("key1")).toBe(value1.value);

      lww.remove("key1");
      expect(() => lww.get("key1")).toThrow(KeyNotFoundError);

      lww.set("key1", value2);
      expect(lww.get("key1")).toBe(value2.value);
    });
  });

  describe("type generics", () => {
    it("should work with different data types", () => {
      // String type (already tested above)
      const stringLww = new LastWriteWins<string>();
      const stringValue: ElementSet<string> = {
        value: "string-value",
        timestamp: 100,
      };
      stringLww.set("key1", stringValue);
      expect(stringLww.get("key1")).toBe(stringValue.value);

      // Number type
      const numberLww = new LastWriteWins<number>();
      const numberValue: ElementSet<number> = { value: 42, timestamp: 100 };
      numberLww.set("key1", numberValue);
      expect(numberLww.get("key1")).toBe(numberValue.value);

      // Object type
      type User = { name: string; age: number };
      const userLww = new LastWriteWins<User>();
      const userValue: ElementSet<User> = {
        value: { name: "John", age: 30 },
        timestamp: 100,
      };
      userLww.set("user1", userValue);
      expect(userLww.get("user1")).toEqual(userValue.value);
    });

    it("should work with complex types like arrays", () => {
      const arrayLww = new LastWriteWins<string[]>();
      const arrayValue: ElementSet<string[]> = {
        value: ["item1", "item2", "item3"],
        timestamp: 100,
      };

      arrayLww.set("list1", arrayValue);
      expect(arrayLww.get("list1")).toEqual(arrayValue.value);
    });

    it("should work with boolean type", () => {
      const boolLww = new LastWriteWins<boolean>();
      const trueValue: ElementSet<boolean> = { value: true, timestamp: 100 };
      const falseValue: ElementSet<boolean> = { value: false, timestamp: 200 };

      boolLww.set("flag1", trueValue);
      expect(boolLww.get("flag1")).toBe(true);

      boolLww.set("flag1", falseValue);
      expect(boolLww.get("flag1")).toBe(false);
    });
  });

  describe("KeyNotFoundError", () => {
    it("should be an instance of Error", () => {
      const error = new KeyNotFoundError("test-key");
      expect(error instanceof Error).toBe(true);
    });

    it("should have the correct error message", () => {
      const key = "test-key";
      const error = new KeyNotFoundError(key);
      expect(error.message).toBe(`Key ${key} not found`);
    });
  });
});
