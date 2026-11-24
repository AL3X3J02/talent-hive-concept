#!/usr/bin/env python3
"""Builds docs/index.html: the Talent Hive documentation as a paged, print-ready report."""
from pathlib import Path
from html import escape as E

DEMO = 'https://al3x3j02.github.io/talent-hive-concept/'
INK, QUIET, EDGE, GRID, ACC, ACCF, TINT = '#0F1222', '#5D6375', '#A9B0C1', '#E4E6ED', '#2E3BFF', '#EEF0FF', '#F6F7FA'

def link(path, text):
    return f'<a href="{DEMO}#{path}">{E(text)}</a>'

def table(head, rows, cls=''):
    th = ''.join(f'<th>{h}</th>' for h in head)
    body = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<table class="{cls}"><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>'

FIG = [0]
def fig(src, alt, cap):
    FIG[0] += 1
    return f'<figure class="fig"><img src="img/{src}" width="1600" height="950" alt="{E(alt)}" loading="eager"><figcaption><b>Figure {FIG[0]}.</b> {cap}</figcaption></figure>'

def svgfig(svg, cap, cls=''):
    FIG[0] += 1
    return f'<figure class="fig diagram {cls}">{svg}<figcaption><b>Figure {FIG[0]}.</b> {cap}</figcaption></figure>'

def h2(num, title, sid):
    return f'<h2 id="{sid}" class="kwn" data-break="page"><span class="num">{num}</span>{E(title)}</h2>'

def h3(num, title, sid):
    return f'<h3 id="{sid}" class="kwn"><span class="num">{num}</span>{E(title)}</h3>'

def p(t, cls=''):
    return f'<p class="{cls}">{t}</p>' if cls else f'<p>{t}</p>'

# ---------- diagrams ----------
def arrow_defs(i):
    return f'<defs><marker id="{i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{EDGE}"/></marker></defs>'

def box(x, y, w, h, name, line, main=False, lines_fill=None, anchor='middle'):
    fill, stroke, sw = (ACCF, ACC, 2) if main else ('#fff', EDGE, 1.25)
    cx = x + w / 2
    tx = cx if anchor == 'middle' else x + 12
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
            f'<text x="{tx}" y="{y + h/2 - 4}" text-anchor="{anchor}" font-weight="600" fill="{INK}">{E(name)}</text>'
            f'<text x="{tx}" y="{y + h/2 + 13}" text-anchor="{anchor}" font-size="11.5" fill="{lines_fill or QUIET}">{E(line)}</text>')

def zone(x, y, w, h, name, ny):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="none" stroke="{EDGE}" stroke-dasharray="4 4"/>'
            f'<text x="{x + 16}" y="{ny}" font-weight="600" fill="{INK}">{E(name)}</text>')

def arch_svg():
    a = 'ar1'
    s = [f'<svg viewBox="0 64 760 416" role="img" aria-label="Architecture: one platform serves interns, employers and CPCA staff from a single database, connected to four outside services" font-size="13">', arrow_defs(a)]
    s.append(f'<g fill="none" stroke="{EDGE}" stroke-width="1.25">' + ''.join(f'<path d="{d}" marker-end="url(#{a})"/>' for d in ['M92 132V196','M248 132V196','M404 132V196','M248 252V276','M140 332V356','M356 332V356']) + f'<path d="M456 304H496" marker-start="url(#{a})" marker-end="url(#{a})"/></g>')
    s += [box(24,76,136,56,'Interns','Phone or computer'), box(180,76,136,56,'Employers','Employer portal'), box(336,76,136,56,'CPCA staff','Staff dashboard')]
    s.append(zone(24,172,448,292,'Talent Hive platform, hosted in the UK',450))
    s += [box(40,196,416,56,'Web app','Next.js front end, with one menu for each role'), box(40,276,416,56,'API','Node.js: programme rules, checks and the audit log'),
          box(40,356,200,56,'Database','PostgreSQL, with search', main=True, lines_fill=INK), box(256,356,200,56,'File storage','Virus scanned CVs and logos')]
    s.append(zone(496,172,240,292,'Outside services',450))
    s += [box(512,196,208,52,'Sign in','Email links or Microsoft'), box(512,256,208,52,'GOV.UK Notify','Emails and text messages'),
          box(512,316,208,52,'Companies House','Checks registered employers'), box(512,376,208,52,'Open Badge Factory','Issues and verifies badges')]
    s.append('</svg>')
    return ''.join(s)

def sitemap_svg():
    cols = [('Public site',['Home','Find a role','Job page','Employer profiles','For employers','Employer sign up','Eligibility and FAQ','Events','Join','Sign in']),
            ('Intern hub',['Dashboard','Jobs and matches','Applications','My placement','My CV','Skills and badges','Daily Career Boost','Messages','Events','Settings']),
            ('Employer portal',['Dashboard','Post a role','My listings','Applicants','Interviews','Placements','Talent search','Messages','Company profile','Settings']),
            ('CPCA team',['Overview','Approvals','Interns','Employers','Placements','Reports','News and events','Send a message','Audit log','Settings'])]
    s = ['<svg viewBox="0 40 760 504" role="img" aria-label="Site structure: four areas, each with its own menu, on shared data" font-size="12">']
    for i, (name, items) in enumerate(cols):
        x = 24 + i * 182; mid = x + 83
        s.append(f'<rect x="{x}" y="52" width="166" height="424" rx="8" fill="{TINT}" stroke="{GRID}"/><text x="{mid}" y="78" text-anchor="middle" font-size="14" font-weight="600" fill="{INK}">{E(name)}</text>')
        for k, it in enumerate(items):
            y = 92 + k * 36
            s.append(f'<rect x="{x+16}" y="{y}" width="134" height="28" rx="6" fill="#fff" stroke="{EDGE}"/><text x="{mid}" y="{y+18}" text-anchor="middle" fill="{INK}">{E(it)}</text>')
        s.append(f'<line x1="{mid}" y1="476" x2="{mid}" y2="492" stroke="{EDGE}" stroke-width="1.25"/>')
    s.append(f'<rect x="24" y="492" width="712" height="40" rx="8" fill="{ACCF}" stroke="{ACC}" stroke-width="1.25"/><text x="380" y="516" text-anchor="middle" font-size="13" fill="{INK}">Shared data: profiles, CVs, listings, applications, placements, badges</text></svg>')
    return ''.join(s)

def journey_svg():
    a = 'ar2'
    lx = lambda i: 24 + i * 240
    bx = lambda i: lx(i) + 16
    rc = lambda k: 140 + k * 80
    s = ['<svg viewBox="0 52 760 548" role="img" aria-label="Journey: a role goes from posted to placed in six steps across employer, CPCA team and intern" font-size="13">', arrow_defs(a)]
    for i, n in enumerate(['Employer','CPCA team','Intern']):
        s.append(f'<rect x="{lx(i)}" y="64" width="232" height="524" rx="8" fill="{TINT}" stroke="{GRID}"/><text x="{lx(i)+116}" y="90" text-anchor="middle" font-size="14" font-weight="600" fill="{INK}">{n}</text>')
    s.append(f'<g fill="none" stroke="{EDGE}" stroke-width="1.25">' + ''.join(f'<path d="{d}" marker-end="url(#{a})"/>' for d in ['M216 140H260V220H296','M456 220H500V300H536','M636 328V340H124V352','M124 408V420H636V432','M636 488V500H376V512']) + '</g>')
    s.append(f'<path d="M296 236H124V168" fill="none" stroke="{EDGE}" stroke-width="1.25" stroke-dasharray="4 3" marker-end="url(#{a})"/><text x="280" y="254" text-anchor="end" font-size="11.5" fill="{QUIET}">returned for edits</text>')
    steps = [(0,0,'Posts a role','Four step form, live preview',False),(1,1,'Approves the listing','Checks employer and details',False),(2,2,'Finds it and applies','Saved CV and a short note',False),
             (0,3,'Shortlists, interviews','Moves cards on a pipeline',False),(2,4,'Accepts the offer','Tracker shows every step',False),(1,5,'Confirms the placement','Counts in funder reports',True)]
    for i, k, n, l, m in steps:
        s.append(box(bx(i), rc(k) - 28, 200, 56, n, l, main=m, anchor='start', lines_fill=INK if m else None))
    s.append('</svg>')
    return ''.join(s)

