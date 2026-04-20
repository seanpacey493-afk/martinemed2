import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from pathlib import Path
import sys

def download_attachments():
    base_url = 'https://firstkeyhomes.com'
    attachments_dir = Path('attachments')
    
    # Find all HTML files recursively
    html_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.lower().endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"Found {len(html_files)} HTML files.")
    
    downloaded = 0
    skipped = 0
    errors = 0
    
    for html_path in html_files:
        print(f"Processing {html_path}...")
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            img_tags = soup.find_all('img', src=lambda x: x and x.startswith('/attachments/'))
            
            for img in img_tags:
                src = img['src']
                full_url = urljoin(base_url, src)
                
                # Parse path: /attachments/hash/filename.ext -> attachments/hash/filename.ext
                parsed_url = urlparse(full_url)
                path_parts = Path(parsed_url.path).parts[1:]  # Skip leading empty
                save_path = attachments_dir / Path(*path_parts)
                
                # Create directory if needed
                save_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Skip if exists
                if save_path.exists():
                    print(f"  Skip: {save_path} already exists")
                    skipped += 1
                    continue
                
                # Download
                try:
                    response = requests.get(full_url, timeout=10)
                    response.raise_for_status()
                    
                    with open(save_path, 'wb') as f:
                        f.write(response.content)
                    
                    print(f"  Downloaded: {save_path}")
                    downloaded += 1
                    
                except requests.RequestException as e:
                    print(f"  Error downloading {full_url}: {e}")
                    errors += 1
        
        except Exception as e:
            print(f"Error processing {html_path}: {e}")
            errors += 1
    #ZWRZ20ct1JcB3acb -supabase pwd
    print("\nSummary:")
    print(f"Downloaded: {downloaded}")
    print(f"Skipped (exists): {skipped}")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    download_attachments()
