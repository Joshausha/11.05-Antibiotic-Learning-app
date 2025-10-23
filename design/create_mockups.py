#!/usr/bin/env python3
"""
Cytoscape UI Redesign Mockup Generator
Creates visual mockups for 3 proposed UI designs
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Configuration
WIDTH = 1200
HEIGHT = 800
BG_COLOR = '#f9fafb'
PANEL_COLOR = '#ffffff'
HEADER_COLOR = '#f3f4f6'
SIDEBAR_COLOR = '#ffffff'
BUTTON_COLOR = '#3b82f6'
TEXT_COLOR = '#1f2937'
BORDER_COLOR = '#d1d5db'
NETWORK_BG = '#e5e7eb'

def draw_text(draw, text, position, size=14, color=TEXT_COLOR, bold=False):
    """Draw text at position (trying to use system font)"""
    try:
        # Try to use a system font
        if bold:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
        else:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    draw.text(position, text, fill=color, font=font)

def draw_button(draw, x, y, width, height, text, color=BUTTON_COLOR):
    """Draw a button"""
    draw.rectangle([x, y, x + width, y + height], fill=color, outline=BORDER_COLOR)
    # Center text (approximate)
    text_x = x + width // 2 - len(text) * 3
    text_y = y + height // 2 - 7
    draw_text(draw, text, (text_x, text_y), color='#ffffff')

def draw_network_nodes(draw, x, y, width, height):
    """Draw simplified network visualization"""
    # Draw some circles and lines to represent network
    import random
    random.seed(42)  # Consistent layout

    # Draw edges first
    for _ in range(15):
        x1 = x + random.randint(50, width - 50)
        y1 = y + random.randint(50, height - 50)
        x2 = x + random.randint(50, width - 50)
        y2 = y + random.randint(50, height - 50)
        draw.line([x1, y1, x2, y2], fill='#9ca3af', width=1)

    # Draw nodes
    colors = ['#6a0dad', '#d9534f', '#5bc0de', '#16a085', '#27ae60']
    for _ in range(20):
        cx = x + random.randint(50, width - 50)
        cy = y + random.randint(50, height - 50)
        radius = random.randint(15, 25)
        color = random.choice(colors)
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                    fill=color, outline='#333333', width=2)

def create_mockup_1_floating_sidebar():
    """Design 1: Floating Sidebar Dashboard"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Header (40px)
    draw.rectangle([0, 0, WIDTH, 40], fill=HEADER_COLOR, outline=BORDER_COLOR)
    draw_text(draw, "Pathogen-Antibiotic Network", (60, 12), size=18, bold=True)

    # Hamburger menu icon
    for i in range(3):
        draw.rectangle([15, 12 + i * 8, 40, 16 + i * 8], fill=TEXT_COLOR)

    # Full-screen network visualization
    network_x, network_y = 0, 40
    network_width, network_height = WIDTH, HEIGHT - 40
    draw.rectangle([network_x, network_y, network_x + network_width, network_y + network_height],
                  fill=NETWORK_BG)
    draw_network_nodes(draw, network_x, network_y, network_width, network_height)

    # Floating sidebar (280px width) - shown open
    sidebar_width = 280
    draw.rectangle([0, 40, sidebar_width, HEIGHT], fill=SIDEBAR_COLOR, outline=BORDER_COLOR)

    # Sidebar content
    y_pos = 60
    draw_text(draw, "Controls", (20, y_pos), size=16, bold=True)
    y_pos += 40

    # Layout section
    draw_text(draw, "Layout", (20, y_pos), size=14, bold=True)
    y_pos += 25
    draw.rectangle([20, y_pos, 260, y_pos + 35], fill='#ffffff', outline=BORDER_COLOR)
    draw_text(draw, "Force-Directed (CoSE)", (30, y_pos + 10), size=12)
    y_pos += 50

    # Filters section
    draw_text(draw, "Filters", (20, y_pos), size=14, bold=True)
    y_pos += 25
    draw.rectangle([20, y_pos, 260, y_pos + 120], fill='#f9fafb', outline=BORDER_COLOR)
    draw_text(draw, "☑ Pathogens", (30, y_pos + 10), size=11)
    draw_text(draw, "☑ Antibiotics", (30, y_pos + 30), size=11)
    draw_text(draw, "☑ Gram-positive", (30, y_pos + 50), size=11)
    draw_text(draw, "☑ Gram-negative", (30, y_pos + 70), size=11)
    draw_text(draw, "☑ Susceptible edges", (30, y_pos + 90), size=11)
    y_pos += 135

    # Legend section (collapsed)
    draw.rectangle([20, y_pos, 260, y_pos + 35], fill='#f3f4f6', outline=BORDER_COLOR)
    draw_text(draw, "Legend ▼", (30, y_pos + 10), size=12, bold=True)

    # Semi-transparent backdrop overlay
    overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([sidebar_width, 40, WIDTH, HEIGHT], fill=(0, 0, 0, 50))
    img.paste(overlay, (0, 0), overlay)

    # Add label
    draw_text(draw, "Design 1: Floating Sidebar", (WIDTH - 250, HEIGHT - 30),
             size=16, bold=True, color='#000000')

    return img

