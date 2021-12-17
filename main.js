var playbtn = $('#play-btn');
var audio = document.getElementById('music'), current = 0, duration;
    audio.volume = .4;
var ul = $('#listly'),
    light = $('#light'),
    runlr = $('#runlr'),
    submit = $('#submit'),
    tline = $('#timeline');
const toTime = (n) =>{
    var date = new Date(0);
        date.setSeconds(isNaN(n)?0:n);
        return date.toISOString().substr(14, 5);
}
const Callmess = (msg) =>{
    $('#message p #msg_content').text(msg);
    $('#message').css({
        display: 'block',
        animation: 'show 0.3s ease-out'
    });
}
$('#closeMess').click(function (){
    $('#message').css({
        display: 'none'
    });
});
// Main Tools control events
$('#tools_panel ul').click((event) =>{
    // create active border
    $('#tools_panel ul').children().removeClass('activated').addClass('selecting');
    var a = event.target;
    a.classList.add('activated');
    a.classList.remove('selecting');
    console.log(a.id); // check what function is activated
    switch (a.id){
        case 'bg-img': $('#st-bg-img').css({display:"block"}); break;
        case 'mz': $('#st-mz').css({display:"block"}); break;
        case 's-if': $('#st-s').css({display:"block"}); break;
        case 'lr': {
            $('#st-lr').css({display:"block"});
            tline.addClass('hide');
        } break;
    }
});
// set bg-img bt
$('#set-bt').click(()=>{
    document.getElementById('bg-img-f').value = '';
    var a = document.getElementById('url');
    $('body').css({
        'background-image':'url(' + a.value + ')'
    })
    a.value = "";
});
// Close tab 
$('.close-tab').click((event) =>{
    event.target.parentElement.style = "display:none";
})
// import file
$('#bg-img-f').change((event)=>{
    read(event.target.files[0],'bg-img-f');
});
$('#mz-f').change((event)=>{
    read(event.target.files[0],'mz-f');
    window.requestAnimationFrame(draw);
})

// Control file input
const read = (file, id) =>{
var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
        var url = event.target.result;
        switch (id){
            case 'bg-img-f':{
                $('body').css({
                    'background-image':'url(' + url + ')'
                }); 
            } break;
            case 'mz-f':{
                $('#music').attr("src",url);
                playbtn.removeClass('fa-pause fa-play').addClass('fa-play');
                audio.addEventListener('loadedmetadata',()=>{
                    duration = Math.round(audio.duration);
                    timeprog();
                })
            } break;
            
        }
    };
reader.onerror = function(event) {
    console.error("File could not be read! Code " + event.target.error.code);
};
}

// time line controls
playbtn.click(()=>{
    playbtn.toggleClass('fa-play').toggleClass('fa-pause');
    if (audio.paused){
        audio.play();
        prog.style = "animation-play-state: running; " + "animation-duration: " + duration + "s";
    } 
    else{
        audio.pause();
        prog.style = "animation-play-state: paused;"  + "animation-duration: " + duration + "s";
    } 
});
playbtn.hover(()=>{
    playbtn.css({cursor:"pointer"});
})

audio.addEventListener('timeupdate',()=>{
    timeprog();
})
const timeprog = ()=>{
    current = Math.round(audio.currentTime);
    $('#timebar').text(`${toTime(current)}/${toTime(duration)}`);
}
$('body').keypress((event)=>{
    console.log(event.keyCode);
    switch(event.keyCode){
        case 96 : $('.panel').toggleClass('hide'); break;
        case 32 : {
            document.getElementById('play-btn').parentNode.focus();
            playbtn.trigger('click');
            $('#songif').animate({
                opacity: '1.0'
            }, 4000);
            showlogo();
            $('#cv-rect').css({border:'none'});
            main.removeClass('hide');
            runlyric();
        }
    }
})
function showlogo(){
            document.getElementById('uzik').style = "animation: inf 3s ease-in 5.5s";
            document.getElementById('infors').style = "animation: inf 3s ease-in 2s";
            document.getElementById('logo').style = 'animation: zoom .7s cubic-bezier(0.05, 0.49, 0.58, 1) 1s forwards';
            document.getElementById('Nam').style = 'animation: leftnam 3s ease-out 2s';
            document.getElementById('hien').style = 'animation: whien 3s ease-out 2s';
            document.getElementById('am').style = 'animation: amup 3s ease-out 2s';
            document.getElementById('mid').style = 'animation: widthup 7.3s ease-in 1.7s';
            setTimeout(()=>{
                $('#logo').fadeTo(700,0);
            },9100);
}
// canvas spectrum
var canvas, context, audioctx, analyser, freqArr, barHeight, source;
var WIDTH = 768,
    HEIGHT = 300,
    INTERVAL = 64, //256;
    SAMPLES = 4096; //4096;//1024;//512;//2048; //this is the main thing to change right now

function initialize(){
    // drawing the canvas
    canvas = document.getElementById("cv-rect");
    context = canvas.getContext("2d");
    //setting up audio analyzer to get frequency info
    audioctx = new AudioContext(); 
    analyser = audioctx.createAnalyser();
    analyser.fftSize = SAMPLES;
    source = audioctx.createMediaElementSource(audio);    
    source.connect(analyser);
    source.connect(audioctx.destination);

    // getting array of frequency index
    freqArr = new Uint8Array(analyser.frequencyBinCount);
    
    // setting up bar's height
    barHeight = HEIGHT;

    // requesting window animation
    window.requestAnimationFrame(draw);
};

