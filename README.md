# 🎯 Interactive Quiz Game

An engaging, feature-rich multiple choice quiz game with support for various question types and custom question creation.

## Features

✨ **Multiple Question Types:**
- **Single Choice**: Select one correct answer
- **Multi-Select**: Select all correct answers (checkboxes)
- **Fill in the Blank**: Type the correct answer

📝 **Create Your Own Questions:**
- Full question creation interface
- Support for all question types
- Persistent storage using browser localStorage
- Delete individual questions or clear all
- Start quiz with your custom questions

📊 **Interactive Quiz Interface:**
- Progress bar showing quiz completion
- Real-time question counter
- Beautiful gradient design with smooth animations
- Responsive layout for all devices

🎮 **Game Features:**
- Welcome screen with quiz introduction
- Choose between default quiz or custom questions
- Answer validation with immediate feedback
- Visual feedback (green for correct, red for incorrect)
- Score tracking and calculation
- Detailed results with performance feedback
- Percentage-based performance rating
- Retake quiz option

## How to Play

1. **Open the quiz**: Open `index.html` in your web browser
2. **Choose quiz type**:
   - Start Quiz: Play with built-in default questions
   - Create Questions: Build your own custom question bank
3. **Answer questions**: 
   - For single choice: click an option
   - For multi-select: click all correct answers
   - For fill-in-blank: type your answer
4. **Click Next**: Move to the next question
5. **View Results**: See your final score and performance feedback
6. **Retake**: Click "Retake Quiz" to try again

## Creating Custom Questions

### Steps to Create Questions:
1. Click **"Create Questions"** button on the welcome screen
2. Fill in the question form:
   - **Question**: Type your question
   - **Question Type**: Choose single choice, multi-select, or fill-in-blank
   - **Options**: Add at least 2 options (for single/multi-select)
   - **Correct Answer**: Specify the correct answer(s)
   - **Points**: Set points for correct answer
3. Click **"Create Question"** to save
4. Your question appears in "My Questions" list
5. Click **"Start Quiz with My Questions"** to take the quiz

### Question Type Details:

**Single Choice:**
- Add 2+ options
- Specify correct answer by option index (0, 1, 2, etc.)
- 10 points by default

**Multi-Select:**
- Add 2+ options
- Specify correct answers as comma-separated indices (e.g., 0,2,4)
- 15 points by default

**Fill in the Blank:**
- Type the exact correct answer
- Case-insensitive matching
- 10 points by default

### Managing Custom Questions:
- **Delete**: Click delete button on any question
- **Clear All**: Remove all custom questions at once
- **Data Persistence**: Questions are saved to browser storage automatically

## Question Types

### Single Choice
- Select one correct answer from multiple options
- 10 points per question

### Multi-Select
- Select all that apply (can be multiple correct answers)
- 15 points per question
- Example: "Which of the following are programming languages?"

### Fill in the Blank
- Type the correct answer
- Case-insensitive matching
- 10 points per question

## Scoring System

- Correct answers earn points based on question type
- Total possible score: 140 points (from 10 questions)
- Performance feedback based on percentage:
  - 80-100%: 🌟 Excellent
  - 60-79%: 👍 Good
  - 40-59%: 📚 Average
  - Below 40%: 💪 Keep trying

## Customizing Questions

Edit the `quizQuestions` array in `quiz.js` to add, modify, or remove questions.

### Adding a Single Choice Question:
```javascript
{
    id: 11,
    type: 'single',
    question: 'What is the capital of Japan?',
    options: ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya'],
    correctAnswer: 0,  // Index of correct option
    points: 10
}
```

### Adding a Multi-Select Question:
```javascript
{
    id: 12,
    type: 'multi',
    question: 'Which are fruits? (Select all)',
    options: ['Apple', 'Carrot', 'Banana', 'Broccoli'],
    correctAnswers: [0, 2],  // Array of correct option indices
    points: 15
}
```

### Adding a Fill in the Blank Question:
```javascript
{
    id: 13,
    type: 'fill',
    question: 'The capital of Italy is ___',
    correctAnswer: 'Rome',
    caseSensitive: false,
    points: 10
}
```

## Data Storage

Custom questions are automatically saved to your browser's localStorage. This means:
- Questions persist between browser sessions
- Each browser/device has its own question bank
- Clearing browser data will delete saved questions
- No internet connection required (offline-first)

## File Structure

```
T3/
├── index.html      # Main HTML structure
├── styles.css      # Styling and animations
├── quiz.js         # Quiz logic and game controller
└── README.md       # This file
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Customization Tips

1. **Change Colors**: Edit the gradient colors in `styles.css`
2. **Modify Points**: Adjust `points` value in question objects
3. **Add More Questions**: Add new objects to `quizQuestions` array
4. **Change Feedback Messages**: Edit `getFeedbackMessage()` in `quiz.js`

## Performance Metrics

- Instant feedback on answers
- Smooth animations and transitions
- Responsive design works on mobile and desktop
- No external dependencies required

## License

Free to use and modify for personal or educational purposes.

---

**Happy Quizzing! 🎉**
