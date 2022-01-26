listenEvents();

function listenEvents() {
    const resetBtn = document.getElementById('reset-btn');
    const tipBtns = document.querySelectorAll('.tip-button');
    const bill = document.getElementById('bill');
    const people = document.getElementById('people');
    let tip;

    tipBtns.forEach(function(btn) {
        if (btn.type == 'text') {
            btn.addEventListener('input', function() {
                toValidNum(btn);
                tip = btn.value;
                calculate(tip);
            })
        }
        btn.addEventListener('click', function() {
            const activeTip = document.querySelectorAll('.active');
            if (activeTip[0]) {
                activeTip[0].classList.remove('active');
            }
            btn.classList.add('active');
            tip = btn.value;
            calculate(tip);  
        })       
    })

    bill.addEventListener('input', function() {
        toValidNum(bill);
        calculate(tip);
    })
    people.addEventListener('input', function() {
        toValidNum(people);
        calculate(tip);
    })
    resetBtn.addEventListener('click', () => reset(bill, people));
}

function toValidNum(input) {
    const noZeroVal = document.querySelectorAll('.no-zero-value');
    
    if (input.id == 'bill') {
        // allow only numbers from zero to 9 and dots
        input.value = input.value.replace(/[^0-9.]/g, '');
        // allow only one dot
        input.value = input.value.replace(/(\..*?)\..*/g, '$1');
        // allow only two digits after dot
        input.value = input.value.replace(/(?<=\.[0-9]{2}).+/g, ''); // snippet from https://stackoverflow.com/a/54771402/13297467      
    } else {
        // allow only numbers
        input.value = input.value.replace(/[^0-9]/g, '');
    }
    
    if (input.value && +input.value == 0 && input.id != 'custom') {
        noZeroVal.forEach( function(val) {
            if (val.classList.contains(input.id)) {
                val.querySelector('p').innerText = 'Can\'t be zero.';
            }
        });
        input.classList.add('no-zero-input')
    } else {   
        noZeroVal.forEach( function(val) {
            if (val.classList.contains(input.id)) {
                val.querySelector('p').innerText = '';
            }
        });
        input.classList.remove('no-zero-input');
    }
}

function calculate(tip) {
    const bill = document.getElementById('bill');
    const people = document.getElementById('people');
    
    if (!tip) { tip = 0 }
    const t = +tip / 100;
    const b = +bill.value;
    const p = +people.value;

    const resTip = (b * t) / p;
    const resTotal = (b + (b * t)) / p;

    if (!isNaN(resTotal) && resTotal != Infinity) {
        displayResult(resTip, resTotal);
        switchResetButton(true);
    } else { 
        displayResult(0, 0);
        switchResetButton(false);
    }  
}

function displayResult(tipP, totalP) {
    const tipPerson = document.getElementById('tipPerson');
    const totalPerson = document.getElementById('totalPerson');  
    tipPerson.innerText = '$' + tipP.toFixed(2);
    totalPerson.innerText = '$' + totalP.toFixed(2);
}

function switchResetButton(state) {
    const button = document.querySelector('button.reset'); 
    if (state) button.removeAttribute('disabled');
    else button.setAttribute('disabled', '');   
}

function reset(bill, people) {   
    const activeTip = document.getElementsByClassName('active'); 
    if (activeTip[0]) {
        if (activeTip[0].id == 'custom') { activeTip[0].value = '' }   
        activeTip[0].classList.remove('active')
    }
    bill.value = people.value = '';
    displayResult(0, 0);
    switchResetButton(false);
}