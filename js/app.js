fetch('data/pokemon.json')
.then(r => r.json())
.then(data => {

    const grid = document.getElementById('grid');
    const search = document.getElementById('search');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.getElementById('close');

    async function obtenerCadenaEvolutiva(num) {

        try {

            const species = await fetch(
                `https://pokeapi.co/api/v2/pokemon-species/${num}`
            ).then(r => r.json());

            const evo = await fetch(
                species.evolution_chain.url
            ).then(r => r.json());

            const lista = [];

            function recorrer(chain) {

                lista.push(chain.species.name);

                chain.evolves_to.forEach(recorrer);

            }

            recorrer(evo.chain);

            return lista;

        } catch (e) {

            console.error(e);

            return [];

        }

    }

    async function abrirModal(pokemon) {

        const evoluciones =
            await obtenerCadenaEvolutiva(pokemon.num);

        const htmlEvo =
            evoluciones.length
                ? evoluciones.map(nombre => `
                    <div style="text-align:center">
                        <img
                        src="https://img.pokemondb.net/sprites/home/normal/${nombre}.png"
                        width="100">
                        <br>
                        ${nombre}
                    </div>
                `).join(" ➜ ")
                : "Sin evoluciones encontradas";

        modalBody.innerHTML = `

            <h2>#${pokemon.num} ${pokemon.name}</h2>

            <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.num}.png"
            width="250">

            <h3>Drops</h3>
            <p>${pokemon.drops || "Sin drops"}</p>

            <h3>Especial</h3>
            <p>${pokemon.special || "Ninguno"}</p>

            <h3>Evoluciones</h3>

            <div class="evolution-chain">
                ${htmlEvo}
            </div>

        `;

        modal.classList.remove("hidden");

    }

    function render(q = "") {

        grid.innerHTML = "";

        data
        .filter(p =>
            JSON.stringify(p)
            .toLowerCase()
            .includes(q.toLowerCase())
        )
        .forEach(p => {

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `

                <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.num}.png"
                width="180">

                <h3>#${p.num} ${p.name}</h3>

                <p>${p.drops || "Sin drops"}</p>

                <button>
                    Detalles
                </button>

            `;

            card
            .querySelector("button")
            .addEventListener(
                "click",
                () => abrirModal(p)
            );

            grid.appendChild(card);

        });

    }

    render();

    search.addEventListener(
        "input",
        e => render(e.target.value)
    );

    closeBtn.addEventListener(
        "click",
        () => modal.classList.add("hidden")
    );

});