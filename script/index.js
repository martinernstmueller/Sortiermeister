const computer = document.getElementsByClassName('computer')[0];
const human = document.getElementsByClassName('human')[0];

let nums = []

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
    ]
    return colors[nums.indexOf(num)]
}

const createDiv = () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.classList.add('box');
    let num = Math.floor(Math.random() * 50)
    while (nums.includes(num)) {
        num = Math.floor(Math.random() * 50)
    }
    nums.push(num)
    div.style.backgroundColor = getColor(num);
    span.innerHTML = num.toString();
    div.appendChild(span);
    return div;
}

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
            if (!touch) {
                touch = parseInt(box.children.item(0).innerHTML)
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
                } else {
                    touch = null;
                    box.classList.remove("active")
                }
            }
        })
    })
    let i = 1;
    let j = 0;
    let sortStage = () => {
        if (i < computerBoxes.length) {
            if (j < i) {
                if (parseInt(computerBoxes[i].children.item(0).innerHTML) < parseInt(computerBoxes[j].children.item(0).innerHTML)) {
                    let temp = computerBoxes[i].children.item(0).innerHTML;
                    computerBoxes[i].style.backgroundColor = getColor(parseInt(computerBoxes[j].children.item(0).innerHTML));
                    computerBoxes[j].style.backgroundColor = getColor(parseInt(temp));
                    computerBoxes[i].children.item(0).innerHTML = computerBoxes[j].children.item(0).innerHTML;
                    computerBoxes[j].children.item(0).innerHTML = temp;
                    setTimeout(sortStage, 1000);
                    j++
                    return
                }
                j++;
            } else {
                j = 0;
                i++;
            }
            sortStage()
        }
    };
    sortStage()
}