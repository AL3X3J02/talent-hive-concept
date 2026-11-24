/* ---------- Sample data (all organisations and people are invented) ---------- */
const TODAY = new Date('2026-11-24T09:00:00');
const NLW = 12.71; // National Living Wage from April 2026

const SECTORS = [
  {id:'digital', name:'Digital and tech'},
  {id:'marketing', name:'Marketing and media'},
  {id:'construction', name:'Construction'},
  {id:'education', name:'Education'},
  {id:'health', name:'Health and care'},
  {id:'business', name:'Business and finance'},
  {id:'engineering', name:'Engineering'},
  {id:'charity', name:'Charity'},
  {id:'facilities', name:'Facilities'},
  {id:'science', name:'Science'}
];
const AREAS = ['Cambridge','Peterborough','Huntingdon','Ely','St Neots','Wisbech','March','St Ives','Northstowe','Alconbury Weald'];
const PROGRAMMES = ['Internship','Apprenticeship','Work experience'];

const seedEmployers = () => ({
  e1:{id:'e1',name:'Fenlight Digital',sector:'digital',town:'Cambridge',color:'#0E2A47',initials:'FD',verified:true,size:'24 staff',contact:'Priya Shah',about:'A web and app studio building digital services for councils, charities and growing local businesses.'},
  e2:{id:'e2',name:'Ouse Valley Housing',sector:'business',town:'Huntingdon',color:'#2F7F9E',initials:'OV',verified:true,size:'310 staff',contact:'Tom Reeve',about:'A housing association providing 6,000 affordable homes across Huntingdonshire.'},
  e3:{id:'e3',name:'Brightmark Media',sector:'marketing',town:'Peterborough',color:'#B4552E',initials:'BM',verified:true,size:'12 staff',contact:'Leah Morgan',about:'A content agency making video, social and campaign work for regional brands.'},
  e4:{id:'e4',name:'Granta Bioscience',sector:'science',town:'Cambridge',color:'#2F9E6E',initials:'GB',verified:true,size:'85 staff',contact:'Dr Ana Ruiz',about:'A research lab developing diagnostic tests, based on the Cambridge Science Park.'},
  e5:{id:'e5',name:'Nene Build Group',sector:'construction',town:'Peterborough',color:'#6B4E9B',initials:'NB',verified:true,size:'140 staff',contact:'Gary Holt',about:'A regional contractor building schools, homes and community buildings.'},
  e6:{id:'e6',name:'Isle of Ely Learning Trust',sector:'education',town:'Ely',color:'#8A6A1F',initials:'IE',verified:true,size:'420 staff',contact:'Megan Price',about:'A trust of seven primary and secondary schools in East Cambridgeshire.'},
  e7:{id:'e7',name:'Wisbech Community Larder',sector:'charity',town:'Wisbech',color:'#A13D63',initials:'WC',verified:true,size:'9 staff, 60 volunteers',contact:'Femi Adeyemi',about:'A food charity running a community shop, cookery classes and a weekly lunch club.'},
  e8:{id:'e8',name:'Lynchwood Engineering',sector:'engineering',town:'Peterborough',color:'#3E5C76',initials:'LE',verified:true,size:'60 staff',contact:'Rob Kaur',about:'Designs and builds precision parts for agricultural and food machinery.'},
  e9:{id:'e9',name:'Riverside Accounts',sector:'business',town:'St Neots',color:'#1F6F5C',initials:'RA',verified:true,size:'18 staff',contact:'Hannah Cole',about:'An accountancy practice supporting sole traders and small firms.'},
  e10:{id:'e10',name:'Northstowe Facilities Co',sector:'facilities',town:'Northstowe',color:'#556270',initials:'NF',verified:true,size:'45 staff',contact:'Dan Webb',about:'Runs and maintains community buildings and sports facilities in Northstowe.'},
  e11:{id:'e11',name:'Hinchingbrooke Health Partners',sector:'health',town:'Huntingdon',color:'#C0392B',initials:'HH',verified:true,size:'200 staff',contact:'Sara Lund',about:'A GP federation covering 14 practices across Huntingdonshire.'},
  e12:{id:'e12',name:'Fen Edge Farms',sector:'science',town:'March',color:'#5E7D2B',initials:'FE',verified:false,size:'30 staff',contact:'Will Barnes',about:'A family farming business trialling sensors and data to cut water and fertiliser use.'},
  e13:{id:'e13',name:'Cambridge Sports Hub',sector:'marketing',town:'Cambridge',color:'#00708A',initials:'CS',verified:true,size:'35 staff',contact:'Jas Bhatt',about:'A community sports centre with courts, a gym and holiday camps for children.'}
});

