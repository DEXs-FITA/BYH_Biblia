// Módulo para carga optimizada de imágenes con lazy loading
// Las imágenes se cargan solo cuando son visibles en pantalla

class ImageLoader {
  constructor() {
    this.observer = null;
    this.loadedCount = 0;
    this.totalImages = 0;
    this.progressCallback = null;
    this.completeCallback = null;
    this.imageCache = new Map();
    
    this.initObserver();
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
    
    this.totalImages = images.length;
    this.loadedCount = 0;
    
    images.forEach((img) => {
      if (this.observer) {
        this.observer.observe(img);
      } else {
        this.loadImage(img);
      }
    });
  }
  
  async loadImageDirect(imgElement) {
    if (imgElement.dataset.loaded === 'true') return;
    
    const url = imgElement.dataset.src || imgElement.src;
    if (!url) return;
    
    if (this.imageCache.has(url)) {
      imgElement.src = this.imageCache.get(url);
      this.markLoaded(imgElement);
      return;
    }
    
    try {
      const cache = await caches.open('images-biblia-v5.0.0');
      const cachedResponse = await cache.match(url);
      
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        const objectUrl = URL.createObjectURL(blob);
        this.imageCache.set(url, objectUrl);
        imgElement.src = objectUrl;
        this.markLoaded(imgElement);
        return;
      }
      
      const response = await fetch(url);
      if (response && response.ok) {
        const responseClone = response.clone();
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        this.imageCache.set(url, objectUrl);
        imgElement.src = objectUrl;
        cache.put(url, responseClone);
        this.markLoaded(imgElement);
      }
      
    } catch (error) {
      console.warn('Error cargando imagen:', url, error);
    }
  }
  
  async loadImage(imgElement) {
    await this.loadImageDirect(imgElement);
  }
  
  async loadImageAsBackground(element, url) {
    if (!url) return null;
    
    try {
      const cache = await caches.open('images-biblia-v5.0.0');
      const cachedResponse = await cache.match(url);
      
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        const objectUrl = URL.createObjectURL(blob);
        element.style.backgroundImage = 'url(' + objectUrl + ')';
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        return objectUrl;
      }
      
      const response = await fetch(url);
      if (response && response.ok) {
        const responseClone = response.clone();
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        element.style.backgroundImage = 'url(' + objectUrl + ')';
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        cache.put(url, responseClone);
        return objectUrl;
      }
      
    } catch (error) {
      console.warn('Error cargando fondo:', url, error);
      element.style.backgroundColor = 'var(--principal-primario)';
    }
    return null;
  }
  
  markLoaded(imgElement) {
    if (imgElement.dataset.loaded === 'true') return;
    
    imgElement.dataset.loaded = 'true';
    this.loadedCount++;
    
    if (this.progressCallback) {
      const percentage = Math.round((this.loadedCount / this.totalImages) * 100);
      this.progressCallback(percentage, this.loadedCount, this.totalImages);
    }
    
    if (this.loadedCount >= this.totalImages) {
      if (this.completeCallback) {
        this.completeCallback();
      }
    }
  }
  
  onProgress(callback) {
    this.progressCallback = callback;
  }
  
  onComplete(callback) {
    this.completeCallback = callback;
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