// SPELLBOOK DATA: Tome VIII only (session 2026-10-16)
// Topics: Problem 7 (palindrome: backward loop, lowercase, booleans) and
//         To-do Step 8c-4a (a unique id on every task: crypto.randomUUID, dataset, migration)
// Works with the existing index.html unchanged.
// Every spell here is kind "js": write a function; trials cast it and compare Wanted vs Got.
// Help, in order of strength:
//   syntax   – the "New runes" table, always visible before writing (every piece + gotchas)
//   hints    – logic nudges only, never code
//   familiar – a working example of the syntax on different data, plus what to Google

const TOMES = [

  // ======================================================================
  {
    id: "soulbinding", numeral: "VIII", title: "Soulbinding", theme: "Body, soul and sigil",
    topic: "Unique ids + backward loops", step: "Problem 7 · To-do Step 8c-4a",
    spells: [

      // ---------------------------------------------------------------
      {
        id: "mirror", title: "Mirror Ward", kind: "js", mode: "free",
        request: `Write <code class="inline">isMirrorOf</code>. It takes <code class="inline">ward</code> and <code class="inline">echo</code>. It releases <code class="inline">true</code> if <code class="inline">echo</code> is <code class="inline">ward</code> spelled backward, ignoring uppercase and lowercase. Otherwise it releases <code class="inline">false</code>.<br><br>Example: <code class="inline">"Lumos"</code> backward is <code class="inline">"somuL"</code>, so <code class="inline">isMirrorOf("Lumos", "somul")</code> is <code class="inline">true</code>.`,
        components: [
          { name: "ward", desc: "The original word, as text. Example: \"Lumos\"." },
          { name: "echo", desc: "The word to check, as text. Example: \"somul\"." }
        ],
        syntax: [
          { rune: `text.toLowerCase()`, does: `Gives back a <strong>new</strong> text in lowercase. Gotcha: it doesn't change the original, so catch the result in a box.`, gives: `Text` },
          { rune: `let name = "";`, does: `A box that starts as empty text. Gotcha: use <code class="inline">let</code>, because it changes every loop round.`, gives: `—` },
          { rune: `for (let i = text.length - 1; i >= 0; i--) { … }`, does: `Counts <strong>down</strong> through every index, from the last one to 0. <code class="inline">i</code> is a name you choose. Gotcha: <code class="inline">i > 0</code> would skip index 0.`, gives: `—` },
          { rune: `text[i]`, does: `The one letter at index <code class="inline">i</code>.`, gives: `Text (one letter)` },
          { rune: `box += more;`, does: `Adds to the <strong>end</strong> of the text in the box.`, gives: `—` },
          { rune: `a === b`, does: `<code class="inline">true</code> only if both texts match exactly, letter for letter.`, gives: `true or false` },
          { rune: `return true;`, does: `Releases a boolean and stops the spell. No quotes: <code class="inline">"true"</code> is text.`, gives: `—` }
        ],
        starter: `// function isMirrorOf(ward, echo)
//   Line 1: const lowerWard = ward in lowercase
//   Line 2: const lowerEcho = echo in lowercase
//   Line 3: let flipped = "" (empty text; let: it changes)
//   Loop:   for each index of lowerWard, from the last index down to 0:
//             add that letter to the end of flipped
//   If flipped matches lowerEcho → return true, else → return false

`,
        tests: [
          { call: 'isMirrorOf("Lumos", "somul")', expected: true },
          { call: 'isMirrorOf("Nox", "XON")', expected: true },
          { call: 'isMirrorOf("abc", "abc")', expected: false },
          { call: 'isMirrorOf("ward", "draw!")', expected: false },
          { call: 'isMirrorOf("", "")', expected: true }
        ],
        hints: [
          `Make both words the same case before you compare anything.`,
          `Build the backward version of one word, then compare it to the other word.`,
          `If "Nox" fails but "Lumos" passes, check which words got lowercased.`
        ],
        familiar: {
          lang: "js", search: "JavaScript for loop count down build string",
          code: `const shout = "Fire".toUpperCase();   // "FIRE"
let countdown = "";
for (let i = 3; i >= 1; i--) {
  countdown += i;                        // "3", then "32", then "321"
}
console.log(countdown === "321");        // true`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "carve", title: "Carve the Sigil", kind: "js", mode: "free",
        request: `Write <code class="inline">carveSigil</code>. It takes no components. It carves a brand-new, unique sigil (a random id) and releases it.<br><br>Every cast must carve a <strong>different</strong> sigil.`,
        components: [],
        mustInclude: "crypto.randomUUID(",
        syntax: [
          { rune: `crypto.randomUUID()`, does: `Makes a new random id each time it's cast. Gotcha: it gives back <strong>text</strong> (36 characters), not a number.`, gives: `Text, like <code class="inline">"a4bb76c0-e05a-4ca5-9719-531f03da7da0"</code>` },
          { rune: `const name = …;`, does: `Catches the id in a box. <code class="inline">const</code> works: this box never changes.`, gives: `—` },
          { rune: `return …;`, does: `Releases the value and stops the spell.`, gives: `—` }
        ],
        starter: `// function carveSigil()
//   Line 1: const sigil = a new random id
//   Last line: return sigil

`,
        tests: [
          { call: 'typeof carveSigil()', expected: "string" },
          { call: 'carveSigil().length', expected: 36 },
          { call: 'carveSigil() !== carveSigil()', expected: true }
        ],
        hints: [
          `You don't invent the sigil yourself. JavaScript has a built-in that makes one.`,
          `The last trial casts the spell twice and checks that the two sigils are different.`
        ],
        familiar: {
          lang: "js", search: "JavaScript crypto.randomUUID",
          code: `console.log(crypto.randomUUID());  // a new id
console.log(crypto.randomUUID());  // a different new id`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "bind", title: "Bind the Soul", kind: "js", mode: "free",
        request: `Write <code class="inline">bindSoul</code>. It takes <code class="inline">name</code>. It creates a soul page: an object with three keys: <code class="inline">sigil</code> (a new random id), <code class="inline">name</code> (the name given), and <code class="inline">risen</code> (<code class="inline">false</code>). It releases the soul page.`,
        components: [{ name: "name", desc: "The undead's name, as text. Example: \"Greg\"." }],
        mustInclude: "crypto.randomUUID(",
        syntax: [
          { rune: `{ key: value, key: value }`, does: `Creates an object. Each key is followed by <code class="inline">:</code> and its value, with commas <strong>between</strong> keys. Key order doesn't matter.`, gives: `An object` },
          { rune: `{ sigil: sigil }`, does: `A key and a box can share a name: the left one is the key's name, the right one is the box whose value goes in.`, gives: `—` },
          { rune: `crypto.randomUUID()`, does: `A new random id, as text.`, gives: `Text` },
          { rune: `false`, does: `A boolean. No quotes.`, gives: `—` }
        ],
        starter: `// function bindSoul(name)
//   Line 1: const sigil = a new random id
//   Line 2: const soul = an object with sigil, name, and risen: false
//   Last line: return soul

`,
        tests: [
          { call: 'bindSoul("Greg").name', expected: "Greg" },
          { call: 'bindSoul("Greg").risen', expected: false },
          { call: 'typeof bindSoul("Greg").sigil', expected: "string" },
          { call: 'bindSoul("Greg").sigil.length', expected: 36 },
          { call: '(() => { const a = bindSoul("Ann"); const b = bindSoul("Ann"); return a.sigil !== b.sigil; })()', expected: true }
        ],
        hints: [
          `Carve the sigil first, then build the object around it.`,
          `The last trial binds two souls with the same name. Their sigils must still be different: that's the whole point of a sigil.`
        ],
        familiar: {
          lang: "js", search: "JavaScript create object with keys",
          code: `const potionId = crypto.randomUUID();
const potion = { id: potionId, flavor: "mint", used: false };
console.log(potion.flavor);  // "mint"`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "mark", title: "Mark the Body", kind: "js", mode: "free",
        request: `Write <code class="inline">markBody</code>. It takes <code class="inline">name</code> and <code class="inline">sigil</code>. It creates a <code class="inline">&lt;div&gt;</code> (the body), writes the name as its text, and carves the sigil on it as the label <code class="inline">data-sigil</code>. It releases the body.<br><br>The body isn't placed on a page; the trials just inspect it.`,
        components: [
          { name: "name", desc: "The undead's name, as text. Example: \"Greg\"." },
          { name: "sigil", desc: "The id to carve. Example: \"a4bb\"." }
        ],
        mustInclude: "dataset.",
        syntax: [
          { rune: `document.createElement("div")`, does: `Creates a new element, not on the page yet.`, gives: `The element` },
          { rune: `element.textContent = text;`, does: `Sets the words shown inside the element.`, gives: `—` },
          { rune: `element.dataset.sigil = value;`, does: `Carves the invisible label <code class="inline">data-sigil="…"</code> on the element. The word after <code class="inline">dataset.</code> becomes the part after <code class="inline">data-</code>. Gotcha: the value is always stored as <strong>text</strong>, so <code class="inline">7</code> becomes <code class="inline">"7"</code>.`, gives: `—` },
          { rune: `return element;`, does: `Releases the whole element.`, gives: `—` }
        ],
        starter: `// function markBody(name, sigil)
//   Line 1: const body = a new div
//   Line 2: set body's text to name
//   Line 3: carve sigil on body as its data-sigil label
//   Last line: return body

`,
        tests: [
          { call: 'markBody("Greg", "a4bb").tagName', expected: "DIV" },
          { call: 'markBody("Greg", "a4bb").textContent', expected: "Greg" },
          { call: 'markBody("Greg", "a4bb").dataset.sigil', expected: "a4bb" },
          { call: 'markBody("Greg", "a4bb").getAttribute("data-sigil")', expected: "a4bb" },
          { call: 'markBody("Bob", 7).dataset.sigil', expected: "7" }
        ],
        hints: [
          `Create the element first; every other line works on it.`,
          `The label's name in the request is data-sigil. Which word goes after dataset. to make that?`,
          `The last trial carves the number 7. Look at what Wanted shows: the quotes are the lesson.`
        ],
        familiar: {
          lang: "js", search: "JavaScript dataset data attribute",
          code: `const bottle = document.createElement("span");
bottle.textContent = "Mint potion";
bottle.dataset.flavor = "mint";            // <span data-flavor="mint">
console.log(bottle.dataset.flavor);         // "mint"`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "mend", title: "Mend the Old Souls", kind: "js", mode: "free",
        request: `Write <code class="inline">mendSouls</code>. It takes <code class="inline">souls</code>: an array of soul pages saved long ago, before sigils existed. Some have a <code class="inline">sigil</code> key, some don't. For each soul with <strong>no</strong> sigil, it carves a new one onto that same soul. Souls that already have a sigil keep it. It releases how many souls it mended.`,
        components: [{ name: "souls", desc: "An array of objects like { name: \"Old King\" } or { name: \"Ann\", sigil: \"x1\" }. Could be empty." }],
        mustInclude: "crypto.randomUUID(",
        syntax: [
          { rune: `soul.sigil === undefined`, does: `Asks "does this object have no sigil key?" Reading a missing key gives back <code class="inline">undefined</code>, with no error. Gotcha: no quotes around <code class="inline">undefined</code>.`, gives: `true or false` },
          { rune: `soul.sigil = value;`, does: `Adds (or changes) the key on <strong>that same object</strong>. The object in the array changes too.`, gives: `—` },
          { rune: `let count = 0;` + ` count += 1;`, does: `A counter: starts at 0, goes up by 1 each time. <code class="inline">let</code>, because it changes.`, gives: `—` },
          { rune: `for (let item of array) { … }`, does: `Runs once per item; <code class="inline">item</code> holds the current one.`, gives: `—` }
        ],
        starter: `// function mendSouls(souls)
//   Line 1: let mended = 0
//   Loop:   for each soul of souls:
//             if soul has no sigil:
//               carve a new random id onto soul.sigil
//               add 1 to mended
//   Last line: return mended

`,
        tests: [
          { call: 'mendSouls([{ name: "Old King" }, { name: "Ann", sigil: "x1" }])', expected: 1 },
          { call: 'mendSouls([])', expected: 0 },
          { call: '(() => { const souls = [{ name: "Ann", sigil: "x1" }]; mendSouls(souls); return souls[0].sigil; })()', expected: "x1" },
          { call: '(() => { const souls = [{ name: "Old King" }]; mendSouls(souls); return typeof souls[0].sigil; })()', expected: "string" },
          { call: '(() => { const souls = [{ name: "A" }, { name: "B" }]; mendSouls(souls); return souls[0].sigil !== souls[1].sigil; })()', expected: true }
        ],
        hints: [
          `Only some souls need work. Check each one before you carve.`,
          `Change the soul itself, not a copy. The trials look inside the array afterward.`,
          `If the "x1" trial fails, a soul that already had a sigil got a new one.`
        ],
        familiar: {
          lang: "js", search: "JavaScript check if object property is undefined",
          code: `const lamp = { color: "blue" };
console.log(lamp.size === undefined);   // true: no size key yet
lamp.size = "small";                    // now it has one
console.log(lamp.size);                 // "small"`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "soulbind", title: "Soulbinding", kind: "js", mode: "free",
        setup: `const battlefield = [];

function markBody(name, sigil) {
  const body = document.createElement("div");
  body.textContent = name;
  body.dataset.sigil = sigil;
  return body;
}`,
        setupNote: `Base spell already in your spellbook: markBody draws one body with its sigil, like buildTask draws a task with its data-id. Cast it; don't rewrite it.`,
        request: `Write <code class="inline">raiseBound</code>. It takes <code class="inline">souls</code>, an array of soul pages (some old, with no sigil). For each soul: if it has no sigil, carve one onto it. Then cast <code class="inline">markBody</code> with the soul's <code class="inline">name</code> and <code class="inline">sigil</code>, and push the body into <code class="inline">battlefield</code>. It releases how many bodies are on the battlefield.<br><br>The trials check that every body's sigil <strong>matches</strong> its soul page's sigil.`,
        components: [{ name: "souls", desc: "An array of objects like { name: \"Greg\" } or { name: \"Ann\", sigil: \"b2\" }." }],
        mustInclude: "markBody(",
        syntax: [
          { rune: `markBody(soul.name, soul.sigil)`, does: `Casts the base spell. Values land in its slots by order: name first, then sigil.`, gives: `The body (a div)` },
          { rune: `battlefield.push(body)`, does: `Adds one body to the end of the battlefield array.`, gives: `(not needed here)` },
          { rune: `Everything else`, does: `Runes from Mend the Old Souls: <code class="inline">=== undefined</code>, <code class="inline">soul.sigil = …</code>, <code class="inline">crypto.randomUUID()</code>, <code class="inline">for…of</code>. Gotcha: the order of the lines inside the loop decides which sigil gets carved on the body.`, gives: `—` }
        ],
        starter: `// function raiseBound(souls)
//   Loop: for each soul of souls:
//           if soul has no sigil, carve a new random id onto soul.sigil
//           const body = cast markBody with soul's name and soul's sigil
//           push body into battlefield
//   Last line: return battlefield's length

`,
        tests: [
          { call: 'raiseBound([{ name: "Greg" }, { name: "Ann", sigil: "b2" }])', expected: 2 },
          { call: '(() => { raiseBound([{ name: "Greg" }, { name: "Ann", sigil: "b2" }]); return battlefield[1].dataset.sigil; })()', expected: "b2" },
          { call: '(() => { raiseBound([{ name: "Greg" }]); return battlefield[0].dataset.sigil !== "undefined"; })()', expected: true },
          { call: '(() => { const souls = [{ name: "Greg" }]; raiseBound(souls); return battlefield[0].dataset.sigil === souls[0].sigil; })()', expected: true }
        ],
        hints: [
          `This is Mend the Old Souls plus drawing a body, inside one loop.`,
          `The body copies the soul's sigil at the moment markBody is cast. What does the soul need to have by then?`,
          `If a body shows the sigil "undefined", it was drawn before its soul was mended.`
        ],
        familiar: {
          lang: "js", search: "JavaScript loop over objects add property then call function",
          code: `for (let potion of shelf) {
  if (potion.label === undefined) {
    potion.label = "unknown";               // fix the object first
  }
  drawBottle(potion.flavor, potion.label);  // then draw it
}`
        }
      }
    ]
  }
];
