# Working Preferences for This Workspace

## Writing Style
- Do NOT use dashes within sentences. Replace mid-sentence dashes with commas, or rewrite the sentence to avoid them.
- Dashes ARE acceptable in titles and labels (e.g. "Patreon - Monthly Support").
- Do not use em dashes anywhere.
- Never put grey text on a dark background. Text on dark backgrounds should be white.

## Workflow
- Explain the plan before executing on multi-step or substantive tasks. Wait for confirmation before proceeding when the task is significant.
- After making website changes, commit and push to GitHub with a descriptive commit message.
- When editing HTML/CSS, make targeted edits rather than rewriting whole files.
- Do NOT end responses by asking "what's next?" or similar prompts. Finish the task and stop.
- When listing items or previewing changes is requested (or when I say "wait"), list/explain first and hold off on executing until I confirm.

## Website Project (ungerrymanderamerica.com)
- Static site (HTML/CSS/JS), hosted on GitHub Pages, custom domain via Porkbun.
- Repo: github.com/zanegustafson/ungerrymanderamerica
- Git is at "C:\Program Files\Git\cmd\git.exe" and may not be on PATH in all shells.
- The show is referred to as a "show," not a "podcast."
- Color palette: white, black, yellow (#F5F374), purple (#b073da), plus cream/beige and grays as supporting neutrals.
- Fonts: Space Grotesk (headings), Inter (body), Montserrat (logo).
- Reference sites for design aesthetic: Death Panel, Defector, Maintenance Phase.
- Percentage columns in spreadsheets: stored as decimals, displayed with 0.00% format.
- Links: Patreon has been removed entirely. Support options are Substack, PayPal, Venmo (plus book and merch).
  - Venmo: https://venmo.com/u/ungerrymanderamerica
  - PayPal: https://www.paypal.com/ncp/payment/3FXJ2GNESAZ7J
  - Substack: https://ungerrymanderamerica.substack.com/subscribe
  - Book (Polemic for Democracy): https://shop.ingramspark.com/b/084?params=e6FpRlwhFaYMhOMP0kOZs4KAZhMdFoLGQEnx0oQp9Ob
  - Shopify store: https://ungerrymander-america.myshopify.com/
  - YouTube channel: https://www.youtube.com/@Ungerrymander_America

## Election Spreadsheet (AugustPrimaryAnalysis)
- Main file: August2026Primary_TrackingAnalysis.xlsx
- Only work in the "August2026Primary_Tracking" tab (and specifically requested tabs). Leave all other tabs untouched, as they reference the tracking tab.
- Preserve column widths, frozen panes (row 1 + column A), and number formatting on every edit.
- Write directly to cells when adding data (avoid delete-and-recreate, which resets formatting).
- Confirm the xlsx file is closed before writing to it.
- Vote share is calculated as candidate votes divided by the sum of all candidate + write-in votes (excluding Ballots Cast, Over Votes, Under Votes), NOT total ballots cast.
- Races of interest: US Representative, State Representative, State Senator.
- Column naming pattern per day: DayN_CumulVotes, DayN_CumulVoteShare_Pct, DayN_TotalChange (change vs Day 1), DayN_VoteChange (new votes that day), DayN_VoteShare_Pct (that day's votes only).

## Tools/Environment
- I cannot download images, generate images, send notifications, or interact with GUIs/authenticated accounts.
- ImportExcel PowerShell module is installed for reading/writing xlsx files.
