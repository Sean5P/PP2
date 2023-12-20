/*jshint esversion: 8 */
/*jshint asi: true */

// Import SweetAlert2 if you are using a module bundler, otherwise include it via a script tag

// Fetch API questions
async function fetchRandomQuestions(amount, category, difficulty) {
   // const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    
      const apiUrl = 'https://sean5p.github.io/data/questions.json';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.map(q => ({
            question: q.question,
            correct: q.correct_answer,
            answers: shuffleArray([...q.incorrect_answers, q.correct_answer])
        }));
    } catch (error) {
        console.error("Error fetching questions:", error);
        Swal.fire('Error', 'Failed to fetch questions.', 'error');
        return [];
    }
}

// Shuffle Answers
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let quizData = []; // Array to Hold Questions
let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question');
const answerEls = document.getElementById('answerList');
const submitBtn = document.getElementById('submit');

// Load Quiz Question
function loadQuestion() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuestion];
    questionEl.innerHTML = currentQuizData.question;
    answerEls.innerHTML = '';

    currentQuizData.answers.forEach(answer => {
        const answerEl = document.createElement('li');
        answerEl.innerHTML = `
            <input type="radio" name="answer" id="${answer}" value="${answer}">
            <label for="${answer}">${answer}</label>
        `;
        answerEls.appendChild(answerEl);
    });
}

// Deselect All Answers
function deselectAnswers() {
document.querySelectorAll('input[name="answer"]').forEach(answerEl => {
        answerEl.checked = false;
    });
}

// Get Selected Aanswer
function getSelected() {
    let answer;
document.querySelectorAll('input[name="answer"]').forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.value;
        }
    });
    return answer;
}

// Show Answer Feedback
function showFeedback(isCorrect) {
    Swal.fire({
        title: isCorrect ? 'Correct!' : 'Incorrect!',
        icon: isCorrect ? 'success' : 'error',
        timer: 3000,
        showConfirmButton: false
    });
}



// Show Results at End of Quiz
function showResults() {
    Swal.fire({
        title: 'Quiz Completed!',
        html: `You answered correctly at ${score}/${quizData.length} questions.`,
        confirmButtonText: 'Restart',
        icon: 'info'
    }).then(() => {
        location.reload();
    });
}

// Submit Button Event Listener
submitBtn.addEventListener('click', () => {
    const answer = getSelected();

    if (answer) {
        const isCorrect = answer === quizData[currentQuestion].correct;
        showFeedback(isCorrect);
        if (isCorrect) {
            score++;
        }

        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    } else {
        Swal.fire('Oops...', 'Please select an answer', 'warning');
    }
});

// Start Quiz
async function initializeQuiz() {
    quizData = await fetchRandomQuestions(10, 9, 'easy'); // Fetch 10 Questions
    if (quizData.length > 0) {
        loadQuestion(); // Load First Question
    } else {
        Swal.fire('Error', 'Failed to load quiz questions. Please try again.', 'error');
    }
}

initializeQuiz(); // Start Quiz
