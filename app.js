// ===== Guest Review Replier - App Logic =====

// DOM Elements
const guestNameInput = document.getElementById('guestName');
const reviewTextArea = document.getElementById('reviewText');
const starRatingContainer = document.getElementById('starRating');
const ratingLabel = document.getElementById('ratingLabel');
const toneSelect = document.getElementById('toneSelect');
const generateBtn = document.getElementById('generateBtn');
const resultCard = document.getElementById('resultCard');
const resultContent = document.getElementById('resultContent');
const toneBadge = document.getElementById('toneBadge');
const copyBtn = document.getElementById('copyBtn');
const regenerateBtn = document.getElementById('regenerateBtn');

// Screenshot Upload DOM Elements
const screenshotInput = document.getElementById('screenshotInput');
const uploadArea = document.getElementById('uploadArea');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const ocrProgress = document.getElementById('ocrProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// State
let selectedRating = 0;
let stars = starRatingContainer.querySelectorAll('.star');

// ===== Star Rating Logic =====
stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.value);
        stars.forEach(s => {
            s.classList.toggle('hover-preview', parseInt(s.dataset.value) <= val);
        });
    });

    star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hover-preview'));
    });

    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        stars.forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating);
        });
        const labels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];
        ratingLabel.textContent = `${selectedRating}/5 — ${labels[selectedRating]}`;
    });
});

