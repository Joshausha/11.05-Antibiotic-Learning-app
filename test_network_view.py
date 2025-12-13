#!/usr/bin/env python3
"""
Capture the actual Network visualization view
"""

from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = "/tmp/network-viz-test"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def test_network_view():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        print("🔗 Navigating to app...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')

        # Click on Pathogens tab
        print("\n📍 Clicking on Pathogens tab...")
        page.locator('button:has-text("Pathogens")').first.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1500)

        # Now click on the Network toggle button
        print("\n📍 Clicking on Network view toggle...")
        network_toggle = page.locator('button:has-text("Network")').first
        network_toggle.click()
        page.wait_for_timeout(3000)  # Wait for network to render

        # Screenshot the network view
        page.screenshot(path=f'{OUTPUT_DIR}/10_network_view_full.png', full_page=True)
        print(f"📸 Captured: 10_network_view_full.png")

        # Analyze the network visualization
        print("\n🔍 Analyzing network visualization...")

        # Count SVG elements
        svg_info = page.evaluate('''() => {
            const svgs = document.querySelectorAll('svg');
            const results = [];

            svgs.forEach((svg, i) => {
                const rect = svg.getBoundingClientRect();
                if (rect.width > 100 && rect.height > 100) {
                    results.push({
                        index: i,
                        width: rect.width,
                        height: rect.height,
                        circles: svg.querySelectorAll('circle').length,
                        lines: svg.querySelectorAll('line').length,
                        paths: svg.querySelectorAll('path').length,
                        texts: svg.querySelectorAll('text').length,
                        groups: svg.querySelectorAll('g').length
                    });
                }
            });
            return results;
        }''')

        print(f"\n📊 SVG Elements Found:")
        for svg in svg_info:
            print(f"   SVG: {svg['width']:.0f}x{svg['height']:.0f}px")
            print(f"      Nodes (circles): {svg['circles']}")
            print(f"      Edges (lines): {svg['lines']}")
            print(f"      Paths: {svg['paths']}")
            print(f"      Labels (text): {svg['texts']}")

        # Get colors used in the network
        colors = page.evaluate('''() => {
            const elements = document.querySelectorAll('svg circle, svg line, svg path, svg rect');
            const fills = new Set();
            const strokes = new Set();

            elements.forEach(el => {
                const fill = el.getAttribute('fill') || window.getComputedStyle(el).fill;
                const stroke = el.getAttribute('stroke') || window.getComputedStyle(el).stroke;
                if (fill && fill !== 'none' && fill !== 'transparent') fills.add(fill);
                if (stroke && stroke !== 'none' && stroke !== 'transparent') strokes.add(stroke);
            });

            return {
                fills: Array.from(fills).slice(0, 15),
                strokes: Array.from(strokes).slice(0, 15)
            };
        }''')

        print(f"\n🎨 Color Palette:")
        print(f"   Fills: {colors['fills'][:8]}")
        print(f"   Strokes: {colors['strokes'][:8]}")

        # Check for any canvas elements (alternative to SVG)
        canvas_count = page.locator('canvas').count()
        print(f"\n📐 Canvas elements: {canvas_count}")

        # Check for Cytoscape container
        cytoscape = page.locator('[class*="cytoscape"], [class*="Cytoscape"], .cy').count()
        print(f"   Cytoscape containers: {cytoscape}")

        # Look for specific network component classes
        network_classes = page.evaluate('''() => {
            const elements = document.querySelectorAll('[class*="network"], [class*="Network"], [class*="graph"], [class*="Graph"], [class*="force"], [class*="Force"]');
            const classes = [];
            elements.forEach(el => {
                if (el.className) {
                    classes.push(el.className.toString().slice(0, 100));
                }
            });
            return [...new Set(classes)].slice(0, 10);
        }''')

        print(f"\n📋 Network-related classes:")
        for cls in network_classes:
            print(f"   - {cls}")

        # Try to find and screenshot just the network container
        network_container = page.locator('[class*="NetworkVisualization"], [class*="network-visualization"], [class*="pathogen-network"], svg').first
        try:
            bbox = network_container.bounding_box()
            if bbox and bbox['width'] > 200:
                network_container.screenshot(path=f'{OUTPUT_DIR}/11_network_component.png')
                print(f"\n📸 Captured: 11_network_component.png ({bbox['width']:.0f}x{bbox['height']:.0f})")
        except Exception as e:
            print(f"\n⚠️ Could not capture network component: {e}")

        # Interact with the visualization - try hovering over nodes
        print("\n🖱️ Testing hover interactions...")
        circles = page.locator('svg circle').all()
        print(f"   Found {len(circles)} circles (nodes)")

        if circles:
            # Hover over first few nodes
            for i, circle in enumerate(circles[:3]):
                try:
                    circle.hover()
                    page.wait_for_timeout(500)
                    page.screenshot(path=f'{OUTPUT_DIR}/12_hover_node_{i}.png', full_page=True)
                    print(f"   📸 Captured hover state for node {i}")
                except:
                    pass

        # Check for tooltips
        tooltips = page.locator('[class*="tooltip"], [class*="Tooltip"], [role="tooltip"]').all()
        print(f"\n💬 Tooltip elements: {len(tooltips)}")

        # Check filter controls on the network view
        print("\n🎛️ Filter Controls:")
        selects = page.locator('select').all()
        for sel in selects:
            try:
                options = sel.locator('option').all_inner_texts()
                print(f"   Select: {options[:4]}...")
            except:
                pass

        # Final full-page screenshot
        page.screenshot(path=f'{OUTPUT_DIR}/13_final_state.png', full_page=True)
        print(f"\n📸 Captured: 13_final_state.png")

        browser.close()

        print(f"\n✅ Network view testing complete!")
        print("\nScreenshots available:")
        for f in sorted(os.listdir(OUTPUT_DIR)):
            if f.endswith('.png'):
                print(f"   - {f}")

if __name__ == '__main__':
    test_network_view()
