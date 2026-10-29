(() => {
	const $EntityInteractSpecific = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteractSpecific')

	const ASPECT_COLORS = { breath: 'aqua', mind: 'dark_aqua', void: 'dark_blue', space: 'dark_gray', doom: 'dark_green', heart: 'light_purple', blood: 'dark_red', hope: 'yellow', light: 'gold', life: 'green', time: 'red', rage: 'dark_purple' }

	const COLOR_CODES = { gray: '§7', aqua: '§b', dark_aqua: '§3', dark_blue: '§1', dark_gray: '§8', dark_green: '§2', light_purple: '§d', dark_red: '§4', yellow: '§e', gold: '§6', green: '§a', red: '§c', dark_purple: '§5' }

	function readableName(component, key) {
		let name = String(component.getString())
		if (name == key) {
			name = ''
			String(key).split('.').pop().split('_').forEach(word => {
				if (name != '') name += ' '
				name += word.charAt(0).toUpperCase() + word.slice(1)
			})
		}
		return name.replace(/§./g, '').replace(' Plushie', '').replace(' Plush', '')
	}

	function spriteName(name, color) {
		return `${COLOR_CODES[color]}${String(name).replace(/§./g, '')}`
	}

	function aspectColor(player) {
		const aspect = Object.keys(ASPECT_COLORS).find(name => player.tags.contains(name))
		if (aspect) return ASPECT_COLORS[aspect]
		return 'gray'
	}

	function colorSprite(server, dimension, color) {
		server.runCommandSilent(`team add ${color}`)
		server.runCommandSilent(`team modify ${color} color ${color}`)
		server.runCommandSilent(`execute in ${dimension} as @n[tag=Prototyping] run team join ${color} @s`)
		server.runCommandSilent(`execute in ${dimension} as @n[tag=Prototyping] on passengers if entity @s[tag=SpriteRider] run team join ${color} @s`)
		server.runCommandSilent(`execute in ${dimension} as @n[tag=Prototyping] on passengers if entity @s[type=minecraft:block_display] run team join ${color} @s`)
		server.runCommandSilent(`execute in ${dimension} as @n[tag=Prototyping] on passengers if entity @s[type=minecraft:block_display] run data merge entity @s {Glowing:1b,glow_color_override:-1,billboard:"vertical",block_state:{Properties:{facing:"south",rotation:"0"}}}`)
		server.runCommandSilent(`execute in ${dimension} as @n[tag=Prototyping] on passengers if entity @s[type=minecraft:item_display] run team join ${color} @s`)
		server.runCommandSilent(`execute in ${dimension} as @n[tag=Prototyping] on passengers if entity @s[type=minecraft:item_display] run data merge entity @s {Glowing:1b,glow_color_override:-1,billboard:"vertical"}`)
		server.runCommandSilent(`execute in ${dimension} as @n[tag=Prototyping] on passengers on passengers if entity @s[type=minecraft:item_display] run team join ${color} @s`)
		server.runCommandSilent(`execute in ${dimension} as @n[tag=Prototyping] on passengers on passengers if entity @s[type=minecraft:item_display] run data merge entity @s {Glowing:1b,glow_color_override:-1,billboard:"vertical"}`)
	}

	function makeSprite(player, dimension) {
		player.server.runCommandSilent(`execute in ${dimension} run tp @n[tag=Prototyping] @n[type=minestuck:kernelsprite]`)
		player.server.runCommandSilent(`execute in ${dimension} at @n[tag=Prototyping] run particle cataclysm:lightning_explode`)
		player.server.runCommandSilent(`execute in ${dimension} at @n[tag=Prototyping] run playsound cataclysm:super_lightning_strike master @a[distance=..20] ~ ~ ~`)
		player.server.runCommandSilent(`execute in ${dimension} run kill @n[type=minestuck:kernelsprite]`)
		player.server.runCommandSilent(`execute in ${dimension} run data merge entity @n[tag=Prototyping] {Invulnerable:1,PersistenceRequired:1b,NeoForgeData:{ownerUUID:"${player.uuid}",waiting:0b,pettingtamed:1b,attackifownerattacks:1b,damageOwner:0b,followdistance:10,attackifselfattacked:1b,teleportdistance:20,attackifownerattacked:1b,isNameGenerated:1b,sitstill:0b,freewander:0b,pettingLastInteracted:20746L},Tags:["TemptedByGoldenWheat", "Prototyping"],"neoforge:attachments":{"petting:pet_inventory":{Size:7,Items:[]}}}`)
		colorSprite(player.server, dimension, aspectColor(player))
		player.server.runCommandSilent(`execute in ${dimension} run attribute @n[tag=Prototyping] minecraft:generic.gravity base set 0.01`)
		player.server.runCommandSilent(`execute in ${dimension} run effect give @e[tag=Prototyping] minecraft:slow_falling infinite 0 true`)
	}

	function riderOf(sprite) {
		if (!sprite.tags.contains('MobSprite')) return null
		return sprite.passengers.find(entity => entity.tags.contains('SpriteRider'))
	}

	function nameHolder(sprite) {
		if (riderOf(sprite)) return riderOf(sprite)
		return sprite
	}

	ItemEvents.entityInteracted(event => {
		const player = event.player
		if (event.hand != 'MAIN_HAND' || event.target.type != 'minestuck:kernelsprite' || player.tags.contains('CursorGiven')) return
		player.addTag('CursorGiven')
		player.give('kubejs:cursor')
		player.swing()
	})

	function waitForPrototype(event) {
		const player = event.player
		if (!player.level.getEntitiesWithin(AABB.of(player.x - 64, player.y - 64, player.z - 64, player.x + 64, player.y + 64, player.z + 64)).find(entity => entity.type == 'minestuck:kernelsprite')) return
		player.setStatusMessage(Text.white('Your KERNELSPRITE gestures at your CURSOR'))
		if (player.inventory.find('kubejs:cursor') == -1) player.give('kubejs:cursor')
		event.cancel()
	}

	ItemEvents.rightClicked('minestuck:cruxite_apple', event => waitForPrototype(event))
	ItemEvents.rightClicked('minestuck:cruxite_potion', event => waitForPrototype(event))

	ItemEvents.entityInteracted(event => {
		const player = event.player
		let target = event.target
		if (target.parentMob) target = target.parentMob
		if (event.hand != 'MAIN_HAND' || player.mainHandItem.id != 'kubejs:cursor') return
		if (target.tags.contains('Sprite') || target.tags.contains('SpriteRider') || target.tags.contains('SpriteBlock')) return
		if (['mca:female_villager', 'mca:male_villager', 'minestuck:kernelsprite', 'minecraft:bee', 'minestuck:lotus_flower', 'minecraft:player'].includes(String(target.type))) return
		if (Object.keys(ASPECT_COLORS).some(aspect => target.tags.contains(`${aspect}_denizen`))) return
		player.swing()
		player.mainHandItem.shrink(1)
		if (target.type == 'minecraft:ender_dragon') target.setCustomName(spriteName('Jeansprite', aspectColor(player)))
		else target.setCustomName(spriteName(`${readableName(target.getName(), '')}sprite`, aspectColor(player)))
		target.setCustomNameVisible(true)
		target.addTag('Prototyping')
		makeSprite(player, event.level.dimension)
		target.setInvulnerable(true)
		player.server.runCommandSilent(`execute in ${event.level.dimension} run effect give @n[tag=Prototyping] minecraft:glowing infinite 0 true`)
		target.removeTag('Prototyping')
		target.addTag('Sprite')
		if (target.type == 'minecraft:ender_dragon') {
			player.server.runCommandSilent('execute as @a at @s run playsound irons_spellbooks:spell.black_hole.charge master @s ~ ~ ~')
			player.server.runCommandSilent('colorfulskies color @a sky 4ce24e')
			player.server.runCommandSilent('title @a actionbar [{"text":"> ","color":"gray"},{"text":"WHAT HAVE YOU DONE","color":"white"}]')
			player.server.persistentData.putBoolean('FGPrototyped', true)
			player.server.scheduleInTicks(100, () => player.server.runCommandSilent('colorfulskies color @a sky clear'))
		}
		event.cancel()
	})

	function prototypeBlock(event) {
		const player = event.player
		const block = event.block
		const descriptionId = block.blockState.block.getDescriptionId()
		const customName = JSON.stringify({ text: spriteName(`${readableName(Text.translatable(descriptionId), descriptionId)}sprite`, aspectColor(player)) }).replace(/'/g, "\\'")
		let properties = ''
		if (block.blockState.getDestroySpeed(event.level, block.pos) < 0) return
		if (/^minestuck:(mini_)?(punch_designix|alchemiter|cruxtruder|totem_lathe)/.test(String(block.id)) || String(block.id).startsWith('kubejs:')) return
		if (['minestuck:computer', 'minestuck:old_computer', 'minestuck:laptop', 'minestuck:crockertop', 'minestuck:hubtop', 'minestuck:lunchtop', 'minestuck_extended:skaia_pc'].includes(String(block.id))) return
		if (['whimsy_deco:vintage_globe', 'whimsy_deco:antique_vintage_globe', 'whimsy_deco:singing_frog', 'whimsy_deco:fan'].includes(String(block.id))) return
		block.properties.forEach((name, value) => {
			let stateValue = String(value)
			if (String(name) == 'facing') stateValue = 'south'
			if (String(name) == 'rotation') stateValue = '0'
			if (properties != '') properties += ','
			properties += `${name}:"${stateValue}"`
		})
		player.swing()
		player.mainHandItem.shrink(1)
		player.server.runCommandSilent(`execute in ${event.level.dimension} run summon minecraft:bee ${block.x + 0.5} ${(block.y + 0.2).toFixed(2)} ${block.z + 0.5} {HasStung:1b,Silent:1b,CannotEnterHiveTicks:2147483647,CustomName:'${customName}',CustomNameVisible:1b,Tags:["Prototyping"],active_effects:[{id:"minecraft:invisibility",duration:-1,show_particles:0b}],Passengers:[{id:"minecraft:block_display",Tags:["SpriteBlock"],Glowing:1b,block_state:{Name:"${block.id}",Properties:{${properties}}},transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],scale:[1f,1f,1f],translation:[-0.5f,-0.8f,-0.5f]}}]}`)
		player.server.runCommandSilent(`execute in ${event.level.dimension} run setblock ${block.x} ${block.y} ${block.z} air`)
		makeSprite(player, event.level.dimension)
		player.server.runCommandSilent(`execute in ${event.level.dimension} run tag @n[tag=Prototyping] add Sprite`)
		player.server.runCommandSilent(`execute in ${event.level.dimension} run tag @n[tag=Prototyping] add BlockSprite`)
		player.server.runCommandSilent(`execute in ${event.level.dimension} run tag @n[tag=Prototyping] remove Prototyping`)
	}

	BlockEvents.rightClicked(event => {
		if (event.player.mainHandItem.id != 'kubejs:cursor') return
		if (event.hand == 'MAIN_HAND') prototypeBlock(event)
		event.cancel()
	})

	function secondPrototype(player, sprite) {
		const item = player.mainHandItem
		let color = String(sprite.teamName).toLowerCase()
		if (item.empty || !sprite.tags.contains('Sprite') || sprite.tags.contains('2xPrototype')) return false
		if (String(item.id).startsWith('kubejs:') || item.id == 'minestuck:captcha_card' || item.hasTag('minestuck:cruxite_artifacts')) return false
		if (['minestuck:blank_disk', 'minestuck:client_disk', 'minestuck:server_disk', 'minestuck:sburb_code', 'minestuck:completed_sburb_code', 'minestuck:computer_parts', 'minestuck:computer', 'minestuck:old_computer', 'minestuck:laptop', 'minestuck:crockertop', 'minestuck:hubtop', 'minestuck:lunchtop', 'minestuck_extended:skaia_pc'].includes(String(item.id))) return false
		if (['whimsy_deco:vintage_globe', 'whimsy_deco:antique_vintage_globe', 'whimsy_deco:singing_frog', 'whimsy_deco:fan'].includes(String(item.id))) return false
		if (color == '') color = aspectColor(player)
		const named = nameHolder(sprite)
		let oldName = ''
		if (named.getCustomName()) oldName = named.getCustomName().getString()
		sprite.addTag('Prototyping')
		if (sprite.tags.contains('BlockSprite')) player.server.runCommandSilent(`execute in ${sprite.level.dimension} at @n[tag=Prototyping] run summon minecraft:item_display ~ ~ ~ {item:{id:"${item.id}",count:1},transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],scale:[1f,1f,1f],translation:[0f,0.55f,0f]},Tags:["NewPrototype"]}`)
		else player.server.runCommandSilent(`execute in ${sprite.level.dimension} at @n[tag=Prototyping] run summon minecraft:item_display ~ ~ ~ {item:{id:"${item.id}",count:1},Tags:["NewPrototype"]}`)
		if (sprite.tags.contains('BlockSprite') || riderOf(sprite)) player.server.runCommandSilent(`execute in ${sprite.level.dimension} as @n[tag=Prototyping] on passengers run ride @n[tag=NewPrototype] mount @s`)
		else player.server.runCommandSilent(`execute in ${sprite.level.dimension} run ride @n[tag=NewPrototype] mount @n[tag=Prototyping]`)
		player.server.runCommandSilent('tag @e[tag=NewPrototype] remove NewPrototype')
		colorSprite(player.server, sprite.level.dimension, color)
		player.server.runCommandSilent(`execute in ${sprite.level.dimension} at @n[tag=Prototyping] run particle cataclysm:lightning_explode`)
		player.server.runCommandSilent(`execute in ${sprite.level.dimension} at @n[tag=Prototyping] run playsound cataclysm:super_lightning_strike master @a[distance=..20] ~ ~ ~`)
		sprite.removeTag('Prototyping')
		named.setCustomName(spriteName(`${readableName(item.getHoverName(), item.getDescriptionId())}${oldName}`, color))
		sprite.setCustomName(named.getCustomName())
		item.shrink(1)
		sprite.addTag('2xPrototype')
		player.swing()
		return true
	}

	function villagerSprite(entity) {
		return ['mca:female_villager', 'mca:male_villager'].includes(String(entity.type)) && entity.tags.contains('Sprite')
	}

	ItemEvents.entityInteracted(event => {
		const player = event.player
		let sprite = event.target
		if (sprite.parentMob) sprite = sprite.parentMob
		if (sprite.tags.contains('SpriteRider') && sprite.vehicle) {
			if (event.hand == 'MAIN_HAND' && !secondPrototype(player, sprite.vehicle)) {
				player.interactOn(sprite.vehicle, event.hand)
				player.swing()
			}
			event.cancel()
			return
		}
		if (event.hand == 'MAIN_HAND' && secondPrototype(player, sprite)) {
			event.cancel()
			return
		}
		if (villagerSprite(sprite)) event.cancel()
	})

	NativeEvents.onEvent($EntityInteractSpecific, event => {
		const player = event.getEntity()
		const sprite = event.getTarget()
		if (event.getLevel().isClientSide() || !villagerSprite(sprite)) return
		event.setCanceled(true)
		if (event.getHand() == 'MAIN_HAND' && player.mainHandItem.id != 'kubejs:cursor') secondPrototype(player, sprite)
	})

	function setSpawnHere(server, name) {
		server.runCommandSilent(`execute as ${name} at @s run spawnpoint @s ~ ~ ~`)
	}

	PlayerEvents.advancement('minestuck:minestuck/entry', event => {
		const player = event.player
		const name = String(player.username)
		player.server.scheduleInTicks(100, () => setSpawnHere(player.server, name))
		player.server.scheduleInTicks(1, () => {
			setSpawnHere(player.server, name)
			player.level.getEntitiesWithin(AABB.of(player.x - 100, player.y - 100, player.z - 100, player.x + 100, player.y + 100, player.z + 100)).forEach(sprite => {
				if (!sprite.tags.contains('Sprite')) return
				if (sprite.tags.contains('BlockSprite')) {
					sprite.level.getEntitiesWithin(AABB.of(sprite.x - 3, sprite.y - 3, sprite.z - 3, sprite.x + 3, sprite.y + 3, sprite.z + 3)).forEach(display => {
						if (display.tags.contains('SpriteBlock') && !display.isPassenger()) display.startRiding(sprite, true)
					})
				}
				if (sprite.tags.contains('MobSprite') && !riderOf(sprite)) {
					let rider = sprite.level.getEntitiesWithin(AABB.of(sprite.x - 3, sprite.y - 3, sprite.z - 3, sprite.x + 3, sprite.y + 3, sprite.z + 3)).find(entity => entity.tags.contains('SpriteRider') && !entity.isPassenger())
					if (rider) rider.startRiding(sprite, true)
				}
				if (sprite.tags.contains('2xPrototype')) {
					sprite.level.getEntitiesWithin(AABB.of(sprite.x - 3, sprite.y - 3, sprite.z - 3, sprite.x + 3, sprite.y + 3, sprite.z + 3)).forEach(display => {
						if (display.type != 'minecraft:item_display' || display.isPassenger()) return
						if (sprite.tags.contains('BlockSprite') || sprite.tags.contains('MobSprite')) sprite.passengers.forEach(passenger => display.startRiding(passenger, true))
						else display.startRiding(sprite, true)
					})
				}
				sprite.addTag('Prototyping')
				colorSprite(player.server, sprite.level.dimension, aspectColor(player))
				sprite.removeTag('Prototyping')
				const named = nameHolder(sprite)
				named.setInvulnerable(true)
				if (named.getCustomName()) {
					named.setCustomName(spriteName(named.getCustomName().getString(), aspectColor(player)))
					sprite.setCustomName(named.getCustomName())
				}
			})
		})
	})
})()
