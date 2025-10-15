// 主页应用程序逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏激活状态处理 - 使用精确匹配逻辑
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // 精确匹配逻辑，处理各种路径情况
        if (linkPage === currentPage || 
            (currentPage === 'index.html' && (linkPage === '../index.html' || linkPage === 'index.html')) ||
            (currentPage === '' && linkPage === '../index.html') ||
            (linkPage.endsWith(currentPage) && currentPage !== 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 隐藏式导航栏切换功能
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('nav-active');
            
            // 汉堡菜单动画 - 与其他页面保持一致
            const hamburgerLines = this.querySelectorAll('.hamburger-line');
            hamburgerLines.forEach(line => {
                line.classList.toggle('active');
            });
        });
        
        // 点击导航链接后关闭菜单（移动设备）
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
    
    console.log('乐理知识库主页已加载');
});