def roadmap_svg():
    a = 'ar3'
    bx = lambda i: 24 + i * 182
    phases = [('Discovery','Weeks 1 to 3',['Interview interns','and employers','Test a prototype','Agree scope'],False),
              ('Build the core','Weeks 4 to 13',['Jobs board, apply','CV and tracker','Employer posting','CPCA approvals'],False),
              ('Pilot cohort','Weeks 14 to 19',['One cohort live','Messages, badges','Daily Career Boost','Fix what we learn'],True),
              ('Scale and switch','Weeks 20 to 25',['Reports, matching','Accessibility audit','Migrate users','Retire old spaces'],False)]
    s = ['<svg viewBox="0 52 760 256" role="img" aria-label="Roadmap: four phases over 25 weeks, with three sign off points" font-size="12">', arrow_defs(a)]
    for i, (n, w, items, m) in enumerate(phases):
        x = bx(i); mid = x + 83
        fill, stroke, sw = (ACCF, ACC, 2) if m else ('#fff', EDGE, 1.25)
        s.append(f'<rect x="{x}" y="64" width="166" height="148" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/><line x1="{x+12}" y1="118" x2="{x+154}" y2="118" stroke="{GRID}"/>')
        s.append(f'<text x="{mid}" y="88" text-anchor="middle" font-size="14" font-weight="600" fill="{INK}">{n}</text><text x="{mid}" y="106" text-anchor="middle" font-size="11.5" fill="{QUIET}">{w}</text>')
        for j, t in enumerate(items):
            s.append(f'<text x="{x+12}" y="{140 + j*18}" fill="{INK}">{E(t)}</text>')
    s.append(f'<line x1="24" y1="244" x2="736" y2="244" stroke="{EDGE}" stroke-width="1.25" marker-end="url(#{a})"/>')
    for i, (n, c, m) in enumerate([('Design sign off','Prototype tested',False),('Pilot go live','Accessibility check passed',True),('Full launch','Pilot targets met',False)]):
        gx = bx(i) + 174
        s.append(f'<path d="M{gx} 234L{gx+10} 244L{gx} 254L{gx-10} 244z" fill="{ACC if m else "#fff"}" stroke="{ACC if m else EDGE}" stroke-width="1.5"/>')
        s.append(f'<text x="{gx}" y="276" text-anchor="middle" font-size="12.5" font-weight="600" fill="{INK}">{n}</text><text x="{gx}" y="292" text-anchor="middle" font-size="11.5" fill="{QUIET}">{c}</text>')
    s.append('</svg>')
    return ''.join(s)

# ---------- content ----------
F = []
add = F.append

add(h2('1', 'Summary', 's1'))
add(p('Talent Hive runs today on My Skills Pass, a digital badge platform that has been stretched into a job board. Vacancies are posted as news items in a sidebar, there is no apply button, and employers have no space of their own. A walkthrough of the live site found twelve problems, four of which stop interns getting placed (Appendix A).', 'lead'))
add(p('The demo shows what Talent Hive could be instead: one platform with its own front door for each person involved. Interns search paid roles, apply in a few clicks and always know where they stand. Employers post roles and manage applicants in their own portal. The CPCA team approves listings, checks pay automatically and reports on the programme from one dashboard.'))
add(p('The demo is live and clickable, with sample data. Anyone can switch between the four views and follow the whole loop, from an employer posting a role to an intern starting a placement, in about five minutes.'))
add(p('Building it for real means a standard web application hosted in the UK, keeping Open Badge Factory so no earned badge is lost. A pilot cohort could use it after about 13 weeks, with full switch over around week 25 (section 3.9).'))
add(fig('fig01-home.jpg', 'Talent Hive home page with a blue hero and a job search bar', 'The public home page of the demo.'))

add(h2('2', 'The demo today', 's2'))
add(h3('2.1', 'What it is and how to use it', 's21'))
add(p('The demo is a complete front end for the new Talent Hive, running in the browser with invented employers, interns and roles. Nothing is sent to a server and every change resets when the page reloads, so it is safe to click anything.'))
add(p('The dark bar along the top of every page is the presenter\'s control panel. It is there to run the demo and is not part of the product design.'))
add(table(['Control','What it does'], [
    ['View as','Switches between Visitor, Intern (Jordan Ellis), Employer (Priya Shah at Fenlight Digital) and CPCA team (Sam Okafor). Each view has its own menu and dashboard.'],
    ['Take the tour','A ten step guided tour that moves between the views and highlights one feature at a time. The page is locked in place while it runs.'],
    ['About','A page listing the twelve problems with today\'s site, each with a Show me link to the fix in the demo.'],
    ['Reset data','Puts every listing, application and message back to its starting state.']], 'two'))
add(p('The sample data covers 13 employers, 15 roles (12 live, 1 draft and 2 waiting for approval), 9 interns and 13 applications in the winter 2026 cohort. The demo\'s date is fixed at Tuesday 24 November 2026, so the dashboards always tell the same story.'))

add(h3('2.2', 'Visitors', 's22'))
add(p('Anyone can browse roles without an account. The home page opens with a search bar and the eight sectors, each showing how many roles are open, rather than a news feed.'))
add(table(['Feature','What it does','Try it'], [
    ['Jobs board','Keyword search, filters for area, sector, workplace, type and pay, sorting, and a map of where the roles are.', link('/jobs','Find a role')],
    ['Job page','Pay, hours, length, location, start date and closing date in a fact box at the top, with an Apply panel that stays in view.', link('/jobs/j1','Job page')],
    ['Employer profiles','What each organisation does, its open roles and reviews from past interns.', link('/company/e1','Fenlight Digital')],
    ['For employers','Explains the offer to local businesses and leads into a four step registration.', link('/employers','For employers')],
    ['Join','Intern sign up, with a postcode check against the areas the programme covers.', link('/join','Join')],
    ['Events','Profile Power Up sessions and employer events.', link('/events','Events')]], 'three'))
add(fig('fig02-jobs.jpg', 'Jobs board with filters on the left and a list of roles', 'The jobs board. Filters sit on the left and every role shows its pay, hours and closing date.'))

