/*
navigate

recently accesses

read later

*/
window.onload = function(){
    driver()
}



function driver(){
    /* load navpanel */
    getChildren('0')

    /* navigation buttons */
    var lp = document.getElementById('later')
    var rp = document.getElementById('recent')
    var np = document.getElementById('nav')
    var sp = document.getElementById('searchpanel')

    lp.addEventListener('click',(ev) => {

        var div = document.getElementById('latpanel')
        div.style.display = 'block';
        var div = document.getElementById('recpanel')
        div.style.display = 'none';
        var div = document.getElementById('navpanel')
        div.style.display = 'none';
        sp.style.display = 'none';
        recentlyLater()
        
    })

    rp.addEventListener('click',(ev) => {

        var div = document.getElementById('recpanel')
        div.style.display = 'block';
        var div = document.getElementById('latpanel')
        div.style.display = 'none';
        var div = document.getElementById('navpanel')
        div.style.display = 'none';
        sp.style.display = 'none';
        recentlyVisited()

        
    })

    np.addEventListener('click',(ev) => {

        var div = document.getElementById('navpanel')
        div.style.display = 'block';
        var div = document.getElementById('latpanel')
        div.style.display = 'none';
        var div = document.getElementById('recpanel')
        div.style.display = 'none';
        sp.style.display = 'none';
        
    })

    /* Search bar */
    var search = document.getElementById('searchbar')
    search.addEventListener('keydown',(ev) => {
        if(ev.keyCode===13){
            var opt = document.getElementById('searchoption')
            var op = opt.options[opt.selectedIndex].value;
            searchF('search',op,search.value)
            //console.log('search: ',search.value,op)
            sp.style.display = 'block';
            var div = document.getElementById('navpanel')
            div.style.display = 'none';
            var div = document.getElementById('latpanel')
            div.style.display = 'none';
            var div = document.getElementById('recpanel')
            div.style.display = 'none';            
            
            /* run search query */
        }
    })
}

function recentlyVisited(){
    var data = {
        "lim":100
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'instruction':'recent', "data":data}));
    xhr.onload = function() {
        //console.log("GOT RESPONSE:")
        //console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        //console.log(data, Object.keys(data).length);
        if (Object.keys(data).length === 1){
            console.log('Couldnt get data')
            document.getElementById('recmsg').innerHTML = 'Could not connect'
            document.getElementById('recmsg').style.display = 'block'
        }
        else
        {
            //console.log(data.output) 
            if (data.output.length===0){
                document.getElementById('recmsg').innerHTML = 'No Results!'
                document.getElementById('recmsg').style.display = 'block'
            }
            
            else{
                function titleCase(sentence) {
                    sentence = sentence.toLowerCase().split(" ");
                    for (let i = 0; i < sentence.length; i++) {
                      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
                    }
                    
                    return sentence.join(" ");
                }
                var parent = document.getElementById('recpanel')
                for(let i = 0; i<data.output.length; i++){
                    var n, n2;
                    var site = data.output[i]
                    var br = document.createElement('br')                
                    var p1 = document.createElement('a')
                    p1.classList.add('title')
                    n = document.createTextNode(titleCase(site.title))
                    p1.appendChild(n)
                    p1.setAttribute("href", site.url);
                    var p2 = document.createElement('a')
                    p2.classList.add('url')
                    n = document.createTextNode(site.url)
                    p2.appendChild(n) 
                    p2.setAttribute("href", site.url);
                    var div = document.createElement('div')
                    div.classList.add('rlunit')
                    div.appendChild(p1)
                    div.appendChild(br)
                    div.appendChild(p2)
                    parent.appendChild(div)         
                    
                }
            }            
        }
    }
}

function recentlyLater(){
    var data = {
        "lim":100
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
                document.getElementById('latmsg').style.display = 'block'
            }
            
            else{
                var parent = document.getElementById('latpanel')
                for(let i = 0; i<data.output.length; i++){
                    var n;
                    var site = data.output[i]      
                    var br = document.createElement('br')           
                    var p1 = document.createElement('a')
                    p1.classList.add('title')
                    p1.setAttribute("href", site.url);
                    n = document.createTextNode(site.title)
                    p1.appendChild(n)
                    var p2 = document.createElement('a')
                    p2.classList.add('url')
                    p2.setAttribute("href", site.url);
                    n = document.createTextNode(site.title)
                    p2.appendChild(n) 
                    var div = document.createElement('div')
                    div.classList.add('rlunit')
                    div.appendChild(p1)
                    div.appendChild(br)
                    div.appendChild(p2)
                    parent.appendChild(div)
                }
            }            
        }
    }
}

