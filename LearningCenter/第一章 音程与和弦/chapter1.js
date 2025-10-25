// 使用Tone.js Sampler的真实钢琴音源
let synth = null;
let isAudioReady = false;

// 和弦定义 - 从C3-B3区域开始
const chords = {
    'C': ['C3', 'E3', 'G3'],        // C大三和弦
    'G': ['G3', 'B3', 'D4'],        // G大三和弦
    'E': ['E3', 'G#3', 'B3'],       // E大三和弦
    'Em': ['E3', 'G3', 'B3']        // Em小三和弦
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化钢琴音源');
    
    // 等待Tone.js加载完成后再初始化
    if (window.Tone) {
        initPianoSound();
    } else {
        // 如果Tone.js还没加载，等待一下
        setTimeout(() => {
            if (window.Tone) {
                initPianoSound();
            } else {
                console.error('Tone.js库加载失败');
            }
        }, 1000);
    }
});


// 初始化钢琴音源
function initPianoSound() {
    if (window.Tone) {
        try {
            // 使用与Practice组件相同的真实钢琴音色
            synth = new Tone.Sampler({
                urls: {
                    "C4": "C4.mp3",
                    "D#4": "Ds4.mp3", 
                    "F#4": "Fs4.mp3",
                    "A4": "A4.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/",
                onload: () => {
                    console.log("真实钢琴音源加载完成");
                    isAudioReady = true;
                },
                onerror: (error) => {
                    console.error("钢琴音源加载失败:", error);
                }
            }).toDestination();
            
            console.log('Tone.js Sampler 钢琴音源初始化成功');
            setupPianoWindows();
        } catch (error) {
            console.error('钢琴音源初始化失败:', error);
            // 即使初始化失败，也要设置交互
            setupPianoWindows();
        }
    } else {
        console.error('Tone.js未加载，无法初始化钢琴音源');
        // 即使没有音源，也要设置钢琴窗口交互
        setupPianoWindows();
    }
}

// 启动音频上下文（需要用户交互）
function startAudioContext() {
    if (!isAudioReady && window.Tone) {
        try {
            Tone.start().then(() => {
                isAudioReady = true;
                console.log('Tone.js音频上下文已启动');
            }).catch(error => {
                console.error('Tone.js音频上下文启动失败:', error);
            });
        } catch (error) {
            console.error('启动Tone.js音频上下文时出错:', error);
        }
    }
}

// 设置钢琴窗交互
function setupPianoWindows() {
    const pianoWindows = document.querySelectorAll('.piano-window');
    console.log('找到钢琴窗口数量:', pianoWindows.length);
    
    pianoWindows.forEach((window, index) => {
        const playButtons = window.querySelectorAll('.play-btn');
        const windowChordName = window.dataset.chord;
        console.log(`钢琴窗口 ${index + 1}:`, windowChordName, '按钮数量:', playButtons.length);
        
        // 自动调整钢琴键盘显示范围
        if (windowChordName && chords[windowChordName]) {
            adjustPianoKeyboard(windowChordName);
        }
        
        playButtons.forEach((button, btnIndex) => {
            // 检查按钮是否有内联onclick事件
            if (button.onclick) {
                console.log(`按钮 ${btnIndex + 1} 已有内联事件，跳过`);
                return;
            }
            
            // 优先使用按钮上的data-chord属性，如果没有则使用窗口的data-chord
            const chordName = button.dataset.chord || windowChordName;
            console.log(`按钮 ${btnIndex + 1} 和弦名称:`, chordName);
            
            // 如果没有内联事件，绑定点击事件
            if (chordName && chords[chordName]) {
                button.addEventListener('click', function() {
                    console.log('播放和弦:', chordName);
                    playChord(chordName);
                });
                console.log(`按钮 ${btnIndex + 1} 事件绑定成功`);
            } else {
                console.warn(`按钮 ${btnIndex + 1} 和弦未定义:`, chordName);
            }
        });
    });
    
    // 设置钢琴键盘交互
    setupPianoKeyboard();
}

// 设置钢琴键盘交互
function setupPianoKeyboard() {
    const pianoKeys = document.querySelectorAll('.piano-key');
    console.log('找到钢琴键数量:', pianoKeys.length);
    
    pianoKeys.forEach((key, index) => {
        const note = key.dataset.note;
        console.log(`钢琴键 ${index + 1}:`, note);
        
        key.addEventListener('click', function() {
            const note = this.dataset.note;
            console.log('播放音符:', note);
            playSingleNote(note);
            
            // 视觉反馈
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300);
        });
    });
}

// 自动调整钢琴键盘显示范围 - 统一显示C3-G4
function adjustPianoKeyboard(chordName) {
    // 统一显示C3到G4的键盘范围
    const keyboardNotes = [
        'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4'
    ];
    
    // 更新钢琴键盘HTML
    updatePianoKeyboardHTML(chordName, keyboardNotes);
    
    console.log('调整钢琴键盘:', chordName, '范围: C3 到 G4');
}

