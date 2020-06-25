/*
functions:

1. 3 Recent Bookmarks

2. Tags current page
    a. Add tags into doc

3. Read Later 3

4. Add current page as bookmark
    a. toggle
*/

/* post data {instruction,data} to server */


/* add curr page as bookmark */
function addBookMark(rlbool){
    var data = {
        title: null,
        url: null,
        tags: [],
        rl: rlbool,
        date: Date.now(),
        parent: null
    }
    data.title = document.getElementById('title').value
    data.url = document.getElementById('url').value
    var user_tags = document.getElementsByClassName('tagword')
    for(let i = 0; i<user_tags.length; i++){
        data.tags.push(user_tags[i].innerHTML)
    }
    console.log('tags:',data.tags)
    var parent = document.getElementById("parent");
    data.parent = parent.options[parent.selectedIndex].value;
    //console.log('bm:',data)
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({instruction:"newbm",data:data}));
    xhr.onload = function() {
        console.log("GOT newbm  rESPONSE:")
        var data = JSON.parse(this.responseText);
        if (Object.keys(data).length === 1){
            console.log('Couldnt get data')
        }
        else{
            alert('Bookmark added!')
        }
    }    
}

/* get folder options */
function getFolderOptions(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'instruction':'folder', "data":'hello'}));
    xhr.onload = function() {
        //console.log("GOT FOLDER RESPONSE:")
        //console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        if (Object.keys(data).length === 1){
            console.log('Couldnt get data')
        }
        else{
            var par = document.getElementById('parent')
            data.output.forEach(e =>{
                var el = document.createElement("option");
                el.textContent = e.title;
                el.value = e.id;
                par.appendChild(el);
            })
        }
    }
}

/* title case */
function titleCase(sentence) {
    sentence = sentence.toLowerCase().split(" ");
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    
    return sentence.join(" ");
}

/* function to get top3 recently accessed bookmarks */
function recentlyAdded(n){
    var data = {
        'type':'recent',
        "lim":n,
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'instruction':'recent', "data":data}));
    xhr.onload = function() {
        console.log("GOT RESPONSE:")
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        //console.log(data, Object.keys(data).length);
        if (Object.keys(data).length === 1){
            console.log('Couldnt get data')
        }
        else
        {
            // data.output
            for (var i=1;i<data.output.length+1;i++){
                var site = data.output[i-1]
                //console.log(site)
                document.getElementById('t'+i.toString()).innerHTML = titleCase(site.title);        
                document.getElementById('u'+i.toString()).innerHTML = (site.url).substring(0, 25)+'...';
                document.getElementById('r'+i.toString()).addEventListener('click',(ev)=>{
                    window.open(site.url)
                })
            }
        }
    }
}

/* load bookmarks to read later */
function recentlyLater(n){
    var data = {
        //'type':'later',
        "lim":n
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'instruction':'later', "data":data}));
    xhr.onload = function() {
        console.log("GOT RESPONSE:")
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        //console.log(data, Object.keys(data).length);
        if (Object.keys(data).length === 1){
            console.log('Couldnt get data')
        }
        else
        {
            //console.log(data.output) 
            if (data.output.length===0){
                document.getElementById('rlMsg').style.display = 'block'
            }

            for (var i=1;i<data.output.length+1;i++){
                var site = data.output[i-1]
                //console.log(site)
                document.getElementById('tt'+i.toString()).innerHTML = titleCase(site.title);        
                document.getElementById('uu'+i.toString()).innerHTML = site.url;
                document.getElementById('l'+i.toString()).addEventListener('click',(ev)=>{
                    window.open(site.url)
                })
            }
        }
    }
}

//geturl
function getUrl(cb){
    
    chrome.tabs.query({
        'active':true,
        'windowId':chrome.windows.WINDOW_ID_CURRENT},
        (tabs) => {            
            console.log(tabs[0])

            var url = tabs[0].url
            var inp = document.getElementById('url')
            inp.value = url

            var title = tabs[0].title
            var inp = document.getElementById('title')
            inp.value = title

            /* generate tags */
            var data = {"url":url.toString()}
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:5000/", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({'instruction':'tags', "data":data}));
            xhr.onload = function(){
                console.log("TAG RESPONSE:")
                console.log(this.responseText);
                var data = JSON.parse(this.responseText);
                var msg = document.getElementById('tagmsg')
                if(data.data == 'not received'){
                    console.log('no tags :(')
                    msg.innerHTML = 'Could not get tags!'
                    return false
                }
                else if(data.tags == null){
                    console.log('no tags pt 2 :(')
                    msg.innerHTML = 'Could not get tags!'
                    return false
                }
                else{
                    console.log('tags',data.tags)
                    //cb(data.tags)
                    data.tags.forEach(e => {
                        console.log(e.term)
                        var t = document.createElement('text')
                        var n = document.createTextNode(e.term)
                        t.appendChild(n)
                        t.classList.add('tagword') 
                        t.style.margin = '100px 5px'   
                        var par = document.getElementById("taghold")
                        var end = document.getElementById('tend')
                        t.addEventListener('click',(ev) =>{
                            par.removeChild(t)
                        })
                        par.insertBefore(t,end)
                        par.style.display = 'inline-block'
                    })
                    msg.style.display = 'none'
                }
            }
        }
    );    
}

