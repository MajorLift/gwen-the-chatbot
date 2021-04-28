const INTRO = [
    "Hi, I'm Gwen!",
    "According to a study conducted by psychologist Arthur Aron,<br>there are 36 questions that can make complete strangers fall in love.",
    "Why don't we go through them together?<br>Your next romantic outing will be much more interesting after this ;)"
];

const DIALOGUE = [
    "Cool! Here's the next question.",
    "Interesting...<br>Now how about this one?",
    "Deep stuff..!<br>Let's see what you have to say about this.",
    "Surprising, yet understandable.<br>I'm curious how you'll answer this one.",
    "Thanks for sharing that.<br>Let's move on to the next one.",
    "Fascinating!<br>Now I have to know how you'll answer this.",
    "Impressive! Something tells me you're being humble.<br>Let's hear some more about your exploits.",
    "Intriguing... I'm sure there's more to that story...<br>But let's move on if you don't feel like talking about it.",
    "You're a good storyteller!<br>Let's hear what you have to say about this.",
    "Super! Let's keep going!",
    "I think that's kind of cute ;p<br>OK! Moving on!!",
    "Huh, really?<br>Well, different strokes, I guess. Next one:",
    "OMG I'm so like that, too.<br>I feel like we have a lot in common! What do you think about this?",
    "Meh.. I can think of a much better answer!<br>The margins are too small to go into all that, though ;P.<br>Let's just see what's next."
];

var QUESTIONNAIRE = [
    "Given the choice of anyone in the world, whom would you want as a dinner guest?",
    "Would you like to be famous? In what way?",
    "Before making a telephone call, do you ever rehearse what you are going to say? Why?",
    "What would constitute a “perfect” day for you?",
    "When did you last sing to yourself? To someone else?",
    "If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?",
    "Do you have a secret hunch about how you will die?",
    "For what in your life do you feel most grateful?",
    "If you could change anything about the way you were raised, what would it be?",
    "Take four minutes and tell me your life story in as much detail as possible.",
    "If you could wake up tomorrow having gained any one quality or ability, what would it be?",
    "If a crystal ball could tell you the truth about yourself, your life, the future or anything else, what would you want to know?",
    "Is there something that you’ve dreamed of doing for a long time? Why haven’t you done it?",
    "What is the greatest accomplishment of your life?",
    "What do you value most in a friendship?",
    "What is your most treasured memory?",
    "What is your most terrible memory?",
    "If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?",
    "What does friendship mean to you?",
    "What roles do love and affection play in your life?",
    "How close and warm is your family? Do you feel your childhood was happier than most other people’s?",
    "How do you feel about your relationship with your mother?",
    'Complete this sentence: "I wish I had someone with whom I could share...“',
    "If you were going to become a close friend with me, please share what would be important for me to know.",
    "Share with me an embarrassing moment in your life.",
    "When did you last cry in front of another person ? By yourself ?",
    "What, if anything, is too serious to be joked about ?",
    "If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven’t you told them yet?",
    "Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item.What would it be? Why?",
    "Of all the people in your family, whose death would you find most disturbing ? Why ?"
];

var INDEX = 0;

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// Citation: Scroll to bottom of page.
// https://stackoverflow.com/questions/4249353/jquery-scroll-to-bottom-of-the-page
function scrollToBottom() {
    $("html, body").animate({
        scrollTop: $(document).height() - $(window).height()
    }, 0);
};

// Citation: Submit message on Enter key, while also allowing Shift+Enter to produce newlines instead of submitting.
// https://stackoverflow.com/questions/6014702/how-do-i-detect-shiftenter-and-generate-a-new-line-in-textarea
// The last ternary condition is my own contribution (i.e. prevents empty or newline-only textboxes from being submitted by Enter key).
function sendOnEnter() {
    $("#compose").keypress(function(event) {
        if (event.which === 13 && !event.shiftKey && $("#compose").val().trimStart().length > 0) {
            $("#submit").click();
            event.preventDefault();
        }
    });
};

// @returns timestamp in "MM/DD hh:mm" format.
function getTimestamp() {
    const date = new Date;
    return [date.getMonth(), date.getDate()].join("/") + " " + [date.getHours(), date.getMinutes()].map(x => x.toString().length === 1 ? "0" + x : x).join(":");
};

// TODO: Sanitize user input to remove HTML tags and JS/SQL/PHP code.
function sendOutgoing() {
    $("#submit").click(function(event) {
        event.preventDefault();
        if ($("#compose").val().length === 0) return false;
        $(".current").removeClass("current");

        const entryHTML = `
            <div class="outgoing current">
                <div class="message">${$("#compose").val()}</div>
                <div class="metadata">
                    <span id="timestamp"><br>${getTimestamp()}</span>
                </div>
            </div>
            `
        $(".module").append(entryHTML);
        $("#compose").val(""); // Empty input field.
        scrollToBottom();
        return true;
    });
    return false;
};

function sendIncoming(message) {
    $(".current").removeClass("current");

    const entryHTML = `
    <div class="incoming fade-in current">
        <div class="message">${message}</div>
        <div class="metadata">
            <br><span class="timestamp">${getTimestamp()}</span>
        </div>
    </div>
    `
    $(".module").append(entryHTML);
    scrollToBottom();
};

// Delays presentation of incoming messages so that batch submissions don't appear simultaneously.
function multipleIncoming(messageArray, idx = 0) {
    let interval = setInterval(function() {
        sendIncoming(messageArray[idx]);
        idx++;
        if (idx === messageArray.length) clearInterval(interval);
    }, 700 + Math.floor(Math.random() * 800));
};

// Combines randomly-chosen dialogue with questionnaire prompts to generate chatbot responses,
// while also incrementing questionnaire array index.
function generateResponse() {
    let response = [];
    let dialogue = "";
    if (INDEX > 0) dialogue = DIALOGUE[Math.floor(Math.random() * DIALOGUE.length)];
    else dialogue = "Great! Here's the first one."
    response.push(dialogue);

    let question = QUESTIONNAIRE[INDEX];
    response.push(question);
    multipleIncoming(response);
    INDEX++;

    // App termination process
    if (INDEX === QUESTIONNAIRE.length) {
        sendIncoming("Well, that's it. We actually completed our mission!<br>Yay for us! I hope this was as interesting an experience for you as it was for me.<br>Until next time, then. See you!");
        $("#submit").attr("disabled", true);
        $("#compose").keypress(function(event) { if (event.which === 13) event.preventDefault(); return false; });
    }
};

$(document).ready(function() {
    scrollToBottom();
    sendOnEnter();
    sendOutgoing();

    multipleIncoming(INTRO);
    QUESTIONNAIRE = shuffleArray(QUESTIONNAIRE);
    $("#submit").click(generateResponse);
});