function draw(){
    if(!audio.paused){
        let r = 0, g = 0, b = 255, x = 0;
        context.clearRect(0,0,WIDTH, HEIGHT);
        analyser.getByteFrequencyData(freqArr);
        for(var i = 0; i < INTERVAL - 1; i++){
            
            var i = i;
            //barHeight = freqArr[i*2] + freqArr[i*2 + 1] - 254;
            barHeight = freqArr[i] - 128;
            if(barHeight <= 1){
                barHeight = 2;
            }
            
            // // color spectrum index
            // if (r == 0) g += 16;
            // if (r == 255) g -= 16;
            // if (g > 255) g = 255;
            // if (g < 0) g = 0;

            // if (g == 255) b -= 16;
            // if(g == 0) b += 16;
            // if (b > 255) b = 255;
            // if (b < 0) b = 0;

            // if (b == 0) r += 16;
            // if (b == 255) r -= 16;
            // if (r > 255) r = 255;
            // if (r < 0) r = 0;

            // setting up color for bar
            // context.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; 
            context.fillStyle = "rgb(255, 255, 255)"; 
            // drawing a bar's element
            context.fillRect(x, HEIGHT - barHeight, (WIDTH/INTERVAL) - 1 , barHeight);
            x = x + (WIDTH/INTERVAL);
        }
    }
    window.requestAnimationFrame(draw);
};
/////////////////// Lyrics area /////////////////
//when close lyrics settings tab
const showtimeline = ()=>{ 
    tline.removeClass('hide');
}
const process = (text) =>{
    let i = 0;
    while (text.indexOf('\n') !== -1){
        let content = text.slice(0, text.indexOf('\n')+1);
        text = text.replace(content,'');
        ul.append(`<li class='lyricedit'><p class='timenode' onclick='gettime(event)' id='${i++}'>00:00</p><p class='lytxt'>${content}</p></li>`);
    }
    ul.append(`<li class='lyricedit'><p class='timenode' onclick='gettime(event)' id='${i++}'>00:00</p><p class='lytxt'>${text}</p></li>`);
    ul.append(`<li class='lyricedit'><p class='timenode' onclick='gettime(event)' id='${i++}'>00:00</p><p class='lytxt'></p></li>`);
    for (i=0; i<timenode.length; i++)
        $('.timenode').eq(i).text(toTime(timenode[i]));
}
const submitf = ()=>{
    // get lyrics
    var lyrics = $('#text').val() + '';
    ul.removeClass('hide');
    $('#listly>*').remove();
    $('#light>*').remove();
    process(lyrics);
}
submit.click(submitf);
var current = 0;
var timenode = new Array();
const gettime = (event) =>{
    var el = event.target;
    current = Math.round(audio.currentTime);
    if (el.innerHTML != '00:00'){
        timenode[el.id] = current;
    }
    else timenode[timenode.length] = current;
    el.innerHTML = toTime(current);
    // console.log(toTime(current));
}
$('#play-get').click(()=>{
    if (audio.src === "") alert('No audio for play');
    else {
        audio.currentTime = 0;
        audio.play();
    }
})
$('#savelyrics').click(()=>{
    if (timenode.length == 0 || timenode.length < $('.timenode').length)
        alert('Missing timenode for lyrics!');
    else {
        for (var k of timenode) console.log(k);
        for (var i=0; i<timenode.length - 1; i++)
            for (var j=i+1; j<timenode.length; j++)
                if (timenode[i] > timenode[j]){
                    alert(`Wrong timeline of timenode ${timenode[i]} & ${timenode[j]}!`);
                    return -1;
                }
        //alert('success!');
        runlr.removeClass('hide');
    }
})

var main = $('#main');
var main2 = $('#main2');
runlr.click(()=>{
    //var height = $('#listly>*').first().height();
    audio.currentTime = 0;
    if (runlr.text() == 'Run Lyrics'){
        runlr.text('Edit Lyrics');
        submit.off('click');
        audio.play();
        main.removeClass('hide');
        main2.removeClass('hide');
        $('#tools_panel').addClass('hide');
        runlyric();
    }  
    else {
        main.addClass('hide');
        main2.addClass('hide');
        runlr.text('Run Lyrics');
        submit.on('click',submitf);
        ul.height(500);
        $('#tools_panel').removeClass('hide');
    }
    ul.toggleClass('hide'); // .scrollTop(height)
});
const runlyric = ()=>{
    // run first line
    var i = 0, j= 0, current, text, text2, hide = false;
    audio.addEventListener('timeupdate',()=>{
        current = Math.round(audio.currentTime);
        // get text
        if (timenode[i]-current == 0){
            text = $('.lytxt').eq(i).text();
            text2 = $('.lytxt').eq(i + 1).text()
            console.log(text);
            if (text.charAt(0) == '~'){             // if is light text
                main.addClass('hide');
                main2.addClass('hide');
                hide = true;
                light.text(text.slice(1)).removeClass('hide').addClass('hlight');
            }
            else{
                if (hide){
                    light.addClass('hide').removeClass('invisible');
                    main.removeClass('hide');
                    main2.removeClass('hide');
                    hide = false;
                }
                //console.log(main.text());
                main.removeClass('invisible').text(text);
                main2.removeClass('invisible').text(text2);
            }
            i += 2;
        }
        if (timenode[j]-current == 1){
            if (hide) light.addClass('invisible').removeClass('hlight');
            main.addClass('invisible');
            main2.addClass('invisible');
            j++;
        }
    })
}