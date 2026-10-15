// SPELLBOOK DATA
// TOMES: each tome is a themed group of spells, in the order the concepts were learned.
// Each spell has a "kind" that decides how it is written and tested:
//   "js"   – write a function; trials cast it and compare Wanted vs Got
//   "html" – write HTML; trials check the page it builds
//   "css"  – write CSS for a page that's already written; trials check the styles
//   "dom"  – write JavaScript that changes a practice page; trials click and type on it
// Help, in order of strength:
//   syntax   – the "New runes" table, always visible before writing
//   hints    – logic nudges only, never code
//   familiar – a working example of the syntax on different data, plus what to Google

// ---------- Helpers the trials use (not shown to the caster) ----------
const H = {
  // Read a global box from the practice page; undefined if it doesn't exist
  g(win, name) { try { return win.eval(name); } catch (e) { return undefined; } },
  runes(doc) { return Array.from(doc.querySelectorAll("#spell-list li")); },
  names(doc) { return H.runes(doc).map(li => (li.querySelector(".rune-name") || li).textContent.trim()); },
  type(doc, text) { doc.querySelector("#spell-name").value = text; },
  submit(win, doc) {
    const ev = new win.Event("submit", { bubbles: true, cancelable: true });
    doc.querySelector("#spell-form").dispatchEvent(ev);
    return ev;
  },
  click(win, el) { el.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true })); },
  css(win, el) { return win.getComputedStyle(el); },
  list(arr) { return arr.length ? arr.map(t => '"' + t + '"').join(", ") : "nothing"; },
  stripHtmlComments(src) { return src.replace(/<!--[\s\S]*?-->/g, ""); },
  stripJsComments(src) { return src.replace(/\/\/[^\n]*/g, ""); }
};

// The practice page used by the CSS, DOM and event spells
const PAGE_EMPTY = `<h1>My Spellbook</h1>
<form id="spell-form">
  <label for="spell-name">New spell</label>
  <input id="spell-name" type="text">
  <button id="inscribe-button" type="submit">Inscribe</button>
</form>
<ul id="spell-list"></ul>`;

const PAGE_FULL = `<h1>My Spellbook</h1>
<form id="spell-form">
  <label for="spell-name">New spell</label>
  <input id="spell-name" type="text">
  <button id="inscribe-button" type="submit">Inscribe</button>
</form>
<ul id="spell-list">
  <li class="rune"><span class="rune-name">Fire Bolt</span><button class="banish-button">×</button></li>
  <li class="rune forgotten"><span class="rune-name">Shield</span><button class="banish-button">×</button></li>
  <li class="rune"><span class="rune-name">Light</span><button class="banish-button">×</button></li>
</ul>`;

// Simple look for the DOM practice page so the preview is readable (not part of any spell)
const PAGE_LOOK = `body { font-family: Georgia, serif; margin: 16px; }
.mastered .rune-name { font-weight: bold; color: #7a3db8; }`;

// Practice vault: works like localStorage (text only), wiped after each trial
const VAULT = 'const localStorage = (() => { const vault = {}; return { setItem(k, v) { vault[k] = String(v); }, getItem(k) { return k in vault ? vault[k] : null; }, removeItem(k) { delete vault[k]; } }; })();';

