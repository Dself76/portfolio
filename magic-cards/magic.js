
// Wait for the entire DOM to load before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Select all buttons within the '.row-buttons' container
    const rowButtons = document.querySelectorAll('.row-buttons .row-btn');
    
    // Add click counter
    let clickCount = 0;

    // Function to process and log card data based on the button pressed in a row
    function logCardsInRow(button) {
        // Increment click counter
        clickCount++;
        
        // Check if this is the third click
        if (clickCount === 3) {
            // Get the value from card-1 before redirecting
            const firstCardValue = document.querySelector('#card-1').textContent;
            // Redirect with the value as a URL parameter
            window.location.href = `your_card.html?number=${firstCardValue}`;
            return; // Exit the function early
        }

        // Initialize an array to store all current card numbers on the board
        let allNumbers = [];
        // Iterate over all possible card IDs from 1 to 49
        for(let i = 1; i <= 49; i++) {
            const card = document.querySelector(`#card-${i}`);
            // If a card exists with this ID, add its content (number) to the array
            if(card) {
                allNumbers.push(card.textContent);
            }
        }

        //should have comments here but not doing it because it gives away secret!!
        const columnIndex = parseInt(button.id.split('-')[1]);

        const selectedCards = [];
        
        // should have comments here but not doing it because it gives away secret!!
        for(let i = columnIndex; i <= 49; i += 7) {
            const card = document.querySelector(`#card-${i}`);
            if(card) {
                selectedCards.push(card.textContent);
            }
        }
        
        // should have comments here but not doing it because it gives away secret!!
        for(let pos = 0; pos < 7; pos++) {
            const targetCard = document.querySelector(`#card-${pos + 1}`);
            if(targetCard) {
                targetCard.textContent = selectedCards[pos];
            }
        }

        // Filter out numbers that were used in the first row to avoid duplicates
        const usedNumbers = new Set(selectedCards);
        const remainingNumbers = allNumbers.filter(num => !usedNumbers.has(num));

        // Randomly shuffle the remaining numbers
        for (let i = remainingNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingNumbers[i], remainingNumbers[j]] = [remainingNumbers[j], remainingNumbers[i]];
        }

        // Distribute the shuffled numbers across rows 2 to 7
        let numberIndex = 0;
        for(let row = 1; row < 7; row++) {
            for(let col = 0; col < 7; col++) {
                const cardId = (row * 7) + col + 1;
                const card = document.querySelector(`#card-${cardId}`);
                if(card && numberIndex < remainingNumbers.length) {
                    card.textContent = remainingNumbers[numberIndex++];
                }
            }
        }
    }

    // Add a click event listener to each button that triggers the logCardsInRow function
    rowButtons.forEach(button => {
        button.addEventListener('click', function() {
            logCardsInRow(this);
        });
    });
});