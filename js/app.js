fetch("data/pokemon.json")
.then(r => r.json())
.then(data => {

    const grid = document.getElementById("grid");
    const search = document.getElementById("search");
    const sort = document.getElementById("sort");
    const genFilter = document.getElementById("genFilter");
    const showFavs = document.getElementById("showFavs");

    let favoritos =
        JSON.parse(
            localStorage.getItem("favoritos")
        ) || [];

    let soloFavoritos = false;

    document.getElementById(
        "totalPokemon"
    ).textContent =
        `${data.length} Pokémon`;

    const drops = new Set();

    data.forEach(p => {

        (p.drops || "")
            .split(",")
            .forEach(d => drops.add(d.trim()));

    });

    document.getElementById(
        "totalDrops"
    ).textContent =
        `${drops.size} Drops`;

function sprite(num){
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${num}.png`;
}

    function render(){

        let list = [...data];

        const q =
            search.value.toLowerCase();

        if(q){

            list = list.filter(p =>

                JSON.stringify(p)
                .toLowerCase()
                .includes(q)

            );

        }

        if(soloFavoritos){

            list = list.filter(
                p => favoritos.includes(p.num)
            );

        }

        const gen = genFilter.value;

        if(gen){

            list = list.filter(p => {

                if(gen==="1") return p.num<=151;
                if(gen==="2") return p.num>=152 && p.num<=251;
                if(gen==="3") return p.num>=252 && p.num<=386;
                if(gen==="4") return p.num>=387 && p.num<=493;
                if(gen==="5") return p.num>=494 && p.num<=649;
                if(gen==="6") return p.num>=650 && p.num<=721;
                if(gen==="7") return p.num>=722 && p.num<=809;
                if(gen==="8") return p.num>=810 && p.num<=905;
                if(gen==="9") return p.num>=906;

            });

        }

        if(sort.value==="name"){

            list.sort((a,b)=>
                a.name.localeCompare(b.name)
            );

        }else{

            list.sort((a,b)=>
                a.num-b.num
            );

        }

        document.getElementById(
            "totalFavoritos"
        ).textContent =
            `⭐ ${favoritos.length} Favoritos`;

        grid.innerHTML = "";

        list.forEach(p => {

            const fav =
                favoritos.includes(p.num);

            const card =
                document.createElement("div");

            card.className = "card";

            card.innerHTML = `

                <button class="favBtn">
                    ${fav ? "⭐" : "☆"}
                </button>

                <img
                class="pokemon-img"
                src="${sprite(p.num)}">

                <h3>
                    #${p.num}
                    ${p.name}
                </h3>

                <p>
                    ${p.drops_es || p.drops || "Sin drops"}
                </p>

                <button class="btn">
                    Detalles
                </button>

            `;

            card.querySelector(".favBtn")
            .onclick = (e)=>{

                e.stopPropagation();

                if(favoritos.includes(p.num)){

                    favoritos =
                        favoritos.filter(
                            id => id !== p.num
                        );

                }else{

                    favoritos.push(
                        p.num
                    );

                }

                localStorage.setItem(
                    "favoritos",
                    JSON.stringify(favoritos)
                );

                render();

            };

            card.querySelector(".btn")
            .onclick = ()=>{

                document.getElementById(
                    "modalBody"
                ).innerHTML = `

                    <h2>
                        #${p.num}
                        ${p.name}
                    </h2>

                    <img
                    class="pokemon-img"
                    src="${sprite(p.num)}">

                    <p>
                        <b>Drops:</b><br>
                        ${p.drops_es || p.drops || "Sin drops"}
                    </p>

                    <p>
                        <b>Especial:</b><br>
                        ${p.special_es || p.special || "Ninguno"}
                    </p>

                    ${
                        p.pokedex_url
                        ? `
                        <a
                        class="btn"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="${p.pokedex_url}">
                            Abrir Cobblemon Tools
                        </a>
                        `
                        : ""
                    }

                `;

                document
                    .getElementById("modal")
                    .classList
                    .remove("hidden");

            };

            grid.appendChild(card);

        });

    }

    document
        .getElementById("close")
        .onclick = ()=>{

            document
                .getElementById("modal")
                .classList
                .add("hidden");

        };

    document
        .getElementById("modal")
        .onclick = (e)=>{

            if(e.target.id==="modal"){

                document
                    .getElementById("modal")
                    .classList
                    .add("hidden");

            }

        };

    search.oninput = render;
    sort.onchange = render;
    genFilter.onchange = render;

    showFavs.onclick = ()=>{

        soloFavoritos =
            !soloFavoritos;

        showFavs.textContent =
            soloFavoritos
            ? "📖 Ver Todos"
            : "⭐ Ver Favoritos";

        render();

    };

    const topBtn =
        document.getElementById("topBtn");

    window.addEventListener(
        "scroll",
        ()=>{

            if(window.scrollY>400){

                topBtn.classList.add(
                    "show"
                );

            }else{

                topBtn.classList.remove(
                    "show"
                );

            }

        }
    );

    topBtn.onclick = ()=>{

        window.scrollTo({

            top:0,
            behavior:"smooth"

        });

    };

    render();

});