// ===== Reply Templates by Tone =====
const replyTemplates = {
    professional: {
        positive: [
            `Dear {name},\n\nThank you for taking the time to share your feedback with us. We are delighted to hear that your stay met your expectations and that you had a pleasant experience.\n\nYour kind words are greatly appreciated by our entire team. We continuously strive to maintain the highest standards of service, and feedback like yours motivates us to keep excelling.\n\nWe look forward to welcoming you back in the future.\n\nBest regards,\nThe Management Team`,
            `Dear {name},\n\nWe sincerely appreciate your thoughtful review. It is gratifying to know that our commitment to quality service was reflected in your experience with us.\n\nYour satisfaction is our top priority, and we are pleased that we were able to deliver on that promise. We hope to have the opportunity to host you again.\n\nWarm regards,\nThe Management Team`
        ],
        negative: [
            `Dear {name},\n\nThank you for bringing these concerns to our attention. We take all guest feedback seriously and regret that your experience did not meet our usual standards.\n\nWe have noted your comments and will be reviewing our processes to ensure improvements are made. Your feedback is invaluable in helping us enhance our service quality.\n\nWe would welcome the opportunity to restore your confidence in us during a future visit.\n\nSincerely,\nThe Management Team`,
            `Dear {name},\n\nWe appreciate you sharing your experience with us. We are disappointed to learn that certain aspects of your stay fell short of expectations.\n\nPlease be assured that your feedback has been shared with the relevant departments for immediate review and corrective action. We are committed to addressing these issues.\n\nWe hope you will give us another chance to demonstrate our true standard of service.\n\nBest regards,\nThe Management Team`
        ],
        neutral: [
            `Dear {name},\n\nThank you for your review and for choosing to stay with us. We appreciate your balanced feedback and the time you took to share your thoughts.\n\nWe are pleased to hear about the positive aspects of your stay and take note of the areas where we can improve. Your input helps us refine our services.\n\nWe hope to welcome you back and provide an even better experience next time.\n\nBest regards,\nThe Management Team`
        ]
    },
    friendly: {
        positive: [
            `Hi {name}! 😊\n\nWow, thank you so much for your wonderful review! It truly made our day to read your kind words. We're so happy you had a great time with us!\n\nOur team works hard to make every guest feel welcome and at home, and knowing that we succeeded with you makes it all worthwhile.\n\nWe can't wait to see you again! Until then, take care and happy travels! 🌟\n\nWarmly,\nThe Team`,
            `Hey {name}! 👋\n\nThank you for such a lovely review! We're thrilled that you enjoyed your stay. It's guests like you who make what we do so rewarding!\n\nWe had a great time hosting you and hope your memories with us bring a smile. You're always welcome back — we'll save your favorite spot! 😄\n\nCheers,\nThe Team`
        ],
        negative: [
            `Hi {name},\n\nThank you for being honest with us — we really appreciate it. We're sorry to hear things didn't go as smoothly as we'd have liked during your visit. That's definitely not the experience we want for our guests.\n\nWe're already looking into what went wrong and working on making things right. Your feedback genuinely helps us get better!\n\nWe'd love the chance to make it up to you. If you'd ever like to give us another try, please don't hesitate to reach out directly — we'll make sure it's a different experience. 💪\n\nTake care,\nThe Team`,
            `Hey {name},\n\nWe appreciate you letting us know about your experience. We're really sorry things weren't up to par — that's not the standard we aim for.\n\nWe're taking your comments to heart and making changes. Everyone here wants to do better, and feedback like yours helps us grow.\n\nWe hope we'll get a second chance to show you what we're truly about! 🙏\n\nAll the best,\nThe Team`
        ],
        neutral: [
            `Hi {name}! 👋\n\nThanks for sharing your experience with us! We're glad there were parts of your stay you enjoyed, and we hear you on where we can do better.\n\nWe're always working to improve, and your feedback helps guide us in the right direction. We hope to wow you even more next time!\n\nHope to see you again soon! 😊\n\nCheers,\nThe Team`
        ]
    },
    empathetic: {
        positive: [
            `Dear {name},\n\nThank you so much for sharing your experience. It warms our hearts to know that you felt comfortable and well-cared-for during your stay with us.\n\nWe understand how important it is to feel truly welcomed when you're away from home, and we're grateful that we could provide that sense of comfort for you.\n\nYour words mean more to our team than you might realize. We genuinely look forward to welcoming you back and creating more wonderful memories together.\n\nWith heartfelt thanks,\nThe Team`,
            `Dear {name},\n\nYour review truly touched us. We believe that hospitality is about making meaningful connections with our guests, and knowing that you felt that warmth fills us with joy.\n\nEvery guest who walks through our doors is important to us, and your kind words remind us why we love what we do.\n\nThank you for being part of our story. We sincerely hope to see you again.\n\nWith warm regards,\nThe Team`
        ],
        negative: [
            `Dear {name},\n\nWe want to start by saying how truly sorry we are. Reading your review, we can feel your frustration, and we completely understand. You deserved better, and we fell short.\n\nPlease know that your experience does not reflect who we aspire to be. We take full responsibility for the shortcomings you encountered, and we are deeply committed to making things right.\n\nWe have already begun addressing the issues you raised. If you're open to it, we would love the opportunity to speak with you directly and find a way to make amends.\n\nYour feelings are valid, and your feedback is deeply valued.\n\nWith sincere apologies,\nThe Team`,
            `Dear {name},\n\nWe are genuinely heartbroken to read about your experience. This is not the level of care and attention we want any guest to receive, and we owe you an apology.\n\nWe can only imagine how disappointing it must have been, especially when you trusted us with your stay. Please know that we hear you, we understand, and we are taking immediate steps to prevent this from happening again.\n\nIf there is anything we can do to make this right, please reach out to us. We truly care about your experience.\n\nWith deepest apologies,\nThe Team`
        ],
        neutral: [
            `Dear {name},\n\nThank you for taking the time to share your honest thoughts with us. We truly appreciate your openness and understand that your experience was mixed.\n\nWe're glad there were moments you enjoyed, and we hear your concerns about the areas that fell short. Every piece of feedback helps us grow and serve our guests better.\n\nWe genuinely hope to see you again and show you the best version of ourselves.\n\nWith appreciation,\nThe Team`
        ]
    },
    enthusiastic: {
        positive: [
            `Dear {name}! 🎉\n\nWOW! Thank you SO much for this incredible review! We are absolutely thrilled to hear you had an amazing time! This is exactly what we live for! 🙌\n\nOur team is over the moon reading your wonderful words — you've made everyone's week! We put our heart and soul into creating the best possible experience, and knowing we hit the mark is the BEST feeling!\n\nWe cannot WAIT to welcome you back! Next time is going to be even more spectacular — we promise! 🌟✨\n\nWith enormous gratitude,\nThe Entire Team (who are all smiling right now!)`,
            `{name}!! 🌟\n\nTHANK YOU! Your review just made our entire day — no, our entire MONTH! We're doing a happy dance over here! 💃🕺\n\nIt makes us SO incredibly happy to know you had a wonderful experience. Our team is passionate about what we do, and guests like you are the reason we love coming to work every day!\n\nWe're already looking forward to your next visit — get ready for an even MORE amazing time! 🎊\n\nWith SO much gratitude,\nYour Biggest Fans (aka The Team)`
        ],
        negative: [
            `Dear {name},\n\nFirst and foremost — THANK YOU for your honesty! We truly appreciate you taking the time to share your experience with us. 🙏\n\nWe're not going to sugarcoat it — we're disappointed in ourselves! This is NOT the experience we want ANY of our guests to have, and we're determined to fix it! 💪\n\nYour feedback has already sparked action! We're energized to make improvements and we're committed to turning things around. We have big plans and your input is helping shape them!\n\nWe would be HONORED if you'd give us another chance — we promise to blow you away! ⭐\n\nWith determination and gratitude,\nThe Team`,
            `Hey {name}! 🙏\n\nThank you for keeping it real with us — we seriously appreciate your feedback! We're not happy that your experience wasn't stellar, but we ARE fired up to make it right!\n\nWe've already started working on the issues you mentioned. Your feedback is like rocket fuel for our improvement efforts! 🚀\n\nPlease give us another shot — we're on a mission to make your next visit absolutely AMAZING! We believe in second chances and we won't let you down!\n\nWith gratitude and determination,\nThe Team`
        ],
        neutral: [
            `Hey {name}! 🙌\n\nThank you so much for your feedback! We LOVE hearing from our guests — the good, the great, and the could-be-better!\n\nWe're thrilled about the parts you enjoyed and super motivated to level up on the rest! Every bit of feedback fuels our drive to be the BEST! 🚀\n\nNext time you visit, we're going to make it even more incredible — that's a promise! Can't wait to see you again! ✨\n\nWith big thanks,\nThe Team`
        ]
    },
    formal: {
        positive: [
            `Dear Mr./Ms. {name},\n\nOn behalf of the entire establishment, I wish to extend our sincere gratitude for your commendable review. It is with great pleasure that we acknowledge your satisfaction with our services.\n\nOur institution prides itself on maintaining the highest standards of hospitality excellence, and your endorsement serves as a testament to our team's unwavering dedication to guest satisfaction.\n\nWe would be most honored to accommodate you again in the future. Please do not hesitate to contact our reservations department at your earliest convenience for any future arrangements.\n\nYours faithfully,\nGeneral Manager\nGuest Relations Department`,
            `Dear Mr./Ms. {name},\n\nWe acknowledge receipt of your review with profound appreciation. Your positive assessment of our facilities and services is duly noted and valued.\n\nIt is our organizational mandate to ensure every guest receives service of the highest caliber. Your feedback confirms our continued adherence to these standards.\n\nWe remain at your disposal for any future requirements and look forward to the privilege of your patronage once more.\n\nRespectfully yours,\nGeneral Manager\nGuest Relations Department`
        ],
        negative: [
            `Dear Mr./Ms. {name},\n\nWe acknowledge receipt of your review dated recently and wish to express our sincere regret regarding the deficiencies noted during your stay.\n\nPlease be assured that your concerns have been formally documented and escalated to the appropriate departmental heads for thorough investigation and remediation.\n\nWe consider this matter of utmost priority and have initiated a comprehensive review of the areas identified in your feedback. Corrective measures will be implemented with immediate effect.\n\nShould you wish to discuss this matter further, please contact our Guest Relations Department directly. We would welcome the opportunity to rectify this situation.\n\nYours faithfully,\nGeneral Manager\nGuest Relations Department`,
            `Dear Mr./Ms. {name},\n\nThis correspondence serves to acknowledge your recent review and to convey our formal apology for the service deficiencies you experienced.\n\nYour feedback has been recorded in our quality assurance system and assigned to the relevant department heads for immediate investigation. We maintain strict service protocols, and any deviation from these standards is treated with the highest level of seriousness.\n\nWe respectfully request the opportunity to demonstrate our commitment to excellence during a future visit. Kindly contact our office directly to arrange preferential accommodations.\n\nWith sincere apologies,\nGeneral Manager\nGuest Relations Department`
        ],
        neutral: [
            `Dear Mr./Ms. {name},\n\nWe acknowledge with appreciation your review of our establishment. Your balanced assessment has been noted and will be incorporated into our ongoing quality improvement initiatives.\n\nThe positive aspects of your experience reflect our team's commitment to excellence, while the areas identified for improvement will receive appropriate attention and remediation.\n\nWe trust you will consider returning in the future, and we assure you of our continued commitment to enhancing the guest experience.\n\nYours faithfully,\nGeneral Manager\nGuest Relations Department`
        ]
    }
};

