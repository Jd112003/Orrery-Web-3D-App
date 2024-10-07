// Función para mostrar/ocultar la tarjeta
function toggleCard(cardId) {
    var card = document.getElementById(cardId);
    if (card.style.display === "none") {
        card.style.display = "block";
    } else {
        card.style.display = "none";
    }
}

// Mostrar/Ocultar tarjeta de Planetas
card.getElementById("open-card-btn-planetas").addEventListener("click", function (event) {
    event.stopPropagation(); // Evita que el clic en el botón cierre la tarjeta
    toggleCard("card-planetas");
});

// Mostrar/Ocultar tarjeta de Astros
card.getElementById("open-card-btn-astros").addEventListener("click", function (event) {
    event.stopPropagation(); // Evita que el clic en el botón cierre la tarjeta
    toggleCard("card-astros");
});

// Cerrar las tarjetas cuando se hace clic fuera de ellas
document.addEventListener("click", function (event) {
    var cardPlanetas = document.getElementById("card-planetas");
    var cardAstros = document.getElementById("card-astros");

    // Verifica si el clic fue fuera de las tarjetas y sus botones
    if (!cardPlanetas.contains(event.target) && !document.getElementById("open-card-btn-planetas").contains(event.target)) {
        cardPlanetas.style.display = "none"; // Cierra la tarjeta de Planetas
    }

    if (!cardAstros.contains(event.target) && !document.getElementById("open-card-btn-astros").contains(event.target)) {
        cardAstros.style.display = "none"; // Cierra la tarjeta de Astros
    }
});
