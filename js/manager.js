/*
navigate

recently accesses

read later

*/
window.onload = function(){
    driver()
}


function driver(){

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
        
    })

    rp.addEventListener('click',(ev) => {

        var div = document.getElementById('recpanel')
        div.style.display = 'block';
        var div = document.getElementById('latpanel')
        div.style.display = 'none';
        var div = document.getElementById('navpanel')
        div.style.display = 'none';
        sp.style.display = 'none';

        
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
    var opt = document.getElementById('searchoption')

    search.addEventListener('keydown',(ev) => {
        if(ev.keyCode===13){
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