const d = (s) => new Date(s + 'T09:00:00');

const seedJobs = () => [
  {id:'j1',emp:'e1',title:'Junior Web Developer Intern',sector:'digital',area:'Cambridge',mode:'Hybrid',hours:30,pay:13.50,weeks:6,programme:'Internship',posted:'2026-11-18',closes:'2026-12-04',starts:'2027-01-11',status:'live',views:412,
   summary:'Help build accessible websites for local councils and charities, working alongside two senior developers.',
   duties:['Build and test page components in HTML, CSS and JavaScript','Fix bugs reported by clients and write clear notes on what changed','Check pages work with a keyboard and screen reader','Join daily stand-ups and a weekly show-and-tell'],
   needs:['Some coding experience from study, a course or your own projects','Willing to learn Git and code review','Clear written English'],
   skills:['HTML','CSS','JavaScript','Git','Accessibility'],
   questions:['Share a link to something you have built, or describe it in two or three sentences.','Which days could you work in our Cambridge studio?']},
  {id:'j2',emp:'e1',title:'Data and AI Intern',sector:'digital',area:'Cambridge',mode:'Hybrid',hours:30,pay:13.50,weeks:6,programme:'Internship',posted:'2026-11-20',closes:'2026-12-11',starts:'2027-01-11',status:'live',views:233,
   summary:'Explore how AI tools can speed up our testing and reporting, and build a small internal prototype.',
   duties:['Clean and analyse project data in spreadsheets and Python','Test AI tools against real tasks and write up what works','Build a simple prototype with a mentor'],
   needs:['Comfortable with spreadsheets','Curious about AI and willing to test ideas carefully','Basic Python is a plus, not required'],
   skills:['Python','Excel','Data','AI tools'],
   questions:['Tell us about a time you used data to answer a question.']},
  {id:'j3',emp:'e3',title:'Social Media and Content Intern',sector:'marketing',area:'Peterborough',mode:'On-site',hours:25,pay:12.80,weeks:6,programme:'Internship',posted:'2026-11-10',closes:'2026-12-02',starts:'2027-01-04',status:'live',views:520,
   summary:'Plan, film and post short-form content for three regional clients across Instagram, TikTok and LinkedIn.',
   duties:['Film and edit short videos on a phone and in CapCut','Write captions in each client\'s tone of voice','Track what performs and suggest improvements each week'],
   needs:['A few examples of content you have made, for yourself or others','Good eye for detail','Happy to work in a busy studio'],
   skills:['Content creation','Copywriting','Video editing','Social media'],
   questions:['Share up to three links to content you have made.']},
  {id:'j4',emp:'e2',title:'Customer Insight Intern',sector:'business',area:'Huntingdon',mode:'Hybrid',hours:30,pay:13.10,weeks:6,programme:'Internship',posted:'2026-11-05',closes:'2026-11-30',starts:'2027-01-04',status:'live',views:288,
   summary:'Turn tenant survey results into clear findings that help us improve repairs and communication.',
   duties:['Analyse survey responses and repair data','Interview a small group of tenants by phone','Present findings to the customer services team'],
   needs:['Confident with spreadsheets','Friendly phone manner','Able to explain numbers simply'],
   skills:['Excel','Research','Presenting','Data'],
   questions:['Why does customer insight matter to a housing association?']},
  {id:'j5',emp:'e4',title:'Lab Operations Intern',sector:'science',area:'Cambridge',mode:'On-site',hours:37.5,pay:14.20,weeks:6,programme:'Internship',posted:'2026-11-12',closes:'2026-12-09',starts:'2027-01-18',status:'live',views:301,
   summary:'Keep a busy diagnostics lab running: stock, sample logging and equipment checks.',
   duties:['Log and track samples in our lab system','Manage stock and reorder supplies','Support scientists with equipment checks'],
   needs:['A science qualification at A level or above','Careful and organised','Happy to follow strict safety procedures'],
   skills:['Lab safety','Organisation','Data entry'],
   questions:['Describe a time you followed a detailed procedure precisely.']},
  {id:'j6',emp:'e5',title:'Site Coordinator Intern',sector:'construction',area:'Peterborough',mode:'On-site',hours:37.5,pay:13.00,weeks:6,programme:'Internship',posted:'2026-11-16',closes:'2026-12-14',starts:'2027-01-11',status:'live',views:175,
   summary:'Support the site manager on a new primary school build, from deliveries to safety briefings.',
   duties:['Book and check deliveries','Keep site records and photos up to date','Help run morning safety briefings'],
   needs:['A CSCS card or willingness to get one (we pay)','Organised and confident speaking to trades','Able to start at 7.30am'],
   skills:['Organisation','Health and safety','Communication'],
   questions:['Do you hold a CSCS card? If not, are you happy to take the test?']},
  {id:'j7',emp:'e6',title:'Education Support Intern',sector:'education',area:'Ely',mode:'On-site',hours:30,pay:12.71,weeks:6,programme:'Internship',posted:'2026-11-19',closes:'2026-12-10',starts:'2027-01-06',status:'live',views:196,
   summary:'Support teachers and pupils in a secondary school, including small-group reading sessions.',
   duties:['Run small-group reading and maths catch-up sessions','Help prepare lesson resources','Support pupils during lessons and clubs'],
   needs:['Patience and a positive attitude','An enhanced DBS check (we arrange it)','Interest in teaching'],
   skills:['Communication','Mentoring','Planning'],
   questions:['Why are you interested in working in a school?']},
  {id:'j8',emp:'e7',title:'Fundraising and Events Intern',sector:'charity',area:'Wisbech',mode:'On-site',hours:22,pay:12.71,weeks:6,programme:'Internship',posted:'2026-11-21',closes:'2026-12-16',starts:'2027-01-11',status:'live',views:94,
   summary:'Plan our spring fundraising lunch and grow our local supporter list.',
   duties:['Plan a fundraising lunch for 80 guests','Contact local businesses for raffle prizes','Write posts and posters about the event'],
   needs:['Friendly and well organised','Comfortable talking to people you have not met','Interest in community work'],
   skills:['Events','Communication','Copywriting'],
   questions:['Tell us about an event or activity you have helped organise.']},
  {id:'j9',emp:'e8',title:'CAD Design Engineering Intern',sector:'engineering',area:'Peterborough',mode:'On-site',hours:37.5,pay:14.00,weeks:6,programme:'Internship',posted:'2026-11-14',closes:'2026-12-12',starts:'2027-01-11',status:'live',views:210,
   summary:'Draw and update 3D models and technical drawings for machine parts.',
   duties:['Update 3D models in SolidWorks','Produce technical drawings for the workshop','Join design reviews with engineers'],
   needs:['Studying or completed engineering or product design','Some CAD experience','Good spatial awareness'],
   skills:['CAD','SolidWorks','Technical drawing'],
   questions:['Which CAD software have you used, and for what?']},
  {id:'j10',emp:'e9',title:'Finance and Admin Intern',sector:'business',area:'St Neots',mode:'On-site',hours:30,pay:12.90,weeks:6,programme:'Internship',posted:'2026-11-08',closes:'2026-12-05',starts:'2027-01-04',status:'live',views:143,
   summary:'Help a busy practice through January tax season with bookkeeping and client admin.',
   duties:['Enter receipts and reconcile bank statements','Prepare client files for accountants','Answer client emails and calls'],
   needs:['Confident with numbers and spreadsheets','Careful with confidential information'],
   skills:['Excel','Bookkeeping','Admin'],
   questions:['How would you keep track of 30 client files with different deadlines?']},
  {id:'j11',emp:'e10',title:'Facilities Assistant Intern',sector:'facilities',area:'Northstowe',mode:'On-site',hours:20,pay:12.71,weeks:6,programme:'Work experience',posted:'2026-11-17',closes:'2026-12-18',starts:'2027-01-11',status:'live',views:88,
   summary:'Keep community buildings safe, clean and ready for bookings, with paid training.',
   duties:['Set up halls and sports rooms for bookings','Do daily safety checks','Report repairs and follow them up'],
   needs:['Reliable and practical','Happy to work afternoons and some evenings'],
   skills:['Health and safety','Customer service'],
   questions:['Which afternoons and evenings are you available?']},
  {id:'j12',emp:'e11',title:'Patient Services Admin Intern',sector:'health',area:'Huntingdon',mode:'On-site',hours:30,pay:12.95,weeks:6,programme:'Internship',posted:'2026-11-13',closes:'2026-12-08',starts:'2027-01-04',status:'live',views:167,
   summary:'Help reception teams and run a project to reduce missed appointments.',
   duties:['Support reception and phone teams','Analyse missed-appointment data','Help test a text reminder trial'],
   needs:['Calm and kind on the phone','Comfortable with computers'],
   skills:['Customer service','Admin','Data'],
   questions:['How would you handle a frustrated caller?']},
  {id:'j13',emp:'e1',title:'UX Design Intern',sector:'digital',area:'Cambridge',mode:'Hybrid',hours:30,pay:13.50,weeks:6,programme:'Internship',posted:'',closes:'2027-01-15',starts:'2027-02-08',status:'draft',views:0,
   summary:'Research and design improvements to a council service used by 40,000 residents.',
   duties:['Run user interviews','Sketch and prototype screens in Figma'],needs:['A portfolio of design work'],skills:['Figma','User research'],questions:[]},
  {id:'j14',emp:'e12',title:'Agri-tech Data Intern',sector:'science',area:'March',mode:'On-site',hours:30,pay:13.00,weeks:6,programme:'Internship',posted:'',closes:'2026-12-20',starts:'2027-01-18',status:'pending',views:0,submitted:'2026-11-22',
   summary:'Set up soil sensors and turn the readings into weekly reports for our farm team.',
   duties:['Install and check field sensors','Build a weekly dashboard from sensor data'],needs:['Comfortable outdoors in all weather','Some spreadsheet skills'],skills:['Data','Excel'],questions:['Do you have a driving licence?']},
  {id:'j15',emp:'e13',title:'Marketing Assistant Intern',sector:'marketing',area:'Cambridge',mode:'On-site',hours:20,pay:12.20,weeks:6,programme:'Internship',posted:'',closes:'2026-12-15',starts:'2027-01-11',status:'pending',views:0,submitted:'2026-11-23',
   summary:'Promote our holiday camps and new membership offer.',
   duties:['Create posters and social posts','Help run an open day'],needs:['Creative and organised'],skills:['Content creation','Events'],questions:[]}
];

