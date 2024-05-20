<script>
	import './styles.css';
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
	main,
	.app {
		height: 100%;
		overflow: hidden;
		width: 100%;
	}
</style>
