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
const NEGATORS = ['not', 'no', "n't", 'never', 'without', 'lack', 'lacked', 'hardly', "wasn't", "weren't", "isn't", "aren't", "didn't", "don't", "couldn't"];

const POSITIVE_WORDS = [
    'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'loved', 'perfect', 'best',
    'beautiful', 'outstanding', 'clean', 'comfortable', 'friendly', 'helpful', 'recommend', 'lovely',
    'awesome', 'superb', 'delicious', 'spacious', 'cozy', 'peaceful', 'welcoming', 'exceptional',
    'pleasant', 'enjoyed', 'enjoy', 'happy', 'satisfied', 'nice', 'good', 'fabulous', 'gorgeous',
    'spotless', 'quiet', 'relaxing', 'attentive', 'polite', 'stunning', 'impressed', 'memorable'
];

const NEGATIVE_WORDS = [
    'terrible', 'awful', 'horrible', 'worst', 'dirty', 'rude', 'noisy', 'broken', 'disappointed',
    'disappointing', 'unacceptable', 'poor', 'bad', 'cold', 'slow', 'smell', 'smelly', 'stain',
    'stained', 'uncomfortable', 'unhelpful', 'unfriendly', 'overpriced', 'expensive', 'filthy',
    'disgusting', 'mold', 'bugs', 'insects', 'leak', 'leaking', 'stinks', 'stink', 'nightmare',
    'avoid', 'refuse', 'refused', 'ignored', 'waited', 'waiting', 'delay', 'delayed', 'unclean',
    'outdated', 'worn', 'damaged', 'complaint', 'issue', 'problem', 'problems', 'frustrating',
    'frustrated', 'upset', 'angry', 'ruined', 'regret', 'mediocre', 'lousy'
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

// Analyze the review: returns { sentiment, score, positives, negatives, topics }
function analyzeReview(text, rating) {
    const tokens = tokenize(text);
    let posHits = [];
    let negHits = [];

    tokens.forEach((word, i) => {
        const prev = tokens[i - 1] || '';
        const prev2 = tokens[i - 2] || '';
        const negated = NEGATORS.includes(prev) || NEGATORS.includes(prev2) ||
                        prev.endsWith("n't") || prev2.endsWith("n't");

        if (POSITIVE_WORDS.includes(word)) {
            negated ? negHits.push(word) : posHits.push(word);
        } else if (NEGATIVE_WORDS.includes(word)) {
            negated ? posHits.push(word) : negHits.push(word);
        }
    });

    // Detect which topics were mentioned
    const lowerText = text.toLowerCase();
    const topics = [];
    for (const [label, keywords] of Object.entries(TOPICS)) {
        if (keywords.some(k => lowerText.includes(k))) topics.push(label);
    }

    // Score primarily from text; rating is a light tie-breaker only
    let score = posHits.length - negHits.length;

    let sentiment;
    if (score > 0) sentiment = 'positive';
    else if (score < 0) sentiment = 'negative';
    else {
        // Text is balanced/empty of keywords — use rating as a hint, else neutral
        if (rating >= 4) sentiment = 'positive';
        else if (rating >= 1 && rating <= 2) sentiment = 'negative';
        else sentiment = 'neutral';
    }

    // If text is clearly positive but rating is low (or vice versa), trust the TEXT
    // (the guest's words are what we're replying to)
    return {
        sentiment,
        score,
        positives: [...new Set(posHits)],
        negatives: [...new Set(negHits)],
        topics
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

// Tone-specific building blocks
const TONE_STYLE = {
    professional: {
        openers: {
            positive: ['Dear {name},\n\nThank you for taking the time to share your feedback with us.'],
            negative: ['Dear {name},\n\nThank you for sharing your feedback, and please accept our sincere apologies.'],
            neutral: ['Dear {name},\n\nThank you for your thoughtful review and for choosing to stay with us.']
        },
        closer: '\n\nWe look forward to welcoming you back.\n\nBest regards,\nThe Management Team',
        praise: t => `We are delighted to hear that you enjoyed ${t}, and we will gladly share your kind words with our team.`,
        concern: t => `We are genuinely sorry that ${t} did not meet the standard you rightly expected. Your comments have been shared with the relevant team for immediate review.`
    },
    friendly: {
        openers: {
            positive: ['Hi {name}! 😊\n\nThank you so much for the lovely review — it truly made our day!'],
            negative: ['Hi {name},\n\nThank you for being honest with us — we\'re really sorry your stay wasn\'t what it should have been.'],
            neutral: ['Hi {name}! 👋\n\nThanks a lot for sharing your experience with us!']
        },
        closer: '\n\nWe\'d love to see you again soon! 🌟\n\nWarmly,\nThe Team',
        praise: t => `We\'re so happy you enjoyed ${t} — that means a lot to us! 😄`,
        concern: t => `We\'re really sorry about ${t} — that\'s not the experience we want for you, and we\'re already working on making it right. 🙏`
    },
    empathetic: {
        openers: {
            positive: ['Dear {name},\n\nThank you so much for sharing your experience — your words truly warmed our hearts.'],
            negative: ['Dear {name},\n\nWe want to start by saying how truly sorry we are. Reading your review, we completely understand your frustration.'],
            neutral: ['Dear {name},\n\nThank you for taking the time to share your honest thoughts with us.']
        },
        closer: '\n\nWe genuinely hope to have the chance to welcome you back.\n\nWith heartfelt thanks,\nThe Team',
        praise: t => `Knowing that you felt cared for when it came to ${t} means more to us than you might realise.`,
        concern: t => `We are deeply sorry that ${t} let you down. You deserved better, and we take full responsibility for making this right.`
    },
    enthusiastic: {
        openers: {
            positive: ['Dear {name}! 🎉\n\nWOW — thank you SO much for this incredible review!'],
            negative: ['Dear {name},\n\nFirst of all, THANK YOU for your honesty — we truly appreciate it, and we\'re determined to make things right! 💪'],
            neutral: ['Hey {name}! 🙌\n\nThank you so much for your feedback — we love hearing from our guests!']
        },
        closer: '\n\nWe can\'t WAIT to welcome you back! ✨\n\nWith huge gratitude,\nThe Team',
        praise: t => `We\'re absolutely thrilled that you loved ${t} — you\'ve made our whole team smile! 🌟`,
        concern: t => `We\'re not happy that ${t} fell short, and we\'re fired up to fix it — your feedback is exactly what helps us get better! 🚀`
    },
    formal: {
        openers: {
            positive: ['Dear Mr./Ms. {name},\n\nWe wish to extend our sincere gratitude for your commendable review.'],
            negative: ['Dear Mr./Ms. {name},\n\nWe acknowledge your feedback with sincere regret and offer our formal apologies.'],
            neutral: ['Dear Mr./Ms. {name},\n\nWe acknowledge with appreciation your review of our establishment.']
        },
        closer: '\n\nWe remain at your disposal and hope to have the privilege of hosting you again.\n\nYours faithfully,\nGeneral Manager\nGuest Relations Department',
        praise: t => `We are pleased to note your satisfaction with ${t}, which reflects our team\'s commitment to excellence.`,
        concern: t => `We regret that ${t} did not meet our established standards. The matter has been escalated to the relevant department for corrective action.`
    }
};

function buildSmartReply(name, tone, analysis) {
    const style = TONE_STYLE[tone];
    const { sentiment, positives, negatives, topics } = analysis;

    let parts = [];

    // Opener based on the REAL sentiment of the message
    parts.push(pick(style.openers[sentiment]));

    // Body — reference what the guest actually talked about
    const topicText = topicsPhrase(topics);

    if (sentiment === 'positive') {
        parts.push(style.praise(topicText || 'your stay with us'));
    } else if (sentiment === 'negative') {
        parts.push(style.concern(topicText || 'aspects of your stay'));
    } else {
        // Neutral / mixed — acknowledge both sides if present
        if (positives.length && negatives.length) {
            parts.push(style.praise(topicText || 'several parts of your stay'));
            parts.push(style.concern('the areas that fell short'));
        } else if (positives.length) {
            parts.push(style.praise(topicText || 'your stay'));
        } else if (negatives.length) {
            parts.push(style.concern(topicText || 'the concerns you raised'));
        } else {
            parts.push(style.praise('your stay with us'));
        }
    }

    // Closer
    parts.push(style.closer);

    let reply = parts.join('\n\n').replace(/{name}/g, name);
    // Clean up doubled newlines around the closer
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

    // Build a reply that references the guest's actual content
    let reply = buildSmartReply(name, tone, analysis);

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
    const sentimentLabel = analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1);
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
regenerateBtn.addEventListener('click', generateReply);

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