// ===== Sentiment & Content Analysis =====

// Words that flip the sentiment of the word right after them ("not good", "wasn't clean")
const NEGATORS = ['not', 'no', "n't", 'never', 'without', 'lack', 'lacked', 'hardly', "wasn't", "weren't", "isn't", "aren't", "didn't", "don't", "couldn't", "wouldn't"];

const POSITIVE_WORDS = [
    'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'loved', 'perfect', 'best',
    'beautiful', 'outstanding', 'comfortable', 'friendly', 'helpful', 'recommend', 'lovely',
    'awesome', 'superb', 'delicious', 'spacious', 'cozy', 'peaceful', 'welcoming', 'exceptional',
    'pleasant', 'enjoyed', 'enjoy', 'happy', 'satisfied', 'nice', 'good', 'fabulous', 'gorgeous',
    'spotless', 'quiet', 'relaxing', 'attentive', 'polite', 'stunning', 'impressed', 'memorable',
    'clean'
];

const NEGATIVE_WORDS = [
    'terrible', 'awful', 'horrible', 'worst', 'dirty', 'rude', 'noisy', 'broken', 'disappointed',
    'disappointing', 'unacceptable', 'poor', 'poorer', 'bad', 'worse', 'worsening', 'cold', 'slow',
    'smell', 'smelly', 'stain', 'stained', 'uncomfortable', 'unhelpful', 'unfriendly', 'overpriced',
    'expensive', 'filthy', 'disgusting', 'mold', 'bugs', 'insects', 'leak', 'leaking', 'stinks',
    'stink', 'nightmare', 'avoid', 'refuse', 'refused', 'ignored', 'waited', 'waiting', 'delay',
    'delayed', 'unclean', 'outdated', 'worn', 'damaged', 'complaint', 'issue', 'problem', 'problems',
    'frustrating', 'frustrated', 'upset', 'angry', 'ruined', 'regret', 'mediocre', 'lousy',
    'declining', 'deteriorating'
];

