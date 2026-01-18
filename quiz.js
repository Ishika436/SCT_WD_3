// Quiz Question Data
const defaultQuestions = [
    // Single Choice Questions
    {
        id: 1,
        type: 'single',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        points: 10
    },
    {
        id: 2,
        type: 'single',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        points: 10
    },
    // Multi-Select Questions
    {
        id: 3,
        type: 'multi',
        question: 'Which of the following are programming languages? (Select all that apply)',
        options: ['Python', 'HTML', 'Java', 'CSS', 'JavaScript'],
        correctAnswers: [0, 2, 4],
        points: 15
    },
    {
        id: 4,
        type: 'multi',
        question: 'Which countries are in Europe? (Select all that apply)',
        options: ['Germany', 'Japan', 'Italy', 'Australia', 'Spain'],
        correctAnswers: [0, 2, 4],
        points: 15
    },
    // Fill in the Blank Questions
    {
        id: 5,
        type: 'fill',
        question: 'The chemical symbol for gold is ___',
        correctAnswer: 'Au',
        caseSensitive: false,
        points: 10
    },
    {
        id: 6,
        type: 'fill',
        question: 'Python was created by ___',
        correctAnswer: 'Guido van Rossum',
        caseSensitive: false,
        points: 10
    },
    // Single Choice Questions
    {
        id: 7,
        type: 'single',
        question: 'What is 15 × 12?',
        options: ['170', '180', '190', '200'],
        correctAnswer: 1,
        points: 10
    },
    {
        id: 8,
        type: 'single',
        question: 'Who wrote Romeo and Juliet?',
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
        correctAnswer: 1,
        points: 10
    },
    // Fill in the Blank
    {
        id: 9,
        type: 'fill',
        question: 'The largest ocean on Earth is the ___ Ocean',
        correctAnswer: 'Pacific',
        caseSensitive: false,
        points: 10
    },
    // Multi-Select
    {
        id: 10,
        type: 'multi',
        question: 'Which of these are mammals? (Select all that apply)',
        options: ['Dog', 'Snake', 'Whale', 'Penguin', 'Cat'],
        correctAnswers: [0, 2, 4],
        points: 15
    }
];

let quizQuestions = [...defaultQuestions];

// Quiz Game Class
class QuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.selectedAnswers = [];
    }

    getCurrentQuestion() {
        return quizQuestions[this.currentQuestion];
    }

    getTotalQuestions() {
        return quizQuestions.length;
    }

    isLastQuestion() {
        return this.currentQuestion === quizQuestions.length - 1;
    }

    selectAnswer(answer) {
        const question = this.getCurrentQuestion();

        if (question.type === 'multi') {
            if (this.selectedAnswers.includes(answer)) {
                this.selectedAnswers = this.selectedAnswers.filter(a => a !== answer);
            } else {
                this.selectedAnswers.push(answer);
            }
        } else {
            this.selectedAnswers = [answer];
        }
    }

    setFillAnswer(answer) {
        this.selectedAnswers = [answer];
    }

    checkAnswer() {
        const question = this.getCurrentQuestion();
        let isCorrect = false;

        if (question.type === 'single') {
            isCorrect = this.selectedAnswers[0] === question.correctAnswer;
        } else if (question.type === 'multi') {
            const selectedSet = new Set(this.selectedAnswers);
            const correctSet = new Set(question.correctAnswers);
            isCorrect = selectedSet.size === correctSet.size &&
                       [...selectedSet].every(a => correctSet.has(a));
        } else if (question.type === 'fill') {
            const userAnswer = this.selectedAnswers[0] || '';
            const correctAnswer = question.correctAnswer;
            if (question.caseSensitive) {
                isCorrect = userAnswer === correctAnswer;
            } else {
                isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
            }
        }

        if (isCorrect) {
            this.score += question.points;
        }

        this.userAnswers.push({
            questionId: question.id,
            selected: [...this.selectedAnswers],
            correct: isCorrect,
            points: isCorrect ? question.points : 0
        });

        return isCorrect;
    }

    nextQuestion() {
        this.currentQuestion++;
        this.selectedAnswers = [];
    }

    reset() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.selectedAnswers = [];
    }

    getResults() {
        const totalQuestions = this.getTotalQuestions();
        const correctAnswers = this.userAnswers.filter(a => a.correct).length;
        const incorrectAnswers = totalQuestions - correctAnswers;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const maxScore = quizQuestions.reduce((sum, q) => sum + q.points, 0);

        return {
            score: this.score,
            maxScore: maxScore,
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers,
            incorrectAnswers: incorrectAnswers,
            percentage: percentage
        };
    }
}

// Question Manager Class
class QuestionManager {
    constructor() {
        this.customQuestions = this.loadCustomQuestions();
    }