async function searchF(instruction,type,data){
    var send = {
        instruction:instruction,
        type:type,
        data:data
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(send));
    xhr.onload = function() {
        console.log("GOT RESPONSE:")
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        var sr = document.getElementById('sr')
        if (Object.keys(data).length === 1 || data.output===undefined){
            console.log('Couldnt get data')
            sr.innerHTML = "Sorry! Could not connect..."
        }
        else
        {
            console.log(data.output)
            if (data.output.length===0){
                sr.innerHTML = 'No Results!'                
            }
            
            else{
                sr.innerHTML = ''
                function titleCase(sentence) {
                    sentence = sentence.toLowerCase().split(" ");
                    for (let i = 0; i < sentence.length; i++) {
                      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
                    }
                    
                    return sentence.join(" ");
                }
                var parent = sr
                for(let i = 0; i<data.output.length; i++){
                    var n;
                    var site = data.output[i]
                    try{
                        //console.log('site: ',site[i])
                        similarF(site.id)}
                    catch(e){}
                    var br = document.createElement('br')                
                    var p1 = document.createElement('a')
                    p1.classList.add('title')
                    n = document.createTextNode(titleCase(site.title))
                    p1.appendChild(n)
                    p1.setAttribute("href", site.url);
                    var p2 = document.createElement('a')
                    p2.classList.add('url')
                    n = document.createTextNode(site.url)
                    p2.appendChild(n) 
                    p2.setAttribute("href", site.url);
                    var div = document.createElement('div')
                    div.classList.add('rlunit')
                    div.appendChild(p1)
                    div.appendChild(br)
                    div.appendChild(p2)
                    parent.appendChild(div)         
                    
                }
            }            
        }
    }
}

function similarF(bmID){

    var send = {
        instruction:'similar',
        data:bmID
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(send));
    xhr.onload = function() {
        console.log("GOT RESPONSE:")
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        var sb = document.getElementById('sb')
        if (Object.keys(data).length === 1){
            console.log('Couldnt get data')
            sb.innerHTML = "Sorry! Could not connect..."
        }
        else
        {
            console.log(data.output)
            if (data.output.length===0){
                sb.innerHTML = 'No Results!'                
            }
            
            else{
                sb.innerHTML = ''
                function titleCase(sentence) {
                    sentence = sentence.toLowerCase().split(" ");
                    for (let i = 0; i < sentence.length; i++) {
                      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
                    }
                    
                    return sentence.join(" ");
                }
                var parent = sb
                for(let i = 0; i<data.output.length; i++){
                    var n;
                    var site = data.output[i]
                    var br = document.createElement('br')                
                    var p1 = document.createElement('a')
                    p1.classList.add('title')
                    n = document.createTextNode(titleCase(site.title))
                    p1.appendChild(n)
                    p1.setAttribute("href", site.url);
                    var p2 = document.createElement('a')
                    p2.classList.add('url')
                    n = document.createTextNode(site.url)
                    p2.appendChild(n) 
                    p2.setAttribute("href", site.url);
                    var div = document.createElement('div')
                    div.classList.add('rlunit')
                    div.appendChild(p1)
                    div.appendChild(br)
                    div.appendChild(p2)
                    parent.appendChild(div)
                }
            }
        }
    }
}

function similarFP(id,cb){
    cb(id)
}

function getChildren(id1){
    console.log('getting children for: ',id1)

    var send = {
        instruction:'files',
        data:id1
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(send));
    xhr.onload = function() {
        console.log("GOT NAV RESPONSE:")
        //console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        var parent = document.getElementById('parent')
        var sub = document.getElementById('sub')
        if (Object.keys(data).length === 1){
            console.log('Couldnt get data')
            sub.innerHTML = "Sorry! Could not connect..."
        }
        else
        {
            console.log(data.output)
            if (data.output.length===0){
                sub.innerHTML = 'No Results!'                
            }
            else{
                //add to sub
                sub.innerHTML = ''
                //console.log('NAV FILE',data.output)
                for(let i=0;i<data.output.length;i++){
                    var node = data.output[i]
                    console.log(node)                    
                    var ids = i.toString()                    
                    var i1 = document.createElement('img')
                    var i2 = document.createElement('img')
                    var t = document.createElement('a')
                    t.append(document.createTextNode(node.title))                  

                    if(!node.url){
                        i1.setAttribute('src','./css/folderb.png')
                        t.addEventListener('click',(ev)=>{
                            getChildren(node.id)
                        })
                    }
                    else{
                        i1.setAttribute('src','./css/bookmarkb.png')
                        t.setAttribute('href',node.url)                        
                    }
                    i2.setAttribute('title','Delete')
                    i2.setAttribute('src','./css/delete.png')
                    
                    i1.classList.add("icon")
                    i2.classList.add("icon")//,"hoverhide")
                    i2.style.float = 'right'
                    t.classList.add("caption")
                    
                    var div = document.createElement('div')
                    div.appendChild(i1)
                    div.appendChild(t)
                    div.appendChild(i2)

                    sub.appendChild(div)

                    t = null
                    i1 = null
                    i2 = null
                    div = null                     
                }
            }
        }
    }
}
