class square{
    constructor(index){
        this.index = index;
        this.type = control.squares.type[this.index];
        this.color = control.squares.color[this.index];
        this.x = 4;
        this.y = this.type.length;
    }
    cheat(){//作弊模式
        this.index = (this.index + 1) % 7;
        this.type = control.squares.type[this.index];
        this.color = control.squares.color[this.index];
        control.drawPreloadTable();
    }
    down(){//下降
        this.draw(false);
        this.y++;
        if(this.collision()){
            this.update();
        }else{
            this.draw(true);
        }        
    }
    left(){//左移動
        this.draw(false);
        this.x--;
        if(this.collision()) this.x++;
        this.draw(true);
    }
    right(){//右移動
        this.draw(false);
        this.x++;
        if(this.collision()) this.x--;
        this.draw(true);
    }
    up(){//旋轉
        this.draw(false);
        let count = this.type.length;
        let t = Array.from({length:count},()=>Array.from({length:count},()=>0));
        this.type.forEach((row,y)=>{
            row.forEach((value,x)=>{
                t[y][x] = this.type[count-1-x][y];
            });
        });
        let copy = this.type.slice();
        this.type = t.slice();
        if(this.collision()) this.type = copy.slice();
        this.draw(true);
    }
    sweep(){//消方塊
        let count = 0;
        for(let y = 0;y<20;y++){
            let check = true;
            for(let x=0;x<10;x++){
                if(l(y,x).style.backgroundColor=="white") check = false;
            }
            if(check){
                count++;
                for(let x=0;x<10;x++){
                    l(y,x).style.backgroundColor = "white";
                    for(let z=y;z>0;z--){
                        l(z,x).style.backgroundColor = l(z-1,x).style.backgroundColor;
                    }
                    l(0,x).style.backgroundColor = "white";
                }
            }
        }
        control.user.lines += count;
        control.user.score += [0,40,100,300,1200][count];
        if(count && control.teach){
            localStorage.setItem("teach","true");
            location.reload();            
        }
    }
    under(){//置底
        this.draw(false);
        while(!this.collision()){
            this.y++;
        }
        this.update();
    }
    draw(check){//繪製方塊
        this.type.forEach((row,y)=>{
            row.forEach((value,x)=>{
                if(value){
                    let yy = this.y+y;
                    let xx = this.x+x;
                    if(check){
                        l(yy,xx).style.backgroundColor = this.color;
                    }else{
                        l(yy,xx).style.backgroundColor = "white";
                    }
                }
            });
        });
    }
    collision(){//偵測碰撞
        let check = false;
        this.type.forEach((row,y)=>{
            row.forEach((value,x)=>{
                if(value){
                    let yy = this.y+y;
                    let xx = this.x+x;
                    if(l(yy,xx)){
                        if(l(yy,xx).style.backgroundColor!="white") check = true;
                    }else{
                        check = true;
                    }
                }
            });
        });
        return check;
    }
    update(){//更新方塊
        this.y--;
        this.draw(true);
        this.sweep();
        control.getNewSquare();
    }
}
control.squares.type = [
    [
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0],
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0],
    ],
    [
        [1,0,0],
        [1,0,0],
        [1,1,0],
    ],
    [
        [1,1],
        [1,1],
    ],
    [
        [0,0,0],
        [0,1,1],
        [1,1,0],
    ],
    [
        [0,0,0],
        [1,1,1],
        [0,1,0],
    ],
    [
        [0,0,0],
        [1,1,0],
        [0,1,1],
    ],
];
control.squares.name = [
    "I",
    "J",
    "L",
    "O",
    "S",
    "T",
    "Z",
];
control.squares.color = [
    "#00ffff",
    "#0000ff",
    "#ffa500",
    "#ffff00",
    "#00ff00",
    "#aa00ff",
    "#ff0000",
];