const seedInterns = () => ({
  i1:{id:'i1',name:'Jordan Ellis',headline:'Computer Science graduate looking for a first role in web development',area:'Peterborough',color:'#0B78B0',skills:['HTML','CSS','JavaScript','Python','Git','Excel'],badges:4,availability:'From January 2027',talent:true,sectors:['digital','business']},
  i2:{id:'i2',name:'Amira Haddad',headline:'Graphic design graduate with a strong social media portfolio',area:'Cambridge',color:'#B4552E',skills:['Figma','Content creation','Copywriting','CSS'],badges:5,availability:'Now',talent:true},
  i3:{id:'i3',name:'Callum Reid',headline:'Career changer from retail, self-taught JavaScript developer',area:'Huntingdon',color:'#2F9E6E',skills:['JavaScript','HTML','React','Customer service'],badges:3,availability:'From January 2027',talent:true},
  i4:{id:'i4',name:'Priyanka Nair',headline:'MSc Data Science, interested in AI for public services',area:'Cambridge',color:'#6B4E9B',skills:['Python','Data','AI tools','Excel'],badges:6,availability:'Now',talent:true},
  i5:{id:'i5',name:'Ben Okoro',headline:'Web development bootcamp graduate who loves accessibility',area:'St Ives',color:'#00708A',skills:['HTML','CSS','Accessibility','Git'],badges:4,availability:'From January 2027',talent:true},
  i6:{id:'i6',name:'Lucy Tran',headline:'Maths graduate keen to work with data',area:'Ely',color:'#8A6A1F',skills:['Excel','Python','Data'],badges:2,availability:'Now',talent:false},
  i7:{id:'i7',name:'Kieran Walsh',headline:'Former apprentice electrician moving into tech support',area:'Wisbech',color:'#556270',skills:['Customer service','Hardware','HTML'],badges:3,availability:'From February 2027',talent:true},
  i8:{id:'i8',name:'Sofia Marques',headline:'Engineering student with CAD and 3D printing experience',area:'Peterborough',color:'#A13D63',skills:['CAD','SolidWorks','Technical drawing'],badges:4,availability:'From January 2027',talent:true},
  i9:{id:'i9',name:'Tariq Ahmed',headline:'Business graduate with bookkeeping experience',area:'St Neots',color:'#1F6F5C',skills:['Bookkeeping','Excel','Admin'],badges:3,availability:'Now',talent:true}
});

