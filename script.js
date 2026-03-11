const exams = [
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

const difficultyLabels = {
    1: "lehká",
    2: "střední",
    3: "těžká",
};

function getDaysLabel(days) {
    if (days === 1) return "den";
    if (days >= 2 && days <= 4) return "dny";
    return "dní";
}

function createDifficultyBadge(level) {
    if (!level) return null;
    const span = document.createElement("span");
    span.className = "difficulty diff-" + level;
    for (let i = 0; i < level; i++) {
        const dot = document.createElement("span");
        dot.className = "difficulty-dot";
        span.appendChild(dot);
    }
    const label = document.createTextNode(" " + difficultyLabels[level]);
    span.appendChild(label);
    return span;
}

function createExamCard(exam) {
    const now = new Date();
    const target = new Date(exam.date + "T08:00:00");
    const diff = target - now;
    const done = diff <= 0;

    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const card = document.createElement("div");
    card.className = "exam-card";
    if (exam.difficulty) card.classList.add("diff-" + exam.difficulty);
    if (done) card.classList.add("done");

    const dateEl = document.createElement("div");
    dateEl.className = "exam-date";
    dateEl.textContent = exam.dateLabel;
    card.appendChild(dateEl);

    const nameEl = document.createElement("div");
    nameEl.className = "exam-name";
    nameEl.textContent = exam.name;
    const badge = createDifficultyBadge(exam.difficulty);
    if (badge) nameEl.appendChild(badge);
    card.appendChild(nameEl);

    const daysEl = document.createElement("div");
    daysEl.className = "days-left";
    daysEl.textContent = done ? "Hotovo!" : days;
    card.appendChild(daysEl);

    const labelEl = document.createElement("div");
    labelEl.className = "days-label";
    labelEl.textContent = done ? "Zkouška proběhla" : getDaysLabel(days) + " zbývá";
    card.appendChild(labelEl);

    if (!done) {
        const timeEl = document.createElement("div");
        timeEl.className = "time-detail";
        timeEl.textContent = hours + "h " + minutes + "m " + seconds + "s";
        card.appendChild(timeEl);
    }

    return card;
}

function render() {
    const container = document.getElementById("exams");
    const fragment = document.createDocumentFragment();
    exams.forEach(function (exam) {
        fragment.appendChild(createExamCard(exam));
    });
    container.replaceChildren(fragment);
}

render();
setInterval(render, 1000);
