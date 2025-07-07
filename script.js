/*********************
 * *****DOM Elements***
 **********************/

const mortgageAmount = document.querySelector(".input-mortagage-amount");
const poundSymbol = document.querySelector(".currency-pound");

const mortgageTerms = document.querySelector(".year-perc-input");
const yearSymbol = document.querySelector(".symbol-right");

const percentageInput = document.querySelector(".prc-inpt");
const percentageSymbol = document.querySelector(".perc-symbol");

const resultsEmptyCard = document.querySelector(".mortgate-results");

const interestOnlyRadio = document.querySelector(
  'input[type="radio"][value="Interest Only"]'
);
const repaymentsRadio = document.querySelector(
  'input[type="radio"][value="repayment"]'
);

const submitButton = document.querySelector(".submit-btn");

const clearButton = document.querySelector(".text-clear");
// When user clicks a field that field should become active , having those styles

/*********************** /
 * *****Helper FUnctions****
 ************************/

// Function This adds active class in active field
const activeField = function (symbolType, inputFieldType) {
  console.log("I am Called");
  inputFieldType.classList.add("active");
  symbolType.style.backgroundColor = "#d9db2e";
};
//  Function This removes active class in active field

const removeActiveField = function (symbolType, inputFieldType) {
  inputFieldType.classList.remove("active");
  symbolType.style.backgroundColor = " #e3f4fc";
};
// Function to activate wrong / no entry mode

const emptyFields = function (symbolType, inputFieldType) {
  inputFieldType.classList.add("empty-fields");
  symbolType.style.backgroundColor = "red";
  inputFieldType.placeholder = "required";
};

// Function to calculate mortgage
const mortgageCalculation = function (mortgageType) {
  const mortgageAmountPrinciple = Number(mortgageAmount.value);
  const yearlyTerm = Number(mortgageTerms.value);
  const interestRate = Number(percentageInput.value);

  const monthlyInterestRate = interestRate / 12 / 100;
  const numberofPayments = yearlyTerm * 12;
  if (mortgageType === "repayments") {
    const numerator =
      mortgageAmountPrinciple *
      monthlyInterestRate *
      (1 + monthlyInterestRate) ** numberofPayments;

    const denominator = (1 + monthlyInterestRate) ** numberofPayments - 1;

    const resultMonthlyRepayment = numerator / denominator;
    const resulttotalRepayment = resultMonthlyRepayment * numberofPayments;

    return [resultMonthlyRepayment.toFixed(2), resulttotalRepayment.toFixed(2)];
  } else if (mortgageType === "interestOnly") {
    const resultMonthlyInterestPayment =
      mortgageAmountPrinciple * monthlyInterestRate;
    const resultTotalInterestOnlyPayment =
      resultMonthlyInterestPayment * numberofPayments;

    return [
      resultMonthlyInterestPayment.toFixed(2),
      resultTotalInterestOnlyPayment.toFixed(2),
    ];
  } else {
    console.log("error");
  }
};

// Function to clear all fields

function clearAll() {
  mortgageAmount.value = null;
  mortgageTerms.value = null;
  percentageInput.value = null;

  repaymentsRadio.checked = false;
  interestOnlyRadio.checked = false;
}
/*****************
 * Event Listeners***
 ******************/

// Listeeres for adding acitve classes when user clicks on input
mortgageAmount.addEventListener("focus", () => {
  activeField(poundSymbol, mortgageAmount);
});
mortgageTerms.addEventListener("focus", () => {
  activeField(yearSymbol, mortgageTerms);
});

percentageInput.addEventListener("focus", () => {
  activeField(percentageSymbol, percentageInput);
});
// Listeners for remove active class when user loses focus

mortgageAmount.addEventListener("blur", () => {
  removeActiveField(poundSymbol, mortgageAmount);
});
mortgageTerms.addEventListener("blur", () => {
  removeActiveField(yearSymbol, mortgageTerms);
});

percentageInput.addEventListener("blur", () => {
  removeActiveField(percentageSymbol, percentageInput);
});

clearButton.addEventListener("click", clearAll);
// listens for submission of Calculations
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    mortgageAmount.value === "" ||
    mortgageTerms.value === "" ||
    percentageInput.value === ""
  ) {
    if (mortgageAmount.value === "") {
      emptyFields(poundSymbol, mortgageAmount);
    }
    if (mortgageTerms.value === "") {
      emptyFields(yearSymbol, mortgageTerms);
    }
    if (percentageInput.value === "") {
      emptyFields(percentageSymbol, percentageInput);
    }
  } else {
    let monthly = 0;
    let totalmonthly = 0;
    if (repaymentsRadio.checked) {
      const mt = mortgageCalculation("repayments");
      monthly = mt[0];
      totalmonthly = mt[1];
    }
    if (interestOnlyRadio.checked) {
      const mt = mortgageCalculation("interestOnly");
      console.log(mt);
      monthly = mt[0];
      totalmonthly = mt[1];
    }

    const html = `
    <div class="mortgate-results mortgage-results-completed">
        <div class="completed-row-first">
          <h2 class="heading-completed">Your results</h2>
          <p class="text-completed">
            Your results are shown below based on the information you provided.
            To adjust the results , edit the form and click "calculate
            repayments" again
          </p>
        </div>

        <div class="completed-second-row">
          <div class="completed-second-row-wrapper">
            <p class="text-completed">Your monthly repayments</p>
            <h2 class="text-final-repayment-result">${monthly}</h2>
          </div>
          <hr />
          <div class="completed-second-row-wrappaer-two">
            <p class="text-completed text-repay">
              Total you will repay over the term
            </p>
            <h2 class="text-final-repay-term-result">${totalmonthly}</h2>
          </div>
        </div>

        <div class="completed-row-second"></div>
      </div>
    `;

    resultsEmptyCard.classList.remove("show"); // Reset previous state
    resultsEmptyCard.innerHTML = html;
    resultsEmptyCard.classList.add("hidden");

    setTimeout(() => {
      resultsEmptyCard.innerHTML = html; // Replace content
      resultsEmptyCard.classList.remove("hidden"); // Reset hidden
      resultsEmptyCard.classList.add("show"); // Trigger fade-in
    }, 200);
  }
});
