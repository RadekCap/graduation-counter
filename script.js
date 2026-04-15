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
        date: "2026-05-26",
        dateLabel: "26. – 29. května",
        name: "Ústní ČJ + AJ + VLV + KLN",
        difficulty: null,
    },
];

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

function createSvgRing(colorClass) {
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
    progressCircle.setAttribute("stroke-dashoffset", "0");
    svg.appendChild(progressCircle);

    return svg;
}

function getExamState(exam, now) {
    var target = new Date(exam.date + "T08:00:00");
    var todayStr = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");
    if (todayStr === exam.date) return "today";
    if (now > target) return "passed";
    return "upcoming";
}

function createExamCard(exam, forceState) {
    var now = new Date();
    var target = new Date(exam.date + "T08:00:00");
    var diff = target - now;

    var state = forceState || getExamState(exam, now);
    var done = state === "today" || state === "passed";

    var totalSeconds = Math.max(0, Math.floor(diff / 1000));
    var days = Math.floor(totalSeconds / 86400);

    var card = document.createElement("div");
    card.className = "exam-card";
    if (exam.difficulty) card.classList.add("diff-" + exam.difficulty);

    if (state === "today") {
        card.classList.add("is-today");
    } else if (state === "passed") {
        card.classList.add("done", "is-passed");
    }

    // Ring
    var ringWrap = document.createElement("div");
    ringWrap.className = "ring-wrap";

    var colorClass;
    if (state === "today") colorClass = "ring-yellow";
    else if (state === "passed") colorClass = "ring-green";
    else colorClass = getRingColor(days);
    ringWrap.appendChild(createSvgRing(colorClass));

    var center = document.createElement("div");
    center.className = "ring-center";
    var ringDays = document.createElement("div");
    ringDays.className = "ring-days";
    if (state === "today") ringDays.textContent = "Dnes!";
    else if (state === "passed") ringDays.textContent = "Hotovo!";
    else ringDays.textContent = String(days);
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

    card.appendChild(info);

    // Overlay
    if (state === "today" || state === "passed") {
        var overlay = document.createElement("div");
        overlay.className = "exam-overlay";
        overlay.textContent = state === "today" ? "\uD83E\uDD1E" : "\u2705";
        card.appendChild(overlay);
    }

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

function createLegend() {
    var legend = document.getElementById("legend");
    var items = [
        { color: "ring-red", text: "3 dny a méně" },
        { color: "ring-orange", text: "4 – 7 dní" },
        { color: "ring-yellow", text: "8 – 14 dní" },
        { color: "ring-blue", text: "15 – 30 dní" },
        { color: "ring-green", text: "více než 30 dní" },
    ];
    items.forEach(function (item) {
        var el = document.createElement("div");
        el.className = "legend-item";
        var dot = document.createElement("span");
        dot.className = "legend-dot " + item.color;
        el.appendChild(dot);
        el.appendChild(document.createTextNode(item.text));
        legend.appendChild(el);
    });
}

render();
createLegend();
setInterval(render, 1000);