// Multi-word phrases that signal a COMPLAINT or a request for improvement,
// even when no single negative word is present.
// e.g. "can be kept more clean", "could be better", "getting poorer", "needs improvement"
const NEGATIVE_PHRASES = [
    'can be kept', 'could be kept', 'should be kept', 'can be improved', 'could be improved',
    'needs improvement', 'need improvement', 'needs to improve', 'room for improvement',
    'could be better', 'can be better', 'should be better', 'could do better', 'can do better',
    'getting poorer', 'getting worse', 'getting bad', 'get worse', 'gone downhill', 'going downhill',
    'went downhill', 'not what it used to be', 'not as good', 'used to be better', 'less than',
    'fell short', 'falls short', 'below expectations', 'not up to', 'not too impressed',
    'more clean', 'cleaner', 'not clean enough', 'wish it was', 'wish it were', 'expected more',
    'let down', 'let us down', 'not great', 'nothing special', 'wouldn\'t recommend',
    'would not recommend', 'not worth', 'too expensive', 'overpriced'
];

// Phrases that are clearly POSITIVE praise.
const POSITIVE_PHRASES = [
    'highly recommend', 'would recommend', 'will be back', 'come back', 'exceeded expectations',
    'above and beyond', 'can\'t fault', 'no complaints', 'well worth', 'value for money',
    'better than expected', 'lovely time', 'great time', 'wonderful time', 'thoroughly enjoyed'
];

// Topics the guest may talk about — maps a natural-language label to its keywords
const TOPICS = {
    'the staff and service': ['staff', 'service', 'reception', 'front desk', 'manager', 'employee', 'team', 'host', 'concierge', 'waiter', 'waitress', 'server'],
    'the cleanliness': ['clean', 'cleanliness', 'dirty', 'spotless', 'filthy', 'housekeeping', 'tidy', 'hygiene', 'dust', 'stain'],
    'the room': ['room', 'bed', 'bathroom', 'shower', 'linen', 'towel', 'suite', 'bedroom', 'pillow', 'mattress'],
    'the food and breakfast': ['food', 'breakfast', 'dinner', 'lunch', 'meal', 'restaurant', 'buffet', 'coffee', 'menu', 'dining', 'chef', 'delicious'],
    'the location': ['location', 'located', 'nearby', 'beach', 'city', 'center', 'downtown', 'view', 'central', 'walk', 'walking distance'],
    'the value for money': ['price', 'value', 'expensive', 'cheap', 'cost', 'overpriced', 'worth', 'money', 'affordable'],
    'the noise levels': ['noise', 'noisy', 'quiet', 'loud', 'soundproof', 'sleep'],
    'the amenities': ['pool', 'gym', 'spa', 'wifi', 'internet', 'parking', 'ac', 'air conditioning', 'facilities', 'amenities'],
    'the check-in process': ['check-in', 'check in', 'checkout', 'check-out', 'check out', 'queue']
};