const STATUS_FLOW = ['applied','viewed','shortlisted','interview','offer','placed'];
const STATUS_LABEL = {applied:'Applied',viewed:'Viewed',shortlisted:'Shortlisted',interview:'Interview',offer:'Offer',placed:'Placed',notprogressed:'Not progressed'};

const seedApps = () => [
  {id:'a1',job:'j1',intern:'i1',status:'shortlisted',note:'I build small sites in my spare time and want to learn how a studio works with real clients.',answers:['I built a revision timetable app for my course mates in plain JavaScript.','Tuesday to Thursday'],history:[['applied','2026-11-18'],['viewed','2026-11-19'],['shortlisted','2026-11-21']],empNotes:'Good portfolio link. Ask about accessibility testing.'},
  {id:'a2',job:'j4',intern:'i1',status:'interview',note:'',answers:['It shows where tenants struggle so services can be fixed first.'],history:[['applied','2026-11-06'],['viewed','2026-11-10'],['shortlisted','2026-11-14'],['interview','2026-11-20']],interview:'Thursday 3 December, 10:30. Ouse Valley Housing, Huntingdon',when:'2026-12-03T10:30',where:'Ouse Valley Housing, Huntingdon'},
  {id:'a3',job:'j3',intern:'i1',status:'viewed',note:'',answers:['jordan-ellis.example/projects'],history:[['applied','2026-11-15'],['viewed','2026-11-17']]},
  {id:'a4',job:'j12',intern:'i1',status:'notprogressed',note:'',answers:[''],history:[['applied','2026-11-02'],['viewed','2026-11-04'],['notprogressed','2026-11-12']],feedback:'Thank you for applying. We chose candidates with more phone-based customer service experience.'},
  {id:'a5',job:'j1',intern:'i3',status:'applied',history:[['applied','2026-11-23']],note:'Career changer, built three React projects this year.',answers:['A booking app for my old shop.','Monday to Wednesday']},
  {id:'a6',job:'j1',intern:'i5',status:'shortlisted',history:[['applied','2026-11-19'],['shortlisted','2026-11-22']],note:'Accessibility is the part of web work I enjoy most.',answers:['An accessible recipe site.','Any day']},
  {id:'a7',job:'j1',intern:'i2',status:'applied',history:[['applied','2026-11-22']],note:'',answers:['My portfolio site, built in Webflow and CSS.','Wednesday and Thursday']},
  {id:'a8',job:'j1',intern:'i7',status:'interview',history:[['applied','2026-11-18'],['shortlisted','2026-11-20'],['interview','2026-11-23']],note:'',answers:['A home network dashboard.','Any day'],interview:'Friday 27 November, 14:00, Fenlight Digital'},
  {id:'a9',job:'j2',intern:'i4',status:'applied',history:[['applied','2026-11-21']],note:'My dissertation compared AI summarisation tools for council documents.',answers:['I analysed bus usage data to suggest new routes.']},
  {id:'a10',job:'j2',intern:'i6',status:'applied',history:[['applied','2026-11-22']],note:'',answers:['Tracked my running data in Python.']},
  {id:'a11',job:'j3',intern:'i2',status:'interview',history:[['applied','2026-11-12'],['interview','2026-11-19']],note:'',answers:['amira.example']},
  {id:'a12',job:'j9',intern:'i8',status:'offer',history:[['applied','2026-11-14'],['interview','2026-11-18'],['offer','2026-11-22']],note:'',answers:['SolidWorks at university.']},
  {id:'a13',job:'j10',intern:'i9',status:'viewed',history:[['applied','2026-11-09'],['viewed','2026-11-10']],note:'',answers:['A colour-coded tracker with due dates.']}
];

