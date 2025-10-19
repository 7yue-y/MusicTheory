document.addEventListener('DOMContentLoaded', () => {
    // --- 音频设置 ---
    const standardNote = 'A4';
    let currentMelody = [];
    let userInput = [];
    let score = 0;
    let questionCount = 0;
    const totalQuestions = 10;

    // --- DOM 元素 ---
    const playMelodyBtn = document.getElementById('play-melody-btn');
    const playStandardBtn = document.getElementById('play-standard-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const optionsContainer = document.getElementById('options-container');
    const userInputDisplay = document.getElementById('user-input-display');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    const statusText = document.getElementById('status-text');
    const scoreEl = document.getElementById('score');
    const questionCountEl = document.getElementById('question-count');

    // --- 音符池 (C大调音阶) ---
    const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

    // --- 功能函数 ---

    function generateQuestion() {
        // 1. 生成一段随机旋律 (4-5个音符)
        const melodyLength = Math.floor(Math.random() * 2) + 4; // 4 or 5 notes
        currentMelody = [];
        for (let i = 0; i < melodyLength; i++) {
            const note = scale[Math.floor(Math.random() * scale.length)];
            currentMelody.push(note);
        }

        // 2. 重置用户输入
        clearInput();

        // 3. 更新状态
        statusText.textContent = '请听题，然后重现旋律';
        playMelodyBtn.disabled = false;
        submitBtn.disabled = false;
        nextQuestionBtn.disabled = true;
        optionsContainer.querySelectorAll('.option-btn').forEach(btn => btn.disabled = false);
        questionCount++;
        updateScoreboard();
    }

    function createOptions() {
        scale.forEach(note => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = note;
            button.dataset.note = note;
            button.addEventListener('click', () => handleNoteClick(note));
            optionsContainer.appendChild(button);
        });
    }

    function handleNoteClick(note) {
        if (userInput.length < currentMelody.length) {
            userInput.push(note);
            updateUserInputDisplay();
            playNote(note);
        }
    }

    function updateUserInputDisplay() {
        userInputDisplay.innerHTML = '';
        userInput.forEach(note => {
            const tag = document.createElement('span');
            tag.className = 'note-tag';
            tag.textContent = note;
            userInputDisplay.appendChild(tag);
        });
    }

    function clearInput() {
        userInput = [];
        updateUserInputDisplay();
    }

    function handleSubmit() {
        // 检查答案
        const isCorrect = JSON.stringify(userInput) === JSON.stringify(currentMelody);

        if (isCorrect) {
            statusText.textContent = '回答正确！';
            score++;
        } else {
            statusText.textContent = `回答错误，正确答案是: ${currentMelody.join(', ')}`;
        }

        // 禁用按钮
        submitBtn.disabled = true;
        optionsContainer.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
        nextQuestionBtn.disabled = false;
        updateScoreboard();

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
        playMelodyBtn.disabled = true;
        submitBtn.disabled = true;
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

    function playNote(note) {
        AudioSystem.playNote(note, '8n');
    }

    function playMelody(melody) {
        AudioSystem.playMelody(melody, '8n', 0.5);
    }

    // --- 事件监听 ---
    playMelodyBtn.addEventListener('click', () => {
        if (currentMelody.length > 0) {
            playMelody(currentMelody);
        }
    });

    playStandardBtn.addEventListener('click', () => {
        AudioSystem.playNote(standardNote, '1n');
    });

    submitBtn.addEventListener('click', handleSubmit);
    clearBtn.addEventListener('click', clearInput);

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
    createOptions();
    generateQuestion();
});
