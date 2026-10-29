(() => {
	const $ChangedDimension = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerEvent$PlayerChangedDimensionEvent')

	function updateNightVision(player) {
		if (['minestuck:prospit', 'minestuck:derse', 'minestuck:veil'].includes(String(player.level.dimension))) {
			player.server.runCommandSilent(`effect give ${player.username} minecraft:night_vision infinite 0 true`)
			player.addTag('IncipisphereNightVision')
		} else if (player.tags.contains('IncipisphereNightVision')) {
			player.server.runCommandSilent(`effect clear ${player.username} minecraft:night_vision`)
			player.removeTag('IncipisphereNightVision')
		}
	}

	NativeEvents.onEvent($ChangedDimension, event => updateNightVision(event.getEntity()))
	PlayerEvents.loggedIn(event => updateNightVision(event.player))
	PlayerEvents.respawned(event => updateNightVision(event.player))
})()