// Tokenize into lowercase words, keeping contractions
function tokenize(text) {
    return text.toLowerCase().match(/[a-z']+/g) || [];
}

// Score a single clause of text: returns net sentiment score for that clause.
function scoreClause(clause) {
    const lower = clause.toLowerCase();
    let score = 0;

    // Phrase-level signals first (strong)
    NEGATIVE_PHRASES.forEach(p => { if (lower.includes(p)) score -= 2; });
    POSITIVE_PHRASES.forEach(p => { if (lower.includes(p)) score += 2; });

    // Word-level signals with negation handling
    const tokens = tokenize(clause);
    tokens.forEach((word, i) => {
        const prev = tokens[i - 1] || '';
        const prev2 = tokens[i - 2] || '';
        const negated = NEGATORS.includes(prev) || NEGATORS.includes(prev2) ||
                        prev.endsWith("n't") || prev2.endsWith("n't");

        if (POSITIVE_WORDS.includes(word)) {
            score += negated ? -1 : 1;
        } else if (NEGATIVE_WORDS.includes(word)) {
            score += negated ? 1 : -1;
        }
    });

    return score;
}

// Split text into clauses on sentence and conjunction boundaries so we can
// judge each part ("location was great BUT room was dirty") separately.
function splitClauses(text) {
    return text
        .split(/[.!?\n]+|,\s*(?:but|however|although|though|yet|while)\b|\b(?:but|however|although|though|yet|while)\b/i)
        .map(c => c.trim())
        .filter(Boolean);
}

// Which topics does this clause mention?
function topicsInClause(clause) {
    const lower = clause.toLowerCase();
    const found = [];
    for (const [label, keywords] of Object.entries(TOPICS)) {
        if (keywords.some(k => lower.includes(k))) found.push(label);
    }
    return found;
}

// Analyze the review with per-clause, per-topic sentiment.
// Returns { sentiment, score, praisedTopics, criticizedTopics }
function analyzeReview(text, rating) {
    const clauses = splitClauses(text);
    let totalScore = 0;
    const praisedTopics = new Set();
    const criticizedTopics = new Set();

    clauses.forEach(clause => {
        const s = scoreClause(clause);
        totalScore += s;
        const topics = topicsInClause(clause);
        if (s > 0) topics.forEach(t => praisedTopics.add(t));
        else if (s < 0) topics.forEach(t => criticizedTopics.add(t));
    });

    // A topic mentioned in both a good and bad clause is treated as criticized
    // (a complaint should never be answered as praise).
    criticizedTopics.forEach(t => praisedTopics.delete(t));

    // Overall sentiment: driven by the text. Rating only breaks a true tie.
    let sentiment;
    if (totalScore > 0 && criticizedTopics.size === 0) sentiment = 'positive';
    else if (totalScore < 0 && praisedTopics.size === 0) sentiment = 'negative';
    else if (totalScore === 0) {
        if (praisedTopics.size && criticizedTopics.size) sentiment = 'mixed';
        else if (rating && rating >= 4) sentiment = 'positive';
        else if (rating && rating <= 2) sentiment = 'negative';
        else sentiment = 'neutral';
    } else {
        // Has both praise and criticism → mixed
        sentiment = (praisedTopics.size && criticizedTopics.size) ? 'mixed'
                  : (totalScore > 0 ? 'positive' : 'negative');
    }

    return {
        sentiment,
        score: totalScore,
        praisedTopics: [...praisedTopics],
        criticizedTopics: [...criticizedTopics]
    };
}

// ===== Smart Reply Builder =====
// Builds a reply that references the guest's actual sentiment and topics.

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Turn a list of topics into a readable phrase: ["room","food"] -> "the room and the food"
function topicsPhrase(topics) {
    if (!topics.length) return '';
    const list = topics.slice(0, 3); // don't overload the sentence
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}

// Tone-specific building blocks. Each part has multiple variations so
// "Regenerate" produces a genuinely different (but still accurate) reply.
const TONE_STYLE = {
    professional: {
        openers: {
            positive: [
                'Dear {name},\n\nThank you for taking the time to share your feedback with us.',
                'Dear {name},\n\nWe sincerely appreciate your kind review and are grateful you chose to stay with us.',
                'Dear {name},\n\nThank you for your wonderful feedback — it is greatly valued by our entire team.'
            ],
            negative: [
                'Dear {name},\n\nThank you for sharing your feedback, and please accept our sincere apologies.',
                'Dear {name},\n\nWe appreciate you bringing these concerns to our attention, and we are sorry to hear of them.',
                'Dear {name},\n\nThank you for your honest review. We regret that your experience fell short of our standards.'
            ],
            neutral: [
                'Dear {name},\n\nThank you for your thoughtful review and for choosing to stay with us.',
                'Dear {name},\n\nWe appreciate you taking the time to share your balanced feedback with us.',
                'Dear {name},\n\nThank you for your review — your insights help us continue to improve.'
            ]
        },
        closers: [
            '\n\nWe look forward to welcoming you back.\n\nBest regards,\nThe Management Team',
            '\n\nWe hope to have the opportunity to host you again soon.\n\nWarm regards,\nThe Management Team',
            '\n\nThank you again for your feedback.\n\nSincerely,\nThe Management Team'
        ],
        praise: [
            t => `We are delighted to hear that you enjoyed ${t}, and we will gladly share your kind words with our team.`,
            t => `It is wonderful to know that ${t} met your expectations — our team takes great pride in this.`,
            t => `We are pleased that ${t} contributed to a positive experience during your stay.`
        ],
        concern: [
            t => `We are genuinely sorry that ${t} did not meet the standard you rightly expected. Your comments have been shared with the relevant team for immediate review.`,
            t => `Please accept our apologies regarding ${t}. We have noted your feedback and are taking steps to address it.`,
            t => `We regret that ${t} caused disappointment. Rest assured, this has been escalated for prompt corrective action.`
        ]
    },
    friendly: {
        openers: {
            positive: [
                'Hi {name}! 😊\n\nThank you so much for the lovely review — it truly made our day!',
                'Hey {name}! 👋\n\nWow, thank you for such kind words — we\'re so glad you had a great time!',
                'Hi {name}! 🌟\n\nThank you for the wonderful feedback — you\'ve put a big smile on our faces!'
            ],
            negative: [
                'Hi {name},\n\nThank you for being honest with us — we\'re really sorry your stay wasn\'t what it should have been.',
                'Hey {name},\n\nWe really appreciate your feedback, and we\'re sorry things didn\'t go smoothly for you.',
                'Hi {name},\n\nThanks for letting us know — we\'re genuinely sorry your experience wasn\'t up to par.'
            ],
            neutral: [
                'Hi {name}! 👋\n\nThanks a lot for sharing your experience with us!',
                'Hey {name}! 😊\n\nThank you for taking the time to leave us your thoughts!',
                'Hi {name}!\n\nWe really appreciate you sharing your honest feedback with us!'
            ]
        },
        closers: [
            '\n\nWe\'d love to see you again soon! 🌟\n\nWarmly,\nThe Team',
            '\n\nCan\'t wait to welcome you back! 😄\n\nCheers,\nThe Team',
            '\n\nHope to see you again really soon! 🙌\n\nWarm wishes,\nThe Team'
        ],
        praise: [
            t => `We\'re so happy you enjoyed ${t} — that means a lot to us! 😄`,
            t => `It\'s awesome to hear you loved ${t} — our team will be thrilled! 🎉`,
            t => `We\'re over the moon that ${t} made your stay special! 🌟`
        ],
        concern: [
            t => `We\'re really sorry about ${t} — that\'s not the experience we want for you, and we\'re already working on making it right. 🙏`,
            t => `We hate to hear that ${t} let you down — we\'re on it and making changes! 💪`,
            t => `So sorry that ${t} wasn\'t great — thanks for flagging it, we\'ll do better! 🙏`
        ]
    },
    empathetic: {
        openers: {
            positive: [
                'Dear {name},\n\nThank you so much for sharing your experience — your words truly warmed our hearts.',
                'Dear {name},\n\nYour lovely review means so much to us — thank you for taking the time to share it.',
                'Dear {name},\n\nWe were genuinely touched to read your kind words — thank you from all of us.'
            ],
            negative: [
                'Dear {name},\n\nWe want to start by saying how truly sorry we are. Reading your review, we completely understand your frustration.',
                'Dear {name},\n\nPlease accept our heartfelt apologies. We can only imagine how disappointing this must have been.',
                'Dear {name},\n\nWe are deeply sorry to read about your experience — you trusted us, and we let you down.'
            ],
            neutral: [
                'Dear {name},\n\nThank you for taking the time to share your honest thoughts with us.',
                'Dear {name},\n\nWe truly appreciate your openness in sharing both the highs and lows of your stay.',
                'Dear {name},\n\nThank you for your thoughtful feedback — we hear you, and we value every word.'
            ]
        },
        closers: [
            '\n\nWe genuinely hope to have the chance to welcome you back.\n\nWith heartfelt thanks,\nThe Team',
            '\n\nWe would be honoured to welcome you again and show you our very best.\n\nWith warm regards,\nThe Team',
            '\n\nThank you for allowing us to be part of your journey.\n\nWith gratitude,\nThe Team'
        ],
        praise: [
            t => `Knowing that you felt cared for when it came to ${t} means more to us than you might realise.`,
            t => `It fills us with joy to know that ${t} made you feel truly at home.`,
            t => `Your kind words about ${t} remind our team exactly why we love what we do.`
        ],
        concern: [
            t => `We are deeply sorry that ${t} let you down. You deserved better, and we take full responsibility for making this right.`,
            t => `It genuinely pains us that ${t} caused you frustration. Please know we are committed to doing better.`,
            t => `We understand how much ${t} affected your stay, and we are truly sorry. Your feelings are completely valid.`
        ]
    },
    enthusiastic: {
        openers: {
            positive: [
                'Dear {name}! 🎉\n\nWOW — thank you SO much for this incredible review!',
                '{name}!! 🌟\n\nThis review just made our entire week — THANK YOU!',
                'Hi {name}! 🎊\n\nWe are absolutely thrilled — thank you for these amazing words!'
            ],
            negative: [
                'Dear {name},\n\nFirst of all, THANK YOU for your honesty — we truly appreciate it, and we\'re determined to make things right! 💪',
                'Hi {name},\n\nThank you for keeping it real with us — we\'re fired up to turn this around! 🙏',
                'Dear {name},\n\nWe really appreciate your feedback — and we\'re on a mission to make your next visit amazing! 🚀'
            ],
            neutral: [
                'Hey {name}! 🙌\n\nThank you so much for your feedback — we love hearing from our guests!',
                'Hi {name}! ✨\n\nThanks a million for sharing your experience with us!',
                '{name}! 🎉\n\nWe really appreciate you taking the time to tell us how it went!'
            ]
        },
        closers: [
            '\n\nWe can\'t WAIT to welcome you back! ✨\n\nWith huge gratitude,\nThe Team',
            '\n\nNext time is going to be even MORE amazing — promise! 🌟\n\nWith so much gratitude,\nThe Team',
            '\n\nWe\'re already excited for your next visit! 🎊\n\nCheers,\nThe Team'
        ],
        praise: [
            t => `We\'re absolutely thrilled that you loved ${t} — you\'ve made our whole team smile! 🌟`,
            t => `YES! Hearing that ${t} was a highlight makes us do a happy dance! 💃`,
            t => `It makes us SO happy that ${t} was everything you hoped for! 🎉`
        ],
        concern: [
            t => `We\'re not happy that ${t} fell short, and we\'re fired up to fix it — your feedback is exactly what helps us get better! 🚀`,
            t => `We\'re determined to make ${t} right — your input is rocket fuel for our improvements! 💪`,
            t => `We won\'t rest until ${t} is exactly where it should be — thank you for pushing us to be better! ⭐`
        ]
    },
    formal: {
        openers: {
            positive: [
                'Dear Mr./Ms. {name},\n\nWe wish to extend our sincere gratitude for your commendable review.',
                'Dear Mr./Ms. {name},\n\nWe acknowledge your positive review with profound appreciation.',
                'Dear Mr./Ms. {name},\n\nIt is with great pleasure that we receive your favourable feedback.'
            ],
            negative: [
                'Dear Mr./Ms. {name},\n\nWe acknowledge your feedback with sincere regret and offer our formal apologies.',
                'Dear Mr./Ms. {name},\n\nWe have received your review and wish to express our regret regarding the matters noted.',
                'Dear Mr./Ms. {name},\n\nWe formally acknowledge your concerns and extend our apologies for the shortcomings experienced.'
            ],
            neutral: [
                'Dear Mr./Ms. {name},\n\nWe acknowledge with appreciation your review of our establishment.',
                'Dear Mr./Ms. {name},\n\nWe have duly received your balanced assessment and thank you for it.',
                'Dear Mr./Ms. {name},\n\nWe acknowledge receipt of your review and value your considered feedback.'
            ]
        },
        closers: [
            '\n\nWe remain at your disposal and hope to have the privilege of hosting you again.\n\nYours faithfully,\nGeneral Manager\nGuest Relations Department',
            '\n\nWe trust you will consider returning, and we assure you of our continued commitment to excellence.\n\nRespectfully yours,\nGeneral Manager\nGuest Relations Department',
            '\n\nShould you require any further assistance, please do not hesitate to contact us directly.\n\nYours faithfully,\nGeneral Manager\nGuest Relations Department'
        ],
        praise: [
            t => `We are pleased to note your satisfaction with ${t}, which reflects our team\'s commitment to excellence.`,
            t => `Your commendation of ${t} is duly noted and serves as a testament to our operational standards.`,
            t => `We are gratified that ${t} met your expectations during your stay.`
        ],
        concern: [
            t => `We regret that ${t} did not meet our established standards. The matter has been escalated to the relevant department for corrective action.`,
            t => `We acknowledge the deficiencies concerning ${t} and have formally documented them for immediate remediation.`,
            t => `Please be assured that the issues regarding ${t} have been recorded and assigned for thorough review.`
        ]
    }
};

function buildSmartReply(name, tone, analysis) {
    const style = TONE_STYLE[tone];
    const { sentiment, praisedTopics, criticizedTopics } = analysis;

    // Each part is picked randomly from a pool, so Regenerate gives a fresh reply.
    const praise = (t) => pick(style.praise)(t);
    const concern = (t) => pick(style.concern)(t);

    const praisePhrase = topicsPhrase(praisedTopics);
    const concernPhrase = topicsPhrase(criticizedTopics);

    let parts = [];

    if (sentiment === 'positive') {
        parts.push(pick(style.openers.positive));
        parts.push(praise(praisePhrase || 'your stay with us'));
    } else if (sentiment === 'negative') {
        parts.push(pick(style.openers.negative));
        parts.push(concern(concernPhrase || 'aspects of your stay'));
    } else if (sentiment === 'mixed') {
        // Acknowledge the good first, then sincerely address the concerns.
        parts.push(pick(style.openers.neutral));
        if (praisePhrase) parts.push(praise(praisePhrase));
        parts.push(concern(concernPhrase || 'the areas you mentioned'));
    } else {
        // Neutral — no strong signal either way
        parts.push(pick(style.openers.neutral));
        if (criticizedTopics.length) {
            parts.push(concern(concernPhrase));
        } else if (praisedTopics.length) {
            parts.push(praise(praisePhrase));
        } else {
            parts.push(praise('your stay with us'));
        }
    }

    // Closer
    parts.push(pick(style.closers));

    let reply = parts.join('\n\n').replace(/{name}/g, name);
    reply = reply.replace(/\n\n\n+/g, '\n\n');
    return reply;
}

// ===== Generate Reply =====
function generateReply() {
    const name = guestNameInput.value.trim() || 'Valued Guest';
    const reviewText = reviewTextArea.value.trim();
    const tone = toneSelect.value;

    // Validation
    if (!reviewText) {
        reviewTextArea.classList.add('error-shake');
        setTimeout(() => reviewTextArea.classList.remove('error-shake'), 400);
        showToast('Please enter a guest review first!', 'error');
        return;
    }

    if (!tone) {
        toneSelect.classList.add('error-shake');
        setTimeout(() => toneSelect.classList.remove('error-shake'), 400);
        showToast('Please select a reply tone!', 'error');
        return;
    }

    // Analyze what the guest actually said
    const analysis = analyzeReview(reviewText, selectedRating);

    // Build a reply that references the guest's actual content.
    // Retry a few times so regenerate never shows the exact same text twice.
    const previous = resultContent.textContent;
    let reply = buildSmartReply(name, tone, analysis);
    let attempts = 0;
    while (reply === previous && attempts < 8) {
        reply = buildSmartReply(name, tone, analysis);
        attempts++;
    }

    // Display result
    resultContent.textContent = reply;
    resultCard.style.display = 'block';

    // Set tone badge (with sentiment)
    const toneLabels = {
        professional: 'Professional',
        friendly: 'Friendly',
        empathetic: 'Empathetic',
        enthusiastic: 'Enthusiastic',
        formal: 'Formal'
    };
    const sentimentLabels = {
        positive: 'Positive',
        negative: 'Negative',
        mixed: 'Mixed',
        neutral: 'Neutral'
    };
    const sentimentLabel = sentimentLabels[analysis.sentiment] || 'Neutral';
    toneBadge.textContent = `${toneLabels[tone]} · ${sentimentLabel}`;
    toneBadge.className = `tone-badge ${tone}`;

    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ===== Copy to Clipboard =====
function copyToClipboard() {
    const text = resultContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Reply copied to clipboard! ✓');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Reply copied to clipboard! ✓');
    });
}