add(h3('2.3', 'Interns', 's23'))
add(p('The intern view is built around one question: what should I do next? The dashboard leads with the most important thing, here a booked interview, then shows each application\'s progress, today\'s games and roles that match the intern\'s CV.'))
add(fig('fig04-intern-dashboard.jpg', 'Intern dashboard with an interview banner and application progress', 'Jordan\'s dashboard, leading with an interview booked for 3 December.'))
add(fig('fig03-job-match.jpg', 'Job page with a fact box and a panel explaining an 84 percent match', 'A job page seen by a signed in intern, with the reasons behind an 84% match.'))
add(fig('fig05-applications.jpg', 'Applications tracker with three applications', 'The applications tracker. Each role shows its stage and history and, once an interview is booked, a link to practise for it.'))
add(table(['Feature','What it does','Try it'], [
    ['Matching','Every role shows a match score. The job page explains it: skills in common, travel distance, hours against availability, and what to learn to close the gap.', link('/intern/jobs/j1','Job page')],
    ['Save and compare','Save roles, then compare up to three side by side.', link('/intern/jobs','Jobs')],
    ['Apply','Sends the saved CV with a short cover note and answers to up to three screening questions set by the employer.', link('/intern/jobs','Jobs')],
    ['Applications','Every stage from Applied to Offer, the history of each change, and the employer\'s feedback when a role does not go ahead.', link('/intern/applications','Applications')],
    ['Interviews','Pick from the times the employer offers, add the interview to a calendar, and practise with timed questions and STAR prompts.', link('/intern/practice','Practice')],
    ['CV builder','Guided sections with a live preview, a completeness meter and verified badges. Downloads as a PDF.', link('/intern/cv','My CV')],
    ['Skills and badges','The existing badge journeys from My Skills Pass, shown as a progress path.', link('/intern/badges','Skills and badges')],
    ['My placement','Once placed: weekly goals, hours logged and approved, a weekly check in, mentor feedback and a preview of the completion certificate.', link('/intern/placement','My placement')],
    ['Messages and events','One inbox with clear subject lines, and one click booking for sessions.', link('/intern/messages','Messages')],
    ['Settings','Email, text and in-app notifications, job alerts, privacy controls, a download of the intern\'s own data and account deletion.', link('/intern/settings','Settings')]], 'three'))

add(h3('2.4', 'Daily Career Boost', 's24'))
add(p('Ten short games give interns a reason to come back every day, and each one teaches something an employer will notice. Three are featured each day, every game resets at midnight, and progress builds a streak, levels and achievements. Results can be copied and shared without giving the answers away.'))
add(fig('fig11-boost.jpg', 'Daily Career Boost hub with today\'s three games, a streak calendar and a weekly challenge', 'The games hub, with today\'s three, a two week streak calendar and the weekly challenge.'))
add(table(['Game','What it teaches','Try it'], [
    ['Word Hive','Vocabulary. Make words from seven letters on a honeycomb, always using the centre letter, and climb the ranks.', link('/intern/boost/hive','Word Hive')],
    ['Career Wordle','Workplace words, in six guesses.', link('/intern/boost/wordle','Career Wordle')],
    ['Career Connections','Sorting sixteen workplace words into four hidden groups, such as kinds of interview or sections of a CV.', link('/intern/boost/connections','Career Connections')],
    ['Workplace Quiz','Interviews and first days, with a tip after every answer.', link('/intern/boost/quiz','Workplace Quiz')],
    ['Inbox Rush','Prioritising eight work emails, including spotting and reporting a phishing email.', link('/intern/boost/inbox','Inbox Rush')],
    ['STAR Builder','Ordering interview answers into Situation, Task, Action and Result.', link('/intern/boost/star','STAR Builder')],
    ['Spot the Slip','Proofreading a CV for six mistakes before an employer sees them.', link('/intern/boost/slip','Spot the Slip')],
    ['Pay Check','Reading pay properly. A higher hourly rate can still mean less each week.', link('/intern/boost/pay','Pay Check')],
    ['Job Scramble','Recognising job titles, with hints that cost points.', link('/intern/boost/scramble','Job Scramble')],
    ['Skill Match','Which skills each kind of role relies on.', link('/intern/boost/match','Skill Match')]], 'three'))
add(fig('fig10-hive.jpg', 'Word Hive game with seven letters in a honeycomb and a list of found words', 'Word Hive, the signature game. The theme of today\'s letters is getting placed.'))

add(h3('2.5', 'Employers', 's25'))
add(p('Employers get their own portal instead of emailing roles to CPCA. Posting a role takes about ten minutes, and every applicant is managed in one place.'))
add(fig('fig06-post-role.jpg', 'Post a role form with a live preview', 'Posting a role. The preview on the right shows exactly what interns will see.'))
add(fig('fig07-pipeline.jpg', 'Applicant pipeline with five columns', 'The applicant pipeline. Moving a card changes the applicant\'s status and tells them automatically.'))
add(table(['Feature','What it does','Try it'], [
    ['Post a role','A four step form with a live preview and the option to save a draft. Pay below the National Living Wage (&pound;12.71 an hour) is refused before the listing reaches CPCA.', link('/employer/post','Post a role')],
    ['Listings and insights','Every role with its status, views and applicants. Each live role has insights: views per day, how many viewers applied, where applicants found it and which skills they bring.', link('/employer/listings/j1','Insights')],
    ['Applicant pipeline','Drag applicants between New, Shortlisted, Interview, Offer and Not progressed, or use the menu on each card. Rate them, compare up to three side by side and keep private notes.', link('/employer/pipeline','Applicants')],
    ['Interviews','Offer up to three interview times in one step. Booked interviews, offered times and placement check ins appear on a weekly calendar.', link('/employer/interviews','Interviews')],
    ['Placements','Confirm placements, send the welcome pack and keep track of check ins.', link('/employer/placements','Placements')],
    ['Talent search','Browse interns who have chosen to be found, filtered by skill and availability.', link('/employer/talent','Talent search')],
    ['Company profile and team','The profile shown on every listing. Colleagues can be invited to the account from Settings.', link('/employer/profile','Company profile')],
    ['Registration','A new organisation signs up in four steps and joins the CPCA approval queue as unverified.', link('/employer-join','Register')]], 'three'))

add(h3('2.6', 'The CPCA team', 's26'))
add(p('The CPCA view replaces manual tracking with one dashboard for the whole programme. It shows what is waiting for approval, which applications have stalled and where placements are happening across the region.'))
add(fig('fig08-cpca-overview.jpg', 'CPCA programme overview with headline figures and a weekly chart', 'The programme overview for the winter 2026 cohort.'))
add(fig('fig09-cpca-approval.jpg', 'Review page with automatic checks flagging pay below the National Living Wage', 'Reviewing a listing. The automatic checks have caught pay below the National Living Wage, so it cannot be approved until the employer fixes it.'))
add(table(['Feature','What it does','Try it'], [
    ['Approvals','New listings, new employers and new intern sign ups in one queue. Each listing is checked against the programme rules before staff approve it or return it with comments, and interns are confirmed as eligible here.', link('/cpca/approvals','Approvals')],
    ['Overview','Live listings, applications, placements and stalled applications, with a weekly chart, a live activity feed, a map of the region and a cohort timeline.', link('/cpca','Overview')],
    ['Interns and employers','Searchable lists with a profile page for each person or organisation, their full history and private staff notes.', link('/cpca/interns/i1','Jordan Ellis')],
    ['Placements','Every placement in the cohort and the stage it has reached.', link('/cpca/placements','Placements')],
    ['Reports','The applications funnel, placements by sector, Daily Career Boost engagement and a CSV download for funders.', link('/cpca/reports','Reports')],
    ['News, events and messages','Content kept apart from job listings, and messages sent to every intern at once.', link('/cpca/broadcast','Send a message')],
    ['Audit log','A record of every action taken by staff.', link('/cpca/audit','Audit log')],
    ['Programme rules','Minimum pay, how long a listing must stay open, the approval target and placement length. Changing a rule changes the approval checks straight away.', link('/cpca/settings','Settings')]], 'three'))

