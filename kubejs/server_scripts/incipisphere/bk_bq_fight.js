(() => {
	const $PlayerChangedDimensionEvent = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerEvent$PlayerChangedDimensionEvent')

	function announce(center, text, color) {
		center.server.runCommandSilent(`execute in minestuck:skaia positioned ${center.x.toFixed(2)} ${center.y.toFixed(2)} ${center.z.toFixed(2)} run title @a[distance=..50] actionbar {"text":"${text}","color":"${color}"}`)
	}

	function fanfare(center) {
		center.server.runCommandSilent(`execute in minestuck:skaia positioned ${center.x.toFixed(2)} ${center.y.toFixed(2)} ${center.z.toFixed(2)} as @a[distance=..50] at @s run playsound advancementplaques:ui.toast.goal_complete master @s`)
	}

	function fightMusic(center, sound) {
		const nearby = `execute in minestuck:skaia positioned ${center.x.toFixed(2)} ${center.y.toFixed(2)} ${center.z.toFixed(2)} as @a[distance=..100]`
		center.server.runCommandSilent(`${nearby} run stopsound @s music`)
		center.server.runCommandSilent(`${nearby} run stopsound @s record`)
		center.server.runCommandSilent(`${nearby} at @s run playsound ${sound} record @s ~ ~ ~ 10000`)
		center.server.persistentData.putString('SkaiaFightMusic', sound)
	}

	function replayFightMusic(server, name) {
		server.scheduleInTicks(20, () => {
			const sound = String(server.persistentData.getString('SkaiaFightMusic'))
			if (sound == '') return
			server.runCommandSilent(`execute as ${name} at @s if dimension minestuck:skaia run stopsound @s music`)
			server.runCommandSilent(`execute as ${name} at @s if dimension minestuck:skaia run stopsound @s record`)
			server.runCommandSilent(`execute as ${name} at @s if dimension minestuck:skaia run playsound ${sound} record @s ~ ~ ~ 10000`)
		})
	}

	function summonBoss(player, type, height) {
		player.server.runCommandSilent(`execute at ${player.username} run summon ${type} ~ ~${height} ~`)
		player.level.spawnLightning(player.x, player.y, player.z, true)
		const boss = player.level.getEntitiesWithin(AABB.of(player.x - 1, player.y + height - 1, player.z - 1, player.x + 1, player.y + height + 1, player.z + 1)).find(entity => entity.type == type)
		if (!boss) return
		boss.setAttributeBaseValue('minecraft:generic.max_health', 1000)
		boss.setHealth(1000)
		if (player.server.persistentData.getBoolean('FGPrototyped')) {
			player.server.runCommandSilent('team add FirstGuardian')
			player.server.runCommandSilent('team modify FirstGuardian color green')
			player.server.runCommandSilent(`execute at ${player.username} positioned ~ ~${height} ~ run team join FirstGuardian @n[type=${type}]`)
			boss.setGlowing(true)
		}
		return boss
	}

	function skaiaHasPlayers(server, leaving) {
		let found = false
		server.players.forEach(player => {
			if (player.username != leaving.username && player.isAlive() && String(player.level.dimension) == 'minestuck:skaia') found = true
		})
		return found
	}

	function despawnRoyals(server) {
		const refunds = []
		server.persistentData.remove('SkaiaFightMusic')
		server.getLevel('minestuck:skaia').getEntitiesWithin(AABB.of(-1000, -64, -1000, 1000, 320, 1000)).forEach(entity => {
			if (!entity.isAlive()) return
			if (entity.type == 'bosses_of_mass_destruction:lich') {
				server.runCommandSilent('weather clear')
				refunds.push('kubejs:strife')
				entity.discard()
			}
			if (entity.type == 'irons_spellbooks:dead_king') {
				refunds.push('kubejs:strifex2combo')
				entity.discard()
			}
		})
		return refunds
	}

	EntityEvents.death('minecraft:player', event => {
		const player = event.entity
		const refunds = player.persistentData.getCompound('StrifeRefunds')
		if (String(player.level.dimension) != 'minestuck:skaia' || skaiaHasPlayers(player.server, player)) return
		despawnRoyals(player.server).forEach(item => refunds.putBoolean(item, true))
		player.persistentData.put('StrifeRefunds', refunds)
	})

	NativeEvents.onEvent($PlayerChangedDimensionEvent, event => {
		const player = event.getEntity()
		if (String(event.getTo().location()) == 'minestuck:skaia') replayFightMusic(player.server, String(player.username))
		if (String(event.getFrom().location()) != 'minestuck:skaia' || skaiaHasPlayers(player.server, player)) return
		despawnRoyals(player.server).forEach(item => player.give(item))
	})

	PlayerEvents.loggedIn(event => {
		if (String(event.player.level.dimension) == 'minestuck:skaia') replayFightMusic(event.server, String(event.player.username))
	})

	PlayerEvents.loggedOut(event => {
		const player = event.player
		if (String(player.level.dimension) != 'minestuck:skaia' || skaiaHasPlayers(player.server, player)) return
		despawnRoyals(player.server).forEach(item => player.give(item))
	})

	PlayerEvents.respawned(event => {
		const player = event.player
		player.persistentData.getCompound('StrifeRefunds').getAllKeys().forEach(item => player.give(item))
		player.persistentData.remove('StrifeRefunds')
	})

	ItemEvents.rightClicked('kubejs:strife', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || String(player.level.dimension) != 'minestuck:skaia') return
		event.item.shrink(1)
		player.swing()
		const lich = summonBoss(player, 'bosses_of_mass_destruction:lich', 20)
		fightMusic(player, 'cataclysm:monstrosity_music')
		announce(player, 'The Reckoning has Begun!', 'red')
		player.server.runCommandSilent('weather thunder')
		if (!lich) return
		lich.setAttributeBaseValue('minecraft:generic.scale', 10)
		lich.server.scheduleRepeatingInTicks(10, meteors => {
			if (!lich.isAlive()) {
				meteors.clear()
				return
			}
			lich.server.runCommandSilent(`execute in minestuck:skaia run summon minecraft:fireball ${(lich.x + Math.random() * 100 - 50).toFixed(2)} ${(lich.y + 50).toFixed(2)} ${(lich.z + Math.random() * 100 - 50).toFixed(2)} {Motion:[0.006d,-0.01d,0d],ExplosionPower:0}`)
		})
	})

	EntityEvents.death('bosses_of_mass_destruction:lich', event => {
		const lich = event.entity
		if (String(lich.level.dimension) != 'minestuck:skaia') return
		lich.server.persistentData.remove('SkaiaFightMusic')
		lich.server.runCommandSilent('execute in minestuck:skaia as @a[distance=0..] run stopsound @s record cataclysm:monstrosity_music')
		lich.server.runCommandSilent('weather clear')
		fanfare(lich)
		announce(lich, "You hear the Queen approaching. It's not over yet.", 'red')
	})

	ItemEvents.rightClicked('kubejs:strifex2combo', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || String(player.level.dimension) != 'minestuck:skaia') return
		event.item.shrink(1)
		player.swing()
		summonBoss(player, 'irons_spellbooks:dead_king', 0)
		fightMusic(player, 'cataclysm:harbinger_music')
		announce(player, 'Black Queen appears!', 'dark_gray')
	})

	EntityEvents.death('irons_spellbooks:dead_king', event => {
		if (String(event.entity.level.dimension) != 'minestuck:skaia') return
		event.entity.server.persistentData.remove('SkaiaFightMusic')
		event.entity.server.runCommandSilent('execute in minestuck:skaia as @a[distance=0..] run stopsound @s record cataclysm:harbinger_music')
		fanfare(event.entity)
		event.entity.server.persistentData.remove('FGPrototyped')
	})

	EntityEvents.drops('bosses_of_mass_destruction:lich', event => {
		event.addDrop('minestuck:black_kings_scepter').setGlowing(true)
		event.addDrop('minestuck:white_kings_scepter').setGlowing(true)
		event.addDrop('kubejs:strifex2combo').setGlowing(true)
	})

	EntityEvents.drops('irons_spellbooks:dead_king', event => {
		event.addDrop('minestuck:black_queens_ring').setGlowing(true)
		event.addDrop('minestuck:white_queens_ring').setGlowing(true)
	})

	EntityEvents.spawned('minecraft:item', event => {
		const ring = event.entity
		let otherId = 'minestuck:black_queens_ring'
		if (!ring.item || String(ring.level.dimension) != 'minestuck:skaia') return
		if (ring.item.id != 'minestuck:black_queens_ring' && ring.item.id != 'minestuck:white_queens_ring') return
		if (ring.item.id == 'minestuck:black_queens_ring') otherId = 'minestuck:white_queens_ring'
		ring.server.scheduleRepeatingInTicks(10, check => {
			let other = null
			if (ring.isRemoved()) {
				check.clear()
				return
			}
			if (!ring.isInLava()) return
			ring.level.getEntitiesWithin(AABB.of(ring.x - 2, ring.y - 2, ring.z - 2, ring.x + 2, ring.y + 2, ring.z + 2)).forEach(entity => {
				if (other == null && entity.type == 'minecraft:item' && entity.item && entity.item.id == otherId && entity.isInLava()) other = entity
			})
			const player = ring.level.getNearestPlayer(ring, -1)
			if (!other || !player) return
			const x = (ring.x + other.x) / 2
			const y = (ring.y + other.y) / 2
			const z = (ring.z + other.z) / 2
			ring.discard()
			other.discard()
			player.give('kubejs:obsidian_rings')
			ring.level.spawnLightning(x, y, z, false)
			ring.server.runCommandSilent(`execute in minestuck:skaia positioned ${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)} as @a[distance=..100] at @s run playsound irons_spellbooks:entity.earthquake_aoe.loop master @s`)
			ring.server.runCommandSilent(`execute in minestuck:skaia positioned ${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)} run title @a[distance=..100] actionbar {"text":"The Forge has been stoked!","color":"dark_red"}`)
			check.clear()
		})
	})
})()
