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

// ===== Sentiment Detection =====
function detectSentiment(text, rating) {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    if (rating === 3) return 'neutral';

    // Fallback: keyword-based detection
    const positiveWords = ['great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect', 'best', 'beautiful', 'outstanding', 'clean', 'comfortable', 'friendly', 'helpful', 'recommend'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'worst', 'dirty', 'rude', 'noisy', 'broken', 'disappointed', 'unacceptable', 'never', 'poor', 'bad', 'cold', 'slow'];

    const lowerText = text.toLowerCase();
    let positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
    let negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
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

    // Detect sentiment
    const sentiment = detectSentiment(reviewText, selectedRating);

    // Get templates for chosen tone and sentiment
    const templates = replyTemplates[tone][sentiment];
    const randomIndex = Math.floor(Math.random() * templates.length);
    let reply = templates[randomIndex];

    // Replace placeholders
    reply = reply.replace(/{name}/g, name);

    // Display result
    resultContent.textContent = reply;
    resultCard.style.display = 'block';

    // Set tone badge
    const toneLabels = {
        professional: 'Professional',
        friendly: 'Friendly',
        empathetic: 'Empathetic',
        enthusiastic: 'Enthusiastic',
        formal: 'Formal'
    };
    toneBadge.textContent = toneLabels[tone];
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
