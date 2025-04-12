class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        // Format the result to avoid extremely long decimals
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    formatNumber(number) {
        // Convert to string and check if it's a decimal
        const stringNumber = number.toString();
        
        // If number is too large or small, use scientific notation
        if (Math.abs(number) > 1e9 || (Math.abs(number) < 1e-9 && Math.abs(number) > 0)) {
            return number.toExponential(4);
        }
        
        // If it's a whole number, return it directly
        if (Number.isInteger(number)) {
            return stringNumber;
        }
        
        // For decimals, limit to 10 significant digits
        const [integerPart, decimalPart] = stringNumber.split('.');
        if (decimalPart && decimalPart.length > 10) {
            return number.toFixed(10).replace(/\.?0+$/, '');
        }
        
        return stringNumber;
    }

    calculatePercent() {
        const value = parseFloat(this.currentOperand);
        if (!isNaN(value)) {
            this.currentOperand = (value / 100).toString();
            this.updateDisplay();
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        if (this.operation !== undefined) {
            this.previousOperandElement.textContent = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = this.previousOperand;
        }
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.getAttribute('data-number'));
                this.addClickEffect(button);
            });
        });

        // Operation buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.addClickEffect(button);
                
                switch(action) {
                    case 'add':
                        this.chooseOperation('+');
                        break;
                    case 'subtract':
                        this.chooseOperation('−');
                        break;
                    case 'multiply':
                        this.chooseOperation('×');
                        break;
                    case 'divide':
                        this.chooseOperation('÷');
                        break;
                    case 'percent':
                        this.calculatePercent();
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'delete':
                        this.delete();
                        break;
                    case 'calculate':
                        this.calculate();
                        break;
                    default:
                        break;
                }
            });
        });

        // Also handle keyboard input
        document.addEventListener('keydown', (event) => {
            if (/^\d$/.test(event.key) || event.key === '.') {
                this.appendNumber(event.key);
                this.highlightButton(`[data-number="${event.key}"]`);
            } else if (['+', '-', '*', '/', '%'].includes(event.key)) {
                const operationMap = {
                    '+': 'add',
                    '-': 'subtract',
                    '*': 'multiply',
                    '/': 'divide',
                    '%': 'percent'
                };
                const action = operationMap[event.key];
                this.highlightButton(`[data-action="${action}"]`);
                
                switch(action) {
                    case 'add':
                        this.chooseOperation('+');
                        break;
                    case 'subtract':
                        this.chooseOperation('−');
                        break;
                    case 'multiply':
                        this.chooseOperation('×');
                        break;
                    case 'divide':
                        this.chooseOperation('÷');
                        break;
                    case 'percent':
                        this.calculatePercent();
                        break;
                    default:
                        break;
                }
            } else if (event.key === 'Enter' || event.key === '=') {
                this.calculate();
                this.highlightButton('[data-action="calculate"]');
            } else if (event.key === 'Escape') {
                this.clear();
                this.highlightButton('[data-action="clear"]');
            } else if (event.key === 'Backspace') {
                this.delete();
                this.highlightButton('[data-action="delete"]');
            }
        });
    }

    // Visual feedback for button clicks
    addClickEffect(button) {
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 100);
    }

    // For keyboard input highlighting
    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            this.addClickEffect(button);
        }
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