add(h3('2.7', 'Across every view', 's27'))
add(p('A few things work the same way everywhere, so people only have to learn them once.'))
add(table(['Feature','What it does'], [
    ['Search','Press / or Ctrl K on any page to jump to a page, role, person or employer.'],
    ['Notifications','A bell on every dashboard lists updates such as a status change or a new applicant, each linking to the page concerned.'],
    ['Display settings','The Aa button sets text size, an easier reading typeface (Atkinson Hyperlegible), higher contrast, reduced motion and dark mode. Choices are remembered between visits.'],
    ['Help','A help button on every page with answers to common questions and a message form.'],
    ['CPCA branding','The CPCA logo sits in the header, footer, menus and sign in page. While this is a demo, the top bar marks every page as a demo and the footer says it is not an official CPCA website.'],
    ['Phones','Every page works on a 390 pixel wide screen, including posting a role, the applicant pipeline and every game.']], 'two'))

add(h3('2.8', 'What is real and what is simulated', 's28'))
add(p('Everything on screen can be clicked and works, but the services behind it are stand ins. Sign in is a choice of demo person with no password, and all data lives in the browser until the page reloads.'))
add(p('No emails, texts or calendar invites are sent. They appear as in-app notifications or a downloaded calendar file instead, and PDFs come from the browser\'s print option. The live activity feed, charts and map are drawn from sample data, and Companies House numbers are checked for their format only. Section 3.1 sets out how each of these becomes real.'))

add(h3('2.9', 'Five-minute walkthrough', 's29'))
add(p('This route shows the whole loop in order. Press Reset data first if the demo has been used already.'))
add('<ol class="steps">' + ''.join(f'<li><b>{a}</b> {b}</li>' for a, b in [
    ('Visitor.','On the home page, pick Digital and tech, then open Junior Web Developer Intern to show the fact box and the Apply panel.'),
    ('Intern.','Switch to Intern. The dashboard leads with Jordan\'s interview. Open Jobs, then Data and AI Intern to show why it matches. Apply, first sending the form empty to show the error messages.'),
    ('Tracking.','Open Applications to see the new application alongside Jordan\'s others.'),
    ('Employer.','Switch to Employer, open Applicants and choose Data and AI Intern from the role menu. Move Jordan to Interview and offer three times.'),
    ('Posting.','Go to Post a role, choose Fill with an example and try a pay of &pound;12.00 to show the National Living Wage check. Correct it and submit.'),
    ('CPCA team.','Switch to CPCA team and open Approvals. Approve the new role, then open Marketing Assistant Intern to show approval blocked by the pay check, and return it with comments.'),
    ('Close the loop.','Back as the intern, the new role is on the jobs board and the Data and AI application is at Interview, with times to pick. Finish with a round of Word Hive.')]) + '</ol>')

add(h3('2.10', 'How the demo was built and tested', 's210'))
add(p('The demo is written in plain HTML, CSS and JavaScript with no framework. A small build script joins the source files into a single page of about 400 KB, which is hosted free on GitHub Pages. It sets no cookies and has no tracking; the browser only remembers display settings and whether the welcome message has been seen.'))
add(p('Each release is checked by automated browser tests. They open all 58 pages and views on a desktop screen and a phone screen, and fail on any script error or anything wider than the screen. Scripted runs then click through the main journeys end to end, including applying, posting, approving, every game, the guided tour and dark mode.'))

add(h2('3', 'The finished platform', 's3'))
add(p('The full build keeps the demo\'s design and journeys and replaces every stand in with a real service. The screens people have already clicked through become the product, so there are few surprises between demo and launch.', 'lead'))
add(h3('3.1', 'From demo to full platform', 's31'))
add(table(['Area','In the demo','In the full platform'], [
    ['Accounts and sign in','Pick a demo person, no password','Passwordless email links for interns and employers, Microsoft sign in for CPCA staff'],
    ['Data','Held in the browser, reset on reload','A PostgreSQL database hosted in the UK, backed up daily, with a history of every change'],
    ['Jobs board','Search and filters over 12 sample roles','Server search across every live role, shareable links and job alerts by email'],
    ['Applying','Saved CV, cover note and screening questions','The same, plus CV uploads, eligibility checks and duplicate checks'],
    ['Notifications','Shown in the app only','Email and text through GOV.UK Notify if CPCA is eligible, otherwise a commercial provider, following each person\'s preferences'],
    ['Interviews','Offered times and a calendar file','Calendar invites, reminders and video links where needed'],
    ['Employer checks','Companies House number checked for format','A live Companies House lookup, then a verification step by CPCA'],
    ['Badges','Sample badges','Issued and verified through Open Badge Factory, with existing badges carried over'],
    ['Daily Career Boost','Ten games with fixed daily puzzles and a sample leaderboard','New puzzles every day from the server, real leaderboards and badge awards'],
    ['Placements','Sample hours, goals and check ins','Hours approved by the employer, check ins visible to CPCA and a certificate issued at the end'],
    ['Reports','Charts and a CSV from sample data','Live figures, funder report templates and scheduled exports'],
    ['Programme rules','Saved in the browser','Managed by CPCA administrators, with every change in the audit log'],
    ['Messages','Sample threads','Real messaging between interns, employers and CPCA, logged for safeguarding']], 'cmp'))

add(h3('3.2', 'How it fits together', 's32'))
add(p('One web application serves all three groups of users from a single database. It connects to four well established outside services, one of which, Open Badge Factory, CPCA already uses for badges.'))
add(svgfig(arch_svg(), 'One platform serves interns, employers and CPCA staff from a single database.'))
add(p('Every screen in the demo maps onto the web app. Every rule the demo checks, such as minimum pay, moves into the API so it cannot be bypassed.'))

add(h3('3.3', 'Site structure', 's33'))
add(p('One platform replaces today\'s two near identical spaces, Talent Hive Starter and Talent Hive Connect. It has a public site and three signed in areas, each with its own menu. Starter and Connect roles become one jobs board with a filter for programme type.'))
add(svgfig(sitemap_svg(), 'Four doors on one platform, each with its own menu on shared data. Forty pages in all.'))

add(h3('3.4', 'The core journey: posted to placed', 's34'))
add(p('The whole loop that happens by email today runs inside the platform, so nobody has to chase anyone for an update. Every step is recorded, which is what makes the reporting in section 3.10 possible.'))
add(svgfig(journey_svg(), 'A role goes from posted to placed in six steps. Every arrow is a status change the other side sees straight away.', 'tall'))
add(p('If CPCA returns a listing, the employer edits and resubmits it. Interns who are not progressed hear the same day, with feedback and links to similar roles.'))