// ===== Event Listeners =====
generateBtn.addEventListener('click', generateReply);
copyBtn.addEventListener('click', copyToClipboard);
regenerateBtn.addEventListener('click', () => {
    generateReply();
    // Visible confirmation that regenerate fired
    regenerateBtn.textContent = '🔄 Regenerating...';
    setTimeout(() => { regenerateBtn.textContent = '🔄 Regenerate'; }, 500);
    showToast('New reply generated! 🔄');
});

// Keyboard shortcut: Enter in guest name focuses review
guestNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        reviewTextArea.focus();
    }
});

// Ctrl+Enter to generate
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generateReply();
    }
});

// ===== Screenshot Upload & OCR Logic =====

// Click to upload
uploadArea.addEventListener('click', () => {
    screenshotInput.click();
});

// Drag & Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    } else {
        showToast('Please drop an image file!', 'error');
    }
});

// File input change
screenshotInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// Clipboard Paste (Ctrl+V)
document.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
            e.preventDefault();
            const file = items[i].getAsFile();
            if (file) {
                handleImageUpload(file);
                showToast('Screenshot pasted! Extracting text...');
            }
            break;
        }
    }
});

// Remove image
removeImageBtn.addEventListener('click', () => {
    previewArea.style.display = 'none';
    uploadArea.style.display = 'block';
    ocrProgress.style.display = 'none';
    screenshotInput.value = '';
    previewImage.src = '';
});

