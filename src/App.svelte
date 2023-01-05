<script>
	import { fade, fly } from 'svelte/transition';
	let montant = 0, n = 0, somme = 0, hasCalculated = false;
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
</script>

<div>
	<h1>Challenge {n} {n > 1 ? 'semaines' : 'semaine'}</h1>
	<label for="montant">Montant</label>
	<input type="number" min={0} id="montant" bind:value={montant} placeholder="Ex: 2000" />

	<label for="duree">Duree</label>
	<input type="number" min={0} id="duree" bind:value={n} placeholder="Ex: 1" />
	<button on:click={calculer}>Calculer</button>
	{#if hasCalculated}
		<div in:fly={{ y: 100, duration: 1000 }}>
		<h2 style='text-decoration: underline'>Montant épargné en {n} {n > 1 ? 'semaines' : 'semaine'}</h2>
		<strong class="somme">{somme} <sup>XOF</sup></strong>
	</div>
	{/if}
</div>

<style>
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
</style>