add(h3('3.5', 'Technology', 's35'))
add(p('The recommendation is a standard, widely supported web stack, so CPCA is not tied to one supplier and any competent team could pick it up later.'))
add(table(['Layer','Recommendation','Why'], [
    ['Front end','Next.js with React and TypeScript','Fast pages, strong accessibility tooling and a large pool of developers'],
    ['Back end','Node.js API (NestJS or Next.js server routes)','One language across the whole stack'],
    ['Database','PostgreSQL','Reliable, and relational data suits applications and reporting'],
    ['Search','PostgreSQL full text search first, Meilisearch when listings grow','Cheap to start and easy to upgrade'],
    ['Sign in','Passwordless email links for interns and employers, Microsoft sign in for CPCA staff','Fewer forgotten passwords, and staff use their work accounts'],
    ['Files','S3 compatible storage with virus scanning','Safe uploads of CVs and logos'],
    ['Notifications','GOV.UK Notify for email and text, or a commercial provider','Status changes reach people without them signing in'],
    ['Badges','Open Badge Factory API','Existing badges carry over'],
    ['Hosting','AWS London or Azure UK South','Data stays in the UK'],
    ['Analytics','Cookie free analytics plus reporting views in the database','Basic statistics without a consent banner']], 'cmp'))

add(h3('3.6', 'Data, privacy and security', 's36'))
add(p('The data model is small and mirrors the demo\'s sample data, so the screens already show how each record is used.'))
add(table(['Record','What it holds'], [
    ['Person','One per user, with a role: intern, employer user or CPCA staff'],
    ['Intern profile and CV','CV sections, skills, availability, and whether the intern can be found in talent search'],
    ['Organisation','An employer, its users and whether it has been verified'],
    ['Listing','Role, pay, hours, location, dates, screening questions and status (draft, waiting for approval, live or closed)'],
    ['Application','An intern\'s application to a listing, with an event recorded for every status change'],
    ['Placement','Created when an offer is accepted, with dates, hours, goals and check ins'],
    ['Supporting records','Badges, messages, event bookings, game results and the audit log of staff actions']], 'two'))
add(p('UK GDPR applies throughout. A data protection impact assessment comes before the build, along with a clear privacy notice and agreed retention periods, for example removing inactive intern data after a set time. People can download their own data, as the demo already shows.'))
add(p('Employers only see applicants to their own roles, or interns who have chosen to appear in talent search. Some interns may be vulnerable adults, so messages are logged and can be reported. The service should hold Cyber Essentials Plus and pass a penetration test before going live, with rate limiting and audit logs in place from the start.'))

add(h3('3.7', 'Accessibility', 's37'))
add(p('As a public sector body, CPCA must meet the Public Sector Bodies Accessibility Regulations 2018. Government monitoring has tested sites against WCAG 2.2 at levels A and AA since October 2024, so that is the standard for the build (<a href="https://www.gov.uk/guidance/accessibility-monitoring-how-we-test">GOV.UK</a>).'))
add(p('The demo already follows the core rules: readable text contrast, visible focus, full keyboard use, a label on every field and status never shown by colour alone. The full build adds screen reader testing in every sprint, a published accessibility statement and an independent audit before launch.'))

add(h3('3.8', 'Moving off My Skills Pass', 's38'))
add(p('The switch happens over one cohort, so nobody is left without a working site.'))
add('<ol class="steps">' + ''.join(f'<li>{t}</li>' for t in [
    'Run both sites side by side for the pilot cohort, with new listings posted only on the new platform.',
    'Import intern profiles and badge records, keeping Open Badge Factory as the issuer so every earned badge stays valid.',
    'Link each intern\'s old CV pages from their new profile until they have rebuilt their CV.',
    'Redirect the old Talent Hive spaces once the pilot cohort is placed.']) + '</ol>')

add(h3('3.9', 'Delivery plan', 's39'))
add(p('A pilot cohort could use the new site after about 13 weeks, with full switch over around week 25. These are early estimates to be firmed up in discovery, and CPCA signs off each gate on the plan before the next phase begins.'))
add(svgfig(roadmap_svg(), 'Interns use the new site from week 14, with full switch over by week 25. An estimate for a team of five.'))
add(p('The suggested team is a product lead, a UX and UI designer, two full stack developers and a part time tester covering quality and accessibility. A named programme owner at CPCA signs off each gate.'))

add(h3('3.10', 'Measuring success', 's310'))
add(p('None of these can be measured today, because applications happen by email outside the platform. Measuring them at all is the first win. The targets are proposals to agree with CPCA.'))
add(table(['Measure','Proposed target'], [
    ['Applications made inside the platform','All listings'],
    ['Median time from opening the jobs board to a submitted application','Under 3 minutes'],
    ['Median time for an employer to post a role','Under 10 minutes'],
    ['Listings with pay, hours, location and closing date filled in','All listings (required fields)'],
    ['Applications with a status update within 10 working days','90%'],
    ['Interns returning each week while they search','40%'],
    ['Placements per cohort','A baseline from the pilot, then an agreed growth target'],
    ['Blocking accessibility issues at WCAG 2.2 AA in the launch audit','None']], 'two target'))

add(h3('3.11', 'Risks', 's311'))
add(p('The biggest risk is building a better site that nobody moves to, so the pilot and the switch over matter as much as the design.'))
add(table(['Risk','How it is reduced'], [
    ['Employers keep emailing CPCA instead of using the portal','CPCA posts the first listing with each employer, then hands over'],
    ['Effort is duplicated while both sites run','One pilot cohort only, with a fixed switch over date'],
    ['Badge history is lost in the move','Open Badge Factory stays the issuer, and the import is tested early'],
    ['Accessibility slips late in the build','Screen reader and keyboard testing every sprint, not just before launch']], 'two'))

add(h2('A', 'Problems with today\'s site', 'sa'))
add(p('These twelve problems were found in a read only walkthrough of myskillspass.uk on 24 November 2026, signed in as an intern. The demo\'s About page links each one to its fix.'))
sev = lambda s: f'<span class="sev {s.lower()}">{s}</span>'
add(table(['Area','What happens today','Why it matters','Severity'], [
    ['Finding jobs','Vacancies sit in the home page News sidebar, mixed with welcome posts and event promotions. There is no search, filter, sector, pay field or closing date.','Interns have to scroll a narrow column and read every post to find a relevant role.', sev('High')],
    ['Applying','There is no apply button. The Rozier Group post has no contact route at all, and others say to email a named person.','Applications leave the platform, so nobody can see who applied, and some roles cannot be applied for.', sev('High')],
    ['My applications','The page lists badge applications (Week 1 Survey, Profile Creator, Digital CV Creator), not job applications.','The name promises the thing users need most and shows something else.', sev('High')],
    ['Employers','There is no employer portal. Employers sit in the same Members grid as interns, and their roles are posted as news.','Employers cannot post, edit or review applicants themselves, so CPCA staff do it by hand.', sev('High')],
    ['Messages','The Message Tool lists emails, most with blank subject lines. The preview opens a broken image.','Users cannot tell messages apart or read them.', sev('Medium')],
    ['Links','Opening a page address directly returns a plain 404 Not found page.','No page or job can be shared, bookmarked or linked from an email.', sev('Medium')],
    ['Two spaces','Talent Hive Starter (527 members) and Talent Hive Connect (198 members) have the same menus and near identical welcome content.','Users do not know which space they are in or why the jobs differ.', sev('Medium')],
    ['CVs','CVs are free form Pages listed publicly under Community, some titled Untitled.','Employers cannot search or compare candidates by skill, location or availability.', sev('Medium')],
    ['Layout','Three competing columns, an all capitals sidebar, small grey text, and key actions pointed at with rows of arrows.','There is no single clear next step, and the pages are hard to use on a phone.', sev('Medium')],
    ['Onboarding','The home page asks users to search the news feed on the right, and the Connect video list starts at step 2.','First impressions feel unfinished.', sev('Low')],
    ['Text','Job summaries show raw HTML code, such as &amp;amp; in place of &amp;.','It looks broken and untrustworthy.', sev('Low')],
    ['Community map','A world map for a programme limited to Cambridgeshire and Peterborough.','It adds noise without helping anyone.', sev('Low')]], 'four'))
