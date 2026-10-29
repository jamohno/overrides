(() => {
	const $PlayerData = Java.loadClass('com.mraof.minestuck.player.PlayerData')
	const $MSAttachments = Java.loadClass('com.mraof.minestuck.util.MSAttachments')

	const showering = {}

	function summonFireball(player, direction) {
		let motion = '[1d,-1.5d,0d]'
		if (direction == 'south') motion = '[-1d,-1.5d,0d]'
		if (direction == 'east') motion = '[0d,-1.5d,1d]'
		if (direction == 'west') motion = '[0d,-1.5d,-1d]'
		player.server.runCommandSilent(`execute in ${player.level.dimension} run summon irons_spellbooks:fireball ${(player.x + (Math.random() * 100 - 40)).toFixed(2)} ${(player.y + 50).toFixed(2)} ${(player.z + (Math.random() * 100 - 40)).toFixed(2)} {Motion:${motion},NoGravity:1,Damage:10,ExplosionRadius:${Math.floor(Math.random() * 5) + 1}}`)
	}

	function meteorShower(server, name, direction) {
		const player = server.playerList.getPlayerByName(name)
		if (!player) {
			delete showering[name]
			return
		}
		if (player.isAdvancementDone('minestuck:minestuck/entry')) {
			delete showering[name]
			server.runCommandSilent(`colorfulskies color ${name} sky clear`)
			server.runCommandSilent(`colorfulskies color ${name} cloud clear`)
			server.runCommandSilent(`stopsound ${name} record minecraft:custom.sburban_jungle`)
			return
		}
		summonFireball(player, direction)
		server.scheduleInTicks(10, () => meteorShower(server, name, direction))
	}

	function startShower(server, name, direction) {
		if (showering[name]) return
		showering[name] = true
		server.runCommandSilent(`colorfulskies color ${name} sky e03100`)
		server.runCommandSilent(`colorfulskies color ${name} cloud e03100`)
		server.runCommandSilent(`stopsound ${name} music`)
		server.runCommandSilent(`execute as ${name} at @s run playsound minecraft:custom.sburban_jungle record @s ~ ~ ~ 10000`)
		meteorShower(server, name, direction)
	}

	BlockEvents.broken('minestuck:cruxtruder_lid', event => {
		const player = event.player
		if (player.tags.contains('MeteorShower')) return
		const color = $PlayerData.get(player).get().getData($MSAttachments.PLAYER_COLOR)
		const message = Text.gray('[S] ')
			.append(Text.literal(player.getDisplayName().getString()).color(Color.rgba((color >> 16) & 255, (color >> 8) & 255, color & 255, 255)))
			.append(Text.white(': Enter'))
		player.setStatusMessage(message)
		event.server.scheduleInTicks(40, () => player.setStatusMessage(message))
		player.addTag('MeteorShower')
		startShower(event.server, String(player.username), String(player.horizontalFacing).toLowerCase())
	})

	PlayerEvents.loggedIn(event => {
		const player = event.player
		if (!player.tags.contains('MeteorShower') || player.isAdvancementDone('minestuck:minestuck/entry')) return
		event.server.scheduleInTicks(20, () => startShower(event.server, String(player.username), String(player.horizontalFacing).toLowerCase()))
	})

	PlayerEvents.advancement(event => {
		const player = event.player
		if (!player.tags.contains('Settled') || !event.advancement.hasDisplay() || !event.advancement.display.shouldShowToast() || String(event.advancement.id) == 'minecraft:kogtyvtav/root' || player.isAdvancementDone('minestuck:minestuck/entry')) return
		if (Math.random() >= 0.2) return
		summonFireball(player, ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)])
		player.setStatusMessage(Text.gray('A meteor falls nearby...'))
	})
})()
