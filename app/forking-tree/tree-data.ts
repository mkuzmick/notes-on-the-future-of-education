export interface Choice {
  id: string;
  label: string;
  hint?: string;
  next: string;
}

export interface Step {
  id: string;
  question: string;
  subquestion?: string;
  choices: Choice[];
}

export interface RubricRow {
  criterion: string;
  top: string;
  bottom: string;
}

export interface Rubric {
  name: string;
  attribution: string;
  rows: RubricRow[];
  note?: string;
}

export interface Testimonial {
  quote: string;
  attribution: string;
}

export interface Example {
  place: string;
  story: string;
}

export interface Terminal {
  id: string;
  kind: "pathway" | "module";
  title: string;
  tagline: string;
  summary: string;
  bestFor: string;
  whatItLooksLike: string;
  rubrics: Rubric[];
  testimonials?: Testimonial[];
  examples?: Example[];
  concerns: string[];
  gettingStarted: string;
  alsoTry?: { targetId: string; reason: string }[];
}

export const STEPS: Record<string, Step> = {
  root: {
    id: "root",
    question: "What are you trying to assess?",
    subquestion:
      "Five lenses. Each opens onto different pathways. Pick the one that fits the course you have in mind.",
    choices: [
      {
        id: "depth",
        label: "Depth of understanding",
        hint: "Can the student think with this material in real time?",
        next: "size",
      },
      {
        id: "integrity",
        label: "Integrity of authorship",
        hint: "Did the student actually do the work they submitted?",
        next: "t-pathway-f",
      },
      {
        id: "professional",
        label: "Professional or performative competence",
        hint: "Can the student do what the discipline does — diagnose, argue, present, defend, perform?",
        next: "t-pathway-d",
      },
      {
        id: "meta",
        label: "Metacognition",
        hint: "Does the student understand how they know what they know?",
        next: "t-skill",
      },
      {
        id: "oracy",
        label: "Oracy itself",
        hint: "Speaking with structure, evidence, and presence is the learning outcome.",
        next: "t-oracy",
      },
    ],
  },
  size: {
    id: "size",
    question: "How big is the class?",
    subquestion:
      "Class size, more than anything else, decides whether you can run a high-touch format, a TF-distributed one, or an AI-assisted one.",
    choices: [
      {
        id: "small",
        label: "≤ 20 students",
        hint: "You teach it yourself. Low stakes, high frequency.",
        next: "t-pathway-a",
      },
      {
        id: "mid",
        label: "20–60 students",
        hint: "Small teaching team. Scaffolded capstone.",
        next: "t-pathway-b",
      },
      {
        id: "large",
        label: "60–200 students",
        hint: "TF team. Section-distributed oral defense.",
        next: "t-pathway-c",
      },
      {
        id: "xl",
        label: "200+ students",
        hint: "Traditional orals break down — the Bok/Craycraft AI-augmented pilot is the live experiment.",
        next: "t-pathway-e",
      },
    ],
  },
};

