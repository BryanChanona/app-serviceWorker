document.addEventListener("DOMContentLoaded", () => {


    const form = document.getElementById("add-dish-form");
    const tableBody = document.querySelector("table tbody")

    let dishes;
    try {
        dishes = JSON.parse(localStorage.getItem("dishes")) || [];
        dishes.forEach(dish => addRow(dish));
    } catch (error) {
        console.warn("Error al parsear desde localstorage", error);
        dishes = [];
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault()

        const dish = {
            name: document.getElementById("dish-name").value,
            price: document.getElementById("dish-price").value,
            available: document.getElementById("dish-available").value
        }
        dishes.push(dish);
        localStorage.setItem("dishes", JSON.stringify(dishes))
        addRow(dish)

        form.reset()
        document.getElementById("dish-name").focus();


    });

    function addRow(dish) {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
        <td>${dish.name}</td>
        <td>$${dish.price}</td>
        <td>${dish.available}</td>
        `;
        tableBody.appendChild(newRow);
    }
    //Registrar Service Worker hasta que se haya caragado completamente la página
    if ("serviceWorker" in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register("/sw.js")
                .then(() => console.log("Service Worker registrado"))
                .catch(err => console.error("Error registrando SW:", err));
        })

    }
});