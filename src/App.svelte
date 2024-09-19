<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte/internal';
	import typesData from './data';

	const RATE_EURO = 0.0015;
	const RATE_DOLLARS = 0.0016;
	let montant = 0;
	let	n = 0;
	let	somme = 0;
	let	hasCalculated = false;
	let	totalToConvert = 0;
	let	montantEnEuro = 0;
	let	montantEnDollar = 0;
	let	tableRows = "";
	let isOnline = false;
	let type;
	let constant = false;
	$: tag = typesData.find(t => t.id === type);

	async function calculer () {
		somme = 0;
		tableRows = "";
		if (!constant) {
			for(let i = 1; i <= n; i++) {
			somme +=  montant * i;
			const dollars = montant * i * RATE_DOLLARS;
			const euros = montant * i * RATE_EURO;
			tableRows += `<tr>
							<td>${tag?.singleTag} n°${i}</td>
							<td>${montant * i} <small style="font-size:10px;">FCFA</small></td>
							<td>$${parseFloat(dollars.toFixed(2))}</td>
							<td>${parseFloat(euros.toFixed(2))}€</td>
						  </tr>`
			}
			totalToConvert = somme;
			somme = somme.toString();
			somme = chunkRight(somme).join('.');
			hasCalculated = true;
			if (hasCalculated) {
				try {
					if (isOnline) {
						let response = await fetch(`https://api.getgeoapi.com/v2/currency/convert?api_key=0986567706a51ddcab3d67b8a0d58b210db512fe&from=XOF&to=EUR&amount=${totalToConvert}&format=json`);
						if (response.status === 403) {
							montantEnEuro = parseFloat((totalToConvert * RATE_EURO).toFixed(2));
							montantEnDollar = parseFloat((totalToConvert * RATE_DOLLARS).toFixed(2));
						} else {
							const { rates } = await response.json();
							montantEnEuro = parseFloat(Number(rates['EUR']?.rate_for_amount).toFixed(2));
							montantEnDollar = parseFloat((totalToConvert * RATE_DOLLARS).toFixed(2));
						}
					} else {
						montantEnEuro = parseFloat((totalToConvert * RATE_EURO).toFixed(2));
						montantEnDollar = parseFloat((totalToConvert * RATE_DOLLARS).toFixed(2));
					}
				} catch (error) {
					if (error.message === 'Failed to fetch') {
						montantEnEuro = parseFloat((totalToConvert * RATE_EURO).toFixed(2));
						montantEnDollar = parseFloat((totalToConvert * RATE_DOLLARS).toFixed(2));
					}
				}
			}
		} else {
			for(let i = 1; i <= n; i++) {
			somme +=  montant;
			const dollars = montant * RATE_DOLLARS;
			const euros = montant * RATE_EURO;
			tableRows += `<tr>
							<td>${tag?.singleTag} n°${i}</td>
							<td>${montant} <small style="font-size:10px;">FCFA</small></td>
							<td>$${parseFloat(dollars.toFixed(2))}</td>
							<td>${parseFloat(euros.toFixed(2))}€</td>
						  </tr>`
			}
			totalToConvert = somme;
			somme = somme.toString();
			somme = chunkRight(somme).join('.');
			hasCalculated = true;
			if (hasCalculated) {
				try {
					if (isOnline) {
						let response = await fetch(`https://api.getgeoapi.com/v2/currency/convert?api_key=0986567706a51ddcab3d67b8a0d58b210db512fe&from=XOF&to=EUR&amount=${totalToConvert}&format=json`);
						if (response.status === 403) {
							montantEnEuro = parseFloat((totalToConvert * RATE_EURO).toFixed(2));
							montantEnDollar = parseFloat((totalToConvert * RATE_DOLLARS).toFixed(2));
						} else {
							const { rates } = await response.json();
							montantEnEuro = parseFloat(Number(rates['EUR']?.rate_for_amount).toFixed(2));
							montantEnDollar = parseFloat((totalToConvert * RATE_DOLLARS).toFixed(2));
						}
					} else {
						montantEnEuro = parseFloat((totalToConvert * RATE_EURO).toFixed(2));
						montantEnDollar = parseFloat((totalToConvert * RATE_DOLLARS).toFixed(2));
					}
				} catch (error) {
					if (error.message === 'Failed to fetch') {
						montantEnEuro = parseFloat((totalToConvert * RATE_EURO).toFixed(2));
						montantEnDollar = parseFloat((totalToConvert * RATE_DOLLARS).toFixed(2));
					}
				}
			}
		}
	}
	

	onMount(() => {
		isOnline = navigator.onLine;
	});
	
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

<section>
	<div class="container">
		<div class="flex flex-col">
			<h1>Challenge épargne {n > 0 ? n + ' ' + tag?.tag : 'X' + ' ' + tag?.tag}</h1>
			<p style="font-style: italic; font-size: 14px; font-weight: 400; color: gray;"><cite>« A tes résolutions dépendra ton succès ! »</cite></p>
		</div>
		  
		<div>
			<label for="type">Choisir le type d'epargne</label>
			<select bind:value={type} id="type">
				{#each typesData as {id, name}}
					<option value={id}>{name}</option>
				{/each}
			</select>
			<label for="montant">Entrer le montant</label>
			<input type="number" min={0} id="montant" bind:value={montant} placeholder="Ex: 100" />
		
			<label for="duree">Entrer le nombre {type === 7 ? "d'" + tag?.tag : 'de ' + tag?.tag}</label>
			<input type="number" min={0} id="duree" bind:value={n} placeholder="Ex: 2" />
			<div class="flex flex-row">
				<label for="same">Montant d'épargne fixe ?</label>
				<input type="checkbox" id="same" bind:checked={constant} />{constant ? 'Oui' : ''}
			</div>
			<button on:click={calculer}>Calculer</button>


			{#if hasCalculated}
				<div class="result" in:fly={{ y: 100, duration: 1000 }}>
					<h2 style='text-decoration: underline; font-size: 1rem;'>Montant épargné en {n} {n > 1 ? tag?.tag : tag?.singleTag.toLowerCase()}</h2>
					<strong class="somme">{somme} <sup>FCFA</sup></strong>
					<small class="italic">(Soit ~ <strong>{montantEnEuro}€</strong> / <strong>${montantEnDollar}</strong>)</small>
					<div>
						<h4 style="text-decoration: underline;margin-bottom: -10px;">Détails dans le tableau ci-dessous</h4>
						<table class="styled-table">
							<thead>
								<th>{tag?.singleTag}</th>
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
	</div>

</section>
<footer class="license">
	Powered With <span style="color: red;">&hearts;</span> by <a href="https://juslin.dev" target="_blank" rel="noreferrer">Juslin</a>
</footer>

<style>
	.italic {
		font-style: italic;
	}

	.flex {
		display: flex;
	}
	.flex-col {
		flex-direction: column;
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
		font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
		color: rgb(236, 99, 7);
		font-weight: 900;
		padding-left: 4px;
		padding-right: 4px;
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
		font-size: 1.025rem;
		margin-bottom: 10px;
		padding-left: 1.25rem;
		padding-right: 1.25rem;
		cursor: pointer;
	}
	
	input[type="number"] {
		margin-top: 5px;
	}

	button {
		margin-top: 1.4rem;
	}

	div > input[type="checkbox"] {
		margin: 5px;
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

	table.styled-table th {
		padding: 12px 15px;
	}

	footer {
		position: relative;
		bottom: 0;
		text-align: center;
		margin-top: 5rem;
	}
</style>
