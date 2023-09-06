function makeRequest(json) {
    const apiUrl = "https://script.google.com/macros/s/AKfycbzyE0XUcMKezgmSLv7ux9xPAyiq1pf8OYiFD4kTEkjX6C3SKNKkENpYsM2g0ejE9CYP/exec";
    return fetch(`${apiUrl}?${Object.entries(json).map((query) => `${query[0]}=${encodeURIComponent(query[1])}`).join("&")}`, { method: "GET" })
        .then((response) => response.text())
        .then((data) => {
            return data
        });
}

makeRequest({ type: "load" }).then(response => {
    DataPrincipal = JSON.parse(response);
})
