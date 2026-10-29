(() => {
	const INTRO = [
		'The land is empty.',
		'Wind skims the voids keeping biomes apart,',
		'as if grazing the hollow of a cut reed,',
		'or say, a punched tree.',
		'A familiar note is produced.',
		"It's the one Desolation plays to keep its instrument in tune.",
		'The game presently eluding you lies buried in code,',
		'in a Frog Temple, not far from here.',
		'"Heard melodies are sweet,',
		'but those unheard are sweeter" - Oscar Wilde',
		'Yes, you are certain Oscar Wilde said that.',
		'One hundred percent positive.',
		"You have a feeling it's going to be a long day."
	]

	function speak(player, line) {
		if (line >= INTRO.length) {
			player.server.runCommandSilent(`title ${player.username} title {"text":"CRAFTBOUND","bold":true}`)
			return
		}
		player.setStatusMessage(Text.white(INTRO[line]))
		if (line == 4) player.server.runCommandSilent(`execute as ${player.username} at @s run playsound chimes:block.iron.chiming ambient @s`)
		player.server.scheduleInTicks(40, () => player.setStatusMessage(Text.white(INTRO[line])))
		if (line == 6) player.server.scheduleInTicks(100, () => speak(player, line + 1))
		else player.server.scheduleInTicks(80, () => speak(player, line + 1))
	}

	BlockEvents.broken(event => {
		const player = event.player
		if (!player || player.isFake() || player.tags.contains('Intro') || !event.block.hasTag('minecraft:logs') || event.block.id == 'minecraft:acacia_wood') return
		player.addTag('Intro')
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound chimes:ambient.outdoor.wind record @s`)
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound chimes:block.iron.chiming ambient @s`)
		speak(player, 0)
	})
})()