// 更新钢琴键盘HTML
function updatePianoKeyboardHTML(chordName, keyboardNotes) {
    const pianoWindow = document.querySelector(`.piano-window[data-chord="${chordName}"]`);
    if (!pianoWindow) return;
    
    const keyboardKeys = pianoWindow.querySelector('.keyboard-keys');
    if (!keyboardKeys) return;
    
    // 清空现有键盘
    keyboardKeys.innerHTML = '';
    
    // 生成新的键盘
    keyboardNotes.forEach(note => {
        const isBlackKey = note.includes('#');
        const keyElement = document.createElement('div');
        keyElement.className = `piano-key ${isBlackKey ? 'black' : ''}`;
        keyElement.dataset.note = note;
        keyElement.textContent = note;
        keyboardKeys.appendChild(keyElement);
    });
    
    // 重新绑定事件
    setupPianoKeyboardForWindow(pianoWindow);
}

// 为特定钢琴窗设置键盘事件
function setupPianoKeyboardForWindow(pianoWindow) {
    const pianoKeys = pianoWindow.querySelectorAll('.piano-key');
    
    pianoKeys.forEach(key => {
        key.addEventListener('click', function() {
            const note = this.dataset.note;
            console.log('播放音符:', note);
            playSingleNote(note);
            
            // 视觉反馈
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300);
        });
    });
}

// 高亮钢琴键
function highlightPianoKey(note, duration = 1000, chordName = null) {
    // 如果指定了和弦名称，先尝试在该和弦的钢琴窗中查找
    let pianoKey;
    if (chordName) {
        const pianoWindow = document.querySelector(`.piano-window[data-chord="${chordName}"]`);
        if (pianoWindow) {
            pianoKey = pianoWindow.querySelector(`.piano-key[data-note="${note}"]`);
        }
        
        // 如果没找到，尝试在包含该和弦按钮的钢琴窗中查找
        if (!pianoKey) {
            const button = document.querySelector(`.play-btn[data-chord="${chordName}"]`);
            if (button) {
                const pianoWindow = button.closest('.piano-window');
                if (pianoWindow) {
                    pianoKey = pianoWindow.querySelector(`.piano-key[data-note="${note}"]`);
                }
            }
        }
    } else {
        // 否则在所有钢琴键中查找
        pianoKey = document.querySelector(`.piano-key[data-note="${note}"]`);
    }
    
    if (pianoKey) {
        // 添加高亮效果
        pianoKey.classList.add('active');
        
        // 设置定时器移除高亮效果
        setTimeout(() => {
            pianoKey.classList.remove('active');
        }, duration);
        
        console.log('高亮钢琴键:', note, '持续', duration, '毫秒', chordName ? `(和弦: ${chordName})` : '');
    } else {
        console.warn('未找到钢琴键:', note, chordName ? `(和弦: ${chordName})` : '');
    }
}

// 播放单个音符
function playSingleNote(note) {
    if (!synth) {
        console.warn('钢琴音源未就绪');
        return;
    }
    
    // 确保音频上下文已启动
    if (!isAudioReady) {
        startAudioContext();
    }
    
    console.log('播放音符:', note);
    synth.triggerAttackRelease(note, "2n");
    
    // 高亮对应的钢琴键
    highlightPianoKey(note, 200);
}

// 播放和弦
function playChord(chordName) {
    if (!synth) {
        console.warn('钢琴音源未就绪');
        return;
    }

    const notes = chords[chordName];
    if (!notes) {
        console.error('未知和弦:', chordName);
        return;
    }

    // 确保音频上下文已启动
    if (!isAudioReady) {
        startAudioContext();
    }

    console.log('播放和弦:', chordName, '音符:', notes);
    
    // 视觉反馈
    const button = document.querySelector(`.play-btn[data-chord="${chordName}"]`) || 
                   document.querySelector(`[data-chord="${chordName}"] .play-btn`);
    if (button) {
        button.classList.add('playing');
    }
    
    // 第一步：依次播放每个单音
    notes.forEach((note, index) => {
        setTimeout(() => {
            console.log('播放单音:', note);
            synth.triggerAttackRelease(note, "4n");
            
            // 高亮对应的钢琴键
            highlightPianoKey(note, 400, chordName); // 高亮1秒
        }, index * 400); // 每个音符间隔0.4秒
    });
    
    // 第二步：在单音播放完成后，同时播放整个和弦
    setTimeout(() => {
        console.log('播放完整和弦:', chordName);
        
        // 先高亮所有和弦音符
        notes.forEach(note => {
            highlightPianoKey(note, 2000, chordName); // 高亮2秒
        });
        
        // 然后播放和弦音频
        notes.forEach(note => {
            synth.triggerAttackRelease(note, "2n");
        });
    }, notes.length * 380 + 500); // 等待所有单音播放完成后再播放和弦
    
    // 移除视觉反馈
    setTimeout(() => {
        if (button) {
            button.classList.remove('playing');
        }
    }, notes.length * 800 + 500 + 2000 + 1000); // 总时长：单音播放时间 + 和弦播放时间 + 额外缓冲
}

// 创建钢琴窗HTML
function createPianoWindow(chordName, description = '') {
    return `
        <div class="piano-window" data-chord="${chordName}">
            <div class="piano-controls">
                <button class="play-btn">
                    <span class="play-icon">▶</span>
                    播放 ${chordName} 和弦
                </button>
                <div class="chord-notes">
                    ${chords[chordName] ? chords[chordName].join(' - ') : ''}
                </div>
            </div>
            ${description ? `<div class="chord-description">${description}</div>` : ''}
        </div>
    `;
}