export const TERMINALS: Record<string, Terminal> = {
  "t-pathway-a": {
    id: "t-pathway-a",
    kind: "pathway",
    title: "Pathway A",
    tagline: "Recurring oral check-ins",
    summary:
      "The single best default for small classes. Low stakes, high frequency — the pattern most consistently supported by the post-AI literature.",
    bestFor:
      "Seminars, advanced electives, tutorials, methods courses of roughly 6–20 students that you teach yourself.",
    whatItLooksLike:
      "A standing five- to ten-minute oral moment built into every section meeting or every week of office hours. Each student takes a turn explaining one reading, defending one claim, or working through one problem aloud. You listen, probe one or two follow-ups, score in the moment. The mechanism underneath is the production effect plus the protégé effect — students who know they will speak prepare differently from students who know they will only write. Michigan's data: adding weekly check-ins raised final grades and engagement. Akkaraju's online anatomy sections: 74% mastery, 90% proficiency, academic dishonesty reported as 'almost irrelevant.'",
    rubrics: [
      {
        name: "Pemantle 0–4",
        attribution:
          "Robin Pemantle, University of Pennsylvania — advanced calculus. Published in the Penn Almanac, March 2025.",
        rows: [
          { criterion: "4 — Nailed it", top: "No substantive help needed. The student worked the problem independently with correct reasoning throughout.", bottom: "" },
          { criterion: "3 — Solved with help", top: "Hints got them unstuck, but the thinking was theirs. Prompting was about framing or recalling a specific concept, not about the logical work.", bottom: "" },
          { criterion: "2 — Struggled but got there", top: "More prompting than should have been needed. The student completed the problem but the path involved substantial scaffolding from the examiner.", bottom: "" },
          { criterion: "1 — Bits and pieces", top: "Recognizes parts of the problem; cannot assemble them into a working solution.", bottom: "" },
          { criterion: "0 — No engagement", top: "Could not begin the problem.", bottom: "" },
        ],
        note:
          "Completable in the fifteen-minute slot without post-exam deliberation. Handles prompting explicitly (3 vs 4) — this is the design feature that makes the rubric work in the moment. Under 10% of students request a re-sit; re-sits are granted as another fifteen-minute slot.",
      },
      {
        name: "Akkaraju scaffolded mastery — M / P / Not yet",
        attribution:
          "Shylaja Akkaraju, Bronx Community College (CUNY). Published in the Journal of Effective Teaching in Higher Education 6:1 (2023). Used across weekly five-minute check-ins in online anatomy and physiology, 57 students over three semesters.",
        rows: [
          {
            criterion: "Mastery (90–100)",
            top: "Explains the concept WITHOUT PROMPTING. Applies it to a novel case. Corrects common misconceptions before they are stated. Can 'talk physiology' to family and friends.",
            bottom: "",
          },
          {
            criterion: "Proficient (80–89)",
            top: "Explains the concept with MINOR PROMPTING. Applies it to the canonical case from lecture. Reasoning is sound but connections are not yet made unprompted.",
            bottom: "",
          },
          {
            criterion: "Familiar (61–79)",
            top: "Recognizes vocabulary and central ideas but cannot yet apply them reliably. Partial reasoning visible.",
            bottom: "",
          },
          {
            criterion: "Not yet (≤ 60)",
            top: "Vocabulary recall without application. Student REBOOKS within 72 hours for a retake. The retake loop is the pedagogy.",
            bottom: "",
          },
        ],
        note:
          "The retake structure turns the oral from a one-shot performance into a mastery check. Akkaraju reports 74% of students reach Mastery, 90% reach at least Proficient. The surprise finding: students said the preparation — not the exam itself — was what produced the learning.",
      },
      {
        name: "Michigan three-level engagement",
        attribution:
          "University of Michigan 'argument audit' format, cited in Inside Higher Ed and EDUCAUSE Review, 2024. Feeds participation (typically 10–15% of final grade).",
        rows: [
          {
            criterion: "Engaged",
            top: "Can RESTATE the reading's central claim. IDENTIFIES where it departs from a prior reading. NAMES one question they still have about it.",
            bottom: "",
          },
          {
            criterion: "Present",
            top: "Can summarize the reading but cannot yet situate it within the course's arc or extend it to new cases.",
            bottom: "",
          },
          {
            criterion: "Absent from the material",
            top: "Cannot identify the central claim. Vocabulary present but no engagement with the argument.",
            bottom: "",
          },
        ],
        note:
          "This is an ENGAGEMENT rubric, not a content rubric. It captures whether the student has read and thought about the material, not whether they are right about it. The three-level coarse-graining is intentional: fine distinctions would be defensible less than daily.",
      },
      {
        name: "Nursing teach-back (three minutes)",
        attribution:
          "Adapted from clinical skills verification in nursing education. Modular: drops into office hours, section, or clinical rounds without additional infrastructure.",
        rows: [
          {
            criterion: "Lay explanation",
            top: "Explains the concept to a layperson using concrete examples.",
            bottom: "Cannot translate from technical vocabulary.",
          },
          {
            criterion: "Common-error identification",
            top: "Names the most common misconception or error students make with this concept.",
            bottom: "No awareness of typical errors.",
          },
          {
            criterion: "Connection to prior concept",
            top: "Connects the current concept to a previously-covered one, naming the relationship.",
            bottom: "Treats each concept in isolation.",
          },
        ],
        note:
          "Each criterion is pass / prompted pass / repeat. Designed for a three-minute window — office hours, post-section, or a quick check during a lab rotation.",
      },
    ],
    testimonials: [
      {
        quote:
          "The freedom to riff — creating space for genuine intellectual exchange rather than rote performance — is the spirit of this pathway. The rubric exists so you can riff and still grade fairly.",
        attribution: "Lauren Kaminsky, Harvard History — March 2026 faculty meeting",
      },
      {
        quote:
          "Giving students oral exams is a great opportunity to connect with students and see what they know. Oral exams help students learn to gauge what they know more than written exams do — I can talk with them on the spot. It is much more useful, interesting, and fun than any other mode of assessment.",
        attribution: "Robin Pemantle, Mathematics, University of Pennsylvania",
      },
      {
        quote:
          "Nearly all students (90%) felt preparing and taking oral exams was a powerful learning experience. Students were surprised they could 'talk physiology' to family and friends. 74% achieved mastery, 16% proficiency — a threshold experience both for students and instructor.",
        attribution: "Shylaja Akkaraju, Bronx Community College (CUNY)",
      },
    ],
    examples: [
      {
        place: "University of Pennsylvania, advanced calculus (~50 students)",
        story:
          "Pemantle replaces two written midterms with a single 15-minute oral per student. Students work a problem at the whiteboard while narrating; Pemantle scores 0–4 in the moment and takes brief notes. Time-neutral with written midterms when you account for grading. Under 10% retake rate.",
      },
      {
        place: "CUNY Bronx Community College, online anatomy and physiology (57 students over 3 semesters)",
        story:
          "Akkaraju built a weekly rhythm: five-minute 1:1 Zoom check-in, three-tier mastery rubric, mandatory retake within 72 hours for Not-Yet scores. Students prepared with recitation sessions and deliberate practice. 74% reached Mastery on target concepts including nodal vs non-nodal action potentials, blood pressure, cardiac output, circulatory shock, edema.",
      },
      {
        place: "University of Michigan, literature course (cited in Inside Higher Ed 2024)",
        story:
          "Weekly 'argument audit': three-minute oral where the student explains one reading to the TF. The audit fed participation at 15% of the grade. Reported outcome: higher final grades and deeper engagement relative to sections without the audit.",
      },
    ],
    concerns: [
      "Anxiety — telegraph the schedule a week in advance, so cold-call pressure converts into preparation time. This single design move is the highest-leverage equity adjustment for check-in formats.",
      "Accommodations — offer an asynchronous voice-memo alternative (a 90-second recording submitted to the LMS) for students with stutters, apraxia, or selective mutism. Same pedagogical work, different modality.",
      "Standing written alternative — a written paragraph submitted before section, in lieu of speaking that week. Preserves the practice without forcing a formal accommodations conversation each time.",
      "ESL and non-native English speakers — Memon's recommendation applies: focus on professional attributes and not language surface features. Score conceptual reasoning, not pronunciation or hesitation.",
    ],
    gettingStarted:
      "This pathway needs no infrastructure. Pick a section meeting next week. Tell students at the start that the last fifteen minutes will be five three-minute oral check-ins. Try it. Iterate from there. The faculty who run Pathway B well have all run Pathway A first.",
    alsoTry: [
      {
        targetId: "t-pathway-e",
        reason:
          "The card-deck prompt system from the Craycraft AI-augmented pilot works here with index cards on a table — no studio required. Same structure (random topic, five-minute prep, brief talk, one follow-up), far lower tech.",
      },
      {
        targetId: "t-pathway-f",
        reason:
          "If students are also submitting writing, the Cornell verification layer stacks cleanly on top of this pathway — the conversation is already in the rhythm of the course.",
      },
      {
        targetId: "t-skill",
        reason:
          "The metacognitive frame — 'today, tell me what you now know you didn't know last week' — grafts directly onto this rhythm.",
      },
    ],
  },

  "t-pathway-b": {
    id: "t-pathway-b",
    kind: "pathway",
    title: "Pathway B",
    tagline: "Scaffolded capstone oral exam",
    summary:
      "The History & Literature / Social Studies model. The most evidence-rich approach Harvard already has — continuously since 1906 and 1960 respectively.",
    bestFor:
      "Advanced concentrations, junior tutorials, year-long courses culminating in a capstone. Typically 20–60 students with a teaching team.",
    whatItLooksLike:
      "An hour-long oral with three examiners across five prepared topics. But the exam is not the intervention — the scaffolding throughout the term is. Three graded oral presentations in sophomore tutorials, a mock conducted by two faculty NOT on the real panel, learning objectives named early. Without the scaffolding this becomes the UC Davis cautionary tale: a 20-page paper replaced by a 20-minute defense, evaluations down 0.8 points, complaints about anxiety and fairness. The Stephenson systematic review (2025) reports mocks raising first-time pass rates from 76% to 100% in one study, and 77%+ of students rating them 'very or extremely helpful.'",
    rubrics: [
      {
        name: "History & Literature senior oral — the full rubric",
        attribution:
          "Harvard History & Literature, reconstructed from program materials. One hour, three examiners, five prepared topics. Running continuously since 1906. Six criteria × 1–4.",
        rows: [
          {
            criterion: "Breadth across the list",
            top: "Moves between all five topics with facility; draws connections unprompted. The student can start on any topic and reach any other through the material itself.",
            bottom: "Large gaps; one or more topics inaccessible. Examiners have to work to keep the conversation moving.",
          },
          {
            criterion: "Depth on at least one topic",
            top: "Publishable-quality command. The student could plausibly defend an article-length argument on this topic today.",
            bottom: "No topic commanded at substantive depth. Every topic covered at surface level only.",
          },
          {
            criterion: "Use of evidence",
            top: "Cites specific passages, scenes, or data from memory; when prompted, can recall surrounding context. Evidence does work in arguments.",
            bottom: "Cannot ground claims in text. Gestures at 'the evidence' without producing any.",
          },
          {
            criterion: "Response to questioning",
            top: "Takes a hostile question and turns it into a better argument. 'I don't know' is handled gracefully and is followed by the student's method for finding out.",
            bottom: "Collapses under follow-up. Defensive rather than curious when pushed.",
          },
          {
            criterion: "Methodological awareness",
            top: "Names the critical schools or historiographical debates their position implies. Knows at least one alternative framework and can articulate its strengths.",
            bottom: "Unaware that methodological debates exist. Treats one framework as self-evident.",
          },
          {
            criterion: "Voice",
            top: "Thinks aloud, takes risks, self-corrects. You hear the student's mind working.",
            bottom: "Reading from memory. Delivery is smooth but the reasoning is not in the room.",
          },
        ],
        note:
          "High Pass or Distinction for 3+ across all criteria; a single 1 is usually a failure. Two-examiner minimum; Hist & Lit uses three. The rubric is not shared with students verbatim, but every criterion is practiced repeatedly in sophomore tutorials over the preceding four years.",
      },
      {
        name: "Hist & Lit sophomore tutorial rubric — shared with students",
        attribution:
          "Harvard History & Literature. The lower-stakes ramp that feeds into the senior oral four years later. Three graded oral presentations in sophomore year. The French *colles* model implemented at Harvard.",
        rows: [
          { criterion: "Summary", top: "Accurate restatement of the argument of a text, in your own terms, crisp enough that a reader who has not encountered the text knows the claim.", bottom: "Paraphrase drifts or misses the claim." },
          { criterion: "Source analysis", top: "Close attention to HOW a primary source is made — its genre, its audience, its silences, its rhetorical choices.", bottom: "Treats the source as transparent evidence rather than an artifact." },
          { criterion: "Cross-source connections", top: "Identifies resonance and tension between texts; names the interpretive move the juxtaposition enables.", bottom: "Each source discussed in isolation." },
          { criterion: "Contextualization", top: "Situates a work in its historical or literary moment — what debates it joins, what it is a response to.", bottom: "Work floats free of context." },
          { criterion: "Discussion questions", top: "The student proposes good questions for the room, not only answers. A discussion question is 'good' if it generates more text, not closure.", bottom: "Questions close down conversation rather than open it." },
          { criterion: "Presentation style", top: "Voice, pace, and engagement with the audience. The student MEETS the room rather than reads at it.", bottom: "Monologue delivered to the floor." },
        ],
        note:
          "Shared with students in advance — a design choice that is reflected throughout the rubric literature. The research is clear (LJMU crit focus groups, OSCE guidance, Stephenson systematic review) that sharing the rubric is the single most-requested improvement by students. Hist & Lit does it; most programs do not.",
      },
      {
        name: "Social Studies two-stage comprehensive oral",
        attribution:
          "Harvard Social Studies. 1.5 hours, comprehensive. Required of all seniors since 1960. Preceded by a 1,000-word 'intellectual autobiography.'",
        rows: [
          {
            criterion: "Stage 1 — Canonical reading list",
            top: "Fluency across the required theorists (Marx, Weber, Durkheim, Tocqueville, plus choice set). Uses specific arguments rather than labels; applies frames to a live empirical case posed by the examiner.",
            bottom: "Labels-only fluency. Can name theorists but cannot deploy their arguments.",
          },
          {
            criterion: "Stage 2 — Intellectual autobiography",
            top: "Coherence of the student's intellectual trajectory. Willingness to revise in conversation. Grasp of the limitations of their own framework.",
            bottom: "Autobiography read as performance rather than engaged with in real time.",
          },
        ],
        note:
          "Outcome: pass / high-pass / honors / fail. Students who fail may re-sit once. The intellectual autobiography is an interesting design choice — it explicitly invites the student to say 'here is where I have been wrong, and here is where I still might be.'",
      },
      {
        name: "UBC CTLT student-facing post-mock reflection",
        attribution:
          "University of British Columbia, Centre for Teaching, Learning and Technology. Used by the student AFTER the mock, rather than by the examiner. UBC reports it nearly doubles retention of feedback from mock sessions.",
        rows: [
          { criterion: "Question that caught you off guard", top: "Write the question verbatim. Then write the better answer you wish you had given.", bottom: "" },
          { criterion: "Where you padded or retreated", top: "Where did you pad, repeat, or retreat into generality? What do you actually know about that spot?", bottom: "" },
          { criterion: "Resistance and engagement", top: "Where did you resist a question you should have engaged, or engage a question you should have resisted?", bottom: "" },
          { criterion: "What you know you don't know", top: "Name one thing you now know you do not know. Describe your plan for the next 48 hours.", bottom: "" },
        ],
        note:
          "This is the equity intervention of the pathway, not the mock itself. The mock surfaces the gaps; the reflection closes them. UBC's data shows feedback retention nearly doubles relative to verbal-only debriefs.",
      },
    ],
    testimonials: [
      {
        quote:
          "Continuously since 1906. Five prepared topics, three examiners, one hour. Graduates include Conan O'Brien and Frank Rich — the format does not produce inarticulate alumni.",
        attribution: "History & Literature program history, Harvard",
      },
      {
        quote:
          "I've been reflecting on student performance at the end of each exam session, using the last 10 minutes for structured self-assessment. That's where the grade calibration actually happens.",
        attribution: "Lauren Kaminsky, Harvard History — March 2026 faculty meeting",
      },
      {
        quote:
          "The mock is the one thing I would not cut. Not the rubric, not the topic lists, not the norming session — the mock. Students walk in to the real exam already having been through it once, and the anxiety that had defined the preceding weeks is almost entirely discharged.",
        attribution: "Hist & Lit senior tutor (program materials)",
      },
    ],
    examples: [
      {
        place: "Harvard History & Literature (since 1906)",
        story:
          "Five prepared topics, three examiners, one hour. The scaffolding that makes it work: three graded oral presentations in sophomore tutorials, a mock oral conducted by two faculty NOT on the real panel, a written evaluation across four dimensions with no summative grade (navigation of the reading list / situating the field / productive use of uncertainty / tempo and repair). The mock runs about forty minutes with twenty minutes of spoken feedback afterward.",
      },
      {
        place: "Harvard Social Studies (since 1960)",
        story:
          "1.5-hour comprehensive oral required of every senior. Preceded by a 1,000-word intellectual autobiography the examiners have read in advance. Stage 1 tests canonical theorists; Stage 2 tests the student's own trajectory. Re-sit permitted once for failures.",
      },
      {
        place: "Harvard Folklore & Mythology (since 1967)",
        story:
          "General exam with BOTH written and oral components required of ALL concentrators, not just honors students. Philosophically aligned with a concentration studying how human societies preserve knowledge through spoken word. The oral portion assesses fidelity / register / embodiment / framing — the student's retelling is itself data, graded as performance.",
      },
    ],
    concerns: [
      "Bias — the 2018 Studies in Higher Education finding (women systematically lower-scored across ten UK universities, gap widening under male examiners) is mitigated, not eliminated, by structured rubrics. A 60–90 minute calibration session with the examining team is the minimum. Memon's twenty-five-year-old recommendation — 'examiners should focus on professional attributes and not language surface features' — is widely endorsed and largely unmet.",
      "Recording governance — the stakes justify retention but also amplify the FERPA exposure. See the four-rationale framework (appeals / calibration / self-review / research) before defaulting to 'record everything.' Unbundle consent so students can opt in to any subset.",
      "Accommodations — pre-negotiate the alternative format with DAO BEFORE exam week, not at the moment of request. Standard written-exam accommodations (extended time, reduced-distraction room) do not transfer directly; a written supplement, interpreter-mediated oral, or asynchronous recorded oral may be the appropriate alternative depending on the student.",
      "The mock is the equity intervention. Skipping it to save time is the single biggest design mistake this pathway invites.",
    ],
    gettingStarted:
      "Do not start here if you don't already have the infrastructure. Faculty who run capstone orals well have all run Pathway A first. Grow into this over a year or two. If you run a concentration and want to adopt the Hist & Lit or Social Studies model, contact one of the concentrations listed in the meeting summary — they are willing models.",
    alsoTry: [
      {
        targetId: "t-pathway-c",
        reason:
          "If the class grows past 60 students, this model distributes across TFs with norming becoming the equity intervention. The rubric travels; only the logistics change.",
      },
      {
        targetId: "t-pathway-a",
        reason:
          "The weekly lower-stakes practice is the substrate this pathway depends on. Mocks close the gap at the end of the term; check-ins produce the fluency the mock tests.",
      },
      {
        targetId: "t-pathway-d",
        reason:
          "Generals (PhD vivas) are the upstream model this whole pathway descends from. If you want the highest-stakes version of scaffolded orals, look there.",
      },
    ],
  },

  "t-pathway-c": {
    id: "t-pathway-c",
    kind: "pathway",
    title: "Pathway C",
    tagline: "Section-level oral defense",
    summary:
      "The mid-sized lecture pathway. TF team distributes the load. Hartmann's data: 13 hours total for a 25-student section — less than her written midterm-and-final cycle.",
    bestFor:
      "Courses of roughly 60–200 students with three to ten TFs. Courses with a question bank deep enough to support several fresh draws per TF per exam day.",
    whatItLooksLike:
      "Every student sits for a 10–15 minute oral with their TF during reading period or as a section replacement in week 12. TFs draw from a shared question bank — at least three times as many questions as students, so no two consecutive students see the same prompt. Faculty hold a 60–90 minute norming session the week before, scoring two or three sample answers independently and discussing. The point of norming is not to eliminate disagreement; it is to CONVERGE THE VOCABULARY so Student 47 with TF Maria gets the same score they would have gotten with TF Daniel.",
    rubrics: [
      {
        name: "Princeton McGraw four-criterion",
        attribution:
          "Princeton McGraw Center for Teaching and Learning — Faculty Resource Library, 'Using Oral Exams.' The closest thing to a shared American reference for TF-administered orals. McGraw recommends two pages of exemplar answers PER QUESTION so TFs can norm-set before the first student arrives.",
        rows: [
          {
            criterion: "Content knowledge (accuracy, depth, relevance)",
            top: "All key concepts correct, precise terminology. Depth goes beyond lecture coverage; student engages with material at a level appropriate to the course's stated outcomes.",
            bottom: "Fundamental misconceptions visible. Confusion about basic concepts or terminology.",
          },
          {
            criterion: "Critical thinking (analyze, synthesize, evaluate)",
            top: "Analyzes, synthesizes, and evaluates information. Identifies at least one alternative framework or counter-position.",
            bottom: "Reproduces content without analytical work.",
          },
          {
            criterion: "Communication (clarity, organization, articulation)",
            top: "Clear, organized, appropriately precise. Handles 'I don't know' gracefully; offers a route to finding out.",
            bottom: "Difficult to follow even with patient prompting.",
          },
          {
            criterion: "Use of evidence",
            top: "Cites course materials or data accurately and apropos. Evidence does work in arguments rather than decorating them.",
            bottom: "No engagement with sources; claims float free of evidence.",
          },
        ],
        note:
          "Level descriptors are written by the instructor for their specific course. The McGraw template is intentionally skeletal — the content of 'accuracy' in a molecular biology course is not the same as in a political theory course, and the rubric should reflect that.",
      },
      {
        name: "Condensed weighted version (30/30/25/15)",
        attribution:
          "Adapted from Princeton McGraw for shorter 10-minute sessions. Scored 1–4 per criterion, totaling 16; convert to course scale.",
        rows: [
          { criterion: "Content accuracy & conceptual depth (30%)", top: "Precise terminology; explains the why, connects to other concepts unprompted.", bottom: "Fundamental misconceptions visible." },
          { criterion: "Reasoning & application (30%)", top: "Applies concept fluently to a novel case.", bottom: "Cannot transfer." },
          { criterion: "Use of evidence (25%)", top: "Course material deployed accurately.", bottom: "No engagement with sources." },
          { criterion: "Communication (15%)", top: "Clear, organized; handles 'I don't know' gracefully.", bottom: "Difficult to follow." },
        ],
        note:
          "The weighting pushes TFs toward substance over surface — communication is 15% rather than equal. This is deliberate: at section scale, a well-reasoned but hesitant answer should outrank a polished but shallow one.",
      },
    ],
    testimonials: [
      {
        quote:
          "13 hours total for a 25-student humanities course. Less than the 15+ hours my written midterm-and-final cycle had taken. The rubric's brevity is the reason.",
        attribution: "Catherine Hartmann, University of Wyoming",
      },
      {
        quote:
          "The TF norming session is the equity intervention. Not the rubric, not the question bank, not the schedule — the norming session. The rubric is a prompt for TFs to calibrate against each other. If they don't, it is just paper.",
        attribution: "PCP faculty meeting notes, March 2026",
      },
      {
        quote:
          "600 oral exams in under one week for a first-year literacy course. No integrity issues. Lecturers were rewarded with a weekend free from marking papers.",
        attribution: "CQUniversity Australia, cited in The Conversation (2026)",
      },
    ],
    examples: [
      {
        place: "University of Wyoming — Catherine Hartmann's humanities course (25 students)",
        story:
          "Three-dimension 0–3 rubric (argument reconstruction / source use / extension under questioning) administered in 20-minute slots. Total instructor time: 13 hours for the entire class across the semester. Hartmann reports students arrived with stronger writing as a downstream effect of preparing for the oral — the oral forced them to articulate what they were trying to argue, which improved the written drafts.",
      },
      {
        place: "CQUniversity, Australia — first-year literacy course (600 students)",
        story:
          "Asynchronous reflective journals PLUS scheduled live conversations. Every student interviewed within one week; no integrity issues reported; lecturer hours lower than the previous written-exam cycle. The proof-of-concept that oral assessment CAN scale to a 600-student course when the logistics are designed for it.",
      },
      {
        place: "University of Melbourne framework (cited in Pathway B literature)",
        story:
          "Always two examiners present, sessions recorded, base questions predetermined with room for follow-up probing. Transferable to the section-level format: each TF pairs with another TF for the session, and they trade scoring roles across students.",
      },
    ],
    concerns: [
      "TF-team variance is the biggest equity risk in this pathway. The norming session is the equity intervention, not a logistics step. The 2024 Frontiers in Education study documented that pre-service teachers' implicit biases against students with migration backgrounds disappeared as a measurable grading effect WHEN A RUBRIC WAS USED AND CALIBRATED, and showed up clearly when no rubric was used.",
      "Recording for appeal protection is most defensible here, precisely because students assigned to TFs they don't know have less recourse than students examined by the instructor of record. Default-delete after the appeal window (30–60 days). Unbundle consent per the four-rationale framework.",
      "Scheduling accessibility — students with childcare, work, or commuting constraints are systematically disadvantaged by reading-period oral slots. Offer at least one weekday-evening and one early-morning window per TF. Asynchronous recorded options for students who cannot make any live window.",
      "FERPA — once captured, the recording is an education record: access-controlled, governed by retention schedule. 'It's just for grading purposes' is a good-faith reassurance, not a FERPA-compliant policy.",
    ],
    gettingStarted:
      "The norming session is the prototype. Run one with your TFs in week 8, on three sample answers, before committing to full deployment. If the norming goes well, the format will work; if it goes badly, you've caught the problem in advance. Consider a pilot with a single section first, then scale to all sections in the following term.",
    alsoTry: [
      {
        targetId: "t-pathway-b",
        reason:
          "The upstream model. If you want a capstone moment too — a single high-stakes oral that binds the term — the Hist & Lit scaffolding is the proof of concept.",
      },
      {
        targetId: "t-pathway-e",
        reason:
          "If TFs are not feasible at all (your course exceeds 200), the AI-augmented model handles scale at different cost and governance trade-offs.",
      },
      {
        targetId: "t-pathway-f",
        reason:
          "Pathway F layered on top of section work as a verification trigger — spot-check during a section meeting when a paper reads suspiciously — costs almost nothing additional.",
      },
    ],
  },

  "t-pathway-d": {
    id: "t-pathway-d",
    kind: "pathway",
    title: "Pathway D",
    tagline: "Borrow your discipline's oral tradition",
    summary:
      "The format already exists. Adapt it; don't invent a new one. Your discipline has been refining this for decades or centuries. Medicine since 1975, law since 1820, studio since the Beaux-Arts, business since 1908, research seminar since the medieval disputatio.",
    bestFor:
      "Any course in a discipline with an inherited oral tradition. Clinical (OSCE), legal (moot court), studio (the crit), STEM (board talk), performance arts (jury, practical), business (case method, pitch), research seminar (defense, viva).",
    whatItLooksLike:
      "The format WORKS because it has been calibrated over generations. Your job is not to invent but to adapt. Each sub-discipline below is a complete format in itself — pick the one that matches your course's epistemology and scale. The through-line across all of them: discipline-specific content criteria layered with discipline-specific presentation criteria, multiple examiners, a clear outcome taxonomy.",
    rubrics: [
      {
        name: "OSCE checklist + global rating — the single most transferable design feature in the literature",
        attribution:
          "Harden et al., British Medical Journal 1 (1975), 447–451, and successors. Standard in every accredited medical school worldwide since 1975. Raised oral-exam inter-rater reliability from below 0.25 in the 1960s to levels comparable with multiple-choice tests.",
        rows: [
          {
            criterion: "Checklist — binary, ~20 items per station",
            top: "Introduced self, confirmed patient identity, washed hands. Screened for red-flag symptoms appropriate to the presenting complaint. Summarized the encounter back to the patient before closing. (Specific items per station.)",
            bottom: "One or more critical steps missed — each item scored independently.",
          },
          {
            criterion: "Global rating — 1 to 5",
            top: "5 — ready to practice independently. 4 — competent with oversight. 3 — developing competence. 2 — significant concerns. 1 — not safe.",
            bottom: "",
          },
        ],
        note:
          "THE KEY DESIGN FEATURE: a student can pass the checklist and fail the global, or vice versa. The two scores CORRECT each other. This transfers cleanly to any assessment with a procedural component — lab sciences, language proficiency, any course where students demonstrate a sequence of discrete skills plus the integrated judgment to deploy them.",
      },
      {
        name: "LJMU crit — five criteria × 20%, scored 1–5",
        attribution:
          "Liverpool John Moores University, reproduced in the Blythman/Orr/Blair 'Critiquing the Crit' focus-group study (2011), JEBE 6:1. The most-cited example in the English-language crit literature.",
        rows: [
          {
            criterion: "Response to brief",
            top: "Extends the brief productively and reframes the problem.",
            bottom: "Misreads or ignores the brief.",
          },
          {
            criterion: "Conceptual development",
            top: "Coherent conceptual argument traceable through all drawings and models.",
            bottom: "No legible concept.",
          },
          {
            criterion: "Design resolution",
            top: "Plan, section, site, and detail all resolve in relation to the concept.",
            bottom: "Fragmentary and unresolved.",
          },
          {
            criterion: "Representation",
            top: "Drawings and models communicate with precision.",
            bottom: "Unreadable.",
          },
          {
            criterion: "Oral defense",
            top: "Articulates decisions, names precedents, responds to objections with counter-evidence.",
            bottom: "Cannot account for choices.",
          },
        ],
        note:
          "The crit research documented what is now canonical: students repeatedly ask for the rubric BEFORE the crit, and rarely receive it. Sharing it is the single most-requested improvement.",
      },
      {
        name: "Gardner & Giordano physics/astronomy — Bloom-tiered",
        attribution:
          "Gardner, J. & Giordano, N., 'Using Oral Exams in Physics and Astronomy Courses,' arXiv preprint 2509.09846 (2025). Each tier 0–2, totaling 6. Rubric is published on the course website BEFORE the exam, following the Princeton norming principle.",
        rows: [
          {
            criterion: "Explain",
            top: "Student states the physical principle at play and derives the governing equation. The question is whether the student produces the physics, not only the formula.",
            bottom: "Cannot state the principle or confuses similar principles.",
          },
          {
            criterion: "Apply",
            top: "Student works the problem through to numerical answer, checking units and limits. The best students check the limit cases (what happens as v → c?) WITHOUT being asked.",
            bottom: "Formula manipulation without physical reasoning.",
          },
          {
            criterion: "Extend",
            top: "Student answers a what-if variation — 'what changes if this were relativistic?', 'what if the mass is halved?' — demonstrating reasoning about the STRUCTURE of the problem, not only the instance.",
            bottom: "Treats the what-if as a new problem rather than a variation.",
          },
        ],
        note:
          "A strong board talk earns 6/6; a passing one earns 3–4/6. The rubric maps cleanly onto Bloom's taxonomy — Explain is understanding, Apply is application, Extend is analysis/synthesis.",
      },
      {
        name: "USAFA mathematics — four equal criteria",
        attribution:
          "U.S. Air Force Academy Department of Mathematical Sciences, 'Individual Oral Exams in Mathematics Courses: 10 Years of Experience.' Administered over a decade.",
        rows: [
          {
            criterion: "Problem set-up",
            top: "Translates the word problem into a mathematical object correctly.",
            bottom: "Misreads the problem or sets up the wrong equation.",
          },
          {
            criterion: "Execution",
            top: "Mathematical work is correct.",
            bottom: "Algebraic or arithmetic errors compound.",
          },
          {
            criterion: "Narration",
            top: "Cadet is EXPLAINING the work, not only performing it silently. An observer could follow the thinking.",
            bottom: "Silent work with no verbalization.",
          },
          {
            criterion: "Recovery",
            top: "When the cadet makes an error, the cadet catches and corrects it — or recognizes it when pointed out and adjusts. The mistake does not compound.",
            bottom: "Error propagates silently; cadet does not notice or cannot recover.",
          },
        ],
        note:
          "USAFA reports that RECOVERY is the single best predictor of downstream success in advanced mathematics courses. Finding mirrored in the Iannone & Simpson (2020) study on oral assessment and deep learning. This is a rare rubric where a criterion is empirically validated against longitudinal outcomes.",
      },
      {
        name: "Conservatory jury (NASM-accredited)",
        attribution:
          "Composite synthesized from Oberlin Conservatory, Juilliard School, and Eastman School of Music published jury sheets; NASM Handbook 2024–25. Student performs 15–25 minutes of repertoire before a faculty panel, then responds to questions.",
        rows: [
          { criterion: "Technical accuracy (25%)", top: "Pitch, rhythm, tempo, intonation — precise throughout.", bottom: "Persistent technical failures that affect the listener's experience of the work." },
          { criterion: "Musicianship (25%)", top: "Phrasing, dynamics, tone production — musical intent is audible in every phrase.", bottom: "Notes without music; the phrases do not land." },
          { criterion: "Interpretation (25%)", top: "Stylistic awareness and CONVICTION of artistic choices. The student has made decisions and can defend them.", bottom: "Default interpretation; no visible artistic agency." },
          { criterion: "Stage presence and recovery (15%)", top: "Poise, recovery from slips, response to the room.", bottom: "Slips destabilize the rest of the performance." },
          { criterion: "Oral response (10%)", top: "Can defend tempo choices, name the work's historical moment, discuss prior recordings. Note the 10% — even in a performance jury, the panel asks WHY.", bottom: "Cannot account for the interpretive choices made." },
        ],
        note:
          "Even in a conservatory jury, oral response is weighted. Performance alone does not constitute the assessment. The panel wants to know whether the student understands the decisions they made.",
      },
      {
        name: "Drama school practical exam",
        attribution:
          "Synthesized from RADA, Juilliard Drama, and Yale School of Drama published assessment criteria. The rubric is diagnostic — the oral defense is minimal; the PERFORMANCE is the answer.",
        rows: [
          { criterion: "Given circumstances", top: "Does the actor KNOW, in the body, who they are, where they are, when, and why they want what they want.", bottom: "Generic playing without specific circumstances visible." },
          { criterion: "Objective and action", top: "Is the actor playing a specific, winnable objective through a specific tactic.", bottom: "Playing a mood or a feeling rather than an objective." },
          { criterion: "Listening and response", top: "Does the actor actually HEAR their scene partner, or deliver pre-planned readings.", bottom: "Pre-planned readings that do not adjust to the scene as it unfolds." },
          { criterion: "Specificity of choice", top: "Physical, vocal, and emotional choices are SPECIFIC rather than generic.", bottom: "Default generic choices; no artistic agency visible." },
          { criterion: "Re-direction", top: "When the examiner gives a new instruction ('play this scene as if you know she is lying'), the actor TAKES the adjustment and changes the performance.", bottom: "Cannot incorporate re-direction; the scene remains unchanged." },
        ],
        note:
          "Re-direction — the examiner's ability to change the circumstances mid-scene — is the feature of this rubric that makes it oral assessment rather than performance evaluation. You are not grading the polished scene; you are grading the actor's capacity to change the scene in response to new information.",
      },
      {
        name: "Folklore & Mythology performance",
        attribution:
          "Harvard Folklore & Mythology concentration requirements. The senior project defense includes a PERFORMANCE component — students TELL a piece of the tradition they have studied.",
        rows: [
          { criterion: "Fidelity", top: "Accuracy to the source material and tradition. The telling is recognizable to a practitioner of the tradition.", bottom: "Liberties taken that misrepresent the tradition." },
          { criterion: "Register", top: "Appropriate tone, diction, and rhythm for the genre.", bottom: "Register mismatched to the genre (academic where oral is needed, or casual where ceremonial is needed)." },
          { criterion: "Embodiment", top: "The performance is ALIVE. It is not recitation but re-telling.", bottom: "Text recited rather than performed." },
          { criterion: "Framing", top: "After performing, the student can situate what they did within the relevant folklore scholarship.", bottom: "Performance and scholarship do not connect." },
        ],
        note:
          "This is one of the few Harvard undergraduate rubrics that explicitly grades oral performance AS performance. Philosophically aligned with the concentration's subject: if you study how human societies preserve knowledge through spoken word, the assessment must involve the spoken word as a genre, not only as a subject.",
      },
    ],
    testimonials: [
      {
        quote:
          "If a concentration studies how human societies preserve knowledge through spoken word, the assessment must involve the spoken word as a genre, not only as a subject. Since 1967.",
        attribution: "Folklore & Mythology, Harvard (concentration materials)",
      },
      {
        quote:
          "Moot court started at Harvard Law School in 1820 and remains central to legal education worldwide. Judges interrupt, redirect, and probe — forcing a quick change of train of thought and analytical thinking.",
        attribution: "Harvard Law School, moot court history",
      },
      {
        quote:
          "Up to 80% of class time devoted to oral discussion. Class contribution 40–50% of course grades. If the Business School can grade oral contribution for all students across two years, the College can assess 6,700 undergraduates.",
        attribution: "Harvard Business School case method — 'The HBS Case Method' (since 1908)",
      },
      {
        quote:
          "OSCEs are classified as 'quantitative' assessment with structured scoring. If oral-performative assessment can be rigorous enough for life-or-death medical competency, it is rigorous enough for undergraduate coursework.",
        attribution: "Harvard Medical School student handbook — 'Student Assessment in the MD Program'",
      },
    ],
    examples: [
      {
        place: "Harvard Medical School — OSCEs since 1975",
        story:
          "Required of every MD student. 5–20 stations, each testing a specific clinical skill with standardized patients and predetermined marking criteria. Communication, clinical judgment under pressure, handling unexpected patient behavior, bedside manner. The format that proved oral assessment can be both rigorous and scalable — 900 students annually across three years.",
      },
      {
        place: "Harvard Law School — moot court since 1820; Socratic method since 1870",
        story:
          "Moot court mandatory in first-year legal writing. Judges ask questions forcing quick change of train of thought and analytical thinking. The UK Bar Training Course uses a 60% pass mark set by the Bar Standards Board — proof that oral assessment can have defensible grading standards enforced at the level of professional licensure.",
      },
      {
        place: "Harvard Business School — case method since 1908",
        story:
          "Up to 80% of class time devoted to oral discussion of cases. Class contribution graded at 40–50% of course grades. Approximately 900 MBA students × two years × multiple courses per semester = thousands of hours of oral assessment annually. The largest continuous experiment in oral assessment at scale within the University.",
      },
      {
        place: "University of Minnesota pharmacy — integrated oral exams across pharmacotherapy (110–160 students annually)",
        story:
          "Oral exams testing knowledge across multiple courses simultaneously. Assesses both summative mastery and formative learning. The unanticipated formative effect: students gain confidence and metacognitive awareness — affective outcomes not visible in written assessment.",
      },
    ],
    concerns: [
      "The discipline's tradition usually has accommodations precedent. OSCEs have decades of guidance for deaf, blind, and mobility-impaired candidates. Conservatory juries have well-developed protocols for performance anxiety. Moot court accommodates speech disfluencies. Borrow the accommodations playbook along with the rubric.",
      "Performance-based formats have the highest recording / ASR exposure. If the artifact IS the performance, recording is harder to opt out of. The recording-and-consent unbundling (appeals / calibration / self-review / research) matters more here.",
      "Bias on delivery — accent, cadence, and physical presence carry cultural weight in every performance-based rubric. Explicit rubrics and multiple examiners mitigate; calibration sessions are mandatory.",
      "Inherited rubrics can embed inherited biases. A moot court rubric written in 1950 may implicitly reward 'decorum' in ways that track race and gender. Audit the inherited rubric before adopting it; update where needed.",
    ],
    gettingStarted:
      "Look up what your discipline already does. One of the Harvard concentrations or professional schools listed above probably runs a version of this format — the contact list in the meeting summary is a good place to start. Don't design from scratch if you don't have to. Adapt, don't invent.",
    alsoTry: [
      {
        targetId: "t-pathway-b",
        reason:
          "Generals (PhD vivas) are the upstream model for scaffolded capstones. The structure transfers downward. If your discipline is research-seminar-shaped rather than clinical-shaped, this is the nearer cousin.",
      },
      {
        targetId: "t-pathway-f",
        reason:
          "Moot and pitch formats pair cleanly with written briefs; the Cornell verification layer applies on top. Clinical simulations pair with written case reports similarly.",
      },
      {
        targetId: "t-oracy",
        reason:
          "Performance-based formats already weight delivery heavily within disciplined rubrics. If your course's learning outcome is delivery itself, the oracy module is the base layer beneath.",
      },
    ],
  },

  "t-pathway-e": {
    id: "t-pathway-e",
    kind: "pathway",
    title: "Pathway E",
    tagline: "AI-augmented studio pilot",
    summary:
      "The Bok Center / Craycraft model. Highest infrastructure investment, most documentation, emerging best practices. Pilot finding: 86% of students said preparation deepened understanding; 55% would choose the format again. The asymmetry IS the finding.",
    bestFor:
      "Larger Gen Eds (75–250 students) where TF-led orals don't scale at depth. Faculty willing to iterate, and willing to be explicit with students about the tech. Courses where documentation for calibration is itself a design goal.",
    whatItLooksLike:
      "Students draw cards from thematic decks (Core Concepts / Case Studies / Theoretical Models), prepare for five minutes, deliver a 4–6 minute spontaneous presentation. The system generates follow-ups from each student's transcript; session data are stored for calibration. The crucial diagnostic from the pilot: the 55%-would-not-repeat signal was RESISTANCE TO RECORDING AND THE STUDIO — not to the oral format itself. That is a tractable design problem. Two emerging model variants: (1) AI conducts, humans grade (Stanford Sherpa, ElevenLabs agents with human review); (2) AI conducts AND helps grade via a 'council of LLMs' (Ipeirotis at NYU Stern — Claude + Gemini + ChatGPT deliberate, human audits).",
    rubrics: [
      {
        name: "Craycraft four-criterion — the Bok pilot rubric",
        attribution:
          "Sarah Craycraft, Harvard Learning Lab pilot. Gen Ed folklore and performance course. n=75, >90% response rate. Each criterion scored 1–4.",
        rows: [
          {
            criterion: "Concept accuracy",
            top: "Explains the drawn concept correctly, with nuance. The student can distinguish this concept from adjacent concepts.",
            bottom: "Cannot define the drawn concept.",
          },
          {
            criterion: "Case integration",
            top: "Concept does work in the analysis of the case; integration is specific. The case illustrates the concept, not just accompanies it.",
            bottom: "Concept and case both present but disconnected; the case does not illuminate the concept.",
          },
          {
            criterion: "Theoretical framing",
            top: "Places both concept and case within the drawn theoretical model. The model shapes the analysis rather than decorating it.",
            bottom: "Theoretical model absent or named but unused.",
          },
          {
            criterion: "Response to AI follow-up",
            top: "Uses the follow-up to DEVELOP a new line of argument. The follow-up opens new material rather than closing down the conversation.",
            bottom: "Cannot incorporate the follow-up; the follow-up derails the student.",
          },
        ],
        note:
          "The card-deck prompt system works as a standalone technique WITHOUT the full tech setup. This is the bridge to Pathway A. Faculty can borrow the cards without buying the studio.",
      },
      {
        name: "NYU Stern voice-agent — four machine-scored dimensions",
        attribution:
          "Panos Ipeirotis, NYU Stern School of Business. Course: AI / ML Product Management. ElevenLabs voice agent; 36 students. Cost per student: $0.42 ($15 total, versus $750 for human-administered). 89% of AI-assigned grades within one point of human judgment.",
        rows: [
          {
            criterion: "Factual correctness",
            top: "Does the spoken answer match the reference? The student produces the correct information about the domain.",
            bottom: "Factual errors or invented information.",
          },
          {
            criterion: "Reasoning chain",
            top: "Steps articulated in the right order. The student's thinking is VISIBLE in the narration.",
            bottom: "Conclusion stated without the supporting reasoning.",
          },
          {
            criterion: "Robustness to follow-up",
            top: "Does the student HOLD POSITION under pushback? When the agent challenges, can the student distinguish 'I was wrong' from 'you misunderstand me'?",
            bottom: "Capitulates to any pushback regardless of whether it is warranted.",
          },
          {
            criterion: "Defensive move identification",
            top: "When the student says 'I don't know,' is it an APPROPRIATE flag (the genuine edge of their knowledge) or a dodge (a way to avoid commitment)?",
            bottom: "Non-answers deployed strategically to avoid the question.",
          },
        ],
        note:
          "The 11% disagreement between AI grades and human judgment concentrated on robustness to follow-up — which humans read through tone that transcription flattens. This is the clearest signal in the literature about which criteria are NOT YET AI-gradable: the ones that depend on hearing the space around the words. The 'council of LLMs' — Claude, Gemini, and ChatGPT independently grade, then deliberate, then synthesize — is the current best practice when you do run the grading through machines.",
      },
      {
        name: "Stanford Sherpa four-state flag",
        attribution:
          "Stanford undergraduate team (EdSurge coverage, October 2023). AI-conducted formative oral check-ins with flag-based instructor review. Best-documented example of AI as the formative layer with human judgment as the summative.",
        rows: [
          {
            criterion: "Green",
            top: "Response matches reference understanding. Student demonstrates the expected grasp of the concept.",
            bottom: "",
          },
          {
            criterion: "Yellow",
            top: "Partial match; likely understanding gap. Instructor should review this session.",
            bottom: "",
          },
          {
            criterion: "Orange — the Dunning-Kruger flag",
            top: "Confident BUT INCORRECT. The most important flag in the system — a student who is wrong and confident about it.",
            bottom: "",
          },
          {
            criterion: "Red",
            top: "Unable to produce a substantive response. Material not engaged.",
            bottom: "",
          },
        ],
        note:
          "The instructor sees only the yellow-and-red (and especially orange) cohort weekly — not every session. This is the design feature that makes the format scale: AI triages; human judgment concentrates where it is needed.",
      },
      {
        name: "Craycraft metacognitive — the skill-presentation variant",
        attribution:
          "Sarah Craycraft, Harvard Learning Lab. Student chooses a skill they must figure out how to learn, presents on both the skill and the learning process. Philosophically aligned with Fiorella & Mayer's protégé-effect research (2013).",
        rows: [
          {
            criterion: "Skill acquisition",
            top: "Demonstrably acquired; can perform the skill in the room.",
            bottom: "Cannot perform the skill.",
          },
          {
            criterion: "Method articulation",
            top: "Names the learning strategy used and explains why it fit the skill.",
            bottom: "Method absent or post-hoc rationalization.",
          },
          {
            criterion: "Obstacle diagnosis",
            top: "Identifies where they got stuck, what they tried, what worked. The diagnosis is specific, not general.",
            bottom: "'It was hard' without specificity about what was hard or what helped.",
          },
          {
            criterion: "Transfer",
            top: "Articulates what they would do differently for a RELATED skill. The metacognitive work generalizes.",
            bottom: "Cannot project learning process to a different skill.",
          },
        ],
        note:
          "One of the few rubrics in the corpus where the primary object of assessment is metacognition rather than content knowledge. Aligns with Fiorella and Mayer's protégé effect: the students who learn most are those who prepare to teach.",
      },
    ],
    testimonials: [
      {
        quote:
          "86% said preparation deepened understanding; 55% would choose the format again. The asymmetry is the finding.",
        attribution: "Sarah Craycraft, Bok Center pilot (n=75)",
      },
      {
        quote:
          "The old system where take-home papers could reliably measure understanding is dead, gone, kaput. Students can now answer most exam questions with AI. Oral exams force real-time reasoning, application to novel prompts, and defense of actual decisions. For $15, we got real-time oral examination, a three-model grading council with deliberation, and structured feedback with verbatim quotes.",
        attribution: "Panos Ipeirotis, NYU Stern — 'Fighting Fire with Fire: Scalable Personalized Oral Exams' (2025)",
      },
      {
        quote:
          "If you truly understand something, you should be able to explain it. We are in an era in which information is abundant, but wisdom is scarce. We want to elevate people's critical thinking and communication skills.",
        attribution: "Ray Hung, Georgia Tech — Socratic Mind platform (piloted with 5,000+ students, 70–95% positive ratings)",
      },
      {
        quote:
          "I had prepared thoroughly and felt confident — but the intensity of the interviewer's voice unexpectedly heightened my anxiety.",
        attribution: "NYU Stern student, Ipeirotis pilot",
      },
      {
        quote:
          "It felt like a job interview, not just an exam. 70% of students agreed that the format tested their actual understanding — the highest-rated item on the post-exam survey. 83% found it more stressful than a written exam.",
        attribution: "University of Auckland Business School — Richter & Dodd interactive oral assessment study",
      },
    ],
    examples: [
      {
        place: "Harvard Learning Lab — Craycraft Gen Ed folklore pilot (n=75)",
        story:
          "Three thematic card decks (Core Concepts / Case Studies / Theoretical Models). Students draw, prepare for five minutes, present for 4–6 minutes. System generates follow-ups from the transcript; session data stored for grading calibration. 86% said preparation deepened understanding. 55% would choose again — resistance centered on recording and the studio environment, not on the oral format. The card-deck prompt system works as a standalone technique without the full tech setup.",
      },
      {
        place: "NYU Stern — Ipeirotis Product Management final (36 students)",
        story:
          "ElevenLabs voice agent interviews students for 25 minutes each. Transcript processed by council of three LLMs (Claude, Gemini, ChatGPT); each grades independently, then they are prompted to deliberate and synthesize. Human audit on 11% of grades. $0.42 per student (vs. $750 for human-administered). 89% alignment with human judgment. Known failure modes: intimidating tone, stacked questions, insufficient think-time.",
      },
      {
        place: "Georgia Tech — Socratic Mind platform (5,000+ students)",
        story:
          "AI-powered Socratic questioning with dynamic follow-ups. Deployed in CS1301 (2,000 students) and Intro to AI (900 students). The platform does NOT accept student persuasion — unlike general-purpose ChatGPT, it probes and pushes back. 70–95% positive student experience; statistically significant learning improvements over non-Socratic controls.",
      },
      {
        place: "Stanford — Sherpa tool for formative oral check-ins",
        story:
          "Student-developed AI tool that transcribes short oral responses and flags weak ones for instructor review. Four-state flag (green / yellow / orange / red). Instructors see only yellow+red weekly. Asynchronous — removes the scheduling bottleneck that kills most oral-assessment attempts at scale.",
      },
    ],
    concerns: [
      "Recording — the four-rationale unbundling (appeals / calibration / self-review / research) is UPSTREAM of scaling this pathway. Each rationale has a different retention window and access model. Conflating them in a single default consent form is why students resist.",
      "Accommodations — AI-as-accommodation in oral formats has no settled institutional answer. Teachers College allows generative AI accommodation for students with a registered disability. Whether a student with such an accommodation may use AI DURING an oral exam — for preparation, for real-time transcription, for both — must be resolved at institutional level before scaling, not per-course.",
      "ASR bias — CU Boulder documented 24% lower automatic-speech-recognition accuracy for Black speakers; word error rates of 46–56% for younger speakers whose speech the training corpus underrepresents. If transcripts feed into AI-assisted grading, the transcript CARRIES the bias the oral format was supposed to escape. The defensible position: audio/video is the authoritative record; transcripts are marked machine-generated and bias-affected; faculty do not grade from transcript alone.",
      "Studio environment is a SEPARATE variable from recording. The Craycraft pilot's resistance combined both. A second pilot cohort in a seminar room with a ceiling mic and a laptop camera is a legitimate design variant to test separately from the consent changes.",
      "Human appeals path is MANDATORY. No grade rests entirely on a machine-graded transcript without human review available on request.",
      "AI as preparation vs. AI as compromise — the working principle from the Learning Lab pilots: if the AI tool generates content the student cannot explain back under follow-up, that content is compromise. If the student can, it is preparation. This principle is not yet institutional policy.",
    ],
    gettingStarted:
      "The card-deck version is the prototype. Build three thematic decks of 20 cards each for a single course unit, run it with one section as a low-stakes formative exercise, and learn what the cards need to look like before scaling. The Learning Lab can help with both the cards and (if you want to grow into it) the studio version. DO NOT deploy the full studio version without first reading the recording-and-accommodations report and resolving the consent and accommodations questions with DAO and General Counsel.",
    alsoTry: [
      {
        targetId: "t-pathway-a",
        reason:
          "Take the card-deck technique back down to the weekly check-in rhythm. Same structure, no studio. This is the lowest-friction way to pilot the prompt system.",
      },
      {
        targetId: "t-skill",
        reason:
          "The metacognition variant — student presents on a skill they had to figure out how to learn — runs inside this pathway's infrastructure. Same tech, different pedagogy.",
      },
      {
        targetId: "t-pathway-c",
        reason:
          "If you want human examiners but at mid-course scale, the section-level oral is the human-judgment version of what Pathway E does with AI triage.",
      },
    ],
  },

  "t-pathway-f": {
    id: "t-pathway-f",
    kind: "pathway",
    title: "Pathway F",
    tagline: "Oral defense of written work — the Cornell bolt-on",
    summary:
      "The lowest-lift option in the guide. Eight words of policy. Works at any size. The oral is a verification layer, not a separate assessment.",
    bestFor:
      "Any course at any size where students submit written work and you are concerned about authorship. Particularly strong when paired with any other pathway as a verification trigger.",
    whatItLooksLike:
      "Add Cornell's sentence to your syllabus: 'students must be prepared to orally discuss any content included in their paper.' A 5–10 minute conversation, in office hours, when something feels off. You do not have to do it for every student every time. The mere expectation deters pure AI generation; the occasional spot-check provides the verification. This is the intervention a Cambridge MPhil instructor summarized (April 2025) as: 'Let students use AI as much as they want, given the condition that anything AI does wrong is considered their fault.' Pathway F operationalizes that condition.",
    rubrics: [
      {
        name: "Cornell verdict — the verification rubric",
        attribution:
          "Cornell English Language Support Office, 'AI and Academic Integrity' (September 2025). Not a numerical rubric — a VERIFICATION layer. The grade on the paper is the grade; the oral provides or withdraws the warrant.",
        rows: [
          {
            criterion: "Pass",
            top: "Student can explain the central argument of their paper, identify and gloss any source they cited, and respond to a single follow-up question about a specific claim. The paper grade stands as written.",
            bottom: "",
          },
          {
            criterion: "Pass with note",
            top: "Student can do the above WITH PROMPTING; a note in the gradebook flags the exchange for context if a pattern develops across the term.",
            bottom: "",
          },
          {
            criterion: "Concerns",
            top: "Student cannot explain the argument of their own paper or gloss the sources they cited. Triggers a second meeting and a conversation about academic integrity. The paper grade is reviewed in light of the conversation.",
            bottom: "",
          },
        ],
        note:
          "This is deliberately NOT a numerical rubric. The grade on the paper is the grade. The oral is a VERIFICATION LAYER — either the student can defend the paper or they cannot. Attempting to reduce the verification to a number creates pressures that the format is designed to avoid.",
      },
      {
        name: "Hartmann three-dimension 0–3 — when the oral REPLACES the paper grade",
        attribution:
          "Catherine Hartmann, University of Wyoming. Published in College Teaching (2025). Used when the oral is the assessment of the student's ownership of their own argument, not a verification layer on top.",
        rows: [
          {
            criterion: "Argument reconstruction (0–3)",
            top: "3 — States their own thesis precisely and identifies the strongest objection to it. The student can inhabit both sides of the argument they have made.",
            bottom: "0 — Cannot state the thesis of their own paper.",
          },
          {
            criterion: "Source use (0–3)",
            top: "3 — Explains what each cited source CONTRIBUTES to the argument and names alternatives they considered. The sources do work, not decoration.",
            bottom: "0 — Sources cannot be described beyond their titles.",
          },
          {
            criterion: "Extension under questioning (0–3)",
            top: "3 — Produces new examples, counter-cases, or implications on the spot in response to examiner questions. The argument extends.",
            bottom: "0 — Does not recognize the question; the conversation does not advance.",
          },
        ],
        note:
          "Hartmann reports this oral cycle took 13 hours total for 25 students; her written midterm-and-final cycle the prior year had taken 15+ hours. The rubric's brevity is the reason it fits in the time budget. This is the rubric to use when the oral IS the assessment, not when it verifies another assessment.",
      },
    ],
    testimonials: [
      {
        quote:
          "Let students use AI as much as they want, given the condition that anything AI does wrong is considered their fault.",
        attribution: "Cambridge MPhil instructor, April 2025 (cited in Reddit /r/oxforduni)",
      },
      {
        quote:
          "Eight words of policy. 'Be prepared to orally discuss any content included in your paper.' That is the whole intervention.",
        attribution: "Cornell English Language Support Office — the shortest AI-integrity policy in the survey",
      },
      {
        quote:
          "13 hours for 25 students. Less than my written midterm-and-final cycle had taken the year before. The point of the oral was not to replace writing — it was to verify ownership of the writing. That small shift changed everything about how students approached the papers.",
        attribution: "Catherine Hartmann, University of Wyoming",
      },
    ],
    examples: [
      {
        place: "Cornell English Language Support Office — the policy itself",
        story:
          "The cleanest AI-integrity policy in the survey. Eight words in a syllabus. No curriculum overhaul, no scheduling infrastructure, no new rubric. The oral can be invoked as needed during office hours. The mere expectation deters pure AI generation; the occasional invocation provides the verification.",
      },
      {
        place: "University of Wyoming — Hartmann humanities course (25 students)",
        story:
          "The oral replaces the paper grade rather than verifying it. 20-minute slots per student; three-dimension 0–3 rubric (argument reconstruction / source use / extension). 13 hours total for the class. Downstream effect Hartmann reports: the anticipation of the oral changed how students approached the writing — they began with the argument they could defend out loud, rather than the argument that sounded best on the page.",
      },
      {
        place: "Cambridge MPhil program (April 2025, Reddit report)",
        story:
          "After ChatGPT prohibition proved unenforceable, the program shifted to oral-defense verification. 'We moved to essentially oral exams… let students use AI as much as they want, given the condition that anything AI does wrong is considered their fault.' The retreat from prohibition to structural redesign is now the dominant pattern across peer institutions.",
      },
    ],
    concerns: [
      "Spot-checks must be RANDOM or universal — targeting specific students for verification reproduces every bias in the briefing's equity section. Either ask everyone (during a single section meeting) or draw names by lottery in advance. Never target students whose papers 'sound off' without structure — 'sounds off' tracks native-English fluency and cultural background.",
      "ESL and accent — Memon's recommendation applies directly here: focus on professional attributes and not language surface features. The Cornell verdict rubric is designed to keep focus on substance, not delivery. A numerical rubric in this pathway is more dangerous than helpful.",
      "Documented accommodations apply normally; a written follow-up answer to a single question can substitute for the oral exchange. This is the only pathway where the substitution is fully clean — the oral is a verification, not an assessment in its own right.",
      "Students with speech disabilities can verify in writing in the original modality. This is a sensible default available to ANYONE, not an accommodation requiring disclosure.",
      "Academic integrity conversations that follow a 'Concerns' verdict must follow institutional procedure, not be ad hoc. The verdict is a trigger for the formal process, not the conclusion of one.",
    ],
    gettingStarted:
      "Add the Cornell sentence to your syllabus this term. That is step one. Step two is using office hours for ONE verification conversation in week six, just to discover what the conversation feels like. You can decide whether to scale from there. The conversation works because students know you CAN have it, not because you do.",
    alsoTry: [
      {
        targetId: "t-pathway-a",
        reason:
          "If you're already running weekly check-ins, this is a natural extension — the conversation is already in the rhythm of the course. Verification can become a standing thread within the check-in rhythm.",
      },
      {
        targetId: "t-pathway-b",
        reason:
          "In courses with a written capstone, the oral defense is the ORIGINAL move; Pathway B scaffolds it into a full capstone ritual. Pathway F is the minimum version of the same idea.",
      },
      {
        targetId: "t-pathway-c",
        reason:
          "Section-level oral defense IS Pathway F at scale — the Cornell verification layer distributed across TFs with a shared rubric.",
      },
    ],
  },

  "t-skill": {
    id: "t-skill",
    kind: "module",
    title: "Skill-based presentation",
    tagline: "The metacognitive variant",
    summary:
      "The student chooses a skill they must figure out how to learn, then presents on both the skill and their learning process. The assessment is metacognition, with agency over content. Aligned with Fiorella & Mayer's protégé-effect research: students who prepare to teach learn more deeply than those who prepare only to be tested.",
    bestFor:
      "Courses where 'learning how to learn' is itself the learning outcome. Grafts cleanly onto Pathway E's card-and-prep infrastructure or Pathway A's weekly rhythm.",
    whatItLooksLike:
      "Three moves in one presentation: (1) demonstrate the acquired skill in the room; (2) articulate the method used and explain why it fit the skill; (3) diagnose where they got stuck, what they tried, what worked; (4) project to a related skill — what would you do differently. Craycraft uses this as a variant inside the AI-augmented pilot. The Montessori 'Going Out' oral report is the pre-collegiate ancestor, which treats learning-how-to-learn as the primary adolescent developmental task.",
    rubrics: [
      {
        name: "Craycraft metacognitive — four criteria × 1–4",
        attribution:
          "Sarah Craycraft, Harvard Learning Lab. Variant format within the AI-augmented pilot. Philosophically aligned with Fiorella & Mayer (2013) 'The Relative Benefits of Learning by Teaching and Teaching Expectancy.'",
        rows: [
          {
            criterion: "Skill acquisition",
            top: "Demonstrably acquired; CAN PERFORM the skill in the room. The demonstration is the evidence.",
            bottom: "Cannot perform the skill; narrative account only.",
          },
          {
            criterion: "Method articulation",
            top: "Names the learning strategy used and explains WHY it fit the skill. The method is specific; the choice is defended.",
            bottom: "Method absent or post-hoc rationalization ('I just practiced a lot').",
          },
          {
            criterion: "Obstacle diagnosis",
            top: "Identifies WHERE they got stuck, WHAT they tried, what WORKED. The diagnosis is specific, not general.",
            bottom: "'It was hard' without specificity about what was hard or what helped.",
          },
          {
            criterion: "Transfer",
            top: "Articulates what they would do DIFFERENTLY for a related skill. The metacognitive work generalizes beyond this instance.",
            bottom: "Cannot project learning process to a different skill.",
          },
        ],
        note:
          "One of the few rubrics in the corpus where the primary object of assessment is METACOGNITION rather than content knowledge. Research shows the least able students benefit MOST from this effect — suggesting metacognitive assessment could narrow rather than widen achievement gaps when properly scaffolded.",
      },
      {
        name: "Montessori 'Going Out' — the pre-collegiate parallel",
        attribution:
          "Montessori secondary-level format. Student conducts independent fieldwork (a visit, an apprenticeship, a project) and presents orally to peers and teachers on what they learned and how. Included here because it treats 'learning how to learn' as the primary adolescent developmental task.",
        rows: [
          { criterion: "Initiative", top: "Did the student ORGANIZE the Going Out themselves — identify the opportunity, arrange access, manage logistics?", bottom: "Opportunity provided by teacher; student passive." },
          { criterion: "Observation", top: "Can the student describe WHAT THEY SAW — not what they expected or what they were supposed to see.", bottom: "Description matches prior expectation; no genuine observation." },
          { criterion: "Reflection", top: "What did they DO with what they did not expect? The unexpected is the material reflection works on.", bottom: "Unexpected observations ignored or rationalized away." },
          { criterion: "Communication", top: "Can peers LEARN from this account? The presentation generates knowledge for the room.", bottom: "Presentation documents the student's experience without generating anything for others." },
        ],
        note:
          "Transferable to undergraduate assessment because it explicitly assesses the student's agency in constructing their own learning — a capacity that becomes central when students choose their own skill to acquire. The alignment with Craycraft's rubric is not accidental; both are descendants of the protégé-effect literature.",
      },
    ],
    testimonials: [
      {
        quote:
          "The students who learn most are those who prepare to teach. The protégé effect is real and robust, and the least able students benefit most — suggesting metacognitive assessment could narrow rather than widen achievement gaps when properly scaffolded.",
        attribution: "Fiorella & Mayer, Contemporary Educational Psychology 38 (2013)",
      },
      {
        quote:
          "The format gave them agency over content without giving up rigor on the method. That was the combination I had been unable to find in any other assessment format — agency and rigor simultaneously.",
        attribution: "Sarah Craycraft, Harvard Learning Lab",
      },
    ],
    examples: [
      {
        place: "Harvard Learning Lab — Craycraft skill-presentation variant",
        story:
          "Offered as an option within the AI-augmented pilot. Students chose skills ranging from musical instruments to coding languages to physical disciplines. The four-criterion rubric held across wildly different content domains — the metacognitive work was the same even when the skill was not.",
      },
      {
        place: "Montessori secondary programs — 'Going Out'",
        story:
          "Secondary-level students conduct independent fieldwork (visit, apprenticeship, project), then present orally to peers and teachers. Not a one-off assessment but a recurring practice across the secondary years. The assessment is initiative + observation + reflection + communication — a full metacognitive cycle, with delivery as the culmination.",
      },
    ],
    concerns: [
      "Skill choice inequity — give students a curated list or budget if peer-coaching, tool access, or time-at-home materially affects who can pursue which skills. Students from resource-rich backgrounds come with hobbies already; students from resource-limited backgrounds may need scaffolding to identify a candidate skill.",
      "The metacognitive work is harder for students with less experience reflecting on their own learning. A pre-exercise (scaffolded reflection in the first weeks of the course) significantly improves performance on the final oral.",
    ],
    gettingStarted:
      "Offer this as one of several final-assessment options in a course where the pedagogy already teaches meta-skills. Pair with one or two readings on the protégé effect (Fiorella & Mayer 2013) so students know why you're asking. Build in a mid-term check-in where students report on where they are with their chosen skill — this is where scaffolding happens, and where students who are struggling can pivot.",
    alsoTry: [
      {
        targetId: "t-pathway-e",
        reason:
          "The AI-augmented studio supplies the card-and-prep infrastructure this variant runs on. The metacognitive prompt is one of the card decks.",
      },
      {
        targetId: "t-pathway-a",
        reason:
          "The metacognitive frame also grafts onto recurring check-ins as 'today, tell me what you now know you didn't know last week.' Same pedagogy at lower stakes.",
      },
    ],
  },

  "t-oracy": {
    id: "t-oracy",
    kind: "module",
    title: "Oracy as the learning outcome",
    tagline: "When speaking IS what the course teaches",
    summary:
      "When structure, evidence, and presence are the learning outcome — not a way to test it. The AAC&U VALUE rubric is the base layer, used or adapted by over 4,000 institutions. It does NOT assess content knowledge; pair it with a content rubric from one of the pathways.",
    bestFor:
      "Public speaking, interviewing, language fluency, rhetoric, professional communication, moot-court-style advocacy training, any course where delivery itself is part of what is being taught.",
    whatItLooksLike:
      "The rubric weights delivery more heavily than any of the pathway rubrics do. Organization, language, delivery, supporting material, central message — each 1–4. Pair it with a content rubric (Hist & Lit or Princeton McGraw) if the course also teaches substance. Over 4,000 institutions have adopted or adapted this rubric — it is the closest thing to an American national standard for oral-communication assessment.",
    rubrics: [
      {
        name: "AAC&U VALUE for Oral Communication",
        attribution:
          "Association of American Colleges and Universities VALUE Rubric for Oral Communication (2009; revised 2023). Each criterion scored 1–4 from benchmark through capstone. Over 4,000 institutions adopted or adapted.",
        rows: [
          {
            criterion: "Organization",
            top: "Clearly and consistently OBSERVABLE and SKILLFUL. The structure enhances the central message.",
            bottom: "Not observable. Audience cannot follow the shape of the presentation.",
          },
          {
            criterion: "Language",
            top: "Imaginative, memorable, compelling. Word choice is apt for audience and purpose.",
            bottom: "Unclear. Language detracts from the message.",
          },
          {
            criterion: "Delivery",
            top: "Posture, gesture, eye contact, vocal expressiveness make the presentation COMPELLING. Delivery makes the speaker appear polished and confident.",
            bottom: "Detract from understandability. Delivery undermines the content.",
          },
          {
            criterion: "Supporting material",
            top: "A VARIETY of types of supporting materials significantly supports the presentation or establishes credibility. Evidence is apt and well-chosen.",
            bottom: "Insufficient supporting materials. Assertions without grounding.",
          },
          {
            criterion: "Central message",
            top: "Compelling, precisely stated, APPROPRIATELY REPEATED, memorable, strongly supported. The audience leaves knowing the claim.",
            bottom: "Unclear and unsupported. The audience leaves uncertain what was being argued.",
          },
        ],
        note:
          "The VALUE rubric is a BASE LAYER. Most discipline-specific rubrics can be read as 'VALUE plus content criteria.' It explicitly does not assess content knowledge and is therefore insufficient on its own for most oral assessment contexts. But it is a strong template for the communication-skills portion of any hybrid rubric.",
      },
    ],
    testimonials: [
      {
        quote:
          "Interactive oral assessments are proving to be one of the most effective and authentic ways to see what students really know in the age of AI. Students reported the process felt fairer. One student said: 'It felt like a job interview, not just an exam.'",
        attribution: "Shahper Richter & Patrick Dodd, University of Auckland Business School",
      },
      {
        quote:
          "The existence of a $3,000–$6,000 per session executive communication training market — Berkeley, Chicago Booth, Communispond, and dozens of others — proves that universities are failing to develop oral competencies their graduates need. Corporations spend billions training Harvard graduates in skills Harvard could have taught them.",
        attribution: "Briefing note, PCP landscape review",
      },
    ],
    examples: [
      {
        place: "4,000+ US institutions using AAC&U VALUE",
        story:
          "The most widely adopted general-purpose oral-communication rubric in American higher education. Institutions adapt the five criteria to their local context but retain the structure. Supported by decades of assessment-reform work, and endorsed by the major accrediting bodies.",
      },
      {
        place: "Communication Across the Curriculum (CXC) programs",
        story:
          "Sibling to Writing Across the Curriculum. Courses designated 'SI' (Speaking Intensive) require oral assessment at ≥50% of evaluation, parallel to how WI courses emphasize written work. This institutional model is currently available at over a hundred US universities — Harvard could adopt it.",
      },
      {
        place: "University of Auckland Business School — Richter & Dodd interactive oral assessment",
        story:
          "42-student postgraduate trial (7-minute one-on-one conversations), scaled to 200+ undergraduates using group sessions (students attend together, answer individually) + multiple simultaneous assessors. Students reported the process felt FAIRER than written exams. 70% agreed it tested their actual understanding.",
      },
    ],
    concerns: [
      "Bias on delivery — accent, cadence, and fluency carry cultural weight. Weight substance over surface. Memon's recommendation: 'focus on professional attributes, not language surface features.' This concern is sharper for this pathway than any other in the guide, because delivery IS what is being assessed.",
      "ESL and non-native English speakers — the 2026 scoping review found oral assessment can actually ADVANTAGE them by separating content knowledge from English writing proficiency. Speaking fluency develops faster than academic writing for second-language learners. But only if the rubric is applied fairly.",
      "The VALUE rubric does not assess content; pair it with a content rubric. Using VALUE alone produces oral-performance assessment, not oral-understanding assessment.",
    ],
    gettingStarted:
      "If this is your course, the Bok Center is happy to consult separately — oracy as the primary learning outcome is a different pedagogical problem from oral assessment as a verification of learning. The VALUE rubric is a starting point; pair it with the pathway rubric that matches the content domain you're also teaching.",
    alsoTry: [
      {
        targetId: "t-pathway-d",
        reason:
          "Moot, drama practical, and pitch formats already weight delivery heavily within disciplined rubrics — the inherited versions of the 'delivery is the outcome' design problem. Start there if your course aligns with one of those disciplines.",
      },
      {
        targetId: "t-pathway-a",
        reason:
          "For courses where oracy is taught through practice rather than tested through performance, recurring check-ins give students the repetition a delivery skill needs. The AAC&U VALUE can inform the check-in rubric without swamping it.",
      },
    ],
  },
};
