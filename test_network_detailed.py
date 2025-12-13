#!/usr/bin/env python3
"""
Detailed Network Visualization Testing - Navigate to Visualizations page
"""

from playwright.sync_api import sync_playwright
import json
import os

OUTPUT_DIR = "/tmp/network-viz-test"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def test_network_detailed():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        print("🔗 Navigating to app...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')

        # Click on Visualizations in the nav
        print("\n📍 Clicking on Visualizations tab...")
        viz_button = page.locator('button:has-text("Visualizations")').first
        viz_button.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)  # Wait for animations

        # Screenshot: Visualizations page
        page.screenshot(path=f'{OUTPUT_DIR}/05_visualizations_page.png', full_page=True)
        print(f"📸 Captured: 05_visualizations_page.png")

        # Look for network-related tabs/buttons on this page
        print("\n🔍 Looking for network visualization options...")
        network_options = page.locator('button, [role="tab"], a').filter(has_text='Network').all()
        print(f"   Found {len(network_options)} Network-related options")

        for i, opt in enumerate(network_options):
            try:
                text = opt.inner_text()
                print(f"   {i+1}. {text.strip()[:50]}")
            except:
                pass

        # Try clicking on Network visualization option
        if network_options:
            print("\n📍 Clicking on first Network option...")
            network_options[0].click()
            page.wait_for_timeout(2000)
            page.screenshot(path=f'{OUTPUT_DIR}/06_network_view.png', full_page=True)
            print(f"📸 Captured: 06_network_view.png")

        # Look for pathogen network specifically
        pathogen_network = page.locator('button, [role="tab"]').filter(has_text='Pathogen').all()
        if pathogen_network:
            print(f"\n📍 Found {len(pathogen_network)} Pathogen options, clicking...")
            pathogen_network[0].click()
            page.wait_for_timeout(2000)
            page.screenshot(path=f'{OUTPUT_DIR}/07_pathogen_network.png', full_page=True)
            print(f"📸 Captured: 07_pathogen_network.png")

        # Now analyze the current view in detail
        print("\n🔍 Analyzing current visualization...")

        # Count SVG elements and their children
        svg_analysis = page.evaluate('''() => {
            const svgs = document.querySelectorAll('svg');
            const results = [];

            svgs.forEach((svg, i) => {
                const rect = svg.getBoundingClientRect();
                if (rect.width > 200 && rect.height > 200) {
                    results.push({
                        index: i,
                        width: rect.width,
                        height: rect.height,
                        circles: svg.querySelectorAll('circle').length,
                        lines: svg.querySelectorAll('line').length,
                        paths: svg.querySelectorAll('path').length,
                        groups: svg.querySelectorAll('g').length,
                        texts: svg.querySelectorAll('text').length,
                        className: svg.className?.baseVal || '',
                        id: svg.id || ''
                    });
                }
            });
            return results;
        }''')

        print(f"\n📊 Large SVG Analysis:")
        for svg in svg_analysis:
            print(f"   SVG {svg['index']}: {svg['width']:.0f}x{svg['height']:.0f}px")
            print(f"      Circles: {svg['circles']}, Lines: {svg['lines']}, Paths: {svg['paths']}")
            print(f"      Groups: {svg['groups']}, Text elements: {svg['texts']}")

        # Get color palette being used
        colors_used = page.evaluate('''() => {
            const elements = document.querySelectorAll('svg circle, svg rect, svg path');
            const colors = new Set();
            elements.forEach(el => {
                const fill = el.getAttribute('fill');
                const stroke = el.getAttribute('stroke');
                if (fill && fill !== 'none') colors.add(fill);
                if (stroke && stroke !== 'none') colors.add(stroke);
            });
            return Array.from(colors).slice(0, 20);
        }''')

        print(f"\n🎨 Colors used in SVG: {len(colors_used)}")
        for color in colors_used[:10]:
            print(f"   - {color}")

        # Check for filter controls
        print("\n🎛️ Filter/Control Analysis...")
        controls = page.evaluate('''() => {
            const selects = document.querySelectorAll('select');
            const sliders = document.querySelectorAll('input[type="range"]');
            const buttons = document.querySelectorAll('button');

            return {
                selectCount: selects.length,
                sliderCount: sliders.length,
                buttonCount: buttons.length,
                selectOptions: Array.from(selects).map(s => ({
                    id: s.id,
                    options: Array.from(s.options).map(o => o.text).slice(0, 5)
                }))
            };
        }''')

        print(f"   Selects: {controls['selectCount']}, Sliders: {controls['sliderCount']}, Buttons: {controls['buttonCount']}")
        for select in controls['selectOptions']:
            print(f"   Select options: {select['options']}")

        # Take a focused screenshot of just the main content area
        main_content = page.locator('main, [role="main"], .main-content, #root > div > div').first
        if main_content:
            try:
                main_content.screenshot(path=f'{OUTPUT_DIR}/08_main_content.png')
                print(f"📸 Captured: 08_main_content.png")
            except:
                pass

        # Look for any visualization containers
        viz_containers = page.locator('[class*="visualization"], [class*="Visualization"], [class*="network"], [class*="Network"], [class*="graph"], [class*="Graph"]').all()
        print(f"\n🖼️ Found {len(viz_containers)} visualization containers")

        for i, container in enumerate(viz_containers[:3]):
            try:
                bbox = container.bounding_box()
                if bbox and bbox['width'] > 100:
                    container.screenshot(path=f'{OUTPUT_DIR}/09_viz_container_{i}.png')
                    print(f"📸 Captured: 09_viz_container_{i}.png ({bbox['width']:.0f}x{bbox['height']:.0f})")
            except Exception as e:
                print(f"   Could not capture container {i}: {e}")

        # Get the full page HTML structure for the visualization area
        viz_structure = page.evaluate('''() => {
            const viz = document.querySelector('[class*="visualization"], [class*="Visualization"], main');
            if (!viz) return null;

            const getStructure = (el, depth = 0) => {
                if (depth > 5 || !el) return null;
                const children = Array.from(el.children).slice(0, 8);
                return {
                    tag: el.tagName,
                    class: el.className?.toString?.()?.slice(0, 150) || '',
                    id: el.id || '',
                    role: el.getAttribute('role') || '',
                    childCount: el.children.length,
                    children: children.map(c => getStructure(c, depth + 1)).filter(Boolean)
                };
            };
            return getStructure(viz);
        }''')

        with open(f'{OUTPUT_DIR}/viz_structure.json', 'w') as f:
            json.dump(viz_structure, f, indent=2)
        print(f"\n📄 Saved visualization structure to viz_structure.json")

        # Save the detailed analysis
        analysis = {
            'svg_analysis': svg_analysis,
            'colors_used': colors_used,
            'controls': controls,
            'viz_container_count': len(viz_containers)
        }

        with open(f'{OUTPUT_DIR}/detailed_analysis.json', 'w') as f:
            json.dump(analysis, f, indent=2)
        print(f"📊 Saved detailed analysis to detailed_analysis.json")

        browser.close()

        print(f"\n✅ Detailed testing complete!")
        print("\nAll files in output directory:")
        for f in sorted(os.listdir(OUTPUT_DIR)):
            print(f"   - {f}")

if __name__ == '__main__':
    test_network_detailed()