add(p('Some things work well and are kept: the Get Started badge journey, Profile Power Up sessions, digital badges as proof of skills, and the welcome videos.'))

add(h2('B', 'Who the platform serves', 'sb').replace(' data-break="page"', ''))
add(p('The site has three audiences with different jobs to do. Today it only really serves the first, and not well.'))
add(table(['Audience','Who they are','What they need to do','What good looks like'], [
    ['Interns and jobseekers','Eligible residents of Cambridgeshire and Peterborough looking for paid six week internships, apprenticeships or work experience. Many are graduates or career changers, and some have additional needs.','Get ready with a profile, CV and badges, find relevant roles, apply, track progress and prepare for interviews.','Finds a suitable role in under 2 minutes and applies in under 3, from a phone, and always knows where each application stands.'],
    ['Employers','Local businesses, charities, schools and universities offering placements. Often small teams with no HR department.','Register and get verified, post a role, review and shortlist applicants, message them and confirm a placement.','Posts a role in under 10 minutes and sees suitable applicants within days, without emailing CPCA.'],
    ['CPCA programme team','Staff who run the internship programme and report on it to funders.','Approve employers and listings, check eligibility, nudge stalled applications, run events and report outcomes.','Sees every listing, application and placement in one place, and exports a funder report in one click.']], 'four aud'))
add(p('Careers advisers and training partners are a likely fourth audience later, with read only access to the interns they support.'))

add(h2('C', 'Design approach and visual language', 'sc').replace(' data-break="page"', ''))
add(p('A few principles shaped every screen. Jobs are the product, so the jobs board is a full page and never a feed in a sidebar. Each screen has one clear next step and one main button. Interns, employers and CPCA staff each get their own menu, built on the same data. Labels use plain words, so Applications always means job applications, and every flow works on a phone.'))
add(p('The look follows design references chosen for the project: an electric blue hero with light, oversized type, crisp white dashboards, pastel status tags and hatched chart fills. Dashed hairline grids and a dotted map of the region carry through the whole site.'))
sw = lambda c, b='': f'<span class="swatch" style="background:{c};{b}"></span>'
add(table(['Element','Value','Used for'], [
    [sw('#0F1222') + 'Ink','#0F1222','Text, dark sections and secondary buttons'],
    [sw('#2E3BFF') + 'Hive blue','#2E3BFF','Main buttons, links, active menu items and the hero'],
    [sw('#5A4BF2') + 'Violet','#5A4BF2','Statistics sections and gradients alongside the blue'],
    [sw('#1FA463') + 'Mint','#1FA463','Success states such as approved, shortlisted and placed'],
    [sw('#F4F5F8', 'border:1px solid #D5D9E3') + 'Surface','#F4F5F8 and white','Page background and panels'],
    ['Typeface','Geist, with Atkinson Hyperlegible for Easier reading','One clean family for the product, and a typeface designed for readers with low vision when they need it'],
    ['CPCA logo','Full colour on light pages, white on the blue hero, white lettering in dark mode','Shows the platform belongs to CPCA']], 'three tokens'))
add(p('The tone is second person, short sentences and no jargon: Apply now, not Submit expression of interest.'))

CONTENTS = [('s1','1','Summary',0),('s2','2','The demo today',0),('s21','2.1','What it is and how to use it',1),('s22','2.2','Visitors',1),('s23','2.3','Interns',1),('s24','2.4','Daily Career Boost',1),('s25','2.5','Employers',1),('s26','2.6','The CPCA team',1),('s27','2.7','Across every view',1),('s28','2.8','What is real and what is simulated',1),('s29','2.9','Five-minute walkthrough',1),('s210','2.10','How the demo was built and tested',1),
            ('s3','3','The finished platform',0),('s31','3.1','From demo to full platform',1),('s32','3.2','How it fits together',1),('s33','3.3','Site structure',1),('s34','3.4','The core journey: posted to placed',1),('s35','3.5','Technology',1),('s36','3.6','Data, privacy and security',1),('s37','3.7','Accessibility',1),('s38','3.8','Moving off My Skills Pass',1),('s39','3.9','Delivery plan',1),('s310','3.10','Measuring success',1),('s311','3.11','Risks',1),
            ('sa','A','Problems with today\'s site',0),('sb','B','Who the platform serves',0),('sc','C','Design approach and visual language',0)]
toc = ''.join(f'<li class="lv{lv}"><a href="#{i}"><span class="tn">{n}</span><span class="tt">{E(t)}</span><span class="dots"></span><span class="pg" data-for="{i}"></span></a></li>' for i, n, t, lv in CONTENTS)

COVER = f'''<section class="page cover" aria-label="Cover">
  <div class="cover-band">
    <div class="cv-grid" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="cv-top"><span class="cv-mark">th</span><span class="cv-word">Talent Hive</span></div>
    <div class="cv-title"><h1>A new internship platform for Cambridgeshire and Peterborough</h1><p>Demo guide and build specification</p></div>
    <span class="plus p1" aria-hidden="true"></span><span class="plus p2" aria-hidden="true"></span><span class="plus p3" aria-hidden="true"></span><span class="plus p4" aria-hidden="true"></span>
  </div>
  <div class="cover-foot">
    <div class="cf-for"><span class="lbl">Prepared for</span><img src="../assets/cpca-logo.png" alt="Cambridgeshire and Peterborough Combined Authority" width="210" height="60"></div>
    <dl class="cf-meta">
      <div><dt>Prepared by</dt><dd>Alexej Zhukov</dd></div>
      <div><dt>Date</dt><dd>24 November 2026</dd></div>
      <div><dt>Live demo</dt><dd><a href="{DEMO}">al3x3j02.github.io/talent-hive-concept</a></dd></div>
    </dl>
    <p class="cf-note">A working demo with sample data. This document and the demo are not official CPCA publications.</p>
  </div>
</section>'''

CONTENTS_PAGE = f'''<section class="page contents" aria-label="Contents">
  <div class="pbody static">
    <h2 class="toc-h">Contents</h2>
    <ol class="toc">{toc}</ol>
    <div class="about">
      <h3>About this document</h3>
      <p>Part 2 describes the working demo as it stands today, with a link to try every feature. Part 3 sets out how the full platform would be built. The appendices hold the evidence behind it.</p>
      <dl>
        <div><dt>Live demo</dt><dd><a href="{DEMO}">al3x3j02.github.io/talent-hive-concept</a></dd></div>
      </dl>
    </div>
  </div>
  <footer class="rf"><span>Talent Hive: demo guide and build specification</span><span class="pn">2</span></footer>
</section>'''

