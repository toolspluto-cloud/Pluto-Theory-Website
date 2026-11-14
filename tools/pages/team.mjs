// The Team page (/team). Edit the people below, then run:   node make-team-page.mjs
//
// For each person:
//   name, role         shown on the card
//   line               one short sentence about them (what they do, or what they're like to work with)
//   photo              optional: put a portrait in assets/team/ (e.g. "assets/team/asha.jpg", ideally 4:5, at least 800 px wide);
//                      without one, the card shows their initials
//   linkedin           optional: their LinkedIn profile address
//   sample: true       marks a placeholder. While any placeholder is left, the page stays hidden from Google.
export default {
  title: "Our Team | Pluto Theory",
  description: "Meet the people behind Pluto Theory, the AI and creative studio in Hyderabad: AI automation, branding, photography and production under one roof.",
  intro: "A small team of builders, designers and storytellers in Hyderabad, working with businesses across India and worldwide. Some of us automate the boring parts of a business with AI. Some of us make brands people remember. Most of us do a bit of both.",
  people: [
    { name: "Arjun", role: "Co-founder", line: "Co-founded Pluto Theory and leads the studio with Swaroop, from first call to finished work." },
    { name: "Swaroop", role: "Co-founder", line: "Co-founded Pluto Theory and leads the studio with Arjun, from first call to finished work." },
    { name: "Akshith", role: "AI & Automations Lead", line: "Leads our AI automation and agent projects: finding the busy work in a business and building the workflows that do it." },
    { name: "Sanjay", role: "AI & Creative Lead", line: "Leads the work where AI meets creative, from AI photoshoots to AI-made content that still looks like the brand." }
  ]
};
