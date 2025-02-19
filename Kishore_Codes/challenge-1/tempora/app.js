/**
 * @file app.js
 * @description This file contains the main application logic for the challenge-1 project.
 * It utilizes the readline module to handle input and output operations.
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Parses a time string in HH:MM format and returns the total minutes.
 * @param {string} time - The time string in HH:MM format.
 * @returns {number} - The total minutes.
 * @throws {Error} - Throws an error if the time format is invalid.
 */
function parseTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error('Invalid time format. Please enter time in HH:MM format.');
    }
    return hours * 60 + minutes;
}

/**
 * Calculates the difference in minutes between two times.
 * @param {string} grandTime - The Grand Clock Tower time in HH:MM format.
 * @param {string} clockTime - The town clock time in HH:MM format.
 * @returns {number} - The difference in minutes.
 */
function timeDifference(grandTime, clockTime) {
    const grandTotalMinutes = parseTimeToMinutes(grandTime);
    const clockTotalMinutes = parseTimeToMinutes(clockTime);
    return clockTotalMinutes - grandTotalMinutes;
}

/**
 * Prompts the user for input and calculates the time differences.
 */
function promptUserForTimeDifferences() {
    rl.question('Enter the Grand Clock Tower time (HH:MM): ', (grandClockTime) => {
        try {
            parseTimeToMinutes(grandClockTime); // Validate grandClockTime format
        } catch (error) {
            console.error(error.message);
            rl.close();
            return;
        }

        rl.question('Enter the town clocks times separated by commas (HH:MM,HH:MM,...): ', (townClocksInput) => {
            const townClocks = townClocksInput.split(',').map(time => time.trim());
            try {
                const timeDifferences = townClocks.map(clockTime => {
                    parseTimeToMinutes(clockTime); // Validate each clockTime format
                    return timeDifference(grandClockTime, clockTime);
                });

                console.log('Time differences (in minutes):', timeDifferences);
            } catch (error) {
                console.error(error.message);
            } finally {
                rl.close();
            }
        });
    });
}

// Start the prompt
promptUserForTimeDifferences();