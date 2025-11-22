import { test, expect } from '@playwright/test';

test.describe('AI and Code Input', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('should render a diagram when Mermaid code is entered', async ({ page }) => {
    const codeInput = page.locator('textarea[placeholder*="Enter Mermaid code"]');
    await codeInput.fill('graph TD;\nA-->B;\nA-->C;\nB-->D;\nC-->D;');
    
    // Wait for the diagram to render
    await page.waitForSelector('svg');
    
    const diagram = page.locator('svg');
    await expect(diagram).toBeVisible();
  });

  test('should generate a diagram from a text prompt', async ({ page }) => {
    const promptInput = page.locator('textarea[placeholder*="Describe your diagram"]');
    await promptInput.fill('Create a simple flowchart with a start, a middle, and an end');
    
    await page.click('button:has-text("Generate")');
    
    // Wait for the AI to generate the diagram
    await page.waitForSelector('svg');
    
    const codeInput = page.locator('textarea[placeholder*="Enter Mermaid code"]');
    const diagram = page.locator('svg');

    await expect(codeInput).not.toHaveValue('');
    await expect(diagram).toBeVisible();
  });

  test('should enhance an existing diagram from a text prompt', async ({ page }) => {
    const codeInput = page.locator('textarea[placeholder*="Enter Mermaid code"]');
    await codeInput.fill('graph TD;\nA-->B;');
    
    const enhanceInput = page.locator('textarea[placeholder*="Describe the changes"]');
    await enhanceInput.fill('Add a node C after B');
    
    await page.click('button:has-text("Enhance")');
    
    // Wait for the AI to enhance the diagram
    await page.waitForFunction(() => {
        const textarea = document.querySelector('textarea[placeholder*="Enter Mermaid code"]');
        return textarea && textarea.value.includes('C');
    });
    
    const diagram = page.locator('svg');
    
    const updatedCode = await codeInput.inputValue();
    expect(updatedCode).toContain('C');
    await expect(diagram).toBeVisible();
  });
});
