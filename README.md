# The Quiet Questions

Five everyday dilemmas that people answer by instinct without ever examining them. Each one plays out as a short conversation with an analyst: what you would do, why, and a twist that tests the answer. A closing "mirror" round asks how you see yourself. At the end the respondent gets a short, direct reading of how they balance kindness, honesty, loyalty, freedom and truth. Every remark is grounded in published research in moral psychology and behavioural economics.

It is a single static page (`index.html`). All the branching logic is plain JavaScript `if`/`else` over fixed data, with no build step and no server. Answers can optionally be recorded in a Google Sheet so you can see who answered what.

## The five plates

| Plate | Dilemma | What it reads |
|---|---|---|
| I | **The Beggar and the Bottle.** A man will probably spend your money on alcohol. Do you give? | Generosity versus control; the deservingness heuristic; paternalistic altruism; avoiding the ask |
| II | **The Bill That Came Out Short.** The restaurant undercharged you and nobody will ever know. | Honesty without an audience; rule-based versus empathy-based honesty; the identifiable-victim effect |
| III | **The Speeding Friend.** Lie under oath to save a friend who hit a pedestrian? | Loyalty versus justice (Trompenaars' universalism and particularism; the fairness-loyalty trade-off) |
| IV | **The Friend's Big Idea.** Their business plan has a fatal flaw. They ask what you honestly think. | Truth versus kindness; prosocial lies; the MUM effect |
| V | **The Sealed Envelope.** It holds the date of your death. Open or burn? | Knowledge versus peace of mind; deliberate ignorance; information avoidance |

Each plate runs in three rounds:

1. **The choice.** 3 or 4 answers.
2. **Why.** Every answer gets its own counter-question with three reasons to pick from (for example "Why food and not money?"). The reason changes the scoring: giving money to ease your own discomfort reads differently from giving it out of respect for his choices.
3. **The twist.** The situation changes (the shop won't serve him, the pedestrian dies, the hint is missed) and 2 or 3 options test whether the first answer holds.

After each pick the analyst replies with a one- or two-line remark. When the plate is done the page shows **how the other answers read** and **the research behind the plate**, with links to the papers.

After plate V, **the mirror** asks two questions: how you would act compared with most people, and whether you answered as you would act or as you would like to act (Epley & Dunning 2000; FeldmanHall et al. 2012).

That gives 30 × 18 × 18 × 18 × 18 = 3,149,280 distinct paths through the five plates.

## How the final reading is built

1. **Six traits.** Every choice, reason and twist adds or subtracts points on Compassion, Respect for autonomy, Principle, Loyalty, Appetite for truth and Self-protection. Each total is rescaled to 0–100 against the lowest and highest score possible on that trait.
2. **Profile.** The two strongest traits pick one of 15 profiles (for example *The Torn Knight*: Principle + Loyalty). The strongest trait supplies the "core of you", relationships, work and under-pressure notes, and the second one modifies them.
3. **Patterns across answers.** 25 cross-question rules look for revealing combinations of choices and reasons. One example is "your reasons point back to you": two or more reasons that are about avoiding discomfort, hassle, risk or blame. Up to five matching patterns are shown.
4. **How you hold a position.** Each twist is tagged by whether it kept the first stance or moved off it. That gives a steady, selective or responsive reading of moral flexibility.
5. **Blind spot.** The weakest trait is written up as the person's blind spot.
6. **How you see yourself.** The two mirror answers are read together (for example "better than most" plus "as I'd actually act" is flagged as the combination where self-image and behaviour drift apart most).

All 3,149,280 possible paths were run through the scoring. Every profile and every pattern is reachable, and every score stays within 0–100.

A reading can be reopened from its link (`#r=<answer code>&m=<mirror>&n=<name>`) without retaking the questions. Each plate is coded as choice letter, reason letter and twist number, for example `Bb2`.

## Sharing it

The page is served by GitHub Pages from this repository, so the Pages URL is the link to send. To run it locally, open `index.html` in a browser.

## Recording who answered what (Google Sheet)

A static page cannot write to a database by itself, so answers go to a small Google Apps Script that appends one row per finished run to your Sheet. One-time setup, about 3 minutes:

1. Create a new Google Sheet (for example at [sheets.new](https://sheets.new)) and name it *Quiet Questions responses*.
2. In the Sheet, open **Extensions → Apps Script**. Delete the starter code, paste in [`apps-script/Code.gs`](apps-script/Code.gs), and save.
3. Click **Deploy → New deployment**. Choose the type **Web app** and set:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
4. Click **Deploy**, approve the permissions prompt (it only needs access to this Sheet), and copy the **Web app URL** (it ends in `/exec`).
5. In `index.html`, paste that URL into `const RESPONSE_ENDPOINT = "";` near the top of the script. Then commit and push.

From then on, every finished run adds a row to the **Responses** tab with the person's name, the choice, reason and twist for each plate, both mirror answers, the profile name, six trait scores, the matched patterns, and a link that reopens their full reading. Respondents are told on the first screen that their name and answers will be sent to you.

To check that the deployment is live, open the `/exec` URL in a browser. It should return `{"ok":true,...}`.

## Caveat

This is a reflective exercise built on real findings. It is not a validated or clinical psychological instrument. The scoring weights are judgement calls informed by the literature, and five answers cannot capture a whole person.

## References

- Jacobsson, Johannesson & Borgquist (2007). Is altruism paternalistic? *Economic Journal* 117, 761–781.
- Evans & Popova (2017). Cash transfers and temptation goods. *Economic Development and Cultural Change* 65(2).
- Petersen, Sznycer, Cosmides & Tooby (2012). Who deserves help? *Political Psychology* 33(3).
- Andreoni, Rao & Trachtman (2017). Avoiding the ask. *Journal of Political Economy* 125(3), 625–653.
- Cushman, Young & Hauser (2006). The role of conscious reasoning and intuition in moral judgment. *Psychological Science* 17(12).
- Zaki (2014). Empathy: A motivated account. *Psychological Bulletin* 140(6).
- Batson, Duncan, Ackerman, Buckley & Birch (1981). Is empathic emotion a source of altruistic motivation? *Journal of Personality and Social Psychology* 40(2).
- Spranca, Minsk & Baron (1991). Omission and commission in judgment and choice. *Journal of Experimental Social Psychology* 27(1).
- Kunda (1990). The case for motivated reasoning. *Psychological Bulletin* 108(3).
- Scott (2017). *Radical Candor*. St. Martin's Press.
- Kahneman & Tversky (1979). Prospect theory. *Econometrica* 47(2), 263–291.
- Epley & Dunning (2000). Feeling "holier than thou". *Journal of Personality and Social Psychology* 79(6), 861–875.
- FeldmanHall, Mobbs, Evans, Hiscox, Navrady & Dalgleish (2012). What we say and what we do. *Cognition* 123(3), 434–441.
- Cohn, Maréchal, Tannenbaum & Zünd (2019). Civic honesty around the globe. *Science* 365(6448), 70–73.
- Abeler, Nosenzo & Raymond (2019). Preferences for truth-telling. *Econometrica* 87(4), 1115–1153.
- Gerlach, Teodorescu & Hertwig (2019). The truth about lies. *Psychological Bulletin* 145(1), 1–44.
- Mazar, Amir & Ariely (2008). The dishonesty of honest people. *Journal of Marketing Research* 45(6).
- Small, Loewenstein & Slovic (2007). Sympathy and callousness. *Organizational Behavior and Human Decision Processes* 102(2).
- Trompenaars & Hampden-Turner (1997). *Riding the Waves of Culture*, 2nd ed.
- Waytz, Dungan & Young (2013). The whistleblower's dilemma and the fairness–loyalty tradeoff. *Journal of Experimental Social Psychology* 49(6).
- Graham, Nosek, Haidt, Iyer, Koleva & Ditto (2011). Mapping the moral domain. *Journal of Personality and Social Psychology* 101(2).
- Levine & Schweitzer (2014). Are liars ethical? *Journal of Experimental Social Psychology* 53, 107–117.
- Levine & Schweitzer (2015). Prosocial lies: When deception breeds trust. *Organizational Behavior and Human Decision Processes* 126, 88–106.
- Lupoli, Jampol & Oveis (2017). Lying because we care. *Journal of Experimental Psychology: General* 146(7), 1026–1042.
- Rosen & Tesser (1970). On reluctance to communicate undesirable information: The MUM effect. *Sociometry* 33(3).
- DePaulo, Kashy, Kirkendol, Wyer & Epstein (1996). Lying in everyday life. *Journal of Personality and Social Psychology* 70(5).
- Gigerenzer & Garcia-Retamero (2017). Cassandra's regret: The psychology of not wanting to know. *Psychological Review* 124(2), 179–196.
- Hertwig & Engel (2016). Homo ignorans: Deliberately choosing not to know. *Perspectives on Psychological Science* 11(3).
- Oster, Shoulson & Dorsey (2013). Optimal expectations and limited medical testing. *American Economic Review* 103(2), 804–830.
- Golman, Hagmann & Loewenstein (2017). Information avoidance. *Journal of Economic Literature* 55(1), 96–135.
- Shin & Ariely (2004). Keeping doors open. *Management Science* 50(5), 575–586.
- Bartels (2008). Principled moral sentiment and the flexibility of moral judgment and decision making. *Cognition* 108(2).
- Aquino & Reed (2002). The self-importance of moral identity. *Journal of Personality and Social Psychology* 83(6).
- Merritt, Effron & Monin (2010). Moral self-licensing. *Social and Personality Psychology Compass* 4(5).
