/*
functions:

1. 3 Recent Bookmarks

2. Tags current page
    a. Add tags into doc

3. Read Later 3

4. Add current page as bookmark
    a. toggle


*/

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

window.onload=function(){
    //toggle add header
    var addHead = document.getElementById("addhead")
    var addToggle = document.getElementById("addform");
    if (addHead){
        document.getElementById("addhead").addEventListener('click',function(event){  
            if (addToggle.style.display == "none") addToggle.style.display = "block";
            else addToggle.style.display = "none";                     
                    
         });    
    }
    
    //enter button in input tagbar
    var tagbar = document.getElementById('tagbar')
    tagbar.addEventListener('keydown',(ev) => {
        if(ev.keyCode===13){
            addTag(tagbar.value)
            //addkey(tagbar.value)
            tagbar.value = ''          
            
        }
    })

    //get recent sites
    getRecent()

    //get read later sites
    getReadLater()

    document.getElementById('manage').addEventListener('click', (ev) =>{
        window.open("manager.html");
    })
    
    
}


 
