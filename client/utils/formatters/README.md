# AID World Builder formatters

## Overview

There is a single utility file `traitSplitter.js` in the folder, all the other files are most likely formatters. The filename convention for the formatter file is `*Formatter.js` for example `jsonFormatter.js`

### Inputs

The formatter file takes in two arguments - the `node` object and some extra `options`. The `node` object in this context is a single world entry.

```js
module.exports = (node, options) => your output
```

The `options` object currently only has an `isPreview` property, a boolean that says whether the user is looking at the preview (`true`) or whether it's an actual file output for download (`false`) 

### Outputs

The formatter must return an object that follows AI Dungeon's save file format for a single entry:

```js
{
    id: node.randomId,
    keys: node.tags,
    entry: getEntry(traitSplitter(node)), 
    isNotHidden: true
}
```

The `id`, `keys` and `isNotHidden` values can stay the same in every formatter, but the `entry` value will be your format output. This value visible in the text box in AI Dungeon.
