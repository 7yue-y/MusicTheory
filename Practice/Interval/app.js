document.addEventListener('DOMContentLoaded', () => {
    // --- 音频设置 ---
    const standardNote = 'A4';
    let currentInterval = {};
    let score = 0;
    let questionCount = 0;
    const totalQuestions = 10;

    // --- DOM 元素 ---
    const playIntervalBtn = document.getElementById('play-interval-btn');
    const playStandardBtn = document.getElementById('play-standard-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const optionsContainer = document.getElementById('options-container');
    const statusText = document.getElementById('status-text');
    const scoreEl = document.getElementById('score');
    const questionCountEl = document.getElementById('question-count');

    // --- 音程定义 (半音数: 名称) ---
    const intervals = {
        1: '小二度', 2: '大二度', 3: '小三度', 4: '大三度',
        5: '纯四度', 6: '增四度/减五度', 7: '纯五度', 8: '小六度',
        9: '大六度', 10: '小七度', 11: '大七度', 12: '纯八度'
    };
    const rootNotes = ['C4', 'D4', 'E4', 'F4']; // 限制根音范围以避免音程过高

    // --- 功能函数 ---

    function generateQuestion() {
        // 1. 随机选择根音和音程
        const root = rootNotes[Math.floor(Math.random() * rootNotes.length)];
        const intervalKeys = Object.keys(intervals);
        const intervalSemitones = parseInt(intervalKeys[Math.floor(Math.random() * intervalKeys.length)]);
        
        // 2. 构建音程中的两个音符
        const rootMidi = Tone.Frequency(root).toMidi();
        const secondNoteMidi = rootMidi + intervalSemitones;
        const secondNote = Tone.Frequency(secondNoteMidi, 'midi').toNote();

        currentInterval = {
            notes: [root, secondNote],
            semitones: intervalSemitones,
            name: intervals[intervalSemitones]
        };

        // 3. 生成选项
        generateOptions(intervalSemitones);

        // 4. 更新状态
        statusText.textContent = '请听题，然后选择正确的音程';
        playIntervalBtn.disabled = false;
        nextQuestionBtn.disabled = true;
        questionCount++;
        updateScoreboard();
    }

    function generateOptions(correctSemitones) {
        optionsContainer.innerHTML = '';
        const options = new Set([correctSemitones]);
        const intervalKeys = Object.keys(intervals).map(k => parseInt(k));

        while (options.size < 4) {
            const randomKey = intervalKeys[Math.floor(Math.random() * intervalKeys.length)];
            options.add(randomKey);
        }

        const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach(semitone => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = intervals[semitone];
            button.dataset.semitones = semitone;
            button.addEventListener('click', handleOptionClick);
            optionsContainer.appendChild(button);
        });
    }

    function handleOptionClick(event) {
        const selectedSemitones = parseInt(event.target.dataset.semitones);
        const buttons = optionsContainer.querySelectorAll('.option-btn');

        buttons.forEach(btn => btn.disabled = true);

        if (selectedSemitones === currentInterval.semitones) {
            event.target.classList.add('correct');
            statusText.textContent = '回答正确！';
            score++;
        } else {
            event.target.classList.add('incorrect');
            statusText.textContent = `回答错误，正确答案是 ${currentInterval.name}`;
            buttons.forEach(btn => {
                if (parseInt(btn.dataset.semitones) === currentInterval.semitones) {
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
        playIntervalBtn.disabled = true;
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

    function playInterval(notes) {
        const now = Tone.now();
        // 使用 AudioSystem 播放分解和弦
        AudioSystem.playNote(notes[0], '1n', now);
        AudioSystem.playNote(notes[1], '1n', now + 0.5);
    }

    // --- 事件监听 ---
    playIntervalBtn.addEventListener('click', () => {
        if (currentInterval.notes) {
            playInterval(currentInterval.notes);
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
