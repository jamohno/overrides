(() => {
	const $ChangedDimension = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerEvent$PlayerChangedDimensionEvent')

	const SLOTS = [
		{ usb: 'kubejs:techusb', dx: 1, dz: 0, facing: 'west', pitch: 1 },
		{ usb: 'kubejs:magicusb', dx: -1, dz: 0, facing: 'east', pitch: 1.2 },
		{ usb: 'kubejs:explorationusb', dx: 0, dz: -1, facing: 'south', pitch: 1.4 },
		{ usb: 'kubejs:alchemizeusb', dx: 0, dz: 1, facing: 'north', pitch: 1.6 }
	]

	function takeUsb(event, usb) {
		const block = event.block
		if (event.hand != 'MAIN_HAND') return
		event.server.runCommandSilent(`execute in ${event.level.dimension} run setblock ${block.x} ${block.y} ${block.z} air`)
		event.server.runCommandSilent(`give ${event.player.username} ${usb} 1`)
		event.server.runCommandSilent(`execute in ${event.level.dimension} positioned ${block.x} ${block.y} ${block.z} run playsound create:depot_plop block @a[distance=..10] ~ ~ ~`)
		event.player.swing()
	}

	BlockEvents.rightClicked('kubejs:techusb_block', event => takeUsb(event, 'kubejs:techusb'))
	BlockEvents.rightClicked('kubejs:magicusb_block', event => takeUsb(event, 'kubejs:magicusb'))
	BlockEvents.rightClicked('kubejs:explorationusb_block', event => takeUsb(event, 'kubejs:explorationusb'))
	BlockEvents.rightClicked('kubejs:alchemizeusb_block', event => takeUsb(event, 'kubejs:alchemizeusb'))

	function checkUsb(event, level, i) {
		const x = event.block.x
		const y = event.block.y
		const z = event.block.z
		if (i == SLOTS.length) {
			event.server.runCommandSilent(`execute in ${level.dimension} positioned ${x} ${y} ${z} run playsound minestuck:event.echeladder.increase master @a[distance=..10] ~ ~ ~ 1 1`)
			event.server.runCommandSilent(`execute in ${level.dimension} run particle minecraft:explosion ${x} ${y + 1} ${z} 0 0 0 0 1`)
			event.server.runCommandSilent(`execute in ${level.dimension} run summon item ${x} ${y + 1} ${z} {Item:{id:"verseworks:hyper_dust",count:1}}`)
			return
		}
		if (level.getBlock(x + SLOTS[i].dx, y, z + SLOTS[i].dz).id != `${SLOTS[i].usb}_block`) {
			event.server.runCommandSilent(`execute in ${level.dimension} positioned ${x} ${y} ${z} run playsound minecraft:block.note_block.bit master @a[distance=..10] ~ ~ ~ 1 0.1`)
			return
		}
		event.server.runCommandSilent(`execute in ${level.dimension} positioned ${x} ${y} ${z} run playsound minecraft:block.note_block.bit master @a[distance=..10] ~ ~ ~ 1 ${SLOTS[i].pitch}`)
		event.server.scheduleInTicks(40, () => checkUsb(event, level, i + 1))
	}

	BlockEvents.rightClicked('kubejs:dna_sequencer', event => {
		const player = event.player
		const x = event.block.x
		const y = event.block.y
		const z = event.block.z
		const slot = SLOTS.find(usbSlot => usbSlot.usb == event.item.id)
		if (event.hand != 'MAIN_HAND') return
		if (slot) {
			if (event.level.getBlock(x + slot.dx, y, z + slot.dz).id != 'minecraft:air') {
				player.tell('§c[!] > §7That USB slot is occupied.')
				return
			}
			event.item.shrink(1)
			event.server.runCommandSilent(`execute in ${event.level.dimension} run setblock ${x + slot.dx} ${y} ${z + slot.dz} ${slot.usb}_block[facing=${slot.facing}]`)
			event.server.runCommandSilent(`execute in ${event.level.dimension} positioned ${x} ${y} ${z} run playsound create:depot_plop block @a[distance=..10] ~ ~ ~`)
			player.swing()
			return
		}
		if (String(event.facing) != 'up' || !player.mainHandItem.empty) return
		player.swing()
		checkUsb(event, event.level, 0)
	})

	BlockEvents.rightClicked('kubejs:paradox_autoclave', event => {
		const player = event.player
		const block = event.block
		const level = event.level
		if (event.hand != 'MAIN_HAND') return
		const frog = level.getEntitiesWithin(AABB.of(block.x - 3, block.y - 3, block.z - 3, block.x + 3, block.y + 3, block.z + 3)).find(entity => entity.type == 'minestuck:frog' && !entity.tags.contains('AutoclaveFrog'))
		if (!frog) {
			player.swing()
			event.server.runCommandSilent(`playsound minecraft:block.note_block.bit master ${player.username} ${block.x} ${block.y} ${block.z} 1 0.1`)
			return
		}
		frog.mergeNbt({ Silent: 1 })
		frog.potionEffects.add('minecraft:invisibility', -1, 0, false, false)
		player.swing()
		player.setStatusMessage(Text.gray('The frog transportalized to where you found it'))
		event.server.runCommandSilent(`execute at ${player.username} run particle minestuck:transportalizer ${frog.x} ${frog.y + 1} ${frog.z} 0 0 0 0 1 force`)
		event.server.runCommandSilent(`execute at ${player.username} run playsound minestuck:block.transportalizer.teleport block @a[distance=..20] ${block.x} ${block.y} ${block.z} 1 1.5`)
		event.server.scheduleInTicks(40, () => {
			frog.teleportTo(frog.x, frog.y - 10, frog.z)
			frog.kill()
			event.server.runCommandSilent(`execute at ${player.username} run particle minestuck:transportalizer ${block.x} ${block.y + 2} ${block.z} 0 0 0 0 1 force`)
			event.server.runCommandSilent(`execute at ${player.username} run playsound minestuck:block.transportalizer.teleport block @a[distance=..20] ${block.x} ${block.y} ${block.z} 1 1.5`)
			event.server.runCommandSilent(`execute in ${level.dimension} run summon minestuck:frog ${block.x + 0.5} ${block.y + 1} ${block.z + 0.5} {NoAI:1b,Silent:1b,Invulnerable:1b,Variant:"golden",Tags:["AutoclaveFrog"]}`)
			if (!player.isRemoved()) player.setStatusMessage(Text.gray('Appearify!'))
			event.server.scheduleInTicks(40, () => {
				level.getEntitiesWithin(AABB.of(block.x - 1, block.y, block.z - 1, block.x + 2, block.y + 3, block.z + 2)).forEach(entity => {
					if (entity.type == 'minestuck:frog' && entity.tags.contains('AutoclaveFrog')) entity.discard()
				})
				event.server.runCommandSilent(`execute in ${level.dimension} run setblock ${block.x} ${block.y + 1} ${block.z} verseworks:mystic_crystal`)
				event.server.runCommandSilent(`execute in ${level.dimension} run particle minecraft:explosion ${block.x + 0.5} ${block.y + 1.5} ${block.z + 0.5} 0 0 0 0 1`)
				event.server.runCommandSilent(`execute in ${level.dimension} run playsound minecraft:block.amethyst_block.break block @a ${block.x + 0.5} ${block.y + 1.5} ${block.z + 0.5}`)
			})
		})
	})

	function lightningGrow(tadpole, dimension, size) {
		tadpole.server.runCommandSilent(`execute in ${dimension} run particle cataclysm:lightning_explode ${tadpole.x.toFixed(2)} ${tadpole.y.toFixed(2)} ${tadpole.z.toFixed(2)} 0 0 0 0 1 force`)
		tadpole.server.runCommandSilent(`execute in ${dimension} positioned ${tadpole.x.toFixed(2)} ${tadpole.y.toFixed(2)} ${tadpole.z.toFixed(2)} as @a[distance=..100] at @s run playsound hazennstuff:electric_impact master @s ~ ~ ~ 1`)
		tadpole.mergeNbt({ transformation: { left_rotation: [0, 0, 0.7071068, 0.7071068], right_rotation: [0, 0, 0, 1], translation: [0, 0, 0], scale: [size, size, size] } })
	}

	function floatAway(tadpole, dimension, ticksLeft) {
		if (tadpole.isRemoved()) return
		if (ticksLeft == 200) lightningGrow(tadpole, dimension, 3)
		if (ticksLeft == 100) lightningGrow(tadpole, dimension, 6)
		if (ticksLeft <= 0) {
			tadpole.server.runCommandSilent(`execute in ${dimension} run particle minecraft:poof ${tadpole.x.toFixed(2)} ${(tadpole.y + 0.2).toFixed(2)} ${tadpole.z.toFixed(2)} 0.2 0.2 0.2 0.02 15`)
			tadpole.discard()
			return
		}
		tadpole.teleportTo(tadpole.x, tadpole.y + 0.3, tadpole.z)
		tadpole.server.runCommandSilent(`execute in ${dimension} run particle minecraft:end_rod ${tadpole.x.toFixed(2)} ${(tadpole.y - 0.5).toFixed(2)} ${tadpole.z.toFixed(2)} 0.1 0.1 0.1 0.01 1`)
		tadpole.server.scheduleInTicks(2, () => floatAway(tadpole, dimension, ticksLeft - 2))
	}

	PlayerEvents.advancement(event => {
		if (String(event.advancement.id) != 'verseworks:new_worlds_await') return
		const player = event.player
		const dimension = String(player.level.dimension)
		const tadpole = player.level.createEntity('minecraft:item_display')
		let cauldron = null
		let closest = 999
		for (let dx = -6; dx <= 6; dx++) {
			for (let dy = -3; dy <= 3; dy++) {
				for (let dz = -6; dz <= 6; dz++) {
					let block = player.level.getBlock(Math.floor(player.x) + dx, Math.floor(player.y) + dy, Math.floor(player.z) + dz)
					if (dx * dx + dy * dy + dz * dz < closest && String(block.id).includes('cauldron')) {
						cauldron = block
						closest = dx * dx + dy * dy + dz * dz
					}
				}
			}
		}
		if (cauldron) tadpole.setPos(cauldron.x + 0.5, cauldron.y + 0.6, cauldron.z + 0.5)
		else tadpole.setPos(player.x, player.y + 1, player.z)
		tadpole.mergeNbt({
			item: { id: 'kubejs:genesis_tadpole', count: 1 }, teleport_duration: 2, brightness: { sky: 15, block: 15 }, Tags: ['GenesisTadpole'],
			transformation: { left_rotation: [0, 0, 0.7071068, 0.7071068], right_rotation: [0, 0, 0, 1], translation: [0, 0, 0], scale: [1.5, 1.5, 1.5] }
		})
		tadpole.spawn()
		player.server.runCommandSilent(`execute in ${dimension} run playsound minecraft:block.amethyst_block.resonate block @a ${tadpole.x.toFixed(2)} ${tadpole.y.toFixed(2)} ${tadpole.z.toFixed(2)} 1 1.5`)
		const nearby = `execute in ${dimension} positioned ${tadpole.x.toFixed(2)} ${tadpole.y.toFixed(2)} ${tadpole.z.toFixed(2)} as @a[distance=..100] at @s run`
		player.server.runCommandSilent(`${nearby} stopsound @s music`)
		player.server.runCommandSilent(`${nearby} stopsound @s record`)
		player.server.runCommandSilent(`${nearby} playsound minecraft:custom.act7 record @s ~ ~ ~ 10000`)
		floatAway(tadpole, dimension, 300)
	})

	function thanksForPlaying(player) {
		player.server.scheduleInTicks(40, () => {
			const dimension = String(player.level.dimension)
			if (player.isRemoved() || !dimension.startsWith('verseworks:')) return
			const visited = player.server.persistentData.getCompound('VisitedVerses')
			if (visited.getBoolean(dimension)) return
			visited.putBoolean(dimension, true)
			player.server.persistentData.put('VisitedVerses', visited)
			const display = player.level.createEntity('minecraft:text_display')
			display.setPos(player.x, player.y + 5, player.z)
			display.mergeNbt({
				billboard: 'center', shadow: 1, background: 0, brightness: { sky: 15, block: 15 },
				text: '{"text":"THANKS FOR PLAYING","color":"white","bold":true}',
				transformation: { left_rotation: [0, 0, 0, 1], right_rotation: [0, 0, 0, 1], translation: [0, 0, 0], scale: [8, 8, 8] }
			})
			display.spawn()
		})
	}

	NativeEvents.onEvent($ChangedDimension, event => thanksForPlaying(event.getEntity()))

	PlayerEvents.advancement(event => {
		if (String(event.advancement.id) == 'verseworks:enter_a_new_world') thanksForPlaying(event.player)
	})
})()
