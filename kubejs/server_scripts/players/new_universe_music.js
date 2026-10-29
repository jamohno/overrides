(() => {
	PlayerEvents.advancement(event => {
		if (String(event.advancement.id) != 'verseworks:enter_a_new_world') return
		event.player.server.scheduleInTicks(100, () => {
			if (event.player.isRemoved()) return
			event.player.server.runCommandSilent(`stopsound ${event.player.username}`)
			event.player.server.runCommandSilent(`execute as ${event.player.username} at @s run playsound irons_spellbooks:music.dead_king_lullaby record @s ~ ~ ~ 10000`)
		})
	})
})()