CSS = r'''
:root{--ink:#0F1222;--ink2:#30354A;--muted:#5D6375;--blue:#2E3BFF;--violet:#5A4BF2;--tint:#EEF0FF;--line:#E4E6ED;--desk:#E3E6EE;--font:"Geist","Inter",system-ui,-apple-system,"Segoe UI",sans-serif}
*{box-sizing:border-box}
html{background:var(--desk);-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font-family:var(--font);color:var(--ink);font-size:13.5px;line-height:1.58;font-feature-settings:"calt" 0}
a{color:var(--blue);text-decoration-thickness:1px;text-underline-offset:2px}
.bar{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;padding:10px 18px;background:rgba(15,18,34,.94);color:#fff;font-size:13px;backdrop-filter:blur(8px)}
.bar .t{font-weight:600}.bar .t span{opacity:.6;font-weight:400;margin-left:8px}
.bar .sp{flex:1}
.bar a,.bar button{font:inherit;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.28);background:none;border-radius:999px;padding:6px 14px;cursor:pointer}
.bar .pri{background:#fff;color:var(--ink);border-color:#fff;font-weight:600}
.bar a:hover,.bar button:hover{border-color:#fff}
.bar a:focus-visible,.bar button:focus-visible{outline:2px solid #fff;outline-offset:2px}
#pages{display:flex;flex-direction:column;align-items:center;gap:28px;padding:32px 0 64px}
.page{position:relative;width:210mm;height:297mm;background:#fff;box-shadow:0 1px 2px rgba(15,18,34,.08),0 18px 40px -18px rgba(15,18,34,.28);overflow:hidden;flex:none}
.pbody{position:absolute;top:84px;bottom:76px;left:68px;right:68px;overflow:hidden}
.pbody.static{top:64px}
.rh{position:absolute;top:32px;left:68px;right:68px;display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted);padding-bottom:10px;border-bottom:1px solid var(--line)}
.rh b{color:var(--ink);font-weight:600}
.rf{position:absolute;bottom:30px;left:68px;right:68px;display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted)}
.rf .pn{color:var(--ink);font-weight:600}
#flow{position:absolute;left:-9999px;top:0;width:calc(210mm - 136px)}
/* type */
h2{font-size:30px;line-height:1.15;font-weight:600;letter-spacing:-.015em;margin:0 0 22px;padding-bottom:18px;border-bottom:2px solid var(--ink);display:flex;align-items:baseline;gap:16px}
h2 .num{font-weight:300;color:var(--blue);font-size:30px;min-width:28px}
h3{font-size:17px;line-height:1.3;font-weight:600;margin:26px 0 8px;display:flex;gap:12px;align-items:baseline}
h3 .num{color:var(--blue);font-weight:500;font-size:14px;min-width:34px}
.pbody > h3:first-child{margin-top:0}
p{margin:0 0 11px;max-width:62em}
p.lead{font-size:15.5px;line-height:1.55;color:var(--ink2)}
/* tables */
table{width:100%;border-collapse:collapse;margin:12px 0 18px;font-size:12px;line-height:1.45}
th{text-align:left;font-weight:600;color:var(--ink);font-size:11px;padding:0 10px 8px 0;border-bottom:1.5px solid var(--ink);vertical-align:bottom}
td{padding:8px 10px 8px 0;border-bottom:1px solid var(--line);vertical-align:top;color:var(--ink2)}
td:first-child{font-weight:600;color:var(--ink)}
table.two td:first-child,table.two th:first-child{width:28%}
table.three td:first-child{width:22%}
table.three td:last-child{width:19%;white-space:nowrap}
table.cmp td:first-child{width:21%}
table.cmp td:nth-child(2){width:31%;color:var(--muted)}
table.four td:first-child{width:15%}
table.four td:last-child{width:11%}
table.aud td{width:25%!important;white-space:normal}
table.target td:first-child{width:62%;font-weight:500}
table.target td:last-child{font-weight:600;color:var(--ink)}
table.tokens td:last-child{white-space:normal;width:auto}
table.tokens td:first-child{white-space:nowrap}
.swatch{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:8px;vertical-align:-1px}
.sev{display:inline-block;font-size:10.5px;font-weight:600;padding:1px 8px;border-radius:999px}
.sev.high{background:#FDECEA;color:#B42318}.sev.medium{background:#FFF4E0;color:#8A4B00}.sev.low{background:#EEF0F5;color:#5D6375}
/* figures */
.fig{margin:14px 0 18px}
.fig img{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:6px;margin:0 auto}
.fig figcaption{font-size:11.5px;color:var(--muted);margin-top:7px;line-height:1.45}
.fig figcaption b{color:var(--ink);font-weight:600}
.fig.diagram svg{display:block;width:100%;height:auto;font-family:var(--font);margin:0 auto}
.fig.diagram{padding:14px 0 0;border-top:1px solid var(--line)}
/* lists */
ol.steps{margin:6px 0 16px;padding:0;list-style:none;counter-reset:s}
ol.steps li{counter-increment:s;position:relative;padding:0 0 9px 34px;margin:0 0 9px;border-bottom:1px solid var(--line)}
ol.steps li::before{content:counter(s);position:absolute;left:0;top:0;width:22px;height:22px;border-radius:50%;background:var(--tint);color:var(--blue);font-weight:600;font-size:11.5px;display:grid;place-items:center}
ol.steps li:last-child{border-bottom:0}
/* cover */
.cover-band{position:absolute;left:0;right:0;top:0;height:178mm;background:linear-gradient(155deg,#2E3BFF 0%,#3A3EF8 55%,#5A4BF2 100%);color:#fff;overflow:hidden}
.cv-grid{position:absolute;inset:0;display:flex;justify-content:space-evenly}
.cv-grid i{width:0;border-left:1px dashed rgba(255,255,255,.18)}
.cover-band::after{content:"";position:absolute;left:0;right:0;top:56%;border-top:1px dashed rgba(255,255,255,.18)}
.plus{position:absolute;width:14px;height:14px}
.plus::before,.plus::after{content:"";position:absolute;background:rgba(255,255,255,.7)}
.plus::before{left:6px;top:0;width:2px;height:14px}.plus::after{top:6px;left:0;height:2px;width:14px}
.p1{left:22px;top:22px}.p2{right:22px;top:22px}.p3{left:22px;bottom:22px}.p4{right:22px;bottom:22px}
.cv-top{position:absolute;left:68px;top:64px;display:flex;align-items:center;gap:12px}
.cv-mark{width:40px;height:40px;border-radius:11px;background:#fff;color:var(--blue);display:grid;place-items:center;font-weight:700;font-size:17px;letter-spacing:-.03em}
.cv-word{font-size:19px;font-weight:600}
.cv-title{position:absolute;left:68px;right:68px;bottom:64px}
.cv-title h1{font-size:50px;line-height:1.04;font-weight:300;letter-spacing:-.025em;margin:0 0 20px;max-width:560px}
.cv-title p{font-size:18px;margin:0;opacity:.85}
.cover-foot{position:absolute;left:68px;right:68px;top:calc(178mm + 48px);bottom:40px;display:flex;flex-direction:column}
.cf-for{display:flex;flex-direction:column;gap:12px;padding-bottom:28px;border-bottom:1px solid var(--line)}
.cf-for img{width:210px;height:auto}
.lbl,.cf-meta dt,.about dt{font-size:11px;color:var(--muted)}
.cf-meta{display:grid;grid-template-columns:1fr 1fr 1.7fr;gap:18px;margin:24px 0 0}
.cf-meta div{display:flex;flex-direction:column;gap:4px}
.cf-meta dd,.about dd{margin:0;font-weight:600;font-size:13px}
.cf-note{margin-top:auto;font-size:11px;color:var(--muted)}
/* contents */
.toc-h{border-bottom:2px solid var(--ink)}
.toc{list-style:none;padding:0;margin:0 0 22px}
.toc a{display:flex;align-items:baseline;gap:10px;color:var(--ink);text-decoration:none;padding:3px 0}
.toc a:hover .tt{color:var(--blue)}
.toc .lv0 a{font-weight:600;font-size:13.5px;padding-top:9px}
.toc .lv1 a{font-size:12.5px;color:var(--ink2);padding-left:26px;padding-top:2px;padding-bottom:2px}
.toc .tn{min-width:30px;color:var(--blue)}
.toc .lv1 .tn{min-width:34px;color:var(--muted)}
.toc .dots{flex:1;border-bottom:1px dotted #B9BFCC;transform:translateY(-4px)}
.toc .pg{min-width:18px;text-align:right;font-variant-numeric:tabular-nums}
.about{padding:16px 20px;background:#F6F7FA;border-radius:10px}
.about h3{margin:0 0 6px;font-size:14px}
.about p{font-size:12.5px;color:var(--ink2)}
.about dl{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;margin:12px 0 0}
.about dl div{display:flex;flex-direction:column;gap:3px}
.about dd{font-size:12px;word-break:break-word}
@media (max-width:640px){.bar{padding:8px 10px;font-size:12px}.bar .t span{display:none}.bar .sp{display:none}.bar a,.bar button{padding:5px 11px}}
@media print{
  @page{size:A4;margin:0}
  html,body{background:#fff}
  .bar{display:none}
  #pages{display:block;padding:0}
  .page{box-shadow:none;margin:0;break-after:page;zoom:1!important}
  .page:last-child{break-after:auto}
}
'''

