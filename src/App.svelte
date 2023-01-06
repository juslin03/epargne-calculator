<script>
	import { fade, fly } from 'svelte/transition';
	let montant = 0, n = 0, somme = 0, hasCalculated = false, note = false;
	function calculer () {
		somme = 0;
		for(let i = 1; i <= n; i++) {
			somme = somme + (montant * i)
		}
		somme = somme.toString();
		somme = chunkRight(somme).join('.');
		hasCalculated = true;
	}
	
	function chunkRight (str, size = 3) {
  if (typeof str === 'string') {
    const length = str.length;
    const chunks = Array(Math.ceil(length / size));
    if (length) {
      chunks[0] = str.slice(0, length % size || size);
      for (let i = 1, index = chunks[0].length; index < length; i++) {
        chunks[i] = str.slice(index, index += size)
      }
    }
    return chunks
  }
}

function handleMouseOver() {
	note = true;
}

function handleMouseLeave() {
	note = false;
}
</script>

<section>
	<div class="container">
		<div class="flex flex-row">
			<h1>Challenge {n} {n > 1 ? 'semaines' : 'semaine'}</h1>
			<svg xmlns="http://www.w3.org/2000/svg" style="cursor: pointer;" fill="none" on:mouseover={handleMouseOver} on:mouseleave={handleMouseLeave} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
			</svg>
			{#if note}
				<span class="hover-title">Comment ça marche ?</span>
			{/if}
		</div>
		  
		<label for="montant">Entrer le montant</label>
		<input type="number" min={0} id="montant" bind:value={montant} placeholder="Ex: 2000" />
	
		<label for="duree">Entrer le nombre de semaines</label>
		<input type="number" min={0} id="duree" bind:value={n} placeholder="Ex: 2" />
		<button on:click={calculer}>Calculer</button>
		{#if hasCalculated}
			<div in:fly={{ y: 100, duration: 1000 }}>
			<h2 style='text-decoration: underline'>Montant épargné en {n} {n > 1 ? 'semaines' : 'semaine'}</h2>
			<strong class="somme">{somme} <sup>XOF</sup></strong>
		</div>
		{/if}
	</div>
</section>

<style>

	.w-6 {
		width: 1.95rem;
	}

	.h-6 {
		height: 1.95rem;
	}

	.flex {
		display: flex;
	}

	.flex-row {
		flex-direction: row;
	}
	section {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
	}
	div.container {
		border: none;
		border-radius: 7px;
		padding: 2rem;
		width: 50%;
		box-sizing: border-box;
		box-shadow: 0 8px 40px;
	}
	h1 {
		font-size: 2rem;
		border: 4px solid rgb(236, 99, 7);
		padding-left: 4px;
		padding-right: 4px;
		box-shadow: 0 0 20px rgb(236, 99, 7);
		padding-top: 3px;
		padding-bottom: 3px;
		margin-right: 10px;
		width: auto;
		text-align: center;
	}
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	div button, input {
		border: none;
		border-radius: 25px;
		font-size: 1.4rem;
		margin-top: 5px;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		cursor: pointer;
		box-shadow: 0px 8px 13px rgba(032, 032, 032, .6);
	}
	.somme {
		display: block;
		font-size: 5rem;
		color: green;
	}
	
	.somme sup {
		font-size: .90125rem;
		color: green;
		font-weight: 600;
	}

	.hover-title {
		position: absolute;
		z-index: 1;
		right: 23.5rem;
	}
</style>