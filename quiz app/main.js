// select elements
let countSpan= document.querySelector(' .count span');
let categorySpan= document.querySelector(' .category span');
let difficultySpan= document.querySelector(' .difficulty span');
let bulletsContainer =document.querySelector('.bullets .spans');
let questionArea=document.querySelector('.question-area');
let answersArea=document.querySelector('.answers-area');
let submitBtn=document.querySelector('.submit-btn');
let quizApp=document.querySelector('.quiz-app');
let waitingDiv=document.querySelector('.waiting');
let resultDiv=document.querySelector('.show-result');
let tryBtn=document.querySelector('.try-btn');
let countDownElement=document.querySelector('.countdown');
let settingsDom= document.querySelector('.settings');
let categoryDom=document.querySelector('#category-sort');
let nQuestionsDom=document.querySelector('#nQuestions');
let startBtnDom=document.querySelector('#start');
let difficultyDom=[
    document.querySelector('#easy'),
    document.querySelector('#medium'),
    document.querySelector('#hard')];


//set option
let currentIndex=0;
let rightAnswers=0;
let countdownInterval;
let duration= 90;
let url;

// hundle submit btn to start quiz
startBtnDom.addEventListener('click',startQuiz);

// get the number of questions
getAmount=()=>{
    let amount=nQuestionsDom.value;
    if (amount>0 && amount<=20) {
        return amount
    };
};

// function => get sort of difficulty by id from dom 
getDifficulty=()=>{
    let difficulty=difficultyDom.filter(el=>el.checked);
    if (difficulty.length===1) {
        return difficulty[0].id; 
    };
};

// start quiz
function    startQuiz(){
    console.log("App Started");
    const amount=getAmount();
    const categoryID=categoryDom.value;
    const difficulty=getDifficulty();

    // make url dynamic
    url= `https://opentdb.com/api.php?amount=${amount}&category=${categoryID}&difficulty=${difficulty}`;
    fetch(url)
    .then( res=>res.json())
    .then(async data=>{
        result =await data.results;
        // console.log(result);
        getQuestions(result);
    })

    // check amont && difficulty
    if (amount > 0 && difficulty) {
        settingsDom.style.display="none";
        waitingDiv.style.visibility="visible";

        // make load of quiz page late for seconds because the page loaded before url responde
        setInterval(() => {
            waitingDiv.remove();
            quizApp.style.visibility="visible";}, 2000); 

    } else {
        let div = document.createElement("div");
        div.innerHTML='Please Select Your Difficulty And Number Of Questions ';
        document.querySelector('.settings').appendChild(div)
    }
}   

// function to get questions from url array
async function  getQuestions(result){
    let questionObject=  result;
    let questionCount=   questionObject.length;
    let category=  questionObject[currentIndex].category;
    let difficulty=  questionObject[currentIndex].difficulty;


    //create Bullets + set questions count
    createBullets(questionCount,category,difficulty);

    // add question data
    questionData(questionObject[currentIndex],questionCount);
    
    //set count down 
    countDown(duration,questionCount);

    // set submit button role
    submitBtn.onclick = function(){
        // get the right answer
        let rightAnswer=questionObject[currentIndex].correct_answer;

        // increase index
        currentIndex++;
        console.log(result[currentIndex]);

        // check the answer
        checkAnswer(rightAnswer,questionCount);

        // remove current question
        questionArea.innerHTML='';
        answersArea.innerHTML='';

        //add the next question
        // add question data
        if (currentIndex<questionCount) {
            questionData(questionObject[currentIndex],questionCount);
        }
        
        //handle bullets classes
        handleBullets();

        //show the result
        showResult(questionCount);
    }
}


// create the bullets
function createBullets (num,category,difficulty) {
    countSpan.innerHTML= num;
    // theCategory = document.createTextNode(category);
    categorySpan.innerHTML=category;
    difficultySpan.innerHTML=difficulty;

    //creat Bullets
    for(i=0; i<num; i++){
        let bullets =document.createElement('span');

        //add color to current bullets
        if (i===0) {
            bullets.className='on';
        }

        // add The Bullets to spans
        bulletsContainer.appendChild(bullets);
    }
};

