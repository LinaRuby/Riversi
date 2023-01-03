let Board = [];

// board 8x8
let gamediv = document.getElementById('game')

let vectors = [
    //top
    [-1, 0],
    //down 
    [1, 0],
    //left
    [0, -1],
    //right
    [0, 1],
    //top-left
    [-1, -1],
    //top-right
    [-1, 1],
    //down-left
    [1, -1],
    //down-right
    [1, 1]
];

let white = 1;
let black = -1;

let current = -1;


function buildBoard(rows = 8, colms =
    null) {
    Board = [];
    if (rows && !colms) {
        colms = rows
    }
    for (row = 0; row < rows; row++) {
        Board.push([]);
        for (cell = 0; cell < colms; cell++) {
            Board[row].push(0);
        }
    }
    Board[3][3] = -1; // это черные
    Board[4][4] = -1;
    Board[3][4] = 1; // это белые
    Board[4][3] = 1;
}


function drawBoard() {
    gamediv.innerHTML = '';
    let res = NoMove();

    for (let [y, row] of Board.entries()) {
        div = document.createElement('div')
        for (let [x, cell] of row.entries()) {
            divcell = document.createElement('div')
            divcell.classList.add('cell')
            if (res.filter(v => y == v[1] && x == v[0]).length > 0) {
                divcell.classList.add('valid')
            }

            if (cell == -1) {
                mark = document.createElement('div')
                mark.classList.add('mark')
                mark.classList.add('black')
                divcell.append(mark)
            }
            if (cell == 1) {
                mark = document.createElement('div')
                mark.classList.add('mark')
                mark.classList.add('white')
                divcell.append(mark)
            }

            divcell.dataset.x = x;
            divcell.dataset.y = y;

            div.append(divcell)

            divcell.addEventListener('click', function(event) {
                    let x = Number.parseInt(event.target.dataset.x);
                    let y = Number.parseInt(event.target.dataset.y);

                    if (validCell(x, y)) {
                        Board[y][x] = current;
                        let vEnemies = haveEnemy(vectors, x, y)
                        let validVectors = haveAlly(vEnemies, x, y);
                        validVectors.forEach((v) => {
                            changeMark(v, x, y);
                        });
                        current *= -1;
                        let nM = NoMove()
                        if (nM.length == 0) {
                            alert('Не осталось ходов, вы пропускаете ход!')
                            current *= -1;
                            nM = NoMove()
                            if (nM.length == 0) {
                                alert('Игра окончена, не осталось ходов!')
                                let bMarks = 0;
                                let wMarks = 0;
                                for (let [y, row] of Board.entries()) {
                                    for (let [x, cell] of row.entries()) {
                                        if (cell == white) {
                                            wMarks++
                                        }
                                        if (cell == black) {
                                            bMarks++
                                        }
                                    }
                                }
                                if (bMarks > wMarks) {
                                    alert('Победа за черными!')
                                }
                                if (wMarks > bMarks) {
                                    alert('Победа за белыми!')
                                }
                                if (wMarks == bMarks) {
                                    alert(' Ничья!')
                                }
                                buildBoard()
                            }
                        }

                    }
                    drawBoard()
                })
                /*// NoMove(x,y){

                if (x && y == 0){
                selected them
                return
                }
                if(x && y != 0){
                    return
                }
                }*/

            divcell.addEventListener('mouseenter', function(event) {
                let x = Number.parseInt(event.target.dataset.x);
                let y = Number.parseInt(event.target.dataset.y);
                let opponent = current * -1

                if (validCell(x, y)) {
                    event.target.classList.add('selected')
                }
            })



            divcell.addEventListener('mouseout', function(event) {
                event.target.classList.remove('selected')
            })
        }
        div.classList.add('row');
        gamediv.append(div);
    }
}

function NoMove() {
    let validMoves = [];
    for (let [y, row] of Board.entries()) {
        for (let [x, cell] of row.entries()) {
            if (validCell(x, y)) {
                validMoves.push([x, y])

            }
        }
    }
    return validMoves
}

function changeMark(v, x, y) {
    if (Board[y + v[0]][x + v[1]] == current) return;
    Board[y + v[0]][x + v[1]] *= -1;
    changeMark(v, x + v[1], y + v[0]);
}

function haveEnemy(vectors, x, y) {

    let opponent = current * -1;
    return vectors.filter((el) => Board[y + el[0]] && Board[y + el[0]][x + el[1]] == opponent);
}

function haveAlly(vectors, x, y) {
    let opponent = current * -1;
    return vectors.filter((v) => {
        if (Board[y + v[0]] && Board[y + v[0]][x + v[1]] == opponent) {
            return haveAlly([v], x + v[1], y + v[0]).length;

        }
        if (Board[y + v[0]] && Board[y + v[0]][x + v[1]] == current) {
            return true;
        }
        return false;
    })
}

function validCell(x, y) {


    let opponent = current * -1;

    if (Board[y] && Board[y][x] == 0 &&
        //соседи
        haveAlly(haveEnemy(vectors, x, y), x, y).length > 0) {
        return true;
    }
    return false;
}


buildBoard();
//buildBoardDef()
drawBoard();