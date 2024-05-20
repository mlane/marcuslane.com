<script>
	import { onMount } from 'svelte';
	import { initializeGame } from '../main';

	onMount(() => {
		initializeGame();
	});
</script>

<div id="ui">
	<p class="note">Tap/Click around to move</p>
	<div id="textbox-container" style="display: none">
		<div id="textbox">
			<p id="dialogue" class="ui-text"></p>
			<div class="button-container">
				<button id="close" type="button">Close</button>
			</div>
		</div>
	</div>
</div>
<canvas id="game" />

<style>
	canvas {
		height: 100%;
		width: 100%;
	}

	#textbox {
		align-items: start;
		background-color: rgba(166, 153, 138, 1);
		border: 0;
		border-radius: 12px;
		bottom: 2vh;
		display: flex;
		filter: drop-shadow(2px 0.2rempx 1.75rem rgba(0, 0, 0));
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: start;
		left: 10%;
		min-height: 10vh;
		outline-style: solid;
		padding: 1rem;
		position: absolute;
		right: 10%;
		word-spacing: 0.2rem;
	}

	.button-container {
		align-self: end;
		margin-top: 1rem;
	}

	.note {
		color: rgb(238, 238, 238);
		display: flex;
		flex-direction: column;
		left: 5%;
		position: absolute;
		top: 1vh;
	}

	.ui-text {
		margin: 0;
	}
</style>
