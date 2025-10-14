// theoryApp.js - 乐理知识查询应用程序逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏功能
    const navbar = document.querySelector('.navbar');
    const navList = document.querySelector('.nav-list');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-list a');
    
    // 设置当前页面激活状态
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // 导航栏切换功能
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
    const searchInput = document.getElementById('theorySearchInput');
    const searchBtn = document.getElementById('theorySearchBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const exampleItems = document.querySelectorAll('.example-item');
    
    // 搜索函数
    function performSearch(query) {
        if (!query.trim()) {
            showNotification('请输入搜索内容', 'warning');
            return;
        }
        
        // 显示加载状态
        setLoadingState(true);
        
        // 模拟搜索延迟
        setTimeout(() => {
            const result = theoryDatabase.searchTheory(query);
            displayResult(result, query);
            setLoadingState(false);
        }, 500);
    }
    
    // 显示结果
    function displayResult(result, query) {
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
                    <p>请尝试以下搜索：</p>
                    <ul>
                        <li>调号相关：C大调调号、G大调调号、F大调调号</li>
                        <li>节奏相关：4/4拍含义、3/4拍含义、节奏类型</li>
                        <li>术语相关：力度术语、速度术语、表情术语</li>
                        <li>调式相关：多利亚调式、关系大小调、五声音阶</li>
                        <li>泛音列：C泛音列、G泛音列、泛音列应用</li>
                    </ul>
                </div>
            `;
        } else {
            const categoryNames = theoryDatabase.getCategories();
            
            let htmlContent = `
                <div class="result-header">
                    <div class="result-icon">🎼</div>
                    <div>
                        <h3 class="result-title">${result.data.title}</h3>
                        <div class="info-label">分类: ${categoryNames[result.category]}</div>
                    </div>
                </div>
                <div class="result-content">
                    <div class="theory-info">
                        <div class="info-item">
                            <span class="info-label">内容说明:</span>
                            <p>${result.data.content}</p>
                        </div>
            `;
            
            // 特殊处理泛音列计算结果
            if (result.category === 'harmonics' && result.data.harmonics) {
                htmlContent += this.renderHarmonicSeries(result.data);
            } else {
                // 常规结果显示
                if (result.data.structure) {
                    htmlContent += `
                        <div class="info-item">
                            <span class="info-label">结构:</span>
                            <p>${result.data.structure}</p>
                        </div>
                    `;
                }
                
                if (result.data.formula) {
                    htmlContent += `
                        <div class="info-item">
                            <span class="info-label">公式:</span>
                            <p>${result.data.formula}</p>
                        </div>
                    `;
                }
                
                if (result.data.examples) {
                    htmlContent += `
                        <div class="info-item">
                            <span class="info-label">示例:</span>
                            <div class="examples-box">
                                <pre>${result.data.examples}</pre>
                            </div>
                        </div>
                    `;
                }
            }
            
            // 如果是模糊搜索，显示其他相关结果
            if (result.matchType === 'fuzzy' && result.allResults && result.allResults.length > 1) {
                htmlContent += `
                    <div class="related-results">
                        <div class="analysis-title">🔍 相关搜索结果</div>
                `;
                
                result.allResults.forEach((related, index) => {
                    if (index > 0) {
                        htmlContent += `
                            <div class="chord-result">
                                <div class="chord-header">
                                    <h4>${related.data.title}</h4>
                                </div>
                                <div class="chord-formula">${categoryNames[related.category]}</div>
                            </div>
                        `;
                    }
                });
                
                htmlContent += `</div>`;
            }
            
            htmlContent += `</div></div>`;
            resultCard.innerHTML = htmlContent;
        }
        
        resultsContainer.appendChild(resultCard);
        
        // 滚动到结果区域
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 渲染泛音列表格
    function renderHarmonicSeries(data) {
        let html = `
            <div class="info-item">
                <span class="info-label">基音:</span>
                <p>${data.baseNote} (${data.baseFrequency}Hz)</p>
            </div>
            <div class="info-item">
                <span class="info-label">泛音列表:</span>
                <div class="harmonics-table">
                    <table>
                        <thead>
                            <tr>
                                <th>泛音</th>
                                <th>频率(Hz)</th>
                                <th>音高</th>
                                <th>音程</th>
                                <th>音分差</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        data.harmonics.forEach(harmonic => {
            const noteDisplay = `${harmonic.note}${harmonic.octave}`;
            const centsDisplay = harmonic.cents !== 0 ? 
                (harmonic.cents > 0 ? `+${harmonic.cents}` : harmonic.cents) : '0';
            
            html += `
                <tr>
                    <td>${harmonic.harmonic}</td>
                    <td>${harmonic.frequency}</td>
                    <td>${noteDisplay}</td>
                    <td>${harmonic.interval}</td>
                    <td>${centsDisplay}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        return html;
    }
    
    // 显示分类内容
    function showCategory(category) {
        const categoryData = theoryDatabase.getCategoryData(category);
        const categoryNames = theoryDatabase.getCategories();
        
        // 清空结果容器
        resultsContainer.innerHTML = '';
        
        const categoryCard = document.createElement('div');
        categoryCard.className = 'result-card';
        
        let htmlContent = `
            <div class="result-header">
                <div class="result-icon">📚</div>
                <div>
                    <h3 class="result-title">${categoryNames[category]}知识</h3>
                </div>
            </div>
            <div class="result-content">
                <div class="category-items">
        `;
        
        for (const key in categoryData) {
            const item = categoryData[key];
            htmlContent += `
                <div class="category-item" data-query="${key}">
                    <h4>${item.title}</h4>
                    <p>${item.content.substring(0, 100)}...</p>
                </div>
            `;
        }
        
        htmlContent += `</div></div>`;
        categoryCard.innerHTML = htmlContent;
        resultsContainer.appendChild(categoryCard);
        
        // 为分类项目添加点击事件
        const categoryItems = categoryCard.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const query = item.getAttribute('data-query');
                searchInput.value = query;
                performSearch(query);
            });
        });
    }
    
    // 设置加载状态
    function setLoadingState(isLoading) {
        const btnText = searchBtn.querySelector('.btn-text');
        const spinner = searchBtn.querySelector('.loading-spinner');
        
        if (isLoading) {
            btnText.style.display = 'none';
            spinner.style.display = 'block';
            searchBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            spinner.style.display = 'none';
            searchBtn.disabled = false;
        }
    }
    
    // 显示通知
    function showNotification(message, type = 'info') {
        alert(message);
    }
    
    // 事件监听器
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // 分类按钮点击事件
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            showCategory(category);
        });
    });
    
    // 示例项目点击事件
    exampleItems.forEach(item => {
        item.addEventListener('click', () => {
            const query = item.getAttribute('data-query');
            searchInput.value = query;
            performSearch(query);
        });
    });
    
    // 初始欢迎信息
    console.log('乐理知识查询工具已加载');
});
