# Conflict Free Replicated Data Types (CRDTs)

[![Run Tests](https://github.com/devshark/crdts-poc/actions/workflows/test.yml/badge.svg)](https://github.com/devshark/crdts-poc/actions/workflows/test.yml)

## Last-Write-Wins (LWW) Element Set

Hey there! 🎉 This repo is all about implementing a Last-Write-Wins (LWW) Element Set, which is a cool type of Conflict-free Replicated Data Type (CRDT). Basically, it uses timestamps to sort out any conflicts when things get updated at the same time. And guess what? It leans towards keeping the old values if the timestamps are the same.

## Features

- Super generic implementation that works with any data type
- Timestamps to figure out who wins in a conflict
- Easy-peasy API for setting, getting, and removing values

## Testing

We're using Jest for unit testing, so you know it's legit. The test suite covers:

- Basic stuff (set, get, remove)
- How it handles conflict resolution
- Support for type generics
- Error handling (because who likes bugs?)

To run the tests, just do the following:

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# If you wanna keep an eye on the tests
yarn test:watch
```

## Continuous Integration

We’ve got GitHub Actions set up to run tests automatically whenever you push or make a pull request to the main branches. Here’s the scoop:

- It runs on Node.js versions 16.x, 18.x, and 20.x
- Skips runs for doc changes and other non-code stuff (no need to waste time!)
- Caches dependencies to make things faster

You can check out the workflow config in `.github/workflows/test.yml`.

Happy coding! 🎉

## License

[MIT License](LICENSE)

## Author

Anthony Lim - Senior Backend Software Engineer
