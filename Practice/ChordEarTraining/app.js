document.addEventListener('DOMContentLoaded', () => {
    // --- 音频设置 ---
    const standardNote = 'A4';
    let currentChord = {};
    let score = 0;
    let questionCount = 0;
    const totalQuestions = 10;

    // --- DOM 元素 ---
    const playChordBtn = document.getElementById('play-chord-btn');
    const playStandardBtn = document.getElementById('play-standard-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const optionsContainer = document.getElementById('options-container');
    const statusText = document.getElementById('status-text');
    const scoreEl = document.getElementById('score');
    const questionCountEl = document.getElementById('question-count');

    // --- 和弦定义 ---
    const rootNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
    const chordTypes = {
        'Major': { name: '大三和弦', intervals: [0, 4, 7] },
        'Minor': { name: '小三和弦', intervals: [0, 3, 7] },
        'Augmented': { name: '增三和弦', intervals: [0, 4, 8] },
        'Diminished': { name: '减三和弦', intervals: [0, 3, 6] }
    };

    // --- 功能函数 ---

    function generateQuestion() {
        // 1. 随机选择根音与和弦类型
        const root = rootNotes[Math.floor(Math.random() * rootNotes.length)];
        const typeKeys = Object.keys(chordTypes);
        const type = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        
        // 2. 构建和弦音符
        const intervals = chordTypes[type].intervals;
        const rootMidi = Tone.Frequency(root).toMidi();
        const notes = intervals.map(interval => Tone.Frequency(rootMidi + interval, 'midi').toNote());

        currentChord = {
            root: root,
            type: type,
            typeName: chordTypes[type].name,
            notes: notes
        };

        // 3. 生成选项
        generateOptions();

        // 4. 更新状态
        statusText.textContent = '请听题，然后选择正确的和弦性质';
        playChordBtn.disabled = false;
        nextQuestionBtn.disabled = true;
        questionCount++;
        updateScoreboard();
    }

    function generateOptions() {
        optionsContainer.innerHTML = '';
        const shuffledTypes = Object.keys(chordTypes).sort(() => Math.random() - 0.5);

        shuffledTypes.forEach(typeKey => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = chordTypes[typeKey].name;
            button.dataset.type = typeKey;
            button.addEventListener('click', handleOptionClick);
            optionsContainer.appendChild(button);
        });
    }

    function handleOptionClick(event) {
        const selectedType = event.target.dataset.type;
        const buttons = optionsContainer.querySelectorAll('.option-btn');

        buttons.forEach(btn => btn.disabled = true);

        if (selectedType === currentChord.type) {
            event.target.classList.add('correct');
            statusText.textContent = '回答正确！';
            score++;
        } else {
            event.target.classList.add('incorrect');
            statusText.textContent = `回答错误，正确答案是 ${currentChord.typeName}`;
            buttons.forEach(btn => {
                if (btn.dataset.type === currentChord.type) {
                    btn.classList.add('correct');
                }
            });
        }

        updateScoreboard();
        nextQuestionBtn.disabled = false;

        if (questionCount >= totalQuestions) {
            endGame();
        }
    }

    function updateScoreboard() {
        scoreEl.textContent = score;
        questionCountEl.textContent = `${questionCount} / ${totalQuestions}`;
    }

    function endGame() {
        statusText.textContent = `练习结束！你的最终得分是 ${score} / ${totalQuestions}`;
        playChordBtn.disabled = true;
        nextQuestionBtn.textContent = '重新开始';
        nextQuestionBtn.removeEventListener('click', startNextQuestion);
        nextQuestionBtn.addEventListener('click', resetGame);
    }

    function resetGame() {
        score = 0;
        questionCount = 0;
        nextQuestionBtn.textContent = '下一题';
        nextQuestionBtn.removeEventListener('click', resetGame);
        nextQuestionBtn.addEventListener('click', startNextQuestion);
        generateQuestion();
    }

    function playChord(notes) {
        AudioSystem.playChord(notes, '2n');
    }

    // --- 事件监听 ---
    playChordBtn.addEventListener('click', () => {
        if (currentChord.notes) {
            playChord(currentChord.notes);
        }
    });

    playStandardBtn.addEventListener('click', () => {
        AudioSystem.playNote(standardNote, '1n');
    });

    function startNextQuestion() {
        if (questionCount < totalQuestions) {
            generateQuestion();
        } else {
            endGame();
        }
    }

    nextQuestionBtn.addEventListener('click', startNextQuestion);

    // --- 导航栏逻辑 ---
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('nav-active');
            navToggle.querySelectorAll('.hamburger-line').forEach(line => line.classList.toggle('active'));
        });
    }

    // --- 初始化 ---
    generateQuestion();
});
