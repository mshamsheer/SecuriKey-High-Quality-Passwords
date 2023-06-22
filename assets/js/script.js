'use strict';

const fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'italianlime', 'jackfruit', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'pineapple', 'quince', 'raspberry', 'strawberry', 'tangerine', 'uglifruit', 'voavanga', 'watermelon', 'xigua', 'yellowpassionfruit', 'zucchini', 'acerola', 'bilberry', 'cantaloupe', 'damson', 'entawak', 'feijoa', 'guava', 'huckleberry', 'imbe', 'jambul'];
const useLowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const useUppercaseLetters = useLowercaseLetters.toUpperCase();
const useNumbers = '0123456789';
const useSymbols = '!@#$%^&*()\'';

function getRandomCharacter(str) {
    return str[Math.floor(Math.random() * str.length)];
}

function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
}

function generateFruitPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    let password = '';
    let fruit, symbol, number;

    while (password.length < length) {
        fruit = getRandomFruit();
        password += fruit.slice(0, Math.min(fruit.length, length - password.length));
    }

    if (includeSymbols) {
        for (let i = 0; i < password.length; i++) {
            if (Math.random() < 0.2) {
                symbol = getRandomCharacter(useSymbols);
                password = password.slice(0, i) + symbol + password.slice(i + 1);
            }
        }
    }

    if (includeNumbers) {
        for (let i = 0; i < password.length; i++) {
            if (Math.random() < 0.2) {
                number = getRandomCharacter(useNumbers);
                password = password.slice(0, i) + number + password.slice(i + 1);
            }
        }
    }

    if (includeUppercase && includeLowercase) {
        for (let i = 0; i < password.length; i++) {
            if (Math.random() < 0.5) {
                password = password.slice(0, i) + password[i].toUpperCase() + password.slice(i + 1);
            }
        }
    } else if (includeUppercase) {
        password = password.toUpperCase();
    } else if (includeLowercase) {
        password = password.toLowerCase();
    }

    return password;
}

function generateCharacterPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    let password = '';
    let allCharacters = '';

    if (includeLowercase) {
        password += getRandomCharacter(useLowercaseLetters);
        allCharacters += useLowercaseLetters;
    }

    if (includeUppercase) {
        password += getRandomCharacter(useUppercaseLetters);
        allCharacters += useUppercaseLetters;
    }

    if (includeNumbers) {
        password += getRandomCharacter(useNumbers);
    }

    if (includeSymbols) {
        password += getRandomCharacter(useSymbols);
    }

    for (let i = password.length; i < length; i++) {
        password += getRandomCharacter(allCharacters);
    }

    return password;
}

function generateRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, passwordType) {
    if (!(5 <= length && length <= 128)) {
        return 'Please verify you have chosen a password length between 5 and 128 characters🫣';
    }

    if (passwordType === 'fruit') {
        return generateFruitPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    } else {
        return generateCharacterPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    }
}

document.getElementById("generate").onclick = function (event) {
    event.preventDefault();

    const length = document.getElementById("length").value;
    const includeUppercase = document.getElementById("checkboxUppercase").checked;
    const includeLowercase = document.getElementById("checkboxLowercase").checked;
    const includeNumbers = document.getElementById("checkboxNumbers").checked;
    const includeSymbols = document.getElementById("checkboxSymbols").checked;
    const passwordType = document.querySelector('input[name="passwordType"]:checked').value;

    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        document.getElementById("error").innerText = 'At least 1 character set must be selected🫣';
        return;
    }

    let pass = generateRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, passwordType);
    if (pass.startsWith('Please verify')) {
        document.getElementById("error").innerText = pass;
    } else {
        document.getElementById("password").value = pass;
        document.getElementById("error").innerText = '';
    }
}

// Reveal Password Button Function
function revealPassword() {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

// Password Strength Function
function updatePasswordStrength() {
    const includeUppercase = document.getElementById("checkboxUppercase").checked;
    const includeLowercase = document.getElementById("checkboxLowercase").checked;
    const includeNumbers = document.getElementById("checkboxNumbers").checked;
    const includeSymbols = document.getElementById("checkboxSymbols").checked;
    const passwordType = document.querySelector('input[name="passwordType"]:checked').value;

    // To count the number of selected character sets
    let numSets = 0;
    if (includeUppercase) numSets++;
    if (includeLowercase) numSets++;
    if (includeNumbers) numSets++;
    if (includeSymbols) numSets++;

    // Indicating the password strength
    let strength;
    if (passwordType === 'fruit') {
        if (numSets <= 1) {
            strength = "Weak";
        } else if (numSets <= 2) {
            strength = "Medium";
        } else if (numSets <= 3) {
            strength = "Strong";
        } else {
            strength = "Very Strong";
        }
    } else {
        if (numSets <= 1) {
            strength = "Weak";
        } else if (numSets <= 2) {
            strength = "Medium";
        } else {
            strength = "Strong";
        }
    }

    // Update the popdown message
    document.getElementById("strength").innerText = "Password Strength: " + strength;
}

//Event listeners for radio button
let radios = document.querySelectorAll('input[type=radio][name="passwordType"]');
radios.forEach(radio => radio.addEventListener('change', updatePasswordStrength));

// Add event listeners to update the password strength message
let formElements = ['length', 'checkboxUppercase', 'checkboxLowercase', 'checkboxNumbers', 'checkboxSymbols'];
formElements.forEach(id => {
    document.getElementById(id).addEventListener("input", updatePasswordStrength);
});

// Old event listeners for checking boxes, keeping for now for reference incase needed
// document.getElementById("length").addEventListener("input", updatePasswordStrength);
// document.getElementById("checkboxUppercase").addEventListener("change", updatePasswordStrength);
// document.getElementById("checkboxLowercase").addEventListener("change", updatePasswordStrength);
// document.getElementById("checkboxnumbers").addEventListener("change", updatePasswordStrength);
// document.getElementById("checkboxSymbols").addEventListener("change", updatePasswordStrength);


// Bootstrap Code
const rangeLengthInput = document.getElementById("length");
const rangeInput = document.getElementById("customRange2");

rangeLengthInput.addEventListener("input", function () {
    rangeInput.value = rangeLengthInput.value;
});

rangeInput.addEventListener("input", function () {
    rangeLengthInput.value = rangeInput.value;
});