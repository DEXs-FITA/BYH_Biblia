#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re
from pathlib import Path
from datetime import datetime

class GeneradorSW:
    def __init__(self, ruta_base='.'):
        self.base = Path(ruta_base)
        self.version_actual = self.obtener_version_actual()
        self.archivos = []
        self.carpetas = []
        
    def obtener_version_actual(self):
        """Obtiene la versión actual del SW o genera una nueva"""
        sw_path = self.base / 'sw.js'
        if sw_path.exists():
            with open(sw_path, 'r', encoding='utf-8') as f:
                contenido = f.read()
                match = re.search(r"CACHE_NAME\s*=\s*['\"]([^'\"]+)['\"]", contenido)
                if match:
                    return match.group(1)
        return 'biblia-v3.0.1'
    
    def versionar(self):
        """Incrementa la versión del SW"""
        match = re.search(r'v(\d+)\.(\d+)\.(\d+)', self.version_actual)
        if match:
            mayor, menor, parche = map(int, match.groups())
            parche += 1
            return f'biblia-v{mayor}.{menor}.{parche}'
        return 'biblia-v3.0.2'
    
    def escanear_archivos(self):
        """Escanea el proyecto y genera la lista de TODOS los archivos para cachear"""
        
        # Directorios a excluir (puedes personalizar)
        excluir_dirs = {
            '.git', '__pycache__', 'node_modules', '.vscode', 
            '.idea', 'venv', 'env', 'dist', 'build', '.next',
            'coverage', '.pytest_cache', '.mypy_cache'
        }
        
        # Archivos a excluir (puedes personalizar)
        excluir_archivos = {
            'sw.js', 'generar_sw.py', 'verificar.py', 
            'LICENSE', 'README.md', '.gitignore', 'package-lock.json',
            'yarn.lock', '.DS_Store', 'Thumbs.db'
        }
        
        archivos = []
        carpetas = []
        
        # Recorrer todo el proyecto
        for ruta in self.base.rglob('*'):
            # Obtener ruta relativa
            rel = ruta.relative_to(self.base)
            ruta_str = str(rel).replace('\\', '/')
            
            # Verificar exclusiones de directorios
            if any(exc in ruta.parts for exc in excluir_dirs):
                continue
            if ruta_str.startswith('.'):
                continue
            
            # Si es directorio, agregar a la lista de carpetas
            if ruta.is_dir():
                if ruta_str != '.':  # No incluir la raíz
                    carpetas.append(f'./{ruta_str}/')
                continue
            
            # Si es archivo
            if ruta.is_file():
                # Excluir archivos específicos
                if ruta.name in excluir_archivos:
                    continue
                
                # Agregar con ./ al inicio
                archivos.append(f'./{ruta_str}')
        
        # Ordenar alfabéticamente
        archivos.sort()
        carpetas.sort()
        
        # Guardar listas
        self.archivos = ['./'] + carpetas + archivos
        self.carpetas = carpetas
        
        return self.archivos
    
    def generar_urls_string(self):
        """Genera el string de URLs para el SW"""
        urls_str = '[\n'
        for archivo in self.archivos:
            urls_str += f"  '{archivo}',\n"
        urls_str += ']'
        return urls_str
    
    def actualizar_sw(self, nueva_version=None):
        """Actualiza el archivo sw.js con la nueva lista de archivos"""
        
        sw_path = self.base / 'sw.js'
        
        if not sw_path.exists():
            return False, "No se encontró sw.js"
        
        # Leer SW actual
        with open(sw_path, 'r', encoding='utf-8') as f:
            contenido = f.read()
        
        # Determinar nueva version
        if nueva_version:
            nueva_version_str = nueva_version
        else:
            nueva_version_str = self.versionar()
        
        # Generar nueva lista
        nueva_lista = self.generar_urls_string()
        
        # Reemplazar CACHE_NAME
        contenido = re.sub(
            r"CACHE_NAME\s*=\s*['\"][^'\"]+['\"]",
            f"CACHE_NAME = '{nueva_version_str}'",
            contenido
        )
        
        # Reemplazar urlsToCache
        patron = r"const\s+urlsToCache\s*=\s*\[[^\]]*\]"
        nuevo_bloque = f"const urlsToCache = {nueva_lista}"
        contenido = re.sub(patron, nuevo_bloque, contenido, flags=re.DOTALL)
        
        # Guardar
        with open(sw_path, 'w', encoding='utf-8') as f:
            f.write(contenido)
        
        return True, f"SW actualizado a {nueva_version_str} con {len(self.archivos)} elementos ({len(self.carpetas)} carpetas, {len(self.archivos)-len(self.carpetas)-1} archivos)"
    
    def mostrar_resumen(self):
        """Muestra un resumen de los archivos encontrados"""
        print("=" * 70)
        print("📊 RESUMEN DE ELEMENTOS PARA CACHE")
        print("=" * 70)
        print(f"Versión actual: {self.version_actual}")
        total_carpetas = len(self.carpetas)
        total_archivos = len(self.archivos) - total_carpetas - 1  # -1 por el './'
        print(f"Total elementos: {len(self.archivos)}")
        print(f"  📁 Carpetas: {total_carpetas}")
        print(f"  📄 Archivos: {total_archivos}")
        print("-" * 70)
        
        # Estadísticas por tipo de archivo
        tipos = {}
        extensiones_sin = 0
        for archivo in self.archivos:
            if archivo == './' or archivo.endswith('/'):
                continue
            ext = Path(archivo).suffix
            if ext:
                tipos[ext] = tipos.get(ext, 0) + 1
            else:
                extensiones_sin += 1
        
        if tipos:
            print("Distribución por extensión:")
            for ext, count in sorted(tipos.items(), key=lambda x: -x[1]):
                print(f"  {ext}: {count} archivos")
            if extensiones_sin > 0:
                print(f"  (sin extensión): {extensiones_sin} archivos")
        
        print("-" * 70)
        print("\n📋 LISTA COMPLETA:")
        
        # Mostrar carpetas primero
        if self.carpetas:
            print("\n  📁 CARPETAS:")
            for carpeta in self.carpetas:
                print(f"    {carpeta}")
        
        # Mostrar archivos
        print("\n  📄 ARCHIVOS:")
        archivos_mostrar = [a for a in self.archivos if a != './' and not a.endswith('/')]
        if archivos_mostrar:
            for archivo in archivos_mostrar:
                print(f"    {archivo}")
        else:
            print("    (sin archivos)")
        
        print("=" * 70)

