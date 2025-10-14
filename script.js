document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('tree-container');

    const lsystem = {
        axiom: 'X',
        rules: {
            X: 'F-[[X]+X]+F[+FX]-X',
            F: 'FF'
        },
        angle: 25,
        iterations: 4,
        length: 100,
        lengthFactor: 0.5,
        startX: 400,
        startY: 600
    };

    function generate() {
        let current = lsystem.axiom;
        for (let i = 0; i < lsystem.iterations; i++) {
            let next = '';
            for (let char of current) {
                next += lsystem.rules[char] || char;
            }
            current = next;
        }
        return current;
    }

    function draw(instructions) {
        const stack = [];
        let x = lsystem.startX;
        let y = lsystem.startY;
        let angle = -90;
        let len = lsystem.length;

        for (let char of instructions) {
            switch (char) {
                case 'F':
                    const x2 = x - len * Math.cos(angle * Math.PI / 180);
                    const y2 = y + len * Math.sin(angle * Math.PI / 180);

                    const branch = document.createElement('div');
                    branch.classList.add('branch');
                    const distance = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));
                    branch.style.width = '2px';
                    branch.style.height = `${distance}px`;
                    branch.style.left = `${x}px`;
                    branch.style.top = `${y - distance}px`;
                    branch.style.transform = `rotate(${angle + 90}deg)`;
                    container.appendChild(branch);

                    x = x2;
                    y = y2;
                    break;
                case '+':
                    angle += lsystem.angle;
                    break;
                case '-':
                    angle -= lsystem.angle;
                    break;
                case '[':
                    stack.push({ x, y, angle, len });
                    len *= lsystem.lengthFactor;
                    break;
                case ']':
                    const state = stack.pop();
                    x = state.x;
                    y = state.y;
                    angle = state.angle;
                    len = state.len;
                    break;
            }
        }
    }

    const instructions = generate();
    draw(instructions);
});
