
fetch('../data/pokemon.json').catch(()=>fetch('data/pokemon.json'))
.then(r=>r.json())
.then(data=>{
const grid=document.getElementById('grid');
const search=document.getElementById('search');

function render(){
 const q=search.value.toLowerCase();
 grid.innerHTML='';
 data.filter(p=>JSON.stringify(p).toLowerCase().includes(q)).forEach(p=>{
  const d=document.createElement('div');
  d.className='card';
  d.innerHTML=`
   <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.num}.png">
   <h3>#${p.num} ${p.name}</h3>
   <p>${p.drops||'Sin drops'}</p>`;
  grid.appendChild(d);
 });
}
search.addEventListener('input',render);
render();
});
