var control = {
    play:false,
    squares:{
        type:[],
        color:[],
        name:[],
        count:[0,0,0,0,0,0,0],
    },
    teach:false,
    level:0,
    load:{},
    preload:{},
    font:16,
    user:{
        score:0,
        lines:0,
        time:0,
    },
    tetris:"",
    cheat:false,    
    time:0,
    fps:0,
    loop(){
        if(this.play){
            this.fps++;
            this.time++;
            if(this.fps>=[60,30,15][this.level]){
                this.fps = 0;
                this.load.down();
            }
            if(this.time>=60){
                this.time = 0;
                this.user.time++;
            }
            this.update();
        }
        requestAnimationFrame(this.loop.bind(this));
    },
    update(){
        this.squares.name.forEach((value,index)=>{
            $("#"+value).text(this.squares.count[index]);
        });
        $("#level").text(["簡易","正常","困難"][this.level]);
        $("#lines").text(this.user.lines);
        let m = Math.floor(this.user.time/60);
        let s = this.user.time % 60;
        $("#time").text((m<10?"0"+m:m)+":"+(s<10?"0"+s:s));
        $("#score").text(this.user.score);
        $('*')[0].style.fontSize = this.font+'px';
    },
    getNewSquare(){
        this.load = this.preload;
        if(this.load.collision()) {
            this.play = false;
            gameover();
        }else{
            this.load.draw(true);
            this.squares.count[this.load.index]++;
            this.preload = new square(Math.floor(Math.random()*7));
            this.drawPreloadTable();
        }        
    },
    drawPreloadTable(){
        for(let y = 0;y<5;y++){
            for(let x =0;x<5;x++){
                document.getElementById(`py${y}x${x}`).style.backgroundColor = "white";
            }
        }
        this.preload.type.forEach((row,y)=>{
            row.forEach((value,x)=>{
                if(value){
                    document.getElementById(`py${y}x${x}`).style.backgroundColor = this.preload.color;
                }
            });
        });
    }
}
function pause(){//暫停
    control.play = !control.play;
    $(event.target).text(control.play?"暫停遊戲":"繼續遊戲");
}
function init(){//初始化
    if(navigator.userAgent.includes("iPad")){
        $("#iPad").show();
    }
    for(let y = 0;y<24;y++){
        let tr = document.createElement("tr");
        if(y<4) tr.style.display = "none";
        for(let x =0;x<10;x++){
            let td = document.createElement("td");
            td.setAttribute("id",`ly${y}x${x}`);
            td.classList.add("td");
            td.style.backgroundColor = "white";
            tr.appendChild(td);
        }
        document.getElementById("load").appendChild(tr);
        $("#start").modal("show");
    }
    for(let y = 0;y<5;y++){
        let tr = document.createElement("tr");
        for(let x =0;x<5;x++){
            let td = document.createElement("td");
            td.setAttribute("id",`py${y}x${x}`);
            td.classList.add("td");
            td.style.backgroundColor = "white";
            tr.appendChild(td);
        }
        document.getElementById("preload").appendChild(tr);
    }
    if(localStorage.getItem("teach")=="true"){
        $("#start_btn")[0].style.backgroundColor = "yellow";
        localStorage.setItem("teach","false");
    }
}
function teach(){//教學
    $("#area").hide();
    $("#teach").show();
    $("#teach_btn").show();
    control.play = true;
    $("#start").modal("hide");
    control.play = false;
}
function teach2(){//教學2
    $("#area").show();
    $("#teach").hide();
    control.play = true;
    control.teach = true;
    start();
}
function start(){//開始遊戲
    control.font = font.value;
    //fetch("php/max_score.php").then(res=>res.text()).then(res=>$("#max_score").text(res));
    control.play = true;
    $("#start").modal("hide");
    control.preload = new square(Math.floor(Math.random()*7));
    control.getNewSquare();
    control.loop();
}
function l(y,x){
    return document.getElementById(`ly${y}x${x}`);
}
function gameover(){//結束遊戲
    if(control.teach) location.reload();
    $("#gameover").modal("show");
    if(!control.cheat){
        fetch("register.php",{
            method:"post",
            body:JSON.stringify(control.user),
        }).then(res=>res.json()).then(res=>{
            $("#is_cheat").show();
            $("#nlevel").text($("#level").text())
            res.results = res.results.sort((a,b)=>a.lines-b.lines).sort((a,b)=>b.score-a.score);
            let current = {},index = 1,max = res.results[0];
            res.results.forEach((value)=>{
                if(!(value.score==max.score && value.lines==max.lines)){
                    index++;
                    max = value;
                }
                value.index = index;
                if(value.id==res.current_id) current = value;
            });
            $("#rank").append(`
                <tr class="alert-dark">
                    <td>${current.index}</td>
                    <td>${current.lines}</td>
                    <td>${current.score}</td>
                    <td>${current.time}</td>
                </tr>
            `);
            res.results.forEach(res=>{
                $("#rank").append(`
                    <tr>
                        <td>${res.index}</td>
                        <td>${res.lines}</td>
                        <td>${res.score}</td>
                        <td>${res.time}</td>
                    </tr>
                `); 
            });
        });
    }
}
window.addEventListener("keydown",(e)=>{//鍵盤控制
    if(control.play){
        switch(e.key){
            case "ArrowLeft":
                control.load.left();
                e.preventDefault();
                break;
            case "ArrowRight":
                control.load.right();
                e.preventDefault();
                break;
            case "ArrowUp":
                control.load.up();
                e.preventDefault();
                break;
            case "ArrowDown":
                control.load.down();
                e.preventDefault();
                break;
            case " ":
                control.load.under();
                e.preventDefault();
                break;
            case "Tab":
                if(control.cheat){
                    control.preload.cheat();
                }
                e.preventDefault();
                break;
        }
        control.tetris += e.key;
        if(control.tetris.includes("tetris")){
            $("#cheat").show();
            control.cheat = true;
        }
    }
});
$(".modal").on("hide.bs.modal",(e)=>{
    if(!control.play){
        e.preventDefault();
    }
})