const seedThreads = () => [
  {id:'t1',role:'intern',with:'Ouse Valley Housing',subject:'Interview invitation: Customer Insight Intern',unread:true,msgs:[
    {from:'them',text:'Hi Jordan, thanks for your application. We would like to invite you to an interview on Thursday 3 December at 10:30 at our Huntingdon office.',t:'20 Nov, 14:12'},
    {from:'them',text:'It will last about 40 minutes. You will meet Tom Reeve and one of our tenant liaison officers. Please bring an example of a spreadsheet you have built.',t:'20 Nov, 14:13'}]},
  {id:'t2',role:'intern',with:'Fenlight Digital',subject:'You have been shortlisted: Junior Web Developer Intern',unread:false,msgs:[
    {from:'them',text:'Hi Jordan, great to see your timetable app. We have shortlisted you and will be in touch about interviews next week.',t:'21 Nov, 09:40'},
    {from:'me',text:'Thank you, I am really looking forward to it.',t:'21 Nov, 10:02'}]},
  {id:'t3',role:'intern',with:'CPCA Talent Hive team',subject:'Profile Power Up: Wednesday 9 December',unread:false,msgs:[
    {from:'them',text:'Our next online Profile Power Up session is on Wednesday 9 December, 10am to 11am. Book from the Events page.',t:'18 Nov, 11:00'}]},
  {id:'t4',role:'employer',with:'Ben Okoro',subject:'Junior Web Developer Intern: question about start date',unread:true,msgs:[
    {from:'them',text:'Hello, could the placement start on 18 January instead of 11 January? I finish a course that week.',t:'23 Nov, 16:20'}]},
  {id:'t5',role:'employer',with:'CPCA Talent Hive team',subject:'Your listing UX Design Intern is still a draft',unread:false,msgs:[
    {from:'them',text:'Hi Priya, just a reminder that your UX Design Intern listing is saved as a draft. Submit it when ready and we will review it within two working days.',t:'22 Nov, 10:15'}]}
];

