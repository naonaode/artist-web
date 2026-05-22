"""
Avatar Deployer Script

This script automatically identifies the latest high-resolution generated painter portraits 
from the Antigravity artifact directory, copies them, and deploys them to the Vite project's
public artworks directory with exact filenames matched by the frontend.
"""

import os
import sys
import shutil
import logging
from typing import Dict

# Configuration of logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("avatar_deployer")

# Configuration of mappings
ARTIFACTS_DIR = r"C:\Users\admin\AppData\Local\Temp" # Fallback if we cannot find AppData directly
# Let's dynamically detect the artifact dir:
CONV_ID = "5d86355b-9bda-4a26-8d2f-b88b75466260"
POTENTIAL_ARTIFACT_DIRS = [
    f"C:\\Users\\admin\\.gemini\\antigravity\\brain\\{CONV_ID}",
    f"C:\\Users\\admin\\AppData\\Local\\Gemini\\antigravity\\brain\\{CONV_ID}",
    r"C:\Users\admin\.gemini\antigravity\brain\5d86355b-9bda-4a26-8d2f-b88b75466260"
]

TARGET_MAP: Dict[str, str] = {
    "van_gogh_avatar": "van_gogh_avatar.png",
    "monet_avatar": "monet_avatar.png",
    "frida_avatar": "frida_avatar.png",
    "dali_avatar": "dali_avatar.png",
    "klimt_avatar": "klimt_avatar.png"
}

def get_latest_avatar_file(src_dir: str, prefix: str) -> str:
    """Finds the most recent file matching the prefix in the source directory."""
    if not os.path.exists(src_dir):
        return ""
        
    matching_files = []
    for f in os.listdir(src_dir):
        if f.startswith(prefix) and f.endswith(".png"):
            filepath = os.path.join(src_dir, f)
            matching_files.append((filepath, os.path.getmtime(filepath)))
            
    if not matching_files:
        return ""
        
    # Sort by modification time descending
    matching_files.sort(key=lambda x: x[1], reverse=True)
    return matching_files[0][0]

def deploy() -> None:
    # 1. Resolve source artifacts directory
    src_dir = ""
    for d in POTENTIAL_ARTIFACT_DIRS:
        if os.path.exists(d):
            src_dir = d
            break
            
    if not src_dir:
        logger.error("Could not locate the Antigravity artifacts directory. Checked:")
        for d in POTENTIAL_ARTIFACT_DIRS:
            logger.error(f"  - {d}")
        sys.exit(1)
        
    logger.info(f"Using source artifacts directory: {src_dir}")
    
    # 2. Resolve destination project directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    dest_dir = os.path.join(project_dir, "public", "artworks")
    os.makedirs(dest_dir, exist_ok=True)
    logger.info(f"Using target project artworks directory: {dest_dir}")
    
    # 3. Deploy each avatar
    deployed_count = 0
    for prefix, target_name in TARGET_MAP.items():
        latest_file = get_latest_avatar_file(src_dir, prefix)
        if not latest_file:
            logger.warning(f"⚠️ Could not find any generated file starting with '{prefix}' in {src_dir}")
            continue
            
        dest_path = os.path.join(dest_dir, target_name)
        logger.info(f"Deploying: {os.path.basename(latest_file)} -> {target_name}")
        try:
            shutil.copy2(latest_file, dest_path)
            logger.info(f"   ✅ Success! Deployed to {dest_path}")
            deployed_count += 1
        except Exception as e:
            logger.error(f"   ❌ Failed to deploy {target_name}: {e}")
            
    logger.info(f"Deployment completed. Successfully deployed {deployed_count}/{len(TARGET_MAP)} artist portraits.")

if __name__ == "__main__":
    deploy()
