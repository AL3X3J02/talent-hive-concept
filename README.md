# Talent Hive demo

A clickable working demo by Alexej Zhukov showing how the Talent Hive internship platform for Cambridgeshire and Peterborough could work for interns, employers and the CPCA team.

**Live demo:** https://al3x3j02.github.io/talent-hive-concept/

It is not a real job board and not an official Cambridgeshire and Peterborough Combined Authority website. All employers, people and roles are invented, nothing you type is sent anywhere, and everything resets when you reload.

## What you can try

Use the bar at the top of the page to switch views, or press **Take the tour** for a guided walkthrough.

* **Visitor:** browse roles by sector, search and filter the jobs board (as a list or on a map), read job pages and employer profiles with reviews, and sign up with a postcode check.
* **Documentation:** a paged report at /docs/ (built with `python3 build_docs.py`), with a PDF copy.
* **Intern:** dashboard, apply with a saved CV, compare roles side by side, track applications, book an interview slot and add it to your calendar, build a CV with a live preview, earn badges, follow a placement week by week, and play ten Daily Career Boost games (Word Hive, Career Wordle, Career Connections, Workplace Quiz, Inbox Rush, STAR Builder, Spot the Slip, Pay Check, Job Scramble and Skill Match) with streaks, a weekly challenge, levels, achievements, shareable results and a leaderboard.
* **Employer:** post a role through a guided four-step form, see insights for each listing, rate and compare applicants in a drag and drop pipeline, offer interview times, search for talent, approve hours and write references.
* **CPCA team:** approve or return listings with automatic checks, verify employers and new interns, spot stalled applications, see placements on a map, message whole groups, download reports and check the audit log.

Every signed-in area has search (Ctrl K), notifications, and display settings for text size, spacing, contrast and motion.

The views are connected. A role an employer posts appears in the CPCA approvals queue, and once approved it shows on the jobs board. When an employer moves an applicant or offers interview times, the intern sees it and gets a notification.

## How it is built

One static page with no backend or dependencies. The source lives in `src/` and `build.py` combines it into `index.html`.

To make a change, edit the files in `src/`, then run:

```
python3 build.py
```

Commit the updated `index.html` and GitHub Pages republishes it within a minute or two.
