// cardGame.test.js
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Card Game Test Suite', () => {
    let dom;
    let document;
    let window;
    
    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
                <body>
                    <div class="row-buttons">
                        <button class="row-btn" id="btn-1">Button 1</button>
                        <button class="row-btn" id="btn-2">Button 2</button>
                        <button class="row-btn" id="btn-3">Button 3</button>
                    </div>
                    ${Array.from({ length: 49 }, (_, i) => 
                        `<div class="card" id="card-${i + 1}">${i + 1}</div>`
                    ).join('')}
                </body>
            </html>
        `);
        
        document = dom.window.document;
        window = dom.window;
        delete window.location;
        window.location = { href: '' };
    });

    // EDGE TESTING - Testing boundary conditions and extreme cases
    describe('Edge Cases', () => {
        test('Handles zero cards in grid', () => {
            // Remove all cards
            document.querySelectorAll('.card').forEach(card => card.remove());
            const button = document.querySelector('#btn-1');
            expect(() => button.click()).not.toThrow();
        });

        test('Handles missing button elements', () => {
            document.querySelectorAll('.row-btn').forEach(btn => btn.remove());
            expect(() => document.querySelector('#btn-1').click()).toThrow();
        });

        test('Handles non-numeric card values', () => {
            const firstCard = document.querySelector('#card-1');
            firstCard.textContent = 'ABC';
            const button = document.querySelector('#btn-1');
            expect(() => button.click()).not.toThrow();
        });
    });

    // INTEGRATION/PATH TESTING - Testing typical user flows and interactions
    describe('Integration Paths', () => {
        test('Complete game flow - three button clicks', () => {
            const button = document.querySelector('#btn-1');
            
            // First click - check card movement
            button.click();
            const firstRowAfterClick1 = Array.from({ length: 7 }, (_, i) => 
                document.querySelector(`#card-${i + 1}`).textContent
            );
            expect(firstRowAfterClick1).not.toEqual(['1', '2', '3', '4', '5', '6', '7']);

            // Second click - verify shuffle
            button.click();
            const firstRowAfterClick2 = Array.from({ length: 7 }, (_, i) => 
                document.querySelector(`#card-${i + 1}`).textContent
            );
            expect(firstRowAfterClick2).not.toEqual(firstRowAfterClick1);

            // Third click - verify redirect
            button.click();
            expect(window.location.href).toContain('your_card.html?number=');
        });

        test('Multiple button interaction flow', () => {
            const buttons = document.querySelectorAll('.row-btn');
            
            // Click different buttons in sequence
            buttons[0].click();
            buttons[1].click();
            
            // Verify different patterns based on button clicks
            const firstRowCards = Array.from({ length: 7 }, (_, i) => 
                document.querySelector(`#card-${i + 1}`).textContent
            );
            expect(firstRowCards.length).toBe(7);
        });
    });

    // LIMIT TESTING - Testing performance and system boundaries
    describe('Limit Testing', () => {
        test('Handles maximum allowed clicks', () => {
            const button = document.querySelector('#btn-1');
            
            // Test many clicks beyond the 3-click limit
            for(let i = 0; i < 10; i++) {
                button.click();
            }
            
            // Verify system remains stable
            expect(window.location.href).toContain('your_card.html?number=');
        });

        test('Handles rapid button clicks', async () => {
            const button = document.querySelector('#btn-1');
            
            // Simulate rapid clicking
            await Promise.all([
                button.click(),
                button.click(),
                button.click()
            ]);
            
            expect(window.location.href).toContain('your_card.html?number=');
        });

        test('Handles large card values', () => {
            // Set an extremely large number
            document.querySelector('#card-1').textContent = '999999999999999';
            const button = document.querySelector('#btn-1');
            expect(() => button.click()).not.toThrow();
        });
    });

    // Utility Tests - Helper function testing
    describe('Utility Functions', () => {
        test('URL parameter handling', () => {
            const displayDom = new JSDOM(`
                <!DOCTYPE html>
                <html>
                    <body>
                        <div id="display-number"></div>
                    </body>
                </html>
            `, {
                url: 'http://localhost/your_card.html?number=42'
            });
            
            const displayDocument = displayDom.window.document;
            const urlParams = new URLSearchParams(displayDom.window.location.search);
            const number = urlParams.get('number');
            displayDocument.getElementById('display-number').textContent = number;
            
            expect(displayDocument.getElementById('display-number').textContent).toBe('42');
        });
    });
});

// To run these tests, i  need to do package.json:
/* but i was having a problem with 25 and it seems to have fixed itself but it is the only element in 49 that had a problem, just funtioned different so i am trying to apply different test to find out why, it cannot be limits or edge since it is in the middle,
/*
{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^27.0.6",
    "jsdom": "^16.6.0"
  }
}
*/