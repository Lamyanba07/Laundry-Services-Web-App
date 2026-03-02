document.addEventListener("DOMContentLoaded", function () {

  // Smooth Scroll
  const scrollBtn = document.getElementById("scrollBtn");

  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
      });
    });
  }

});

let cart = [];
let total = 0;

const addButtons = document.querySelectorAll(".add-btn");
const cartTable = document.getElementById("cart-items");
const totalAmount = document.getElementById("total-amount");

addButtons.forEach(button => {
  button.addEventListener("click", function () {

    const name = this.dataset.name;
    const price = parseFloat(this.dataset.price);

    const existingIndex = cart.findIndex(item => item.name === name);

    if (existingIndex === -1) {
      // ADD ITEM
      cart.push({ name, price });
      total += price;

      this.textContent = "Remove Item";
      this.classList.add("remove-style");

    } else {
      // REMOVE ITEM
      total -= cart[existingIndex].price;
      cart.splice(existingIndex, 1);

      this.textContent = "Add Item";
      this.classList.remove("remove-style");
    }

    updateCart();
  });
});

function updateCart() {
  cartTable.innerHTML = "";

  cart.forEach((item, index) => {
    cartTable.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>₹${item.price.toFixed(2)}</td>
      </tr>
    `;
  });

  totalAmount.textContent = total.toFixed(2);
}

const bookBtn = document.querySelector(".book-btn");
const successMessage = document.getElementById("success-message");

bookBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !phone) {
    alert("Please fill all details.");
    return;
  }

  if (cart.length === 0) {
    alert("Please add at least one service.");
    return;
  }

  // SEND EMAIL (UPDATED VERSION)
  emailjs.send("service_ibuwqdl", "template_acja5do", {
    name: name,
    to_email: email,
    phone: phone,
    services: cart.map(item => item.name).join(", "),
    total: total.toFixed(2)
  })
  .then(function () {

    successMessage.textContent =
      "Thank you for booking the service. We will get back to you soon!";

    // Clear cart
    cart = [];
    total = 0;
    updateCart();

    // Reset buttons
    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.textContent = "Add Item";
      btn.classList.remove("remove-style");
    });

    // Clear form
    document.getElementById("fullname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";

  })
  .catch(function (error) {
    console.log("FAILED...", error);
    alert("Failed to send email. Please try again.");
  });

});
