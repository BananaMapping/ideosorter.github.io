var langs = []
var lang = ""

function load_ui(index){
    document.getElementById("title").innerHTML = index.title
    document.getElementById("text_body").innerHTML = index.text
    document.getElementById("startbutton").innerHTML = index.start
    document.getElementById("contacts").innerHTML = index.contacts
    document.getElementById("contacts_info").innerHTML = index.contact_info
    document.getElementById("startbutton").onclick = () => location.href = `quiz.html?${lang}`
}

function langSelected(){
    var i = document.getElementById("langDropdown").selectedIndex
    location.href = `index.html?${langs[i]}`
}

function parse_langs(data){
    for(i=0;i < data.length;i++){
        langs.push(data[i].id)
        langDropdown.innerHTML += "<option value=\"" + i + "\">" + data[i].name + "</option>"
    }
    if (langs.some(element => element === window.location.search.substring(1))){
        lang = window.location.search.substring(1)
    } else {
        console.log("No valid language selected, defaulting to English")
        lang = "en"
    }
    document.getElementById("langDropdown").selectedIndex = langs.indexOf(lang,0)
    fetch(`./json/${lang}/ui-${lang}.json`)
        .then(response => response.json())
        .then(data => load_ui(data.index))
}

fetch(`./json/langs.json`)
    .then(response => response.json())
    .then(data => parse_langs(data))
