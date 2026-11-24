import pathlib
src = pathlib.Path(__file__).parent / 'src'
css = (src/'styles.css').read_text()
js = '\n'.join((src/f).read_text() for f in ['data.js','core.js','extras.js','public.js','intern.js','intern2.js','games.js','games2.js','employer.js','employer2.js','cpca.js','cpca2.js','more.js'])
js += "\nrender();\nmaybeIntro();\n"
html = f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Talent Hive demo</title>
<meta name="description" content="A working demo by Alexej Zhukov of a redesigned Talent Hive internship platform in Cambridgeshire and Peterborough. Sample data only; not an official CPCA website.">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="Talent Hive demo by Alexej Zhukov">
<meta property="og:description" content="A clickable demo by Alexej Zhukov: a jobs board, applicant pipeline and approvals for interns, employers and the CPCA team. Sample data only.">
<meta property="og:type" content="website">
<meta property="og:image" content="https://al3x3j02.github.io/talent-hive-concept/preview.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div class="demobar" role="region" aria-label="Demo controls">
  <strong>Demo</strong><span class="note">By Alexej Zhukov. Sample data, not a real job board.</span><button class="about" data-act="about">About</button>
  <div class="roles"><span>View as</span>
    <button data-act="role" data-role="visitor" aria-pressed="true">Visitor</button>
    <button data-act="role" data-role="intern" aria-pressed="false">Intern</button>
    <button data-act="role" data-role="employer" aria-pressed="false">Employer</button>
    <button data-act="role" data-role="cpca" aria-pressed="false">CPCA team</button>
    <button class="reset" data-act="reset">Reset data</button>
    <button class="tourbtn" data-act="tour">Take the tour</button>
  </div>
</div>
<div id="app"></div>
<div id="modal-root"></div>
<div id="toast-root" aria-live="polite"></div>
<script>
{js}
</script>
</body>
</html>
'''
out = pathlib.Path(__file__).parent / 'index.html'
out.write_text(html)
print('wrote', out, len(html), 'bytes')
