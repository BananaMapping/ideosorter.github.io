var langs = []
var lang = ""
var questions = {}
var questionId = 0
var buttons = {}
var buttonHTML = ""
var answerpath = []

function next_question(sel) {
    if (questions[questionId].results[sel] == null) {
        answerpath.push(questionId)
        questionId = questions[questionId].nextquestion[sel]
        init_question()
    } else {
        location.href = `results.html?${lang}&${questions[questionId].results[sel]}`
    }
}

function prev_question(){
  if(answerpath.length == 0){
    location.href = `index.html?${lang}`
  } else {
    questionId = answerpath.at(-1)
    answerpath.pop()
    init_question()
  }
}

function init_question() {
    document.getElementById("question").innerHTML = questions[questionId]["question"]
    buttonHTML = ""
    for(var i = 0; i<questions[questionId].answers.length; i++) {
        buttonHTML += "<button class=\"button\" onclick=\"next_question(\'" + questions[questionId].answers[i] +
        "\')\" style=\"background-color: " + buttons[questions[questionId].answers[i]].bgcolor +
        "; color:" + buttons[questions[questionId].answers[i]].textcolor +
        ";\">" + buttons[questions[questionId].answers[i]].text + "</button><br>"
    }
    document.getElementById("buttonholder").innerHTML = buttonHTML
}

function load_questions(data){
    questions = data
    questionId = Object.keys(data)[0]
    init_question()
}

function load_ui(quiz){
    document.getElementById("title").innerHTML = quiz.title
    if(Array.prototype.at){
      document.getElementById("back_button").innerHTML = quiz.back
    } else {
      document.getElementById("back_button").style.display = "none"
    }
    fetch(`./json/${lang}/buttons-${lang}.json`)
        .then(response => response.json())
        .then(data => buttons = data)
    fetch(`./json/${lang}/questions-${lang}.json`)
        .then(response => response.json())
        .then(data => load_questions(data))
}

function parse_langs(data){
    for(i=0;i < data.length;i++){
        langs.push(data[i].id)
    }
    if (langs.some(element => element === window.location.search.substring(1))){
        lang = window.location.search.substring(1)
    } else {
        console.log("No valid language selected, defaulting to English")
        lang = "en"
    }
    fetch(`./json/${lang}/ui-${lang}.json`)
        .then(response => response.json())
        .then(data => load_ui(data.quiz))
}

fetch(`./json/langs.json`)
    .then(response => response.json())
    .then(data => parse_langs(data))
