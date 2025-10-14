// 重构版和弦页面应用程序逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏激活状态处理
    const currentPage = window.location.pathname.split('/').pop() || 'chord.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === 'chord.html' && linkPage === 'chord.html')) {
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
    const chordNameInput = document.getElementById('chordNameInput');
    const chordNameSearchBtn = document.getElementById('chordNameSearchBtn');
    const chordNotesInput = document.getElementById('chordNotesInput');
    const chordNotesSearchBtn = document.getElementById('chordNotesSearchBtn');
    const noteButtons = document.querySelectorAll('.note-btn');
    const resultsContainer = document.getElementById('resultsContainer');
    
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
    
    // 按名称搜索和弦
    function searchChordByName() {
        const query = chordNameInput.value.trim();
        if (!query) {
            showNotification('请输入和弦名称', 'warning');
            return;
        }
        
        setLoadingState(chordNameSearchBtn, true);
        
        setTimeout(() => {
            const result = chordGenerator.generateChordByName(query);
            displayResult(result, query, 'name');
            setLoadingState(chordNameSearchBtn, false);
        }, 500);
    }
    
    // 按音符分析和弦
    function analyzeChordFromNotes() {
        const query = chordNotesInput.value.trim();
        if (!query) {
            showNotification('请输入音符序列', 'warning');
            return;
        }
        
        setLoadingState(chordNotesSearchBtn, true);
        
        setTimeout(() => {
            const result = chordGenerator.analyzeChordFromNotes(query);
            displayResult(result, query, 'notes');
            setLoadingState(chordNotesSearchBtn, false);
        }, 500);
    }
    
    // 显示结果
    function displayResult(result, query, type) {
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
                    <p>请尝试以下格式：</p>
                    <ul>
                        <li>C大三和弦 或 Cmaj</li>
                        <li>Am小三和弦 或 Am</li>
                        <li>G7属七和弦 或 G7</li>
                        <li>C E G (分析音符序列)</li>
                    </ul>
                </div>
            `;
        } else {
            let description, title;
            
            if (type === 'name') {
                description = chordGenerator.generateChordDescription(result);
                title = result.name;
            } else {
                description = chordGenerator.generateNotesAnalysisDescription(result);
                title = '和弦分析结果';
            }
            
            const lines = description.split('\n');
            
            let htmlContent = `
                <div class="result-header">
                    <div class="result-icon">🎶</div>
                    <div>
                        <h3 class="result-title">${title}</h3>
                    </div>
                </div>
                <div class="result-content">
            `;
            
            if (type === 'name') {
                // 单个和弦显示
                htmlContent += `
                    <div class="chord-notes">
                `;
                
                // 添加音符显示
                result.notes.forEach(note => {
                    htmlContent += `<div class="note-item">${note}</div>`;
                });
                
                htmlContent += `
                    </div>
                    <div class="chord-info">
                `;
                
                // 添加其他信息
                lines.forEach(line => {
                    if (line.startsWith('🎼')) {
                        htmlContent += `<div class="info-item"><span class="info-label">和弦音符:</span> ${line.replace('🎼 和弦音符: ', '')}</div>`;
                    } else if (line.startsWith('🇨🇳')) {
                        htmlContent += `<div class="info-item"><span class="info-label">中文名称:</span> ${line.replace('🇨🇳 中文名称: ', '')}</div>`;
                    } else if (line.startsWith('🔤')) {
                        htmlContent += `<div class="info-item"><span class="info-label">英文名称:</span> ${line.replace('🔤 英文名称: ', '')}</div>`;
                    } else if (line.startsWith('🎹')) {
                        htmlContent += `<div class="info-item"><span class="info-label">符号表示:</span> ${line.replace('🎹 符号表示: ', '')}</div>`;
                    } else if (line.startsWith('💡')) {
                        htmlContent += `<div class="info-item"><span class="info-label">和弦性质:</span> ${line.replace('💡 和弦性质: ', '')}</div>`;
                    } else if (line.startsWith('🎵')) {
                        htmlContent += `<div class="info-item"><span class="info-label">常见用途:</span> ${line.replace('🎵 常见用途: ', '')}</div>`;
                    }
                });
                
                htmlContent += `</div>`;
            } else {
                // 多和弦分析结果显示
                htmlContent += `<div class="analysis-results">`;
                
                lines.forEach(line => {
                    if (line.startsWith('🎵')) {
                        htmlContent += `<div class="info-item"><span class="info-label">输入音符:</span> ${line.replace('🎵 输入音符: ', '')}</div>`;
                    } else if (line.startsWith('🔍')) {
                        htmlContent += `<div class="analysis-title">${line}</div>`;
                    } else if (line.trim() && !line.startsWith('\n')) {
                        if (line.match(/^\d+\./)) {
                            // 和弦项目
                            const chordMatch = line.match(/^\d+\.\s+(.+)\s+\(匹配度:\s+(\d+)%\)/);
                            if (chordMatch) {
                                htmlContent += `
                                    <div class="chord-result">
                                        <div class="chord-header">
                                            <h4>${chordMatch[1]}</h4>
                                            <span class="match-score">匹配度: ${chordMatch[2]}%</span>
                                        </div>
                                `;
                            } else {
                                htmlContent += `<div class="chord-result"><div class="chord-name">${line}</div>`;
                            }
                        } else if (line.includes('音符:')) {
                            htmlContent += `<div class="chord-notes-small">`;
                            const notes = line.replace('   音符: ', '').split(' - ');
                            notes.forEach(note => {
                                htmlContent += `<span class="note-item-small">${note}</span>`;
                            });
                            htmlContent += `</div>`;
                        } else if (line.includes('中文:')) {
                            htmlContent += `<div class="chord-name-info">中文: ${line.replace('   中文: ', '')}</div>`;
                        } else if (line.includes('英文:')) {
                            htmlContent += `<div class="chord-name-info">英文: ${line.replace('   英文: ', '')}</div>`;
                        } else if (line.includes('符号:')) {
                            htmlContent += `<div class="chord-name-info">符号: ${line.replace('   符号: ', '')}</div>`;
                            htmlContent += `</div>`; // 结束chord-result
                        } else {
                            htmlContent += `<div>${line}</div>`;
                        }
                    }
                });
                
                htmlContent += `</div>`;
            }
            
            htmlContent += `</div>`;
            resultCard.innerHTML = htmlContent;
        }
        
        resultsContainer.appendChild(resultCard);
        
        // 滚动到结果区域
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        // 在实际应用中，这里可以实现一个toast通知系统
        alert(message);
    }
    
    // 音符按钮点击事件
    noteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const note = button.getAttribute('data-note');
            const currentValue = chordNotesInput.value;
            
            if (note === ' ') {
                chordNotesInput.value = currentValue + ' ';
            } else {
                chordNotesInput.value = currentValue + note;
            }
            
            chordNotesInput.focus();
        });
    });
    
    // 事件监听器
    chordNameSearchBtn.addEventListener('click', searchChordByName);
    chordNotesSearchBtn.addEventListener('click', analyzeChordFromNotes);
    
    chordNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchChordByName();
        }
    });
    
    chordNotesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeChordFromNotes();
        }
    });
    
    // 初始欢迎信息
    console.log('和弦查找工具已加载');
});
