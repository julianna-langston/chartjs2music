# Agent Contribution Guide

## Purpose

This file guides coding agents contributing to chartjs2music. It covers how to
change the repository safely; use the README for library installation and API
usage.

## Project Map

- `src/`: TypeScript implementation of the Chart.js plugin.
- `tests/`: Jest tests for plugin behavior and chart output.
- `stories/`: Storybook stories and chart sample configurations.
- `stories/charts/`: Stories grouped by chart type.
- `stories/sample-chart.ts`: Shared Storybook rendering helpers.
- `README.md`: Public feature and usage documentation.
- `contributing.md`: Contributor workflow and expectations.
- `stories/INSTRUCTIONS.md`: Details for adding or updating stories.

Generated files in `dist/` are build output. Do not edit them by hand.

## Local Workflow

Use a current Node.js LTS release and Yarn. Install dependencies with:

```sh
yarn install
```

Useful commands:

```sh
yarn test
yarn build
yarn build-storybook
yarn depcheck
yarn storybook
```

Run the focused checks that cover a change, then run the full relevant suite
before opening a pull request. Keep changes narrow and follow nearby code and
test patterns. Do not manually edit `yarn.lock`; let Yarn update it when a
dependency change requires it.

## Feature Changes

Every new user-facing feature must include:

1. Jest test coverage for its behavior and edge cases.
2. A Storybook story that demonstrates the supported configuration.
3. Documentation updates when the public API, supported charts, or behavior
   changes.

Stories should use the shared rendering helpers and provide ordinary Chart.js
sample configuration. Avoid custom HTML scaffolding unless the chart genuinely
needs more than a canvas. When adding Chart.js extensions, register them where
the shared sample chart setup expects them. Follow `stories/INSTRUCTIONS.md`
for the current story conventions.

Keep compatibility behavior explicit in tests. If a chart type or plugin input
is intentionally unsupported, document and test how it is handled rather than
silently broadening the feature scope.

## Pull Requests

- Branch from the current `main` and keep the working tree clean.
- Give each pull request one focused purpose.
- Describe user-visible behavior, tests run, and any intentionally omitted
  follow-up work.
- Do not mix generated output, unrelated formatting, or lockfile churn into a
  change unless it is required.
- Resolve merge conflicts against current `main`, then rerun the affected
  checks.

## Releases

Only release from the current GitHub `main` branch, with no uncommitted files.
Use semantic versioning and release only after the version change and its
validation are committed.

1. Update the package version in `package.json` and update the lockfile only
   when Yarn requires it.
2. Install dependencies cleanly and run `yarn test`, `yarn build`,
   `yarn build-storybook`, and `yarn depcheck`.
3. Inspect the publish artifact with `npm pack --dry-run`. `prepack` rebuilds
   the distributable files, so do not bypass lifecycle scripts during a normal
   release.
4. Commit the release version, rebase or merge the latest `main` if needed,
   and push the release commit to `main`.
5. Immediately before publishing, ask the maintainer to provide a fresh npm
   one-time password (OTP). An agent must not publish without explicit
   per-release confirmation and an OTP supplied by the maintainer. Never store
   an OTP in repository files, commits, or scripts.
6. Confirm the active npm account with `npm whoami`, then publish with
   `npm publish --otp=<maintainer-provided-otp>`.
7. Verify the published version, create an annotated `v<version>` tag for the
   release commit, and push the tag.

If publishing fails after the version commit has been pushed, do not reuse an
old OTP or create a replacement tag. Diagnose the failure, obtain a fresh OTP
from the maintainer, and retry only with their confirmation.
