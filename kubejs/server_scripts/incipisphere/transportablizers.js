(() => {
	ItemEvents.rightClicked('kubejs:lunar_transportablizer', event => {
		if (event.hand != 'MAIN_HAND') return
		const player = event.player
		const dimension = String(player.level.dimension)
		if (player.tags.contains('GodTier') && !player.tags.contains('BothMoons')) {
			player.mainHandItem.shrink(1)
			player.addTag('BothMoons')
			player.server.runCommandSilent(`execute as ${player.username} at @s run playsound verseworks:dimension_prepared master @s`)
			player.tell(Text.of('Your Lunar Transportablizer merged with your Incipispheric Transportablizer!').gray())
			player.swing()
			return
		}
		player.addItemCooldown('kubejs:lunar_transportablizer', 20)
		if (dimension == 'minestuck:prospit') {
			player.server.runCommandSilent(`execute in minestuck:derse run tp ${player.username} 0 156 324 0 0`)
		} else if (dimension == 'minestuck:derse') {
			player.server.runCommandSilent(`execute in minestuck:prospit run tp ${player.username} 0 156 -324 180 0`)
		} else {
			if (!player.tags.contains('GodTier')) player.tell(Text.of('The Lunar Transportablizer only functions while on Prospit or Derse.').gray())
			return
		}
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound minestuck:block.transportalizer.teleport player @a ~ ~ ~`)
		player.swing()
	})

	function isGodTier(player) {
		return player.tags.contains('GodTier')
	}

	function onDreamWorld(player) {
		const dimension = String(player.level.dimension)
		return dimension == 'minestuck:prospit' || dimension == 'minestuck:derse' || dimension == 'minestuck:skaia'
	}

	function notHere() {
		return Text.of("For players who haven't reached God Tier, the Incipispheric Transportablizer only functions while on Prospit, Derse or Skaia").gray()
	}

	function link(label, place) {
		return Text.of(label).clickRunCommand(`/transportablizer ${place}`)
	}

	ItemEvents.rightClicked('kubejs:transportablizer2', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND') return
		player.addItemCooldown('kubejs:transportablizer2', 20)
		if (!isGodTier(player) && !onDreamWorld(player)) {
			player.tell(notHere())
			return
		}
		if (!player.tags.contains('Prospit') && !player.tags.contains('Derse')) {
			player.tell(Text.of('What is your Lunar Sway?\n')
				.append(Text.of('Prospit').color('#FFFF01').underlined().clickRunCommand('/transportablizer prospit'))
				.append(Text.of('      '))
				.append(Text.of('Derse').color('#9700E4').underlined().clickRunCommand('/transportablizer derse')))
			player.swing()
			return
		}
		const menu = Text.empty()
		if (!isGodTier(player) || player.tags.contains('BothMoons') || player.tags.contains('Prospit')) menu.append(link('PROSPIT', 'prospit').yellow()).append(Text.of(' '))
		if (!isGodTier(player) || player.tags.contains('BothMoons') || player.tags.contains('Derse')) menu.append(link('DERSE', 'derse').darkPurple()).append(Text.of(' '))
		menu.append(link('SKAIA', 'skaia').aqua())
		if (isGodTier(player) && player.tags.contains('Veil')) menu.append(Text.of(' ')).append(link('VEIL', 'veil').gray())
		if (isGodTier(player)) menu.append(Text.of(' ')).append(link('PLANET', 'planet').green())
		player.tell(menu)
		player.swing()
	})

	function transport(player, place) {
		if (!player) return 0
		if (player.mainHandItem.id != 'kubejs:transportablizer2') {
			player.tell(Text.of('You need to be holding the Incipispheric Transportablizer.').gray())
			return 0
		}
		if (!isGodTier(player) && !onDreamWorld(player)) {
			player.tell(notHere())
			return 0
		}
		if (!isGodTier(player) && (place == 'veil' || place == 'planet')) {
			player.tell(Text.of('Only players who have reached God Tier can go there.').gray())
			return 0
		}
		if (isGodTier(player) && !player.tags.contains('BothMoons')) {
			if ((place == 'prospit' && player.tags.contains('Derse')) || (place == 'derse' && player.tags.contains('Prospit'))) {
				player.tell(Text.of("Your Incipispheric Transportablizer can't reach there yet.").gray())
				return 0
			}
		}
		if (place == 'veil' && !player.tags.contains('Veil')) {
			player.tell(Text.of("Your Incipispheric Transportablizer can't reach there yet.").gray())
			return 0
		}
		if (place == 'planet' && !player.server.getLevel(`minestuck:land_${String(player.username).toLowerCase()}`)) return 0
		if (!player.tags.contains('Prospit') && !player.tags.contains('Derse')) {
			if (place == 'prospit') player.addTag('Prospit')
			if (place == 'derse') player.addTag('Derse')
		}
		if (place == 'prospit') player.teleportTo('minestuck:prospit', 0.5, 156, -323.5, 180, 0)
		if (place == 'derse') player.teleportTo('minestuck:derse', 0.5, 156, 324.5, 0, 0)
		if (place == 'skaia') player.teleportTo('minestuck:skaia', 85.5, 47, -72.5, 0, 0)
		if (place == 'veil') player.teleportTo('minestuck:veil', 94.5, 190, -25.5, player.yaw, player.pitch)
		if (place == 'planet') player.teleportTo(`minestuck:land_${String(player.username).toLowerCase()}`, 0.5, 150, 0.5, player.yaw, player.pitch)
		return 1
	}

	ServerEvents.commandRegistry(event => {
		const Commands = event.commands
		event.register(Commands.literal('transportablizer')
			.then(Commands.literal('prospit').executes(ctx => transport(ctx.source.player, 'prospit')))
			.then(Commands.literal('derse').executes(ctx => transport(ctx.source.player, 'derse')))
			.then(Commands.literal('skaia').executes(ctx => transport(ctx.source.player, 'skaia')))
			.then(Commands.literal('veil').executes(ctx => transport(ctx.source.player, 'veil')))
			.then(Commands.literal('planet').executes(ctx => transport(ctx.source.player, 'planet'))))
	})

	function transportSound(player) {
		player.server.runCommandSilent(`execute at ${player.username} run playsound minestuck:block.transportalizer.teleport player @a ~ ~ ~`)
	}

	ItemEvents.rightClicked('kubejs:meteoric_transportablizer', event => {
		const player = event.player
		const dimension = String(player.level.dimension)
		const pos = player.persistentData.getCompound('PreMeteor')
		if (event.hand != 'MAIN_HAND') return
		if (player.tags.contains('GodTier') && !player.tags.contains('Veil')) {
			player.mainHandItem.shrink(1)
			player.addTag('Veil')
			player.server.runCommandSilent(`execute as ${player.username} at @s run playsound verseworks:dimension_prepared master @s`)
			player.tell(Text.of('Your Meteoric Transportablizer merged with your Incipispheric Transportablizer!').gray())
			player.swing()
			return
		}
		player.addItemCooldown('kubejs:meteoric_transportablizer', 20)
		if (dimension == 'minestuck:prospit' || dimension == 'minestuck:derse') {
			player.tell(Text.of("The Meteoric Transportablizer doesn't function on Prospit or Derse.").gray())
			return
		}
		if (dimension != 'minestuck:veil') {
			pos.putString('dimension', dimension)
			pos.putDouble('x', player.x)
			pos.putDouble('y', player.y)
			pos.putDouble('z', player.z)
			pos.putDouble('yaw', player.yaw)
			pos.putDouble('pitch', player.pitch)
			player.persistentData.put('PreMeteor', pos)
			player.server.scheduleInTicks(1, () => {
				player.teleportTo('minestuck:veil', 99.5, 189, -31.5, 30, 0)
				transportSound(player)
			})
		} else if (pos.contains('dimension')) {
			player.persistentData.remove('PreMeteor')
			player.server.scheduleInTicks(1, () => {
				player.teleportTo(String(pos.getString('dimension')), pos.getDouble('x'), pos.getDouble('y'), pos.getDouble('z'), pos.getDouble('yaw'), pos.getDouble('pitch'))
				transportSound(player)
			})
		} else {
			return
		}
		player.swing()
	})

	EntityEvents.drops('minecraft:player', event => {
		const player = event.entity
		const kept = player.persistentData.getCompound('KeptTransportablizers')
		const drops = event.drops
		for (let i = drops.size() - 1; i >= 0; i--) {
			let item = drops.get(i).item
			if (!['kubejs:lunar_transportablizer', 'kubejs:transportablizer2', 'kubejs:meteoric_transportablizer'].includes(String(item.id))) continue
			kept.putInt(String(item.id), kept.getInt(String(item.id)) + item.count)
			drops.remove(i)
		}
		player.persistentData.put('KeptTransportablizers', kept)
	})

	PlayerEvents.respawned(event => {
		const player = event.player
		const kept = player.persistentData.getCompound('KeptTransportablizers')
		kept.getAllKeys().forEach(id => {
			for (let i = 0; i < kept.getInt(id); i++) player.give(id)
		})
		player.persistentData.remove('KeptTransportablizers')
	})

})()
