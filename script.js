// scroll to booking when button clicked
document.getElementById("scrollBtn").addEventListener("click", function() {
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
});

// cart array and total
var cart = [];
var total = 0;

// all add buttons
var btns = document.querySelectorAll(".add-btn");

btns.forEach(function(btn) {
    btn.addEventListener("click", function() {

        var itemName = this.dataset.name;
        var itemPrice = parseFloat(this.dataset.price);

        // check if already in cart
        var found = -1;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === itemName) {
                found = i;
                break;
            }
        }

        if (found === -1) {
            // not in cart, so add it
            cart.push({ name: itemName, price: itemPrice });
            total = total + itemPrice;
            this.textContent = "Remove Item ⊖";
            this.classList.add("remove-btn-style");
        } else {
            // already in cart, remove it
            total = total - cart[found].price;
            cart.splice(found, 1);
            this.textContent = "Add Item ⊕";
            this.classList.remove("remove-btn-style");
        }

        showCart();
    });
});

function showCart() {
    var tbody = document.getElementById("cart-items");
    tbody.innerHTML = "";

    for (var i = 0; i < cart.length; i++) {
        var row = "<tr><td>" + (i + 1) + "</td><td>" + cart[i].name + "</td><td>₹" + cart[i].price.toFixed(2) + "</td></tr>";
        tbody.innerHTML += row;
    }

    document.getElementById("total-amount").textContent = total.toFixed(2);
}

// book now button
document.querySelector(".book-btn").addEventListener("click", function() {

    var name = document.getElementById("fullname").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;

    if (name == "" || email == "" || phone == "") {
        alert("Please fill in all the fields.");
        return;
    }

    if (cart.length == 0) {
        alert("Please add at least one service to the cart.");
        return;
    }

    // send email using emailjs
    var servicesList = "";
    for (var i = 0; i < cart.length; i++) {
        servicesList += cart[i].name;
        if (i < cart.length - 1) servicesList += ", ";
    }

    emailjs.send("service_ibuwqdl", "template_acja5do", {
        name: name,
        to_email: email,
        phone: phone,
        services: servicesList,
        total: total.toFixed(2)
    }).then(function() {

        document.getElementById("success-msg").textContent = "Thank you For Booking the Service We will get back to you soon!";

        // clear everything after booking
        cart = [];
        total = 0;
        showCart();

        document.querySelectorAll(".add-btn").forEach(function(b) {
            b.textContent = "Add Item ⊕";
            b.classList.remove("remove-btn-style");
        });

        document.getElementById("fullname").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";

    }).catch(function(err) {
        alert("Email could not be sent. Try again.");
        console.log(err);
    });

});
