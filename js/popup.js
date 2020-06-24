/*
functions:

1. 3 Recent Bookmarks

2. Tags current page
    a. Add tags into doc

3. Read Later 3

4. Add current page as bookmark
    a. toggle


*/

//getRecents
function recentlyAdded(n){
    var data = {
        'type':'byTitle',
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
        console.log(data, Object.keys(data).length);
        var done = document.getElementById('done')
        if (Object.keys(data).length === 1){
            done.innerHTML = 'Didnt get data to server'
        }
        else
        {
            var n = data.output
            console.log(n)
            done.innerHTML = 'Done!'}
        }
}

//geturl
function getUrl(){
    
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

function removekey(word){
    var Index = cust_keys.indexOf(word);
    cust_keys.splice(Index, 1);
}

/* function to get top3 recently accessed bookmarks */
function getRecent(){
    /*
    1. connect to db
    2. query and return 3 vals as array

    query format returned:
    [{title:"",url:"",desc:""}]
    */

    var query_result = [
        {
            'title':"How to Make Cake",
            'url':"www.cakemake.com/12",
            'desc':"Traditional ecipe for banana cakes."
        },
        {
            'title':"Exam Guidelines",
            'url':"www.cbse.com/",
            'desc':"New 2020 Regulations."
        },
        {
            'title':"World News",
            'url':"www.newschannel.com/world",
            'desc':"Fresh News."
        }
    ]

    for (var i=1;i<4;i++){
        var site = query_result[i-1]
        console.log(site)
        document.getElementById('t'+i.toString()).innerHTML = site.title;        
        document.getElementById('u'+i.toString()).innerHTML = site.url;
        document.getElementById('d'+i.toString()).innerHTML = site.desc;
    }
}

/*function to get 3 bookmarks to be read later */
function getReadLater(){
    var query_result2 = [
        {
            'title':"Vanishing Gradients",
            'url':"www.mlindia.com/12",
            'desc':"Maths behind van gradients."
        },
        {
            'title':"Laptop Prices",
            'url':"www.techplace.com/laptops",
            'desc':"Compare products side by side."
        },
        {
            'title':"World News",
            'url':"www.newschannel.com/world",
            'desc':"Fresh News."
        }
    ]

    for (var i=1;i<4;i++){
        var site = query_result2[i-1]
        console.log(site)
        document.getElementById('tt'+i.toString()).innerHTML = site.title;        
        document.getElementById('uu'+i.toString()).innerHTML = site.url;
        document.getElementById('dd'+i.toString()).innerHTML = site.desc;
    }
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
        console.log("HELLO")
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        console.log(data, Object.keys(data).length, this.responseText.length);
        if (Object.keys(data).length === 1){
            msg.innerHTML = 'Did not recieve data! Please try again.'
        }
        else
        {
            var n = data.n
            msg.innerHTML = 'Done! Received Bookmarks: '+n.toString()
        }
    }    
}

/** function to deal with button click */
function importBM(){
    var impbutton = document.getElementById('importhead')
    impbutton.addEventListener('click', (ev)=>{
        var msg = document.getElementById('message')
        msg.style.display = 'block'
        msg.innerHTML = "Importing..."
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
            addTag(tagbar.value)
            tagbar.value = ''
        }
    })
}

window.onload=function(){
    //toggle add header
    addToggle()

    //get title and url of current tab
    getUrl()    
    
    //enter button in input tagbar
    tagBar()

    //get recent sites
    getRecent()

    //get read later sites
    getReadLater()

    //import button
    importBM()

    //opens main page
    document.getElementById('manage').addEventListener('click', (ev) =>{
        window.open("manager.html");
    })
}