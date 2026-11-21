const contactLinks = [
  { label: 'Email Pavithar', href: 'mailto:pavitharmangaleswaran@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/PavitharM' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pavithar81' },
];

export const suggestedQuestions = [
  'What projects has he built?',
  'What are his skills?',
  'Where does he study?',
  'What experience does he have?',
  'Does he have certificates?',
  'How can I contact him?',
];

const topics = [
  { match: /\b(law\s?link|legal|lawyer)\b/, text: 'LawLink is a legal consultation platform for Sri Lanka. Clients can find a lawyer, submit a complaint, and follow their case on web and mobile. The portfolio lists React, Express, Expo, and MySQL.', links: [{ label: 'View LawLink', href: 'https://law-link-consulatation.vercel.app' }, { label: 'LawLink source', href: 'https://github.com/PavitharM/LawLink_Consulatation' }] },
  { match: /\b(split\s?calc|expense|expenses|bill|bills)\b/, text: 'SplitCalc is an expense calculator for friends. Add people and transactions to see how shared costs settle. It is built with React, JavaScript, and Vite.', links: [{ label: 'SplitCalc source', href: 'https://github.com/PavitharM/SplitCalc_Calculator' }, { label: 'View projects', href: '#projects' }] },
  { match: /\b(daily\s?focus)\b/, text: 'Daily Focus is a sample mobile app concept in the collection. It demonstrates a productivity app layout; it is not presented as a completed project.', links: [{ label: 'Browse collections', href: '#skills' }] },
  { match: /\b(certificat\w*|credential\w*|award\w*)\b/, text: 'The Certifications collection currently contains sample Web Development and UI/UX Design certificates. These are demonstration layouts, not earned credentials. No verified certificates have been added yet.', links: [{ label: 'Browse collections', href: '#skills' }] },
  { match: /\b(contact|email|e mail|gmail|github|linked\s?in|reach|hire|hiring|available|availability|connect)\b/, text: 'Pavithar is open to connect. You can email pavitharmangaleswaran@gmail.com or reach him through GitHub and LinkedIn. For opportunities or availability details, contact him directly.', links: contactLinks },
  { match: /\b(educat\w*|study|studies|studying|university|college|school|degree|undergraduate|qualifications|advanced level|ordinary level)\b/, text: 'Pavithar is a software engineering undergraduate at Sabaragamuwa University of Sri Lanka. His GCE Advanced Level and Ordinary Level education were completed at BT/KK/KATHIRAVELY V.M.V.', links: [{ label: 'Read his education', href: '#about' }] },
  { match: /\b(volunteer\w*|teaching|experience|career|journey)\b/, text: 'His experience includes 6 months of volunteer teaching and 3 months as a Data Collecting Volunteer Officer at the Divisional Secretary Office. The portfolio also describes work on LawLink’s web and mobile workflows and Tuto Tracker’s QR attendance system.', links: [{ label: 'About Pavithar', href: '#about' }, { label: 'Project experience', href: '#experience' }] },
  { match: /\b(mobile|android|ios|expo|react native)\b/, text: 'His mobile toolkit includes React Native and Expo Router. LawLink Mobile connects clients and lawyers to the shared legal consultation service. The mobile collection also includes Daily Focus, which is clearly marked as a sample concept.', links: [{ label: 'Mobile source code', href: 'https://github.com/PavitharM/LawLink_Consulatation' }, { label: 'Browse collections', href: '#skills' }] },
  { match: /\b(design|ui|ux|interface\w*)\b/, text: 'The Design Projects collection showcases the LawLink and SplitCalc interfaces. Pavithar’s biography describes an interest in UI/UX design alongside full-stack development and project management.', links: [{ label: 'Explore design collection', href: '#skills' }] },
  { match: /\b(skill\w*|technolog\w*|stack|tool\w*|language\w*|frontend|backend|database\w*|react|javascript|node|express|flask|mysql|sqlite|prisma|tailwind|vite|git)\b/, text: 'His toolkit includes React, JavaScript, and Tailwind CSS for frontend; Node.js, Express, and Flask for backend; React Native and Expo Router for mobile; MySQL, SQLite, and Prisma for databases; and Git, GitHub, Vite, and VS Code.', links: [{ label: 'View all skills', href: '#skills' }] },
  { match: /\b(project\w*|portfolio|built|builds|building|work|works|website\w*|web development)\b/, text: 'Featured projects are LawLink, a legal consultation platform, and SplitCalc, an expense calculator for friends. You can also open the Design, Web, Mobile, and Certifications cards to browse the layered collections. Sample content is labeled.', links: [{ label: 'Featured projects', href: '#projects' }, { label: 'Explore collections', href: '#skills' }] },
  { match: /\b(interest\w*|hobb\w*|football|reading|books|free time)\b/, text: 'His interests are researching business-related topics, exploring emerging technologies, reading books, and playing football.', links: [{ label: 'More about Pavithar', href: '#about' }] },
  { match: /\b(where.*(live|based|from)|location|country|sri lanka|time zone|timezone)\b/, text: 'Pavithar is based in Sri Lanka. The portfolio displays Sri Lanka local time, GMT+5:30.', links: [{ label: 'About Pavithar', href: '#about' }] },
  { match: /\b(who|biography|about him|about you|introduce|your name|his name|pavithar|pavi)\b/, text: 'Pavithar M is a software engineering undergraduate at Sabaragamuwa University of Sri Lanka. He builds web and mobile applications and is interested in full-stack development, UI/UX design, and project management. I’m his portfolio guide.', links: [{ label: 'Read his biography', href: '#about' }] },
  { match: /^(hi|hello|hey|hey there|good morning|good evening)[!. ]*$/, text: 'Hello! I’m Pavi’s portfolio guide. Ask me about his projects, skills, education, experience, or how to get in touch.', links: [] },
  { match: /\b(thanks|thank you)\b/, text: 'You’re welcome! There’s more to explore in the project collections.', links: [{ label: 'Explore collections', href: '#skills' }] },
];

export function answerPortfolioQuestion(question) {
  const normalized = question.toLowerCase().replace(/[’']/g, '').replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  const topic = topics.find(({ match }) => match.test(normalized));
  return topic ? { text: topic.text, links: topic.links } : {
    text: 'I don’t have that information in this portfolio. I can help with Pavithar’s projects, skills, education, experience, interests, certificates, and contact details. Try a suggested question below.',
    links: [{ label: 'Contact Pavithar', href: '#contact' }],
  };
}
