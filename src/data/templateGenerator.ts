import {
  CertificateTemplate,
  CertificateElement,
  TemplateCategory,
  TemplateStyle,
  PageOrientation,
  BorderStyle
} from '../types/certificate';

// Design Palettes
export interface ColorPalette {
  name: string;
  bg: string;
  bgPattern?: 'parchment' | 'none';
  borderPrimary: string;
  borderSecondary?: string;
  titleColor: string;
  subtitleColor: string;
  recipientColor: string;
  bodyColor: string;
  badgeFill: string;
  badgeStroke: string;
  accentColor: string;
  lineColor: string;
}

export const PALETTES: ColorPalette[] = [
  {
    name: 'Imperial Navy & 24K Gold',
    bg: '#FCFBF7',
    borderPrimary: '#C5A059',
    borderSecondary: '#0F172A',
    titleColor: '#0F172A',
    subtitleColor: '#475569',
    recipientColor: '#1E3A8A',
    bodyColor: '#334155',
    badgeFill: '#C5A059',
    badgeStroke: '#8C6D2D',
    accentColor: '#C5A059',
    lineColor: '#C5A059'
  },
  {
    name: 'Royal Emerald & Brass',
    bg: '#FAFDF9',
    borderPrimary: '#059669',
    borderSecondary: '#064E3B',
    titleColor: '#064E3B',
    subtitleColor: '#047857',
    recipientColor: '#065F46',
    bodyColor: '#1F2937',
    badgeFill: '#10B981',
    badgeStroke: '#047857',
    accentColor: '#D97706',
    lineColor: '#D1FAE5'
  },
  {
    name: 'Crimson Burgundy & Gold',
    bg: '#FFFCFA',
    borderPrimary: '#991B1B',
    borderSecondary: '#B45309',
    titleColor: '#7F1D1D',
    subtitleColor: '#9A3412',
    recipientColor: '#881337',
    bodyColor: '#374151',
    badgeFill: '#D97706',
    badgeStroke: '#92400E',
    accentColor: '#B45309',
    lineColor: '#FDE68A'
  },
  {
    name: 'Midnight Onyx & Gold VIP',
    bg: '#0F172A',
    borderPrimary: '#F59E0B',
    borderSecondary: '#78350F',
    titleColor: '#F8FAFC',
    subtitleColor: '#FBBF24',
    recipientColor: '#FDE68A',
    bodyColor: '#CBD5E1',
    badgeFill: '#D97706',
    badgeStroke: '#FEF3C7',
    accentColor: '#F59E0B',
    lineColor: '#78350F'
  },
  {
    name: 'Sapphire & Crisp Platinum',
    bg: '#F8FAFC',
    borderPrimary: '#1D4ED8',
    borderSecondary: '#64748B',
    titleColor: '#1E293B',
    subtitleColor: '#2563EB',
    recipientColor: '#1E40AF',
    bodyColor: '#334155',
    badgeFill: '#3B82F6',
    badgeStroke: '#1D4ED8',
    accentColor: '#2563EB',
    lineColor: '#93C5FD'
  },
  {
    name: 'Vintage Parchment Heritage',
    bg: '#F7F3E8',
    bgPattern: 'parchment',
    borderPrimary: '#854D0E',
    borderSecondary: '#451A03',
    titleColor: '#451A03',
    subtitleColor: '#78350F',
    recipientColor: '#713F12',
    bodyColor: '#292524',
    badgeFill: '#CA8A04',
    badgeStroke: '#713F12',
    accentColor: '#854D0E',
    lineColor: '#CA8A04'
  },
  {
    name: 'Modern Executive Slate & Cyan',
    bg: '#FFFFFF',
    borderPrimary: '#0284C7',
    borderSecondary: '#0F172A',
    titleColor: '#0F172A',
    subtitleColor: '#0284C7',
    recipientColor: '#0369A1',
    bodyColor: '#334155',
    badgeFill: '#0EA5E9',
    badgeStroke: '#0369A1',
    accentColor: '#0284C7',
    lineColor: '#BAE6FD'
  },
  {
    name: 'Amethyst Purple & Rose Gold',
    bg: '#FCFAFF',
    borderPrimary: '#7C3AED',
    borderSecondary: '#BE185D',
    titleColor: '#4C1D95',
    subtitleColor: '#6D28D9',
    recipientColor: '#5B21B6',
    bodyColor: '#374151',
    badgeFill: '#8B5CF6',
    badgeStroke: '#5B21B6',
    accentColor: '#DB2777',
    lineColor: '#DDD6FE'
  },
  {
    name: 'Nordic Minimal Monochrome',
    bg: '#FFFFFF',
    borderPrimary: '#18181B',
    borderSecondary: '#71717A',
    titleColor: '#18181B',
    subtitleColor: '#52525B',
    recipientColor: '#09090B',
    bodyColor: '#27272A',
    badgeFill: '#27272A',
    badgeStroke: '#52525B',
    accentColor: '#18181B',
    lineColor: '#E4E4E7'
  },
  {
    name: 'Warm Terracotta & Sand',
    bg: '#FFFBF7',
    borderPrimary: '#C2410C',
    borderSecondary: '#78350F',
    titleColor: '#7C2D12',
    subtitleColor: '#9A3412',
    recipientColor: '#991B1B',
    bodyColor: '#44403C',
    badgeFill: '#EA580C',
    badgeStroke: '#9A3412',
    accentColor: '#C2410C',
    lineColor: '#FED7AA'
  }
];

export interface FontPairing {
  display: string;
  body: string;
  recipient: string;
  signature: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  { display: 'Cinzel', body: 'Plus Jakarta Sans', recipient: 'Playfair Display', signature: 'Great Vibes' },
  { display: 'Playfair Display', body: 'Montserrat', recipient: 'Pinyon Script', signature: 'Alex Brush' },
  { display: 'Cormorant Garamond', body: 'Plus Jakarta Sans', recipient: 'Cinzel', signature: 'Pinyon Script' },
  { display: 'Montserrat', body: 'Plus Jakarta Sans', recipient: 'Playfair Display', signature: 'Great Vibes' },
  { display: 'Oswald', body: 'Montserrat', recipient: 'Montserrat', signature: 'Alex Brush' },
  { display: 'Playfair Display', body: 'Plus Jakarta Sans', recipient: 'Playfair Display', signature: 'Great Vibes' },
  { display: 'Cinzel', body: 'Montserrat', recipient: 'Pinyon Script', signature: 'Pinyon Script' }
];

export interface CategorySpec {
  category: TemplateCategory;
  count: number;
  subcategories: string[];
  titles: string[];
  subtitles: string[];
  descriptions: string[];
  signatory1Titles: string[];
  signatory2Titles: string[];
  tags: string[];
  defaultStyle: TemplateStyle;
  monthMapping: number[];
}