const EVENTS = [
  {id:'ev1',date:'2026-12-02',title:'Employer meet-up: digital and creative',where:'Peterborough Central Library',time:'17:30 to 19:00',type:'In person'},
  {id:'ev2',date:'2026-12-09',title:'Profile Power Up',where:'Online',time:'10:00 to 11:00',type:'Online'},
  {id:'ev3',date:'2026-12-15',title:'Interview practice clinic',where:'Online',time:'13:00 to 14:00',type:'Online'},
  {id:'ev4',date:'2027-01-13',title:'Profile Power Up',where:'Online',time:'10:00 to 11:00',type:'Online'}
];

const BADGES = {
  start:[
    {name:'Participant Expression of Interest',earned:true},
    {name:'Profile Creator',earned:true},
    {name:'Digital CV Creator',earned:true},
    {name:'Week 1 Survey Completer',earned:true}],
  enhance:[
    {name:'Volunteering',earned:false},
    {name:'Experience of Work',earned:false},
    {name:'Entrepreneurship',earned:false}],
  boost:[
    {name:'7-day Boost streak',earned:false},
    {name:'30-day Boost streak',earned:false}]
};

const seedCV = () => ({
  name:'Jordan Ellis',
  headline:'Computer Science graduate looking for a first role in web development',
  email:'jordan.ellis@example.com',
  area:'Peterborough',
  about:'I enjoy building simple, useful websites and fixing things until they work properly. I am looking for a placement where I can learn from experienced developers and work on real projects.',
  exp:[
    {role:'Weekend Team Member',org:'Queensgate Bookshop, Peterborough',dates:'2022 to 2025',desc:'Served customers, ran the till and kept stock tidy. Trained four new starters.'},
    {role:'Volunteer Website Helper',org:'Orton Community Garden',dates:'2024',desc:'Rebuilt the garden\'s website and taught volunteers how to update it.'}],
  edu:[{course:'BSc Computer Science (2:1)',org:'Anglia Ruskin University',dates:'2022 to 2025'}],
  skills:['HTML','CSS','JavaScript','Python','Git','Excel'],
  showBadges:true
});

