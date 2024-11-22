const computer = document.getElementsByClassName('computer')[0];
const human = document.getElementsByClassName('human')[0];

let gameEnded = false;

const checkWinner = (boxes, player) => {
    const winContainer = document.getElementById('popUpContainer');
    const winPopup = document.getElementById('winPopup');
    const losePopup = document.getElementById('losePopup');
    const overlay = document.getElementById('overlay1');
    for (let i = 1; i < boxes.length; i++) {
        let previousBox = parseInt(boxes[i - 1].children[0].innerHTML);
        let currentBox = parseInt(boxes[i].children[0].innerHTML);
        if (previousBox > currentBox) {
            return false;
        }
    }
    if (player === "Computer") {
        winContainer.style.display = "block";
        losePopup.style.display = "block";
        overlay.style.display = "block";
    } else if (player === "Spieler") {
        winContainer.style.display = "block";
        winPopup.style.display = "block";
        overlay.style.display = "block";
    }
    gameEnded = true;
    return true;
};

const tryAgain = () => {
    location.reload();
};

let nums = [];
let speed = 3000;
const getColor = (num) => {
    const colors = [
        '#FF0000',
        '#00ffc3',
        '#56d381',
        '#00FF00',
        '#0000FF',
        '#4B0082',
        '#9400D3',
        '#FF0000',
        '#FF7F00',
        '#9c7aa4'
    ];
    return colors[nums.indexOf(num)];
};

const popup = document.getElementById('buttonContainer');
const overlay = document.getElementById('overlay1');
let setSortSpeed = (sortSpeed) => {
    speed = sortSpeed;
    popup.style.display = 'none';
    overlay.style.display = 'none';
    startSort();
};

const createDiv = () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.classList.add('box');
    let num = Math.floor(Math.random() * 1 + 50);
    while (nums.includes(num)) {
        num = Math.floor(Math.random() * 1 + 50);
    }
    nums.push(num);
    div.style.backgroundColor = getColor(num);
    div.style.borderRadius = "10px";
    span.innerHTML = num.toString();
    div.appendChild(span);
    return div;
};

for (let i = 0; i < 10; i++) {
    let div = createDiv();
    human.appendChild(div.cloneNode(true));
    div.classList.add('cbox');
    computer.appendChild(div);
}

let touch;

const startSort = () => {
    const allBoxes = document.getElementsByClassName('box');
    const computerBoxes = document.getElementsByClassName('cbox');
    const playerBoxes = Array.from(allBoxes).filter(box => !box.classList.contains('cbox'));
    playerBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            if (gameEnded) return;
            if (!touch) {
                touch = parseInt(box.children.item(0).innerHTML);
                box.classList.add('active');
            } else {
                if (touch !== parseInt(box.children.item(0).innerHTML)) {
                    const temp = box.children.item(0).innerHTML;
                    box.children.item(0).innerHTML = touch;
                    box.style.backgroundColor = getColor(touch);
                    const activeBox = document.getElementsByClassName('active')[0];
                    activeBox.children.item(0).innerHTML = temp;
                    activeBox.style.backgroundColor = getColor(parseInt(temp));
                    activeBox.classList.remove('active');
                    touch = null;
                    if (checkWinner(playerBoxes, "Spieler")) {
                        return;
                    }
                } else {
                    touch = null;
                    box.classList.remove("active");
                }
            }
        });
    });

    let i = 1;
    let j = 0;
    let sortStage = () => {
        if (gameEnded) return;
        if (i < computerBoxes.length) {
            if (j < i) {
                if (parseInt(computerBoxes[i].children.item(0).innerHTML) < parseInt(computerBoxes[j].children.item(0).innerHTML)) {
                    let temp = computerBoxes[i].children.item(0).innerHTML;
                    computerBoxes[i].style.backgroundColor = getColor(parseInt(computerBoxes[j].children.item(0).innerHTML));
                    computerBoxes[j].style.backgroundColor = getColor(parseInt(temp));
                    computerBoxes[i].children.item(0).innerHTML = computerBoxes[j].children.item(0).innerHTML;
                    computerBoxes[j].children.item(0).innerHTML = temp;
                    setTimeout(sortStage, speed);
                    j++;
                    return;
                }
                j++;
            } else {
                j = 0;
                i++;
            }
            sortStage();
        } else {
            checkWinner(computerBoxes, "Computer");
        }
    };
    sortStage();
};
