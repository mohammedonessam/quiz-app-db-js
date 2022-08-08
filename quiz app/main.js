// select elements
let countSpan= document.querySelector(' .count span');
let categorySpan= document.querySelector(' .category span');
let difficultySpan= document.querySelector(' .difficulty span');
let bulletsContainer =document.querySelector('.bullets .spans');
let questionArea=document.querySelector('.question-area');
let answersArea=document.querySelector('.answers-area');
let submitBtn=document.querySelector('.submit-btn');
let quizApp=document.querySelector('.quiz-app');
let resultDiv=document.querySelector('.show-result');
let tryBtn=document.querySelector('.try-btn');
let countDownElement=document.querySelector('.countdown');

//set option
let currentIndex=0;
let rightAnswers=0;
let countdownInterval;
let duration= 90;
// const url= `https://opentdb.com/api.php?amount=${amount}&category=${categoryID}&difficulty=${difficulty}`;

function  getQuestions(){
    let  myRequest=  new XMLHttpRequest();
    myRequest.onreadystatechange= async function(){
        if(this.readyState===4&this.status===200){
            let questionObject= await  JSON.parse(this.responseText);
            let questionCount= await  questionObject.length;
            let category= await questionObject[currentIndex].category;
            let difficulty= await questionObject[currentIndex].difficulty;

            console.log(questionObject);

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
                // console.log(rightAnswer);

                // increase index
                currentIndex++;

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
    }
    myRequest.open('Get','../question.json',true);
    myRequest.send();
}
getQuestions();

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
}

function questionData(obj,count){
   
    // console.log(obj);
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
        
        // console.log(theAnswers);
        let  answer=theAnswers[i];
        
        //create label
        let theLabel=document.createElement('label');
        //add for attribute
        theLabel.htmlFor=(`answer_${i}`);
        //create text 
        labelText=document.createTextNode(answer);
        // console.log(labelText);

        //add label text
        // theLabel.appendChild(labelText);
        theLabel.innerHTML =answer;
        // console.log(theLabel);
        
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
        // console.log(mainDiv);
   }

}

function checkAnswer(rightAnswer,questionCount){

    // console.log(rightAnswer,questionCount);
    
    let answers=document.getElementsByName('question');
     let choosenAnswer;
     for (let i = 0; i < answers.length; i++) {

        if(answers[i].checked){
            choosenAnswer=answers[i].dataset.answer;
            // console.log(choosenAnswer);
        }
     }
     if(rightAnswer===choosenAnswer){
        rightAnswers++;
        // console.log(rightAnswers);
     }
}
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
            tryBtn.onclick=function (){
                resultDiv.innerHTML= questionTitle <br> mainDiv;
                this.getQuestions();
            };
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
            
            // duration--;

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