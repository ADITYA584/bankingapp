'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// // Data
// const account1 = {
//   owner: 'Aditya Sharma',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jyoti Sharma',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Ishu Sharma',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sonal Katiyar',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
  owner: 'Aditya Sharma',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'hi-IN', // de-DE
};

const account2 = {
  owner: 'Jyoti Sharma',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'hi-IN',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements')
const balancedate = document.querySelector('.movements_date')

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const incorrectlogindetail = document.querySelector('.incorrectlogin');

const closed_btn = document.querySelector('.closed');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// UPDATE UI Function

const updateui = function (acc) {
  displaybalance(acc);
  displaymovements(acc);
  displaysummary(acc);
};

//getdate
const optiondate= {
  year: 'numeric',
  month:'numeric',
  day :'numeric',
  hour :'numeric',
  minute: 'numeric'
}
const formatDate = function(date,locale){

  const calcdaygap = (date1,date2) => Math.round(Math.abs((date2 - date1))/(1000*60*60*24));
  
  const daygap = calcdaygap(date,new Date());
  // console.log (daygap)
  
  if(daygap === 0 ) return 'Today'
  if(daygap === 1 ) return 'yesterday'
  if(daygap <= 7 ) return `${daygap} days ago`
  
  return new Intl.DateTimeFormat(locale).format(date);

}

const optionnum = {
  style: 'currency',
  currency : 'INR'
}

// DISPLAYING MONEY MOVEMENTS IN THE APP.
containerMovements.innerHTML = {};
const displaymovements = (acc, sort = false) => {
  const movements = acc.movements;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // update date
    labelDate.textContent = new Intl.DateTimeFormat(acc.locale,optiondate).format(new Date())
    // const date= new Date(acc.movementsDates[i]);
    // const day  = date.getDate();
    // const month = date.getMonth()
    // const year = date.getFullYear();
    const date = new Date(acc.movementsDates[i])
   const displaydate = formatDate(date,acc.locale);

    const new_row = `<div class="movements__row">
      <div class="movements__type movements__type--${type} }">${
      i + 1
    }- ${type}</div>
     <div class="movements__date">${displaydate}</div>
      <div class="movements__value">${Intl.NumberFormat(acc.locale,optionnum).format(Math.abs(mov).toFixed(2))} </div>
      </div>`;
      

    containerMovements.insertAdjacentHTML('afterbegin', new_row);
  });
};

//display balance
let balance;
const displaybalance = function (acc) {
  const movs = acc.movements;
   balance = movs.reduce(function (acc, curr) {
    return acc + curr;
  }, 0);

  labelBalance.textContent = `${Intl.NumberFormat(acc.locale,optionnum).format(balance.toFixed(2))} `;
};

//creating account ID's from NAME

const createuser_id = acc => {
  acc.forEach(ac => {
    ac.user_id = ac.owner
      .toLowerCase()
      .split(' ')
      .map(id => id[0])
      .join('');
  });
};
createuser_id(accounts);

//summarydisplay

const displaysummary = acc => {
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = ` ${Intl.NumberFormat(acc.locale,optionnum).format(deposit.toFixed(2))} `;
  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${(Intl.NumberFormat(acc.locale,optionnum).format(Math.abs(withdrawal.toFixed(2))))} `;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${Intl.NumberFormat(acc.locale,optionnum).format(interest.toFixed(2))} `;
};

// timerfunction
const settimer = function(){
  // set time


  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = time%60

    labelTimer.textContent = `${min} : ${`${sec}`.padStart(2,0)}`
    
    if(time===0){
      clearInterval(timer);
      labelWelcome.textContent = "successfully LOGED OUT";
      containerApp.style.opacity =0;
    }

    time--;

  }
  
 let time = 5*60
  tick();
  // refresh time every Second
 const timer = setInterval(tick,1000)
 return timer
}

let currentaccount,timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentaccount = accounts.find(
    acc => acc.user_id === inputLoginUsername.value.toLowerCase()
  );
  if (currentaccount?.pin === +inputLoginPin.value) {
    containerMovements.innerHTML = {};
    containerApp.style.zIndex = '1';

    document.querySelector('.incorrectlogin').style.opacity = 0;

    labelWelcome.textContent = `Welcome ${
      [...currentaccount.owner.split(' ')][0]
    } `;
    inputLoginPin.value = '';
    inputLoginUsername.value = '';

    // update UI
    //displayAPP
    containerApp.style.opacity = 100;
    if(timer)clearInterval(timer)
    timer = settimer()
    updateui(currentaccount);
  } else {
    containerMovements.innerHTML = {};
    containerApp.style.opacity = 0;
    incorrectlogindetail.style.opacity = 100;
    inputLoginPin.value = '';
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.zIndex = '0';
  }
});
closed_btn.addEventListener('click', function () {
  incorrectlogindetail.style.opacity = 0;
  inputLoginPin.value = '';
  inputLoginUsername.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

//woring OF TRANSFER BUTTON

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const transferaccount = accounts.find(
    mov => mov.user_id === inputTransferTo.value.toLowerCase()
  );

  if (
    amount > 0 &&
    transferaccount &&
    balance >= amount &&
    transferaccount?.user_id !== currentaccount.user_id
  ) {
    
    transferaccount.movements.push(amount);
    currentaccount.movements.push(-amount);
    currentaccount.movementsDates.push(new Date().toISOString());
    transferaccount.movementsDates.push(new Date().toISOString());

    //toUPDATE UI
    if(timer)clearInterval(timer)
    timer = settimer()
    updateui(currentaccount);
    //cleathefields
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    setTimeout(()=>{
      alert(`PAYMENT SUCCESSFULL`)
    },200)
   
  } else {
    alert('PLEASE ENTER A VALID AMOUNT');
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
  }
});

//workingofLOANbutton

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const threshold = +inputLoanAmount.value * 0.1;
  // console.log(threshold)
  // console.log(currentaccount.movements.filter(mov=>mov>threshold).length)
  if (
    threshold > 0 &&
    currentaccount.movements.filter(mov => mov > threshold).length >= 1
  ) {

   setTimeout(function() {
    currentaccount.movements.push(threshold * 10);
    currentaccount.movementsDates.push(new Date().toISOString());


    // UI UPDATE
    if(timer)clearInterval(timer)
    timer = settimer()
    updateui(currentaccount);
    setTimeout(() => {
      alert("Loan CREDITED successfully!!")
    }, 50);
    
     } , 2500)
    inputLoanAmount.value = '';

  } else {
    alert('Requested LOAN cannot be PROCESSED');
    inputLoanAmount.value = '';
  }
});

//working of close button

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value.toLowerCase() === currentaccount.user_id &&
    +inputClosePin.value === currentaccount.pin
  ) {
    const index = accounts.findIndex(
      mov => mov.user_id === currentaccount.user_id
    );
    //deleteaCCOUNT
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
    labelWelcome.textContent  = 'Login to get started';
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displaymovements(currentaccount, !sorted);
  sorted = !sorted;
});
