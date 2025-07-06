# JST JSON

This provides a way to include the Joseph Smith Translation in tandem with Old and New Testament JSON files. The pattern jst-reference[book][chapter][index] is used to access a portion of the transation.

Since the verse layout isn't 1:1, the following regex allows you to parse the JST reference from either reference file:

```js
/\[JST ([0-9]{1,2})\]$/
```

For example
```ts
function getVerse(work: "old-testament" | "new-testament", book: string, chapter: string, verseNums: number[]) {
  const jstRegex = /\[JST ([0-9]{1,2})\]$/;

  const bookRef = require(`./jst/${work}-reference.json`);
  const jst = require("./jst/jst-reference.json");

  const verseContent: string[] = [];
  const jstLookups: Set<string> = new Set();

  for (const num of verseNums) {
    let verse = bookRef[book][chapter][num];

    const jst = jstRegex.exec(verse);
    if (jst) {
      jstLookups.add(parseInt(jst[1]));
      verse = verse.replace(jstRegex, "");
    }

    verseContent.push(`${num} ${verse}`);
  }

  cosnt jstContent: string[] = [];
  for (const lookup of jstLookups) {
    jstContent.push(jst[book][chapter][lookup].join("\n\n"));
  }

  return { verseContent, jstContent };
}
