function showPivotArea() {
    const activar = document.getElementById("map");

    if (activar.hidden) {
        document.getElementById("map").hidden = false;
        document.getElementById("headerMap").hidden = false;
        document.getElementById("pivot").hidden = true;
    } else {
        document.getElementById("map").hidden = true;
        document.getElementById("headerMap").hidden = true;
        document.getElementById("pivot").hidden = false;
    }

    //TablaReportII()
    PivotElementos()
}

