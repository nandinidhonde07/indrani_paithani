import os
from PIL import Image

def crop_screenshot_1():
    img_path = 'public/assets/products/screenshot_1.png'
    if not os.path.exists(img_path):
        print("screenshot_1.png not found")
        return
    img = Image.open(img_path)
    w, h = img.size
    print(f"screenshot_1 size: {w}x{h}")
    
    # screenshot_1 has 4 columns
    # Let's crop each product image (excluding the text below it)
    # The text starts around y = h * 0.78
    col_w = w / 4
    crop_h = int(h * 0.77)
    
    names = ['muniya_1', 'muniya_2', 'purple_parrot', 'paper_tissue']
    for i in range(4):
        box = (int(i * col_w), 0, int((i + 1) * col_w), crop_h)
        cropped = img.crop(box)
        cropped.save(f'public/assets/products/{names[i]}.png')
        print(f"Saved public/assets/products/{names[i]}.png")

def crop_screenshot_2():
    img_path = 'public/assets/products/screenshot_2.png'
    if not os.path.exists(img_path):
        print("screenshot_2.png not found")
        return
    img = Image.open(img_path)
    w, h = img.size
    print(f"screenshot_2 size: {w}x{h}")
    
    # screenshot_2 has 3 columns
    # Let's crop each product image (excluding text starting around y = h * 0.75)
    col_w = w / 3
    crop_h = int(h * 0.76)
    
    names = ['multicolor_tissue', 'all_over_brockate', 'silk_duppata']
    for i in range(3):
        box = (int(i * col_w), 0, int((i + 1) * col_w), crop_h)
        cropped = img.crop(box)
        cropped.save(f'public/assets/products/{names[i]}.png')
        print(f"Saved public/assets/products/{names[i]}.png")

if __name__ == '__main__':
    crop_screenshot_1()
    crop_screenshot_2()