export const CATEGORY_SPECS: CategorySpec[] = [
  {
    category: 'Academic & School',
    count: 100,
    subcategories: ['Elementary Honor', 'Middle School Merit', 'High School Diploma', 'Honor Roll', 'Science Fair', 'Mathematics Olympiad', 'Dean’s Commendation', 'Perfect Attendance', 'Student Council', 'Literary Arts'],
    titles: [
      'CERTIFICATE OF ACADEMIC EXCELLENCE',
      'HIGH HONOR ROLL DISTINCTION',
      'VALEDICTORIAN DIPLOMA OF MERIT',
      'PRESIDENTIAL SCHOLARSHIP AWARD',
      'EXEMPLARY SCHOLASTIC ACHIEVEMENT',
      'OUTSTANDING SCHOLAR RECOGNITION',
      'DISTINGUISHED GRADUATION DIPLOMA',
      'DEAN’S LIST SCHOLAR COMMENDATION',
      'SCIENCE & INNOVATION FIRST HONORS',
      'MATHEMATICAL EXCELLENCE CITATION',
      'LITERARY ACHIEVEMENT & ORATORY AWARD',
      'ACADEMIC MERIT & SCHOLARSHIP CERTIFICATE'
    ],
    subtitles: [
      'PROUDLY CONFERRED WITH DISTINCTION UPON',
      'THIS OFFICIAL COMMENDATION IS PRESENTED TO',
      'IN GRATEFUL RECOGNITION OF SCHOLASTIC MERIT TO',
      'HAS DEMONSTRATED RIGOROUS SCHOLARSHIP AND IS AWARDED TO',
      'ACCORDED WITH AUTHORIZED COMMENDATION TO'
    ],
    descriptions: [
      'In recognition of superlative intellectual devotion, relentless scholastic discipline, and outstanding academic performance in [COURSE_NAME].',
      'For attaining the highest tier of scholarly diligence, exemplary character, and meritorious examination results throughout the academic term.',
      'Conferred for exceptional mastery of fundamental disciplines, active intellectual inquiry, and commendable academic leadership.',
      'Honoring exceptional sustained scholarship, outstanding grades, and significant contributions to academic and scholarly life.'
    ],
    signatory1Titles: ['Principal & Headmaster', 'Dean of Academic Affairs', 'Superintendent of Schools', 'Board of Education President'],
    signatory2Titles: ['Faculty Advisor', 'Department Chair', 'Head of Senior Faculty', 'Director of Curriculum'],
    tags: ['academic', 'school', 'honor roll', 'diploma', 'student', 'excellence', 'merit', 'education'],
    defaultStyle: 'classic',
    monthMapping: [9, 10, 1, 5, 6]
  },
  {
    category: 'University & Graduation',
    count: 65,
    subcategories: ['Bachelor Degree', 'Master of Science', 'Doctoral Degree', 'Magna Cum Laude', 'Summa Cum Laude', 'Faculty Honors', 'Postgraduate Fellowship', 'Alumni Distinction'],
    titles: [
      'UNIVERSITY DEGREE OF GRADUATION',
      'BACCALAUREATE DIPLOMA OF MERIT',
      'SUMMA CUM LAUDE CONVOCATION DIPLOMA',
      'MAGNA CUM LAUDE ACADEMIC FELLOWSHIP',
      'POSTGRADUATE DEGREE OF MASTERY',
      'DOCTORAL CITATION OF SCHOLARSHIP',
      'COMMENCEMENT CONFERRAL OF HONORS',
      'UNIVERSITY CHANCELLOR DISTINCTION'
    ],
    subtitles: [
      'THE PRESIDENT AND TRUSTEES HEREBY CONFER UPON',
      'BY VIRTUE OF THE AUTHORITY VESTED IN THE UNIVERSITY UPON',
      'IN TESTIMONY WHEREOF THE FACULTY HAS CONFERRED UPON',
      'HAVING SATISFIED ALL CURRICULAR PREREQUISITES IS ADMITTED TO'
    ],
    descriptions: [
      'Having completed with distinction all prescribed curricula, comprehensive dissertations, and requirements in [COURSE_NAME].',
      'With all corresponding university privileges, honors, rights, and solemn responsibilities appertaining thereto.',
      'In testimony of rigorous scholarly research, dissertation defense, and collegiate dedication of the highest standard.'
    ],
    signatory1Titles: ['University Chancellor', 'President of the University', 'Dean of Graduate Studies'],
    signatory2Titles: ['University Registrar', 'Provost & Academic Vice President', 'Chair of the Academic Senate'],
    tags: ['university', 'graduation', 'degree', 'bachelor', 'master', 'doctorate', 'convocation', 'college'],
    defaultStyle: 'classic',
    monthMapping: [5, 6, 12]
  },
  {
    category: 'Course Completion',
    count: 100,
    subcategories: ['Online Bootcamp', 'Vocational Certificate', 'Advanced Specialization', 'Technical Mastery', 'Language Proficiency', 'Executive Series', 'Digital Curriculum', 'Masterclass'],
    titles: [
      'CERTIFICATE OF COURSE COMPLETION',
      'PROFESSIONAL MASTERY CERTIFICATION',
      'SPECIALIZATION CREDENTIAL OF COMPLETION',
      'EXECUTIVE CURRICULUM CERTIFICATE',
      'TECHNICAL ACCREDITATION OF SUCCESS',
      'DIPLOMA OF COMPREHENSIVE STUDY',
      'COMPLETION & PRACTICAL MASTERY AWARD',
      'ADVANCED PRACTICUM CERTIFICATION'
    ],
    subtitles: [
      'THIS CREDENTIAL PROUDLY CERTIFIES THAT',
      'HAS COMPREHENSIVELY COMPLETED THE CURRICULUM AND IS AWARDED TO',
      'FOR SUCCESSFUL RIGOROUS STUDY AND EXAMINATION TO',
      'CONFERS THIS RECOGNITION OF PROGRAM COMPLETION UPON'
    ],
    descriptions: [
      'Having successfully fulfilled all practical lab milestones, technical evaluations, and theoretical foundations of [COURSE_NAME].',
      'Demonstrating commendable aptitude, continuous dedication, and complete mastery of the rigorous syllabus in [COURSE_NAME].',
      'In validation of professional capability, project submissions, and practical coursework in [COURSE_NAME].'
    ],
    signatory1Titles: ['Lead Course Instructor', 'Program Director', 'Head of Education'],
    signatory2Titles: ['Certification Officer', 'Curriculum Dean', 'Authorized Evaluator'],
    tags: ['course', 'completion', 'bootcamp', 'training', 'mastery', 'online', 'program', 'student'],
    defaultStyle: 'modern',
    monthMapping: [1, 2, 8, 9]
  },
  {
    category: 'Professional Training',
    count: 70,
    subcategories: ['Executive Coaching', 'Corporate Upskilling', 'CPE Accredited', 'Technical Certification', 'Agile Practitioner', 'Industry Competency', 'Continuing Education'],
    titles: [
      'CERTIFICATE OF PROFESSIONAL TRAINING',
      'ADVANCED PRACTITIONER CREDENTIAL',
      'CONTINUING PROFESSIONAL DEVELOPMENT (CPD)',
      'ACCREDITED INDUSTRY TRAINING CERTIFICATE',
      'EXECUTIVE COMPETENCY CERTIFICATION',
      'ENTERPRISE WORKFORCE UPSKILLING AWARD',
      'PROFESSIONAL PRACTICUM DIPLOMA'
    ],
    subtitles: [
      'HEREBY ACCREDITS AND CONFERS UPON',
      'HAS DEMONSTRATED PROFESSIONAL COMPETENCE AND IS AWARDED TO',
      'IN VERIFICATION OF ADVANCED PRACTICAL TRAINING TO',
      'OFFICIALLY CONFERRED IN ACCORDANCE WITH INDUSTRY STANDARDS TO'
    ],
    descriptions: [
      'Having completed required hours of certified hands-on training, industry competency checks, and applied frameworks in [COURSE_NAME].',
      'For mastering applied operational methodologies, compliance standards, and modern industry toolchains.',
      'In recognition of continued professional advancement, analytical proficiency, and verified continuing education units (CEU).'
    ],
    signatory1Titles: ['Director of Professional Training', 'Certified Lead Trainer', 'Managing Partner'],
    signatory2Titles: ['Accreditation Registrar', 'Chief Learning Officer', 'Quality Assurance Auditor'],
    tags: ['professional', 'training', 'cpd', 'corporate', 'accredited', 'industry', 'upskilling', 'career'],
    defaultStyle: 'corporate',
    monthMapping: [2, 3, 8, 10]
  },
  {
    category: 'Employee Recognition',
    count: 70,
    subcategories: ['Employee of the Month', 'Employee of the Year', 'Service Anniversary', 'Top Performer', 'Peer Recognition', 'Customer Hero', 'Innovation Champion', 'President’s Club'],
    titles: [
      'EMPLOYEE OF THE MONTH DISTINCTION',
      'EMPLOYEE OF THE YEAR HONORS',
      'PRESIDENTIAL EXCELLENCE IN SERVICE',
      'ANNUAL STAR PERFORMER CITATION',
      'TENURE & DISTINGUISHED SERVICE AWARD',
      'CORPORATE CHAMPION OF EXCELLENCE',
      'VALUES IN ACTION CITATION',
      'OUTSTANDING DEDICATION COMMENDATION'
    ],
    subtitles: [
      'PROUDLY PRESENTED WITH GRATITUDE AND PRIDE TO',
      'IN RECOGNITION OF UNWAVERING DEDICATION TO',
      'THE EXECUTIVE BOARD IS PROUD TO HONOR',
      'CONFERRED IN CELEBRATION OF EXTRAORDINARY CONTRIBUTIONS BY'
    ],
    descriptions: [
      'In sincere appreciation of outstanding workplace excellence, exemplary work ethic, and dedication to team success in [COURSE_NAME].',
      'For inspiring peers with unwavering integrity, relentless drive for quality, and outstanding customer impact throughout the year.',
      'Commending steadfast loyalty, transformative vision, and remarkable service that elevated corporate standards.'
    ],
    signatory1Titles: ['Chief Executive Officer', 'Vice President of Human Resources', 'President & Managing Director'],
    signatory2Titles: ['Department Director', 'General Manager', 'Chief People Officer'],
    tags: ['employee', 'recognition', 'corporate', 'staff', 'star performer', 'workplace', 'appreciation', 'anniversary'],
    defaultStyle: 'corporate',
    monthMapping: [11, 12, 1, 6]
  },
  {
    category: 'Achievement & Excellence',
    count: 65,
    subcategories: ['Presidential Honor', 'Lifetime Achievement', 'Pinnacle Award', 'Distinguished Honor', 'Gold Medal of Excellence', 'Hall of Fame', 'Exceptional Merit'],
    titles: [
      'CERTIFICATE OF OUTSTANDING ACHIEVEMENT',
      'PINNACLE AWARD FOR MERITORIOUS EXCELLENCE',
      'LIFETIME DISTINCTION & MERIT AWARD',
      'GOLD MEDALLION FOR EXCEPTIONAL MERIT',
      'PRESIDENTIAL TROPHY CITATION',
      'EMINENT ACCOMPLISHMENT DIPLOMA',
      'DISTINGUISHED FELLOW OF EXCELLENCE'
    ],
    subtitles: [
      'ACCORDED WITH UTMOST ESTEEM AND ADMIRATION TO',
      'IN CELEBRATION OF PREEMINENT ATTAINMENT TO',
      'HONORS AND COMMENDS THE EXTRAORDINARY TALENTS OF',
      'THIS SUPREME CITATION IS PROUDLY BESTOWED UPON'
    ],
    descriptions: [
      'For exhibiting rare brilliance, steadfast perseverance, and achieving monumental milestones that establish a new standard of excellence.',
      'In tribute to unmatched dedication, visionary resolve, and exemplary achievements that inspire community and peers alike.',
      'Conferred for singular accomplishments that demonstrate profound craft mastery, ingenuity, and lasting positive impact.'
    ],
    signatory1Titles: ['President of the Executive Council', 'Chairperson of the Honors Committee', 'Chief Executive Officer'],
    signatory2Titles: ['Secretary of the Board', 'Executive Vice President', 'Director of Honors & Awards'],
    tags: ['achievement', 'excellence', 'award', 'merit', 'pinnacle', 'distinction', 'honor', 'lifetime'],
    defaultStyle: 'luxury',
    monthMapping: [1, 3, 11, 12]
  },
  {
    category: 'Appreciation & Thank You',
    count: 50,
    subcategories: ['Donor Recognition', 'Mentor Appreciation', 'Keynote Speaker', 'Community Supporter', 'Hospitality Honor', 'Gratitude Certificate', 'Partner in Service'],
    titles: [
      'CERTIFICATE OF SINCERE APPRECIATION',
      'GRATITUDE & DISTINGUISHED PARTNERSHIP',
      'HONORARY CITATION OF HEARTFELT THANKS',
      'DISTINGUISHED MENTORSHIP COMMENDATION',
      'COMMUNITY PATRON OF APPRECIATION',
      'KEYNOTE CONTRIBUTOR CITATION'
    ],
    subtitles: [
      'GRATEFULLY PRESENTED WITH PROFOUND THANKS TO',
      'EXTENDS DEEPEST GRATITUDE AND RECOGNITION TO',
      'HONORS AND COMMENDS THE GENEROUS SPIRIT OF',
      'THIS TESTIMONIAL OF APPRECIATION IS BESTOWED UPON'
    ],
    descriptions: [
      'In recognition of generous contributions of time, wisdom, and compassionate support that made an enduring difference in [COURSE_NAME].',
      'With sincere gratitude for selfless guidance, inspiring mentorship, and invaluable counsel that elevated our mission.',
      'Thank you for your tireless dedication, gracious benevolence, and vital partnership in achieving our shared goals.'
    ],
    signatory1Titles: ['Executive Director', 'Chairman of the Foundation', 'President & Founder'],
    signatory2Titles: ['Community Outreach Director', 'Program Coordinator', 'Secretary of the Board'],
    tags: ['appreciation', 'thank you', 'gratitude', 'mentor', 'donor', 'partner', 'support', 'recognition'],
    defaultStyle: 'elegant',
    monthMapping: [4, 5, 11, 12]
  },
  {
    category: 'Participation',
    count: 50,
    subcategories: ['Conference Delegate', 'Symposium Attendee', 'Festival Participant', 'Exhibition Contributor', 'Summit Delegate', 'Interactive Forum', 'Cultural Event'],
    titles: [
      'CERTIFICATE OF ACTIVE PARTICIPATION',
      'OFFICIAL DELEGATE CITATION',
      'INTERNATIONAL SUMMIT PARTICIPATION DIPLOMA',
      'COMMENDED FORUM ATTENDANCE CERTIFICATE',
      'CONFERENCE CONTRIBUTOR RECOGNITION',
      'SYMPOSIUM PARTICIPATION CREDENTIAL'
    ],
    subtitles: [
      'HEREBY RECOGNIZES ACTIVE CONTRIBUTION BY',
      'THIS OFFICIAL CERTIFICATE CONFIRMS ATTENDANCE OF',
      'GRATEFULLY ACKNOWLEDGES ENGAGED PARTICIPATION BY',
      'CONFERRED IN APPRECIATION OF VALUABLE INVOLVEMENT TO'
    ],
    descriptions: [
      'For enthusiastic involvement, thoughtful discourse, and collaborative engagement in the proceedings of [COURSE_NAME].',
      'In confirmation of active attendance and contribution across all keynote lectures, plenary tracks, and breakout workshops.',
      'Certifying full participation in panel deliberations, research presentations, and collective intellectual exchanges.'
    ],
    signatory1Titles: ['Conference General Chair', 'Executive Organizing Committee', 'Symposium Director'],
    signatory2Titles: ['Program Lead', 'Secretariat General', 'Scientific Committee Chair'],
    tags: ['participation', 'attendance', 'delegate', 'conference', 'summit', 'symposium', 'event', 'workshop'],
    defaultStyle: 'modern',
    monthMapping: [3, 4, 7, 10]
  },
  {
    category: 'Sports & Athletics',
    count: 60,
    subcategories: ['Championship Winner', 'MVP Most Valuable Player', 'Tournament Runner-Up', 'Track & Field', 'Aquatics', 'Martial Arts', 'Varsity Athlete', 'Coach of the Season', 'Youth League'],
    titles: [
      'CHAMPIONSHIP ATHLETIC TROPHY CERTIFICATE',
      'MOST VALUABLE PLAYER (MVP) DISTINCTION',
      'VARSITY TOURNAMENT GOLD MEDALIST',
      'ALL-STAR ATHLETIC EXCELLENCE AWARD',
      'SPORTSMANSHIP & INTEGRITY CITATION',
      'COACH & ATHLETIC LEADERSHIP AWARD',
      'ENDURANCE & MARATHON FINISHER DIPLOMA'
    ],
    subtitles: [
      'PROUDLY CONFERRED WITH VICTORY HONORS UPON',
      'CELEBRATING EXTRAORDINARY ATHLETIC PROWESS OF',
      'THE LEAGUE COMMISSIONER PROUDLY AWARDS',
      'FOR OUTSTANDING PERFORMANCE ON AND OFF THE FIELD TO'
    ],
    descriptions: [
      'In tribute to exceptional athleticism, iron discipline, and unwavering sportsmanship displayed during [COURSE_NAME].',
      'For inspiring teammates through grit, tactical brilliance, and peerless dedication throughout the championship season.',
      'Commending athletic rigor, competitive fair play, and victorious execution in the tournament finals.'
    ],
    signatory1Titles: ['Athletic Director', 'League Commissioner', 'Head Coach'],
    signatory2Titles: ['Tournament Coordinator', 'Referee General', 'Sports Federation President'],
    tags: ['sports', 'athletics', 'championship', 'mvp', 'tournament', 'winner', 'fitness', 'medal', 'coach'],
    defaultStyle: 'modern',
    monthMapping: [6, 7, 8, 9]
  },
  {
    category: 'Internship & Fellowship',
    count: 40,
    subcategories: ['Summer Internship', 'Clinical Fellowship', 'Graduate Research', 'Corporate Trainee', 'Engineering Co-op', 'Legal Fellowship', 'Public Policy Intern'],
    titles: [
      'CERTIFICATE OF INTERNSHIP COMPLETION',
      'GRADUATE FELLOWSHIP DIPLOMA OF MERIT',
      'CORPORATE APPRENTICE PRACTICUM CERTIFICATE',
      'RESEARCH FELLOWSHIP CITATION',
      'ENGINEERING CO-OP COMPLETION HONORS',
      'DISTINGUISHED RESIDENT INTERN AWARD'
    ],
    subtitles: [
      'PROUDLY CERTIFIES SUCCESSFUL RESIDENCY OF',
      'IN COMMENDATION OF PROFESSIONAL FELLOWSHIP TO',
      'HAS COMPLETED ALL CO-OP REQUIREMENTS AND IS AWARDED TO',
      'THIS FORMAL CERTIFICATION IS CONFERRED UPON'
    ],
    descriptions: [
      'In recognition of professional acumen, applied project contributions, and rigorous analytical execution during [COURSE_NAME].',
      'Commending outstanding technical delivery, cross-functional collaboration, and professional growth across all rotational assignments.',
      'Having fulfilled all required practicum milestones with high distinction, dedication, and professional excellence.'
    ],
    signatory1Titles: ['Head of Internship Program', 'VP of Engineering & Mentorship', 'Senior Research Director'],
    signatory2Titles: ['HR Talent Acquisition Lead', 'Direct Supervising Mentor', 'Academic Co-op Coordinator'],
    tags: ['internship', 'fellowship', 'trainee', 'co-op', 'practicum', 'residency', 'career', 'graduate'],
    defaultStyle: 'corporate',
    monthMapping: [6, 7, 8]
  },
  {
    category: 'Volunteer & Community Service',
    count: 40,
    subcategories: ['Humanitarian Relief', 'Environmental Stewardship', 'Youth Mentorship', 'Community Health', 'Disaster Response', 'Food Bank Champion', 'Senior Care Companion'],
    titles: [
      'CERTIFICATE OF VOLUNTEER EXCELLENCE',
      'COMMUNITY SERVICE MEDAL OF HONOR',
      'HUMANITARIAN IMPACT CITATION',
      'CIVIC ENGAGEMENT & OUTREACH DIPLOMA',
      'PRESIDENTIAL VOLUNTEER SERVICE AWARD',
      'HEARTS OF HOPE COMMUNITY RECOGNITION'
    ],
    subtitles: [
      'EXTENDS DEEP ADMIRATION AND SINCERE THANKS TO',
      'HONORING COMPASSIONATE SERVICE AND DEDICATION BY',
      'IN TESTIMONY OF NOBLE COMMUNITY STEWARDSHIP TO',
      'PROUDLY PRESENTED FOR SELFLESS CIVIC CONTRIBUTIONS TO'
    ],
    descriptions: [
      'For selflessly dedicating countless hours, boundless energy, and heartfelt empathy to elevate vulnerable lives in [COURSE_NAME].',
      'In grateful acknowledgment of humanitarian leadership, community building, and compassionate frontline service.',
      'Commending impactful grassroots mobilization, generous spirit, and unwavering devotion to the public welfare.'
    ],
    signatory1Titles: ['Director of Volunteer Services', 'President & Executive Founder', 'City Mayor & Civic Representative'],
    signatory2Titles: ['Community Outreach Director', 'Program Field Supervisor', 'Board Trustee'],
    tags: ['volunteer', 'community', 'service', 'humanitarian', 'civic', 'charity', 'compassion', 'nonprofit'],
    defaultStyle: 'elegant',
    monthMapping: [4, 5, 11]
  },
  {
    category: 'Business & Corporate',
    count: 50,
    subcategories: ['Strategic Leadership', 'Sales Excellence', 'Operational Excellence', 'Mergers & Acquisitions', 'Client Advisory', 'Enterprise Innovation', 'Quality Benchmark'],
    titles: [
      'CORPORATE EXCELLENCE CERTIFICATE',
      'STRATEGIC BUSINESS LEADERSHIP AWARD',
      'PRESIDENT’S CIRCLE SALES EXCELLENCE',
      'ENTERPRISE INNOVATION CITATION',
      'OPERATIONAL EXCELLENCE & EFFICIENCY AWARD',
      'GLOBAL COMMERCE MERIT DIPLOMA'
    ],
    subtitles: [
      'THE BOARD OF DIRECTORS HEREBY CONFERS UPON',
      'IN RECOGNITION OF EXEMPLARY BUSINESS RESULTS TO',
      'ACCORDED WITH UTMOST CORPORATE DISTINCTION TO',
      'PROUDLY CONFERRED FOR INDUSTRY IMPACT UPON'
    ],
    descriptions: [
      'In tribute to driving record fiscal expansion, championing operational efficiencies, and delivering exceptional commercial results in [COURSE_NAME].',
      'For exemplary stakeholder alignment, transformative strategic execution, and outstanding corporate citizenship.',
      'Demonstrating commercial vision, customer dedication, and sustainable leadership across enterprise initiatives.'
    ],
    signatory1Titles: ['Chief Executive Officer', 'Chief Commercial Officer', 'Chairman of the Board'],
    signatory2Titles: ['Chief Financial Officer', 'Executive Vice President', 'Managing Partner'],
    tags: ['business', 'corporate', 'sales', 'leadership', 'enterprise', 'commerce', 'executive', 'commercial'],
    defaultStyle: 'corporate',
    monthMapping: [1, 2, 10, 11]
  },
  {
    category: 'Technology & IT',
    count: 40,
    subcategories: ['Cloud Architecture', 'Full Stack Engineering', 'Artificial Intelligence', 'Cybersecurity Defense', 'Data Science', 'DevOps & SRE', 'Quantum Computing', 'Mobile Development'],
    titles: [
      'CERTIFIED CLOUD ARCHITECT CREDENTIAL',
      'CYBERSECURITY DEFENSE SPECIALIST ACCREDITATION',
      'AI & MACHINE LEARNING PRACTICUM DIPLOMA',
      'FULL STACK SOFTWARE ENGINEERING CERTIFICATION',
      'DATA SCIENCE & ADVANCED ANALYTICS CREDENTIAL',
      'DEVOPS & SYSTEM RELIABILITY EXCELLENCE'
    ],
    subtitles: [
      'THIS TECHNICAL CREDENTIAL CERTIFIES THAT',
      'HAS DEMONSTRATED CODE MASTERY AND SYSTEM DESIGN TO',
      'OFFICIALLY ACCREDITS AND AUTHORIZES',
      'IN RECOGNITION OF ARCHITECTURAL EXCELLENCE TO'
    ],
    descriptions: [
      'Having demonstrated rigorous algorithmic problem solving, scalable cloud infrastructure design, and secure code architecture in [COURSE_NAME].',
      'In validation of deploying resilient neural networks, automated continuous delivery pipelines, and robust defensive security protocols.',
      'Commending applied technical excellence, open-source stewardship, and transformative software craftsmanship.'
    ],
    signatory1Titles: ['Chief Technology Officer', 'Principal Solutions Architect', 'Director of Engineering'],
    signatory2Titles: ['Head of Developer Ecosystem', 'Lead Security Architect', 'Accreditation Registrar'],
    tags: ['technology', 'it', 'software', 'cloud', 'cybersecurity', 'ai', 'developer', 'coding', 'data'],
    defaultStyle: 'modern',
    monthMapping: [3, 8, 10]
  },
  {
    category: 'Healthcare & Medical',
    count: 30,
    subcategories: ['Clinical Practicum', 'Continuing Medical Education', 'Nursing Excellence', 'Surgical Fellowship', 'Emergency Response', 'Pharmacy Residency', 'Mental Health Counseling'],
    titles: [
      'CONTINUING MEDICAL EDUCATION (CME) ACCREDITATION',
      'CLINICAL EXCELLENCE IN NURSING AWARD',
      'MEDICAL RESIDENCY COMPLETION DIPLOMA',
      'HEALTHCARE LEADERSHIP & ETHICS CITATION',
      'EMERGENCY TRAUMA CARE CREDENTIAL',
      'PUBLIC HEALTH RESEARCH CERTIFICATION'
    ],
    subtitles: [
      'THE HOSPITAL BOARD & MEDICAL FACULTY CONFER UPON',
      'IN RECOGNITION OF COMPASSIONATE PATIENT CARE AND CLINICAL MASTERY TO',
      'HEREBY ACCREDITS WITH FULL CLINICAL HONORS',
      'HAVING SATISFIED ALL ETHICAL AND PRACTICAL STANDARDS TO'
    ],
    descriptions: [
      'In recognition of exceptional clinical proficiency, ethical patient stewardship, and mastery of modern diagnostic protocols in [COURSE_NAME].',
      'For steadfast frontline compassion, adherence to evidence-based healthcare standards, and outstanding medical teamwork.',
      'Having fulfilled all state accredited continuing education units, emergency clinical rotations, and medical compliance reviews.'
    ],
    signatory1Titles: ['Chief Medical Officer', 'Dean of Medicine', 'Hospital President'],
    signatory2Titles: ['Director of Clinical Education', 'Head of Nursing Services', 'Board of Examiners Chair'],
    tags: ['healthcare', 'medical', 'nursing', 'doctor', 'hospital', 'cme', 'clinical', 'health', 'ethics'],
    defaultStyle: 'classic',
    monthMapping: [2, 5, 9]
  },
  {
    category: 'Creative Arts & Design',
    count: 30,
    subcategories: ['Fine Arts Studio', 'UI/UX Product Design', 'Cinematography', 'Music Conservatory', 'Digital Illustration', 'Architectural Draft', 'Creative Writing', 'Photography Master'],
    titles: [
      'CONSERVATORY MASTERCLASS DIPLOMA OF ARTISTRY',
      'EXCELLENCE IN VISUAL ARTS & DESIGN',
      'DISTINGUISHED CREATIVE FELLOWSHIP',
      'CINEMATIC ARTS & PRODUCTION HONORS',
      'PRODUCT DESIGN & USER EXPERIENCE EXCELLENCE',
      'LITERARY COMPOSITION & WRITING AWARD'
    ],
    subtitles: [
      'CELEBRATING EXTRAORDINARY ARTISTIC VISION OF',
      'THE ACADEMY OF CREATIVE ARTS HONORS',
      'IN COMMENDATION OF EXCEPTIONAL ORIGINAL CRAFT TO',
      'PROUDLY PRESENTED FOR AESTHETIC BRILLIANCE TO'
    ],
    descriptions: [
      'For demonstrating profound creative originality, sophisticated aesthetic vision, and masterful technical execution in [COURSE_NAME].',
      'In tribute to boundary-pushing artistic expression, expressive storytelling, and exceptional contributions to the creative disciplines.',
      'Commending imaginative craftsmanship, visual elegance, and innovative design thinking that inspires human culture.'
    ],
    signatory1Titles: ['Dean of Fine Arts', 'Creative Director', 'Conservatory Director'],
    signatory2Titles: ['Master Artist in Residence', 'Curator General', 'Head of Visual Studies'],
    tags: ['creative', 'arts', 'design', 'music', 'illustration', 'writing', 'film', 'photography', 'artist'],
    defaultStyle: 'elegant',
    monthMapping: [3, 6, 9]
  },
  {
    category: 'Leadership & Management',
    count: 30,
    subcategories: ['Executive Leadership', 'Change Management', 'Project Director', 'Women in Leadership', 'Global Governance', 'Strategic Vision', 'Team Empowerment'],
    titles: [
      'EXECUTIVE LEADERSHIP FELLOWSHIP DIPLOMA',
      'DISTINGUISHED GOVERNANCE & STEWARDSHIP AWARD',
      'TRANSFORMATIVE LEADERSHIP CITATION',
      'PROJECT MANAGEMENT PROFESSIONAL EXCELLENCE',
      'GLOBAL STRATEGY & DIPLOMACY CERTIFICATE',
      'VISIONARY PEER LEADERSHIP MEDALLION'
    ],
    subtitles: [
      'ACCORDED WITH PRESTIGIOUS ACCREDITATION UPON',
      'IN RECOGNITION OF TRANSFORMATIONAL VISION AND INTEGRITY TO',
      'THE LEADERSHIP INSTITUTE IS PROUD TO CONFER UPON',
      'PROUDLY ACKNOWLEDGING PRINCIPLED GOVERNANCE BY'
    ],
    descriptions: [
      'For inspiring organizational resilience, cultivating high-performing cultures, and demonstrating principled leadership in [COURSE_NAME].',
      'In tribute to strategic foresight, courageous decision-making, and empowering teams to achieve ambitious shared horizons.',
      'Commending outstanding governance ethics, global perspective, and transformative change management capabilities.'
    ],
    signatory1Titles: ['President of the Leadership Institute', 'Chief Executive Officer', 'Dean of Management'],
    signatory2Titles: ['Executive Director', 'VP of Global Strategy', 'Chair of the Governance Board'],
    tags: ['leadership', 'management', 'executive', 'strategy', 'governance', 'director', 'visionary', 'pmp'],
    defaultStyle: 'corporate',
    monthMapping: [1, 2, 11]
  },
  {
    category: 'Workshops & Seminars',
    count: 30,
    subcategories: ['Interactive Workshop', 'Masterclass Series', 'Hands-On Lab', 'Advanced Seminar', 'Collaborative Think Tank', 'Intensive Symposium', 'Facilitator Guild'],
    titles: [
      'CERTIFICATE OF WORKSHOP COMPLETION',
      'INTENSIVE SEMINAR PRACTICUM DIPLOMA',
      'MASTERCLASS ADVANCED PARTICIPATION AWARD',
      'HANDS-ON LABORATORY COMPLETION CITATION',
      'COLLABORATIVE THINK TANK CREDENTIAL',
      'FACILITATOR GUILD ACCREDITATION'
    ],
    subtitles: [
      'OFFICIALLY CONFIRMS SUCCESSFUL COMPLETION BY',
      'FOR DEDICATED ENGAGEMENT AND STUDY TO',
      'THIS MASTERCLASS CITATION IS PRESENTED TO',
      'IN RECOGNITION OF IMMERSIVE PARTICIPATION UPON'
    ],
    descriptions: [
      'Having actively completed all live seminar modules, peer deliberations, and practical applied exercises in [COURSE_NAME].',
      'For demonstrating keen curiosity, innovative problem-solving, and meaningful contributions during the intensive workshop proceedings.',
      'In validation of hands-on technical labs, case study analysis, and collaborative workshop deliverables.'
    ],
    signatory1Titles: ['Lead Workshop Facilitator', 'Seminar Director', 'Head of Program Curriculum'],
    signatory2Titles: ['Associate Moderator', 'Guest Lecturer', 'Education Coordinator'],
    tags: ['workshop', 'seminar', 'masterclass', 'hands-on', 'symposium', 'interactive', 'training', 'attendee'],
    defaultStyle: 'modern',
    monthMapping: [2, 4, 7, 10]
  },
  {
    category: 'Competitions & Contests',
    count: 30,
    subcategories: ['First Place Champion', 'Runner Up Distinction', 'Finalist Honors', 'Hackathon Winner', 'Robotics Showcase', 'Debate Tournament', 'Innovation Challenge'],
    titles: [
      'FIRST PLACE CHAMPIONSHIP MEDALLION',
      'GRAND PRIZE COMPETITION WINNER',
      'GLOBAL HACKATHON INNOVATION TROPHY',
      'DISTINGUISHED FINALIST CITATION',
      'ORATORY & DEBATE CHAMPION DIPLOMA',
      'ROBOTICS ARENA SUPREME VICTORY'
    ],
    subtitles: [
      'PROUDLY CONFERRED WITH VICTORY HONORS UPON',
      'THE JUDGING COMMITTEE PROUDLY AWARDS',
      'IN COMMENDATION OF EXCEPTIONAL COMPETITIVE MERIT TO',
      'CELEBRATING TRIUMPHANT PERFORMANCE OF'
    ],
    descriptions: [
      'For demonstrating unmatched ingenuity, tactical mastery, and claiming highest competitive distinction in [COURSE_NAME].',
      'In tribute to peerless skill, pressure resilience, and triumphant execution against competitive contenders worldwide.',
      'Conferred by unanimous acclaim of the grand jury in recognition of supreme innovation and competitive excellence.'
    ],
    signatory1Titles: ['Head of the Grand Jury', 'Competition Director', 'Chief Adjudicator'],
    signatory2Titles: ['Tournament Coordinator', 'Lead Evaluator', 'President of the Arena'],
    tags: ['competition', 'contest', 'winner', 'first place', 'champion', 'hackathon', 'finalist', 'trophy'],
    defaultStyle: 'luxury',
    monthMapping: [3, 7, 10, 11]
  },
  {
    category: 'Safety & Compliance',
    count: 20,
    subcategories: ['OSHA Workplace Safety', 'ISO 9001 Compliance', 'Fire & Hazard Prevention', 'First Aid & CPR Resuscitation', 'Food Safety & Hygiene', 'Environmental Safety (EHS)'],
    titles: [
      'OCCUPATIONAL SAFETY & HEALTH ACCREDITATION',
      'ISO STANDARDS COMPLIANCE CERTIFICATION',
      'FIRST AID, CPR & AED RESUSCITATION DIPLOMA',
      'ENVIRONMENTAL HEALTH & SAFETY (EHS) CREDENTIAL',
      'WORKPLACE HAZARD PREVENTION CERTIFICATE',
      'FOOD SANITATION & HYGIENE COMPLIANCE'
    ],
    subtitles: [
      'OFFICIALLY ACCREDITED AND CERTIFIED AS QUALIFIED:',
      'IN VERIFICATION OF REGULATORY AUDIT SATISFACTION TO',
      'THIS CREDENTIAL ATTESTS COMPLIANCE MASTERY FOR',
      'HEREBY CONFERRED IN ACCORDANCE WITH STATUTORY CODES UPON'
    ],
    descriptions: [
      'Having fulfilled all mandated training hours, emergency response practicals, and statutory safety protocols in [COURSE_NAME].',
      'In validation of full compliance with national workplace safety codes, risk mitigation audits, and protective standards.',
      'Demonstrating verified proficiency in life-saving first aid techniques, hazardous material containment, and regulatory readiness.'
    ],
    signatory1Titles: ['Chief Safety Inspector', 'Certified EHS Officer', 'Regulatory Audit Director'],
    signatory2Titles: ['Accreditation Registrar', 'Safety Committee Chair', 'Lead Compliance Officer'],
    tags: ['safety', 'compliance', 'osha', 'iso', 'cpr', 'first aid', 'hygiene', 'audit', 'regulatory'],
    defaultStyle: 'corporate',
    monthMapping: [4, 6, 10]
  },
  {
    category: 'Special Occasions & Events',
    count: 30,
    subcategories: ['Wedding Commendation', 'Baby Dedication', 'Baptism Certificate', 'Anniversary Celebration', 'Honorary Citizenship', 'Festival of Lights', 'Retirement Distinction'],
    titles: [
      'COMMEMORATIVE CERTIFICATE OF DEDICATION',
      'DISTINGUISHED RETIREMENT CITATION OF HONOR',
      'ANNIVERSARY COMMENDATION OF DEVOTION',
      'HONORARY CITIZENSHIP RECOGNITION',
      'SOLEMN COMMEMORATION OF MILESTONE',
      'FESTIVAL COMMEMORATIVE CELEBRATION'
    ],
    subtitles: [
      'CELEBRATING THIS SOLEMN AND JOYOUS MILESTONE FOR',
      'WITH WARM AFFECTION AND LASTING HONORS TO',
      'PRESENTED IN COMMEMORATION OF A LIFETIME OF DEDICATION TO',
      'CONFERRED WITH PROFOUND RESPECT AND CELEBRATION UPON'
    ],
    descriptions: [
      'In joyful celebration of enduring loyalty, cherished memories, and profound personal milestones in [COURSE_NAME].',
      'Commending a distinguished career of honor, integrity, and warmth that left an indelible mark upon all colleagues and friends.',
      'Presented with deepest affection, reverence, and warmest congratulations upon reaching this venerable milestone.'
    ],
    signatory1Titles: ['Officiating Dignitary', 'President of the Association', 'Master of Ceremonies'],
    signatory2Titles: ['Witness of Honor', 'Secretary General', 'Community Patron'],
    tags: ['occasion', 'event', 'retirement', 'anniversary', 'wedding', 'milestone', 'celebration', 'honorary'],
    defaultStyle: 'elegant',
    monthMapping: [5, 6, 12]
  }
];

