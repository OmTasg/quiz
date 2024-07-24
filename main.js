import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js"
import { getDatabase, ref, push, get, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js"



const firebaseConfig = {
    databaseURL: "https://quiz-2bee4-default-rtdb.firebaseio.com/"
}
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const reference = ref(database, "question")
const questBTN = document.getElementById("quest-btn")
const spawnQuest = document.getElementById("spawn-quest")
const submitBTN = document.getElementById("submitbtn")
const quizCont = document.getElementById("quiz-container")
const errorMessage = document.getElementById("error-msg")
const clearBTN = document.getElementById("clearbtn") 
const quizGrade = document.getElementById("submitquiz")
const amountCorrect = document.getElementById("amountcorrect")
const quizName = document.getElementById("quizname")
const quizTitle = document.getElementById("quiztitle")
let bigQuestion = ""
let ans1 = ""
let ans2 = ""
let ans3 = ""
let ans4 = ""
const question = { 
    question:  "",
    a1: "",
    a1true: false,
    a2: "",
    a2true: false,
    a3: "",
    a3true: false,
    a4: "",
    a4true: false,
}

function makeQuiz(){
    questBTN.innerHTML = `
   <div class="question-container">
    <form class="quiz">
        <input type="text" id="questions" placeholder="Enter question here">
        <div class="answers">
            <div id="left-column">
                <div class="answer-pair">
                    <input type="radio" name="correctAnswer" value="1" id="answer1" class="questionradio">
                    <input type="text" id="btn-q1" placeholder="Answer choice 1" class="radiotext">
                </div>
                <div class="answer-pair">
                    <input type="radio" name="correctAnswer" value="3" id="answer3" class="questionradio">
                    <input type="text" id="btn-q3" placeholder="Answer choice 3" class="radiotext">
                </div>
            </div>
            <div id="right-column">
                <div class="answer-pair">
                    <input type="radio" name="correctAnswer" value="2" id="answer2" class="questionradio">
                    <input type="text" id="btn-q2" placeholder="Answer choice 2" class="radiotext">
                </div>
                <div class="answer-pair">
                    <input type="radio" name="correctAnswer" value="4" id="answer4" class="questionradio">
                    <input type="text" id="btn-q4" placeholder="Answer choice 4" class="radiotext">
                </div>
            </div>
        </div>
    </form>
</div>

    `
}


function spawnQuizName(){
    quizTitle.textContent = quizName.value
}

// spawnQuest.addEventListener("click" , function(event){
//     event.preventDefault()
//     makeQuiz()
// })

submitBTN.addEventListener("click", function(){
    ans1 = document.getElementById('btn-q1').value
    ans2 = document.getElementById('btn-q2').value
    ans3 = document.getElementById('btn-q3').value
    ans4 = document.getElementById('btn-q4').value
    const ans1Check = document.getElementById("answer1")
    const ans2Check = document.getElementById("answer2")
    const ans3Check = document.getElementById("answer3")
    const ans4Check = document.getElementById("answer4")
    
 
    bigQuestion = document.getElementById("questions").value
    if(bigQuestion && ans1 && ans2 && ans3 && ans4 &&(ans1Check.checked || ans2Check.checked || ans3Check.checked || ans4Check.checked)){
        question.question = bigQuestion
        question.a1 = ans1
        if (ans1Check.checked){
            question.a1true = true
        }
        question.a2 = ans2
        if (ans2Check.checked){
            question.a2true = true
        }
        question.a3 = ans3
        if (ans3Check.checked){
            question.a3true = true
        }
        question.a4 = ans4
        if (ans4Check.checked){
            question.a4true = true
        }
        push(reference, question)
    makeQuiz()
    renderQuiz()
    spawnQuizName()
    amountCorrect.textContent = ""

} else{
    alert("Make sure to fill out all forms and select a correct answer!")
}
})


clearBTN.addEventListener("click", function(){
    remove(reference)
    quizCont.innerHTML = ""
    questBTN.innerHTML = ""
    amountCorrect.textContent = ""
    quizTitle.textContent = ""
    quizName.value = ""
})


/**
 * Render the quiz using data from Firebase
 */


function renderQuiz() {
    quizCont.innerHTML = "Loading..."

    get(reference).then((snapshot) => {
        if (snapshot.exists()) {
            quizCont.innerHTML = ""
            const snap = snapshot.val()
            const keys = Object.keys(snap)

            keys.forEach(key => {
                const lastQuestion = snap[key]
                quizCont.innerHTML += `
                <div id="rendered-quiz">
            <h2>${lastQuestion.question}</h2>
            <div id = "rendered-quiz-answers">
                <input type="radio" name="q${key}" value="1" id = "radio${key + 1}" class = "answ-radio"> ${lastQuestion.a1}<br>
                <input type="radio" name="q${key}" value="2" id = "radio${key + 2}" class = "answ-radio"> ${lastQuestion.a2}<br>
                <input type="radio" name="q${key}" value="3" id = "radio${key + 3}" class = "answ-radio"> ${lastQuestion.a3}<br>
                <input type="radio" name="q${key}" value="4" id = "radio${key + 4}" class = "answ-radio"> ${lastQuestion.a4}
                <h4 id = feedback${key}></h4>
            </div>
        </div>
    `
            })
        }
    }).catch((error) => {
        console.error(error)
    })
}

quizGrade.addEventListener("click", function() {
    let totalQ = 0
    let correctQ = 0
    let answeredQ = 0

    get(reference).then((snapshot) => {
        if (snapshot.exists()) {
            const snaps = snapshot.val()
            const keys = Object.keys(snaps)

            totalQ = keys.length

            keys.forEach(key => {
                const radio1 = document.getElementById(`radio${key + 1}`)
                const radio2 = document.getElementById(`radio${key + 2}`)
                const radio3 = document.getElementById(`radio${key + 3}`)
                const radio4 = document.getElementById(`radio${key + 4}`)
                const feedback = document.getElementById(`feedback${key}`)
                const finalQuest = snaps[key]

                if (radio1.checked || radio2.checked || radio3.checked || radio4.checked) {
                    answeredQ++
                    if ((radio1.checked && finalQuest.a1true)
                        || (radio2.checked && finalQuest.a2true)
                        || (radio3.checked && finalQuest.a3true)
                        || (radio4.checked && finalQuest.a4true)) {
                        feedback.textContent = "Correct"
                        feedback.style.color = "#52B69A"
                        feedback.style.fontWeight = "bold"
                        feedback.style.textShadow = "0px 0px 2px black"
                        correctQ++
                    } else {
                        feedback.textContent = "Incorrect"
                        feedback.style.color = "#F9B5AC"
                        feedback.style.fontWeight = "bold"
                        feedback.style.textShadow = "0px 0px 2px black"
                    }
                } else {
                    feedback.textContent = "Choose an answer"
                    feedback.style.fontWeight = "bold"
                    feedback.style.textShadow = "0px 0px 2px black"
                }
            })

            if (answeredQ === totalQ) {
                amountCorrect.textContent = `Total Correct: ${correctQ}
                Total Questions: ${totalQ}
                Score: ${correctQ}/${totalQ} = ${((correctQ/totalQ)*100).toFixed(2)}%`
            } else {
                alert("Please answer all questions before submitting.")
            }
        }
    }).catch((error) => {
        console.error(error)
    })
})


/**
 * Runs when the document has been fully loaded
 * 
 * @param {*} fn 
 * 
 * https://stackoverflow.com/a/9899701
 */
function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
} 

docReady(function() {
    remove(reference)
    makeQuiz()
});