// @ts-check
/**
 * @typedef {Record<string, Record<string, Record< string, string>>>} Book
 */
/** @type {Book} */
const ot = require("./jst/old-testament.json");
/** @type {Book} */
const nt = require("./jst/new-testament.json");
/** @type {Record<string, Record<string, (string[] | null | undefined)[]>>} */
const jst = require("./jst/jst-reference.json");

const jstCopy = { ...jst };

/**
 * @template {keyof jst} T
 * @param {T} book 
 * @param {keyof jst[T]} chapter 
 * @param {number} index
 */
function getJST(book, chapter, index) {
    const verse = jstCopy[book][chapter][index]
    if (verse === undefined) console.log(`${book} ${chapter} [${index}] doesn't exist.`);
    else if (verse === null) return verse; //console.log(`${book} ${chapter} [${index}] already used!`);
    else if (!Array.isArray(verse)) console.log(`${book} ${chapter} [${index}] not an array!`);
    
    verse?.forEach((v) => {
        if (!startMatch.test(v)) console.log(`${book} ${chapter} [${index}] doesn't start with a num or a +`)
    })

    jstCopy[book][chapter][index] = null;
    return verse;
}

const jstMatch = /\[JST ([0-9]{1,2})\]/
const startMatch = /^[0-9+]/

/**
 * @param {typeof ot | typeof nt} json 
 */
function analyzeTestament(json) {
    for (const bookName in json) {
        const book = json[bookName];

        for (const chapterNumber in book) {

            const chapter = book[chapterNumber];
            for (const verseNumber in chapter) {
                const verse = chapter[verseNumber];
                const match = jstMatch.exec(verse);
                if (!match) continue;

                const index = parseInt(match[1]);
                getJST(bookName, chapterNumber, index);
            }

        }

    }
}

analyzeTestament(ot)
analyzeTestament(nt)

for (const bookName in jst) {
    const book = jst[bookName]
    for (const chapterNumber in book) {
        const chapter = book[chapterNumber];
        const unused = [];
        chapter.forEach((v, i) => {
            if (v !== null) unused.push(`${bookName} ${chapterNumber} [${i}] is unused.`)
        });
        if (unused.length > 0) console.log(unused.join("\n"));
    }
}