// Handle image upload
function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        
        // Start OCR
        extractTextFromImage(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Extract text using Tesseract.js
async function extractTextFromImage(imageData) {
    ocrProgress.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Initializing OCR engine...';

    try {
        const result = await Tesseract.recognize(imageData, 'eng', {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    const percent = Math.round(m.progress * 100);
                    progressFill.style.width = percent + '%';
                    progressText.textContent = `Extracting text... ${percent}%`;
                } else if (m.status === 'loading language traineddata') {
                    progressFill.style.width = '20%';
                    progressText.textContent = 'Loading language data...';
                } else if (m.status === 'initializing api') {
                    progressFill.style.width = '10%';
                    progressText.textContent = 'Initializing...';
                }
            }
        });

        const extractedText = result.data.text.trim();
        
        if (extractedText) {
            reviewTextArea.value = extractedText;
            progressFill.style.width = '100%';
            progressText.textContent = '✓ Text extracted successfully!';
            showToast('Review text extracted from screenshot! ✓');
        } else {
            progressText.textContent = '⚠️ No text found in image. Try a clearer screenshot.';
            showToast('No text could be extracted. Try a clearer image.', 'error');
        }

        // Hide progress after a delay
        setTimeout(() => {
            ocrProgress.style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error('OCR Error:', error);
        progressText.textContent = '❌ Error extracting text. Please try again.';
        showToast('Error extracting text from image.', 'error');
        
        setTimeout(() => {
            ocrProgress.style.display = 'none';
        }, 3000);
    }
}
