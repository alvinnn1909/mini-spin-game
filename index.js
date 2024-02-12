


//Deposit
const prompt = require('prompt-sync')();
const ROWS = 3;
const COLUMNS = 3;
const SYMBOL_COUNT = {
    "A" : 2,
    "B" : 4,
    "C" : 6,
    "D" : 8
}

const SYMBOL_VALUE = {
    "A" : 5, 
    "B" : 4,
    "C" : 3,
    "D" : 2
}




const deposit = () => {
    let amount, numberAmount;
    do {
        amount = prompt("Enter the amount you want to deposit: ");
        numberAmount = parseFloat(amount);
        if (isNaN(numberAmount) || numberAmount <= 0) {
            console.log("Invalid amount. Please enter a valid amount.");
        }
        else{
            console.log(`You have successfully deposited $${numberAmount}`);   
            return numberAmount; 
        }
    }while(isNaN(numberAmount) || numberAmount <= 0);
}

const getNumberOfLines = () => {
    while (true){
        const numberOfLines = prompt("Enter the number of lines you want to bet on: ");
        const realNumberOfLines = parseInt(numberOfLines);
        if (isNaN(realNumberOfLines) || realNumberOfLines <= 0){
            console.log("Invalid number of lines. Please enter a valid number of lines.");
        }
        else if(realNumberOfLines > 3){
            console.log("You can only bet on 3 lines. Please enter a valid number of lines.");
        }
        else{
            return realNumberOfLines;
        }
    }
}


const betAmount = (balance, lines) => {
    while (true){
        const amount = prompt("Enter the amount you want to bet: ");
        const numberAmount = parseFloat(amount);
        if (numberAmount > balance || numberAmount > balance / lines){
            console.log("Insufficient funds. Please enter a valid amount.");
        }
        else if (isNaN(numberAmount) || numberAmount <= 0){
            console.log("Invalid amount. Please enter a valid amount.");
        }
        else{
            console.log(`You have successfully bet $${numberAmount * lines}.`);
            return numberAmount;
        }
    }

}


const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)){
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < ROWS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < COLUMNS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = symbols[randomIndex];
            reels[i].push(symbols[randomIndex]);
            reelSymbols.splice(selectedSymbol, 1);
        }
    }
    return reels;
}

const transponse = (reels) => {
    const transposedReels = [];
    for (let i = 0; i < ROWS; i++){
        transposedReels.push([]);
        for (let j = 0; j < COLUMNS; j++){
            transposedReels[i].push(reels[j][i]);
        }
    }
    return transposedReels;
}

const printRow = (rows) => {
    for (const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol;
            if (i < row.length - 1){
                rowString += " | ";
            }
        }

        console.log(rowString);
    }
}



const getWinning = (transposedReels, lines, bet) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++){
        let symbols = transposedReels[row];
        let allSame = true;
        for (const symbol of symbols){
            if (symbol !== symbols[0]){
                allSame = false;
                break;
            }  
        }
        if (allSame){
            winnings += SYMBOL_VALUE[symbols[0]] * bet;
        }
    }
    return winnings;
}




const game = () => {
    let balance = deposit();
    while (true){
        console.log(`Your balance is $${balance}.`);
        const reels = spin();
        const realNumberOfLines = getNumberOfLines();
        let bet = betAmount(balance, realNumberOfLines);
        balance -= bet * realNumberOfLines; 
        const transposedReels = transponse(reels);
        printRow(transposedReels);
        const winning = getWinning(transposedReels, realNumberOfLines, bet);  
        balance += winning;
        console.log(`You have won $${winning}.`);
        if (balance <= 0){
            console.log("You have no more funds to bet.");
            break;
        }
        const playAgain = prompt("Do you want to play again? (yes/no): ");
        if (playAgain.toLowerCase() !== "yes"){
            break;
        }
    }
}

game();