document.addEventListener('DOMContentLoaded', () => {
    // --- 音频设置 ---
    const standardNote = 'A4';
    let currentNote = '';
    let score = 0;
    let questionCount = 0;
    const totalQuestions = 10;

    // --- DOM 元素 ---
    const playNoteBtn = document.getElementById('play-note-btn');
    const playStandardBtn = document.getElementById('play-standard-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const optionsContainer = document.getElementById('options-container');
    const statusText = document.getElementById('status-text');
    const scoreEl = document.getElementById('score');
    const questionCountEl = document.getElementById('question-count');

    // --- 音符池 ---
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

    // --- 功能函数 ---

    // 生成新题目
    function generateQuestion() {
        // 1. 选择一个随机音符作为答案
        currentNote = notes[Math.floor(Math.random() * notes.length)];
        
        // 2. 生成选项
        generateOptions(currentNote);

        // 3. 更新状态
        statusText.textContent = '请听题，然后选择正确的音名';
        playNoteBtn.disabled = false;
        nextQuestionBtn.disabled = true;
        questionCount++;
        updateScoreboard();
    }

    // 生成选项按钮
    function generateOptions(correctNote) {
        optionsContainer.innerHTML = '';
        const options = new Set([correctNote]);

        // 生成3个不重复的错误选项
        while (options.size < 4) {
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            options.add(randomNote);
        }

        // 将选项随机排序并创建按钮
        const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach(note => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = note;
            button.dataset.note = note;
            button.addEventListener('click', handleOptionClick);
            optionsContainer.appendChild(button);
        });
    }

    // 处理选项点击
    function handleOptionClick(event) {
        const selectedNote = event.target.dataset.note;
        const buttons = optionsContainer.querySelectorAll('.option-btn');

        // 禁用所有按钮
        buttons.forEach(btn => btn.disabled = true);

        if (selectedNote === currentNote) {
            event.target.classList.add('correct');
            statusText.textContent = '回答正确！';
            score++;
        } else {
            event.target.classList.add('incorrect');
            statusText.textContent = `回答错误，正确答案是 ${currentNote}`;
            // 标记正确答案
            buttons.forEach(btn => {
                if (btn.dataset.note === currentNote) {
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

    // 更新计分板
    function updateScoreboard() {
        scoreEl.textContent = score;
        questionCountEl.textContent = `${questionCount} / ${totalQuestions}`;
    }

    // 结束游戏
    function endGame() {
        statusText.textContent = `练习结束！你的最终得分是 ${score} / ${totalQuestions}`;
        playNoteBtn.disabled = true;
        nextQuestionBtn.textContent = '重新开始';
        nextQuestionBtn.removeEventListener('click', startNextQuestion);
        nextQuestionBtn.addEventListener('click', resetGame);
    }
    
    // 重置游戏
    function resetGame() {
        score = 0;
        questionCount = 0;
        nextQuestionBtn.textContent = '下一题';
        nextQuestionBtn.removeEventListener('click', resetGame);
        nextQuestionBtn.addEventListener('click', startNextQuestion);
        generateQuestion();
    }

    // 播放音符
    function playNote(note) {
        AudioSystem.playNote(note, '1n');
    }

    // --- 事件监听 ---
    playNoteBtn.addEventListener('click', () => {
        if (currentNote) {
            playNote(currentNote);
        }
    });

    playStandardBtn.addEventListener('click', () => {
        playNote(standardNote);
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
