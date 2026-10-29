(() => {
	const $LivingChangeTargetEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingChangeTargetEvent')
	const $LivingIncomingDamageEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent')

	const GRIST = '50000 minestuck:build 30000 minestuck:amber 30000 minestuck:caulk 30000 minestuck:chalk 30000 minestuck:iodine 30000 minestuck:shale 30000 minestuck:tar 20000 minestuck:cobalt 20000 minestuck:marble 20000 minestuck:mercury 20000 minestuck:quartz 20000 minestuck:sulfur 12000 minestuck:amethyst 12000 minestuck:garnet 12000 minestuck:ruby 12000 minestuck:rust 6000 minestuck:diamond 6000 minestuck:gold 6000 minestuck:uranium 1000 minestuck:zillium'

	const DENIZENS = {
		breath: {
			name: 'Aos Sí', color: '#0086EB', type: 'cataclysm:maledictus', scale: 5, sound: 'cataclysm:maledictus_idle',
			door: [1692, 11, 47], summon: [1692, 44, 18],
			intro: ['Hero of Breath.', 'I am Aos Sí, the Denizen of this land.'],
			waiting: ['Come back later.'],
			ready: ['Have you tasted it?', 'Freedom?', "It feels nice here, but you are not truly free until you've escaped our universe, are you?", 'And for your consorts living here, they will never be truly free whilst stuck in this universe as well.', 'In order to let you leave, I must ask you to make a choice.', 'Will you prioritise your own Freedom?', 'Or your consorts?']
		},
		light: {
			name: 'Lugh', color: '#f98100', type: 'mowziesmobs:umvuthi', scale: 5, sound: 'mowziesmobs:umvuthi.idle',
			door: [1692, 11, -14], summon: [1692, 44, -43],
			intro: ['Salutations, Hero of Light.', 'It is I, Lugh.'],
			waiting: ['Come back later.'],
			ready: ['Oh how lucky you are.', 'How many diamonds did it take?', 'Now, how about a use for these coins.', 'I can turn each coin into ink, the knowledge to write spells.', 'Or you can trade them for Boondollars, and never know the knowledge inside.']
		},
		time: {
			name: 'Cat-Sith', color: '#ff2106', type: 'cataclysm:netherite_monstrosity', scale: 3, sound: 'cataclysm:monstrositystep', nbt: 'is_Awaken:1b',
			door: [1692, 11, -75], summon: [1692, 44, -104],
			intro: ["Hero of Time. I've been expecting you.", 'The creatures of this land call me Cat-Sith.'],
			waiting: ['You are still on your quest. We will meet at another time.'],
			ready: ["I thought you would've come sooner.", 'I must now offer you a choice.', 'You have had many great adventures in this world, but also many unfortunate consequences.', 'In truth, every time you died, I placed a version of you from a different timeline in your place, and teleported you home.', 'Face them, and time will hurry for you. Look away, and you will learn to slip past what killed them.', "Do you wish to see the bodies you're responsible for?"]
		},
		space: {
			name: 'Dea Matrona', color: '#8a8a8a', type: 'cataclysm:ender_guardian', scale: 4, sound: 'hazennstuff:terraprisma_casting',
			door: [1692, 11, -136], summon: [1692, 44, -165],
			intro: ['Welcome, Hero of Space.', 'I am Dea Matrona.'],
			waiting: ['You are still continuing your quest. Come back later.'],
			ready: ['I see you have completed your quest. Well done.', 'As the Denizen of this land, I must now offer you a choice.', 'I can give you 1 specific Universal Frog Material, anything you want.', 'Or, I can give you the ability to create new frogs whenever you want.']
		},
		life: {
			name: 'Cainte', color: '#77c350', type: 'bosses_of_mass_destruction:void_blossom', scale: 2.5, sound: 'bosses_of_mass_destruction:void_blossom_hurt',
			door: [1692, 11, -197], summon: [1692, 44, -226],
			intro: ['Welcome~ Hero of Life~', 'I am Cainte, the Denizen of this land.'],
			waiting: ['Hm. Not yet.'],
			ready: ['You have done well to preserve as much as the life of this world as you can.', 'But the beauty of life is its ability to change and grow.', 'At the same time, life is fragile, short.', 'Will you allow me to preserve this Seed Vault, freezing it until the end of time...', 'or will you take it to the next world, and let it burst into life anew there?']
		},
		void: {
			name: 'Llyr', color: '#033476', type: 'cataclysm:the_leviathan', scale: 2, sound: 'cataclysm:leviathan_idle',
			door: [1692, 11, -258], summon: [1692, 44, -287],
			intro: ['Leave.'],
			waiting: ['I said. Leave.'],
			ready: ['...', 'So you found it.', 'An obscured truth of this world.', "I can reveal it. But there's no going back.", 'Or let it stay hidden, as I have.']
		},
		heart: {
			name: 'Litavis', color: '#bd1864', type: 'bosses_of_mass_destruction:gauntlet', scale: 3, health: 2500, sound: 'bosses_of_mass_destruction:comet_shoot',
			door: [1692, 11, -319],
			hands: [{ tag: 'LeftHand', name: 'Llydaw', killed: 'LeftDenizenKilled', pos: [1688, 48, -348] }, { tag: 'RightHand', name: 'Letau', killed: 'RightDenizenKilled', pos: [1696, 48, -348] }],
			intro: ['Hero of Heart.', 'We are Litavis. We are the Denizen of this Land.', 'Should you have completed your quest...'],
			waiting: ['We will offer you a choice.'],
			ready: ['Ah, so you have. We thank you.', 'We have been watching you.', "We have observed parts of yourself even you don't notice.", 'Do you accept yourself as you are, or do you reject yourself, and let something else take root?']
		},
		hope: {
			name: 'Besenclae', color: '#FFE094', type: 'cataclysm:ancient_remnant', scale: 2.5, sound: 'cataclysm:remnant_idle', nbt: 'has_necklace:1b',
			door: [1692, 11, -380], summon: [1692, 44, -409],
			intro: ['Hm. Do I hear something...?'],
			waiting: ["No. My imagination. I can't hear the music."],
			ready: ['I can hear it!~ The music... how beautiful the performance must have been.', 'Well done, Hero of Hope.', 'You have done well to inspire the people of this land through music.', 'Now, will you leave your music here, so the people of this land never stop playing?', 'Or will you take it into the next world, where your music will draw in new bandmates?']
		},
		doom: {
			name: 'Donn', color: '#20401f', type: 'cataclysm:the_harbinger', scale: 5, sound: 'cataclysm:harbinger_charge', nbt: 'Is_Act:1b',
			door: [1692, 11, -441], summon: [1692, 44, -470],
			intro: [],
			waiting: ['...'],
			ready: ["There's too many of them, aren't there?", 'The bombs.', "No matter how many you defuse, there's always more on the horizon.", "It's only a matter of time before all the bombs explode once and for all.", 'I can give you an opportunity to stop it.', 'If you take a personal doom for yourself, I will prevent this one.', 'The choice is yours.']
		},
		rage: {
			name: 'Nuada', color: '#9c4dad', type: 'mowziesmobs:frostmaw', scale: 2.5, sound: 'mowziesmobs:frostmaw.breath2', nbt: 'alwaysActive:1b',
			door: [1692, 11, -502], summon: [1692, 44, -531],
			intro: ['HERO.'],
			waiting: ['YOU ARE NOT READY.'],
			ready: ['YOUR HITLIST CONTAINED THE NAMES OF SEVERAL NOTABLE BEINGS THROUGHOUT THIS LAND. ALL SEEMINGLY DISCONNECTED.', 'I CAN OFFER YOU A CHOICE.', 'LEARN THE TRUTH OF YOUR KILLINGS.', 'OR EMBRACE THE RAGE THAT FUELED THEM.']
		},
		mind: {
			name: 'Ecne', color: '#46fbc4', type: 'bosses_of_mass_destruction:obsidilith', scale: 5, sound: 'bosses_of_mass_destruction:obsidilith_prepare_attack',
			door: [1692, 11, -563], summon: [1692, 44, -592],
			intro: ['--System Rebooting, Ecne.ska--', 'Welc0me Her0 of M1nd.', 'Please scan [SCROLL OF QUEST COMPLETION]'],
			waiting: ['--SCAN FAILED. Shutting down...--'],
			ready: ['--SCAN COMPLETE!--', 'Decisions. These are the building blocks of a person.', 'I have a [PROPOSITION]', 'Do you want [MORE TIME TO THINK]', 'or the ability to [MAKE DECISIONS FASTER]']
		},
		blood: {
			name: 'Rhiannon', color: '#BA1915', type: 'cataclysm:ignis', scale: 5, sound: 'mowziesmobs:wroughtnaut.grunt2',
			door: [1692, 11, -624], summon: [1692, 44, -653],
			intro: ['...Hero of Blood.'],
			waiting: ['I see discord in this land. Hatred. Vitriol.'],
			ready: ['You have done it.', 'United the creatures of this land. Well done.', 'But just like glass, unity can be shattered in an instant.', 'I can leave this dungeon and take care of the unity to ensure it lasts till the end of time.', 'Or we can resign to the fragility of it and let society play out how it does.']
		}
	}
	const talking = {}

	function inVeil(entity) {
		return String(entity.level.dimension) == 'minestuck:veil'
	}

	function aspectOf(entity) {
		return Object.keys(DENIZENS).find(aspect => entity.tags.contains(`${aspect}_denizen`))
	}

	function bodiesOf(aspect) {
		if (DENIZENS[aspect].hands) return DENIZENS[aspect].hands
		return [{ tag: `${aspect}_denizen`, name: DENIZENS[aspect].name, killed: 'DenizenKilled', pos: DENIZENS[aspect].summon }]
	}

	function teleportSound(player) {
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound minecraft:custom.steps player @p ~ ~ ~`)
	}

	function stopFightMusic(entity, sound) {
		entity.server.runCommandSilent(`execute in ${String(entity.level.dimension)} positioned ${entity.x.toFixed(2)} ${entity.y.toFixed(2)} ${entity.z.toFixed(2)} as @a[distance=..100] run stopsound @s record ${sound}`)
	}

	function drop(entity, item) {
		entity.server.runCommandSilent(`execute in ${String(entity.level.dimension)} run summon item ${entity.x.toFixed(2)} ${(entity.y + 1).toFixed(2)} ${entity.z.toFixed(2)} {Item:{id:"${item}",count:1},Glowing:1b}`)
	}

	function near(level, pos, radius) {
		const found = []
		level.getEntitiesWithin(AABB.of(pos[0] - radius, pos[1] - radius, pos[2] - radius, pos[0] + radius, pos[1] + radius, pos[2] + radius)).forEach(entity => found.push(entity))
		return found
	}

	function say(player, aspect, line) {
		const denizen = DENIZENS[aspect]
		const message = Text.of(denizen.name.toUpperCase()).color(denizen.color).append(Text.white(': '))
		line.split('**').forEach((part, i) => message.append(Text.of(part).color(denizen.color).bold(i % 2 == 1)))
		player.tell(message)
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound ${denizen.sound} hostile @s`)
	}

	function dismiss(player) {
		player.removeTag('DenizenActive')
		if (!inVeil(player)) return
		near(player.level, [player.x, player.y, player.z], 100).forEach(entity => {
			if (entity.tags.contains(`DenizenOf_${player.username}`)) entity.discard()
		})
		if (!player.tags.contains('light')) return
		near(player.level, DENIZENS.light.summon, 50).forEach(entity => {
			if (['mowziesmobs:umvuthana', 'mowziesmobs:umvuthana_crane'].includes(String(entity.type))) entity.discard()
		})
	}

	function rhiannonComes(player) {
		const rhiannon = DENIZENS.blood
		player.removeTag('RhiannonComing')
		player.server.scheduleInTicks(20, () => {
			player.server.runCommandSilent(`execute at ${player.username} run summon ${rhiannon.type} ~ ~ ~ {PersistenceRequired:1b,Tags:["RhiannonOf_${player.username}","PassiveRhiannon"],CustomName:'{"text":"${rhiannon.name}","color":"${rhiannon.color}"}',attributes:[{id:"minecraft:generic.max_health",base:5000d},{id:"minecraft:generic.scale",base:${rhiannon.scale}d}],Health:5000f}`)
			player.server.runCommandSilent(`effect give @e[tag=RhiannonOf_${player.username}] minecraft:weakness infinite 255 true`)
			player.server.runCommandSilent(`effect give @e[tag=RhiannonOf_${player.username}] minecraft:resistance infinite 255 true`)
			teleportSound(player)
		})
	}

	Object.keys(DENIZENS).forEach(aspect => {
		BlockEvents.rightClicked(`kubejs:${aspect}0`, event => {
			const player = event.player
			const door = DENIZENS[aspect].door
			const pos = player.persistentData.getCompound('PreDenizen')
			if (event.hand != 'MAIN_HAND') return
			if (player.tags.contains('DenizenActive')) dismiss(player)
			if (inVeil(player)) {
				if (player.persistentData.contains('PreDenizen')) {
					player.persistentData.remove('PreDenizen')
					player.server.scheduleInTicks(1, () => {
						player.teleportTo(String(pos.getString('dimension')), pos.getDouble('x'), pos.getDouble('y'), pos.getDouble('z'), pos.getDouble('yaw') + 180, pos.getDouble('pitch'))
						teleportSound(player)
					})
				}
				if (player.tags.contains('RhiannonComing')) rhiannonComes(player)
				player.swing()
				event.cancel()
				return
			}
			pos.putString('dimension', String(player.level.dimension))
			pos.putDouble('x', player.x)
			pos.putDouble('y', player.y)
			pos.putDouble('z', player.z)
			pos.putDouble('yaw', player.yaw)
			pos.putDouble('pitch', player.pitch)
			player.persistentData.put('PreDenizen', pos)
			player.server.scheduleInTicks(1, () => {
				player.teleportTo('minestuck:veil', door[0] + 0.5, door[1], door[2] + 0.5, 180, 0)
				teleportSound(player)
			})
			if (aspect == 'mind') {
				player.server.scheduleInTicks(20, () => {
					for (let x = 1672; x <= 1704; x += 16) {
						for (let z = -609; z <= -577; z += 16) player.level.getBlock(x, 44, z).id
					}
					player.server.runCommandSilent('execute in minestuck:veil run fill 1672 44 -578 1709 51 -609 air')
				})
			}
			if (player.tags.contains(aspect) && !player.tags.contains('DenizenKilled')) {
				player.server.scheduleInTicks(20, () => {
					const denizen = DENIZENS[aspect]
					let health = 5000
					let extraNbt = ''
					if (!inVeil(player)) return
					if (denizen.health) health = denizen.health
					if (denizen.nbt) extraNbt = ',' + denizen.nbt
					bodiesOf(aspect).forEach(body => {
						if (player.tags.contains(body.killed)) return
						if (near(player.level, body.pos, 100).some(entity => entity.tags.contains(`${aspect}_denizen`) && entity.tags.contains(body.tag))) return
						player.level.getBlock(body.pos[0], body.pos[1], body.pos[2]).id
						player.server.runCommandSilent(`execute in minestuck:veil run summon ${denizen.type} ${body.pos[0]} ${body.pos[1]} ${body.pos[2]} {NoAI:1b,PersistenceRequired:1b,Rotation:[180f,0f],Tags:["Dormant","${aspect}_denizen","${body.tag}","DenizenOf_${player.username}"],CustomName:'{"text":"${body.name}","color":"${denizen.color}"}',attributes:[{id:"minecraft:generic.max_health",base:${health}d},{id:"minecraft:generic.scale",base:${denizen.scale}d}],Health:${health}f${extraNbt}}`)
						player.addTag('DenizenActive')
					})
					if (aspect != 'heart') return
					player.server.runCommandSilent('team add Litavis')
					player.server.runCommandSilent('team modify Litavis friendlyFire false')
					player.server.runCommandSilent('execute in minestuck:veil run team join Litavis @e[tag=heart_denizen]')
				})
			}
			player.swing()
			event.cancel()
		})

		BlockEvents.rightClicked(`kubejs:${aspect}_pedestal`, event => {
			const player = event.player
			const block = event.block
			const denizen = DENIZENS[aspect]
			const ready = player.inventory.count(`kubejs:${aspect}_scroll`) > 0
			let lines = denizen.intro.concat(denizen.waiting)
			if (ready) lines = denizen.intro.concat(denizen.ready)
			if (event.hand != 'MAIN_HAND' || !player.tags.contains(aspect) || player.tags.contains('ChoiceReceived') || player.tags.contains('DenizenKilled') || talking[player.username]) return
			talking[player.username] = true
			player.server.scheduleInTicks(1, () => player.teleportTo(String(player.level.dimension), block.x + 0.5, block.y, block.z - 3.5, 0, -15))
			player.server.runCommandSilent(`effect give ${player.username} cataclysm:stun 1 0 true`)
			lines.forEach((line, i) => {
				player.server.scheduleInTicks(i * 80, () => {
					say(player, aspect, line)
					if (i < lines.length - 1) return
					delete talking[player.username]
					if (!ready) return
					player.give(`kubejs:${aspect}_choice`)
					player.addTag('ChoiceReceived')
				})
			})
			player.swing()
			event.cancel()
		})
	})

	EntityEvents.beforeHurt(event => {
		const entity = event.entity
		const player = event.source.player
		const aspect = aspectOf(entity)
		if (!aspect || !entity.tags.contains('Dormant') || ['genericKill', 'outOfWorld'].includes(String(event.source.getType()))) return
		if (!player || !player.tags.contains(aspect)) {
			event.cancel()
			return
		}
		player.server.runCommandSilent(`execute at ${player.username} run tag @e[tag=${aspect}_denizen,distance=..100] remove Dormant`)
		if (aspect == 'heart') player.server.runCommandSilent(`execute at ${player.username} as @e[tag=heart_denizen,distance=..100] run data merge entity @s {NoAI:0b,isAggroed:1b}`)
		else player.server.runCommandSilent(`execute at ${player.username} as @e[tag=${aspect}_denizen,distance=..100] run data merge entity @s {NoAI:0b}`)
		if (aspect == 'rage' || aspect == 'heart') {
			player.server.runCommandSilent(`execute at ${player.username} as @e[tag=${aspect}_denizen,distance=..100] run attribute @s minecraft:generic.scale base set 1`)
			player.server.runCommandSilent(`execute at ${player.username} at @e[tag=${aspect}_denizen,distance=..100] run particle minecraft:explosion_emitter ~ ~ ~`)
			player.server.runCommandSilent(`execute at ${player.username} at @e[tag=${aspect}_denizen,distance=..100] run playsound minecraft:entity.generic.explode hostile @a ~ ~ ~`)
		}
		player.server.runCommandSilent(`execute at ${player.username} run stopsound @a[distance=..100] music`)
		player.server.runCommandSilent(`execute at ${player.username} run stopsound @a[distance=..100] record`)
		player.server.runCommandSilent(`execute at ${player.username} as @a[distance=..100] at @s run playsound cataclysm:maledictus_music record @s ~ ~ ~ 10000`)
		if (aspect == 'heart') say(player, aspect, 'You dare to challenge us?')
		else say(player, aspect, 'You dare to challenge me?')
	})

	EntityEvents.death(event => {
		const entity = event.entity
		const killer = event.source.player
		const aspect = aspectOf(entity)
		if (entity.isPlayer()) {
			if (entity.tags.contains('DenizenActive') && inVeil(entity)) dismiss(entity)
			return
		}
		if (!aspect) return
		const body = bodiesOf(aspect).find(part => entity.tags.contains(part.tag))
		if (!body) return
		if (aspect == 'heart') {
			if (!killer || !killer.tags.contains('heart') || !entity.tags.contains(`DenizenOf_${killer.username}`)) return
			killer.addTag(body.killed)
			if (!killer.tags.contains('LeftDenizenKilled') || !killer.tags.contains('RightDenizenKilled')) return
			killer.addTag('DenizenKilled')
			killer.server.runCommandSilent(`grist add ${killer.username} ${GRIST}`)
			stopFightMusic(entity, 'cataclysm:maledictus_music')
			entity.server.scheduleInTicks(60, () => {
				drop(entity, 'kubejs:hoard_expulsor')
				drop(entity, 'kubejs:made_choice')
			})
			return
		}
		entity.server.players.forEach(player => {
			if (!entity.tags.contains(`DenizenOf_${player.username}`)) return
			player.addTag(body.killed)
			player.server.runCommandSilent(`grist add ${player.username} ${GRIST}`)
		})
		stopFightMusic(entity, 'cataclysm:maledictus_music')
		drop(entity, 'kubejs:hoard_expulsor')
		drop(entity, 'kubejs:made_choice')
	})

	function bothHands(entity, other) {
		return entity.type == 'bosses_of_mass_destruction:gauntlet' && other.type == 'bosses_of_mass_destruction:gauntlet'
	}

	NativeEvents.onEvent($LivingChangeTargetEvent, event => {
		const hand = event.getEntity()
		const target = event.getNewAboutToBeSetTarget()
		if (!target || !bothHands(hand, target)) return
		event.setNewAboutToBeSetTarget(hand.level.getNearestPlayer(hand, 64))
	})

	NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
		const attacker = event.getSource().actual
		if (attacker && bothHands(event.getEntity(), attacker)) event.setCanceled(true)
	})

	EntityEvents.spawned(DENIZENS.blood.type, event => {
		if (!event.entity.tags.contains('PassiveRhiannon')) return
		event.entity.targetSelector.removeAllGoals(goal => true)
		event.entity.setTarget(null)
	})

	PlayerEvents.respawned(event => {
		if (event.player.tags.contains('RhiannonComing')) rhiannonComes(event.player)
	})
})()
