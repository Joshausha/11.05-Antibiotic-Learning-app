#!/usr/bin/env python3
"""
Network Visualization Testing Script
Captures current state and identifies UI improvement opportunities
"""

from playwright.sync_api import sync_playwright
import json
import os

OUTPUT_DIR = "/tmp/network-viz-test"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def test_network_visualization():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Enable console logging
        console_logs = []
        page.on('console', lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text
        }))

        print("🔗 Navigating to app...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')

        # Screenshot 1: Initial landing page
        page.screenshot(path=f'{OUTPUT_DIR}/01_landing_page.png', full_page=True)
        print(f"📸 Captured: 01_landing_page.png")

        # Find navigation to network visualization
        print("\n🔍 Discovering navigation elements...")
        nav_buttons = page.locator('button, a, [role="button"], [role="tab"]').all()
        nav_info = []
        for btn in nav_buttons[:20]:  # Limit to first 20
            try:
                text = btn.inner_text()
                if text.strip():
                    nav_info.append({
                        'text': text.strip()[:50],
                        'tag': btn.evaluate('el => el.tagName'),
                        'visible': btn.is_visible()
                    })
            except:
                pass

        print(f"   Found {len(nav_info)} navigation elements")
        for nav in nav_info[:10]:
            print(f"   - {nav['text']}")

        # Look for Network-related navigation
        network_patterns = ['network', 'visualization', 'graph', 'pathogen', 'relationship']
        network_nav = None

        for pattern in network_patterns:
            try:
                locator = page.locator(f'button:has-text("{pattern}"), a:has-text("{pattern}"), [role="tab"]:has-text("{pattern}")', timeout=2000).first
                if locator.is_visible():
                    network_nav = locator
                    print(f"\n✅ Found network navigation: '{pattern}'")
                    break
            except:
                continue

        # Try clicking to get to network view
        if network_nav:
            network_nav.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1000)

        # Screenshot 2: After navigation attempt
        page.screenshot(path=f'{OUTPUT_DIR}/02_after_nav.png', full_page=True)
        print(f"📸 Captured: 02_after_nav.png")

        # Look for SVG elements (D3.js network)
        print("\n🔍 Analyzing SVG/Network elements...")
        svg_elements = page.locator('svg').all()
        print(f"   Found {len(svg_elements)} SVG elements")

        for i, svg in enumerate(svg_elements[:5]):
            try:
                bbox = svg.bounding_box()
                if bbox and bbox['width'] > 100 and bbox['height'] > 100:
                    print(f"   SVG {i+1}: {bbox['width']:.0f}x{bbox['height']:.0f}px")
            except:
                pass

        # Look for network-specific elements
        print("\n🔍 Looking for network visualization components...")
        network_selectors = [
            '.network-visualization',
            '.network-container',
            '[class*="network"]',
            '[class*="Network"]',
            '.d3-visualization',
            '[class*="pathogen"]',
            '.force-directed',
            'svg circle',  # D3 nodes
            'svg line',    # D3 edges
            'svg g.node',
            'svg g.edge'
        ]

        component_info = {}
        for selector in network_selectors:
            try:
                elements = page.locator(selector).all()
                if elements:
                    component_info[selector] = len(elements)
                    print(f"   ✓ {selector}: {len(elements)} elements")
            except:
                pass

        # Screenshot 3: Try to find and screenshot the network component specifically
        network_container = None
        container_selectors = [
            '[class*="NetworkVisualization"]',
            '[class*="network-visualization"]',
            '.network-container',
            '[data-testid*="network"]',
            'svg[class*="network"]'
        ]

        for selector in container_selectors:
            try:
                el = page.locator(selector).first
                if el.is_visible():
                    network_container = el
                    print(f"\n✅ Found network container: {selector}")
                    break
            except:
                continue

        if network_container:
            network_container.screenshot(path=f'{OUTPUT_DIR}/03_network_component.png')
            print(f"📸 Captured: 03_network_component.png")

        # Analyze current styling
        print("\n🎨 Analyzing current styles...")
        styles_info = page.evaluate('''() => {
            const networkEl = document.querySelector('[class*="network"], [class*="Network"], svg');
            if (!networkEl) return null;

            const styles = window.getComputedStyle(networkEl);
            return {
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                fontFamily: styles.fontFamily,
                fontSize: styles.fontSize,
                width: styles.width,
                height: styles.height
            };
        }''')

        if styles_info:
            print(f"   Background: {styles_info.get('backgroundColor')}")
            print(f"   Font: {styles_info.get('fontFamily', '')[:50]}")

        # Get all class names for network-related elements
        print("\n📋 Collecting class names...")
        class_names = page.evaluate('''() => {
            const elements = document.querySelectorAll('[class*="network"], [class*="Network"], [class*="visualization"], svg, svg *');
            const classes = new Set();
            elements.forEach(el => {
                if (el.className && typeof el.className === 'string') {
                    el.className.split(' ').forEach(c => {
                        if (c.length > 2) classes.add(c);
                    });
                }
            });
            return Array.from(classes).slice(0, 30);
        }''')

        print(f"   Found {len(class_names)} unique classes")
        for cls in class_names[:15]:
            print(f"   - {cls}")

        # Screenshot 4: Full page with dev tools style info
        page.screenshot(path=f'{OUTPUT_DIR}/04_full_analysis.png', full_page=True)
        print(f"📸 Captured: 04_full_analysis.png")

        # Try interacting with filters/controls
        print("\n🎛️ Looking for filter controls...")
        filter_selectors = [
            '[class*="filter"]',
            '[class*="Filter"]',
            '[class*="control"]',
            'select',
            'input[type="range"]',
            '[role="slider"]'
        ]

        filter_info = {}
        for selector in filter_selectors:
            try:
                elements = page.locator(selector).all()
                if elements:
                    filter_info[selector] = len(elements)
            except:
                pass

        if filter_info:
            print(f"   Found filter controls: {filter_info}")

        # Save analysis report
        report = {
            'navigation_elements': nav_info,
            'svg_count': len(svg_elements),
            'component_info': component_info,
            'styles': styles_info,
            'class_names': class_names,
            'filter_controls': filter_info,
            'console_logs': console_logs[-20:]  # Last 20 logs
        }

        with open(f'{OUTPUT_DIR}/analysis_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        print(f"\n📊 Saved analysis report to {OUTPUT_DIR}/analysis_report.json")

        # Get page HTML structure for analysis
        html_structure = page.evaluate('''() => {
            const getStructure = (el, depth = 0) => {
                if (depth > 4 || !el) return null;
                const children = Array.from(el.children).slice(0, 5);
                return {
                    tag: el.tagName,
                    class: el.className?.toString?.()?.slice(0, 100) || '',
                    id: el.id || '',
                    children: children.map(c => getStructure(c, depth + 1)).filter(Boolean)
                };
            };
            return getStructure(document.body);
        }''')

        with open(f'{OUTPUT_DIR}/dom_structure.json', 'w') as f:
            json.dump(html_structure, f, indent=2)
        print(f"📄 Saved DOM structure to {OUTPUT_DIR}/dom_structure.json")

        browser.close()

        print(f"\n✅ Testing complete! Screenshots saved to {OUTPUT_DIR}/")
        print("\nFiles generated:")
        for f in os.listdir(OUTPUT_DIR):
            print(f"   - {f}")

if __name__ == '__main__':
    test_network_visualization()
