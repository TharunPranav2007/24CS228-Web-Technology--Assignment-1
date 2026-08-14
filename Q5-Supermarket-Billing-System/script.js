/* =========================================================
   SUPERMARKET BILLING SYSTEM
   ========================================================= */


/* =========================================================
   1. GET HTML ELEMENTS
   ========================================================= */

const customerName =
    document.getElementById("customerName");

const billNumber =
    document.getElementById("billNumber");

const calculateBtn =
    document.getElementById("calculateBtn");

const resetBtn =
    document.getElementById("resetBtn");

const errorMessage =
    document.getElementById("errorMessage");

const billResult =
    document.getElementById("billResult");

const billCustomer =
    document.getElementById("billCustomer");

const displayBillNumber =
    document.getElementById("displayBillNumber");

const billItems =
    document.getElementById("billItems");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const finalAmountElement =
    document.getElementById("finalAmount");

const discountMessage =
    document.getElementById("discountMessage");


/* =========================================================
   2. CONSTANTS
   ========================================================= */

const DISCOUNT_RATE = 0.10;

const DISCOUNT_LIMIT = 2000;

const PRODUCT_COUNT = 3;


/* =========================================================
   3. GET NUMBER VALUE
   ========================================================= */

/*
    Converts an input value into a number.

    If the input is empty or invalid,
    it returns 0.
*/

function getNumberValue(inputId) {

    const input =
        document.getElementById(inputId);

    const value =
        Number(input.value);

    if (
        input.value === "" ||
        !Number.isFinite(value)
    ) {

        return 0;
    }

    return value;
}


/* =========================================================
   4. CALCULATE ONE PRODUCT AMOUNT
   ========================================================= */

/*
    Amount = Quantity × Unit Price

    This function is used for the LIVE
    amount calculation.
*/

function calculateProductAmount(
    quantity,
    unitPrice
) {

    return quantity * unitPrice;
}


/* =========================================================
   5. UPDATE LIVE AMOUNT
   ========================================================= */

/*
    This is the main fix for the problem.

    Whenever the quantity or unit price
    changes, this function is called.

    Example:

    Quantity = 2
    Price = 800

    Amount = 1600
*/

function updateProductAmount(productNumber) {

    const quantity =
        getNumberValue(
            `quantity${productNumber}`
        );

    const unitPrice =
        getNumberValue(
            `price${productNumber}`
        );


    let amount = 0;


    /*
        Only calculate when both values
        are valid and non-negative.
    */

    if (
        quantity >= 0 &&
        unitPrice >= 0
    ) {

        amount =
            calculateProductAmount(
                quantity,
                unitPrice
            );
    }


    const amountElement =
        document.getElementById(
            `amount${productNumber}`
        );


    amountElement.textContent =
        `₹${amount.toFixed(2)}`;


    /*
        Small visual feedback when
        the amount changes.
    */

    amountElement.classList.remove(
        "updated"
    );


    void amountElement.offsetWidth;


    amountElement.classList.add(
        "updated"
    );
}


/* =========================================================
   6. ADD LIVE CALCULATION EVENTS
   ========================================================= */

/*
    Add an input event to every quantity
    and price field.

    Therefore the amount changes
    immediately while typing.
*/

for (
    let i = 1;
    i <= PRODUCT_COUNT;
    i++
) {

    const quantityInput =
        document.getElementById(
            `quantity${i}`
        );

    const priceInput =
        document.getElementById(
            `price${i}`
        );


    quantityInput.addEventListener(
        "input",
        function () {

            updateProductAmount(i);
        }
    );


    priceInput.addEventListener(
        "input",
        function () {

            updateProductAmount(i);
        }
    );
}


/* =========================================================
   7. GET PRODUCT DETAILS
   ========================================================= */

function getProducts() {

    const products = [];


    for (
        let i = 1;
        i <= PRODUCT_COUNT;
        i++
    ) {

        const productInput =
            document.getElementById(
                `product${i}`
            );


        const productName =
            productInput.value.trim();


        const quantity =
            getNumberValue(
                `quantity${i}`
            );


        const unitPrice =
            getNumberValue(
                `price${i}`
            );


        const amount =
            calculateProductAmount(
                quantity,
                unitPrice
            );


        products.push({

            name:
                productName === ""
                    ? `Product ${i}`
                    : productName,

            quantity:
                quantity,

            unitPrice:
                unitPrice,

            amount:
                amount
        });
    }


    return products;
}


/* =========================================================
   8. VALIDATE PRODUCTS
   ========================================================= */

function validateProducts(products) {

    for (
        let i = 0;
        i < products.length;
        i++
    ) {

        /*
            Quantity must be greater than 0
            when generating the bill.
        */

        if (
            !Number.isFinite(
                products[i].quantity
            ) ||
            products[i].quantity <= 0
        ) {

            return false;
        }


        /*
            Unit price cannot be negative.
        */

        if (
            !Number.isFinite(
                products[i].unitPrice
            ) ||
            products[i].unitPrice < 0
        ) {

            return false;
        }
    }


    return true;
}


/* =========================================================
   9. CALCULATE SUBTOTAL
   ========================================================= */

function calculateSubtotal(products) {

    let subtotal = 0;


    for (
        let i = 0;
        i < products.length;
        i++
    ) {

        subtotal =
            subtotal +
            products[i].amount;
    }


    return subtotal;
}


