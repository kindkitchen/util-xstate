# About

TODO

## Developer notes

#### Plop.js => integration with project

> [Plop.js getting started](https://plopjs.com/documentation/#getting-started)

- `deno add npm:plop --allow-scripts`
- `deno -A npm:plop --init-ts` /// init config
- `mv plopfile.ts src/lib/cli/plop.config.ts` /// optional customization
- in `deno.json` add `task`:
  - `"plop": "deno -A npm:plop --plopfile src/lib/cli/plop.config.ts"`
