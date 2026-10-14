// SPELLS: each object is one exercise (tab) in the Spellbook Trainer.
// To add a spell, copy an existing object, change its id, and add it to the list.
const SPELLS = [
  {
    id:"spark", title:"Spark", level:"Apprentice", mode:"slots",
    request:'Write a spell named <code class="inline">spark</code>. It takes one component, <code class="inline">target</code>, and releases the message <code class="inline">Spark hits &lt;target&gt;!</code>',
    components:[{name:"target", desc:"Who the spark hits, as text. Example: \"goblin\"."}],
    fn:"spark",
    template:[{t:"function "},{slot:"name",ph:"spell name",w:10},{t:"("},{slot:"params",ph:"component",w:9},{t:") {\n  return "},{slot:"ret",ph:"the message",w:30},{t:";\n}"}],
    tests:[{call:'spark("goblin")',expected:"Spark hits goblin!"},{call:'spark("the slime")',expected:"Spark hits the slime!"}],
    hints:[
      "The spell name comes straight from the request. The test casts it as <code class=\"inline\">spark(...)</code>, so the names must match exactly.",
      "One component means one name inside the <code class=\"inline\">( )</code>. Use the name the request gives you.",
      "Example with different data: <code class=\"inline\">\"Hello, \" + name + \"!\"</code> joins text, a component and more text. Watch the spaces inside the quotes."
    ]
  },
  {
    id:"fireball", title:"Fireball", level:"Apprentice", mode:"slots",
    request:'Write <code class="inline">fireball</code>. It takes two components, <code class="inline">target</code> and <code class="inline">intensity</code>. Damage is intensity times 10. It releases <code class="inline">Fireball hits &lt;target&gt; for &lt;damage&gt; damage</code>',
    components:[{name:"target", desc:"Who gets hit, as text."},{name:"intensity", desc:"A number from 1 to 10."}],
    fn:"fireball",
    template:[{t:"function "},{slot:"name",ph:"spell name",w:10},{t:"("},{slot:"params",ph:"two components",w:18},{t:") {\n  const damage = "},{slot:"calc",ph:"the math",w:14},{t:";\n  return "},{slot:"ret",ph:"the message",w:44},{t:";\n}"}],
    tests:[{call:'fireball("goblin", 3)',expected:"Fireball hits goblin for 30 damage"},{call:'fireball("the dragon", 10)',expected:"Fireball hits the dragon for 100 damage"},{call:'fireball("a rat", 1)',expected:"Fireball hits a rat for 10 damage"}],
    hints:[
      "Two components go inside the <code class=\"inline\">( )</code>, separated by a comma, in the order the request lists them.",
      "In JavaScript, <code class=\"inline\">*</code> multiplies. The working step uses the component that holds the number.",
      "Example with different data: <code class=\"inline\">\"Total: \" + price + \" coins\"</code>. Your message joins four pieces: text, target, text, damage, text."
    ]
  },
  {
    id:"heal", title:"Mending", level:"Adept", mode:"free",
    request:'Write <code class="inline">heal</code>. It takes <code class="inline">target</code> and <code class="inline">amount</code>. If amount is 0 or less, the spell releases <code class="inline">The spell fizzles.</code> Otherwise it releases <code class="inline">&lt;target&gt; heals &lt;amount&gt; HP</code>',
    components:[{name:"target", desc:"Who gets healed, as text."},{name:"amount", desc:"A number. Could be 0 or negative."}],
    fn:"heal",
    starter:"// function heal(target, amount)\n//   Guard: if amount is 0 or less, return \"The spell fizzles.\"\n//   Otherwise, return: <target> heals <amount> HP\n\n",
    tests:[{call:'heal("the knight", 25)',expected:"the knight heals 25 HP"},{call:'heal("the knight", 0)',expected:"The spell fizzles."},{call:'heal("the archer", -5)',expected:"The spell fizzles."},{call:'heal("the archer", 1)',expected:"the archer heals 1 HP"}],
    hints:[
      "This is a guard clause, like your blank-task check: test the bad case first and <code class=\"inline\">return</code> early. Nothing below a <code class=\"inline\">return</code> runs.",
      "\"0 or less\" is <code class=\"inline\">&lt;=</code> in JavaScript. Watch your test with 0: it should fizzle.",
      "Example with different data:<br><code class=\"inline\">if (gold &lt;= 0) { return \"You are broke.\"; }</code><br><code class=\"inline\">return \"You have \" + gold + \" gold\";</code>"
    ]
  },
  {
    id:"bolt", title:"Elemental Bolt", level:"Adept", mode:"free",
    setup:'function channel(element) {\n  return element + " energy";\n}',
    setupNote:'Base spell already in your spellbook. Cast it inside your new spell; don\'t rewrite it.',
    request:'Write <code class="inline">elementalBolt</code>. It takes <code class="inline">target</code> and <code class="inline">element</code>. It casts the base spell <code class="inline">channel</code> on the element, then releases <code class="inline">&lt;channel result&gt; strikes &lt;target&gt;!</code>',
    components:[{name:"target", desc:"Who gets struck, as text."},{name:"element", desc:"Text like \"frost\" or \"storm\"."}],
    fn:"elementalBolt", mustInclude:"channel(",
    starter:"// function elementalBolt(target, element)\n//   1. Cast channel with the element, and keep its result in a box called power\n//   2. Return: <power> strikes <target>!\n\n",
    tests:[{call:'elementalBolt("the slime", "frost")',expected:"frost energy strikes the slime!"},{call:'elementalBolt("the golem", "storm")',expected:"storm energy strikes the golem!"}],
    hints:[
      "Casting a spell inside another spell is just calling a function: <code class=\"inline\">channel(element)</code> gives back text, like any other value.",
      "Keep the result in a box first: <code class=\"inline\">const power = ...;</code> Then build the message from <code class=\"inline\">power</code>.",
      "Example with different data:<br><code class=\"inline\">const greeting = makeGreeting(name);</code><br><code class=\"inline\">return greeting + \", welcome!\";</code>"
    ]
  },
  {
    id:"chain", title:"Chain Lightning", level:"Archmage", mode:"free",
    request:'Write <code class="inline">chainLightning</code>. It takes one component, <code class="inline">enemies</code>: an array of enemy objects like <code class="inline">{ name: "goblin", hp: 8 }</code>. Lightning defeats every enemy with 10 HP or less. It releases <code class="inline">Lightning defeats &lt;count&gt; of &lt;total&gt; enemies</code>',
    components:[{name:"enemies", desc:"An array of objects, each with a name and an hp number. Could be empty."}],
    fn:"chainLightning",
    starter:"// function chainLightning(enemies)\n//   1. Make a box called defeated and set it to 0\n//   2. For each enemy in enemies:\n//        If the enemy's hp is 10 or less: add 1 to defeated\n//   3. Return: Lightning defeats <defeated> of <how many enemies> enemies\n\n",
    tests:[
      {call:'chainLightning([{ name: "goblin", hp: 8 }, { name: "ogre", hp: 40 }, { name: "bat", hp: 5 }])',expected:"Lightning defeats 2 of 3 enemies"},
      {call:'chainLightning([{ name: "imp", hp: 10 }])',expected:"Lightning defeats 1 of 1 enemies"},
      {call:'chainLightning([{ name: "dragon", hp: 200 }])',expected:"Lightning defeats 0 of 1 enemies"},
      {call:'chainLightning([])',expected:"Lightning defeats 0 of 0 enemies"}
    ],
    hints:[
      "This is your counter pattern from algorithm Problem 2: start at 0, loop, and add 1 when a condition is true. The total is the array's <code class=\"inline\">.length</code>.",
      "Each item is an object, so read its hp slot with a dot: <code class=\"inline\">enemy.hp</code>. \"10 or less\" is <code class=\"inline\">&lt;=</code>, so the imp with exactly 10 counts.",
      "Example with different data:<br><code class=\"inline\">let cheap = 0;</code><br><code class=\"inline\">for (let item of cart) { if (item.price &lt; 5) { cheap += 1; } }</code><br><code class=\"inline\">return cheap + \" of \" + cart.length;</code>"
    ]
  },

  // ===== Scribe tier: objects, arrays and localStorage (added 2026-10-14) =====
  {
    id:"familiar", title:"Summon Familiar", level:"Scribe", mode:"slots",
    request:'Write <code class="inline">summonFamiliar</code>. It takes <code class="inline">name</code> and <code class="inline">kind</code>, and releases a familiar <strong>object</strong> with three keys: <code class="inline">name</code>, <code class="inline">kind</code>, and <code class="inline">loyal</code> (always the boolean true).',
    components:[{name:"name", desc:"The familiar's name, as text. Example: \"Flora\"."},{name:"kind", desc:"What it is, as text. Example: \"golden hound\"."}],
    fn:"summonFamiliar",
    template:[{t:"function "},{slot:"name",ph:"spell name",w:14},{t:"("},{slot:"params",ph:"two components",w:14},{t:") {\n  return "},{slot:"obj",ph:"the object",w:40},{t:";\n}"}],
    tests:[
      {call:'summonFamiliar("Flora", "golden hound").name',expected:"Flora"},
      {call:'summonFamiliar("Flora", "golden hound").kind',expected:"golden hound"},
      {call:'summonFamiliar("Pip", "owl").loyal',expected:true},
      {call:'typeof summonFamiliar("Pip", "owl").loyal',expected:"boolean"}
    ],
    hints:[
      "An object is built with <code class=\"inline\">{ }</code>. Inside: <code class=\"inline\">key: value</code> pairs, separated by commas.",
      "Keys have no quotes. Values that are components have no quotes either: JavaScript uses what's inside the box. <code class=\"inline\">\"true\"</code> with quotes is text, not a boolean; the last trial checks for that.",
      "Example with different data:<br><code class=\"inline\">return { title: bookName, pages: count, read: false };</code>"
    ]
  },
  {
    id:"satchel", title:"Fill the Satchel", level:"Scribe", mode:"free",
    request:'Write <code class="inline">packSatchel</code>. It takes <code class="inline">satchel</code> (an array) and <code class="inline">item</code> (text). It adds an object <code class="inline">{ item: &lt;item&gt;, used: false }</code> to the end of the satchel, then releases how many things are in the satchel now.',
    components:[{name:"satchel", desc:"An array of item objects. Could be empty."},{name:"item", desc:"The new item's name, as text."}],
    fn:"packSatchel",
    starter:"// function packSatchel(satchel, item)\n//   1. Push a new object into satchel: item is the item, used is false\n//   2. Return how many things are in satchel now\n\n",
    tests:[
      {call:'packSatchel([], "potion")',expected:1},
      {call:'packSatchel([{ item: "rope", used: false }], "torch")',expected:2},
      {call:'(() => { const bag = []; packSatchel(bag, "ether"); return bag[0].item; })()',expected:"ether"},
      {call:'(() => { const bag = []; packSatchel(bag, "ether"); return bag[0].used; })()',expected:false}
    ],
    hints:[
      "<code class=\"inline\">arrayName.push(thing)</code> adds <code class=\"inline\">thing</code> to the end. The thing can be an object you build right inside the <code class=\"inline\">( )</code>.",
      "\"How many things\" is the array's <code class=\"inline\">.length</code>, read <strong>after</strong> the push.",
      "Example with different data:<br><code class=\"inline\">inventory.push({ name: itemName, equipped: false });</code><br><code class=\"inline\">return inventory.length;</code>"
    ]
  },
  {
    id:"seal", title:"Seal the Scroll", level:"Scribe", mode:"free",
    hiddenSetup:'const localStorage = (() => { const vault = {}; return { setItem(k, v) { vault[k] = String(v); }, getItem(k) { return k in vault ? vault[k] : null; }, removeItem(k) { delete vault[k]; } }; })();',
    request:'Write <code class="inline">sealScroll</code>. It takes <code class="inline">quests</code>, an array of quest objects, and saves it in <code class="inline">localStorage</code> under the key <code class="inline">"quests"</code>. It doesn\'t need to release anything.<br><br>Here <code class="inline">localStorage</code> is a practice vault: it works like the real one (text only!) and is wiped after each trial.',
    components:[{name:"quests", desc:"An array of objects like { text: \"Slay slime\", completed: false }."}],
    fn:"sealScroll", mustInclude:"JSON.stringify(",
    starter:"// function sealScroll(quests)\n//   1. Turn the quests array into text\n//   2. Save that text in localStorage under the key \"quests\"\n\n",
    tests:[
      {call:'(() => { sealScroll([{ text: "Slay slime", completed: false }]); return localStorage.getItem("quests"); })()',expected:'[{"text":"Slay slime","completed":false}]'},
      {call:'(() => { sealScroll([{ text: "Feed Flora", completed: true }, { text: "Study", completed: false }]); return localStorage.getItem("quests"); })()',expected:'[{"text":"Feed Flora","completed":true},{"text":"Study","completed":false}]'},
      {call:'(() => { sealScroll([]); return localStorage.getItem("quests"); })()',expected:"[]"}
    ],
    hints:[
      "If a trial shows <code class=\"inline\">[object Object]</code>, you saved the array itself. <code class=\"inline\">localStorage</code> only keeps text, so turn the array into text first.",
      "Two built-in pieces: <code class=\"inline\">JSON.stringify(thing)</code> gives back text, and <code class=\"inline\">localStorage.setItem(key, text)</code> saves it. The key is the 1st slot, the text is the 2nd.",
      "Example with different data:<br><code class=\"inline\">const saved = JSON.stringify(inventory);</code><br><code class=\"inline\">localStorage.setItem(\"inventory\", saved);</code>"
    ]
  },
  {
    id:"unseal", title:"Unseal the Scroll", level:"Scribe", mode:"free",
    hiddenSetup:'const localStorage = (() => { const vault = {}; return { setItem(k, v) { vault[k] = String(v); }, getItem(k) { return k in vault ? vault[k] : null; }, removeItem(k) { delete vault[k]; } }; })();',
    request:'Write <code class="inline">unsealScroll</code>. It takes no components. It reads the text saved under the key <code class="inline">"quests"</code>, turns it back into a real array, and releases that array.<br><br>Each trial puts a sealed scroll in the practice vault first, then casts your spell.',
    components:[],
    fn:"unsealScroll", mustInclude:"JSON.parse(",
    starter:"// function unsealScroll()\n//   1. Get the text saved under the key \"quests\"\n//   2. Turn the text back into an array\n//   3. Return the array\n\n",
    tests:[
      {call:'(() => { localStorage.setItem("quests", \'[{"text":"Feed Flora","completed":true}]\'); return unsealScroll()[0].text; })()',expected:"Feed Flora"},
      {call:'(() => { localStorage.setItem("quests", \'[{"text":"Feed Flora","completed":true}]\'); return unsealScroll()[0].completed; })()',expected:true},
      {call:'(() => { localStorage.setItem("quests", \'[{"text":"A","completed":false},{"text":"B","completed":false}]\'); return unsealScroll().length; })()',expected:2}
    ],
    hints:[
      "If a trial gives <code class=\"inline\">undefined</code> or the wrong length, you probably returned the text, not an array. <code class=\"inline\">\"[...]\"[0]</code> is just the character <code class=\"inline\">\"[\"</code>.",
      "Two built-in pieces, the reverse of Seal the Scroll: <code class=\"inline\">localStorage.getItem(key)</code> gives back the saved text, and <code class=\"inline\">JSON.parse(text)</code> turns text back into an array or object.",
      "Example with different data:<br><code class=\"inline\">const saved = localStorage.getItem(\"inventory\");</code><br><code class=\"inline\">return JSON.parse(saved);</code>"
    ]
  },
  {
    id:"ledger", title:"Quest Ledger", level:"Archmage", mode:"free",
    hiddenSetup:'const localStorage = (() => { const vault = {}; return { setItem(k, v) { vault[k] = String(v); }, getItem(k) { return k in vault ? vault[k] : null; }, removeItem(k) { delete vault[k]; } }; })();',
    request:'Write <code class="inline">questLedger</code>. It takes no components. It loads the quests saved under <code class="inline">"quests"</code>, counts how many have <code class="inline">completed</code> set to true, and releases <code class="inline">&lt;count&gt; of &lt;total&gt; quests cleared</code>',
    components:[],
    fn:"questLedger",
    starter:"// function questLedger()\n//   1. Load the quests: get the text, turn it back into an array\n//   2. Make a counter set to 0\n//   3. For each quest: if it's completed, add 1\n//   4. Return: <count> of <total> quests cleared\n\n",
    tests:[
      {call:'(() => { localStorage.setItem("quests", \'[{"text":"Feed Flora","completed":true},{"text":"Study","completed":false},{"text":"Run","completed":true}]\'); return questLedger(); })()',expected:"2 of 3 quests cleared"},
      {call:'(() => { localStorage.setItem("quests", \'[{"text":"Nap","completed":false}]\'); return questLedger(); })()',expected:"0 of 1 quests cleared"},
      {call:'(() => { localStorage.setItem("quests", "[]"); return questLedger(); })()',expected:"0 of 0 quests cleared"}
    ],
    hints:[
      "This is Unseal the Scroll plus Chain Lightning: load the array first, then use your counter pattern on it.",
      "Each quest is an object, so read its slot with a dot: <code class=\"inline\">quest.completed</code>. It's already a boolean, so <code class=\"inline\">quest.completed === true</code> works.",
      "Example with different data:<br><code class=\"inline\">const items = JSON.parse(localStorage.getItem(\"inventory\"));</code><br><code class=\"inline\">let equipped = 0;</code><br><code class=\"inline\">for (let it of items) { if (it.equipped === true) { equipped += 1; } }</code><br><code class=\"inline\">return equipped + \" of \" + items.length;</code>"
    ]
  }
];
