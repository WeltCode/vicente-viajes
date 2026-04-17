#!/usr/bin/env python
"""
Script para probar la configuración de Cloudinary.
Ejecutar después de configurar las credenciales reales en .env
"""
import os
import django
from pathlib import Path

# Configurar Django
BASE_DIR = Path(__file__).resolve().parent
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import cloudinary
from cloudinary import api

def test_cloudinary_config():
    """Prueba la configuración de Cloudinary"""
    try:
        # Verificar configuración
        config = cloudinary.config()
        print("✓ Cloudinary configurado correctamente")
        print(f"  Cloud Name: {config.cloud_name}")
        print(f"  API Key: {config.api_key[:8]}...")

        # Probar conexión a Cloudinary
        result = api.ping()
        print("✓ Conexión a Cloudinary exitosa")
        print(f"  Status: {result.get('status')}")

        # Listar carpetas existentes
        folders = api.root_folders()
        existing_folders = [f['name'] for f in folders.get('folders', [])]
        print(f"✓ Carpetas existentes: {existing_folders}")

        # Crear carpeta principal "Vicente Viajes"
        if 'Vicente Viajes' not in existing_folders:
            try:
                api.create_folder('Vicente Viajes')
                print(f"✓ Carpeta 'Vicente Viajes' creada")
            except Exception as e:
                print(f"⚠ Error creando carpeta 'Vicente Viajes': {e}")
        else:
            print(f"✓ Carpeta 'Vicente Viajes' ya existe")

        # Crear subcarpetas dentro de Vicente Viajes
        required_subfolders = ['excursiones', 'playas', 'ofertas', 'estados']
        for subfolder in required_subfolders:
            folder_path = f'Vicente Viajes/{subfolder}'
            try:
                api.create_folder(folder_path)
                print(f"✓ Carpeta '{folder_path}' creada")
            except Exception as e:
                # Si el error es que ya existe, no es problema
                if 'already' in str(e).lower() or 'exist' in str(e).lower():
                    print(f"✓ Carpeta '{folder_path}' ya existe")
                else:
                    print(f"⚠ Error creando carpeta '{folder_path}': {e}")

        print("\n🎉 Configuración de Cloudinary completada exitosamente!")

    except Exception as e:
        print(f"❌ Error en configuración de Cloudinary: {e}")
        print("Asegúrate de que las variables de entorno estén configuradas correctamente:")
        print("- CLOUDINARY_CLOUD_NAME")
        print("- CLOUDINARY_API_KEY")
        print("- CLOUDINARY_API_SECRET")

if __name__ == '__main__':
    test_cloudinary_config()