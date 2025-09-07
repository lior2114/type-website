#!/usr/bin/env python3
"""
Install Python Dependencies for Admin Creation GUI
"""

import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    print("🐍 Installing Python Dependencies for Admin Creation GUI")
    print("=" * 60)
    
    packages = [
        "firebase-admin==6.4.0"
    ]
    
    for package in packages:
        print(f"📦 Installing {package}...")
        if install_package(package):
            print(f"✅ {package} installed successfully!")
        else:
            print(f"❌ Failed to install {package}")
            return False
    
    print("\n🎉 All dependencies installed successfully!")
    print("You can now run: python create_admin_gui.py")
    
    return True

if __name__ == "__main__":
    main()
