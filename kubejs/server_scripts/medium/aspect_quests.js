(() => {
	const CONSORTS = ['minestuck:salamander', 'minestuck:turtle', 'minestuck:iguana', 'minestuck:nakagator']
	const INSTRUMENTS = ['guitar', 'lyre', 'banjo', 'drum', 'cymbal', 'xylophone', 'tubular_bell', 'sansula', 'violin', 'cello', 'flute', 'saxophone', 'god', 'oboe', 'redstone_guitar', 'french_horn', 'bass_guitar', 'trumpet']

	function isConsort(entity) {
		return CONSORTS.includes(String(entity.type))
	}

	function speciesName(entity) {
		const species = String(entity.type).replace('minestuck:', '')
		return species.charAt(0).toUpperCase() + species.slice(1)
	}

	function distanceSq(a, b) {
		return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z)
	}

	function teleportSound(player) {
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound minecraft:entity.enderman.teleport player @a ~ ~ ~`)
	}

	function happyParticles(entity) {
		entity.server.runCommandSilent(`execute in ${entity.level.dimension} run particle minecraft:happy_villager ${entity.x.toFixed(2)} ${(entity.y + entity.bbHeight + 0.3).toFixed(2)} ${entity.z.toFixed(2)} 0.5 0.3 0.5 0 30`)
	}

	function inDimension(event, command) {
		event.player.server.runCommandSilent(`execute in ${event.level.dimension} run ${command}`)
	}

	function nearby(center, radius) {
		const found = []
		center.level.getEntitiesWithin(AABB.of(center.x - radius, center.y - radius, center.z - radius, center.x + radius, center.y + radius, center.z + radius)).forEach(entity => {
			if (distanceSq(entity, center) <= radius * radius) found.push(entity)
		})
		return found
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

	function returnTo(player, key) {
		const pos = player.persistentData.getCompound(key)
		player.persistentData.remove(key)
		player.server.scheduleInTicks(1, () => {
			player.teleportTo(String(pos.getString('dimension')), pos.getDouble('x'), pos.getDouble('y'), pos.getDouble('z'), pos.getDouble('yaw') + 180, pos.getDouble('pitch'))
			teleportSound(player)
		})
	}

	ItemEvents.entityInteracted('minecraft:ender_pearl', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || !player.tags.contains('heart') || !isConsort(event.target) || String(player.level.dimension) == 'minestuck:veil') return
		event.item.shrink(1)
		player.addItemCooldown('minecraft:ender_pearl', 20)
		savePosition(player, 'PreSoulEntry')
		player.server.scheduleInTicks(1, () => {
			player.teleportTo('minestuck:veil', -0.5, 177, -8.5, player.yaw, player.pitch)
			teleportSound(player)
			player.level.getBlock(-4, 177, -9).id
			player.level.getBlock(6, 177, -9).id
			player.level.getBlock(-4, 177, 1).id
			player.level.getBlock(6, 177, 1).id
			player.server.runCommandSilent('execute in minestuck:veil run fill -4 177 -9 6 184 1 air')
			player.server.runCommandSilent('execute in minestuck:veil run fill 2 183 -3 0 178 -5 kubejs:untrue_soul')
		})
		player.swing()
		event.cancel()
	})

	BlockEvents.rightClicked('kubejs:soul_wall', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || !player.mainHandItem.empty || !player.persistentData.contains('PreSoulEntry')) return
		returnTo(player, 'PreSoulEntry')
		player.swing()
		event.cancel()
	})

	function clearPuzzle(server) {
		const veil = server.getLevel('minestuck:veil')
		veil.getBlock(1276, 30, 44).id
		veil.getBlock(1276, 30, 52).id
		server.runCommandSilent('execute in minestuck:veil run fill 1275 9 51 1277 1 57 air replace minecraft:redstone_wire')
		server.runCommandSilent('execute in minestuck:veil run fill 1275 9 51 1277 1 57 air replace minecraft:white_wool')
		server.runCommandSilent('execute in minestuck:veil run fill 1275 9 51 1277 1 57 air replace minecraft:redstone_torch')
		server.runCommandSilent('execute in minestuck:veil run fill 1275 9 51 1277 1 57 air replace minecraft:redstone_wall_torch')
		server.runCommandSilent('execute in minestuck:veil run fill 1278 27 52 1275 25 57 air replace minecraft:redstone_torch')
		server.runCommandSilent('execute in minestuck:veil run fill 1278 27 52 1275 25 57 air replace minecraft:redstone_wall_torch')
		server.runCommandSilent('execute in minestuck:veil run fill 1278 27 52 1275 25 57 air replace minecraft:oak_button')
		server.runCommandSilent('execute in minestuck:veil run fill 1278 27 52 1275 25 57 air replace minecraft:redstone_wire')
		server.runCommandSilent('execute in minestuck:veil run fill 1277 51 57 1275 63 40 air replace minecraft:repeater')
		server.runCommandSilent('execute in minestuck:veil run fill 1277 51 57 1275 63 40 air replace minecraft:redstone_wire')
		server.runCommandSilent('execute in minestuck:veil run fill 1277 51 57 1275 63 40 air replace minecraft:white_wool')
	}

	function checkLamp(player, given, i, x, y, z) {
		const block = player.server.getLevel('minestuck:veil').getBlock(x, y, z)
		if (given[i] || block.id != 'minecraft:redstone_lamp' || String(block.properties.get('lit')) != 'true') return
		given[i] = true
		if (player.inventory.count(`kubejs:puzzle_piece_${i + 1}`) == 0) player.give(`kubejs:puzzle_piece_${i + 1}`)
	}

	function checkLamps(player, given, ticksLeft) {
		checkLamp(player, given, 0, 1276, 8, 53)
		checkLamp(player, given, 1, 1276, 33, 51)
		checkLamp(player, given, 2, 1276, 60, 44)
		if (ticksLeft > 0) player.server.scheduleInTicks(2, () => checkLamps(player, given, ticksLeft - 2))
	}

	BlockEvents.rightClicked('minestuck:mind_aspect_button', event => {
		if (event.hand != 'MAIN_HAND' || String(event.block.dimension) != 'minestuck:veil') return
		const player = event.player
		player.server.scheduleInTicks(2, () => checkLamps(player, [false, false, false], 30))
	})

	BlockEvents.rightClicked('kubejs:puzzle_gate', event => {
		const player = event.player
		const held = String(player.mainHandItem.id)
		let floor = 0
		if (held == 'minestuck:mind_aspect_sapling') floor = 2
		if (held == 'kubejs:puzzle_piece_1') floor = 28
		if (held == 'kubejs:puzzle_piece_2') floor = 54
		if (event.hand != 'MAIN_HAND') return
		if (String(player.level.dimension) == 'minestuck:veil') {
			if (!player.persistentData.contains('PrePuzzle')) return
			clearPuzzle(player.server)
			returnTo(player, 'PrePuzzle')
			player.swing()
			event.cancel()
			return
		}
		if (!player.tags.contains('mind') || floor == 0) return
		savePosition(player, 'PrePuzzle')
		player.server.scheduleInTicks(1, () => {
			clearPuzzle(player.server)
			player.teleportTo('minestuck:veil', 1276.5, floor, 57.5, 180, 0)
			teleportSound(player)
		})
		player.swing()
		event.cancel()
	})

	BlockEvents.rightClicked('kubejs:unexploded_bomb', event => {
		const player = event.player
		const block = event.block
		if (event.hand != 'MAIN_HAND' || !player.tags.contains('doom')) return
		if (player.mainHandItem.id == 'kubejs:defusal_kit') {
			player.mainHandItem.shrink(1)
			inDimension(event, `setblock ${block.x} ${block.y} ${block.z} kubejs:defused_bomb`)
			inDimension(event, `playsound bettercombat:katana_slash player @a ${block.x + 0.5} ${block.y + 0.5} ${block.z + 0.5}`)
		} else {
			inDimension(event, `setblock ${block.x} ${block.y} ${block.z} minecraft:air`)
			inDimension(event, `summon minecraft:tnt ${block.x + 0.5} ${block.y} ${block.z + 0.5}`)
		}
		player.swing()
		event.cancel()
	})

	BlockEvents.rightClicked('kubejs:void_labyrinth_end', event => {
		const player = event.player
		const block = event.block
		if (event.hand != 'MAIN_HAND' || !player.tags.contains('void')) return
		player.give('kubejs:obscured_truth')
		player.give('irons_spellbooks:ancient_knowledge_fragment')
		inDimension(event, `setblock ${block.x} ${block.y} ${block.z} kubejs:space1`)
		player.server.scheduleInTicks(1, () => player.teleportTo(player.x, player.y + 6, player.z))
		player.swing()
		event.cancel()
	})

	const FANTASY_NAMES = ['Aethelgard', 'Balindir', 'Calanthia', 'Droven', 'Elidyr', 'Faerith', 'Galathea', 'Hesperon', 'Idril', 'Jaxon', 'Kaelen', 'Lyra', 'Malakor', 'Nesta', 'Oakhaven', 'Pyrias', 'Quorra', 'Rhaegal', 'Seraphina', 'Theron', 'Ulfric', 'Valerius', 'Willowen', 'Xanthus', 'Yvaine', 'Zephyrus', 'Alden', 'Branwen', 'Cedric', 'Daenerys', 'Elowen', 'Fionn', 'Gideon', 'Hadria', 'Isolda', 'Joram', 'Kaia', 'Lucan', 'Mireia', 'Nicanor', 'Orla', 'Peregrine', 'Quintus', 'Rowena', 'Silas', 'Tahlia', 'Uther', 'Vespera', 'Wynn', 'Xavia', 'Ysolde', 'Zarek', 'Althea', 'Bastian', 'Corin', 'Darien', 'Elara', 'Fenwick', 'Gwendolyn', 'Haldir', 'Illyria', 'Jasper', 'Kestrel', 'Lysander', 'Maeve', 'Nyx', 'Orion', 'Phelan', 'Quenby', 'Ronan', 'Selene', 'Tristan', 'Una', 'Valen', 'Wren', 'Xander', 'Yaros', 'Zinnia', 'Alistair', 'Brynn', 'Caspian', 'Dorian', 'Evadne', 'Finneas', 'Genevieve', 'Huntley', 'Isolde', 'Jareth', 'Kael', 'Lilith', 'Morpheus', 'Nova', 'Oberon', 'Phoenix', 'Quill', 'Roderick', 'Soren', 'Teryn', 'Ulysses', 'Varis']
	const HIT_LIST = [
		{ name: 'Imp', article: 'an', types: ['minestuck:imp'] },
		{ name: 'Consort', article: 'a', types: CONSORTS },
		{ name: 'Priest', article: 'a', types: ['irons_spellbooks:priest'] },
		{ name: 'Pyromancer', article: 'a', types: ['irons_spellbooks:pyromancer'] },
		{ name: 'Apothecarist', article: 'an', types: ['irons_spellbooks:apothecarist'] },
		{ name: 'Electromancer', article: 'an', types: ['discerning_the_eldritch:electromancer', 'hazennstuff:electromancer'] },
		{ name: 'Archevoker', article: 'an', types: ['irons_spellbooks:archevoker'] }
	]

	EntityEvents.death(event => {
		const player = event.source.player
		if (!player || !player.tags.contains('rage')) return
		const step = player.persistentData.getInt('HitList')
		const target = HIT_LIST[step]
		if (!target || !target.types.includes(String(event.entity.type))) return
		const next = HIT_LIST[step + 1]
		const names = player.persistentData.getCompound('HitNames')
		const free = FANTASY_NAMES.filter(name => !HIT_LIST.some(hit => names.getString(hit.name) == name))
		const name = free[Math.floor(Math.random() * free.length)]
		names.putString(target.name, name)
		player.persistentData.put('HitNames', names)
		player.persistentData.putInt('HitList', step + 1)
		player.give('kubejs:completed_hit')
		if (next) player.tell(`You have slain ${name} the ${target.name}. Well done. Your next target is ${next.article} ${next.name}.`)
		else player.tell(`You have slain ${name} the ${target.name}. Well done, you have completed your Hit List.`)
	})

	ItemEvents.entityInteracted('kubejs:talent_scout', event => {
		const player = event.player
		const consort = event.target
		if (event.hand != 'MAIN_HAND' || !player.tags.contains('hope') || !isConsort(consort) || consort.tags.contains('BandMember')) return
		consort.addTag('Recruiting')
		player.server.runCommandSilent(`data merge entity @n[tag=Recruiting] {PersistenceRequired:1b,NeoForgeData:{ownerUUID:"${player.uuid}",waiting:0b,pettingtamed:1b,attackifownerattacks:1b,damageOwner:0b,followdistance:10,attackifselfattacked:1b,teleportdistance:20,attackifownerattacked:1b,isNameGenerated:1b,sitstill:0b,freewander:0b,pettingLastInteracted:20746L}}`)
		player.server.runCommandSilent('execute at @n[tag=Recruiting] summon minecraft:item_display run ride @s mount @n[tag=Recruiting]')
		player.server.runCommandSilent(`execute as @n[tag=Recruiting] on passengers run data merge entity @s {item:{id:"xercamusic:${INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)]}",count:1},transformation:{translation:[0f,-0.5f,0f],left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],scale:[1f,1f,1f]}}`)
		player.server.runCommandSilent('execute at @n[tag=Recruiting] run playsound minecraft:block.note_block.bell record @a ~ ~ ~')
		player.server.runCommandSilent(`execute at @n[tag=Recruiting] run particle minecraft:note ~ ~${(consort.bbHeight + 0.5).toFixed(2)} ~ 0.4 0.2 0.4 1 8`)
		consort.removeTag('Recruiting')
		consort.addTag('BandMember')
		event.item.shrink(1)
		player.setStatusMessage(Text.of(`${consort.getDisplayName().getString()} joined your band!`).yellow())
		player.give('kubejs:signed_contract')
		player.swing()
		event.cancel()
	})

	EntityEvents.death(event => {
		if (event.entity.tags.contains('BandMember')) event.entity.passengers.forEach(passenger => passenger.discard())
	})

	ItemEvents.rightClicked('kubejs:microphone', event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || !player.tags.contains('hope') || player.block.down.id != 'kubejs:stage_platform') return
		const band = nearby(player, 10).filter(entity => entity.tags.contains('BandMember'))
		const note = [6, 10, 13][Math.floor(Math.random() * 3)]
		band.forEach(consort => {
			player.server.runCommandSilent(`execute at ${player.username} run playsound minecraft:block.note_block.flute record @a[distance=..32] ${consort.x.toFixed(2)} ${consort.y.toFixed(2)} ${consort.z.toFixed(2)} 2 ${Math.pow(2, (note - 12) / 12).toFixed(3)}`)
			player.server.runCommandSilent(`execute at ${player.username} run particle minecraft:note ${consort.x.toFixed(2)} ${(consort.y + consort.bbHeight + 0.5).toFixed(2)} ${consort.z.toFixed(2)} ${(note / 24).toFixed(3)} 0 0 1 0`)
		})
		if (band.length >= 3 && Math.random() < 0.1) player.give('kubejs:rose_bouquet')
		if (player.tags.contains('BandOnTheGo') && Math.random() < 0.1) player.server.runCommandSilent(`give ${player.username} ${CONSORTS[Math.floor(Math.random() * 4)]}_spawn_egg[custom_name='[{"text":"Band Newbie","italic":false}]']`)
	})

	function slotSound(event, sound) {
		inDimension(event, `playsound ${sound} block @a ${event.block.x + 0.5} ${event.block.y + 0.5} ${event.block.z + 0.5}`)
	}

	BlockEvents.rightClicked('kubejs:slot_machine', event => {
		const player = event.player
		const block = event.block
		if (event.hand != 'MAIN_HAND' || player.mainHandItem.id != 'minecraft:diamond') return
		player.mainHandItem.shrink(1)
		slotSound(event, 'create:depot_plop')
		const spin = Math.random()
		if (spin < 0.2) {
			player.give('kubejs:light_coin')
			slotSound(event, 'minecraft:block.amethyst_block.resonate')
		} else if (spin < 0.205) {
			player.give('kubejs:super_light_coin')
			slotSound(event, 'minecraft:block.amethyst_block.resonate')
		} else if (spin < 0.255) {
			inDimension(event, `setblock ${block.x} ${block.y} ${block.z} kubejs:broken_slot_machine`)
			slotSound(event, 'create:fwoomp')
		}
		player.swing()
		event.cancel()
	})

	function rerollSpecies(event) {
		const consort = event.entity
		const species = CONSORTS[Math.floor(Math.random() * 4)]
		const dimension = String(event.level.dimension)
		let blood = false
		event.level.server.players.forEach(player => {
			if (dimension == `minestuck:land_${String(player.username).toLowerCase()}` && player.tags.contains('blood')) blood = true
		})
		if (consort.tags.contains('SpeciesRolled') || !blood) return
		consort.addTag('SpeciesRolled')
		if (species == String(consort.type)) return
		event.level.server.scheduleInTicks(1, () => {
			if (consort.isRemoved()) return
			const data = consort.nbt
			data.remove('UUID')
			consort.server.runCommandSilent(`execute in ${dimension} run summon ${species} ${consort.x.toFixed(2)} ${consort.y.toFixed(2)} ${consort.z.toFixed(2)} ${data}`)
			consort.discard()
		})
	}

	EntityEvents.spawned('minestuck:salamander', event => rerollSpecies(event))
	EntityEvents.spawned('minestuck:turtle', event => rerollSpecies(event))
	EntityEvents.spawned('minestuck:iguana', event => rerollSpecies(event))
	EntityEvents.spawned('minestuck:nakagator', event => rerollSpecies(event))

	ItemEvents.entityInteracted('kubejs:mediation_stick', event => {
		const player = event.player
		const consort = event.target
		const type = String(consort.type)
		let other = null
		let pair = ''
		if (event.hand != 'MAIN_HAND' || !player.tags.contains('blood') || !isConsort(consort)) return
		nearby(consort, 10).forEach(entity => {
			if (!isConsort(entity) || String(entity.type) == type) return
			if (other == null || distanceSq(entity, consort) < distanceSq(other, consort)) other = entity
		})
		if (other == null) {
			player.setStatusMessage(Text.of('There are no other consort species nearby.').gray())
			player.swing()
			event.cancel()
			return
		}
		CONSORTS.forEach(species => {
			if (species == type || species == String(other.type)) pair += species.replace('minestuck:', '') + '_'
		})
		player.give(`kubejs:${pair}agreement`)
		player.setStatusMessage(Text.of(`You mediated between the ${speciesName(consort)} and ${speciesName(other)}!`).green())
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound advancementplaques:ui.toast.task_complete master @s`)
		happyParticles(consort)
		happyParticles(other)
		player.swing()
		event.cancel()
	})
})()
