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
    const rootNoteSelect = document.getElementById('rootNoteSelect');
    const scaleTypeSelect = document.getElementById('scaleTypeSelect');
    const generateScaleBtn = document.getElementById('generateScaleBtn');
    const scaleInput = document.getElementById('scaleInput');
    const scaleSearchBtn = document.getElementById('scaleSearchBtn');
    const scaleNotesInput = document.getElementById('scaleNotesInput');
    const analyzeScaleBtn = document.getElementById('analyzeScaleBtn');
    const noteButtons = document.querySelectorAll('.note-btn');
    const resultsContainer = document.getElementById('resultsContainer');
    const circleNotes = document.querySelectorAll('.circle-note');
    const circleScaleType = document.getElementById('circleScaleType');
    
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
        });
    });
    
    // 快速搜索：生成音阶
    function generateScale() {
        const rootNote = rootNoteSelect.value;
        const scaleType = scaleTypeSelect.value;
        
        setLoadingState(generateScaleBtn, true);
        
        setTimeout(() => {
            const result = scaleGenerator.generateScale(rootNote, scaleType);
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
    function generateScaleFromCircle(note, scaleType) {
        const result = scaleGenerator.generateScale(note, scaleType);
        displayResult(result, 'circle');
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
    
    // 添加音符显示
    result.notes.forEach(note => {
        htmlContent += `<div class="note-item">${note}</div>`;
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
    
    // 五度圈音符点击事件
    circleNotes.forEach(note => {
        note.addEventListener('click', () => {
            const noteValue = note.getAttribute('data-note');
            const scaleType = circleScaleType.value === 'major' ? 'major' : 'naturalMinor';
            generateScaleFromCircle(noteValue, scaleType);
        });
    });
    
    // 事件监听器
    generateScaleBtn.addEventListener('click', generateScale);
    scaleSearchBtn.addEventListener('click', searchScaleByName);
    analyzeScaleBtn.addEventListener('click', analyzeScaleFromNotes);
    
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
    console.log('音阶查找工具已加载 - 增加五度圈和调式验证');
});
