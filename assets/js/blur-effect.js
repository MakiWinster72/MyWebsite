// 添加内联样式
const style = document.createElement('style');
style.textContent = `
/* 滑动模糊效果 */
.blur-reveal {
    opacity: 0;
    filter: blur(10px);
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity, filter, transform;
}

.blur-reveal.active {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
}

/* 不同方向的模糊效果 */
.blur-reveal-left {
    opacity: 0;
    filter: blur(10px);
    transform: translateX(-30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity, filter, transform;
}

.blur-reveal-right {
    opacity: 0;
    filter: blur(10px);
    transform: translateX(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity, filter, transform;
}

.blur-reveal-left.active,
.blur-reveal-right.active {
    opacity: 1;
    filter: blur(0);
    transform: translateX(0);
}

/* 缩放模糊效果 */
.blur-reveal-scale {
    opacity: 0;
    filter: blur(10px);
    transform: scale(0.95);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity, filter, transform;
}

.blur-reveal-scale.active {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
}

/* 延迟动画 */
.blur-delay-100 { transition-delay: 100ms; }
.blur-delay-200 { transition-delay: 200ms; }
.blur-delay-300 { transition-delay: 300ms; }
.blur-delay-400 { transition-delay: 400ms; }
.blur-delay-500 { transition-delay: 500ms; }
`;
document.head.appendChild(style);

console.log('模糊效果样式已添加');

// 初始化模糊效果
function initBlurEffects() {
    console.log('开始初始化模糊效果');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('元素进入视口:', entry.target);
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // 修改选择器以匹配更多元素
    const sections = document.querySelectorAll('div, section, article, .card, .container > *, .container > * > *, [class*="section"], [class*="card"], [class*="container"]');
    console.log('找到元素数量:', sections.length);

    sections.forEach((section, index) => {
        // 跳过一些不需要动画的元素
        if (section.closest('header') || section.closest('footer') || section.closest('nav')) {
            return;
        }

        // 确保元素有内容
        if (section.children.length === 0 && !section.textContent.trim()) {
            return;
        }

        // 根据索引选择不同的动画效果
        if (index % 4 === 0) {
            section.classList.add('blur-reveal');
        } else if (index % 4 === 1) {
            section.classList.add('blur-reveal-left');
        } else if (index % 4 === 2) {
            section.classList.add('blur-reveal-right');
        } else {
            section.classList.add('blur-reveal-scale');
        }
        
        // 添加延迟
        const delay = (index % 5 + 1) * 100;
        section.classList.add(`blur-delay-${delay}`);
        
        // 开始观察
        observer.observe(section);
        console.log('添加模糊效果到元素:', section);
    });
}

// 确保在页面完全加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM加载完成，初始化模糊效果');
        initBlurEffects();
    });
} else {
    console.log('DOM已加载，立即初始化模糊效果');
    initBlurEffects();
}

// 添加一个备用初始化方法
window.addEventListener('load', () => {
    console.log('页面完全加载，检查是否需要初始化模糊效果');
    if (!document.querySelector('.blur-reveal')) {
        console.log('未找到模糊效果元素，重新初始化');
        initBlurEffects();
    }
}); 
document.addEventListener('DOMContentLoaded', initBlurEffects); 

class BlurEffect {
    constructor(options = {}) {
        this.options = {
            threshold: 0.2,
            blurAmount: 8,
            transitionDuration: 0.5,
            ...options
        };
        
        this.init();
    }

    init() {
        // 为需要模糊效果的元素添加基础样式
        const style = document.createElement('style');
        style.textContent = `
            .blur-element {
                opacity: 0;
                filter: blur(${this.options.blurAmount}px);
                transform: translateY(20px);
                transition: all ${this.options.transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .blur-element.visible {
                opacity: 1;
                filter: blur(0);
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        // 初始化观察器
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: this.options.threshold,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // 为所有带有 blur-element 类的元素添加观察
        document.querySelectorAll('.blur-element').forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 添加延迟，创造瀑布效果
                const delay = entry.target.dataset.blurDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // 一旦显示就不再观察
                this.observer.unobserve(entry.target);
            }
        });
    }

    // 添加新的元素到观察列表
    addElement(element) {
        if (!element.classList.contains('blur-element')) {
            element.classList.add('blur-element');
            this.observer.observe(element);
        }
    }
}

// 导出模块
export default BlurEffect; 