// 音阶应用程序逻辑 - 多模式版本
// 音阶应用程序逻辑 - 增加五度圈功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏激活状态处理
    const currentPage = window.location.pathname.split('/').pop() || 'scale.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // 更精确的匹配逻辑
        if (linkPage === currentPage || 
            (currentPage === 'scale.html' && linkPage.endsWith('scale.html')) ||
            (currentPage === '' && linkPage === '../index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 响应式导航栏切换功能
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('nav-active');
            
            // 汉堡菜单动画
            const hamburgerLines = this.querySelectorAll('.hamburger-line');
            hamburgerLines.forEach(line => {
                line.classList.toggle('active');
            });
        });
        
        // 移动端点击链接后关闭菜单
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navList.classList.remove('nav-active');
                    const hamburgerLines = navToggle.querySelectorAll('.hamburger-line');
                    hamburgerLines.forEach(line => {
                        line.classList.remove('active');
                    });
                }
            });
        });
    }

    // 获取DOM元素
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const scaleCategorySelect = document.getElementById('scaleCategorySelect');
    const rootNoteSelect = document.getElementById('rootNoteSelect');
    const scaleTypeSelect = document.getElementById('scaleTypeSelect');
    const folkRootNoteSelect = document.getElementById('folkRootNoteSelect');
    const folkScaleTypeSelect = document.getElementById('folkScaleTypeSelect');
    const folkModeSelect = document.getElementById('folkModeSelect');
    const westernScaleSelector = document.getElementById('westernScaleSelector');
    const folkScaleSelector = document.getElementById('folkScaleSelector');
    const generateScaleBtn = document.getElementById('generateScaleBtn');
    const scaleInput = document.getElementById('scaleInput');
    const scaleSearchBtn = document.getElementById('scaleSearchBtn');
    const scaleNotesInput = document.getElementById('scaleNotesInput');
    const analyzeScaleBtn = document.getElementById('analyzeScaleBtn');
    const noteButtons = document.querySelectorAll('.note-btn');
    const resultsContainer = document.getElementById('resultsContainer');
    // 获取五度圈相关DOM元素
    const circleDiagram = document.querySelector('.circle-of-fifths-diagram');

    // 标签页切换
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新内容显示
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });

            // 如果切换到五度圈，则初始化
            if (tabId === 'circle-of-fifths') {
                initializeCircleOfFifths();
            }
        });
    });
    
    // 调式类别切换
    function handleScaleCategoryChange() {
        const category = scaleCategorySelect.value;
        
        if (category === 'western') {
            westernScaleSelector.classList.add('active');
            folkScaleSelector.classList.remove('active');
        } else {
            westernScaleSelector.classList.remove('active');
            folkScaleSelector.classList.add('active');
        }
    }
    
    // 快速搜索：生成音阶
    function generateScale() {
        const category = scaleCategorySelect.value;
        let result;
        
        setLoadingState(generateScaleBtn, true);
        
        setTimeout(() => {
            if (category === 'western') {
                // 西洋/中古调式
                const rootNote = rootNoteSelect.value;
                const scaleType = scaleTypeSelect.value;
                result = scaleGenerator.generateScale(rootNote, scaleType);
            } else {
                // 民族调式
                const rootNote = folkRootNoteSelect.value;
                const scaleType = folkScaleTypeSelect.value;
                const mode = folkModeSelect.value;
                
                // 构建民族调式的标识符
                let scaleIdentifier;
                switch(scaleType) {
                    case 'pentatonic':
                        scaleIdentifier = `pentatonic_${mode}`;
                        break;
                    case 'hexatonic_qingjiao':
                        scaleIdentifier = `hexatonic_qingjiao_${mode}`;
                        break;
                    case 'hexatonic_biangong':
                        scaleIdentifier = `hexatonic_biangong_${mode}`;
                        break;
                    case 'qingle':
                        scaleIdentifier = `qingle_${mode}`;
                        break;
                    case 'yayue':
                        scaleIdentifier = `yayue_${mode}`;
                        break;
                    case 'yanyue':
                        scaleIdentifier = `yanyue_${mode}`;
                        break;
                    default:
                        scaleIdentifier = `pentatonic_${mode}`;
                }
                
                result = scaleGenerator.generateScale(rootNote, scaleIdentifier);
            }
            
            displayResult(result, 'quick');
            setLoadingState(generateScaleBtn, false);
        }, 300);
    }
    
    // 输入搜索：解析音阶名称
    function searchScaleByName() {
        const query = scaleInput.value.trim();
        if (!query) {
            showNotification('请输入音阶名称', 'warning');
            return;
        }
        
        setLoadingState(scaleSearchBtn, true);
        
        setTimeout(() => {
            const result = scaleGenerator.parseAndGenerate(query);
            displayResult(result, 'input');
            setLoadingState(scaleSearchBtn, false);
        }, 500);
    }
    
    // 音符分析：分析音阶类型
    function analyzeScaleFromNotes() {
        const query = scaleNotesInput.value.trim();
        if (!query) {
            showNotification('请输入音符序列', 'warning');
            return;
        }
        
        setLoadingState(analyzeScaleBtn, true);
        
        setTimeout(() => {
            const result = scaleGenerator.analyzeScaleFromNotes(query);
            displayResult(result, 'analysis');
            setLoadingState(analyzeScaleBtn, false);
        }, 500);
    }
    
    // 五度圈检索
    function generateScaleFromCircle(rootNote, scaleType, element) {
        // 移除所有激活状态
        document.querySelectorAll('.circle-note').forEach(btn => btn.classList.remove('active'));
        // 添加当前点击的激活状态
        if (element) {
            element.classList.add('active');
        }

        const result = scaleGenerator.generateScale(rootNote, scaleType);
        displayResult(result, 'circle');
    }

    // 初始化五度圈
    function initializeCircleOfFifths() {
        const circleOrder = [
            { major: 'C', minor: 'A' },
            { major: 'G', minor: 'E' },
            { major: 'D', minor: 'B' },
            { major: 'A', minor: 'F#' },
            { major: 'E', minor: 'C#' },
            { major: 'B', minor: 'G#' },
            { major: 'F#', minor: 'D#' },
            { major: 'C#', minor: 'A#' },
            { major: 'Ab', minor: 'F' },
            { major: 'Eb', minor: 'C' },
            { major: 'Bb', minor: 'G' },
            { major: 'F', minor: 'D' }
        ];

        const diagramSize = 350; // .circle-of-fifths-diagram 的宽度/高度
        const centerOffset = diagramSize / 2; // 圆心偏移量
        const radiusOuter = 130; // 外圈音符半径
        const radiusInner = 80;  // 内圈音符半径

        circleDiagram.innerHTML = ''; // 清空现有内容

        // 添加中心点
        const centerPoint = document.createElement('div');
        centerPoint.className = 'circle-center-point';
        centerPoint.textContent = '五度圈';
        circleDiagram.appendChild(centerPoint);

        circleOrder.forEach((keyPair, index) => {
            const angle = (index / 12) * 2 * Math.PI - Math.PI / 2; // 从顶部开始，顺时针

            // 创建外圈大调音符
            const outerKeyNote = document.createElement('div');
            outerKeyNote.className = 'key-note outer';
            outerKeyNote.innerHTML = `<div class="note-main">${keyPair.major}</div><div class="note-minor">大调</div>`;
            outerKeyNote.setAttribute('data-note', keyPair.major);
            outerKeyNote.setAttribute('data-scale-type', 'major');
            
            const xOuter = centerOffset + radiusOuter * Math.cos(angle);
            const yOuter = centerOffset + radiusOuter * Math.sin(angle);
            outerKeyNote.style.left = `${xOuter}px`;
            outerKeyNote.style.top = `${yOuter}px`;
            outerKeyNote.addEventListener('click', (e) => {
                generateScaleFromCircle(keyPair.major, 'major', e.currentTarget);
            });
            circleDiagram.appendChild(outerKeyNote);

            // 创建内圈小调音符
            const innerKeyNote = document.createElement('div');
            innerKeyNote.className = 'key-note inner';
            innerKeyNote.innerHTML = `<div class="note-main">${keyPair.minor}</div><div class="note-minor">小调</div>`;
            innerKeyNote.setAttribute('data-note', keyPair.minor);
            innerKeyNote.setAttribute('data-scale-type', 'naturalMinor');
            
            const xInner = centerOffset + radiusInner * Math.cos(angle);
            const yInner = centerOffset + radiusInner * Math.sin(angle);
            innerKeyNote.style.left = `${xInner}px`;
            innerKeyNote.style.top = `${yInner}px`;
            innerKeyNote.addEventListener('click', (e) => {
                generateScaleFromCircle(keyPair.minor, 'naturalMinor', e.currentTarget);
            });
            circleDiagram.appendChild(innerKeyNote);

            // 添加连接线
            if (index < circleOrder.length) { // 避免在最后一个音符后添加线
                const line = document.createElement('div');
                line.className = 'circle-line';
                
                // 计算线的起始点和结束点
                // 从外圈音符的中心到下一个外圈音符的中心
                const nextIndex = (index + 1) % circleOrder.length;
                const nextAngle = (nextIndex / 12) * 2 * Math.PI - Math.PI / 2;

                const x1 = centerOffset + radiusOuter * Math.cos(angle);
                const y1 = centerOffset + radiusOuter * Math.sin(angle);
                const x2 = centerOffset + radiusOuter * Math.cos(nextAngle);
                const y2 = centerOffset + radiusOuter * Math.sin(nextAngle);

                const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                const lineAngle = Math.atan2(y2 - y1, x2 - x1);

                line.style.width = `${length}px`;
                line.style.left = `${x1}px`;
                line.style.top = `${y1}px`;
                line.style.transform = `rotate(${lineAngle}rad)`;
                line.style.transformOrigin = '0 0'; // 设置旋转中心为线的起点
                circleDiagram.appendChild(line);
            }
        });
    }
    
    // 显示结果函数
    function displayResult(result, searchType) {
        // 清空结果容器
        resultsContainer.innerHTML = '';
        
        // 创建结果卡片
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        
        if (result.error) {
            resultCard.innerHTML = `
                <div class="result-header">
                    <div class="result-icon">❌</div>
                    <div>
                        <h3 class="result-title">搜索失败</h3>
                    </div>
                </div>
                <div class="result-content">
                    <p>${result.error}</p>
                    ${result.suggestion ? `<p class="suggestion">${result.suggestion}</p>` : ''}
                </div>
            `;
        } else if (searchType === 'analysis' && result.possibleScales) {
            // 音阶分析结果显示
            displayScaleAnalysis(result, resultCard);
        } else {
            // 单个音阶结果显示
            displaySingleScale(result, resultCard, searchType);
        }
        
        resultsContainer.appendChild(resultCard);
        
        // 滚动到结果区域
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 显示单个音阶结果
// 增加民族调式的特殊显示
function displaySingleScale(result, resultCard, searchType) {
    const description = scaleGenerator.generateScaleDescription(result);
    const lines = description.split('\n');

    // 音级名称定义
    const westernDegrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    // 为民族调式创建一个更详细的映射
    const folkDegreeMap = {
        'pentatonic_gong': ['宫', '商', '角', '徵', '羽'],
        'hexatonic_qingjiao_gong': ['宫', '商', '角', '清角', '徵', '羽'],
        'hexatonic_biangong_gong': ['宫', '商', '角', '徵', '羽', '变宫'],
        'qingle_gong': ['宫', '商', '角', '清角', '徵', '羽', '变宫'],
        'yayue_gong': ['宫', '商', '角', '变徵', '徵', '羽', '变宫'],
        'yanyue_gong': ['宫', '商', '角', '清角', '徵', '羽', '闰']
    };
    const folkBianyinNames = ['清角', '变宫', '变徵', '闰'];


    let htmlContent = `
        <div class="result-header">
            <div class="result-icon">${result.isFolkScale ? '🎎' : '🎵'}</div>
            <div>
                <h3 class="result-title">${result.name}</h3>
            </div>
        </div>
        <div class="result-content">
            <div class="scale-notes">
    `;

    // 添加音符和音级显示
    result.notes.forEach((note, index) => {
        let degree = '';
        let isBianyin = false;

        if (result.isFolkScale) {
            // 民族调式音名
            const gongNote = result.gongNote || result.root;
            const gongScaleType = scaleGenerator.getGongScaleType(result.type);
            const gongScale = scaleGenerator.generateFolkScaleDirect(gongNote, gongScaleType);
            
            if (!gongScale.error) {
                const noteIndexInGong = gongScale.notes.indexOf(note);
                const degreeNames = folkDegreeMap[gongScaleType];
                
                if (degreeNames && noteIndexInGong !== -1 && degreeNames[noteIndexInGong]) {
                    degree = degreeNames[noteIndexInGong];
                    if (folkBianyinNames.includes(degree)) {
                        isBianyin = true;
                    }
                }
            }
        } else {
            // 西洋调式音级
            degree = westernDegrees[index];
        }

        // 格式化音符显示
        const formattedNote = note
            .replace('#', '♯')
            .replace('b', '♭')
            .replace('×', '♯♯')
            .replace('bb', '♭♭');

        htmlContent += `
            <div class="note-item ${isBianyin ? 'bianyin' : ''}">
                <div class="note-name">${formattedNote}</div>
                <div class="note-degree">${degree}</div>
            </div>
        `;
    });

    htmlContent += `
            </div>
            <div class="scale-info">
    `;
    
    // 添加其他信息
    lines.forEach(line => {
        if (line.startsWith('🎼')) {
            htmlContent += `<div class="info-item"><span class="info-label">音阶音符:</span> ${line.replace('🎼 音阶音符: ', '')}</div>`;
        } else if (line.startsWith('📐')) {
            htmlContent += `<div class="info-item"><span class="info-label">音阶结构:</span> ${line.replace('📐 音阶结构: ', '')}</div>`;
        } else if (line.startsWith('🎹') && line.includes('调号')) {
            htmlContent += `<div class="info-item"><span class="info-label">调号:</span> ${line.replace('🎹 调号: ', '')}</div>`;
        } else if (line.startsWith('🎹') && line.includes('偏音信息')) {
            htmlContent += `<div class="info-item"><span class="info-label">偏音信息:</span> ${line.replace('🎹 偏音信息: ', '')}</div>`;
        } else if (line.startsWith('🎶')) {
            htmlContent += `<div class="info-item"><span class="info-label">调式类型:</span> ${line.replace('🎶 调式类型: ', '')}</div>`;
        } else if (line.startsWith('💡')) {
            htmlContent += `<div class="info-item"><span class="info-label">音阶特点:</span> ${line.replace('💡 音阶特点: ', '')}</div>`;
        }
    });
    
    // 如果是快速搜索，显示等音调式（仅西洋调式）
    if (searchType === 'quick' && !result.isFolkScale && scaleGenerator.hasEnharmonicEquivalent(result.root)) {
        const equivalents = scaleGenerator.getEnharmonicEquivalents(result.root);
        htmlContent += `<div class="info-item"><span class="info-label">等音调式:</span> ${equivalents.join(', ')}</div>`;
    }
    
    htmlContent += `
            </div>
        </div>
    `;
    
    resultCard.innerHTML = htmlContent;
}    
// 显示音阶分析结果 - 改进版本
    function displayScaleAnalysis(analysis, resultCard) {
        let htmlContent = `
            <div class="result-header">
                <div class="result-icon">🔍</div>
                <div>
                    <h3 class="result-title">音阶分析结果</h3>
                    <div class="analysis-subtitle">输入音符: ${analysis.inputNotes.join(' ')}</div>
                </div>
            </div>
            <div class="result-content">
                <div class="analysis-info">
                    <div class="info-item">
                        <span class="info-label">分析说明:</span> 
                        系统以第一个音符 <strong>${analysis.inputNotes[0]}</strong> 作为主音进行分析
                    </div>
                </div>
                <div class="analysis-results">
                    <div class="analysis-title">可能的音阶类型:</div>
        `;
        
        analysis.possibleScales.forEach((scale, index) => {
            const matchPercent = Math.round(scale.matchScore * 100);
            const isPrimary = index === 0 && scale.matchScore > 0.7;
            
            htmlContent += `
                <div class="chord-result ${isPrimary ? 'primary-result' : ''}">
                    <div class="chord-header">
                        <h4>${scale.name}</h4>
                        <div class="match-info">
                            <span class="match-score">匹配度: ${matchPercent}%</span>
                            ${scale.isComplete ? '<span class="complete-badge">完整音阶</span>' : ''}
                            ${scale.isFolkScale ? '<span class="folk-badge">民族调式</span>' : ''}
                        </div>
                    </div>
                    <div class="chord-notes-small">
            `;
            
            // 高亮显示匹配的音符
            scale.notes.forEach((note, noteIndex) => {
                const isFirstNote = noteIndex === 0;
                const isMatched = analysis.inputNotes.includes(note);
                const noteClass = isFirstNote ? 'first-note' : (isMatched ? 'matched-note' : 'unmatched-note');
                
                htmlContent += `<span class="note-item-small ${noteClass}">${note}</span>`;
            });
            
            htmlContent += `
                    </div>
                    <div class="chord-formula">${scale.description}</div>
                    ${scale.isFolkScale && scale.bianyin ? `<div class="bianyin-info">${scale.bianyin}</div>` : ''}
                </div>
            `;
        });
        
        htmlContent += `</div></div>`;
        resultCard.innerHTML = htmlContent;
    }
    
    
    
    // 设置加载状态
    function setLoadingState(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.loading-spinner');
        
        if (isLoading) {
            btnText.style.display = 'none';
            spinner.style.display = 'block';
            button.disabled = true;
        } else {
            btnText.style.display = 'block';
            spinner.style.display = 'none';
            button.disabled = false;
        }
    }
    
    // 显示通知
    function showNotification(message, type = 'info') {
        alert(message);
    }
    
    // 音符按钮点击事件
    noteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const note = button.getAttribute('data-note');
            const currentValue = scaleNotesInput.value;
            
            if (note === ' ') {
                scaleNotesInput.value = currentValue + ' ';
            } else {
                scaleNotesInput.value = currentValue + note;
            }
            
            scaleNotesInput.focus();
        });
    });
    
    // 事件监听器
    scaleCategorySelect.addEventListener('change', handleScaleCategoryChange);
    generateScaleBtn.addEventListener('click', generateScale);
    scaleSearchBtn.addEventListener('click', searchScaleByName);
    analyzeScaleBtn.addEventListener('click', analyzeScaleFromNotes);

    // 初始加载时检查是否在五度圈页面，如果是则初始化
    // 延迟初始化，确保DOM完全渲染
    // 无论是否在五度圈页面，都尝试初始化，确保内容生成
    setTimeout(initializeCircleOfFifths, 0);
    
    scaleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchScaleByName();
        }
    });
    
    scaleNotesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeScaleFromNotes();
        }
    });
    
    // 初始欢迎信息
    console.log('音阶查找工具已加载 - 增加调式类别切换功能');
});
