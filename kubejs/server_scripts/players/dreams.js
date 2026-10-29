(() => {
	const TOWERS = {
		prospit: { dimension: 'minestuck:prospit', x: 0.5, y: 162, z: 6.5, yaw: 180, pitch: -45 },
		derse: { dimension: 'minestuck:derse', x: 0.5, y: 162, z: -5.5, yaw: 0, pitch: -45 }
	}
	const travelling = {}
	const crouchTicks = {}
	const wasOnMoon = {}

	function isGodTier(player) {
		return player.tags.contains('GodTier')
	}

	function isDreamer(player) {
		return player.tags.contains('Dreamer')
	}

	function isOnMoon(player) {
		const dimension = String(player.level.dimension)
		return dimension == 'minestuck:prospit' || dimension == 'minestuck:derse'
	}

	function isDreaming(player) {
		return isOnMoon(player) || String(player.level.dimension) == 'minestuck:skaia'
	}

	function savePosition(player, key) {
		const pos = player.persistentData.getCompound(key)
		pos.putString('dimension', String(player.level.dimension))
		pos.putDouble('x', player.x)
		pos.putDouble('y', player.y)
		pos.putDouble('z', player.z)
		pos.putDouble('yaw', player.yaw)
		pos.putDouble('pitch', player.pitch)
		player.persistentData.put(key, pos)
	}

	function loadPosition(player, key) {
		if (!player.persistentData.contains(key)) return null
		const pos = player.persistentData.getCompound(key)
		const dimension = String(pos.getString('dimension'))
		if (dimension == '') return null
		return { dimension: dimension, x: pos.getDouble('x'), y: pos.getDouble('y'), z: pos.getDouble('z'), yaw: pos.getDouble('yaw'), pitch: pos.getDouble('pitch') }
	}

	function travel(player, pos) {
		travelling[player.username] = true
		delete crouchTicks[player.username]
		player.server.scheduleInTicks(1, () => {
			delete travelling[player.username]
			player.teleportTo(pos.dimension, pos.x, pos.y, pos.z, pos.yaw, pos.pitch)
		})
	}

	function wake(player) {
		const respawn = player.getRespawnPosition()
		const spawn = player.server.getOverworld().getSharedSpawnPos()
		let pos = loadPosition(player, 'WakingPosition')
		if (pos == null && respawn != null) pos = { dimension: String(player.getRespawnDimension().location()), x: respawn.getX() + 0.5, y: respawn.getY(), z: respawn.getZ() + 0.5, yaw: player.yaw, pitch: player.pitch }
		if (pos == null) pos = { dimension: 'minecraft:overworld', x: spawn.getX() + 0.5, y: spawn.getY(), z: spawn.getZ() + 0.5, yaw: player.yaw, pitch: player.pitch }
		savePosition(player, 'DreamingPosition')
		travel(player, pos)
	}

	function chooseSway(player, sway) {
		if (!player) return 0
		if (isDreamer(player)) {
			player.tell(Text.of('You have already chosen your Lunar Sway.').gray())
			return 0
		}
		if (!player.tags.contains('AwaitingSway') || isGodTier(player)) {
			player.tell(Text.of("You can't choose your Lunar Sway right now.").gray())
			return 0
		}
		player.removeTag('AwaitingSway')
		player.addTag('Dreamer')
		if (sway == 'prospit') player.addTag('Prospit')
		else player.addTag('Derse')
		travel(player, TOWERS[sway])
		return 1
	}

	ServerEvents.commandRegistry(event => {
		const Commands = event.commands
		event.register(Commands.literal('lunarsway')
			.then(Commands.literal('prospit').executes(ctx => chooseSway(ctx.source.player, 'prospit')))
			.then(Commands.literal('derse').executes(ctx => chooseSway(ctx.source.player, 'derse'))))
	})

	BlockEvents.rightClicked(event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || !player.isShiftKeyDown() || player.isFake() || isGodTier(player)) return
		if (!event.block.hasTag('minecraft:beds')) return
		if (!travelling[player.username] && isDreamer(player)) {
			if (isDreaming(player)) {
				wake(player)
			} else {
				let pos = loadPosition(player, 'DreamingPosition')
				if (pos == null && player.tags.contains('Derse')) pos = TOWERS.derse
				if (pos == null) pos = TOWERS.prospit
				savePosition(player, 'WakingPosition')
				travel(player, pos)
			}
		} else if (!travelling[player.username]) {
			if (isDreaming(player) || !player.isAdvancementDone('minestuck:minestuck/entry')) return
			savePosition(player, 'WakingPosition')
			player.addTag('AwaitingSway')
			player.tell(Text.of('What is your Lunar Sway?\n')
				.append(Text.of('Prospit').color('#FFFF01').underlined().clickRunCommand('/lunarsway prospit'))
				.append(Text.of('      '))
				.append(Text.of('Derse').color('#9700E4').underlined().clickRunCommand('/lunarsway derse')))
		}
		player.swing()
		event.cancel()
	})

	PlayerEvents.tick(event => {
		const player = event.player
		const name = player.username
		if (isGodTier(player)) {
			delete wasOnMoon[name]
			delete crouchTicks[name]
			return
		}
		const onMoon = isOnMoon(player)
		if (wasOnMoon[name] != undefined && onMoon != wasOnMoon[name]) {
			if (onMoon) player.potionEffects.add('aero_additions:flight', -1, 0, false, false)
			else player.removeEffect('aero_additions:flight')
		}
		wasOnMoon[name] = onMoon
		if (!player.isCrouching() || !player.onGround() || travelling[name] || !isDreamer(player) || !isDreaming(player)) {
			delete crouchTicks[name]
			return
		}
		if (crouchTicks[name] == undefined) crouchTicks[name] = 0
		crouchTicks[name] += 1
		if (crouchTicks[name] >= 100) {
			wake(player)
			return
		}
		if (crouchTicks[name] % 20 == 0) player.setStatusMessage(Text.of(`Waking up in ${Math.ceil((100 - crouchTicks[name]) / 20)}...`).gray())
	})

	PlayerEvents.respawned(event => {
		wasOnMoon[event.player.username] = false
	})

	PlayerEvents.loggedOut(event => {
		event.player.removeTag('AwaitingSway')
		delete crouchTicks[event.player.username]
		delete wasOnMoon[event.player.username]
	})

	function givePajamas(player, moon) {
		player.server.runCommandSilent(`give ${player.username} minestuck:${moon}_circlet`)
		player.server.runCommandSilent(`give ${player.username} minestuck:${moon}_shirt`)
		player.server.runCommandSilent(`give ${player.username} minestuck:${moon}_pants`)
		player.server.runCommandSilent(`give ${player.username} minestuck:${moon}_shoes`)
	}

	BlockEvents.rightClicked('kubejs:pajama_box', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND') return
		player.swing()
		if (player.tags.contains('Prospit')) givePajamas(player, 'prospit')
		if (player.tags.contains('Derse')) givePajamas(player, 'derse')
	})
})()