function questionData(obj,count){
   
    // create H2 question 
    let questionTitle=document.createElement('h2');
    //add text of question
    questionTitle.innerHTML=obj.question;
    // append h2 element to html node
    questionArea.appendChild(questionTitle);

    //create the answers
    for (let i = 0; i <4; i++) {
        //create main answers div
        const mainDiv = document.createElement('div');

        //add class to main div
        mainDiv.className='answer';

        // get the answers
        let correctAnswer=obj['correct_answer'];
        let incorrectAnswers=obj['incorrect_answers'];
        
        let theAnswers=[correctAnswer,...incorrectAnswers];
         theAnswers=[...incorrectAnswers,correctAnswer];
        
        let  answer=theAnswers[i];
        
        //create label
        let theLabel=document.createElement('label');

        //add for attribute
        theLabel.htmlFor=(`answer_${i}`);

        //add label text
        theLabel.innerHTML =answer;
        
        //create radio input
        let radioInput=document.createElement('input');

        //add type + name +id +data attribute to input
        radioInput.type='radio';
        radioInput.name='question';
        radioInput.id=`answer_${i}`;
        radioInput.dataset.answer=answer;

        // make first answer selected
        if (i===0) {
            radioInput.checked=true;
        }
        // add input and label to main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        //add answers to answers area
        answersArea.appendChild(mainDiv);
   }
};

function checkAnswer(rightAnswer,questionCount){    
    let answers=document.getElementsByName('question');
    let choosenAnswer;
    for (let i = 0; i < answers.length; i++) {

    if(answers[i].checked){
        choosenAnswer=answers[i].dataset.answer;
        }
     }
     if(rightAnswer===choosenAnswer){
        rightAnswers++;
     }
}

// handle bullets
function handleBullets(){
    let bullets=document.querySelectorAll('.bullets .spans span');
    bullets.forEach((span,index)=>{
        if(index===currentIndex){
            span.className='on';
        }
    })
}

//show the result
function showResult(count){
    let theResult;
    if (currentIndex===count) {
        console.log('questions is finished');
        quizApp.remove();
        if (rightAnswers===count) {
            theResult=`<div class='result'>
            <p>Excellent</p>
            <p>your Answers Is ${rightAnswers} From ${count}</p>
            </div>`
        } else if (rightAnswers > count/2 && rightAnswers < count) {
            theResult=`<div class='result'>
            <p>Awesome</p>
            <p>your Answers Is ${rightAnswers} From ${count}</p>
            <button class='try-btn' onclick='window.location.reload()'>Try Again</button>
            </div>`
        } else{
            theResult=`<div class='result'>
            <p>Sorry</p>
            <p>your Answers Is ${rightAnswers} From ${count}</p>
            <p>You Can Try Again</p>
            <button class='try-btn' onclick='window.location.reload()'>Try Again</button>
            </div>`
        }
        resultDiv.innerHTML=theResult;
    }
};

function countDown(duration,count){

    if(currentIndex<count){
        let minutes,seconds;
        countdownInterval= setInterval(function(){

            minutes=parseInt(duration / 60);
            seconds=parseInt(duration % 60);

            minutes= minutes < 10? `0${minutes}`: minutes;
            seconds= seconds < 10? `0${seconds}`: seconds;

            countDownElement.innerHTML=`${minutes}:${seconds}`

            // direct condition
            if(--duration < 0 && !submitBtn.onclick()){
                clearInterval(countdownInterval);
                quizApp.remove();
                resultDiv.innerHTML=`<div class='result'>
                <p>Sorry</p>
                <p>your Time Out</p>
                <p>You Can Try Again</p>
                <button class='try-btn' onclick='window.location.reload()'>Try Again</button>`
                console.log('time finished');
            }
        },1000)
    }
};