//add a word tag into doc
function addTag(word){
    var x = addkey(word)
    if (!x){
        var t = document.createElement('text')
        var n = document.createTextNode(word)
        t.appendChild(n)
        t.classList.add('tagword') 
        t.style.margin = '100px 5px'   
        var par = document.getElementById("taghold")
        var end = document.getElementById('tend')
        t.addEventListener('click',(ev) =>{
            removekey(word)
            par.removeChild(t)
        })
        par.insertBefore(t,end)

    }    
}

//custom keywords
var cust_keys = []
function addkey(word){
    if (!cust_keys.includes(word)){
        cust_keys.push(word)
        return false
    }
    return true
}

//toggle added key
function removekey(word){
    var Index = cust_keys.indexOf(word);
    cust_keys.splice(Index, 1);
}

/** function to import bookmarks from chrome and send to server */
var bookmarks_arr = {}
function addBM(node, callback){
   callback(node)
}

/** function to iterate bookmarks and add to bookmarks_arr */
function printBookmarks(id) {
    chrome.bookmarks.getChildren(id, function(children) {
        children.forEach(function(bookmark) {
            var bookmark_json = {
                id : bookmark.id,
                title : bookmark.title,
                index : bookmark.index,
                url : bookmark.url,
                parent : bookmark.parentId,
                date : bookmark.dateAdded
            }                 
            addBM(bookmark_json, function(node){
                window.bookmarks_arr[node.id] = node
            }) 
            printBookmarks(bookmark.id);              
        });
    });   

}

/** function to make a post request */
function postImportData(data){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'instruction':'import','data':data}));
    xhr.onload = function() {
        var msg = document.getElementById('message')
        console.log("IMPORT RESPONSE:")
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        console.log(data, Object.keys(data).length, this.responseText.length);
        if (Object.keys(data).length === 1){
            msg.innerHTML = 'Did not recieve data! Please try again.'
        }
        else
        {    var n = data.n
            msg.innerHTML = 'Success! Received Bookmarks: '+n.toString()
        }
    }    
}

/** function to deal with button click */
function importBM(){
    var impbutton = document.getElementById('importhead')
    impbutton.addEventListener('click', (ev)=>{
        var msg = document.getElementById('message')
        msg.style.display = 'block'
        msg.innerHTML = "Importing... This can take a while!"
        window.printBookmarks('0')
        window.postImportData(window.bookmarks_arr) 
    })
}

/** function to toggle add-head button */
function addToggle(){         
    var addHead = document.getElementById("addhead")
    var addToggle = document.getElementById("addform");    
    addHead.addEventListener('click',function(event){  
        if (addToggle.style.display == "none") addToggle.style.display = "block";
        else addToggle.style.display = "none";
    });     

}

/** function to enter word on display from tag input */
function tagBar(){
    var tagbar = document.getElementById('tagbar')
    tagbar.addEventListener('keydown',(ev) => {
        if(ev.keyCode===13){
            document.getElementById('taghold').style.display = 'block'
            addTag(tagbar.value)
            tagbar.value = ''
        }
    })
}


window.onload=function(){
    //load recents
    recentlyAdded(3)

    //load read later
    recentlyLater(3)

    //toggle add header
    addToggle()

    //get title and url of current tab
    getUrl(addTag)    
    
    //enter button in input tagbar
    tagBar()    

    //import button
    importBM()

    //get folder list
    getFolderOptions()

    //add curr page as book mark button
    document.getElementById('ab1').addEventListener('click',(ev)=>{addBookMark(false)})
    document.getElementById('ab2').addEventListener('click',(ev)=>{addBookMark(true)})

    //opens main page
    document.getElementById('manage').addEventListener('click', (ev) =>{
        window.open("manager.html");
    })
}