JS = r'''
(async function(){
  const flow = document.getElementById('flow'), pages = document.getElementById('pages');
  try { await document.fonts.ready; } catch(e){}
  await Promise.all([...flow.querySelectorAll('img')].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  let n = 2, body;
  const fits = () => body.scrollHeight <= body.clientHeight + 1;
  const newPage = () => {
    n++;
    const pg = document.createElement('section'); pg.className = 'page';
    pg.innerHTML = '<header class="rh"><b>Talent Hive</b><span class="rhs"></span></header><div class="pbody"></div><footer class="rf"><span>Talent Hive: demo guide and build specification</span><span class="pn">' + n + '</span></footer>';
    pages.appendChild(pg); body = pg.querySelector('.pbody');
  };
  const carryHeadings = () => {           // keep headings, and a short intro under them, with what follows
    const kids = [...body.children]; let i = kids.length;
    if (i >= 2 && kids[i - 1].tagName === 'P' && kids[i - 1].offsetHeight < 80 && kids[i - 2].classList.contains('kwn')) i--;
    while (i > 0 && kids[i - 1].classList.contains('kwn')) i--;
    const carry = kids.slice(i);
    if (carry.length && i > 0 && carry.some(c => c.classList.contains('kwn'))){ newPage(); carry.forEach(c => body.appendChild(c)); return true; }
    return false;
  };
  const shrinkFigure = el => {          // let a figure scale down a little rather than leave a gap
    const media = el.querySelector('img,svg'); if (!media) return false;
    const over = body.scrollHeight - body.clientHeight, h = media.getBoundingClientRect().height;
    const ratio = (h - over - 4) / h;
    if (ratio < 0.74) return false;
    media.style.width = (ratio * 100).toFixed(1) + '%';
    if (fits()) return true;
    media.style.width = ''; return false;
  };
  const splitRows = (el, rowSel, makeRest) => {
    const rest = makeRest();
    const rows = () => el.querySelectorAll(rowSel);
    while (!fits() && rows().length > 1){ const r = rows(); rest.prepend(r[r.length - 1]); }
    return rest;
  };
  function place(el){
    if (el.dataset.break === 'page' && body.children.length) newPage();
    body.appendChild(el);
    if (fits()) return;
    if (el.tagName === 'TABLE' && el.tBodies[0].rows.length > 4){
      let restTable;
      const rest = splitRows(el.tBodies[0], 'tr', () => { restTable = el.cloneNode(false); restTable.appendChild(el.tHead.cloneNode(true)); const tb = document.createElement('tbody'); restTable.appendChild(tb); return tb; });
      if (rest.children.length === 1 && el.tBodies[0].rows.length > 2) rest.prepend(el.tBodies[0].rows[el.tBodies[0].rows.length - 1]);
      if (!fits() || el.tBodies[0].rows.length < 2){ body.removeChild(el); rest.prepend(...el.tBodies[0].rows); if (!carryHeadings()) newPage(); place(restTable); return; }
      if (rest.children.length){ newPage(); place(restTable); }
      return;
    }
    if (el.tagName === 'FIGURE' && shrinkFigure(el)) return;
    if (el.tagName === 'OL' && el.children.length > 1){
      const start = +(el.getAttribute('start') || 1);
      let restList;
      const rest = splitRows(el, ':scope > li', () => { restList = el.cloneNode(false); return restList; });
      if (rest.children.length){ restList.setAttribute('start', start + el.children.length); restList.style.counterReset = 's ' + (start + el.children.length - 1); newPage(); place(restList); }
      return;
    }
    body.removeChild(el);
    if (!body.children.length){ body.appendChild(el); return; }
    if (!carryHeadings()) newPage();
    body.appendChild(el);
  }
  newPage();
  [...flow.children].forEach(el => place(el));
  flow.remove();
  // running headers, contents page numbers
  let sec = '';
  pages.querySelectorAll('.page').forEach(pg => { const h = pg.querySelectorAll('h2'); const rhs = pg.querySelector('.rhs'); if (h.length) sec = h[h.length - 1].textContent.replace(/^(\d+|[A-C])/, '$1 '); if (rhs) rhs.textContent = sec.replace(/^([A-C]) /, 'Appendix $1. ').replace(/^(\d+) /, '$1. '); });
  const all = [...pages.querySelectorAll('.page')];
  document.querySelectorAll('.pg[data-for]').forEach(s => { const t = document.getElementById(s.dataset.for); if (t) s.textContent = all.indexOf(t.closest('.page')) + 1; });
  document.querySelector('.bar .count').textContent = all.length + ' pages';
  const fit = () => { const s = Math.min(1, (innerWidth - 16) / all[0].offsetWidth); all.forEach(p => p.style.zoom = s < 1 ? s : ''); };
  fit(); addEventListener('resize', fit);
  document.documentElement.dataset.ready = '1';
})();
'''

HTML = f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Talent Hive: demo guide and build specification</title>
<meta name="description" content="A working demo of a new Talent Hive internship platform for Cambridgeshire and Peterborough, and a specification for building it in full.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<div class="bar" role="banner"><span class="t">Talent Hive documentation<span class="count"></span></span><span class="sp"></span><a href="{DEMO}">Open the demo</a><a href="talent-hive-documentation.pdf" download>Download PDF</a><button class="pri" onclick="print()">Print or save</button></div>
<main id="pages">
{COVER}
{CONTENTS_PAGE}
</main>
<div id="flow" aria-hidden="true">
{chr(10).join(F)}
</div>
<script>{JS}</script>
</body>
</html>'''

out = Path(__file__).parent / 'docs' / 'index.html'
out.write_text(HTML)
print('wrote', out, len(HTML), 'bytes,', FIG[0], 'figures')