// Helper to generate deterministically structured elements for a template
export function generateTemplateElements(
  orientation: PageOrientation,
  palette: ColorPalette,
  fonts: FontPairing,
  categorySpec: CategorySpec,
  variantIdx: number,
  titleText: string,
  subtitleText: string,
  descText: string,
  signatory1: string,
  signatory2: string
): CertificateElement[] {
  const isLandscape = orientation === 'landscape';
  const width = isLandscape ? 1123 : 794;
  const height = isLandscape ? 794 : 1123;
  const cx = width / 2;

  const elements: CertificateElement[] = [];

  // Determine layout archetype based on variantIdx
  const archetype = variantIdx % 4; // 0: Classical Center Crest, 1: Modern Offset/Clean, 2: Luxury Medallion, 3: Dual Signature Academic

  // 1. Organization / Awarding Body Header
  const orgY = isLandscape ? (archetype === 0 ? 75 : 85) : (archetype === 0 ? 95 : 115);
  elements.push({
    id: `el-org-${variantIdx}`,
    type: 'text',
    x: 80,
    y: orgY,
    width: width - 160,
    height: 35,
    content: '[ORGANIZATION_NAME]',
    fontFamily: fonts.display,
    fontSize: isLandscape ? 20 : 18,
    fontWeight: '700',
    color: palette.subtitleColor,
    textAlign: 'center',
    letterSpacing: 4,
    textTransform: 'uppercase',
    placeholderKey: 'ORGANIZATION_NAME'
  });

  // 2. Decorative Top Crest/Badge (for archetypes 0 and 2)
  if (archetype === 0 || archetype === 2) {
    const badgeType = archetype === 0 ? 'laurel-wreath' : 'crest';
    const badgeSize = isLandscape ? 64 : 70;
    elements.push({
      id: `el-top-badge-${variantIdx}`,
      type: 'badge',
      x: cx - badgeSize / 2,
      y: orgY + 45,
      width: badgeSize,
      height: badgeSize,
      badgeType: badgeType as any,
      fill: palette.badgeFill,
      stroke: palette.badgeStroke
    });
  }

  // 3. Certificate Title
  const titleY = isLandscape
    ? (archetype === 0 || archetype === 2 ? orgY + 120 : orgY + 50)
    : (archetype === 0 || archetype === 2 ? orgY + 130 : orgY + 65);
  elements.push({
    id: `el-title-${variantIdx}`,
    type: 'text',
    x: 60,
    y: titleY,
    width: width - 120,
    height: isLandscape ? 55 : 65,
    content: titleText,
    fontFamily: fonts.display,
    fontSize: isLandscape ? (titleText.length > 35 ? 26 : 32) : (titleText.length > 35 ? 24 : 28),
    fontWeight: '800',
    color: palette.titleColor,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase'
  });

  // 4. Subtitle / Presentation line
  const subY = titleY + (isLandscape ? 60 : 70);
  elements.push({
    id: `el-sub-${variantIdx}`,
    type: 'text',
    x: 100,
    y: subY,
    width: width - 200,
    height: 25,
    content: subtitleText,
    fontFamily: fonts.body,
    fontSize: isLandscape ? 12 : 11,
    fontWeight: '600',
    color: palette.subtitleColor,
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase'
  });

  // 5. Recipient Name
  const recipY = subY + (isLandscape ? 35 : 45);
  elements.push({
    id: `el-recip-${variantIdx}`,
    type: 'text',
    x: 60,
    y: recipY,
    width: width - 120,
    height: isLandscape ? 65 : 75,
    content: '[RECIPIENT_NAME]',
    fontFamily: fonts.recipient,
    fontSize: isLandscape ? 44 : 38,
    fontWeight: '700',
    color: palette.recipientColor,
    textAlign: 'center',
    placeholderKey: 'RECIPIENT_NAME'
  });

  // 6. Decorative Line below name
  const lineY = recipY + (isLandscape ? 70 : 80);
  elements.push({
    id: `el-line-${variantIdx}`,
    type: 'line',
    x: cx - (isLandscape ? 240 : 180),
    y: lineY,
    width: isLandscape ? 480 : 360,
    height: 2,
    stroke: palette.lineColor,
    strokeWidth: 2
  });

  // 7. Body Description
  const descY = lineY + (isLandscape ? 20 : 30);
  elements.push({
    id: `el-desc-${variantIdx}`,
    type: 'text',
    x: isLandscape ? 120 : 70,
    y: descY,
    width: width - (isLandscape ? 240 : 140),
    height: isLandscape ? 75 : 95,
    content: descText,
    fontFamily: fonts.body,
    fontSize: isLandscape ? 15 : 14,
    fontWeight: '400',
    color: palette.bodyColor,
    textAlign: 'center',
    lineHeight: 1.5,
    placeholderKey: 'DESCRIPTION'
  });

  // 8. Signatures & Badges Area
  const bottomBaseY = height - (isLandscape ? 180 : 220);

  // Left Signatory (Date or Signature 1)
  const sigWidth = isLandscape ? 240 : 200;
  elements.push({
    id: `el-sig1-script-${variantIdx}`,
    type: 'text',
    x: isLandscape ? 130 : 60,
    y: bottomBaseY,
    width: sigWidth,
    height: 35,
    content: 'Dr. Arthur Pendelton',
    fontFamily: fonts.signature,
    fontSize: 24,
    color: palette.borderPrimary,
    textAlign: 'center'
  });
  elements.push({
    id: `el-sig1-line-${variantIdx}`,
    type: 'line',
    x: isLandscape ? 130 : 60,
    y: bottomBaseY + 38,
    width: sigWidth,
    height: 1,
    stroke: palette.borderPrimary,
    strokeWidth: 1
  });
  elements.push({
    id: `el-sig1-title-${variantIdx}`,
    type: 'text',
    x: isLandscape ? 130 : 60,
    y: bottomBaseY + 44,
    width: sigWidth,
    height: 20,
    content: signatory1,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '600',
    color: palette.subtitleColor,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    placeholderKey: 'ISSUER_NAME'
  });

  // Right Signatory (Signature 2)
  const rightSigX = width - (isLandscape ? 130 : 60) - sigWidth;
  elements.push({
    id: `el-sig2-script-${variantIdx}`,
    type: 'text',
    x: rightSigX,
    y: bottomBaseY,
    width: sigWidth,
    height: 35,
    content: 'Eleanor V. Sterling',
    fontFamily: fonts.signature,
    fontSize: 24,
    color: palette.borderPrimary,
    textAlign: 'center'
  });
  elements.push({
    id: `el-sig2-line-${variantIdx}`,
    type: 'line',
    x: rightSigX,
    y: bottomBaseY + 38,
    width: sigWidth,
    height: 1,
    stroke: palette.borderPrimary,
    strokeWidth: 1
  });
  elements.push({
    id: `el-sig2-title-${variantIdx}`,
    type: 'text',
    x: rightSigX,
    y: bottomBaseY + 44,
    width: sigWidth,
    height: 20,
    content: signatory2,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '600',
    color: palette.subtitleColor,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1
  });

  // Center Badge or Seal
  const centerBadgeSize = isLandscape ? 85 : 90;
  const badgeKinds = ['gold-seal', 'modern-shield', 'ribbon-star', 'laurel-wreath'];
  const centerBadgeType = badgeKinds[variantIdx % badgeKinds.length];
  elements.push({
    id: `el-center-badge-${variantIdx}`,
    type: 'badge',
    x: cx - centerBadgeSize / 2,
    y: bottomBaseY - 15,
    width: centerBadgeSize,
    height: centerBadgeSize,
    badgeType: centerBadgeType as any,
    fill: palette.badgeFill,
    stroke: palette.badgeStroke
  });

  // Issue Date (Bottom Center)
  elements.push({
    id: `el-date-${variantIdx}`,
    type: 'text',
    x: cx - 150,
    y: bottomBaseY + 80,
    width: 300,
    height: 20,
    content: 'Conferred on [ISSUE_DATE]',
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '600',
    color: palette.subtitleColor,
    textAlign: 'center',
    placeholderKey: 'ISSUE_DATE'
  });

  // Certificate ID & QR Code
  elements.push({
    id: `el-cert-id-${variantIdx}`,
    type: 'text',
    x: 80,
    y: height - (isLandscape ? 55 : 65),
    width: width - 160,
    height: 20,
    content: 'REGISTRATION SERIAL: [CERTIFICATE_ID]',
    fontFamily: 'JetBrains Mono',
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    letterSpacing: 1.5,
    placeholderKey: 'CERTIFICATE_ID'
  });

  return elements;
}

