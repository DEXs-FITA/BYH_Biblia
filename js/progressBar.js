// Módulo para barra de progreso de descarga del Service Worker
// Muestra el progreso de instalación/actualización para uso offline

class ProgressBar {
    constructor() {
        this.container = null;
        this.bar = null;
        this.text = null;
        this.isVisible = false;
        this.hideTimeout = null;
        this.currentProgress = 0;
        this.isComplete = false;
        this.messageListener = null;
        
        this.createProgressBar();
        this.setupSWListener();
        this.checkInitialStatus();
    }
    
    createProgressBar() {
        this.container = document.createElement('div');
        this.container.id = 'progress-container';
        this.container.style.cssText = `
            position: fixed;
            top: 52px;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--principal-primario);
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        `;
        
        this.bar = document.createElement('div');
        this.bar.id = 'progress-bar';
        this.bar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, var(--resaltado), #4a9eff);
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 0 2px 2px 0;
            box-shadow: 0 0 12px rgba(0, 101, 208, 0.3);
        `;
        
        this.text = document.createElement('span');
        this.text.id = 'progress-text';
        this.text.style.cssText = `
            position: absolute;
            right: 16px;
            top: -18px;
            font-size: 10px;
            color: var(--texto-primario);
            font-family: 'normalr', Montserrat, sans-serif;
            font-weight: 400;
            opacity: 0.5;
            letter-spacing: 0.5px;
            background: var(--principal-primario);
            padding: 2px 10px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        `;
        this.text.textContent = '0%';
        
        this.container.appendChild(this.bar);
        this.container.appendChild(this.text);
        document.body.appendChild(this.container);
    }
    
    setupSWListener() {
        // Escuchar mensajes incluso si el controller aún no está disponible
        if ('serviceWorker' in navigator) {
            // Si ya hay controller, usarlo
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.addEventListener('message', this.handleSWMessage.bind(this));
            }
            
            // También escuchar en el service worker ready
            navigator.serviceWorker.ready.then((registration) => {
                if (registration.active) {
                    // Ya está activo, verificar estado
                    this.checkInitialStatus();
                }
            });
            
            // Escuchar cambios de controller
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.addEventListener('message', this.handleSWMessage.bind(this));
                }
            });
        }
    }
    
    handleSWMessage(event) {
        const data = event.data;
        
        if (data && data.type === 'PROGRESS') {
            const { progress, loaded, total } = data;
            this.update(progress, loaded, total);
        }
        
        if (data && data.type === 'INSTALL_COMPLETE') {
            this.complete();
        }
    }
    
    checkInitialStatus() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                if (registration.active) {
                    // Verificar si ya hay caché
                    caches.open('static-biblia-v5.0.0').then((cache) => {
                        cache.keys().then((keys) => {
                            if (keys.length > 0) {
                                this.complete();
                            }
                        });
                    });
                }
            });
        }
    }
    
    show() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        
        if (!this.isVisible) {
            this.isVisible = true;
            this.container.classList.add('visible');
            this.container.style.opacity = '1';
        }
    }
    
    hide() {
        if (this.isVisible) {
            this.isVisible = false;
            this.container.classList.remove('visible');
            this.container.style.opacity = '0';
        }
    }
    
    update(percentage, loaded, total) {
        if (!this.container || !this.bar) return;
        
        this.currentProgress = percentage;
        
        if (percentage > 0 && percentage < 100) {
            this.show();
            this.isComplete = false;
        }
        
        this.bar.style.width = Math.min(percentage, 100) + '%';
        
        if (this.text) {
            if (total > 0) {
                this.text.textContent = percentage + '% (' + loaded + '/' + total + ')';
            } else {
                this.text.textContent = percentage + '%';
            }
        }
        
        if (percentage >= 100) {
            this.complete();
        }
    }
    
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        this.bar.style.width = '100%';
        this.text.textContent = '100% - Listo para usar offline';
        
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        
        this.hideTimeout = setTimeout(() => {
            this.hide();
            this.hideTimeout = null;
        }, 10000);
    }
    
    reset() {
        this.isComplete = false;
        this.currentProgress = 0;
        this.update(0, 0, 0);
        
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        
        this.hide();
    }
}

export default new ProgressBar();