const TOMES = [

  // ======================================================================
  {
    id: "foundations", numeral: "I", title: "Arcane Foundations", theme: "The bones of the page",
    topic: "HTML", step: "To-do Steps 0–1",
    spells: [
      {
        id: "fitness", title: "Basic Fitness", kind: "html",
        request: `Every caster needs a healthy <code class="inline">&lt;body&gt;</code>. Write the skeleton of a page: the doctype, an <code class="inline">html</code> element in English, a <code class="inline">head</code> with the UTF-8 character set and the title <code class="inline">My Spellbook</code>, and an empty <code class="inline">body</code>.`,
        syntax: [
          { rune: `<!DOCTYPE html>`, does: `First line of every page. Tells the browser "this is modern HTML". No closing tag.`, gives: `—` },
          { rune: `<html lang="en"> … </html>`, does: `Wraps the whole page. <code class="inline">lang</code> is an <strong>attribute</strong>: <code class="inline">name="value"</code> inside the opening tag.`, gives: `—` },
          { rune: `<head> … </head>`, does: `Information <em>about</em> the page. Not shown on the page itself.`, gives: `—` },
          { rune: `<meta charset="UTF-8">`, does: `Says which letters the page uses. A <strong>void</strong> element: no closing tag.`, gives: `—` },
          { rune: `<title> … </title>`, does: `The name shown on the browser tab. Goes inside the head.`, gives: `—` },
          { rune: `<body> … </body>`, does: `Everything shown on the page goes here.`, gives: `—` }
        ],
        starter: `<!-- Line 1: the doctype -->
<!-- Line 2: open html, in English -->
<!-- Line 3:   open head -->
<!-- Line 4:     meta: character set UTF-8 -->
<!-- Line 5:     title: My Spellbook -->
<!-- Line 6:   close head -->
<!-- Line 7:   open body -->
<!-- Line 8:   close body -->
<!-- Line 9: close html -->

`,
        checks: [
          { label: `The page starts with the doctype`, test: (doc, src) => /^\s*<!doctype html>/i.test(H.stripHtmlComments(src)) || `Found at the start: "${H.stripHtmlComments(src).trim().slice(0, 20)}"` },
          { label: `The html element has lang="en"`, test: (doc, src) => /<html[^>]*\slang=["']en["']/i.test(src) || `No <html lang="en"> opening tag found` },
          { label: `The head has a UTF-8 meta`, test: (doc) => { const m = doc.querySelector("meta[charset]"); return (m && m.getAttribute("charset").toLowerCase() === "utf-8") || (m ? `Found charset="${m.getAttribute("charset")}"` : `No <meta charset> found`); } },
          { label: `The title is "My Spellbook"`, test: (doc) => doc.title === "My Spellbook" || `Found title: "${doc.title}"` },
          { label: `head opens and closes before body opens`, test: (doc, src) => /<head>[\s\S]*<\/head>[\s\S]*<body[^>]*>/i.test(H.stripHtmlComments(src)) || `Check that <head> … </head> comes first, then <body>` },
          { label: `body and html are both closed, html last`, test: (doc, src) => /<\/body>\s*<\/html>\s*$/i.test(H.stripHtmlComments(src)) || `The page should end with </body> then </html>` }
        ],
        hints: [
          `Every tag you open, you close later, in reverse order: the last one opened is the first one closed.`,
          `Two jobs, two places: information <em>about</em> the page goes in the head; what's <em>shown</em> goes in the body.`,
          `Two of these runes never get a closing tag. The New runes table says which.`
        ],
        familiar: {
          lang: "html", search: "HTML page skeleton head body",
          code: `<!-- Nesting: a tag opened inside another closes inside it too -->
<section lang="fr">
  <header>
    <meta name="author" content="Mira">
    <h2>Potion Shop</h2>
  </header>
  <main></main>
</section>`
        }
      },
      {
        id: "intellect", title: "Arcane Intellect", kind: "html",
        request: `Write the page's first words. Write <strong>only what goes inside the body</strong>: a main heading that says <code class="inline">My Spellbook</code>, then a paragraph that says <code class="inline">Every spell I know, from cantrips to rituals.</code> with the word <code class="inline">cantrips</code> in bold using <code class="inline">strong</code>.`,
        syntax: [
          { rune: `<h1> … </h1>`, does: `The page's main heading. One per page.`, gives: `—` },
          { rune: `<p> … </p>`, does: `A paragraph of text.`, gives: `—` },
          { rune: `<strong> … </strong>`, does: `Marks important words (shown bold). Can sit <em>inside</em> a paragraph, around just one word.`, gives: `—` }
        ],
        starter: `<!-- Line 1: main heading: My Spellbook -->
<!-- Line 2: paragraph, with the word cantrips wrapped in strong -->

`,
        checks: [
          { label: `There is exactly one h1`, test: (doc) => doc.querySelectorAll("h1").length === 1 || `Found ${doc.querySelectorAll("h1").length} h1 elements` },
          { label: `The h1 says "My Spellbook"`, test: (doc) => { const h = doc.querySelector("h1"); return (h && h.textContent.trim() === "My Spellbook") || `Found: "${h ? h.textContent.trim() : "no h1"}"`; } },
          { label: `A paragraph comes after the heading`, test: (doc) => { const h = doc.querySelector("h1"), p = doc.querySelector("p"); return (h && p && !!(h.compareDocumentPosition(p) & 4)) || (p ? `The p comes before the h1` : `No <p> found`); } },
          { label: `The paragraph has the full sentence`, test: (doc) => { const p = doc.querySelector("p"); const t = p ? p.textContent.replace(/\s+/g, " ").trim() : ""; return t === "Every spell I know, from cantrips to rituals." || `Found: "${t}"`; } },
          { label: `"cantrips" is wrapped in strong, inside the paragraph`, test: (doc) => { const s = doc.querySelector("p strong"); return (s && s.textContent.trim() === "cantrips") || (s ? `strong wraps "${s.textContent.trim()}"` : `No <strong> inside the <p>`); } }
        ],
        hints: [
          `The heading comes first on the page, so it comes first in the code.`,
          `The strong tag opens right before the word and closes right after it. Everything else in the sentence stays outside it.`,
          `The paragraph trial compares the sentence exactly: check commas, capitals and the final period.`
        ],
        familiar: {
          lang: "html", search: "HTML h1 p strong elements",
          code: `<h2>Potion Shop</h2>
<p>Every potion is <em>freshly</em> brewed at dawn.</p>`
        }
      },
      {
        id: "magehand", title: "Mage Hand", kind: "html",
        request: `Reach out and grab the caster's input. Write a form with the id <code class="inline">spell-form</code>. Inside it: a label that says <code class="inline">New spell</code>, connected to a text input with the id <code class="inline">spell-name</code> that is <strong>required</strong>, then a submit button with the id <code class="inline">inscribe-button</code> that says <code class="inline">Inscribe</code>.`,
        syntax: [
          { rune: `<form id="…"> … </form>`, does: `A group of inputs that get sent together.`, gives: `—` },
          { rune: `<label for="…"> … </label>`, does: `Names an input. Its <code class="inline">for</code> must match the input's <code class="inline">id</code> exactly, so clicking the label focuses the input.`, gives: `—` },
          { rune: `<input id="…" type="text" required>`, does: `A text box. <code class="inline">required</code> is an attribute with <strong>no value</strong>: the browser won't submit while it's empty. Void element: no closing tag.`, gives: `—` },
          { rune: `<button type="submit"> … </button>`, does: `A button that submits its form.`, gives: `—` }
        ],
        starter: `<!-- Line 1: open the form, id spell-form -->
<!-- Line 2:   label "New spell", connected to the input below -->
<!-- Line 3:   text input, id spell-name, required -->
<!-- Line 4:   submit button, id inscribe-button, text Inscribe -->
<!-- Line 5: close the form -->

`,
        checks: [
          { label: `A form with id "spell-form" exists`, test: (doc) => !!doc.querySelector("form#spell-form") || `No <form id="spell-form"> found` },
          { label: `A label inside the form says "New spell"`, test: (doc) => { const l = doc.querySelector("#spell-form label"); return (l && l.textContent.trim() === "New spell") || (l ? `Label says "${l.textContent.trim()}"` : `No <label> inside the form`); } },
          { label: `The label is connected to the input (for = id)`, test: (doc) => { const l = doc.querySelector("#spell-form label"), i = doc.querySelector("#spell-name"); return (l && i && l.control === i) || (l ? `label for="${l.getAttribute("for")}" doesn't match an input id` : `No label found`); } },
          { label: `The input is type="text" and required`, test: (doc) => { const i = doc.querySelector("#spell-form input#spell-name"); if (!i) return `No input with id "spell-name" inside the form`; if (i.getAttribute("type") !== "text") return `Found type="${i.getAttribute("type")}"`; return i.required || `The input isn't required`; } },
          { label: `A submit button with id "inscribe-button" says "Inscribe"`, test: (doc) => { const b = doc.querySelector("#spell-form button#inscribe-button"); if (!b) return `No button with id "inscribe-button" inside the form`; if (b.getAttribute("type") !== "submit") return b.hasAttribute("type") ? `Found type="${b.getAttribute("type")}"` : `The button has no type attribute (write type="submit")`; return b.textContent.trim() === "Inscribe" || `Button says "${b.textContent.trim()}"`; } }
        ],
        hints: [
          `Everything the caster fills in lives between the form's opening and closing tags.`,
          `The label finds its input by matching two attributes on two different tags. Spell both the same.`,
          `Each attribute goes inside its element's opening tag, separated by spaces.`
        ],
        familiar: {
          lang: "html", search: "HTML form label for input id",
          code: `<form id="guild-signup">
  <label for="hero-age">Age</label>
  <input id="hero-age" type="number" disabled>
  <button type="reset">Clear</button>
</form>`
        }
      },
      {
        id: "servant", title: "Unseen Servant", kind: "html",
        request: `Lay out your known spells in order. Write a bulleted list with the id <code class="inline">spell-list</code>. It holds three items, each with the class <code class="inline">rune</code>: <code class="inline">Fire Bolt</code>, <code class="inline">Shield</code>, <code class="inline">Light</code>.`,
        syntax: [
          { rune: `<ul id="…"> … </ul>`, does: `An unordered (bulleted) list.`, gives: `—` },
          { rune: `<li class="…"> … </li>`, does: `One item in a list. Must sit directly inside the list.`, gives: `—` },
          { rune: `id vs. class`, does: `<code class="inline">id</code>: one of it on the page. <code class="inline">class</code>: many things can share it.`, gives: `—` }
        ],
        starter: `<!-- Line 1: open the list, id spell-list -->
<!-- Line 2:   item, class rune: Fire Bolt -->
<!-- Line 3:   item, class rune: Shield -->
<!-- Line 4:   item, class rune: Light -->
<!-- Line 5: close the list -->

`,
        checks: [
          { label: `A ul with id "spell-list" exists`, test: (doc) => !!doc.querySelector("ul#spell-list") || (doc.querySelector("#spell-list") ? `#spell-list isn't a <ul>` : `No <ul id="spell-list"> found`) },
          { label: `It holds exactly 3 items`, test: (doc) => { const n = doc.querySelectorAll("#spell-list > li").length; return n === 3 || `Found ${n} items directly inside the list`; } },
          { label: `Every item has the class "rune"`, test: (doc) => { const li = Array.from(doc.querySelectorAll("#spell-list > li")); const miss = li.filter(x => !x.classList.contains("rune")).length; return (li.length > 0 && miss === 0) || `${miss} item(s) without class "rune"`; } },
          { label: `Items read Fire Bolt, Shield, Light (in order)`, test: (doc) => { const t = Array.from(doc.querySelectorAll("#spell-list > li")).map(x => x.textContent.trim()); return t.join("|") === "Fire Bolt|Shield|Light" || `Found: ${H.list(t)}`; } }
        ],
        hints: [
          `The list is the one thing (id); the items are the many things (class).`,
          `Each item opens and closes completely before the next one starts.`,
          `The trials read the items top to bottom, so order and spelling matter.`
        ],
        familiar: {
          lang: "html", search: "HTML ul li list",
          code: `<ol id="quest-steps">
  <li class="step">Find the map</li>
  <li class="step">Cross the bog</li>
</ol>`
        }
      }
    ]
  },

  // ======================================================================
  {
    id: "illusion", numeral: "II", title: "School of Illusion", theme: "How the page looks",
    topic: "CSS", step: "To-do Steps 2, 6, 7b",
    spells: [
      {
        id: "colorspray", title: "Color Spray", kind: "css", page: PAGE_FULL, baseCss: "body { font-family: Georgia, serif; margin: 16px; }",
        request: `Paint the spellbook. In <code class="inline">:root</code>, create two color variables: <code class="inline">--parchment</code> set to <code class="inline">#2b1d0e</code> and <code class="inline">--ink</code> set to <code class="inline">#f3e3c3</code>. Then give the <code class="inline">body</code> the parchment background color and the ink text color, <strong>using the variables</strong>.`,
        syntax: [
          { rune: `selector { property: value; }`, does: `A CSS rule: pick elements, then set properties on them.`, gives: `—` },
          { rune: `:root { }`, does: `Selects the top of the page. Variables made here work everywhere.`, gives: `—` },
          { rune: `--name: value;`, does: `Creates a variable (custom property). The name starts with two dashes.`, gives: `—` },
          { rune: `var(--name)`, does: `Uses a variable's value.`, gives: `The value stored in it` },
          { rune: `background-color / color`, does: `Background color / text color.`, gives: `—` }
        ],
        starter: `/* Rule 1: in :root, create --parchment (#2b1d0e) and --ink (#f3e3c3) */

/* Rule 2: on body, background-color uses --parchment, color uses --ink */

`,
        checks: [
          { label: `--parchment is #2b1d0e`, test: (doc, win) => { const v = H.css(win, doc.documentElement).getPropertyValue("--parchment").trim().toLowerCase(); return v === "#2b1d0e" || `Found --parchment: "${v}"`; } },
          { label: `--ink is #f3e3c3`, test: (doc, win) => { const v = H.css(win, doc.documentElement).getPropertyValue("--ink").trim().toLowerCase(); return v === "#f3e3c3" || `Found --ink: "${v}"`; } },
          { label: `The body's background is parchment`, test: (doc, win) => { const v = H.css(win, doc.body).backgroundColor; return v === "rgb(43, 29, 14)" || `Found background-color: ${v}`; } },
          { label: `The body's text is ink`, test: (doc, win) => { const v = H.css(win, doc.body).color; return v === "rgb(243, 227, 195)" || `Found color: ${v}`; } },
          { label: `The body uses the variables, not the raw colors`, test: (doc, win, css) => (/var\(\s*--parchment\s*\)/.test(css) && /var\(\s*--ink\s*\)/.test(css)) || `Use var(--parchment) and var(--ink) on the body` }
        ],
        hints: [
          `Two separate rules: one creates the colors, one uses them.`,
          `The variable's name is spelled the same in both places, dashes included.`,
          `Inside a rule, each property ends with a semicolon.`
        ],
        familiar: {
          lang: "css", search: "CSS custom properties var()",
          code: `:root {
  --moss: #3b5d2a;
}
.tavern-sign {
  border-color: var(--moss);
}`
        }
      },
      {
        id: "dispel", title: "Dispel Magic", kind: "css", page: PAGE_FULL, baseCss: "body { font-family: Georgia, serif; margin: 16px; }",
        request: `Strip away the browser's default magic. Take the bullets off <code class="inline">#spell-list</code> and remove its left padding. Then make every <code class="inline">input</code> and <code class="inline">button</code> use the same font as the page (the page uses Georgia).`,
        syntax: [
          { rune: `list-style-type: none;`, does: `Removes a list's bullets.`, gives: `—` },
          { rune: `padding-left: 0;`, does: `Removes the space inside an element's left edge. Lists get some by default.`, gives: `—` },
          { rune: `font-family: inherit;`, does: `<code class="inline">inherit</code> = "use my parent's value". Form controls don't inherit fonts unless told to.`, gives: `—` },
          { rune: `a, b { }`, does: `A comma lets one rule style several selectors.`, gives: `—` }
        ],
        starter: `/* Rule 1: on #spell-list, no bullets and no left padding */

/* Rule 2: on input and button (one rule), inherit the font */

`,
        checks: [
          { label: `The list has no bullets`, test: (doc, win) => { const v = H.css(win, doc.querySelector("#spell-list")).listStyleType; return v === "none" || `Found list-style-type: ${v}`; } },
          { label: `The list has no left padding`, test: (doc, win) => { const v = H.css(win, doc.querySelector("#spell-list")).paddingLeft; return v === "0px" || `Found padding-left: ${v}`; } },
          { label: `The input uses the page font`, test: (doc, win) => { const want = H.css(win, doc.body).fontFamily, v = H.css(win, doc.querySelector("#spell-name")).fontFamily; return v === want || `Found font-family: ${v}`; } },
          { label: `All buttons use the page font`, test: (doc, win) => { const want = H.css(win, doc.body).fontFamily; const bad = Array.from(doc.querySelectorAll("button")).filter(b => H.css(win, b).fontFamily !== want).length; return bad === 0 || `${bad} button(s) still use a different font`; } }
        ],
        hints: [
          `Browsers style some elements before you write any CSS: lists get bullets and an indent, form controls get their own font.`,
          `One rule for the list, one rule shared by two kinds of element.`,
          `inherit doesn't name a font; it borrows whatever the parent has.`
        ],
        familiar: {
          lang: "css", search: "CSS list-style-type inherit",
          code: `.menu {
  list-style-type: square;
  padding-left: 2rem;
}
select, textarea {
  font-size: inherit;
}`
        }
      },
      {
        id: "mistystep", title: "Misty Step", kind: "css", page: PAGE_FULL, baseCss: "body { font-family: Georgia, serif; margin: 16px; } #spell-list { list-style-type: none; padding-left: 0; }",
        request: `Make each spell row a flex row: the name on the left, the <code class="inline">×</code> button teleported to the far right, both centered vertically, with a <code class="inline">12px</code> gap. Then stop the button from ever shrinking.`,
        syntax: [
          { rune: `display: flex;`, does: `Lines up an element's <strong>children</strong> in a row. Goes on the parent.`, gives: `—` },
          { rune: `justify-content: space-between;`, does: `First child at the start, last child at the end, space between.`, gives: `—` },
          { rune: `align-items: center;`, does: `Centers the children vertically in the row.`, gives: `—` },
          { rune: `gap: 12px;`, does: `Minimum space between the children.`, gives: `—` },
          { rune: `flex-shrink: 0;`, does: `Goes on a child: "never squeeze me smaller".`, gives: `—` }
        ],
        starter: `/* Rule 1: on .rune — flex, space-between, align center, 12px gap */

/* Rule 2: on .banish-button — never shrink */

`,
        checks: [
          { label: `Each .rune is a flex row`, test: (doc, win) => { const v = H.css(win, doc.querySelector(".rune")).display; return v === "flex" || `Found display: ${v}`; } },
          { label: `Children are spread with space-between`, test: (doc, win) => { const v = H.css(win, doc.querySelector(".rune")).justifyContent; return v === "space-between" || `Found justify-content: ${v}`; } },
          { label: `Children are centered vertically`, test: (doc, win) => { const v = H.css(win, doc.querySelector(".rune")).alignItems; return v === "center" || `Found align-items: ${v}`; } },
          { label: `The gap is 12px`, test: (doc, win) => { const v = H.css(win, doc.querySelector(".rune")).columnGap; return v === "12px" || `Found gap: ${v}`; } },
          { label: `The button never shrinks`, test: (doc, win) => { const v = H.css(win, doc.querySelector(".banish-button")).flexShrink; return v === "0" || `Found flex-shrink: ${v}`; } },
          { label: `The × sits at the far right of its row`, test: (doc) => { const li = doc.querySelector(".rune"), b = li.querySelector(".banish-button"); const d = Math.abs(li.getBoundingClientRect().right - b.getBoundingClientRect().right); return d < 2 || `The button is ${Math.round(d)}px from the right edge`; } }
        ],
        hints: [
          `Flex goes on the row (the parent), not on the name or the button.`,
          `Four properties belong to the row; one belongs to the button.`,
          `If the button isn't at the far right, check which property spreads the children apart.`
        ],
        familiar: {
          lang: "css", search: "CSS flexbox justify-content align-items",
          code: `.inventory-row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
}
.coin {
  flex-grow: 1;
}`
        }
      },
      {
        id: "illusion", title: "Minor Illusion", kind: "css", page: PAGE_FULL, baseCss: "body { font-family: Georgia, serif; margin: 16px; } #spell-list { list-style-type: none; padding-left: 0; } .rune { display: flex; justify-content: space-between; align-items: center; gap: 12px; }",
        request: `A forgotten spell fades. In the row with the class <code class="inline">forgotten</code>, cross out <strong>only the spell's name</strong> (<code class="inline">.rune-name</code>) and set its opacity to <code class="inline">0.6</code>. The button and the other spells stay untouched.`,
        syntax: [
          { rune: `.parent .child { }`, does: `<strong>Descendant selector</strong>: the space means "inside". Selects a <code class="inline">.child</code> that is inside a <code class="inline">.parent</code>. Read it right to left.`, gives: `—` },
          { rune: `.a.b { }`, does: `(Not this one.) No space = one element that has <em>both</em> classes.`, gives: `—` },
          { rune: `text-decoration: line-through;`, does: `Draws a line through text.`, gives: `—` },
          { rune: `opacity: 0.6;`, does: `How solid it looks: 1 = fully solid, 0 = invisible.`, gives: `—` }
        ],
        starter: `/* Rule 1: a .rune-name inside a .forgotten — line-through, opacity 0.6 */

`,
        checks: [
          { label: `The forgotten spell's name is crossed out`, test: (doc, win) => { const v = H.css(win, doc.querySelector(".forgotten .rune-name")).textDecorationLine; return v.includes("line-through") || `Found text-decoration on the name: ${v}`; } },
          { label: `The forgotten spell's name has opacity 0.6`, test: (doc, win) => { const v = H.css(win, doc.querySelector(".forgotten .rune-name")).opacity; return v === "0.6" || `Found opacity on the name: ${v}`; } },
          { label: `The other spells' names are untouched`, test: (doc, win) => { const bad = Array.from(doc.querySelectorAll(".rune:not(.forgotten) .rune-name")).filter(n => H.css(win, n).textDecorationLine !== "none" || H.css(win, n).opacity !== "1").length; return bad === 0 || `${bad} other spell name(s) changed too`; } },
          { label: `The forgotten row's button is untouched`, test: (doc, win) => { const b = doc.querySelector(".forgotten .banish-button"); const ok = H.css(win, b).opacity === "1" && H.css(win, doc.querySelector(".forgotten")).opacity === "1"; return ok || `The whole row faded, not just the name`; } }
        ],
        hints: [
          `Target the name inside a forgotten row, not the row itself.`,
          `Your selector needs two class names. What goes between them decides whether it means "inside" or "both".`,
          `If the whole row fades, the selector is too wide.`
        ],
        familiar: {
          lang: "css", search: "CSS descendant selector text-decoration",
          code: `.sold-out .price {
  text-decoration: underline;
  opacity: 0.5;
}`
        }
      }
    ]
  },

  // ======================================================================
  {
    id: "conjuration", numeral: "III", title: "Conjuration", theme: "Finding and creating things on the page",
    topic: "DOM", step: "To-do Steps 3–5",
    spells: [
      {
        id: "locate", title: "Locate Object", kind: "dom", page: PAGE_EMPTY,
        request: `Find the three parts of the practice page and keep each in its own box: the form in <code class="inline">spellForm</code>, the text input in <code class="inline">spellInput</code>, and the list in <code class="inline">spellList</code>. Use <code class="inline">const</code>.`,
        syntax: [
          { rune: `document.querySelector("#id")`, does: `Searches the page with a CSS selector (<code class="inline">#</code> for an id, <code class="inline">.</code> for a class).`, gives: `The first matching element, or <code class="inline">null</code> if nothing matches` },
          { rune: `const name = …;`, does: `Makes a box that keeps the same thing.`, gives: `—` }
        ],
        starter: `// Line 1: const spellForm = the element with id spell-form
// Line 2: const spellInput = the element with id spell-name
// Line 3: const spellList = the element with id spell-list

`,
        checks: [
          { label: `spellForm holds the form`, run: (win, doc) => { const v = H.g(win, "spellForm"); return v === doc.querySelector("#spell-form") || (v === undefined ? `spellForm doesn't exist` : `spellForm holds ${v === null ? "null" : "something else"}`); } },
          { label: `spellInput holds the text input`, run: (win, doc) => { const v = H.g(win, "spellInput"); return v === doc.querySelector("#spell-name") || (v === undefined ? `spellInput doesn't exist` : `spellInput holds ${v === null ? "null" : "something else"}`); } },
          { label: `spellList holds the list`, run: (win, doc) => { const v = H.g(win, "spellList"); return v === doc.querySelector("#spell-list") || (v === undefined ? `spellList doesn't exist` : `spellList holds ${v === null ? "null" : "something else"}`); } },
          { label: `All three boxes use const`, src: (code) => ["spellForm", "spellInput", "spellList"].every(n => new RegExp("const\\s+" + n + "\\b").test(code)) || `Make each box with const` }
        ],
        hints: [
          `One box per element: three lines, all the same shape.`,
          `The selector text works like CSS. Look at the practice page to find each id.`,
          `If a box holds null, the selector didn't match: compare its spelling with the page, letter by letter.`
        ],
        familiar: {
          lang: "js", search: "JavaScript document.querySelector",
          code: `const frontDoor = document.querySelector("#front-door");
const firstSign = document.querySelector(".tavern-sign");`
        }
      },
      {
        id: "elemental", title: "Conjure Minor Elemental", kind: "dom", page: PAGE_EMPTY,
        setup: `const spellList = document.querySelector("#spell-list");`,
        setupNote: `Already in your spellbook (from Locate Object). Use spellList; don't rewrite it.`,
        request: `Write <code class="inline">summonRune</code>. It takes <code class="inline">name</code>, creates a new list item with the class <code class="inline">rune</code> whose text is the name, and puts it at the end of <code class="inline">spellList</code>.`,
        syntax: [
          { rune: `document.createElement("li")`, does: `Makes a new element. It is <strong>not on the page yet</strong>.`, gives: `The new element` },
          { rune: `el.classList.add("rune")`, does: `Adds a class. It's a call: <code class="inline">( )</code>, not <code class="inline">=</code>.`, gives: `—` },
          { rune: `el.textContent = text;`, does: `Sets the element's text. A property: uses <code class="inline">=</code>.`, gives: `—` },
          { rune: `parent.appendChild(el)`, does: `Puts <code class="inline">el</code> inside <code class="inline">parent</code>, at the end. Now it's on the page.`, gives: `—` }
        ],
        starter: `// function summonRune(name)
//   Line 1: const rune = a new li element
//   Line 2: add the class "rune" to rune
//   Line 3: set rune's text to name
//   Line 4: put rune inside spellList

`,
        checks: [
          { label: `summonRune("Fire Bolt") adds one item`, run: (win, doc) => { if (typeof H.g(win, "summonRune") !== "function") return `summonRune doesn't exist`; win.summonRune("Fire Bolt"); const n = H.runes(doc).length; return n === 1 || `The list has ${n} items`; } },
          { label: `The item is an li with the class "rune"`, run: (win, doc) => { win.summonRune("Fire Bolt"); const li = doc.querySelector("#spell-list > *"); return (li && li.tagName === "LI" && li.classList.contains("rune")) || (li ? `Found <${li.tagName.toLowerCase()} class="${li.className}">` : `Nothing in the list`); } },
          { label: `The item's text is the name`, run: (win, doc) => { win.summonRune("Fire Bolt"); return H.names(doc)[0] === "Fire Bolt" || `Found: ${H.list(H.names(doc))}`; } },
          { label: `A second cast adds to the end`, run: (win, doc) => { win.summonRune("Fire Bolt"); win.summonRune("Shield"); return H.names(doc).join("|") === "Fire Bolt|Shield" || `Found: ${H.list(H.names(doc))}`; } }
        ],
        hints: [
          `Creating an element doesn't show it. It only appears once you put it inside something that's already on the page.`,
          `Order: create it, decorate it (class, text), then place it.`,
          `If the trials say "nothing in the list", check the last step: what goes inside what?`
        ],
        familiar: {
          lang: "js", search: "JavaScript createElement appendChild classList textContent",
          code: `const menu = document.querySelector("#menu");
const dish = document.createElement("p");
dish.classList.add("special");
dish.textContent = "Mushroom stew";
menu.appendChild(dish);`
        }
      },
      {
        id: "shield", title: "Shield", kind: "dom", page: PAGE_EMPTY,
        setup: `const spellInput = document.querySelector("#spell-name");`,
        setupNote: `Already in your spellbook. Use spellInput; don't rewrite it.`,
        request: `Write <code class="inline">readSpellName</code>. It takes no components. It reads what's typed in <code class="inline">spellInput</code>. If it's empty or only spaces, it clears the input and releases <code class="inline">null</code>. Otherwise it releases what was typed.`,
        syntax: [
          { rune: `input.value`, does: `What's typed in an input. Read it, or set it with <code class="inline">=</code> (<code class="inline">input.value = ""</code> clears it).`, gives: `Text` },
          { rune: `text.trim()`, does: `Removes spaces from both ends. Does <strong>not</strong> change <code class="inline">text</code>.`, gives: `New text` },
          { rune: `return null;`, does: `Leaves the function right away, releasing "nothing on purpose".`, gives: `null` }
        ],
        starter: `// function readSpellName()
//   Line 1: const name = what's typed in spellInput
//   Guard:  if name with its edge spaces trimmed is "":
//             clear spellInput
//             return null
//   Last line: return name

`,
        checks: [
          { label: `"Shield" is released as "Shield"`, run: (win, doc) => { if (typeof H.g(win, "readSpellName") !== "function") return `readSpellName doesn't exist`; H.type(doc, "Shield"); const v = win.readSpellName(); return v === "Shield" || `Released: ${JSON.stringify(v)}`; } },
          { label: `Only spaces releases null`, run: (win, doc) => { H.type(doc, "   "); const v = win.readSpellName(); return v === null || `Released: ${JSON.stringify(v)}`; } },
          { label: `Only spaces also clears the input`, run: (win, doc) => { H.type(doc, "   "); win.readSpellName(); const v = doc.querySelector("#spell-name").value; return v === "" || `The input still holds ${JSON.stringify(v)}`; } },
          { label: `An empty input releases null`, run: (win, doc) => { H.type(doc, ""); const v = win.readSpellName(); return v === null || `Released: ${JSON.stringify(v)}`; } }
        ],
        hints: [
          `Guard first: test the bad case and leave early.`,
          `Trim only for the check. The trimmed text and the original text are two different values.`,
          `Clear the input before you return: nothing after a return runs.`
        ],
        familiar: {
          lang: "js", search: "JavaScript input value trim",
          code: `function readRiddle() {
  const answer = riddleBox.value;
  if (answer.trim().length < 3) {
    return "Too short";
  }
  return answer;
}`
        }
      },
      {
        id: "counterspell", title: "Counterspell", kind: "dom", page: PAGE_EMPTY,
        setup: `const spellForm = document.querySelector("#spell-form");
const spellInput = document.querySelector("#spell-name");
const spellList = document.querySelector("#spell-list");

function summonRune(name) {
  const rune = document.createElement("li");
  rune.classList.add("rune");
  rune.textContent = name;
  spellList.appendChild(rune);
}`,
        setupNote: `Already in your spellbook. Cast summonRune; don't rewrite it.`,
        request: `When the form is submitted (button click <strong>or</strong> Enter), counter the browser's default page reload. Then cast <code class="inline">summonRune</code> with what's typed, and clear the input.`,
        syntax: [
          { rune: `el.addEventListener("submit", (event) => { … });`, does: `Runs the code in <code class="inline">{ }</code> every time the form is submitted. <code class="inline">event</code> is your name for the info about what happened.`, gives: `—` },
          { rune: `event.preventDefault();`, does: `Cancels what the browser would do on its own. For a form: reloading the page.`, gives: `—` }
        ],
        starter: `// Listen: on spellForm, for "submit", with event
//   Line 1: prevent the default reload
//   Line 2: cast summonRune with what's typed in spellInput
//   Line 3: clear spellInput

`,
        checks: [
          { label: `Submitting doesn't reload the page`, run: (win, doc) => { H.type(doc, "Light"); const ev = H.submit(win, doc); return ev.defaultPrevented || `The reload wasn't prevented (does your listener run on "submit"?)`; } },
          { label: `Submitting adds the typed spell`, run: (win, doc) => { H.type(doc, "Light"); H.submit(win, doc); return H.names(doc).join("|") === "Light" || `Found: ${H.list(H.names(doc))}`; } },
          { label: `Submitting clears the input`, run: (win, doc) => { H.type(doc, "Light"); H.submit(win, doc); const v = doc.querySelector("#spell-name").value; return v === "" || `The input still holds ${JSON.stringify(v)}`; } },
          { label: `Two submits add two spells, in order`, run: (win, doc) => { H.type(doc, "Light"); H.submit(win, doc); H.type(doc, "Shield"); H.submit(win, doc); return H.names(doc).join("|") === "Light|Shield" || `Found: ${H.list(H.names(doc))}`; } }
        ],
        hints: [
          `Listen on the form, not the button: both the button and Enter fire the form's submit.`,
          `Stop the reload first, before anything else happens.`,
          `Read what's typed before you clear it.`
        ],
        familiar: {
          lang: "js", search: "JavaScript addEventListener submit preventDefault",
          code: `const doorLink = document.querySelector("#secret-door");
doorLink.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("The door stays shut.");
});`
        }
      }
    ]
  },

  // ======================================================================
  {
    id: "wards", numeral: "IV", title: "Wards & Glyphs", theme: "Magic that reacts when touched",
    topic: "Events", step: "To-do Steps 6–7b",
    spells: [
      {
        id: "light", title: "Light", kind: "dom", page: PAGE_FULL,
        setup: `const spellList = document.querySelector("#spell-list");`,
        setupNote: `Already in your spellbook. Each spell row is <li class="rune"> with a <span class="rune-name"> and a <button class="banish-button">.`,
        request: `With <strong>one listener on spellList</strong>: when a spell's name is clicked, toggle the class <code class="inline">mastered</code> on its row (the <code class="inline">li</code>). Clicks anywhere else change nothing.`,
        syntax: [
          { rune: `event.target`, does: `The exact element that was clicked (not the one with the listener).`, gives: `An element` },
          { rune: `el.classList.contains("x")`, does: `Asks "does it have this class?"`, gives: `true or false` },
          { rune: `el.classList.toggle("x")`, does: `Adds the class if it's missing, removes it if it's there.`, gives: `—` },
          { rune: `el.parentElement`, does: `The element directly around this one.`, gives: `An element` }
        ],
        starter: `// Listen: on spellList, for "click", with event
//   If the clicked element has the class "rune-name":
//     toggle "mastered" on the clicked element's parent

`,
        checks: [
          { label: `Clicking a name marks its row mastered`, run: (win, doc) => { H.click(win, doc.querySelectorAll(".rune-name")[0]); return H.runes(doc)[0].classList.contains("mastered") || `The row didn't get "mastered"`; } },
          { label: `Clicking it again un-marks it`, run: (win, doc) => { const n = doc.querySelectorAll(".rune-name")[0]; H.click(win, n); H.click(win, n); return !H.runes(doc)[0].classList.contains("mastered") || `The row is still "mastered"`; } },
          { label: `Only the clicked row changes`, run: (win, doc) => { H.click(win, doc.querySelectorAll(".rune-name")[1]); const m = H.runes(doc).map(li => li.classList.contains("mastered")); return m.join() === "false,true,false" || `Mastered rows: ${m.map((x, i) => x ? i + 1 : null).filter(Boolean).join(", ") || "none"}`; } },
          { label: `Clicking the list itself changes nothing`, run: (win, doc) => { const ul = doc.querySelector("#spell-list"); H.click(win, ul); const any = doc.querySelectorAll(".mastered").length; return (any === 0 && !ul.classList.contains("mastered")) || `Something got "mastered"`; } }
        ],
        hints: [
          `One listener on the list hears clicks on everything inside it, because clicks bubble up.`,
          `First ask what was clicked. If it isn't a spell's name, do nothing.`,
          `The click lands on the name, but the class belongs on the row. How are those two elements related?`
        ],
        familiar: {
          lang: "js", search: "JavaScript event.target classList toggle parentElement",
          code: `shelf.addEventListener("click", (event) => {
  const clicked = event.target;
  console.log(clicked.classList.contains("potion")); // true or false
  clicked.parentElement.classList.add("checked");
});`
        }
      },
      {
        id: "banishment", title: "Banishment", kind: "dom", page: PAGE_FULL,
        setup: `const spellList = document.querySelector("#spell-list");`,
        setupNote: `Already in your spellbook. Each spell row is <li class="rune"> with a <span class="rune-name"> and a <button class="banish-button">.`,
        request: `With one listener on <code class="inline">spellList</code>: when a <code class="inline">×</code> button (<code class="inline">banish-button</code>) is clicked, remove its whole spell row. Other clicks remove nothing.`,
        syntax: [
          { rune: `el.remove()`, does: `Takes the element (and everything inside it) off the page.`, gives: `—` }
        ],
        starter: `// Listen: on spellList, for "click", with event
//   If the clicked element has the class "banish-button":
//     remove the clicked element's parent

`,
        checks: [
          { label: `Banishing Shield removes only Shield`, run: (win, doc) => { H.click(win, doc.querySelectorAll(".banish-button")[1]); return H.names(doc).join("|") === "Fire Bolt|Light" || `Left: ${H.list(H.names(doc))}`; } },
          { label: `The whole row goes, not just the button`, run: (win, doc) => { H.click(win, doc.querySelectorAll(".banish-button")[1]); return H.runes(doc).length === 2 || `${H.runes(doc).length} rows left`; } },
          { label: `Clicking a name removes nothing`, run: (win, doc) => { H.click(win, doc.querySelectorAll(".rune-name")[0]); return H.runes(doc).length === 3 || `${H.runes(doc).length} rows left`; } },
          { label: `Clicking the list itself removes nothing`, run: (win, doc) => { H.click(win, doc.querySelector("#spell-list")); return (doc.querySelector("#spell-list") && H.runes(doc).length === 3) || `Something was removed`; } }
        ],
        hints: [
          `Same shape as Light: one listener, then ask what was clicked.`,
          `Remove the row, not the button.`,
          `If the list itself disappears, the remove ran on the wrong element: check your if.`
        ],
        familiar: {
          lang: "js", search: "JavaScript element remove()",
          code: `const oldNotice = document.querySelector(".expired");
oldNotice.remove();`
        }
      },
      {
        id: "glyph", title: "Glyph of Warding", kind: "dom", page: PAGE_FULL,
        setup: `const spellList = document.querySelector("#spell-list");`,
        setupNote: `Already in your spellbook. Each spell row is <li class="rune"> with a <span class="rune-name"> and a <button class="banish-button">.`,
        request: `One glyph reacts to everything that crosses it. With <strong>exactly one listener</strong> on <code class="inline">spellList</code>: a <code class="inline">×</code> button click removes its row; a name click toggles <code class="inline">mastered</code> on its row; any other click does nothing.`,
        syntax: [
          { rune: `if (…) { } else if (…) { } else { }`, does: `Asks questions in order and runs only the <strong>first</strong> branch whose answer is true. <code class="inline">else</code> catches everything left.`, gives: `—` }
        ],
        starter: `// Listen (only once!): on spellList, for "click", with event
//   If the clicked element has "banish-button":
//     remove its parent
//   Else if the clicked element has "rune-name":
//     toggle "mastered" on its parent
//   Else:
//     return

`,
        checks: [
          { label: `Only one listener is used`, src: (code) => (H.stripJsComments(code).match(/addEventListener/g) || []).length === 1 || `Found ${(H.stripJsComments(code).match(/addEventListener/g) || []).length} addEventListener calls` },
          { label: `A × click removes its row`, run: (win, doc) => { H.click(win, doc.querySelectorAll(".banish-button")[0]); return H.names(doc).join("|") === "Shield|Light" || `Left: ${H.list(H.names(doc))}`; } },
          { label: `A name click toggles mastered`, run: (win, doc) => { H.click(win, doc.querySelectorAll(".rune-name")[2]); return H.runes(doc)[2].classList.contains("mastered") || `The row didn't get "mastered"`; } },
          { label: `Other clicks change nothing`, run: (win, doc) => { H.click(win, doc.querySelector("#spell-list")); return (H.runes(doc).length === 3 && doc.querySelectorAll(".mastered").length === 0) || `Something changed`; } }
        ],
        hints: [
          `One listener, several questions, asked in order.`,
          `Each branch handles one kind of click. Anything else falls through to the end.`,
          `The insides of Light and Banishment become the two branches.`
        ],
        familiar: {
          lang: "js", search: "JavaScript if else if else",
          code: `if (weather === "rain") {
  cloak = "wool";
} else if (weather === "sun") {
  cloak = "linen";
} else {
  return;
}`
        }
      }
    ]
  },

  // ======================================================================
  {
    id: "evocation", numeral: "V", title: "Evocation", theme: "Spells that take components and release effects",
    topic: "Functions", step: "To-do Step 8c-1",
    spells: [
      {
        id: "spark", title: "Fire Bolt", kind: "js", mode: "slots",
        request: `Write a spell named <code class="inline">fireBolt</code>. It takes one component, <code class="inline">target</code>, and releases the message <code class="inline">Fire Bolt hits &lt;target&gt;!</code>`,
        components: [{ name: "target", desc: "Who the bolt hits, as text. Example: \"goblin\"." }],
        syntax: [
          { rune: `function name(component) { … }`, does: `Defines a spell. Components go in the <code class="inline">( )</code>.`, gives: `—` },
          { rune: `return …;`, does: `Releases the effect and ends the spell.`, gives: `The value after it` },
          { rune: `"text" + box + "text"`, does: `Joins text and boxes into one text.`, gives: `New text` }
        ],
        template: [{ t: "function " }, { slot: "name", ph: "spell name", w: 10 }, { t: "(" }, { slot: "params", ph: "component", w: 9 }, { t: ") {\n  return " }, { slot: "ret", ph: "the message", w: 30 }, { t: ";\n}" }],
        tests: [{ call: 'fireBolt("goblin")', expected: "Fire Bolt hits goblin!" }, { call: 'fireBolt("the slime")', expected: "Fire Bolt hits the slime!" }],
        hints: [
          `The spell name comes straight from the request. The trials cast it exactly as written, capitals included.`,
          `One component means one name inside the ( ).`,
          `Compare Wanted and Got character by character: spaces and the ! count.`
        ],
        familiar: { lang: "js", search: "JavaScript function return string concatenation", code: `function greet(name) {\n  return "Hello, " + name + "!";\n}` }
      },
      {
        id: "fireball", title: "Fireball", kind: "js", mode: "slots",
        request: `Write <code class="inline">fireball</code>. It takes two components, <code class="inline">target</code> and <code class="inline">intensity</code>. Damage is intensity times 10. It releases <code class="inline">Fireball hits &lt;target&gt; for &lt;damage&gt; damage</code>`,
        components: [{ name: "target", desc: "Who gets hit, as text." }, { name: "intensity", desc: "A number from 1 to 10." }],
        syntax: [
          { rune: `(a, b)`, does: `Two components, separated by a comma. Filled by order when cast.`, gives: `—` },
          { rune: `a * b`, does: `Multiplies.`, gives: `A number` }
        ],
        template: [{ t: "function " }, { slot: "name", ph: "spell name", w: 10 }, { t: "(" }, { slot: "params", ph: "two components", w: 18 }, { t: ") {\n  const damage = " }, { slot: "calc", ph: "the math", w: 14 }, { t: ";\n  return " }, { slot: "ret", ph: "the message", w: 44 }, { t: ";\n}" }],
        tests: [{ call: 'fireball("goblin", 3)', expected: "Fireball hits goblin for 30 damage" }, { call: 'fireball("the dragon", 10)', expected: "Fireball hits the dragon for 100 damage" }, { call: 'fireball("a rat", 1)', expected: "Fireball hits a rat for 10 damage" }],
        hints: [
          `Components go in the order the request lists them.`,
          `The working step only needs the component that holds the number.`,
          `The message has five pieces: text, target, text, damage, text.`
        ],
        familiar: { lang: "js", search: "JavaScript multiply string concatenation", code: `const total = price * 3;\nreturn "Total: " + total + " coins";` }
      },
      {
        id: "heal", title: "Cure Wounds", kind: "js", mode: "free",
        request: `Write <code class="inline">cureWounds</code>. It takes <code class="inline">target</code> and <code class="inline">amount</code>. If amount is 0 or less, the spell releases <code class="inline">The spell fizzles.</code> Otherwise it releases <code class="inline">&lt;target&gt; heals &lt;amount&gt; HP</code>`,
        components: [{ name: "target", desc: "Who gets healed, as text." }, { name: "amount", desc: "A number. Could be 0 or negative." }],
        syntax: [
          { rune: `if (condition) { return …; }`, does: `A guard: if the condition is true, release early and stop.`, gives: `—` },
          { rune: `a <= b`, does: `"Less than or equal to".`, gives: `true or false` }
        ],
        starter: `// function cureWounds(target, amount)
//   Guard: if amount is 0 or less, return "The spell fizzles."
//   Last line: return <target> heals <amount> HP

`,
        tests: [{ call: 'cureWounds("the knight", 25)', expected: "the knight heals 25 HP" }, { call: 'cureWounds("the knight", 0)', expected: "The spell fizzles." }, { call: 'cureWounds("the archer", -5)', expected: "The spell fizzles." }, { call: 'cureWounds("the archer", 1)', expected: "the archer heals 1 HP" }],
        hints: [
          `Test the bad case first and leave early, like your blank-task check.`,
          `"0 or less" includes 0: watch the trial with 0.`,
          `Nothing below a return runs, so the normal message can be the last line.`
        ],
        familiar: { lang: "js", search: "JavaScript if return guard clause", code: `if (gold <= 0) {\n  return "You are broke.";\n}\nreturn "You have " + gold + " gold";` }
      },
      {
        id: "bolt", title: "Chromatic Orb", kind: "js", mode: "free",
        setup: 'function channel(element) {\n  return element + " energy";\n}',
        setupNote: 'Base spell already in your spellbook. Cast it inside your new spell; don\'t rewrite it.',
        request: `Write <code class="inline">chromaticOrb</code>. It takes <code class="inline">target</code> and <code class="inline">element</code>. It casts the base spell <code class="inline">channel</code> on the element, then releases <code class="inline">&lt;channel result&gt; strikes &lt;target&gt;!</code>`,
        components: [{ name: "target", desc: "Who gets struck, as text." }, { name: "element", desc: "Text like \"frost\" or \"storm\"." }],
        mustInclude: "channel(",
        syntax: [
          { rune: `otherSpell(value)`, does: `Casts another function. What it releases comes back, like any value.`, gives: `Whatever that function returns` }
        ],
        starter: `// function chromaticOrb(target, element)
//   Line 1: const power = channel cast with element
//   Line 2: return <power> strikes <target>!

`,
        tests: [{ call: 'chromaticOrb("the slime", "frost")', expected: "frost energy strikes the slime!" }, { call: 'chromaticOrb("the golem", "storm")', expected: "storm energy strikes the golem!" }],
        hints: [
          `Casting a spell inside another spell is just calling a function.`,
          `Catch the base spell's result in a box first, then build the message from that box.`,
          `The base spell already adds " energy". Don't add it again.`
        ],
        familiar: { lang: "js", search: "JavaScript call a function inside a function", code: `const greeting = makeGreeting(name);\nreturn greeting + ", welcome!";` }
      },
      {
        id: "chain", title: "Chain Lightning", kind: "js", mode: "free",
        request: `Write <code class="inline">chainLightning</code>. It takes one component, <code class="inline">enemies</code>: an array of enemy objects like <code class="inline">{ name: "goblin", hp: 8 }</code>. Lightning defeats every enemy with 10 HP or less. It releases <code class="inline">Lightning defeats &lt;count&gt; of &lt;total&gt; enemies</code>`,
        components: [{ name: "enemies", desc: "An array of objects, each with a name and an hp number. Could be empty." }],
        syntax: [
          { rune: `for (let item of array) { … }`, does: `Runs once per item; <code class="inline">item</code> is your name for the current one.`, gives: `—` },
          { rune: `obj.key`, does: `Reads one value from an object.`, gives: `That value` },
          { rune: `array.length`, does: `How many items. No <code class="inline">( )</code>.`, gives: `A number` }
        ],
        starter: `// function chainLightning(enemies)
//   Line 1: let defeated = 0
//   Loop: for each enemy of enemies:
//           if the enemy's hp is 10 or less: add 1 to defeated
//   Last line: return Lightning defeats <defeated> of <how many enemies> enemies

`,
        tests: [
          { call: 'chainLightning([{ name: "goblin", hp: 8 }, { name: "ogre", hp: 40 }, { name: "bat", hp: 5 }])', expected: "Lightning defeats 2 of 3 enemies" },
          { call: 'chainLightning([{ name: "imp", hp: 10 }])', expected: "Lightning defeats 1 of 1 enemies" },
          { call: 'chainLightning([{ name: "dragon", hp: 200 }])', expected: "Lightning defeats 0 of 1 enemies" },
          { call: 'chainLightning([])', expected: "Lightning defeats 0 of 0 enemies" }
        ],
        hints: [
          `This is your counter pattern from algorithm Problem 2: start at 0, loop, add 1 when a condition is true.`,
          `"10 or less" includes 10: the imp counts.`,
          `The total is how many enemies there are, not how many were defeated.`
        ],
        familiar: { lang: "js", search: "JavaScript for of loop object property", code: `let cheap = 0;\nfor (let item of cart) {\n  if (item.price < 5) {\n    cheap += 1;\n  }\n}\nreturn cheap + " of " + cart.length;` }
      }
    ]
  },

  // ======================================================================
  {
    id: "archive", numeral: "VI", title: "The Archive", theme: "Preserving and restoring",
    topic: "Objects, arrays, localStorage", step: "To-do Step 8",
    spells: [
      {
        id: "familiar", title: "Summon Steed", kind: "js", mode: "slots",
        request: `Write <code class="inline">summonSteed</code>. It takes <code class="inline">name</code> and <code class="inline">kind</code>, and releases a steed <strong>object</strong> with three keys: <code class="inline">name</code>, <code class="inline">kind</code>, and <code class="inline">loyal</code> (always the boolean true).`,
        components: [{ name: "name", desc: "The steed's name, as text. Example: \"Swiftwind\"." }, { name: "kind", desc: "What it is, as text. Example: \"pegasus\"." }],
        syntax: [
          { rune: `{ key: value, key2: value2 }`, does: `Builds a new object. Keys have no quotes. Pairs are separated by commas.`, gives: `The object` },
          { rune: `true / false`, does: `Booleans. No quotes: <code class="inline">"true"</code> with quotes is text.`, gives: `—` }
        ],
        template: [{ t: "function " }, { slot: "name", ph: "spell name", w: 12 }, { t: "(" }, { slot: "params", ph: "two components", w: 14 }, { t: ") {\n  return " }, { slot: "obj", ph: "the object", w: 40 }, { t: ";\n}" }],
        tests: [
          { call: 'summonSteed("Swiftwind", "pegasus").name', expected: "Swiftwind" },
          { call: 'summonSteed("Swiftwind", "pegasus").kind', expected: "pegasus" },
          { call: 'summonSteed("Ember", "fire horse").loyal', expected: true },
          { call: 'typeof summonSteed("Ember", "fire horse").loyal', expected: "boolean" }
        ],
        hints: [
          `Each key gets its value from the component with the same meaning.`,
          `Values that are components have no quotes: JavaScript uses what's inside the box.`,
          `The last trial checks that loyal is a real boolean, not text.`
        ],
        familiar: { lang: "js", search: "JavaScript object literal", code: `return { title: bookName, pages: count, read: false };` }
      },
      {
        id: "satchel", title: "Bag of Holding", kind: "js", mode: "free",
        request: `Write <code class="inline">packBag</code>. It takes <code class="inline">bag</code> (an array) and <code class="inline">item</code> (text). It adds an object <code class="inline">{ item: &lt;item&gt;, used: false }</code> to the end of the bag, then releases how many things are in the bag now.`,
        components: [{ name: "bag", desc: "An array of item objects. Could be empty." }, { name: "item", desc: "The new item's name, as text." }],
        syntax: [
          { rune: 'array.push(thing)', does: 'Adds <code class="inline">thing</code> to the end of the array. Changes the array itself.', gives: '(not needed here)' },
          { rune: 'array.length', does: 'How many things are in the array. No <code class="inline">( )</code>: it\'s a property, not a call.', gives: 'A number' }
        ],
        starter: "// function packBag(bag, item)\n//   Line 1: push a new object into bag (item: the item, used: false)\n//   Line 2: return bag's length\n\n",
        tests: [
          { call: 'packBag([], "potion")', expected: 1 },
          { call: 'packBag([{ item: "rope", used: false }], "torch")', expected: 2 },
          { call: '(() => { const b = []; packBag(b, "ether"); return b[0].item; })()', expected: "ether" },
          { call: '(() => { const b = []; packBag(b, "ether"); return b[0].used; })()', expected: false }
        ],
        hints: [
          `The object you push can be built right inside the push's ( ).`,
          `"How many things" means after the push, not before.`,
          `If the count is right but the item trials fail, check the object's keys against the request.`
        ],
        familiar: { lang: "js", search: "JavaScript array push length", code: `inventory.push({ name: itemName, equipped: false });\nreturn inventory.length;` }
      },
      {
        id: "seal", title: "Clone", kind: "js", mode: "free", hiddenSetup: VAULT,
        request: `Write <code class="inline">cloneQuests</code>. It takes <code class="inline">quests</code>, an array of quest objects, and stores a copy in <code class="inline">localStorage</code> under the key <code class="inline">"quests"</code>, to bring back later. It doesn't need to release anything.<br><br>Here <code class="inline">localStorage</code> is a practice vault: it works like the real one (text only!) and is wiped after each trial.`,
        components: [{ name: "quests", desc: "An array of objects like { text: \"Slay slime\", completed: false }." }],
        mustInclude: "JSON.stringify(",
        syntax: [
          { rune: 'JSON.stringify(thing)', does: 'Makes a text copy of an array or object. Does <strong>not</strong> change <code class="inline">thing</code>: catch the result in a box.', gives: 'Text' },
          { rune: 'localStorage.setItem(key, text)', does: 'Saves the text under the key. 1st slot = key, 2nd slot = text.', gives: '(nothing)' }
        ],
        starter: "// function cloneQuests(quests)\n//   Line 1: const text = quests turned into text\n//   Line 2: save text in localStorage under the key \"quests\"\n//   (Optional: these 2 lines can be 1.\n//    Put line 1's right side into line 2's slot.)\n\n",
        tests: [
          { call: '(() => { cloneQuests([{ text: "Slay slime", completed: false }]); return localStorage.getItem("quests"); })()', expected: '[{"text":"Slay slime","completed":false}]' },
          { call: '(() => { cloneQuests([{ text: "Feed Flora", completed: true }, { text: "Study", completed: false }]); return localStorage.getItem("quests"); })()', expected: '[{"text":"Feed Flora","completed":true},{"text":"Study","completed":false}]' },
          { call: '(() => { cloneQuests([]); return localStorage.getItem("quests"); })()', expected: "[]" }
        ],
        hints: [
          `If a trial shows [object Object], you stored the array itself. The vault only keeps text.`,
          `Turn into text first, then store. Two steps, in that order.`,
          `The key is the 1st slot and is text, so it needs quotes.`
        ],
        familiar: { lang: "js", search: "JavaScript JSON.stringify localStorage setItem", code: `const saved = JSON.stringify(inventory);\nlocalStorage.setItem("inventory", saved);` }
      },
      {
        id: "unseal", title: "Revivify", kind: "js", mode: "free", hiddenSetup: VAULT,
        request: `Write <code class="inline">revivifyQuests</code>. It takes no components. It reads the copy stored under the key <code class="inline">"quests"</code>, brings it back to life as a real array, and releases that array.<br><br>Each trial puts a stored copy in the practice vault first, then casts your spell.`,
        components: [],
        mustInclude: "JSON.parse(",
        syntax: [
          { rune: 'localStorage.getItem(key)', does: 'Reads what was saved under the key.', gives: 'Text (or <code class="inline">null</code> if nothing was saved)' },
          { rune: 'JSON.parse(text)', does: 'Makes a real array or object from the text. Does <strong>not</strong> change <code class="inline">text</code>: the result comes back, so return it or catch it in a box.', gives: 'An array or object' }
        ],
        starter: "// function revivifyQuests()\n//   Line 1: const text = what's saved under the key \"quests\"\n//   Line 2: return text turned into an array\n//   (JSON.parse gives back the array;\n//    return releases it.)\n\n",
        tests: [
          { call: '(() => { localStorage.setItem("quests", \'[{"text":"Feed Flora","completed":true}]\'); return revivifyQuests()[0].text; })()', expected: "Feed Flora" },
          { call: '(() => { localStorage.setItem("quests", \'[{"text":"Feed Flora","completed":true}]\'); return revivifyQuests()[0].completed; })()', expected: true },
          { call: '(() => { localStorage.setItem("quests", \'[{"text":"A","completed":false},{"text":"B","completed":false}]\'); return revivifyQuests().length; })()', expected: 2 }
        ],
        hints: [
          `If a trial gives undefined or a strange length, you released the text, not an array. "[...]"[0] is just the character "[".`,
          `This is Clone in reverse: get the text out first, then turn it back.`,
          `Parsing gives back a new value. Make sure that value is what gets released.`
        ],
        familiar: { lang: "js", search: "JavaScript localStorage getItem JSON.parse", code: `const saved = localStorage.getItem("inventory");\nreturn JSON.parse(saved);` }
      },
      {
        id: "ledger", title: "Detect Magic", kind: "js", mode: "free", hiddenSetup: VAULT,
        request: `Write <code class="inline">detectMagic</code>. It takes no components. It loads the quests stored under <code class="inline">"quests"</code>, counts how many have <code class="inline">completed</code> set to true, and releases <code class="inline">&lt;count&gt; of &lt;total&gt; quests cleared</code>`,
        components: [],
        starter: "// function detectMagic()\n//   Line 1: const text = what's saved under the key \"quests\"\n//   Line 2: const quests = text turned into an array\n//   Line 3: let count = 0\n//   Loop: for each quest of quests, if it's completed, add 1 to count\n//   Last line: return <count> of <total> quests cleared\n\n",
        tests: [
          { call: '(() => { localStorage.setItem("quests", \'[{"text":"Feed Flora","completed":true},{"text":"Study","completed":false},{"text":"Run","completed":true}]\'); return detectMagic(); })()', expected: "2 of 3 quests cleared" },
          { call: '(() => { localStorage.setItem("quests", \'[{"text":"Nap","completed":false}]\'); return detectMagic(); })()', expected: "0 of 1 quests cleared" },
          { call: '(() => { localStorage.setItem("quests", "[]"); return detectMagic(); })()', expected: "0 of 0 quests cleared" }
        ],
        hints: [
          `This is Revivify plus Chain Lightning: load the array first, then count.`,
          `Each quest is an object; completed is already a boolean.`,
          `The total is the array's length, not the count.`
        ],
        familiar: { lang: "js", search: "JavaScript JSON.parse for of count", code: `const items = JSON.parse(localStorage.getItem("inventory"));\nlet equipped = 0;\nfor (let it of items) {\n  if (it.equipped === true) {\n    equipped += 1;\n  }\n}\nreturn equipped + " of " + items.length;` }
      }
    ]
  }
];
