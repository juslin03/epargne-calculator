<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte/internal';
	import Modal from './Modal.svelte';

	const RATE_EURO = 0.0015384615384615;
	const RATE_DOLLARS = 0.0015710919088767;
	let montant = 0, n = 0, somme = 0, hasCalculated = false, note = false, showModal = false;
	let totalToConvert = 0;
	let montantEnEuro = 0;
	let montantEnDollar = 0;
	let tableRows = "";
	async function calculer () {
		somme = 0;
		tableRows = "";
		for(let i = 1; i <= n; i++) {
			somme +=  montant * i;
			tableRows += `<tr>
							<td>Semaine n°${i}</td>
							<td>${montant * i} <small>XOF</small></td>
							<td>$${Math.round(montant * i * RATE_DOLLARS)}</td>
							<td>${Math.round(montant * i * RATE_EURO)} €</td>
						  </tr>`
		}
		totalToConvert = somme;
		somme = somme.toString();
		somme = chunkRight(somme).join('.');
		hasCalculated = true;
		if (hasCalculated) {
			let response = await fetch(`https://api.getgeoapi.com/v2/currency/convert?api_key=0986567706a51ddcab3d67b8a0d58b210db512fe&from=XOF&to=EUR&amount=${totalToConvert}&format=json`);
			if (response.status === 403) {
				montantEnEuro = totalToConvert * RATE_EURO;
				montantEnDollar = totalToConvert * RATE_DOLLARS;
			} else {
				const { rates } = await response.json();
				montantEnEuro = rates['EUR']?.rate_for_amount;
				montantEnDollar = totalToConvert * RATE_DOLLARS;
			}
		}
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

function handleClick() {
	showModal = true;
}

</script>

<section>
	<div class="container">
		<div class="flex flex-row">
			<h1>Challenge {n !== 0 ? n : 'X'} {n > 1 ? 'semaines' : 'semaine'}</h1>
			<svg xmlns="http://www.w3.org/2000/svg" style="cursor: pointer;" fill="none" on:click={handleClick} on:mouseover={handleMouseOver} on:mouseleave={handleMouseLeave} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
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
			<div class="result" in:fly={{ y: 100, duration: 1000 }}>
				<h2 style='text-decoration: underline; font-size: 1rem;'>Montant épargné en {n} {n > 1 ? 'semaines' : 'semaine'}</h2>
				<strong class="somme">{somme} <sup>XOF</sup></strong>
				<small class="italic">(Soit ~ <strong>{Math.floor(montantEnEuro)} €</strong> / <strong>${Math.floor(montantEnDollar)}</strong>)</small>
				<div>
					<h4 style="text-decoration: underline;margin-bottom: -10px;">Details dans le tableau ci-dessous</h4>
					<table class="styled-table">
						<thead>
							<th>Semaine</th>
							<th>Montant (FCFA/XOF)</th>
							<th>Montant (Dollar)</th>
							<th>Montant (Euro)</th>
						</thead>
						<tbody>{@html tableRows}</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>

	{#if showModal}
	<Modal on:close="{() => showModal = false}">
		<h2 slot="header">
			Principe du challenge | Exemple
		</h2>

		<ol class="definition-list">
			<li>Si je mets <code>100</code> frs pour la semaine 1</li>
			<li>Alors, la semaine suivante, je mettrai <code>100 + 100</code> et ainsi de suite...</li>
		</ol>

		<a href="https://github.com/juslin03">Suivez-moi sur github</a>
	</Modal>
{/if}

</section>
<footer class="license">
	Powered With <span style="color: red;">&hearts;</span> by <a href="https://eyalogroup.com" target="_blank" rel="noreferrer">EYALO GROUP</a>
</footer>

<style>
	.italic {
		font-style: italic;
	}
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
		width: 100%;
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
		border: 1px solid #bbb;
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
		font-size: 3.5rem;
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

	table.styled-table {
		width: 100%;
		padding: 1.5rem;
		text-align: center;
	}

	table.styled-table {
		border-collapse: collapse;
		margin: 25px 0;
		font-size: 0.9em;
		font-family: sans-serif;
		min-width: 400px;
	}
	table.styled-table thead th {
		background-color: #009879;
		color: #ffffff;
		text-align: left;
	}

	table.styled-table th,
	table.styled-table td {
		padding: 12px 15px;
	}
	table.styled-table tbody tr {
		border-bottom: 1px solid #989797;
	}

	footer {
		position: relative;
		bottom: 0;
		text-align: center;
		margin-top: 5rem;
	}
</style>