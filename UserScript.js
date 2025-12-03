// ==UserScript==
// @name         SoPlanning
// @namespace    http://tampermonkey.net/
// @version      2025-11-28
// @description  try to take over the world!
// @author       You
// @match        https://planning.photec.it/conseplan/planning.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photec.it
// @grant        none
// ==/UserScript==


document.addEventListener("visibilitychange", () => {
    console.log("BK - Changing color - visibilitychange");
    change_colors();
});


window.addEventListener("load", (event) => {
    console.log("BK - Changing color - load");
    change_colors();
});

async function change_colors() {
    console.log("BK - Changing color");

    const apiUrlProjects = 'https://planning.photec.it/conseplan/projets.php';
    let datiDaApi = null;
    let aProjects = [];

    try {
        // Attende la risposta HTTP
        const response = await fetch(apiUrlProjects);

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        // Attende e converte la risposta in oggetto JavaScript (JSON)
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const projectTable = doc.getElementById('projectTab');

        const righeProjectTable = projectTable.querySelectorAll('tbody tr');

        for (let i = 0; i < righeProjectTable.length; i++) {
            let aProject = righeProjectTable[i].querySelectorAll('td span');

            if(aProject[0] && aProject[0].textContent && aProject[0].style) {
                aProjects.push({
                    proj: aProject[0].textContent,
                    style: aProject[0].style
                });
            }
        }

    } catch (error) {
        console.error("Errore nel caricamento dei dati API:", error);
        return;
    }

    const tabellaDOM = document.getElementById('tabContenuPlanning');
    const righe = tabellaDOM.querySelectorAll('tbody tr');

    for (let k = 0; k < righe.length; k++) {
        const celle = righe[k].querySelectorAll('div');
        for (let i = 0; i < celle.length; i++) {

            let oProj = aProjects.find(x => x.proj === celle[i].textContent);
            if (oProj) {
                celle[i].style.backgroundColor = oProj.style.backgroundColor;
                celle[i].style.color = oProj.style.color;
            }
        }
    }
}
