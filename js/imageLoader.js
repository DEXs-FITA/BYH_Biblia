// Módulo para carga optimizada de imágenes desde caché
// Las imágenes se cargan solo cuando son visibles en pantalla

class ImageLoader {
    constructor() {
        this.observer = null;
        this.imageCache = new Map();
        this.cacheName = null;
        this.pendingImages = [];
        this.isSWReady = false;
        this.maxRetries = 5;
        this.retryDelay = 1000;
        this.isLoading = false;
        
        this.initObserver();
        this.waitForSW();
    }
    
    async waitForSW() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                if (registration.active) {
                    await this.getCacheName();
                    this.isSWReady = true;
                    this.processPendingImages();
                }
            } catch (_) {
                this.isSWReady = true;
                this.processPendingImages();
            }
        } else {
            this.isSWReady = true;
            this.processPendingImages();
        }
    }
    
    async getCacheName() {
        try {
            const cacheNames = await caches.keys();
            const imageCache = cacheNames.find(name => name.startsWith('images-'));
            this.cacheName = imageCache || 'images-biblia-v5.0.0';
        } catch (_) {
            this.cacheName = 'images-biblia-v5.0.0';
        }
    }
    
    initObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: '200px',
                    threshold: 0.01
                }
            );
        }
    }
    
    handleIntersection(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                this.observer.unobserve(img);
            }
        });
    }
    
    registerImages(images) {
        if (!images || images.length === 0) return;
        
        images.forEach((img) => {
            this.pendingImages.push(img);
            if (this.observer && this.isSWReady) {
                this.observer.observe(img);
            } else if (!this.observer) {
                this.loadImage(img);
            }
        });
        
        if (this.isSWReady) {
            this.processPendingImages();
        }
    }
    
    processPendingImages() {
        if (this.pendingImages.length === 0 || this.isLoading) return;
        
        this.isLoading = true;
        const images = [...this.pendingImages];
        this.pendingImages = [];
        
        images.forEach((img) => {
            if (this.observer && this.isSWReady) {
                this.observer.observe(img);
            } else {
                this.loadImage(img);
            }
        });
        
        this.isLoading = false;
    }
    
    async loadImageDirect(imgElement, retryCount = 0) {
        if (imgElement.dataset.loaded === 'true') return;
        
        const url = imgElement.dataset.src || imgElement.src;
        if (!url) return;
        
        if (this.imageCache.has(url)) {
            imgElement.src = this.imageCache.get(url);
            this.markLoaded(imgElement);
            return;
        }
        
        if (!this.isSWReady) {
            if (retryCount < this.maxRetries) {
                setTimeout(() => {
                    this.loadImageDirect(imgElement, retryCount + 1);
                }, this.retryDelay);
            }
            return;
        }
        
        try {
            if (!this.cacheName) {
                await this.getCacheName();
            }
            
            const cache = await caches.open(this.cacheName);
            const cachedResponse = await cache.match(url);
            
            if (cachedResponse) {
                const blob = await cachedResponse.blob();
                const objectUrl = URL.createObjectURL(blob);
                this.imageCache.set(url, objectUrl);
                imgElement.src = objectUrl;
                this.markLoaded(imgElement);
                return;
            }
            
            if (retryCount < this.maxRetries) {
                const delay = this.retryDelay * Math.pow(2, retryCount);
                setTimeout(() => {
                    this.loadImageDirect(imgElement, retryCount + 1);
                }, delay);
                return;
            }
            
            try {
                const response = await fetch(url);
                if (response && response.ok) {
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    this.imageCache.set(url, objectUrl);
                    imgElement.src = objectUrl;
                    this.markLoaded(imgElement);
                    const cache = await caches.open(this.cacheName);
                    cache.put(url, response);
                    return;
                }
            } catch (_) {}
            
        } catch (_) {
            if (retryCount < this.maxRetries) {
                const delay = this.retryDelay * Math.pow(2, retryCount);
                setTimeout(() => {
                    this.loadImageDirect(imgElement, retryCount + 1);
                }, delay);
            }
        }
    }
    
    async loadImage(imgElement) {
        await this.loadImageDirect(imgElement);
    }
    
    async loadImageAsBackground(element, url) {
        if (!url) return null;
        
        if (!this.isSWReady) {
            await new Promise(resolve => {
                const checkReady = () => {
                    if (this.isSWReady) {
                        resolve();
                    } else {
                        setTimeout(checkReady, 200);
                    }
                };
                checkReady();
            });
        }
        
        try {
            if (!this.cacheName) {
                await this.getCacheName();
            }
            
            const cache = await caches.open(this.cacheName);
            const cachedResponse = await cache.match(url);
            
            if (cachedResponse) {
                const blob = await cachedResponse.blob();
                const objectUrl = URL.createObjectURL(blob);
                element.style.backgroundImage = 'url(' + objectUrl + ')';
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
                return objectUrl;
            }
            
        } catch (_) {
            element.style.backgroundColor = 'var(--principal-primario)';
        }
        return null;
    }
    
    markLoaded(imgElement) {
        if (imgElement.dataset.loaded === 'true') return;
        imgElement.dataset.loaded = 'true';
    }
    
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.imageCache.forEach((url) => {
            URL.revokeObjectURL(url);
        });
        this.imageCache.clear();
    }
}

export default new ImageLoader();