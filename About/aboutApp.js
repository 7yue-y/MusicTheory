// 关于页面应用程序逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏激活状态处理
    const currentPage = window.location.pathname.split('/').pop() || 'about.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // 更精确的匹配逻辑
        if (linkPage === currentPage || 
            (currentPage === 'about.html' && linkPage.endsWith('about.html')) ||
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

    // 页面加载完成后的初始化操作
    console.log('关于页面已加载');
    
    // 可以在这里添加其他关于页面的特定功能
    // 例如：版本信息动态更新、联系表单处理等
    
    // 示例：动态显示当前年份（用于版权信息）
    const currentYear = new Date().getFullYear();
    const footer = document.querySelector('.footer p');
    if (footer) {
        footer.innerHTML = `&copy; ${currentYear} 艺考乐理知识库 | 关于页面`;
    }
});