/* =========================================================
   10. CALCULATE DISCOUNT
   ========================================================= */

/*
    Discount is applied ONLY when:

    subtotal > ₹2000
*/

function calculateDiscount(subtotal) {

    if (subtotal > DISCOUNT_LIMIT) {

        return subtotal * DISCOUNT_RATE;

    } else {

        return 0;
    }
}


/* =========================================================
   11. CALCULATE FINAL AMOUNT
   ========================================================= */

function calculateFinalAmount(
    subtotal,
    discount
) {

    return subtotal - discount;
}


/* =========================================================
   12. CREATE BILL ITEM
   ========================================================= */

/*
    Creates a bill row safely using
    DOM elements instead of directly
    inserting user input as HTML.
*/

function createBillItem(
    productName,
    quantity,
    amount,
    isHeader = false
) {

    const row =
        document.createElement("div");


    row.className =
        "bill-item";


    if (isHeader) {

        row.classList.add(
            "bill-item-header"
        );
    }


    const name =
        document.createElement("span");


    const quantityElement =
        document.createElement("span");


    const amountElement =
        document.createElement("span");


    name.textContent =
        productName;


    quantityElement.textContent =
        quantity;


    amountElement.textContent =
        isHeader
            ? amount
            : `₹${amount.toFixed(2)}`;


    if (!isHeader) {

        name.classList.add(
            "item-name"
        );
    }


    row.appendChild(name);

    row.appendChild(quantityElement);

    row.appendChild(amountElement);


    return row;
}


/* =========================================================
   13. DISPLAY PRODUCTS
   ========================================================= */

function displayProducts(products) {

    billItems.innerHTML = "";


    /*
        Add bill heading.
    */

    const header =
        createBillItem(
            "Product",
            "Qty",
            "Amount",
            true
        );


    billItems.appendChild(header);


    /*
        Add each product.
    */

    for (
        let i = 0;
        i < products.length;
        i++
    ) {

        const item =
            createBillItem(
                products[i].name,
                products[i].quantity,
                products[i].amount
            );


        billItems.appendChild(item);
    }
}


/* =========================================================
   14. GENERATE BILL
   ========================================================= */

calculateBtn.addEventListener(
    "click",
    function () {

        errorMessage.textContent = "";


        /*
            Get all products.
        */

        const products =
            getProducts();


        /*
            Validate input.
        */

        if (
            !validateProducts(
                products
            )
        ) {

            errorMessage.textContent =
                "Please enter a valid quantity and unit price for all three products.";

            billResult.style.display =
                "none";

            return;
        }


        /*
            Calculate subtotal.
        */

        const subtotal =
            calculateSubtotal(
                products
            );


        /*
            Calculate discount.
        */

        const discount =
            calculateDiscount(
                subtotal
            );


        /*
            Calculate final amount.
        */

        const finalAmount =
            calculateFinalAmount(
                subtotal,
                discount
            );


        /*
            Customer name.
        */

        const name =
            customerName.value.trim();


        if (name === "") {

            billCustomer.textContent =
                "Customer Bill";

        } else {

            billCustomer.textContent =
                `${name}'s Bill`;
        }


        /*
            Bill number.
        */

        const number =
            billNumber.value.trim();


        if (number === "") {

            displayBillNumber.textContent =
                "—";

        } else {

            displayBillNumber.textContent =
                number;
        }


        /*
            Display products.
        */

        displayProducts(
            products
        );


        /*
            Display subtotal.
        */

        subtotalElement.textContent =
            `₹${subtotal.toFixed(2)}`;


        /*
            Display discount.
        */

        discountElement.textContent =
            `₹${discount.toFixed(2)}`;


        /*
            Display final amount.
        */

        finalAmountElement.textContent =
            `₹${finalAmount.toFixed(2)}`;


        /*
            Display appropriate message.
        */

        if (discount > 0) {

            discountMessage.textContent =
                "Congratulations! A 10% discount has been applied because your bill exceeds ₹2000.";

        } else {

            discountMessage.textContent =
                "No discount applied. A 10% discount is available for bills above ₹2000.";
        }


        /*
            Show bill.
        */

        billResult.style.display =
            "block";


        /*
            Scroll to bill.
        */

        billResult.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =========================================================
   15. RESET
   ========================================================= */

resetBtn.addEventListener(
    "click",
    function () {


        /* Clear customer details */

        customerName.value = "";

        billNumber.value = "";


        /* Clear all products */

        for (
            let i = 1;
            i <= PRODUCT_COUNT;
            i++
        ) {

            document.getElementById(
                `product${i}`
            ).value = "";


            document.getElementById(
                `quantity${i}`
            ).value = "";


            document.getElementById(
                `price${i}`
            ).value = "";


            document.getElementById(
                `amount${i}`
            ).textContent = "₹0.00";


            document.getElementById(
                `amount${i}`
            ).classList.remove(
                "updated"
            );
        }


        /* Clear error */

        errorMessage.textContent = "";


        /* Hide result */

        billResult.style.display =
            "none";


        /* Clear bill items */

        billItems.innerHTML = "";


        /* Reset totals */

        subtotalElement.textContent =
            "₹0.00";

        discountElement.textContent =
            "₹0.00";

        finalAmountElement.textContent =
            "₹0.00";

        discountMessage.textContent =
            "";
    }
);