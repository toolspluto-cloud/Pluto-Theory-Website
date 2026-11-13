// Pluto Theory: the chat with Plu (purple, P) and Theo (green, T), from "Pluto Theory Interactive Conversation Script".
// Scripted scenes are word for word (with the mascots' names as Plu and Theo); scenes marked "added" fill in
// buttons the script left open, so no button is a dead end.
// Line: { s: "P"|"T", t: text, rx?: reactions, sticker? }. Choice: [label, SCENE_ID | "ACTION:name"].
// Actions: contact, branding, pr, night, portfolio, services, ai, agents, contactai, contactagents, exit, restart, back, resume.
// The section 08 pop-ups live in popups.js (they show on every page).
(() => {
  const P = (t, x = {}) => ({ s: "P", t, ...x });
  const T = (t, x = {}) => ({ s: "T", t, ...x });
  const MAIN = [
    ["Automate my business", "AI"],
    ["I need branding", "BRANDING"],
    ["PR & publicity", "PR"],
    ["Join Pluto World", "WORLD"],
    ["Just your handsome faces", "FACES"],
    ["Just scrolling", "SCROLLING"],
    ["I've got a story", "STORY"]
  ];
  const MORE = ["Something else", "MENU"];
  const POLL = ["Who's smarter, then?", "POLL"];
  const EXPLORE = ["Explore the site", "ACTION:exit"];

  window.PT_SCENES = {
    // 01 Someone's here!
    OPENING: {
      lines: [
        T("Psst. Plu. Wake up. Someone's here.", { rx: ["whisper"], sticker: "visitor detected 👀" }),
        P("WHAT?! A CLIENT?! Fix your hair!", { rx: ["gasp"] }),
        T("I don't have hair, idiot.", { rx: ["sideEye"] }),
        P("Oh. Right. Hiiii! Welcome to Pluto Theory!", { rx: ["smile"] }),
        T("Look at that smile. Already trying too hard.", { rx: ["smug"] }),
        P("Shut up! I'm making friends!", { rx: ["wiggle"] }),
        T("Okay, human. Why are you here?")
      ],
      choices: MAIN
    },
    // Back to the starting choices
    MENU: {
      lines: [T("Okay, human. What else?"), P("Pick anything! Except leaving!", { rx: ["wiggle"] })],
      choices: MAIN
    },

    // Added: AI automation, agents and chatbots
    AI: {
      lines: [
        P("THEO! They want ROBOTS!", { rx: ["wiggle"] }),
        T("Not robots. Automation. Calm down.", { rx: ["sideEye"] }),
        P("So the computer does the boring stuff?"),
        T("Exactly. Copying, chasing, replying. All the stuff you hate.", { rx: ["smug"] }),
        P("I hate SO much stuff!", { rx: ["dramatic"] }),
        T("We know. So, human. What's eating your team's time?")
      ],
      choices: [["Too much busy work", "AI_BUSY"], ["I want an AI chatbot", "AI_BOT"], ["Is AI actually useful?", "AI_DOUBT"]]
    },
    AI_BUSY: {
      lines: [P("Busy work! Our favourite enemy!", { rx: ["wiggle"] }), T("Leads, follow-ups, invoices, reports. We hand those to AI."), P("And then everyone goes home early!", { rx: ["smile"] }), T("Or does the work that actually needs a human.", { rx: ["smug"] })],
      choices: [["Automate my work", "ACTION:contactai"], ["What can you automate?", "ACTION:ai"], MORE]
    },
    AI_BOT: {
      lines: [P("A chatbot! Can it talk like me?!", { rx: ["gasp"] }), T("Please, no. One of you is enough.", { rx: ["sideEye"] }), P("RUDE.", { rx: ["dramatic"] }), T("It answers from your own info, on your site or WhatsApp, and calls a human when it's stuck.")],
      choices: [["Build my chatbot", "ACTION:contactagents"], ["See AI agents", "ACTION:agents"], MORE]
    },
    AI_DOUBT: {
      lines: [T("Fair question. Some AI is just noise.", { rx: ["smug"] }), P("Not ours! Ours is useful noise!", { rx: ["wiggle"] }), T("We start with one boring task and show it working."), P("Then you decide if you want more!", { rx: ["smile"] })],
      choices: [["Show me one task", "ACTION:contactai"], ["How it works", "ACTION:ai"], MORE]
    },

    // 02 I need branding
    BRANDING: {
      lines: [
        P("THEO! We got a branding client!", { rx: ["wiggle"] }),
        T("Relax. They clicked a button, not signed a contract.", { rx: ["sideEye"] }),
        P("I can already see the logo!", { rx: ["smile"] }),
        T("You haven't even asked what the brand is."),
        P("Oops. Soooo... what's your brand called?"),
        T("Please don't say Pluto Two.", { rx: ["smug"] })
      ],
      choices: [["It's a new brand", "BRAND_NEW"], ["My brand needs a glow-up", "BRAND_GLOWUP"], ["Don't judge my logo", "BRAND_LOGO"]]
    },
    BRAND_LOGO: {
      lines: [T("Too late. I'm judging.", { rx: ["smug"] }), P("YOU HAVEN'T SEEN IT!", { rx: ["gasp"] }), T("I'm warming up."), P("Ignore him. Show us!", { rx: ["smile"] })],
      choices: [["Show you my logo", "ACTION:contact"], ["See your branding work", "ACTION:branding"], MORE]
    },
    BRAND_NEW: { // added
      lines: [P("A NEW BRAND! I love new things!", { rx: ["wiggle"] }), T("Calm down. It needs a name first."), P("And a look! And a voice!", { rx: ["smile"] }), T("Fine. That part we're actually good at.", { rx: ["smug"] })],
      choices: [["Let's build it", "ACTION:contact"], ["How does branding work?", "ACTION:branding"], MORE]
    },
    BRAND_GLOWUP: { // added
      lines: [P("Glow-up time! Lights! Mirror! Confetti!", { rx: ["wiggle"] }), T("Start smaller. Like a logo that isn't from 2009.", { rx: ["sideEye"] }), P("Every brand deserves a second chance!"), T("And a font that isn't Comic Sans.", { rx: ["smug"] })],
      choices: [["Fix my brand", "ACTION:contact"], ["See how you do it", "ACTION:branding"], MORE]
    },

    // 03 PR & publicity
    PR: {
      lines: [
        P("OHHH! Someone wants to be FAMOUS!", { rx: ["gasp"] }),
        T("Plu. PR isn't always about being famous.", { rx: ["sideEye"] }),
        P("Then why do you keep asking me to take your pictures?"),
        T("Because you keep cutting my head out."),
        P("You have a very big head!", { rx: ["wiggle"] }),
        T("It's called having a brain.", { rx: ["smug"] })
      ],
      choices: [["Make some noise", "PR_NOISE"], ["Keep it classy", "PR_CLASSY"], ["Just exploring PR", "PR_EXPLORE"]]
    },
    PR_NOISE: {
      lines: [P("LOUD OR VERY LOUD?!", { rx: ["wiggle"] }), T("Please don't give Plu a microphone."), P("TOO LATE! HELLOOOOO!", { rx: ["dramatic"] }), T("We just lost three neighbours.", { rx: ["facepalm"] })],
      choices: [["Let's get loud", "ACTION:contact"], ["How Pluto Times works", "ACTION:pr"], MORE]
    },
    PR_CLASSY: { // added
      lines: [T("Finally. Someone with manners.", { rx: ["smug"] }), P("Classy! Like a tiny hat and a big announcement!", { rx: ["smile"] }), T("Like the right story, told to the right people."), P("...with a tiny hat.")],
      choices: [["Tell my story", "ACTION:contact"], ["How Pluto Times works", "ACTION:pr"], MORE]
    },
    PR_EXPLORE: { // added
      lines: [P("Welcome to Pluto Times! Our PR desk!", { rx: ["smile"] }), T("Stories, launches and reputation. No shouting."), P("Some shouting.", { rx: ["wiggle"] }), T("Plu. No.", { rx: ["sideEye"] })],
      choices: [["See Pluto Times", "ACTION:pr"], ["Talk to us about PR", "ACTION:contact"], MORE]
    },

    // 04 Join Pluto World
    WORLD: {
      lines: [
        P("THEO! SOMEONE WANTS TO JOIN OUR WORLD!", { rx: ["wiggle"] }),
        T("Hide the snacks."),
        P("Why?!", { rx: ["gasp"] }),
        T("Last time you shared them, you cried.", { rx: ["smug"] }),
        P("THOSE WERE MY FAVOURITE CHIPS!", { rx: ["dramatic"] }),
        T("Human, welcome to Pluto World. We're weird. You'll fit right in.", { rx: ["smile"] })
      ],
      choices: [["I'm weird too", "WORLD_WEIRD"], ["What is Pluto World?", "WORLD_WHAT"], ["Where are the snacks?", "WORLD_SNACKS"]]
    },
    WORLD_WEIRD: {
      lines: [P("BEST FRIENDS!", { rx: ["wiggle"] }), T("You don't even know their name."), P("FRIENDSHIP DOESN'T NEED PAPERWORK!", { rx: ["dramatic"] }), T("Tell that to our accountant.", { rx: ["smug"] })],
      choices: [["See Pluto Night", "ACTION:night"], ["Say hi properly", "ACTION:contact"], MORE]
    },
    WORLD_WHAT: { // added
      lines: [P("It's our people! Nights, chats, weird ideas!", { rx: ["smile"] }), T("We call the nights Pluto Night. Rooms where people actually meet."), P("And there are snacks!", { rx: ["wiggle"] }), T("Sometimes. Don't promise snacks.", { rx: ["sideEye"] })],
      choices: [["See Pluto Night", "ACTION:night"], ["Count me in", "ACTION:contact"], MORE]
    },
    WORLD_SNACKS: { // added
      lines: [T("Hidden. For everyone's safety.", { rx: ["smug"] }), P("I know where they are!", { rx: ["wiggle"] }), T("That's why they're gone."), P("...I was guarding them. From the inside.", { rx: ["blink"] })],
      choices: [["See Pluto Night", "ACTION:night"], ["Say hi properly", "ACTION:contact"], MORE]
    },

    // 05 Just your handsome faces
    FACES: {
      lines: [
        P("THEO!!! WE HAVE A FAN!", { rx: ["wiggle"] }),
        T("Obviously. Look at me.", { rx: ["smug"] }),
        P("They could be here for ME!"),
        T("Plu, you look like a marshmallow with a jacket.", { rx: ["sideEye"] }),
        P("A CUTE marshmallow!", { rx: ["smile"] }),
        T("Fair.")
      ],
      choices: [["Plu is cuter", "FACES_PLU"], ["Theo has attitude", "FACES_THEO"], ["Both are ridiculous", "FACES_BOTH"]]
    },
    FACES_PLU: {
      lines: [P("I WON! I WON!", { rx: ["wiggle"] }), T("Congratulations. You're officially the office teddy bear.", { rx: ["smug"] })],
      choices: [POLL, MORE, EXPLORE]
    },
    FACES_THEO: {
      lines: [T("Finally. Someone with taste.", { rx: ["smug"] }), P("Taste? You eat cereal without milk!", { rx: ["gasp"] }), T("And I look fabulous doing it.")],
      choices: [POLL, MORE, EXPLORE]
    },
    FACES_BOTH: {
      lines: [P("Awww! They love us!", { rx: ["smile"] }), T("They called us ridiculous.", { rx: ["sideEye"] }), P("SAME THING!", { rx: ["wiggle"] })],
      choices: [POLL, MORE, EXPLORE]
    },

    // 06 Just scrolling
    SCROLLING: {
      lines: [
        P("Oh! Just looking around?", { rx: ["smile"] }),
        T("Plu, stop staring. You're making it weird.", { rx: ["sideEye"] }),
        P("I'm being welcoming!"),
        T("You've been waving for four minutes."),
        P("MY ARM IS STUCK!", { rx: ["gasp"] }),
        T("Human, please scroll. I need to fix this idiot.", { rx: ["facepalm"] })
      ],
      choices: [["Okay, bye", "SCROLL_BYE"], ["Wait, that's funny", "SCROLL_FUNNY"], ["Show me something weird", "SCROLL_WEIRD"]]
    },
    SCROLL_BYE: {
      lines: [P("BYEEEE! COME BACK!", { rx: ["wiggle"] }), T("They're scrolling down, not leaving the country.", { rx: ["smug"] })],
      choices: [["Keep scrolling", "ACTION:exit"], ["Actually, stay", "MENU"]]
    },
    SCROLL_FUNNY: { // added
      lines: [P("THEY THINK WE'RE FUNNY!", { rx: ["wiggle"] }), T("They think YOU'RE funny. Different thing."), P("My arm is still stuck, by the way."), T("I know. I'm enjoying it.", { rx: ["smug"] })],
      choices: [POLL, MORE, ["Keep scrolling", "ACTION:exit"]]
    },
    SCROLL_WEIRD: { // added
      lines: [T("Weird? We have a poll.", { rx: ["smug"] }), P("A VERY SCIENTIFIC POLL!", { rx: ["wiggle"] }), T("It is not scientific.")],
      choices: [["Start the poll", "POLL"], MORE]
    },

    // 07 I've got a story
    STORY: {
      lines: [
        P("Ooooooh! STORY TIME!", { rx: ["wiggle"] }),
        T("Wait. Let me get popcorn."),
        P("Is it a happy story?", { rx: ["smile"] }),
        T("Is it gossip? Please be gossip.", { rx: ["whisper"] }),
        P("THEO!", { rx: ["gasp"] }),
        T("What? I'm emotionally invested already.", { rx: ["smug"] })
      ],
      choices: [["It's about my business", "STORY_BUSINESS"], ["It's embarrassing", "STORY_EMBARRASSING"], ["It's a secret", "STORY_SECRET"]]
    },
    STORY_BUSINESS: { // added
      lines: [P("A business story! My favourite kind!", { rx: ["smile"] }), T("Tell us the real one. Not the pitch deck."), P("We'll listen properly. Promise."), T("Then we'll help you tell it better.")],
      choices: [["Tell you now", "ACTION:contact"], ["See how you tell stories", "ACTION:pr"], MORE]
    },
    STORY_EMBARRASSING: {
      lines: [P("Don't worry! We won't laugh!", { rx: ["smile"] }), T("Speak for yourself.", { rx: ["smug"] }), P("THEO!", { rx: ["gasp"] }), T("Fine. I'll laugh quietly.", { rx: ["whisper"] })],
      choices: [["Tell you anyway", "ACTION:contact"], POLL, MORE]
    },
    STORY_SECRET: {
      lines: [P("We can keep secrets!", { rx: ["smile"] }), T("You told everyone my birthday surprise.", { rx: ["sideEye"] }), P("I WAS EXCITED!", { rx: ["dramatic"] }), T("You told ME.", { rx: ["facepalm"] })],
      choices: [["Tell you anyway", "ACTION:contact"], POLL, MORE]
    },

    // 09 Who's smarter? (mini poll)
    POLL: {
      lines: [P("Hey, human. Quick question.", { rx: ["smile"] }), T("Don't drag innocent people into this.", { rx: ["sideEye"] }), P("Who's the smarter one?"), T("Oh, this should be good.", { rx: ["smug"] })],
      choices: [["Plu", "POLL_PLU"], ["Theo", "POLL_THEO"], ["Neither", "POLL_NEITHER"]]
    },
    POLL_PLU: { lines: [P("YESSS! I KNEW IT!", { rx: ["wiggle"] }), T("They felt sorry for you.", { rx: ["smug"] })], choices: [MORE, ["Start a project", "ACTION:contact"], EXPLORE] },
    POLL_THEO: { lines: [T("Case closed.", { rx: ["smug"] }), P("I DEMAND A RECOUNT!", { rx: ["dramatic"] })], choices: [MORE, ["Start a project", "ACTION:contact"], EXPLORE] },
    POLL_NEITHER: { lines: [T("That was unnecessary.", { rx: ["sideEye"] }), P("I LIKE THIS HUMAN!", { rx: ["wiggle"] })], choices: [MORE, ["Start a project", "ACTION:contact"], EXPLORE] },

    // 08 "When the visitor returns": shown when the chat is reopened or a visit carries on
    WELCOME_BACK: {
      lines: [P("YOU'RE BACK!", { rx: ["wiggle"] }), T("Act normal. Don't make it awkward."), P("I MISSED YOU!", { rx: ["smile"] }), T("And there goes normal.", { rx: ["smug"] })],
      choices: [["Pick up where we left off", "ACTION:resume"], ["Show me the menu", "MENU"], ["Start over", "ACTION:restart"]]
    },

    // Easter eggs: three quick pokes on a face (added)
    POKE_PLUTO: {
      lines: [P("HEY! That tickles!", { rx: ["wiggle"] }), T("Do it again.", { rx: ["smug"] }), P("THEO!", { rx: ["gasp"] })],
      choices: [["Sorry, Plu", "MENU"], EXPLORE]
    },
    POKE_THEORY: {
      lines: [T("Personal space. Look it up.", { rx: ["sideEye"] }), P("Poke me next! Poke me!", { rx: ["wiggle"] }), T("Please don't encourage this.")],
      choices: [["Sorry, Theo", "MENU"], EXPLORE]
    }
  };
})();
