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
                calculate(bill, tip, people);
            })
        }
        btn.addEventListener('click', function() {
            const activeTip = document.querySelector('.tip-button.active');
            if (activeTip) {
                activeTip.classList.remove('active');
            }
            btn.classList.add('active');
            tip = btn.value;
            calculate(bill, tip, people);
        })       
    })

    bill.addEventListener('input', function() {
        toValidNum(bill);
        calculate(bill, tip, people);
    })
    people.addEventListener('input', function() {
        toValidNum(people);
        calculate(bill, tip, people);
    })
    resetBtn.addEventListener('click', () => reset(bill, people));
}

function toValidNum(input) { 
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

    if (input.id != 'custom' && input.value && +input.value == 0) {
        showZeroWarning(input, true)
    } else if (input.id != 'custom') { 
        showZeroWarning(input, false) 
    }
}

function showZeroWarning(input, show) {
    const zeroWarning = document.querySelector(`.zero-warning.${input.id}`);
    if (show) {
        zeroWarning.innerText = 'Can\'t be zero.';
        input.classList.add('border-warning')
    } else {
        zeroWarning.innerText = '';
        input.classList.remove('border-warning');
    }
}

function calculate(bill, tip, people) { 
    if (!tip) { tip = 0 }
    const b = +bill.value;
    const t = +tip / 100;
    const p = +people.value;

    const resTip = (b * t) / p;
    const resTotal = (b + (b * t)) / p;

    if (!isNaN(resTotal) && resTotal != Infinity && resTotal != 0) {
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

function switchResetButton(enable) {
    const button = document.querySelector('button.reset'); 
    if (enable) button.removeAttribute('disabled');
    else button.setAttribute('disabled', '');   
}

function reset(bill, people) {   
    const activeTip = document.querySelector('.tip-button.active');
    if (activeTip) {
        if (activeTip.id == 'custom') { activeTip.value = '' }   
        activeTip.classList.remove('active')
    }
    bill.value = people.value = '';
    displayResult(0, 0);
    switchResetButton(false);
}