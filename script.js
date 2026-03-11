var exams = [
    {
        date: "2026-04-01",
        dateLabel: "1. dubna",
        name: "Slohová práce ČJ",
        difficulty: null,
    },
    {
        date: "2026-04-07",
        dateLabel: "7. dubna",
        name: "Slohová práce AJ",
        difficulty: null,
    },
    {
        date: "2026-04-28",
        dateLabel: "28. dubna",
        name: "Praktická zkouška",
        difficulty: 3,
    },
    {
        date: "2026-05-04",
        dateLabel: "4. – 5. května",
        name: "DT AJ + ČJ",
        difficulty: null,
    },
    {
        date: "2026-05-11",
        dateLabel: "11. – 12. května",
        name: "Obhajoby praktická",
        difficulty: null,
    },
    {
        date: "2026-05-25",
        dateLabel: "25. – 29. května",
        name: "Ústní ČJ + AJ + VLV + KLN",
        difficulty: null,
    },
];

var REFERENCE_START = new Date("2026-03-01T00:00:00");
var RING_RADIUS = 38;
var RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

var difficultyLabels = {
    1: "lehká",
    2: "střední",
    3: "těžká",
};

function getDaysLabel(days) {
    if (days === 1) return "den";
    if (days >= 2 && days <= 4) return "dny";
    return "dní";
}

function getRingColor(days) {
    if (days <= 3) return "ring-red";
    if (days <= 7) return "ring-orange";
    if (days <= 14) return "ring-yellow";
    if (days <= 30) return "ring-blue";
    return "ring-green";
}

function createDifficultyBadge(level) {
    if (!level) return null;
    var span = document.createElement("span");
    span.className = "difficulty diff-" + level;
    for (var i = 0; i < level; i++) {
        var dot = document.createElement("span");
        dot.className = "difficulty-dot";
        span.appendChild(dot);
    }
    span.appendChild(document.createTextNode(" " + difficultyLabels[level]));
    return span;
}

function createSvgRing(progress, colorClass) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 90 90");

    var bgCircle = document.createElementNS(svgNS, "circle");
    bgCircle.setAttribute("cx", "45");
    bgCircle.setAttribute("cy", "45");
    bgCircle.setAttribute("r", String(RING_RADIUS));
    bgCircle.setAttribute("class", "ring-bg");
    svg.appendChild(bgCircle);

    var progressCircle = document.createElementNS(svgNS, "circle");
    progressCircle.setAttribute("cx", "45");
    progressCircle.setAttribute("cy", "45");
    progressCircle.setAttribute("r", String(RING_RADIUS));
    progressCircle.setAttribute("class", "ring-progress " + colorClass);
    progressCircle.setAttribute("stroke-dasharray", String(RING_CIRCUMFERENCE));
    var offset = RING_CIRCUMFERENCE * (1 - progress);
    progressCircle.setAttribute("stroke-dashoffset", String(offset));
    svg.appendChild(progressCircle);

    return svg;
}

function createExamCard(exam) {
    var now = new Date();
    var target = new Date(exam.date + "T08:00:00");
    var diff = target - now;
    var done = diff <= 0;

    var totalSeconds = Math.max(0, Math.floor(diff / 1000));
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    // Progress: fraction of time remaining from reference start to exam
    var totalSpan = target - REFERENCE_START;
    var remaining = Math.max(0, target - now);
    var progress = totalSpan > 0 ? remaining / totalSpan : 0;

    var card = document.createElement("div");
    card.className = "exam-card";
    if (exam.difficulty) card.classList.add("diff-" + exam.difficulty);
    if (done) card.classList.add("done");

    // Ring
    var ringWrap = document.createElement("div");
    ringWrap.className = "ring-wrap";

    var colorClass = done ? "ring-green" : getRingColor(days);
    ringWrap.appendChild(createSvgRing(done ? 0 : progress, colorClass));

    var center = document.createElement("div");
    center.className = "ring-center";
    var ringDays = document.createElement("div");
    ringDays.className = "ring-days";
    ringDays.textContent = done ? "Hotovo!" : String(days);
    center.appendChild(ringDays);

    if (!done) {
        var ringLabel = document.createElement("div");
        ringLabel.className = "ring-label";
        ringLabel.textContent = getDaysLabel(days);
        center.appendChild(ringLabel);
    }

    ringWrap.appendChild(center);
    card.appendChild(ringWrap);

    // Info
    var info = document.createElement("div");
    info.className = "exam-info";

    var dateEl = document.createElement("div");
    dateEl.className = "exam-date";
    dateEl.textContent = exam.dateLabel;
    info.appendChild(dateEl);

    var nameEl = document.createElement("div");
    nameEl.className = "exam-name";
    nameEl.textContent = exam.name;
    var badge = createDifficultyBadge(exam.difficulty);
    if (badge) nameEl.appendChild(badge);
    info.appendChild(nameEl);

    if (!done) {
        var timeEl = document.createElement("div");
        timeEl.className = "time-detail";
        timeEl.textContent = hours + "h " + minutes + "m " + seconds + "s";
        info.appendChild(timeEl);
    }

    card.appendChild(info);
    return card;
}

function render() {
    var container = document.getElementById("exams");
    var fragment = document.createDocumentFragment();
    exams.forEach(function (exam) {
        fragment.appendChild(createExamCard(exam));
    });
    container.replaceChildren(fragment);
}

render();
setInterval(render, 1000);
