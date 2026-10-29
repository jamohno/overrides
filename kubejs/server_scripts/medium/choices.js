(() => {
	const $PlayerData = Java.loadClass('com.mraof.minestuck.player.PlayerData')
	const $PlayerBoondollars = Java.loadClass('com.mraof.minestuck.player.PlayerBoondollars')
	const $MagicData = Java.loadClass('io.redspace.ironsspellbooks.api.magic.MagicData')
	const $SpellRegistry = Java.loadClass('io.redspace.ironsspellbooks.api.registry.SpellRegistry')

	const GRIST = '50000 minestuck:build 30000 minestuck:amber 30000 minestuck:caulk 30000 minestuck:chalk 30000 minestuck:iodine 30000 minestuck:shale 30000 minestuck:tar 20000 minestuck:cobalt 20000 minestuck:marble 20000 minestuck:mercury 20000 minestuck:quartz 20000 minestuck:sulfur 12000 minestuck:amethyst 12000 minestuck:garnet 12000 minestuck:ruby 12000 minestuck:rust 6000 minestuck:diamond 6000 minestuck:gold 6000 minestuck:uranium 1000 minestuck:zillium'

	const CHOICES = {
		space: [
			{ name: 'Ranine Selection', hover: 'Choosing this grants you an item that lets you pick 5 Verses', message: 'You gained a Verse Chooser!', apply: player => player.server.runCommandSilent(`give ${player.username} verseworks:blank_verse[lore=['[{"text":"Verse Chooser","italic":false,"color":"gray"}]']]`) },
			{ name: 'Ranine Creation', hover: 'Choosing this lets your Frog Net summon frogs', message: 'Your frog net gained a new ability!', apply: player => { player.addTag('RanineCreation'); player.server.runCommandSilent(`give ${player.username} minestuck:bug_net[custom_name='[{"text":"Frog Net","italic":false}]']`) } }
		],
		time: [
			{ name: 'Face Yourselves', hover: 'See the versions of yourself that died instead of you', message: 'Haste level increased', apply: player => { for (let i = 0; i < Math.min(player.stats.deaths, 10); i++) player.server.runCommandSilent(`execute in minestuck:veil run summon strawstatues:straw_statue ${(1672 + Math.random() * 40).toFixed(2)} 70 ${(-125 + Math.random() * 42).toFixed(2)} {profile:{name:"${player.username}"},Rotation:[${(Math.random() * 360).toFixed(1)}f,0f],SlimArms:1b}`); gainSpell(player, 'irons_spellbooks:haste', 5) } },
			{ name: 'Face Away', hover: 'See nothing', message: 'Evasion level increased', apply: player => gainSpell(player, 'irons_spellbooks:evasion', 5) }
		],
		breath: [
			{ name: 'Cut Your Freedom', hover: 'Lose the ability to fly, but give your Elytra to consorts instead', message: 'You feel heavier', apply: player => { player.addTag('CutYourFreedom'); breakElytra(player) } },
			{ name: 'Cut Their Freedom', hover: 'The consorts of this land will never experience anything else.', message: 'The consorts of this land will never know true freedom', apply: player => player.addTag('BreathTaker') }
		],
		light: [
			{ name: 'Knowledge Above Shine', hover: 'Using coins gives you spell ink', message: 'You chose Knowledge', apply: player => player.addTag('KnowledgeAboveShine') },
			{ name: 'Shine Above Knowledge', hover: 'Using coins gives you Boondollars', message: 'You chose Shine', apply: player => player.addTag('ShineAboveKnowledge') }
		],
		heart: [
			{ name: 'Accept Yourself', message: 'You feel peace in your soul', apply: player => { player.setAttributeBaseValue('minecraft:generic.max_health', player.getAttributeBaseValue('minecraft:generic.max_health') + 20); player.heal(20) } },
			{ name: 'Reject Yourself', message: 'You reject yourself, something stirs in your soul', apply: player => gainSpell(player, 'hazennstuff:violent_regurgitation', 5) }
		],
		hope: [
			{ name: 'Band of the Land', hover: 'Place your microphone on a stage platform and your bandmates around it never stop playing', message: 'Your bandmates wave goodbye', apply: player => player.addTag('BandOfTheLand') },
			{ name: 'Band on the Go', hover: 'Your microphone sometimes draws in a new bandmate', message: 'Your bandmates encourage you to play!', apply: player => player.addTag('BandOnTheGo') }
		],
		life: [
			{ name: 'Preserve', hover: 'Cainte takes your Seed Vault', message: 'Cainte takes your Seed Vault', apply: player => { player.addTag('Preserve'); player.server.runCommandSilent(`clear ${player.username} kubejs:seed_vault`) } },
			{ name: 'Export', hover: 'Release your Seed Vault into your new Universe', message: 'CAINTE: Take care of it.', apply: player => player.addTag('Exporter') }
		],
		void: [
			{ name: 'Reveal the Truth', apply: player => { player.server.runCommandSilent(`grimdark on ${player.username}`); gainSpell(player, 'irons_spellbooks:sculk_tentacles', 10) } },
			{ name: 'Let it Stay Hidden', message: 'Some things are better left in the dark', apply: player => gainSpell(player, 'irons_spellbooks:abyssal_shroud', 10) }
		],
		doom: [
			{ name: 'Doom Your Land', hover: 'Causes Explosions on All Block Breaks in Land', message: 'The ground shakes. Your planet is unsafe.', apply: player => player.addTag('DoomYourLand') },
			{ name: 'Doom Yourself', hover: 'Max Health drops to 1', message: 'You accepted your fate', apply: player => player.setAttributeBaseValue('minecraft:generic.max_health', 1) }
		],
		blood: [
			{ name: 'Rhiannon Leaves', hover: 'And is unable to come back', message: "RHIANNON: I'll join you out there", apply: player => { player.level.getEntitiesWithin(AABB.of(player.x - 100, player.y - 100, player.z - 100, player.x + 100, player.y + 100, player.z + 100)).forEach(entity => { if (entity.tags.contains('blood_denizen')) entity.discard() }); player.addTag('DenizenKilled'); player.addTag('RhiannonComing') } },
			{ name: 'Rhiannon Stays', message: 'RHIANNON: As you wish', apply: player => player.addTag('RhiannonStays') }
		],
		mind: [
			{ name: 'More Time to Think', hover: 'Gain a Pocket Dimension', message: 'You reached into your mind, and found a place to think', apply: player => player.setAttributeBaseValue('additional_attributes:innate_spell/irons_spellbooks/pocket_dimension', 1) },
			{ name: 'Make Decisions Faster', hover: 'Reduce Cast Time to 0', message: 'Your mind accelerates', apply: player => player.setAttributeBaseValue('irons_spellbooks:cast_time_reduction', 100) }
		],
		rage: [
			{ name: 'Learn the Truth', apply: player => { player.addTag('LearnedTruth'); revealTruth(player, [ `${hitName(player, 'Imp')} - Parent of 3`, `${hitName(player, 'Consort')} - One of ${hitName(player, 'Imp')}'s Kids`, `${hitName(player, 'Priest')} - ${hitName(player, 'Consort')}'s Teacher`, `${hitName(player, 'Pyromancer')} - ${hitName(player, 'Priest')}'s Partner`, `${hitName(player, 'Apothecarist')} - ${hitName(player, 'Pyromancer')}'s Gardener`, `${hitName(player, 'Electromancer')} = Brother of ${hitName(player, 'Apothecarist')}`, `${hitName(player, 'Archevoker')} = ${hitName(player, 'Electromancer')}'s Grandparent.` ], 0) } },
			{ name: 'Embrace the Rage', message: 'NUADA: GOOD....', apply: player => gainSpell(player, 'irons_spellbooks:devour', 10) }
		]
	}
	const COLORS = { breath: '#0086EB', light: '#f98100', time: '#ff2106', space: '#8a8a8a', life: '#77c350', void: '#033476', heart: '#bd1864', hope: '#FFE094', doom: '#20401f', rage: '#9c4dad', mind: '#46fbc4', blood: '#BA1915' }

	function canChoose(player, aspect) {
		let message = ''
		if (!player.tags.contains('ChoiceReceived') || !player.tags.contains(aspect)) return false
		if (player.tags.contains('DenizenKilled')) {
			player.inventory.setStackInSlot(player.inventory.find(`kubejs:${aspect}_choice`), 'kubejs:made_choice')
			player.tell(Text.gray('By slaying your Denizen, you have made your choice.'))
			return false
		}
		if (aspect == 'time' && (!player.tags.contains('DenizenActive') || String(player.level.dimension) != 'minestuck:veil')) message = "You must be in Cat-Sith's lair to make this choice."
		if (aspect == 'life' && player.inventory.count('kubejs:seed_vault') == 0) message = 'You need a Seed Vault to make this choice.'
		if (aspect == 'void' && player.inventory.count('kubejs:obscured_truth') == 0) message = 'You need the Obscured Truth to make this choice.'
		if (aspect == 'blood' && !player.tags.contains('DenizenActive')) message = "You must be in Rhiannon's lair to make this choice."
		if (message == '') return true
		player.tell(Text.of(message).color(COLORS[aspect]))
		return false
	}

	function gainSpell(player, spell, levels) {
		const attribute = player.getAttribute(`additional_attributes:innate_spell/${spell.replace(':', '/')}`)
		if (attribute) attribute.setBaseValue(attribute.getBaseValue() + levels)
		const data = $MagicData.getPlayerMagicData(player).getSyncedData()
		const registered = $SpellRegistry.getSpell(spell)
		if (registered && !data.isSpellLearned(registered)) data.learnSpell(registered, true)
	}

	function choose(player, aspect, index) {
		if (!player) return 0
		const slot = player.inventory.find(`kubejs:${aspect}_choice`)
		if (slot < 0 || !canChoose(player, aspect)) return 0
		const choice = CHOICES[aspect][index]
		player.inventory.setStackInSlot(slot, 'kubejs:made_choice')
		player.give('kubejs:hoard_expulsor')
		player.server.runCommandSilent(`grist add ${player.username} ${GRIST}`)
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound minecraft:block.beacon.power_select master @s`)
		choice.apply(player)
		if (choice.message) player.setStatusMessage(Text.of(choice.message).color(COLORS[aspect]))
		return 1
	}
	function button(aspect, index, color) {
		const option = CHOICES[aspect][index]
		const text = Text.of(option.name).color(color).underlined().clickRunCommand(`/choice ${aspect} ${index + 1}`)
		if (option.hover) return text.hover(Text.of(option.hover))
		return text
	}

	Object.keys(CHOICES).forEach(aspect => {
		ItemEvents.rightClicked(`kubejs:${aspect}_choice`, event => {
			if (event.hand != 'MAIN_HAND' || !canChoose(event.player, aspect)) return
			event.player.tell(Text.empty()
				.append(Text.of('Make Your Choice:\n').color(COLORS[aspect]))
				.append(button(aspect, 0, '#AAAAAA'))
				.append(Text.of('\n'))
				.append(button(aspect, 1, '#555555')))
			event.player.swing()
		})
	})

	ServerEvents.commandRegistry(event => {
		const Commands = event.commands
		const command = Commands.literal('choice')
		Object.keys(CHOICES).forEach(aspect => {
			command.then(Commands.literal(aspect)
				.then(Commands.literal('1').executes(ctx => choose(ctx.source.player, aspect, 0)))
				.then(Commands.literal('2').executes(ctx => choose(ctx.source.player, aspect, 1))))
		})
		event.register(command)
	})

	const GRIST_BLOCKS = ['amber_block', 'amethyst_block', 'artifact_block', 'brain_block', 'build_block', 'caulk_block', 'chalk_block', 'cobalt_block', 'diamond_block', 'garnet_block', 'gold_block', 'hardened_zillium', 'iodine_block', 'marble_block', 'mercury_block', 'quartz_block', 'ruby_block', 'rust_block', 'shale_block', 'sulfur_block', 'tar_block', 'uranium_block', 'zillium_block']

	BlockEvents.placed('kubejs:hoard_expulsor', event => {
		const expulsors = event.server.persistentData.getCompound('HoardExpulsors')
		expulsors.putBoolean(`${event.level.dimension} ${event.block.x} ${event.block.y} ${event.block.z}`, true)
		event.server.persistentData.put('HoardExpulsors', expulsors)
	})

	ServerEvents.tick(event => {
		if (event.server.tickCount % 2 != 0) return
		const expulsors = event.server.persistentData.getCompound('HoardExpulsors')
		const keys = []
		expulsors.getAllKeys().forEach(key => keys.push(String(key)))
		keys.forEach(key => {
			const pos = key.split(' ')
			const x = Number(pos[1])
			const y = Number(pos[2])
			const z = Number(pos[3])
			let playerNear = false
			event.server.players.forEach(player => {
				if (String(player.level.dimension) == pos[0] && (player.x - x - 0.5) * (player.x - x - 0.5) + (player.y - y) * (player.y - y) + (player.z - z - 0.5) * (player.z - z - 0.5) <= 100) playerNear = true
			})
			if (!playerNear) return
			const level = event.server.getLevel(pos[0])
			if (level.getBlock(x, y, z).id != 'kubejs:hoard_expulsor') {
				expulsors.remove(key)
				return
			}
			const angle = Math.random() * Math.PI * 2
			const spread = 1.5 * Math.sqrt(Math.random())
			const spin = Math.random() * Math.PI
			let grist = null
			level.server.runCommandSilent(`execute in ${level.dimension} run summon minecraft:block_display ${(x + 0.5).toFixed(2)} ${y + 1} ${(z + 0.5).toFixed(2)} {Tags:["HoardGrist","NewGrist"],KubeJSPersistentData:{RemoveAt:${level.time + 30}L},block_state:{Name:"minestuckdungeons:${GRIST_BLOCKS[Math.floor(Math.random() * GRIST_BLOCKS.length)]}"},transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],scale:[0.25f,0.25f,0.25f],translation:[-0.125f,-1f,-0.125f]}}`)
			level.getEntitiesWithin(AABB.of(x, y + 0.5, z, x + 1, y + 1.5, z + 1)).forEach(entity => {
				if (entity.tags.contains('NewGrist')) grist = entity
			})
			if (grist == null) return
			grist.removeTag('NewGrist')
			level.server.scheduleInTicks(2, () => {
				grist.mergeNbt({ start_interpolation: 0, interpolation_duration: 28, transformation: { left_rotation: [0, Math.sin(spin), 0, Math.cos(spin)], right_rotation: [0, 0, 0, 1], scale: [0.05, 0.05, 0.05], translation: [Math.cos(angle) * spread, 4, Math.sin(angle) * spread] } })
			})
			level.server.scheduleInTicks(30, () => grist.discard())
		})
	})

	EntityEvents.spawned('minecraft:block_display', event => {
		if (event.entity.tags.contains('HoardGrist') && event.entity.persistentData.getLong('RemoveAt') < event.level.time) event.cancel()
	})

	BlockEvents.rightClicked(event => {
		const player = event.player
		const block = event.block
		if (event.hand != 'MAIN_HAND' || player.mainHandItem.id != 'minestuck:bug_net' || !player.tags.contains('RanineCreation')) return
		player.server.runCommandSilent(`execute in ${event.level.dimension} run summon minestuck:frog ${block.x + 0.5} ${block.y + 1} ${block.z + 0.5}`)
		player.swing()
		event.cancel()
	})

	function breakElytra(player) {
		const elytra = player.chestArmorItem
		if (elytra.id != 'minecraft:elytra' || elytra.damageValue >= elytra.maxDamage - 1) return
		elytra.damageValue = elytra.maxDamage - 1
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound minecraft:entity.item.break player @a ~ ~ ~`)
	}

	PlayerEvents.inventoryChanged('minecraft:elytra', event => {
		if (event.player.tags.contains('CutYourFreedom')) breakElytra(event.player)
	})

	ItemEvents.entityInteracted('minecraft:elytra', event => {
		const player = event.player
		const consort = event.target
		if (event.hand != 'MAIN_HAND' || !player.tags.contains('CutYourFreedom') || !['minestuck:salamander', 'minestuck:turtle', 'minestuck:iguana', 'minestuck:nakagator'].includes(String(consort.type)) || consort.tags.contains('Feathered')) return
		event.item.shrink(1)
		consort.addTag('Feathered')
		consort.addTag('Feathering')
		player.server.runCommandSilent(`execute in ${consort.level.dimension} run attribute @n[tag=Feathering] minecraft:generic.gravity base set 0.01`)
		player.server.runCommandSilent(`execute in ${consort.level.dimension} run effect give @e[tag=Feathering] minecraft:slow_falling infinite 0 true`)
		consort.removeTag('Feathering')
		player.swing()
		event.cancel()
	})

	function useCoin(event, boondollars, inks) {
		const player = event.player
		if (event.hand != 'MAIN_HAND') return
		if (!player.tags.contains('KnowledgeAboveShine') && !player.tags.contains('ShineAboveKnowledge')) return
		event.item.shrink(1)
		if (player.tags.contains('KnowledgeAboveShine')) player.give(Math.random() < 0.8 ? inks[0] : inks[1])
		else $PlayerBoondollars.addBoondollars($PlayerData.get(player).get(), boondollars, true)
		player.swing()
	}

	ItemEvents.rightClicked('kubejs:light_coin', event => useCoin(event, 100000, ['irons_spellbooks:uncommon_ink', 'irons_spellbooks:rare_ink']))
	ItemEvents.rightClicked('kubejs:super_light_coin', event => useCoin(event, 1000000, ['irons_spellbooks:epic_ink', 'irons_spellbooks:legendary_ink']))

	ItemEvents.crafted('kubejs:seed_vault', event => {
		const player = event.player
		if (!player.tags.contains('Preserve')) return
		player.server.scheduleInTicks(1, () => {
			player.server.runCommandSilent(`clear ${player.username} kubejs:seed_vault 1`)
			player.server.runCommandSilent(`execute at ${player.username} run summon item ~ ~1 ~ {Item:{id:"kubejs:wondrous_seed_stash",count:1},PickupDelay:40s}`)
			player.server.runCommandSilent(`execute at ${player.username} run summon item ~ ~1 ~ {Item:{id:"kubejs:sublime_seed_stash",count:1},PickupDelay:40s}`)
			player.server.runCommandSilent(`execute at ${player.username} run summon item ~ ~1 ~ {Item:{id:"kubejs:prodigious_seed_stash",count:1},PickupDelay:40s}`)
		})
	})

	BlockEvents.broken(event => {
		const player = event.player
		const block = event.block
		if (!player.tags.contains('DoomYourLand') || String(event.level.dimension) != `minestuck:land_${String(player.username).toLowerCase()}`) return
		player.server.runCommandSilent(`execute in ${event.level.dimension} run summon minecraft:tnt ${block.x + 0.5} ${block.y} ${block.z + 0.5}`)
	})

	const VAULT_SEEDS = [
		'minecraft:wheat_seeds', 'minecraft:pumpkin_seeds', 'minecraft:melon_seeds', 'minecraft:beetroot_seeds', 'farmersdelight:rice', 'farmersdelight:cabbage_seeds', 'farmersdelight:tomato_seeds', 'minecraft:carrot', 'minecraft:potato',
		'minecraft:poppy', 'minecraft:dandelion', 'minecraft:blue_orchid', 'minecraft:allium', 'minecraft:pink_tulip', 'minecraft:lily_of_the_valley', 'minecraft:cornflower', 'minecraft:oxeye_daisy', 'minecraft:azure_bluet',
		'minecraft:sunflower', 'minecraft:lilac', 'minecraft:rose_bush', 'minecraft:peony', 'biomeswevegone:delphinium', 'biomeswevegone:tall_prairie_grass', 'biomeswevegone:foxglove', 'biomeswevegone:tall_beach_grass', 'biomeswevegone:cattail_sprout'
	]

	BlockEvents.broken('kubejs:seed_vault', event => {
		const player = event.player
		const block = event.block
		if (!player || !player.tags.contains('Exporter')) return
		player.server.runCommandSilent(`execute in ${event.level.dimension} run setblock ${block.x} ${block.y} ${block.z} air`)
		VAULT_SEEDS.forEach(id => player.server.runCommandSilent(`execute in ${event.level.dimension} run summon item ${block.x + 0.5} ${block.y + 0.5} ${block.z + 0.5} {Item:{id:"${id}",count:1}}`))
		player.server.runCommandSilent(`execute in ${event.level.dimension} run particle minecraft:explosion_emitter ${block.x + 0.5} ${block.y + 0.5} ${block.z + 0.5} 0 0 0 0 1 force`)
		event.cancel()
	})

	function whisper(event) {
		const player = event.player
		if (!player || !player.isPlayer() || Math.random() >= 0.1) return
		let types = []
		let message = ''
		let color = ''
		if (player.tags.contains('BreathTaker')) {
			types = ['minestuck:salamander', 'minestuck:turtle', 'minestuck:iguana', 'minestuck:nakagator']
			message = 'You hear bored consorts nearby'
			color = COLORS.breath
		}
		if (player.tags.contains('RhiannonStays')) {
			types = ['minestuck:salamander', 'minestuck:turtle', 'minestuck:iguana', 'minestuck:nakagator']
			message = 'You hear consorts arguing nearby'
			color = COLORS.blood
		}
		if (player.tags.contains('LearnedTruth')) {
			types = ['minestuck:salamander', 'minestuck:turtle', 'minestuck:iguana', 'minestuck:nakagator', 'minestuck:imp', 'irons_spellbooks:priest', 'irons_spellbooks:pyromancer', 'irons_spellbooks:apothecarist', 'discerning_the_eldritch:electromancer', 'hazennstuff:electromancer', 'irons_spellbooks:archevoker']
			message = "They're eyeing you. They know what you did."
			color = COLORS.rage
		}
		if (message == '') return
		let near = false
		player.level.getEntitiesWithin(AABB.of(player.x - 32, player.y - 32, player.z - 32, player.x + 32, player.y + 32, player.z + 32)).forEach(entity => {
			if (types.includes(String(entity.type)) && (entity.x - player.x) * (entity.x - player.x) + (entity.y - player.y) * (entity.y - player.y) + (entity.z - player.z) * (entity.z - player.z) <= 1024) near = true
		})
		if (near) player.setStatusMessage(Text.of(message).color(color))
	}

	BlockEvents.broken(event => whisper(event))
	BlockEvents.placed(event => whisper(event))

	function playMicrophones(server, loop) {
		const microphones = server.persistentData.getCompound('Microphones')
		if (server.persistentData.getString('MicrophoneLoop') != loop || microphones.isEmpty()) return
		const note = [6, 10, 13][Math.floor(Math.random() * 3)]
		microphones.getAllKeys().forEach(key => {
			const pos = String(key).split(' ')
			const x = Number(pos[1]) + 0.5
			const y = Number(pos[2])
			const z = Number(pos[3]) + 0.5
			let listening = false
			server.players.forEach(player => {
				if (String(player.level.dimension) == pos[0] && (player.x - x) * (player.x - x) + (player.y - y) * (player.y - y) + (player.z - z) * (player.z - z) <= 1024) listening = true
			})
			if (!listening) return
			server.getLevel(pos[0]).getEntitiesWithin(AABB.of(x - 16, y - 16, z - 16, x + 16, y + 16, z + 16)).forEach(entity => {
				if (!entity.tags.contains('BandMember') || (entity.x - x) * (entity.x - x) + (entity.y - y) * (entity.y - y) + (entity.z - z) * (entity.z - z) > 256) return
				server.runCommandSilent(`execute in ${pos[0]} run playsound minecraft:block.note_block.flute record @a ${entity.x.toFixed(2)} ${entity.y.toFixed(2)} ${entity.z.toFixed(2)} 2 ${Math.pow(2, (note - 12) / 12).toFixed(3)}`)
				server.runCommandSilent(`execute in ${pos[0]} run particle minecraft:note ${entity.x.toFixed(2)} ${(entity.y + entity.bbHeight + 0.5).toFixed(2)} ${entity.z.toFixed(2)} ${(note / 24).toFixed(3)} 0 0 1 0`)
			})
		})
		server.scheduleInTicks(10, () => playMicrophones(server, loop))
	}

	function startMicrophones(server) {
		const loop = String(Math.random())
		server.persistentData.putString('MicrophoneLoop', loop)
		playMicrophones(server, loop)
	}

	ServerEvents.loaded(event => startMicrophones(event.server))

	BlockEvents.rightClicked('kubejs:stage_platform', event => {
		const player = event.player
		const target = event.block.up
		if (event.hand != 'MAIN_HAND' || player.mainHandItem.id != 'kubejs:microphone' || !player.tags.contains('BandOfTheLand') || target.id != 'minecraft:air') return
		const microphones = event.server.persistentData.getCompound('Microphones')
		const key = `${event.level.dimension} ${target.x} ${target.y} ${target.z}`
		if (microphones.contains(key)) return
		event.server.runCommandSilent(`execute in ${event.level.dimension} run summon minecraft:item_display ${target.x + 0.5} ${target.y + 0.5} ${target.z + 0.5} {item:{id:"kubejs:microphone",count:1},Tags:["PlacedMicrophone"],Rotation:[${(player.yaw + 180).toFixed(1)}f,0f]}`)
		event.server.runCommandSilent(`execute in ${event.level.dimension} run summon minecraft:interaction ${target.x + 0.5} ${target.y} ${target.z + 0.5} {width:0.6f,height:1f,response:1b,Tags:["PlacedMicrophone"]}`)
		microphones.putBoolean(key, true)
		event.server.persistentData.put('Microphones', microphones)
		player.mainHandItem.shrink(1)
		player.swing()
		startMicrophones(event.server)
		event.cancel()
	})

	ItemEvents.entityInteracted(event => {
		const target = event.target
		if (event.hand != 'MAIN_HAND' || String(target.type) != 'minecraft:interaction' || !target.tags.contains('PlacedMicrophone')) return
		const x = Math.floor(target.x)
		const y = Math.floor(target.y)
		const z = Math.floor(target.z)
		const microphones = event.server.persistentData.getCompound('Microphones')
		microphones.remove(`${event.level.dimension} ${x} ${y} ${z}`)
		event.server.persistentData.put('Microphones', microphones)
		event.level.getEntitiesWithin(AABB.of(x, y, z, x + 1, y + 2, z + 1)).forEach(entity => {
			if (entity.tags.contains('PlacedMicrophone')) entity.discard()
		})
		event.player.give('kubejs:microphone')
		event.player.swing()
		event.cancel()
	})
	function revealTruth(player, lines, line) {
		if (line == lines.length) {
			player.setStatusMessage(Text.of('You wiped out an entire community. You monster.').color(COLORS.rage))
			return
		}
		player.setStatusMessage(Text.of(lines[line]).color(COLORS.rage))
		player.server.scheduleInTicks(60, () => revealTruth(player, lines, line + 1))
	}

	function hitName(player, target) {
		const name = String(player.persistentData.getCompound('HitNames').getString(target))
		if (name == '') return target
		return name
	}
})()
