const form = document.querySelector("form");
const amount = document.querySelector("#amount");
const expense = document.querySelector("#expense");
const category = document.querySelector("#category");

const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

amount.oninput = () => {
  let value = amount.value;
  const onlyNumberRegex = /\D+/g;
  const formatValue = value.replace(onlyNumberRegex, "");

  // transformando em centavos.
  value = Number(formatValue) / 100;

  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    amount: amount.value,
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    create_at: new Date(),
  };

  expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    expenseList.append(expenseItem);

    updateTotals();

    formClear();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
    console.log(error);
  }
}

function updateTotals() {
  try {
    const items = expenseList.children;

    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;

    for (let item = 0; item < items.length; item++) {
      const itemAmount = Number(
        items[item]
          .querySelector(".expense-amount")
          .textContent.replace("R$", "")
          .replace(",", ".")
      );

      if (isNaN(itemAmount)) {
        return alert(
          "Não foi possível calcular o total, O valor não parece ser um número."
        );
      }

      total += itemAmount;
    }

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    const totalFormate = formatCurrencyBRL(total)
      .toUpperCase()
      .replace("R$", "");

    expensesTotal.innerHTML = "";

    expensesTotal.append(symbolBRL, totalFormate);
  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais.");
  }
}

expenseList.addEventListener("click", (event) => {
  const removeIcon = event.target;

  if (removeIcon.classList.contains("remove-icon")) {
    const item = removeIcon.closest(".expense");
    item.remove();
  }

  updateTotals();
});

function formClear() {
  amount.value = "";
  expense.value = "";
  category.value = "";

  expense.focus();
}
