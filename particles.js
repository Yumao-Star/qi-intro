class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resizeCanvas();
        this.init();
        this.setupMouseTracking();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // 创建初始粒子
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                this.canvas.width,
                this.canvas.height
            ));
        }
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            // 鼠标附近创建粒子
            for (let i = 0; i < 2; i++) {
                this.particles.push(new Particle(
                    this.mouse.x + (Math.random() - 0.5) * 20,
                    this.mouse.y + (Math.random() - 0.5) * 20,
                    this.canvas.width,
                    this.canvas.height
                ));
            }
        });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(this.mouse);

            // 移除过期粒子
            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制粒子连接线
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // 绘制粒子
        for (let particle of this.particles) {
            particle.draw(this.ctx);
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        this.radius = Math.random() * 2 + 1;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    update(mouse) {
        // 粒子向鼠标吸引
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
            const angle = Math.atan2(dy, dx);
            const force = (200 - distance) / 200;
            this.vx += Math.cos(angle) * force * 0.5;
            this.vy += Math.sin(angle) * force * 0.5;
        }

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 边界反弹
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx *= -0.8;
            this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.vy *= -0.8;
            this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        }

        // 应用阻尼
        this.vx *= 0.98;
        this.vy *= 0.98;

        // 消退
        this.alpha -= this.decay;
        this.alpha = Math.max(0, this.alpha);
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 发光效果
        ctx.strokeStyle = `rgba(6, 182, 212, ${this.alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// 初始化粒子系统
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});