const DEMO_PEOPLE = {intern:'i1', employer:'e1', employerUser:'Priya Shah', staff:'Sam Okafor'};

/* Games content */
const WORDS = [
  {w:'PITCH',def:'a short, persuasive talk about an idea or about yourself. Practise a 30-second version for interviews.'},
  {w:'SKILL',def:'something you can do well. Employers look for evidence, so pair each skill with an example.'},
  {w:'BRIEF',def:'the instructions for a piece of work. Read it twice and ask questions early.'},
  {w:'SHIFT',def:'a set period of work. Arrive a few minutes early for your first one.'},
  {w:'TEAMS',def:'groups who work together, and also a common meeting app. Test your camera before a video interview.'},
  {w:'DRAFT',def:'a first version. Sharing drafts early saves time later.'},
  {w:'GOALS',def:'what you want to achieve. Set two or three for your placement in week one.'},
  {w:'AGILE',def:'a way of working in short cycles with regular check-ins, common in tech teams.'},
  {w:'CHART',def:'a picture of data. Give every chart a title that says what it shows.'},
  {w:'LEARN',def:'what a placement is for. Keep a short log of what you learn each week.'}
];
const QUIZ = [
  {q:'You will be 10 minutes late on your first day because of a train delay. What is the best thing to do?',
   opts:['Say nothing and apologise when you arrive','Message your manager before your start time with your new arrival time','Wait until lunch to explain'],a:1,
   why:'Letting your manager know early shows you are reliable, even when things go wrong.'},
  {q:'An interviewer says "Tell me about yourself". How long should your answer be?',
   opts:['About 10 seconds','About 1 to 2 minutes, focused on the role','5 minutes or more, covering everything'],a:1,
   why:'One to two minutes is enough to cover your background, a relevant strength and why you want the role.'},
  {q:'What does STAR stand for when answering interview questions?',
   opts:['Situation, Task, Action, Result','Start, Talk, Answer, Repeat','Skills, Training, Attitude, Reliability'],a:0,
   why:'STAR helps you give a clear example: what happened, what you had to do, what you did and how it turned out.'},
  {q:'You do not understand a task your manager has given you. What should you do?',
   opts:['Guess and hope for the best','Ask a clarifying question and repeat back what you heard','Wait until someone notices'],a:1,
   why:'Asking early saves time for everyone. Repeating back the task checks you both mean the same thing.'},
  {q:'Which is the best subject line when emailing your CV?',
   opts:['Hi','CV attached!!!','Application for Junior Web Developer Intern, Jordan Ellis'],a:2,
   why:'A clear subject line with the role and your name helps the employer find and file your email.'}
];
const MATCH = [
  {skill:'Writing captions in a brand\'s voice',job:'Social Media and Content Intern'},
  {skill:'Reading technical drawings',job:'CAD Design Engineering Intern'},
  {skill:'Reconciling bank statements',job:'Finance and Admin Intern'},
  {skill:'Using Git and code review',job:'Junior Web Developer Intern'}
];

/* Programme reporting sample data (CPCA view) */
const WEEKLY_APPS = [
  {w:'5 Oct',n:18},{w:'12 Oct',n:22},{w:'19 Oct',n:27},{w:'26 Oct',n:24},{w:'2 Nov',n:31},{w:'9 Nov',n:38},{w:'16 Nov',n:44},{w:'23 Nov',n:29}
];
const PLACEMENTS_BY_SECTOR = [
  {s:'Digital and tech',n:14},{s:'Business and finance',n:11},{s:'Marketing and media',n:9},{s:'Health and care',n:7},{s:'Education',n:6},{s:'Engineering',n:5},{s:'Construction',n:4},{s:'Charity',n:3}
];
