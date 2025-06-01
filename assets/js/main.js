// 检测是否为触屏设备
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

// 只在非触屏设备上启用自定义光标
if (!isTouchDevice()) {
    // 修改光标动画
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // 使用 requestAnimationFrame 实现平滑跟随
    function updateCursor() {
        // 计算目标位置和当前位置的差值
        const dx = mouseX - outlineX;
        const dy = mouseY - outlineY;
        
        // 使用缓动效果，但保持较小的延迟
        outlineX += dx * 0.3;
        outlineY += dy * 0.3;
        
        // 更新圆圈位置
        cursorOutline.style.left = (outlineX - 15) + 'px';
        cursorOutline.style.top = (outlineY - 15) + 'px';
        
        requestAnimationFrame(updateCursor);
    }

    // 更新鼠标位置
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 启动动画循环
    updateCursor();

    // 光标悬停效果
    document.querySelectorAll('a, button, .scroll-indicator').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
            cursorOutline.style.borderColor = 'rgba(102, 126, 234, 1)';
            cursorOutline.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.6), inset 0 0 20px rgba(102, 126, 234, 0.4)';
            cursorOutline.style.mixBlendMode = 'normal';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '30px';
            cursorOutline.style.height = '30px';
            cursorOutline.style.borderColor = 'rgba(102, 126, 234, 0.8)';
            cursorOutline.style.boxShadow = '0 0 15px rgba(102, 126, 234, 0.4), inset 0 0 15px rgba(102, 126, 234, 0.3)';
            cursorOutline.style.mixBlendMode = 'difference';
        });
    });
} else {
    // 在触屏设备上隐藏自定义光标
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorOutline) {
        cursorOutline.style.display = 'none';
    }
}

// 3D背景动画
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
    });
    
    // 连接粒子
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// 平滑滚动
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.querySelectorAll('a').forEach(a => {
            a.style.color = '#333';
        });
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.querySelectorAll('a').forEach(a => {
            a.style.color = 'white';
        });
    }
});

// 打字机效果光标闪烁
setInterval(() => {
    const title = document.querySelector('.hero-title');
    if (title.style.borderRightColor === 'transparent') {
        title.style.borderRightColor = 'white';
    } else {
        title.style.borderRightColor = 'transparent';
    }
}, 500);

// 移动端菜单切换
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');
const body = document.body;

function toggleMenu() {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

menuToggle.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', toggleMenu);

// 点击导航链接时关闭菜单
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
    });
});

// 修复链接的 noopener 问题
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener');
}); 