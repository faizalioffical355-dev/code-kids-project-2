const CHAPTERS_DATA = [
  {
    id: "chapter-1",
    title: "🧱 HTML: The Skeleton",
    icon: "bricks",
    sessions: [
      {
        id: "ch1-s1",
        title: "👋 Session 1: Say Hello World!",
        instructions: "Welcome, future coder! Webpages are built with HTML tags. Let's create your first heading using the <h1> tag. Inside the HTML editor, write a heading that says 'Hello World'!",
        hint: "Try typing: <h1>Hello World</h1> in the HTML editor.",
        starterCode: {
          html: "<!-- Type your heading below! -->\n\n",
          css: "body {\n  font-family: 'Courier New', Courier, monospace;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 80vh;\n  margin: 0;\n  background: #fafafa;\n}",
          js: ""
        },
        skills: ["h1-tag", "headings", "structure"],
        validate: (doc, html, css, js) => {
          const h1 = doc.querySelector("h1");
          return h1 && h1.textContent.trim().toLowerCase().includes("hello world");
        }
      },
      {
        id: "ch1-s2",
        title: "📝 Session 2: A paragraph about you",
        instructions: "Awesome! Now let's add a paragraph using the <p> tag below your heading. Write a short sentence inside the <p> tag to tell us about your coding dream, like 'I want to build games!'",
        hint: "Add <p>I want to build games!</p> right under your <h1> tag.",
        starterCode: {
          html: "<h1>My Coding Journey</h1>\n<!-- Type your paragraph below! -->\n",
          css: "body {\n  font-family: sans-serif;\n  padding: 40px;\n  background: #fafafa;\n}",
          js: ""
        },
        skills: ["p-tag", "paragraphs", "text"],
        validate: (doc, html, css, js) => {
          const p = doc.querySelector("p");
          return p && p.textContent.trim().length > 3;
        }
      },
      {
        id: "ch1-s3",
        title: "🔘 Session 3: Add a Magic Button",
        instructions: "Buttons make webpages interactive! Create a clickable button using the <button> tag. Put the text 'Click Me!' inside it.",
        hint: "Add <button>Click Me!</button> at the bottom of your HTML.",
        starterCode: {
          html: "<h1>Magic Buttons</h1>\n<p>Buttons are awesome inputs!</p>\n<!-- Add your button below -->\n",
          css: "body {\n  font-family: sans-serif;\n  padding: 40px;\n  background: #fafafa;\n}\nbutton {\n  padding: 10px 20px;\n  font-size: 16px;\n  cursor: pointer;\n}",
          js: ""
        },
        skills: ["button-tag", "buttons", "interaction"],
        validate: (doc, html, css, js) => {
          const button = doc.querySelector("button");
          return button && button.textContent.trim().toLowerCase().includes("click me");
        }
      }
    ]
  },
  {
    id: "chapter-2",
    title: "🎨 CSS: The Style & Clothes",
    icon: "paint",
    sessions: [
      {
        id: "ch2-s1",
        title: "🌈 Session 1: Splash of Color",
        instructions: "Let's style our webpage! Make the background color of the body lightblue and the heading color darkblue using CSS.",
        hint: "In the CSS tab, change body background to lightblue, and h1 color to darkblue.",
        starterCode: {
          html: "<h1>Colorful Webpage</h1>\n<p>CSS brings life to empty skeletons!</p>",
          css: "body {\n  /* Set background color here */\n  background: white;\n}\nh1 {\n  /* Set text color here */\n  color: black;\n}",
          js: ""
        },
        skills: ["background-color", "color", "styling"],
        validate: (doc, html, css, js) => {
          return css.toLowerCase().includes("background") && css.toLowerCase().includes("blue");
        }
      },
      {
        id: "ch2-s2",
        title: "🔄 Session 2: Rounded Card Borders",
        instructions: "Let's create a beautiful card with a border! Give the .card element a black border that is 4px thick and make the corners round using border-radius: 20px.",
        hint: "Add 'border: 4px solid black;' and 'border-radius: 20px;' to the .card style block.",
        starterCode: {
          html: "<div class=\"card\">\n  <h2>My Card</h2>\n  <p>I am framed inside a beautiful rounded card container!</p>\n</div>",
          css: "body {\n  font-family: sans-serif;\n  background: #f0f0f0;\n  padding: 40px;\n}\n\n.card {\n  background: white;\n  padding: 20px;\n  max-width: 300px;\n  margin: auto;\n  text-align: center;\n  /* Add your border and border-radius here! */\n  \n}",
          js: ""
        },
        skills: ["border", "border-radius", "shapes"],
        validate: (doc, html, css, js) => {
          return css.includes("border-radius") && (css.includes("20px") || css.includes("border"));
        }
      },
      {
        id: "ch2-s3",
        title: "✨ Session 3: Hover Magic Zoom",
        instructions: "Let's add animation! Make the button grow bigger when you hover your mouse over it. We will use the ':hover' selector and 'transform: scale(1.15)'.",
        hint: "Find the button:hover block and add 'transform: scale(1.15);' inside it.",
        starterCode: {
          html: "<button class=\"zoom-btn\">Hover Over Me! 🚀</button>",
          css: "body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 80vh;\n  background: #f7f7f7;\n}\n\n.zoom-btn {\n  padding: 15px 30px;\n  font-size: 20px;\n  background: #000;\n  color: #fff;\n  border: none;\n  border-radius: 10px;\n  cursor: pointer;\n  transition: transform 0.3s ease;\n}\n\n.zoom-btn:hover {\n  /* Add transform: scale(1.15); below */\n  \n}",
          js: ""
        },
        skills: ["hover-effects", "transform-scale", "transitions"],
        validate: (doc, html, css, js) => {
          return css.includes("hover") && css.includes("scale") && css.includes("1.1");
        }
      }
    ]
  },
  {
    id: "chapter-3",
    title: "⚡ JS: Bring It To Life",
    icon: "thunder",
    sessions: [
      {
        id: "ch3-s1",
        title: "🔔 Session 1: Button Alerts!",
        instructions: "JavaScript adds intelligence! Let's make an alert window pop up when we click our button. Under the JS editor, write: alert('You clicked me!');",
        hint: "Simply type: alert('You clicked me!'); in the JavaScript editor tab.",
        starterCode: {
          html: "<button id=\"alertBtn\">Click Me For A Surprise!</button>",
          css: "body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 80vh;\n}\nbutton {\n  padding: 15px 30px;\n  font-size: 18px;\n  border-radius: 5px;\n  cursor: pointer;\n}",
          js: "// Write your alert code below this line!\n"
        },
        skills: ["javascript-intro", "alerts", "events"],
        validate: (doc, html, css, js) => {
          return js.toLowerCase().includes("alert") && (js.toLowerCase().includes("clicked") || js.toLowerCase().includes("you"));
        }
      },
      {
        id: "ch3-s2",
        title: "💥 Session 2: Text Changer Magic",
        instructions: "Let's change page text on the fly! In JS, we can find elements using document.getElementById. Complete the click function so it changes the heading text to 'Abra Kadabra!' using heading.innerText = 'Abra Kadabra!';",
        hint: "Inside the function, write: heading.innerText = 'Abra Kadabra!';",
        starterCode: {
          html: "<h1 id=\"title\">Normal Heading</h1>\n<button id=\"magicBtn\">Cast Spell 🧙‍♂️</button>",
          css: "body {\n  text-align: center;\n  padding-top: 100px;\n  font-family: sans-serif;\n}\nbutton {\n  padding: 10px 20px;\n  font-size: 16px;\n  margin-top: 20px;\n}",
          js: "const button = document.getElementById('magicBtn');\nconst heading = document.getElementById('title');\n\nbutton.addEventListener('click', () => {\n  // Change the heading's innerText below!\n  \n});"
        },
        skills: ["dom-manipulation", "click-events", "innerText"],
        validate: (doc, html, css, js) => {
          return js.includes("innerText") && js.includes("Abra");
        }
      },
      {
        id: "ch3-s3",
        title: "🌗 Session 3: Custom Dark Mode",
        instructions: "Let's build a dark mode switcher! Complete the javascript event to toggle the class 'dark' on the document body when clicking the button. Hint: body.classList.toggle('dark');",
        hint: "In your JS block, write body.classList.toggle('dark'); within the click listener.",
        starterCode: {
          html: "<button id=\"themeBtn\">Switch Theme 🌗</button>\n<p>Click the button to toggle between Light and Dark mode!</p>",
          css: "body {\n  font-family: sans-serif;\n  background: white;\n  color: black;\n  transition: all 0.5s ease;\n  padding: 40px;\n  text-align: center;\n}\nbody.dark {\n  background: black;\n  color: white;\n}\nbutton {\n  padding: 10px 20px;\n  cursor: pointer;\n}",
          js: "const btn = document.getElementById('themeBtn');\nconst body = document.body;\n\nbtn.addEventListener('click', () => {\n  // Toggle the 'dark' class on body here!\n  \n});"
        },
        skills: ["class-toggle", "themes", "interactive-design"],
        validate: (doc, html, css, js) => {
          return js.includes("toggle") && js.includes("dark");
        }
      }
    ]
  }
];
