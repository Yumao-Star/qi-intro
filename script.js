// 全局变量
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
const scrollContainer = document.querySelector('.scroll-container');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    setupScrollSnap();
    setupDotNavigation();
    setupScrollAnimations();
    setupButtonInteractions();
});

// 设置滚动捕捉
function setupScrollSnap() {
    let scrollTimeout;
    let isScrolling = false;

    scrollContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        isScrolling = true;

        // 计算当前所在的部分
        const scrollTop = scrollContainer.scrollTop;
        const viewHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - scrollContainer.offsetTop;
            const sectionMiddle = sectionTop + viewHeight / 2;

            if (Math.abs(scrollTop + viewHeight / 2 - sectionMiddle) < viewHeight / 2) {
                updateActiveDot(index);
            }
        });

        // 滚动结束时的回调
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    });
}

// 更新活跃的导航点
function updateActiveDot(index) {
    currentSection = index;
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

// 设置导航点点击
function setupDotNavigation() {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetSection = sections[index];
            const scrollTop = targetSection.offsetTop;
            
            gsap.to(scrollContainer, {
                scrollTop: scrollTop,
                duration: 1,
                ease: 'power3.inOut'
            });

            updateActiveDot(index);
        });
    });
}

// 设置滚动动画
function setupScrollAnimations() {
    // 观察器选项
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 触发动画
                animateSection(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 为所有部分添加观察器
    sections.forEach(section => {
        observer.observe(section);
    });
}

// 每个部分的动画
function animateSection(section) {
    const cards = section.querySelectorAll('.about-card, .focus-item, .contact-item, .skill-category');
    const items = section.querySelectorAll('.timeline-item');

    // 卡片动画
    cards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // 时间线动画
    items.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: index % 2 === 0 ? -30 : 30,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });

    // 进度条动画
    const progressBars = section.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        gsap.to(bar, {
            width: bar.style.width,
            duration: 1.2,
            ease: 'power2.out'
        });
    });
}

// 按钮交互
function setupButtonInteractions() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // 滚动到第二个部分
            gsap.to(scrollContainer, {
                scrollTop: sections[1].offsetTop,
                duration: 1,
                ease: 'power3.inOut'
            });
        });

        // 添加按钮悬停效果
        ctaButton.addEventListener('mouseenter', () => {
            gsap.to(ctaButton, {
                scale: 1.05,
                duration: 0.3
            });
        });

        ctaButton.addEventListener('mouseleave', () => {
            gsap.to(ctaButton, {
                scale: 1,
                duration: 0.3
            });
        });
    }
}

// 平滑滚动到顶部（用于页面加载）
window.addEventListener('load', () => {
    scrollContainer.scrollTop = 0;
});

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        const nextIndex = Math.min(currentSection + 1, sections.length - 1);
        gsap.to(scrollContainer, {
            scrollTop: sections[nextIndex].offsetTop,
            duration: 1,
            ease: 'power3.inOut'
        });
    } else if (e.key === 'ArrowUp') {
        const prevIndex = Math.max(currentSection - 1, 0);
        gsap.to(scrollContainer, {
            scrollTop: sections[prevIndex].offsetTop,
            duration: 1,
            ease: 'power3.inOut'
        });
    }
});

// 添加鼠标悬停卡片效果
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll(
        '.about-card, .focus-item, .contact-item, .skill-category'
    );

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(element, {
                boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)',
                duration: 0.3
            });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                boxShadow: 'none',
                duration: 0.3
            });
        });
    });
});

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}