    loadCustomQuestions() {
        const saved = localStorage.getItem('customQuestions');
        return saved ? JSON.parse(saved) : [];
    }

    saveCustomQuestions() {
        localStorage.setItem('customQuestions', JSON.stringify(this.customQuestions));
    }

    addQuestion(question) {
        question.id = Date.now(); // Use timestamp as unique ID
        this.customQuestions.push(question);
        this.saveCustomQuestions();
        return question.id;
    }

    deleteQuestion(id) {
        this.customQuestions = this.customQuestions.filter(q => q.id !== id);
        this.saveCustomQuestions();
    }

    clearAllQuestions() {
        this.customQuestions = [];
        this.saveCustomQuestions();
    }

    getCustomQuestions() {
        return this.customQuestions;
    }

    getCustomQuestionCount() {
        return this.customQuestions.length;
    }
}

// UI Controller
class UIController {
    constructor() {
        this.game = new QuizGame();
        this.questionManager = new QuestionManager();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.showQuizOptions());
        document.getElementById('createBtn').addEventListener('click', () => this.openCreationScreen());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('quitBtn').addEventListener('click', () => this.quitQuiz());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakeQuiz());
        document.getElementById('homeBtn').addEventListener('click', () => this.goHome());
        document.getElementById('backFromCreation').addEventListener('click', () => this.goHome());
        
        // Question creation events
        document.getElementById('questionTypeSelect').addEventListener('change', (e) => this.updateFormForType(e.target.value));
        document.getElementById('addOptionBtn').addEventListener('click', () => this.addOptionInput());
        document.getElementById('questionForm').addEventListener('submit', (e) => this.handleQuestionSubmit(e));
        document.getElementById('startCustomQuizBtn').addEventListener('click', () => this.startCustomQuiz());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllQuestions());
    }

    startQuiz() {
        this.game.reset();
        this.showScreen('quizScreen');
        this.displayQuestion();
    }

    showQuizOptions() {
        const hasCustomQuestions = this.questionManager.getCustomQuestionCount() > 0;
        let message = 'Choose quiz type:\n\n1. Default Quiz (Built-in questions)\n';
        
        if (hasCustomQuestions) {
            message += `2. My Custom Quiz (${this.questionManager.getCustomQuestionCount()} questions)\n\nEnter 1 or 2:`;
            const choice = prompt(message);
            
            if (choice === '1') {
                quizQuestions = [...defaultQuestions];
                this.startQuiz();
            } else if (choice === '2') {
                quizQuestions = [...this.questionManager.getCustomQuestions()];
                
                if (quizQuestions.length === 0) {
                    alert('No custom questions available!');
                    return;
                }
                this.startQuiz();
            }
        } else {
            quizQuestions = [...defaultQuestions];
            this.startQuiz();
        }
    }

    displayQuestion() {
        const question = this.game.getCurrentQuestion();
        const questionNumber = this.game.currentQuestion + 1;
        const totalQuestions = this.game.getTotalQuestions();

        // Update progress
        const progress = (questionNumber / totalQuestions) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('questionCounter').textContent = `Question ${questionNumber} of ${totalQuestions}`;

        // Update question
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('questionType').textContent = this.getQuestionTypeLabel(question.type);

        // Clear options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        // Disable next button
        document.getElementById('nextBtn').disabled = true;

        // Display options based on question type
        if (question.type === 'single') {
            this.displaySingleChoice(question, optionsContainer);
        } else if (question.type === 'multi') {
            this.displayMultiChoice(question, optionsContainer);
        } else if (question.type === 'fill') {
            this.displayFillBlank(question, optionsContainer);
        }
    }

    displaySingleChoice(question, container) {
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';

            if (this.game.selectedAnswers.includes(index)) {
                optionDiv.classList.add('selected');
            }

            optionDiv.innerHTML = `
                <input type="radio" name="option" value="${index}" id="option_${index}" 
                    ${this.game.selectedAnswers.includes(index) ? 'checked' : ''}>
                <label class="option-label" for="option_${index}">${option}</label>
            `;

            optionDiv.addEventListener('click', () => {
                this.game.selectAnswer(index);
                this.displayQuestion();
                document.getElementById('nextBtn').disabled = false;
            });

            container.appendChild(optionDiv);
        });
    }

    displayMultiChoice(question, container) {
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';

            if (this.game.selectedAnswers.includes(index)) {
                optionDiv.classList.add('selected');
            }

            optionDiv.innerHTML = `
                <input type="checkbox" name="option" value="${index}" id="option_${index}"
                    ${this.game.selectedAnswers.includes(index) ? 'checked' : ''}>
                <label class="option-label" for="option_${index}">${option}</label>
            `;

            optionDiv.addEventListener('click', () => {
                this.game.selectAnswer(index);
                this.displayQuestion();
                document.getElementById('nextBtn').disabled = this.game.selectedAnswers.length === 0;
            });

            container.appendChild(optionDiv);
        });
    }

    displayFillBlank(question, container) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';

        const answer = this.game.selectedAnswers[0] || '';
        optionDiv.innerHTML = `
            <input type="text" id="fillInput" placeholder="Type your answer here..." value="${answer}">
        `;

        const input = optionDiv.querySelector('#fillInput');
        input.addEventListener('input', (e) => {
            this.game.setFillAnswer(e.target.value);
            document.getElementById('nextBtn').disabled = e.target.value.trim() === '';
        });

        input.focus();
        container.appendChild(optionDiv);

        document.getElementById('nextBtn').disabled = answer.trim() === '';
    }

    nextQuestion() {
        const question = this.game.getCurrentQuestion();
        const isCorrect = this.game.checkAnswer();

        // Show feedback
        this.showAnswerFeedback(isCorrect, question);

        // Move to next question or show results
        setTimeout(() => {
            if (this.game.isLastQuestion()) {
                this.showResults();
            } else {
                this.game.nextQuestion();
                this.displayQuestion();
            }
        }, 1500);
    }

    showAnswerFeedback(isCorrect, question) {
        const container = document.getElementById('optionsContainer');
        const options = container.querySelectorAll('.option');

        options.forEach((option, index) => {
            option.classList.add('disabled');

            if (question.type === 'single' || question.type === 'fill') {
                if (index === question.correctAnswer || (question.type === 'fill' && isCorrect)) {
                    option.classList.add('correct');
                } else if (this.game.selectedAnswers.includes(index)) {
                    option.classList.add('incorrect');
                }
            } else if (question.type === 'multi') {
                if (question.correctAnswers.includes(index)) {
                    option.classList.add('correct');
                } else if (this.game.selectedAnswers.includes(index)) {
                    option.classList.add('incorrect');
                }
            }
        });

        document.getElementById('nextBtn').disabled = true;
    }

    showResults() {
        const results = this.game.getResults();
        const percentageClass = this.getPercentageClass(results.percentage);

        document.getElementById('finalScore').textContent = results.score;
        document.getElementById('totalQuestions').textContent = `Total Questions: ${results.totalQuestions}`;
        document.getElementById('correctAnswers').textContent = `Correct Answers: ${results.correctAnswers}`;
        document.getElementById('incorrectAnswers').textContent = `Incorrect Answers: ${results.incorrectAnswers}`;
        document.getElementById('scorePercentage').textContent = `Score: ${results.percentage}%`;

        const feedback = document.getElementById('resultsFeedback');
        feedback.className = 'results-feedback ' + percentageClass;
        feedback.textContent = this.getFeedbackMessage(results.percentage);

        this.showScreen('resultsScreen');
    }

    getPercentageClass(percentage) {
        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'average';
        return 'poor';
    }

    getFeedbackMessage(percentage) {
        if (percentage >= 80) return '🌟 Excellent! You are a quiz master!';
        if (percentage >= 60) return '👍 Good job! Keep practicing!';
        if (percentage >= 40) return '📚 Average performance. Study more!';
        return '💪 Keep trying! You will improve!';
    }

    getQuestionTypeLabel(type) {
        const labels = {
            'single': 'Single Choice',
            'multi': 'Multi-Select',
            'fill': 'Fill in the Blank'
        };
        return labels[type] || type;
    }

    quitQuiz() {
        if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
            this.goHome();
        }
    }

    retakeQuiz() {
        this.startQuiz();
    }

    goHome() {
        this.game.reset();
        this.showScreen('welcomeScreen');
    }

    // Question Creation Methods
    openCreationScreen() {
        this.showScreen('creationScreen');
        this.setupCreationForm();
        this.displayMyQuestions();
    }

    setupCreationForm() {
        const form = document.getElementById('questionForm');
        form.reset();
        
        // Reset options to default (2 options for single/multi)
        this.updateFormForType('single');
    }

    updateFormForType(type) {
        const container = document.getElementById('optionsInputContainer');
        const correctContainer = document.getElementById('correctAnswerContainer');
        
        container.innerHTML = '';
        correctContainer.innerHTML = '';

        if (type === 'single' || type === 'multi') {
            // Show options for single and multi-select
            const label = document.createElement('label');
            label.textContent = 'Options:';
            container.appendChild(label);
            
            const optionsDiv = document.createElement('div');
            optionsDiv.id = 'optionsInputs';
            container.appendChild(optionsDiv);
            
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'btn btn-secondary btn-sm';
            addBtn.textContent = '+ Add Option';
            addBtn.onclick = () => this.addOptionInput();
            container.appendChild(addBtn);
            
            // Add default 2 options
            this.addOptionInput();
            this.addOptionInput();

            // Correct answers input
            if (type === 'single') {
                correctContainer.innerHTML = `
                    <label for="correctAnswerInput">Correct Answer (option index):</label>
                    <input type="number" id="correctAnswerInput" min="0" placeholder="0" required>
                `;
            } else {
                correctContainer.innerHTML = `
                    <label for="correctAnswerInput">Correct Answers (comma-separated indices):</label>
                    <input type="text" id="correctAnswerInput" placeholder="e.g., 0,2,4" required>
                `;
            }
        } else {
            // Fill in the blank
            correctContainer.innerHTML = `
                <label for="correctAnswerInput">Correct Answer:</label>
                <input type="text" id="correctAnswerInput" placeholder="Type the correct answer" required>
            `;
        }
    }

    addOptionInput() {
        const optionsDiv = document.getElementById('optionsInputs');
        if (!optionsDiv) return;
        
        const optionCount = optionsDiv.querySelectorAll('.option-input-group').length;
        
        const optionGroup = document.createElement('div');
        optionGroup.className = 'option-input-group';
        optionGroup.innerHTML = `
            <input type="text" placeholder="Option ${optionCount + 1}" required>
            <button type="button" class="btn btn-danger btn-sm">✕</button>
        `;
        
        optionGroup.querySelector('button').onclick = (e) => {
            e.preventDefault();
            optionGroup.remove();
        };
        
        optionsDiv.appendChild(optionGroup);
    }

    handleQuestionSubmit(e) {
        e.preventDefault();

        const questionText = document.getElementById('questionText').value;
        const questionType = document.getElementById('questionTypeSelect').value;
        const pointsValue = parseInt(document.getElementById('pointsInput').value);

        let question = {
            type: questionType,
            question: questionText,
            points: pointsValue
        };

        if (questionType === 'single' || questionType === 'multi') {
            const optionsDiv = document.getElementById('optionsInputs');
            const optionInputs = optionsDiv.querySelectorAll('input[type="text"]');
            question.options = Array.from(optionInputs).map(inp => inp.value).filter(v => v.trim());

            if (question.options.length < 2) {
                alert('Please add at least 2 options!');
                return;
            }

            const correctInput = document.getElementById('correctAnswerInput').value;

            if (questionType === 'single') {
                question.correctAnswer = parseInt(correctInput);
                if (question.correctAnswer >= question.options.length || question.correctAnswer < 0) {
                    alert('Correct answer index is out of range!');
                    return;
                }
            } else {
                const indices = correctInput.split(',').map(i => parseInt(i.trim())).filter(i => !isNaN(i));
                question.correctAnswers = indices;
                if (indices.length === 0 || indices.some(i => i >= question.options.length || i < 0)) {
                    alert('Invalid correct answer indices!');
                    return;
                }
            }
        } else if (questionType === 'fill') {
            question.correctAnswer = document.getElementById('correctAnswerInput').value;
            question.caseSensitive = false;

            if (!question.correctAnswer.trim()) {
                alert('Please enter a correct answer!');
                return;
            }
        }

        // Add question
        this.questionManager.addQuestion(question);
        alert('Question created successfully!');
        
        // Reset form and refresh display
        document.getElementById('questionForm').reset();
        this.setupCreationForm();
        this.displayMyQuestions();
    }

    displayMyQuestions() {
        const customQuestions = this.questionManager.getCustomQuestions();
        const listContainer = document.getElementById('myQuestionsList');
        const countSpan = document.getElementById('questionsCount');

        countSpan.textContent = customQuestions.length;

        if (customQuestions.length === 0) {
            listContainer.innerHTML = '<p class="empty-message">No custom questions yet. Create your first question!</p>';
            document.getElementById('startCustomQuizBtn').disabled = true;
            return;
        }

        document.getElementById('startCustomQuizBtn').disabled = false;

        listContainer.innerHTML = customQuestions.map(q => `
            <div class="question-item">
                <div class="question-item-header">
                    <div class="question-item-title">${q.question}</div>
                    <button type="button" class="question-item-delete" onclick="window.uiController.deleteQuestion(${q.id})">Delete</button>
                </div>
                <div class="question-item-type">${this.getQuestionTypeLabel(q.type)}</div>
                <div class="question-item-points">Points: ${q.points}</div>
            </div>
        `).join('');
    }

    deleteQuestion(id) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.questionManager.deleteQuestion(id);
            this.displayMyQuestions();
        }
    }

    clearAllQuestions() {
        if (confirm('Are you sure you want to delete all custom questions? This cannot be undone!')) {
            this.questionManager.clearAllQuestions();
            this.displayMyQuestions();
        }
    }

    startCustomQuiz() {
        const customQuestions = this.questionManager.getCustomQuestions();
        if (customQuestions.length === 0) {
            alert('No custom questions available!');
            return;
        }
        quizQuestions = [...customQuestions];
        this.startQuiz();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

// Initialize the quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.uiController = new UIController();
});
