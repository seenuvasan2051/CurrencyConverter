const BASE_URL =
  "https://v6.exchangerate-api.com/v6/e5f8f4a7d1abc8010b775292/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msgDiv = document.querySelector(".msg"); // Select the div.msg element


// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currcode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currcode;
    newOption.value = currcode;
    if (select.name === "from" && currcode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currcode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag image based on selected currency
const updateFlag = (element) => {
  let currcode = element.value;
  let countryCode = countryList[currcode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for button click to get exchange rate
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Fetch exchange rates
  let response = await fetch(BASE_URL);
  if (!response.ok) {
    console.error(
      "Failed to fetch exchange rates",
      response.status,
      response.statusText
    );
    msgDiv.innerHTML = "Failed to fetch exchange rates";
    return;
  }

  let data = await response.json();
  let exchangeRate = data.conversion_rates[toCurr.value];
  if (!exchangeRate) {
    console.error("Failed to get the exchange rate for", toCurr.value);
    msgDiv.innerHTML = `Failed to get the exchange rate for ${toCurr.value}`;
    return;
  }

  let convertedAmount = amtVal * exchangeRate;
  msgDiv.innerHTML = `${amtVal} ${fromCurr.value} = ${convertedAmount.toFixed(
    2
  )} ${toCurr.value}`;
});
