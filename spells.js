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
  }
];
