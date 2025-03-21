export type ElementSet<T> = {
  value: T;
  timestamp: number;
};

// Custom error for handling when a key is not found in the database
export class KeyNotFoundError extends Error {
  constructor(key: string) {
    super(`Key ${key} not found`);
  }
}

export class LastWriteWins<T> {
  private database: Map<string, ElementSet<T>>;

  constructor() {
    this.database = new Map();
  }

  // sets the value of the key, if they are more recent than the current value
  public set(key: string, value: ElementSet<T>) {
    try {
      this.getSet(key); // triggers a KeyNotFoundError if the key does not exist
      const valueToKeep = this.resolveConflict(key, value);
      this.database.set(key, valueToKeep);
    } catch (error) {
      if (error instanceof KeyNotFoundError) {
        this.database.set(key, value);
      } else {
        throw error;
      }
    }
  }

  // returns the ElementSet<T> of the key
  // throws a KeyNotFoundError if the key does not exist
  private resolveConflict(key: string, value: ElementSet<T>): ElementSet<T> {
    const currentValue = this.getSet(key);
    if (currentValue.timestamp < value.timestamp) {
      return value;
    }

    // BIAS: if both timestamps are the same, keep the current value
    return currentValue;
  }

  // returns the ElementSet<T> of the key
  // throws a KeyNotFoundError if the key does not exist
  // NOTE: You can inherit and extend this method if you don't want to throw an error and return a default value
  public getSet(key: string): ElementSet<T> {
    const value = this.database.get(key);
    if (!value) {
      throw new KeyNotFoundError(key);
    }

    return value;
  }

  // returns the value T of the key
  // throws a KeyNotFoundError if the key does not exist
  public get(key: string): T {
    return this.getSet(key).value;
  }

  // removes the key from the database
  public remove(key: string) {
    this.database.delete(key);
  }

  public getElements(): Map<string, ElementSet<T>> {
    return this.database;
  }

  // take another LastWriteWins<T> and merge it into this object
  public merge(other: LastWriteWins<T>): LastWriteWins<T> {
    for (const [key, value] of other.getElements()) {
      this.set(key, value);
    }

    return this;
  }
}

// standalone merge function to merge two LastWriteWins<T> objects
export function merge<T>(
  a: LastWriteWins<T>,
  b: LastWriteWins<T>
): LastWriteWins<T> {
  return a.merge(b);
}

// standalone merge function to merge multiple LastWriteWins<T> objects
export function mergeAll<T>(
  first: LastWriteWins<T>,
  ...others: LastWriteWins<T>[]
): LastWriteWins<T> {
  return others.reduce((acc, db) => acc.merge(db), first);
}
