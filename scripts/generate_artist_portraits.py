"""
Artist Portrait Generator using Google GenAI (Imagen 3)

This script generates high-resolution, signature-style artistic portraits for 5 legendary
painters (Vincent van Gogh, Claude Monet, Frida Kahlo, Salvador Dali, Gustav Klimt) using
Google's Imagen 3.0 model via the official google-genai SDK.

Usage:
    python scripts/generate_artist_portraits.py --api-key <YOUR_GEMINI_API_KEY>
"""

import os
import sys
import time
import logging
import argparse
from typing import Dict

# Configuration of logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("artist_generator")

try:
    from google import genai
    from google.genai import types
except ImportError:
    logger.error("The 'google-genai' SDK is not installed. Please run 'pip install google-genai' first.")
    sys.exit(1)

ARTISTS_PROMPTS: Dict[str, Dict[str, str]] = {
    "van_gogh": {
        "name_cn": "文森特·梵高",
        "filename": "van_gogh_avatar.png",
        "prompt": (
            "A premium masterpiece self-portrait of Vincent van Gogh. "
            "Expressive Post-Impressionist style with thick, textured impasto brushstrokes. "
            "Vibrant palette of swirling deep cobalt blue and glowing golden sunflower yellow. "
            "The subject exhibits intense, soulful eyes. Swirling dynamic starlit sky patterns "
            "in the background. Exquisite texture detail, classic oil-on-canvas aesthetic."
        )
    },
    "monet": {
        "name_cn": "克劳德·莫奈",
        "filename": "monet_avatar.png",
        "prompt": (
            "A premium masterpiece portrait of Claude Monet. "
            "Impressionist art style with soft-focus brushwork capturing fleeting light and atmosphere. "
            "Delicate palette of lavender, soft green, cream, and sky blue. Dappled morning sunlight "
            "filtering through a lush water lily garden background with a weeping willow. "
            "Serene expression, detailed oil-on-canvas paint texture."
        )
    },
    "frida": {
        "name_cn": "弗里达·卡罗",
        "filename": "frida_avatar.png",
        "prompt": (
            "A premium masterpiece self-portrait of Frida Kahlo. "
            "Naïve Mexican folk surrealism art style. Rich, saturated emerald green foliage background "
            "with tropical leaves, exotic flowers, and a small monkey sitting on her shoulder. "
            "Striking frontal portrait showing her iconic bold unibrow and intense, resilient eyes, "
            "decorated with a colorful floral headpiece. Rich oil paint strokes, high symbolic depth."
        )
    },
    "dali": {
        "name_cn": "萨尔瓦多·达利",
        "filename": "dali_avatar.png",
        "prompt": (
            "A premium masterpiece surrealist self-portrait of Salvador Dali. "
            "Surrealism art style featuring his iconic long, exaggerated, upwards-pointing mustache. "
            "Piercing wide eyes with intense artistic curiosity. The background is a vast, dreamlike desert "
            "under a strange blue sky, with a melting clock hanging on a withered branch. "
            "Precise lighting, dramatic shadows, highly imaginative oil painting texture."
        )
    },
    "klimt": {
        "name_cn": "古斯塔夫·克里姆特",
        "filename": "klimt_avatar.png",
        "prompt": (
            "A premium masterpiece portrait of Gustav Klimt. "
            "Symbolist art style with extensive textured gold leaf gilding, ornamental mosaic patterns, "
            "and intricate geometric spirals. The subject is draped in a lavishly patterned robe "
            "with decorative elements. Warm, glowing gold background, luxurious and opulent finish, "
            "masterful art nouveau style."
        )
    }
}

def generate_portraits(api_key: str, dest_dir: str) -> None:
    """
    Generates portraits for all configured artists and saves them to the destination directory.
    
    Args:
        api_key: Google AI Studio API key.
        dest_dir: Path to the directory where images should be saved.
    """
    os.makedirs(dest_dir, exist_ok=True)
    
    logger.info("Initializing Google GenAI Client...")
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        logger.error(f"Failed to initialize Client: {e}")
        return

    # List of candidate models for image generation, in order of preference
    models_to_try = [
        "imagen-4.0-generate-001",
        "imagen-4.0-fast-generate-001",
        "gemini-3-pro-image-preview",
        "gemini-3.1-flash-image-preview",
        "gemini-2.5-flash-image"
    ]

    total = len(ARTISTS_PROMPTS)
    logger.info(f"Starting portrait generation for {total} legendary artists. Candidates: {models_to_try}")
    
    for idx, (key, info) in enumerate(ARTISTS_PROMPTS.items(), 1):
        name_cn = info["name_cn"]
        filename = info["filename"]
        prompt = info["prompt"]
        dest_path = os.path.join(dest_dir, filename)
        
        logger.info(f"[{idx}/{total}] Processing: {name_cn} -> {filename}")
        
        # Check if already generated (Idempotency)
        if os.path.exists(dest_path):
            logger.info(f"   Image already exists at {dest_path}, skipping.")
            continue
            
        # Try models one by one
        success = False
        for model_name in models_to_try:
            logger.info(f"   Trying model: '{model_name}'...")
            try:
                # Add delay to avoid rate limits
                wait_time = 6
                logger.info(f"   Sleeping for {wait_time} seconds before request...")
                time.sleep(wait_time)
                
                response = client.models.generate_images(
                    model=model_name,
                    prompt=prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        output_mime_type='image/png',
                        aspect_ratio='1:1',
                        person_generation='ALLOW_ADULT'
                    )
                )
                
                if response.generated_images:
                    generated_image = response.generated_images[0]
                    # Save the image using PIL (the 'image' attribute contains PIL Image object)
                    generated_image.image.save(dest_path)
                    logger.info(f"   ✅ Successfully generated using '{model_name}' and saved to {dest_path}!")
                    success = True
                    break
                else:
                    logger.warning(f"   ⚠️ Model '{model_name}' returned empty response.")
            except Exception as e:
                logger.warning(f"   ⚠️ Model '{model_name}' failed: {e}")
                
        if not success:
            logger.error(f"   ❌ All models failed to generate portrait for {name_cn}.")
            
    logger.info("Portrait generation job completed.")

def main() -> None:
    parser = argparse.ArgumentParser(description="Generate signature portraits of legendary painters.")
    parser.add_argument("--api-key", help="Gemini API Key (overrides GEMINI_API_KEY environment variable)")
    parser.add_argument("--out-dir", help="Output directory (defaults to public/artworks)")
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("Error: GEMINI_API_KEY is not set. Please provide --api-key or set GEMINI_API_KEY environment variable.")
        sys.exit(1)
        
    # Default destination: D:\mnd\artist-web\public\artworks
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    default_dest = os.path.join(project_dir, "public", "artworks")
    
    dest_dir = args.out_dir or default_dest
    
    generate_portraits(api_key, dest_dir)

if __name__ == "__main__":
    main()
