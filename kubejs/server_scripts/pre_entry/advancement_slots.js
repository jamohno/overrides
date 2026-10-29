(() => {
	PlayerEvents.loggedIn(event => {
		const player = event.player
		if (player.tags.contains('Settled')) return
		event.server.scheduleInTicks(200, () => player.addTag('Settled'))
	})

	PlayerEvents.advancement(event => {
		const player = event.player
		const advancement = event.advancement
		if (!player.tags.contains('Settled') || player.isAdvancementDone('minestuck:minestuck/entry')) return
		if (!advancement.hasDisplay() || !advancement.display.shouldShowToast()) return
		if (advancement.id == 'minecraft:kogtyvtav/root' || advancement.id == 'minecraft:kogtyvtav/crazy_don') return
		event.server.runCommandSilent(`inventory_slots unlock ${player.username} 1`)
	})
})()
