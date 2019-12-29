# Rollup

## Always start `import` with `./` or `../`!!!

This creates misleading error messages:

```
import Collision0 from 'cases/Collision0.svelte';
```

```
> npm run test:build
...
cases/Collision-0.svelte (imported by test/TestApp.svelte)
(!) Missing global variable name
Use output.globals to specify browser global variable names corresponding to external modules
cases/Collision-0.svelte (guessing 'Collision0')
created test/bundle in 205ms
```

The message is misleading since it states "imported". Rollup never finds the file - it's just *trying* to import it.

This works:

```
import Collision0 from './cases/Collision0.svelte';
```

Solved thanks to [@mikemaccana's answer](https://stackoverflow.com/questions/51390556/rollup-wants-me-to-create-global-variables-how-can-i-use-export-default/51390915#51390915).

