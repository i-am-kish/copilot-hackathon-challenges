/**
 * @file app.js
 * @description This file contains the main application logic for the challenge-2 project.
 * It utilizes the axios module to make HTTP requests.
 */
const axios = require('axios');

// Function to fetch the scroll content from a given URL
async function fetchScrollContent(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching the scroll content:', error);
        return null;
    }
}

// Function to extract secrets from the content using regular expressions
function extractSecrets(content) {
    const secretPattern = /\{\*(.*?)\*\}/g;
    const secrets = [];
    let match;

    // Extract all matches of the pattern from the content
    while ((match = secretPattern.exec(content)) !== null) {
        secrets.push(match[1].trim());
    }

    return secrets;
}

// Function to print the extracted secrets
function printSecrets(secrets) {
    console.log('Extracted Secrets:');
    secrets.forEach((secret, index) => {
        console.log(`${index + 1}. ${secret}`);
    });
}

// Main function to execute the tasks
async function main() {
    const scrollUrl = 'https://raw.githubusercontent.com/sombaner/copilot-hackathon-challenges/main/Data/Scrolls.txt';
    try {
        const scrollContent = await fetchScrollContent(scrollUrl);

        if (scrollContent) {
            const secrets = extractSecrets(scrollContent);
            printSecrets(secrets);
        } else {
            console.log('Failed to retrieve the scroll content.');
        }
    } catch (error) {
        console.error('An error occurred in the main function:', error);
    }
}

// Execute the main function
main();