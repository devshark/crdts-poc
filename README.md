# Conflict Free Replicated Data Types (CRDTs)

## Last-Write-Wins (LWW) Element Set

This repository contains an implementation of a Last-Write-Wins (LWW) Element Set, a type of Conflict-free Replicated Data Type (CRDT). This specific implementation uses timestamps to resolve conflicts between concurrent operations, with a bias towards keeping existing values when timestamps are equal.

## Features

- Generic implementation supporting any data type
- Timestamp-based conflict resolution
- Simple API for setting, getting, and removing values

## Testing

The project uses Jest for unit testing. The test suite covers:

- Basic operations (set, get, remove)
- Conflict resolution logic
- Type generics support
- Error handling

To run the tests:

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```