// Border Styles pool
const BORDER_STYLES: BorderStyle[] = [
  'classic-double',
  'gold-embossed',
  'modern-accent',
  'ornate-corner',
  'geometric',
  'minimal'
];

// Main function to generate the 1,000 templates across the 20 categories
export function generate1000Templates(): CertificateTemplate[] {
  const templates: CertificateTemplate[] = [];

  CATEGORY_SPECS.forEach((catSpec, catIdx) => {
    const {
      category,
      count,
      subcategories,
      titles,
      subtitles,
      descriptions,
      signatory1Titles,
      signatory2Titles,
      tags,
      defaultStyle,
      monthMapping
    } = catSpec;

    // Build exactly `count` templates for this category
    for (let i = 0; i < count; i++) {
      const globalIdx = templates.length + 1;
      const subcat = subcategories[i % subcategories.length];
      const palette = PALETTES[(i + catIdx * 3) % PALETTES.length];
      const fonts = FONT_PAIRINGS[(i + catIdx) % FONT_PAIRINGS.length];
      const borderStyle = BORDER_STYLES[(i + catIdx * 2) % BORDER_STYLES.length];
      
      // Orientation: 70% landscape, 30% portrait
      const isPortrait = i % 10 === 3 || i % 10 === 7 || i % 10 === 9;
      const orientation: PageOrientation = isPortrait ? 'portrait' : 'landscape';
      const width = isPortrait ? 794 : 1123;
      const height = isPortrait ? 1123 : 794;

      const title = titles[i % titles.length];
      const subtitle = subtitles[i % subtitles.length];
      const desc = descriptions[i % descriptions.length];
      const sig1 = signatory1Titles[i % signatory1Titles.length];
      const sig2 = signatory2Titles[i % signatory2Titles.length];

      // Clean prefix ID
      const catCode = category
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 6);
      const id = `${catCode}_${String(i + 1).padStart(3, '0')}`;

      // Meaningful distinct name
      const romanNumeral = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i % 10];
      const name = `${subcat} — ${title
        .toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')} ${romanNumeral}`;

      // Month collection assignment
      const monthNumber = monthMapping[i % monthMapping.length];
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[monthNumber - 1];

      // Style mapping
      let style: TemplateStyle = defaultStyle;
      if (palette.name.includes('Gold') || palette.name.includes('Onyx')) style = 'luxury';
      else if (palette.name.includes('Minimal') || borderStyle === 'minimal') style = 'minimal';
      else if (palette.name.includes('Parchment')) style = 'vintage';
      else if (borderStyle === 'geometric') style = 'modern';
      else if (palette.name.includes('Corporate') || borderStyle === 'modern-accent') style = 'corporate';
      else if (borderStyle === 'ornate-corner' || borderStyle === 'classic-double') style = 'classic';

      const elements = generateTemplateElements(
        orientation,
        palette,
        fonts,
        catSpec,
        i,
        title,
        subtitle,
        desc,
        sig1,
        sig2
      );

      const template: CertificateTemplate = {
        id,
        name,
        category,
        subcategory: subcat,
        style,
        orientation,
        format: 'A4',
        width,
        height,
        description: `Professional ${orientation} certificate for ${subcat.toLowerCase()} in ${category}. Features ${palette.name} styling with ${fonts.display} typography and ${borderStyle} frame.`,
        background: {
          type: 'solid',
          color: palette.bg,
          patternType: palette.bgPattern || 'none',
          patternOpacity: 0.05
        },
        border: {
          style: borderStyle,
          color: palette.borderPrimary,
          secondaryColor: palette.borderSecondary,
          width: borderStyle === 'minimal' ? 2 : borderStyle === 'gold-embossed' ? 5 : 4,
          inset: isPortrait ? 30 : 36
        },
        elements,
        tags: [
          ...tags,
          subcat.toLowerCase(),
          style.toLowerCase(),
          orientation,
          monthName.toLowerCase(),
          `edition-${romanNumeral.toLowerCase()}`
        ],
        monthCollection: monthNumber,
        monthName,
        popularity: Math.floor(1000 - i * 0.8 + (catIdx % 5) * 15),
        featured: i % 12 === 0
      };

      templates.push(template);
    }
  });

  return templates;
}
