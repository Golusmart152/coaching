import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Listen for all console events and print them to the terminal
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))

        # Go to the app and log in
        await page.goto("http://localhost:5000")
        await page.get_by_placeholder("Email").fill("admin@institute.com")
        await page.get_by_placeholder("Password").fill("password")
        await page.get_by_role("button", name="Login", exact=True).click()
        await expect(page.get_by_text("Institute Admin Dashboard")).to_be_visible()

        # Navigate directly to the Students page
        await page.goto("http://localhost:5000/#/students")

        # Wait for the students page to load (cards view)
        await expect(page.get_by_role("heading", name="Student Management")).to_be_visible()

        # Click the "New Student Registration" card to trigger the error
        await page.get_by_text("New Student Registration").click()

        # Wait for a moment to let the app crash and log the error
        await page.wait_for_timeout(2000)

        # Take a screenshot to observe the final state
        await page.screenshot(path="jules-scratch/verification/crash_screenshot.png")

        await browser.close()

if __name__ == '__main__':
    import os
    asyncio.run(main())