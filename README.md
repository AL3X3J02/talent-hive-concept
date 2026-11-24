# Talent Hive redesign concept

A clickable design concept by Alexej Zhukov showing how the Talent Hive internship platform for Cambridgeshire and Peterborough could work for interns, employers and the CPCA team.

**Live demo:** https://al3x3j02.github.io/talent-hive-concept/

This is not a real job board and not an official Cambridgeshire and Peterborough Combined Authority website. All employers, people and roles are invented, nothing you type is sent anywhere, and everything resets when you reload.

## What you can try

Use the bar at the top of the page to switch views.

* **Visitor:** browse roles by sector, search and filter the jobs board, read a job page.
* **Intern:** dashboard, apply with a saved CV, track applications, build a CV with a live preview, earn badges, and play the Daily Career Boost games (Career Wordle, Workplace Quiz, Skill Match).
* **Employer:** post a role through a guided four-step form, review applicants in a drag and drop pipeline, search for talent.
* **CPCA team:** approve or return listings with automatic checks, verify employers, spot stalled applications, download reports.

The views are connected. A role an employer posts appears in the CPCA approvals queue, and once approved it shows on the jobs board. When an employer moves an applicant, the intern sees the new status.

## How it is built

One static page with no backend or dependencies. The source lives in `src/` and `build.py` combines it into `index.html`.

To make a change, edit the files in `src/`, then run:

```
python3 build.py
```

Commit the updated `index.html` and GitHub Pages republishes it within a minute or two.