def guardar_lista_completa(archivos, archivo_salida='lista_completa.txt'):
    """Guarda la lista completa en un archivo"""
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        f.write("# LISTA COMPLETA DE ARCHIVOS PARA CACHE\n")
        f.write(f"# Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("#" + "=" * 68 + "\n\n")
        
        for elemento in archivos:
            if elemento == './':
                f.write("# RAIZ DEL PROYECTO\n")
                f.write(f"{elemento}\n\n")
            elif elemento.endswith('/'):
                f.write(f"# CARPETA\n{elemento}\n")
            else:
                f.write(f"{elemento}\n")
    
    print(f"\n✅ Lista guardada en '{archivo_salida}'")

def guardar_json(archivos, archivo_salida='lista_cache.json'):
    """Guarda la lista en formato JSON"""
    datos = {
        'fecha_generacion': datetime.now().isoformat(),
        'total_elementos': len(archivos),
        'carpetas': [a for a in archivos if a.endswith('/') and a != './'],
        'archivos': [a for a in archivos if not a.endswith('/') and a != './'],
        'todos': archivos
    }
    
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        json.dump(datos, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Lista guardada en '{archivo_salida}' (formato JSON)")

def main():
    import sys
    
    # Obtener ruta
    ruta = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    if not os.path.exists(ruta):
        print(f"❌ Error: '{ruta}' no existe")
        sys.exit(1)
    
    # Crear generador
    generador = GeneradorSW(ruta)
    
    # Escanear archivos
    print("🔍 Escaneando proyecto (todos los archivos y carpetas)...")
    generador.escanear_archivos()
    
    # Mostrar resumen
    generador.mostrar_resumen()
    
    # Preguntar qué hacer
    print("\n❓ ¿Qué deseas hacer?")
    print("   [1] Actualizar sw.js (incrementa versión)")
    print("   [2] Actualizar sw.js (misma versión)")
    print("   [3] Solo mostrar, sin cambios")
    print("   [4] Guardar lista en archivo TXT")
    print("   [5] Guardar lista en archivo JSON")
    print("   [6] Guardar en TXT y JSON")
    
    opcion = input("\nOpción (1-6): ").strip()
    
    if opcion == '1':
        resultado, mensaje = generador.actualizar_sw()
        print(f"\n✅ {mensaje}")
        
    elif opcion == '2':
        resultado, mensaje = generador.actualizar_sw(generador.version_actual)
        print(f"\n✅ {mensaje}")
        
    elif opcion == '4':
        guardar_lista_completa(generador.archivos)
        
    elif opcion == '5':
        guardar_json(generador.archivos)
        
    elif opcion == '6':
        guardar_lista_completa(generador.archivos)
        guardar_json(generador.archivos)
        
    else:
        print("\n⚠️ No se realizaron cambios")

if __name__ == '__main__':
    main()