def create_mockup_2_bottom_control_bar():
    """Design 2: Bottom Control Bar"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Minimal header (30px)
    draw.rectangle([0, 0, WIDTH, 30], fill=HEADER_COLOR, outline=BORDER_COLOR)
    draw_text(draw, "Pathogen-Antibiotic Network", (20, 8), size=16, bold=True)

    # Full-screen network visualization
    network_height = HEIGHT - 30 - 60
    draw.rectangle([0, 30, WIDTH, 30 + network_height], fill=NETWORK_BG)
    draw_network_nodes(draw, 0, 30, WIDTH, network_height)

    # Bottom control bar (60px, compact state)
    bar_y = HEIGHT - 60
    draw.rectangle([0, bar_y, WIDTH, HEIGHT], fill=PANEL_COLOR, outline=BORDER_COLOR)

    # Quick access buttons
    button_y = bar_y + 10
    button_width = 120
    button_height = 40
    spacing = 20

    x_pos = 20
    draw_button(draw, x_pos, button_y, button_width, button_height, "Filters")
    x_pos += button_width + spacing
    draw_button(draw, x_pos, button_y, button_width, button_height, "Layout")
    x_pos += button_width + spacing
    draw_button(draw, x_pos, button_y, button_width, button_height, "Legend")
    x_pos += button_width + spacing

    # Reset button (different color)
    draw_button(draw, x_pos, button_y, 100, button_height, "Reset", color='#ef4444')

    # Expand indicator
    draw_text(draw, "▲ Click to expand", (WIDTH - 150, bar_y + 22), size=11, color='#6b7280')

    # Add label
    draw_text(draw, "Design 2: Bottom Control Bar", (WIDTH - 280, 5),
             size=16, bold=True, color='#000000')

    return img

def create_mockup_3_corner_panels():
    """Design 3: Corner Panels"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # No header - full screen network
    draw.rectangle([0, 0, WIDTH, HEIGHT], fill=NETWORK_BG)
    draw_network_nodes(draw, 0, 0, WIDTH, HEIGHT)

    # Top-right: Layout selector (150x80)
    panel_width, panel_height = 150, 80
    panel_x, panel_y = WIDTH - panel_width - 20, 20
    draw.rectangle([panel_x, panel_y, panel_x + panel_width, panel_y + panel_height],
                  fill=SIDEBAR_COLOR, outline=BORDER_COLOR)
    draw_text(draw, "Layout", (panel_x + 10, panel_y + 10), size=12, bold=True)
    draw.rectangle([panel_x + 10, panel_y + 35, panel_x + panel_width - 10, panel_y + 65],
                  fill='#ffffff', outline=BORDER_COLOR)
    draw_text(draw, "Force-Directed", (panel_x + 15, panel_y + 42), size=10)

    # Bottom-left: Filter controls (300x400)
    filter_width, filter_height = 300, 400
    filter_x, filter_y = 20, HEIGHT - filter_height - 20
    draw.rectangle([filter_x, filter_y, filter_x + filter_width, filter_y + filter_height],
                  fill=SIDEBAR_COLOR, outline=BORDER_COLOR)

    # Filter header with collapse button
    draw.rectangle([filter_x, filter_y, filter_x + filter_width, filter_y + 35],
                  fill=HEADER_COLOR, outline=BORDER_COLOR)
    draw_text(draw, "Filters", (filter_x + 10, filter_y + 10), size=14, bold=True)
    draw_text(draw, "✕", (filter_x + filter_width - 25, filter_y + 8), size=16, bold=True)

    # Filter content
    y_pos = filter_y + 50
    draw_text(draw, "Node Types", (filter_x + 10, y_pos), size=12, bold=True)
    y_pos += 25
    draw_text(draw, "☑ Pathogens", (filter_x + 15, y_pos), size=11)
    draw_text(draw, "☑ Antibiotics", (filter_x + 150, y_pos), size=11)
    y_pos += 30

    draw_text(draw, "Gram Stain", (filter_x + 10, y_pos), size=12, bold=True)
    y_pos += 25
    draw_text(draw, "☑ Gram-positive", (filter_x + 15, y_pos), size=10)
    draw_text(draw, "☑ Gram-negative", (filter_x + 150, y_pos), size=10)
    y_pos += 20
    draw_text(draw, "☑ Atypical", (filter_x + 15, y_pos), size=10)
    draw_text(draw, "☑ Acid-fast", (filter_x + 150, y_pos), size=10)
    y_pos += 30

    draw_text(draw, "Relationships", (filter_x + 10, y_pos), size=12, bold=True)
    y_pos += 25
    draw_text(draw, "☑ Susceptible", (filter_x + 15, y_pos), size=10)
    draw_text(draw, "☑ Resistant", (filter_x + 150, y_pos), size=10)

    # Reset button at bottom
    draw_button(draw, filter_x + 10, filter_y + filter_height - 50,
               filter_width - 20, 35, "Reset All Filters", color='#3b82f6')

    # Bottom-right: Legend (250x350)
    legend_width, legend_height = 250, 350
    legend_x, legend_y = WIDTH - legend_width - 20, HEIGHT - legend_height - 20
    draw.rectangle([legend_x, legend_y, legend_x + legend_width, legend_y + legend_height],
                  fill=SIDEBAR_COLOR, outline=BORDER_COLOR)

    # Legend header
    draw.rectangle([legend_x, legend_y, legend_x + legend_width, legend_y + 35],
                  fill=HEADER_COLOR, outline=BORDER_COLOR)
    draw_text(draw, "Legend", (legend_x + 10, legend_y + 10), size=14, bold=True)
    draw_text(draw, "✕", (legend_x + legend_width - 25, legend_y + 8), size=16, bold=True)

    # Legend content
    y_pos = legend_y + 50
    draw_text(draw, "Node Types", (legend_x + 10, y_pos), size=11, bold=True)
    y_pos += 25
    draw.ellipse([legend_x + 15, y_pos, legend_x + 30, y_pos + 15],
                fill='#6a0dad', outline='#333333')
    draw_text(draw, "Pathogens", (legend_x + 40, y_pos), size=10)
    y_pos += 25
    draw.rectangle([legend_x + 15, y_pos, legend_x + 30, y_pos + 15],
                  fill='#16a085', outline='#333333')
    draw_text(draw, "Antibiotics", (legend_x + 40, y_pos), size=10)
    y_pos += 35

    draw_text(draw, "Gram Stain", (legend_x + 10, y_pos), size=11, bold=True)
    y_pos += 25
    colors = [('#6a0dad', 'Gram-positive'), ('#d9534f', 'Gram-negative'),
             ('#5bc0de', 'Atypical')]
    for color, label in colors:
        draw.ellipse([legend_x + 15, y_pos, legend_x + 28, y_pos + 13],
                    fill=color, outline='#333333')
        draw_text(draw, label, (legend_x + 35, y_pos), size=9)
        y_pos += 20

    y_pos += 15
    draw_text(draw, "Relationships", (legend_x + 10, y_pos), size=11, bold=True)
    y_pos += 25
    draw.line([legend_x + 15, y_pos + 5, legend_x + 35, y_pos + 5],
             fill='#27ae60', width=3)
    draw_text(draw, "Susceptible", (legend_x + 45, y_pos), size=9)
    y_pos += 20
    draw.line([legend_x + 15, y_pos + 5, legend_x + 35, y_pos + 5],
             fill='#e74c3c', width=3)
    draw_text(draw, "Resistant", (legend_x + 45, y_pos), size=9)

    # Add label
    draw_text(draw, "Design 3: Corner Panels", (40, 40),
             size=16, bold=True, color='#000000')

    return img

def main():
    """Generate all three mockups"""
    output_dir = os.path.dirname(os.path.abspath(__file__))

    print("Generating Design 1: Floating Sidebar...")
    mockup1 = create_mockup_1_floating_sidebar()
    mockup1.save(os.path.join(output_dir, 'mockup_1_floating_sidebar.png'))
    print("  ✓ Saved mockup_1_floating_sidebar.png")

    print("Generating Design 2: Bottom Control Bar...")
    mockup2 = create_mockup_2_bottom_control_bar()
    mockup2.save(os.path.join(output_dir, 'mockup_2_bottom_control_bar.png'))
    print("  ✓ Saved mockup_2_bottom_control_bar.png")

    print("Generating Design 3: Corner Panels...")
    mockup3 = create_mockup_3_corner_panels()
    mockup3.save(os.path.join(output_dir, 'mockup_3_corner_panels.png'))
    print("  ✓ Saved mockup_3_corner_panels.png")

    print("\n✅ All mockups generated successfully!")
    print(f"📁 Location: {output_dir}")

if __name__ == '__main__':
    main()
