# backup

`editor-chassis.html` is the skeuomorphic ("moulded plastic") code editor, kept
verbatim in case the flat rebuild isn't the direction.

It still renders exactly as it did, because the rebuild **added**
`assets/vector.css` rather than modifying `assets/cassette.css` — this file
still points at the untouched original stylesheet.

To restore it as the live editor:

```bash
cp backup/editor-chassis.html editor/index.html
```

Both stylesheets define the same class names (`.key`, `.screen`, `.label`,
`.tape`, `.led`, `.seg`, …), so a page swaps looks by swapping one `<link>`.
