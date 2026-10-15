// SPELLBOOK DATA: Tome VII only (session 2026-10-15, To-do Step 8c-3: load saved tasks)
// Works with the existing index.html unchanged.
// Every spell here is kind "js": write a function; trials cast it and compare Wanted vs Got.
// Help, in order of strength:
//   syntax   – the "New runes" table, always visible before writing (every piece + gotchas)
//   hints    – logic nudges only, never code
//   familiar – a working example of the syntax on different data, plus what to Google

// Practice vault: works like localStorage (text only), wiped after each trial
const VAULT = 'const localStorage = (() => { const vault = {}; return { setItem(k, v) { vault[k] = String(v); }, getItem(k) { return k in vault ? vault[k] : null; }, removeItem(k) { delete vault[k]; } }; })();';

// A saved army used by several trials (the trials read this global)
const ARMY_TEXT = '[{"name":"Skeleton","risen":true},{"name":"Ghoul","risen":false}]';

const TOMES = [

  // ======================================================================
  {
    id: "necromancy", numeral: "VII", title: "Necromancy", theme: "Raising what was saved",
    topic: "Loading saved data", step: "To-do Step 8c-3",
    spells: [

      // ---------------------------------------------------------------
      {
        id: "speak", title: "Speak with Dead", kind: "js", mode: "free", hiddenSetup: VAULT,
        request: `Write <code class="inline">speakWithDead</code>. It takes <code class="inline">key</code>. It asks the vault what's saved under that key. If nothing was ever saved there, it releases <code class="inline">Only silence answers.</code> Otherwise it releases what was saved.<br><br>Here <code class="inline">localStorage</code> is a practice vault: it works like the real one (text only) and is wiped after each trial.`,
        components: [{ name: "key", desc: "The name the message was saved under, as text. Example: \"ghost\"." }],
        syntax: [
          { rune: `localStorage.getItem(key)`, does: `Reads the text saved under the key. Here <code class="inline">key</code> is a component, so no quotes. Keys must match <strong>exactly</strong>: <code class="inline">"ghost"</code> and <code class="inline">"Ghost"</code> are different keys.`, gives: `The saved text, or <code class="inline">null</code> if nothing was ever saved there (no error)` },
          { rune: `null`, does: `JavaScript's "nothing here" value. No quotes: <code class="inline">"null"</code> with quotes is text, and it is <strong>not</strong> <code class="inline">null</code>.`, gives: `—` },
          { rune: `box === null`, does: `Asks "is this box holding nothing?"`, gives: `true or false` },
          { rune: `return …;`, does: `Releases the value <strong>and stops the spell</strong>. Nothing below it runs.`, gives: `The value after it` }
        ],
        starter: `// function speakWithDead(key)
//   Line 1: const answer = what's saved under key (key is a component: no quotes)
//   Guard:  if answer is null:
//             return "Only silence answers."
//   Last line: return answer

`,
        tests: [
          { call: '(() => { localStorage.setItem("ghost", "The treasure is under the mill."); return speakWithDead("ghost"); })()', expected: "The treasure is under the mill." },
          { call: 'speakWithDead("ghost")', expected: "Only silence answers." },
          { call: '(() => { localStorage.setItem("ghost", "Boo."); return speakWithDead("Ghost"); })()', expected: "Only silence answers." }
        ],
        hints: [
          `Asking the vault never causes an error. When nothing is there, it hands back a special "nothing" value instead.`,
          `Check for the empty case first and leave early. The normal answer can be the last line.`,
          `The last trial saves under one key and asks with another. Look at the two keys letter by letter.`
        ],
        familiar: {
          lang: "js", search: "JavaScript localStorage getItem returns null",
          code: `const lastVisit = localStorage.getItem("lastVisit");
console.log(lastVisit === null); // true on a first visit
console.log("null" === null);    // false: quotes make text`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "repose", title: "Gentle Repose", kind: "js", mode: "free", hiddenSetup: VAULT,
        request: `Write <code class="inline">gentleRepose</code>. It takes <code class="inline">key</code>. It reads what's saved under the key into a box. If nothing is saved there, it changes <strong>that same box</strong> to the text <code class="inline">"[]"</code> (an empty array written as text). It releases the box.<br><br>The spell preserves an empty record, so later spells never have to touch <code class="inline">null</code>.`,
        components: [{ name: "key", desc: "The key to read, as text. Example: \"crypt\"." }],
        mustInclude: "let ",
        syntax: [
          { rune: `let name = …;`, does: `Creates a box you are allowed to change later.`, gives: `—` },
          { rune: `const name = …;`, does: `Creates a box that can <strong>never</strong> get a new value. Gotcha: <code class="inline">name = …;</code> later gives <code class="inline">TypeError: invalid assignment to const</code>.`, gives: `—` },
          { rune: `name = newValue;`, does: `Changes a box that already exists. <strong>No keyword.</strong> Gotcha: writing <code class="inline">let name = …;</code> inside an <code class="inline">if { }</code> creates a <em>new</em> box that disappears at the <code class="inline">}</code>; the outer box never changes.`, gives: `—` },
          { rune: `"[]"`, does: `An empty array <strong>written as text</strong> (quotes). This is what the vault stores and what <code class="inline">JSON.parse</code> can read. Without quotes, <code class="inline">[]</code> is a real array, not text.`, gives: `—` }
        ],
        starter: `// function gentleRepose(key)
//   Line 1: let record = what's saved under key (let: this box may change)
//   Guard:  if record is null:
//             change record to "[]" (no keyword: same box)
//   Last line: return record

`,
        tests: [
          { call: 'gentleRepose("crypt")', expected: "[]" },
          { call: 'typeof gentleRepose("crypt")', expected: "string" },
          { call: '(() => { localStorage.setItem("crypt", \'[{"name":"Old King"}]\'); return gentleRepose("crypt"); })()', expected: '[{"name":"Old King"}]' }
        ],
        hints: [
          `The box only changes in one case. In the other case, it keeps what the vault gave it.`,
          `Changing a box and creating a box look almost the same. One of them starts with a keyword.`,
          `The vault only ever gives back text, so the fallback should be text too. The second trial checks its type.`
        ],
        familiar: {
          lang: "js", search: "JavaScript let vs const reassign block scope",
          code: `let torches = 3;
if (nightfall === true) {
  torches = 5;          // same box, new value
}
const emptyMap = "[]";  // text that looks like an empty array`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "raise", title: "Raise Dead", kind: "js", mode: "free", hiddenSetup: VAULT,
        request: `Write <code class="inline">raiseDead</code>. It takes no components. It loads the undead army saved under the key <code class="inline">"army"</code>. If nothing is saved, it uses <code class="inline">"[]"</code> instead. It turns the text into a real array and releases it.<br><br>It must release an <strong>array every time</strong>, even on a first visit when the vault is empty.`,
        components: [],
        mustInclude: "JSON.parse(",
        syntax: [
          { rune: `localStorage.getItem("army")`, does: `Reads the text saved under <code class="inline">"army"</code>. Typed directly, the key needs quotes.`, gives: `Text, or <code class="inline">null</code>` },
          { rune: `JSON.parse(text)`, does: `Makes a real array or object from text. Gives back a <strong>new value</strong>: catch it in a box.`, gives: `An array or object` },
          { rune: `JSON.parse("[]")`, does: `Gotcha table, row 1: text in, works.`, gives: `An empty array <code class="inline">[]</code>` },
          { rune: `JSON.parse(null)`, does: `Gotcha table, row 2: no error here, but a loop over the result crashes later.`, gives: `<code class="inline">null</code>` },
          { rune: `JSON.parse([])`, does: `Gotcha table, row 3: a real array isn't text. It becomes empty text <code class="inline">""</code>, so there's nothing to read.`, gives: `SyntaxError: unexpected end of data` }
        ],
        starter: `// function raiseDead()
//   Line 1: let saved = what's saved under the key "army"
//   Guard:  if saved is null, change saved to "[]"
//   Line 2: const army = saved turned into an array
//   Last line: return army

`,
        tests: [
          { call: 'raiseDead().length', expected: 0 },
          { call: 'Array.isArray(raiseDead())', expected: true },
          { call: '(() => { localStorage.setItem("army", ARMY_TEXT); return raiseDead().length; })()', expected: 2 },
          { call: '(() => { localStorage.setItem("army", ARMY_TEXT); return raiseDead()[1].name; })()', expected: "Ghoul" }
        ],
        hints: [
          `Two problems in one spell: the vault might be empty, and the vault only speaks text.`,
          `Solve the empty case before you turn the text into an array.`,
          `The first two trials are a first visit: nothing is saved at all.`
        ],
        familiar: {
          lang: "js", search: "JavaScript JSON.parse localStorage default value",
          code: `const scroll = '[{"spell":"Light"}]';
const spells = JSON.parse(scroll);
console.log(spells[0].spell); // "Light"`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "animate", title: "Animate Dead", kind: "js", mode: "free",
        request: `Write <code class="inline">animateDead</code>. It takes <code class="inline">graveyard</code> (an array of undead objects) and <code class="inline">horde</code> (an array that may already hold some). For each undead in the graveyard, it adds <strong>that one undead</strong> to the end of the horde. It releases how many are in the horde now.`,
        components: [
          { name: "graveyard", desc: "An array of objects like { name: \"Skeleton\" }. Could be empty." },
          { name: "horde", desc: "An array to fill. Could already hold undead." }
        ],
        syntax: [
          { rune: `for (let item of array) { … }`, does: `Runs the block once per item. <code class="inline">item</code> (your name) holds the <strong>current</strong> one each round.`, gives: `—` },
          { rune: `array.push(item)`, does: `Adds <strong>one</strong> item to the end. Changes the array itself. Gotcha: <code class="inline">array.push(otherArray)</code> adds the whole other array as <strong>one single item</strong> (a nested array).`, gives: `(not needed here)` },
          { rune: `push on a const array`, does: `Works. <code class="inline">const</code> stops the box from getting a new value; <code class="inline">.push()</code> changes what's inside the same array.`, gives: `—` },
          { rune: `array.length`, does: `How many items. No <code class="inline">( )</code>.`, gives: `A number` }
        ],
        starter: `// function animateDead(graveyard, horde)
//   Loop: for each undead of graveyard:
//           push that undead into horde
//   Last line: return horde's length

`,
        tests: [
          { call: 'animateDead([{ name: "Skeleton" }, { name: "Zombie" }], [])', expected: 2 },
          { call: 'animateDead([{ name: "Wight" }], [{ name: "Lich" }])', expected: 2 },
          { call: 'animateDead([], [{ name: "Lich" }])', expected: 1 },
          { call: '(() => { const horde = []; animateDead([{ name: "Skeleton" }, { name: "Zombie" }], horde); return horde[0].name; })()', expected: "Skeleton" },
          { call: '(() => { const horde = []; animateDead([{ name: "Skeleton" }, { name: "Zombie" }], horde); return horde[1].name; })()', expected: "Zombie" }
        ],
        hints: [
          `One push per round of the loop.`,
          `Each round, ask: which box holds just the current undead, and which box holds the whole graveyard?`,
          `If the count is right but a name trial gives undefined, something bigger than one undead went into the horde.`
        ],
        familiar: {
          lang: "js", search: "JavaScript for of push array",
          code: `const pack = [];
pack.push({ item: "rope" });  // pack: [ {rope} ]
pack.push(["a", "b"]);        // pack: [ {rope}, ["a","b"] ]  a whole array became ONE item
for (let coin of purse) {
  console.log(coin);          // one coin per round
}`
        }
      },

      // ---------------------------------------------------------------
      {
        id: "resurrection", title: "Resurrection", kind: "js", mode: "free", hiddenSetup: VAULT,
        setup: `const battlefield = [];

function raiseOnField(name, risen) {
  if (risen === true) {
    battlefield.push(name + " (risen)");
  } else {
    battlefield.push(name);
  }
}`,
        setupNote: `Base spell already in your spellbook: raiseOnField draws one undead on the battlefield, like buildTask draws a task on the page. Cast it; don't rewrite it.`,
        request: `Write <code class="inline">resurrection</code>. It takes <code class="inline">horde</code>: the array the rest of your spellbook saves from. It loads the army saved under <code class="inline">"army"</code> (using <code class="inline">"[]"</code> if nothing is saved) and turns it into an array. For each undead, it casts <code class="inline">raiseOnField</code> with the undead's <code class="inline">name</code> and <code class="inline">risen</code> status, and pushes that undead into <code class="inline">horde</code>. It releases how many are in the horde.<br><br>The last trial is a "refresh, then add": the army must survive.`,
        components: [{ name: "horde", desc: "An array to fill, usually empty. Later spells push into it and save it." }],
        mustInclude: "raiseOnField(",
        syntax: [
          { rune: `undead.name / undead.risen`, does: `Reads one key from the current object. Gotcha: a misspelled key (<code class="inline">undead.risn</code>) gives back <code class="inline">undefined</code>, with <strong>no error</strong>.`, gives: `That key's value` },
          { rune: `raiseOnField(a, b)`, does: `Casts the base spell. Values land in its slots by order: name first, then risen.`, gives: `(nothing)` },
          { rune: `Everything else`, does: `Runes from Gentle Repose, Raise Dead and Animate Dead: <code class="inline">let</code>, changing a box with no keyword, <code class="inline">"[]"</code>, <code class="inline">JSON.parse</code>, <code class="inline">for…of</code>, <code class="inline">.push(item)</code>.`, gives: `—` }
        ],
        starter: `// function resurrection(horde)
//   Line 1: let saved = what's saved under the key "army"
//   Guard:  if saved is null, change saved to "[]"
//   Line 2: const army = saved turned into an array
//   Loop:   for each undead of army:
//             cast raiseOnField with the undead's name and its risen status
//             push this undead into horde
//   Last line: return horde's length

`,
        tests: [
          { call: 'resurrection([])', expected: 0 },
          { call: '(() => { localStorage.setItem("army", ARMY_TEXT); return resurrection([]); })()', expected: 2 },
          { call: '(() => { localStorage.setItem("army", ARMY_TEXT); resurrection([]); return battlefield.join(", "); })()', expected: "Skeleton (risen), Ghoul" },
          { call: '(() => { localStorage.setItem("army", ARMY_TEXT); const horde = []; resurrection(horde); horde.push({ name: "Wraith", risen: false }); localStorage.setItem("army", JSON.stringify(horde)); return JSON.parse(localStorage.getItem("army")).length; })()', expected: 3 }
        ],
        hints: [
          `This is Raise Dead and Animate Dead joined, plus one base spell.`,
          `Inside the loop, each undead gets two jobs: one for the battlefield, one for the horde.`,
          `If the last trial gives 1, the loaded undead were drawn on the field but never joined the horde.`
        ],
        familiar: {
          lang: "js", search: "JavaScript loop over array of objects call function",
          code: `for (let book of library) {
  showBook(book.title, book.finished);  // read two keys, cast a function
  shelf.push(book);                     // the whole current object
}`
        }
      }
    ]
  }
];

