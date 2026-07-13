# Contributing

To get started:

1. run `yarn` to install dependencies
2. run `yarn start` to start a server in watch mode
3. point a browser to `localhost:5173`, or whichever port numberVite indicates after you ran `yarn start`.

For tests, run `yarn test`.

## Feature requirements

Every new feature must include:

1. Test cases that cover its expected behavior and relevant edge cases.
2. One or more Storybook stories that demonstrate the feature in use.

Add or update tests in `tests/` and add the corresponding stories in `stories/`. Run `yarn test` and `yarn build-storybook` before opening a pull request.
