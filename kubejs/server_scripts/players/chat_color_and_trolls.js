(() => {
	const $PlayerData = Java.loadClass('com.mraof.minestuck.player.PlayerData')
	const $MSAttachments = Java.loadClass('com.mraof.minestuck.util.MSAttachments')
	const $PlayerColorPackets = Java.loadClass('com.mraof.minestuck.network.PlayerColorPackets')
	const $Double = Java.loadClass('java.lang.Double')
	const $Integer = Java.loadClass('java.lang.Integer')
	const $EntityInteractSpecific = Java.loadClass('net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteractSpecific')

	PlayerEvents.chat(event => {
		const player = event.player
		const color = $PlayerData.get(player).get().getData($MSAttachments.PLAYER_COLOR)
		const grimdark = player.tags.contains('Grimdark')
		let chatColor = Color.rgba((color >> 16) & 255, (color >> 8) & 255, color & 255, 255)
		if (grimdark) chatColor = '#322559'
		event.server.tell(player.getDisplayName().color(chatColor).obfuscated(grimdark)
			.append(Text.of(': ').color(Color.WHITE).obfuscated(false))
			.append(event.getComponent().color(chatColor).obfuscated(grimdark)))
		event.cancel()
	})

	ServerEvents.commandRegistry(event => {
		const Commands = event.commands
		const Arguments = event.arguments
		event.register(Commands.literal('sburb_color')
			.then(Commands.argument('r', Arguments.INTEGER.create(event))
				.then(Commands.argument('g', Arguments.INTEGER.create(event))
					.then(Commands.argument('b', Arguments.INTEGER.create(event))
						.executes(ctx => {
							const player = ctx.source.player
							const color = $Integer.valueOf($Double.valueOf(Math.round((Arguments.INTEGER.getResult(ctx, 'r') << 16) + (Arguments.INTEGER.getResult(ctx, 'g') << 8) + Arguments.INTEGER.getResult(ctx, 'b'))).intValue())
							$PlayerData.get(player).get().setData($MSAttachments.PLAYER_COLOR.get(), color)
							player.connection.send(new $PlayerColorPackets.Data(color))
							return 1
						})))))
	})

	const TROLLS = {
		'GA': { handle: 'grimoireAcademics', color: '#a10000', name: 'Grymla Atalas', title: 'Witch of Time',
			lore: "I was asked to write an entry for myself. This has been harder than all the others put together, and this is the ninth draft. I am the Witch of Time. I am very good at books and very bad at people. I like riddles and puzzles too, I suppose. On my arm is a tattoo of a dragon eating its own tail, and written into it, in my people’s language, is the task I was born to: preserve all of the world’s knowledge. I know this is impossible. I have chosen not to let that stop me. As a rustblood I have less time than most, and I have spent most of it on a future I will never see. These tomes are what I have to show for it. I was late once before. I promised myself I would never be again." },
		'UU': { handle: 'unctuousUndertaking', color: '#824d18', name: 'Shleez Yubolt', title: 'Maid of Doom',
			lore: "I always found the Maid of Doom hard to read. Back on our planet she drove for Gruber, taking any fare she could get to make rent. It became her entire life, to the point where she rates her own mood out of five stars. I was told she smells like cigarettes before I ever met her, and my nose has since confirmed it. She is very hard to get to know. I suspect she is lonely, though she may be fine with that. Shleez built her life out of limits: a fare, a route, a rating, and a door that closes once you’ve paid. Nothing gets in that she hasn’t allowed. Doom players are supposed to understand how things end. I think she understood how ours would end before any of us did, and didn’t believe we’d listen if she said so. She was probably right about that too." },
		'f(x)': { handle: 'ferocious(xeriscape)', color: '#bf9000', name: 'Shonne Revelt', title: 'Rogue of Hope',
			lore: "The Rogue of Hope sings for Rust Velvet, a five-member idol group made up entirely of lowbloods, under the stage name Seungwannie. Before that she competed on a survival show and was voted off, which apparently happens to almost everyone. Her voice is extraordinary, and that one I can vouch for personally. Shonne stands under the stage lights, pours all of her Hope into an audience that barely knows her name, and goes home with nothing left. She did the same for us during the session. None of us thought to give any back." },
		'FR': { handle: 'flippantRockstarring', color: '#b4eb54', name: 'Niquel Frette', title: 'Sylph of Breath',
			lore: "The Sylph of Breath makes coffee for a living. He would like it recorded that this is temporary, so: it is temporary. He is going to be a rockstar. Every hour he isn’t behind the counter goes into practice, and he will play for anyone who stands still long enough. I have stood still for him several times. He is better than he thinks, and louder than he needs to be. He has spent his whole life refusing to be what anyone expected of a limeblood. A long time ago, someone told him there was something about him worth noticing, and he has carried that around ever since, which is very sweet. Breath players are supposed to carry everyone else along with them. Niquel was always too busy working out where he was going to notice the rest of us waiting for the wind." },
		'ST': { handle: 'sultryTwostep', color: '#82ab70', name: 'Maramm Serrix', title: 'Bard of Space',
			lore: "I am going to try to be objective about the Bard of Space. I will fail. Maramm is awkward to a degree I find genuinely impressive, and coming from me, that means something. She talks so fast that half of each sentence arrives after she has moved on to the next one. She collects trinkets, oddments, gizmos and whatsits, and she can tell you where every one of them came from. She holds on to everything she can touch, as though she could keep the whole of Space together by herself. She cannot understand why I care so much about tomorrow, and I cannot understand why she cares so much about now. One of us should have been listening to the other. I still haven’t decided which." },
		'PY': { handle: 'plasticineYpsiliform', color: '#009f4f', name: 'Abrill Tricot', title: 'Knight of Life',
			lore: "The Knight of Life wants to be the best, by her own standards, which are harsher than anything the rest of us could come up with. By those standards she has to be the finest troll in the world at every moment, and she carries herself as though she is. I don’t think she has ever actually felt it. Nothing she does is openly cruel, but there always seems to be a little something behind it. People tell me she is very beautiful, and perhaps people simply expect beautiful trolls to be up to something. Abrill wears success the way a Knight wears plate, polished and impressive and fastened tight over whatever she’d rather nobody saw. Her matespritship with Prytan is part of the armour. He makes her look like she’s winning." },
		'TK': { handle: 'tortfeasorsKatabasis', color: '#069a97', name: 'Prytan Harvud', title: 'Prince of Light',
			lore: "The Prince of Light will tell you, without being asked, that he is the coolest troll in whatever room he happens to be standing in. He is a proud brother of the house Delta Xi Delta. His abs were put there by electricity rather than effort, and he believes no one has noticed. Prytan has been praised for his confidence since the day he crawled out of the brooding caverns, and nobody has ever told him no. He hasn’t so much failed upward as been launched, and the session only sent him higher. He buried a lot of truths on the way up. I have wondered more than once whether one of them was the one we needed." },
		'DH': { handle: 'dredgedHermit', color: '#43587d', name: 'Ganlua Pestis', title: 'Mage of Void',
			lore: "As far as anyone can tell, the Mage of Void hadn’t opened her curtains in several sweeps before the session started. Her respiteblock is lit by one computer screen, and she likes it that way. I wish she had come out of her shell (and her hive, really) sooner. There were things she knew that none of us thought to ask her about. She is fully caught up on a certain enormously long animated serial about a stretchy young pirate and his crew. Do not ask her how many arcs are left. She will tell you." },
		'GS': { handle: 'growingSocialite', color: '#0a20d4', name: 'Protca Terpet', title: 'Page of Blood',
			lore: "The Page of Blood is very famous. I didn’t know this when we first met, and he seemed genuinely hurt. Protca runs one of the most-watched video channels on the planet, and a fair share of the trolls I pass in the street know his face better than their own lusus. Most of his videos involve handing cash to strangers on the condition that they hand even more to the next stranger. I asked him once where the money came from. He did not understand the question. He has millions of followers and very few real friends, and I don’t think he has noticed which of those numbers is the problem. He holds more influence than nearly anyone I have met, and he has never worked out what it’s for. Pages grow into their power eventually. We needed ours to do it a little faster." },
		'BJ': { handle: 'backsideJotter', color: '#3e0b78', name: 'Cliste Alleic', title: 'Heir of Mind',
			lore: "If you have ever felt watched while doing something entirely ordinary, you were probably right, and it was probably the Heir of Mind. Cliste can take the smallest scrap of information and follow it all the way to your hive, your quadrants and your daily routine. I find Cliste fascinating. There is no motive behind any of it, no grudge and no blackmail. They are simply collecting, and I recognise that impulse more than I would like to admit. By the end, they knew more about each of us than we knew about each other. I have never worked out what they saw coming." },
		'RG': { handle: 'ruthlessGanef', color: '#a64d9a', name: 'Marlyn Istiof', title: 'Thief of Rage',
			lore: "The Thief of Rage has the misfortune of having nothing to do. His caste provides everything he needs, so he drifts between his hive and the neighbourhood, comfortable and bored out of his mind. His one outlet is an underground boxing ring. Whether he uses his strife specibus within the rules is a question nobody in the crowd wants answered. His fights usually last a few seconds, and they love him for it. Thieves take their aspect from others, and I believe Marlyn takes the crowd’s. He pockets every shout for blood and lives on it, because his own life is far too soft to produce any rage of its own. That worked in the ring. It did not work nearly as well in the session." },
		'DD': { handle: 'devouringDevotion', color: '#4c1b35', name: 'Ricora Platgy', title: 'Seer of Heart',
			lore: "The Seer of Heart would like everyone to know that she does not like them. This is false. I tested it, extensively. She feels things so strongly that she has no idea where to put them, so she puts them nowhere and is cold to everyone instead. Very rarely, for very few trolls, the ice breaks, and underneath is one of the kindest people I have ever known. Her caste planned out her whole life before she pupated and handed her everything she ever wanted. You would expect that to spoil her. It made her bitter, because she never felt she had earned any of it or lived up to a single expectation. What she wants most is something that is hers because she made it. Seers are meant to see their aspect clearly enough to guide others by it, and for her, the seeing was always the hard part. I hope the game gave her some of that. I’m not sure there was time." }
	}

	const ASPECT_COLORS = { breath: 'aqua', mind: 'dark_aqua', void: 'dark_blue', space: 'dark_gray', doom: 'dark_green', heart: 'light_purple', blood: 'dark_red', hope: 'yellow', light: 'gold', life: 'green', time: 'red', rage: 'dark_purple' }

	const TROLLINGS = {
		'minecraft:story/enchant_item': { troll: 'GA', message: [
			"Hell☠.",
			"I hate t☠ be a b☠ther, but if I was you, I'd find s☠mewhere safer for that enchanting table y☠u made.",
			"Unguarded kn☠wledge is wasted knowledge, y☠u kn☠w. That is all.",
			"Until next we speak,",
			"- Grymla"
		] },
		'irons_spellbooks:irons_spellbooks/spell_book_equip': { troll: 'GA', message: [
			"Hell☠.",
			"I c☠ntinue t☠ find myself enthralled by y☠ur escapades, in spite ☠f h☠w little they have t☠ d☠ with me.",
			"In this regard, I congratulate y☠u. Y☠u make f☠r g☠☠d daytime televisi☠n.",
			"T☠ c☠nfess, when I said I hate t☠ be a b☠ther, I lied. I enj☠y b☠thering y☠u. ☠ur temp☠ral differential fascinates and bewilders me. That is all.",
			"Until next we speak,",
			"- Grymla"
		] },

		'minecraft:adventure/trade': { troll: 'UU', message: [
			"can i get ↺hhhhh number 9 large w 2 sides. thanks ★★★★★",
			"wait this isnt the takeout place? wtf ★★"
		] },
		'minestuck:minestuck/french_fry': { troll: 'UU', message: [
			"so are ↺ gonna get some for me or",
			"it wo↺ld be make me s↺per happy ★★★★★ yknow",
			"nah im kidding grymla explained the whole time difference thing",
			"i think i ↺nderstand",
			"but im so h↺ngryyyyyy",
			"hol on let me ask her again"
		] },

		'farmersdelight:main/place_campfire': { troll: 'f(x)', message: [
			"you know, my friend niquel used to always invite me to these parties~♪",
			"where he would sing by a campfire, playing his guitar to anyone who would listen.~♪",
			"whenever i sit by one these days, i cant help but cast my mind back to when things were much simpler~♪"
		] },
		'minestuck:minestuck/return_node': { troll: 'f(x)', message: [
			"you found a return node~!♪ good work~!♪",
			"once i learned these things could take you home, i kept finding and jumping in different ones~♪",
			"while crossing my fingers that one would eventually take me back to my dorm~!!!♪",
			"haha, i was pretty stupid"
		] },

		'minecraft:story/lava_bucket': { troll: 'FR', message: [
			"svp be careful with that bucket of hot lava mon petit pain",
			"would be in a bit of un piquel if you burn yourself. }:("
		] },
		'irons_spellbooks:irons_spellbooks/ink_root': { troll: 'FR', message: [
			"ah~ this was my chose préférée when we played",
			"sketching out my musique, using those uh",
			"how do you say",
			"fraymotif",
			"well then, salut!"
		] },

		'lootr:1cart': { troll: 'ST', message: [
			"look! look!",
			"they found θoMething!!! (|:B",
			"im a little diθθapointed... i could uθe that better than theM...",
			{ troll: 'GA', text: "Y☠ur speech t☠ text is ☠n." },
			"IT IS?",
			"",
			"im θorry!!! i didnt Mean it!!! proMiθe!!!"
		] },
		'minestuck:minestuck/double_digits': { troll: 'ST', message: [
			"hi!!!",
			"good job on ur echeladder!!!",
			"thatθ about aθ far aθ i ever got so...",
			"ur already doing better than Me!!!"
		] },

		'farmersdelight:main/get_rich_soil': { troll: 'PY', message: [
			"Overworld crops are so... disgusting. I can't believe You eat them.",
			{ troll: 'DH', text: "um.. you liked those peaches i alchemized..." },
			"Leave me alone, DH. I'm trYing to talk to the plaYer here.",
			{ troll: 'DH', text: "oh uh... sorry" }
		] },
		'minestuck:minestuck/alchemy': { troll: 'PY', message: [
			"You need to get to work this one, pronto.",
			"Looking at You... Girl, there's a lot to fix.",
			"Too bad we can't alchemize You a new face."
		] },

		'minecraft:adventure/shoot_arrow': { troll: 'TK', message: [
			"¶ You're really going to have to get much stronger if you want me to bother conversing with you.",
			"¶ I have no interest in δisgusting creatures such as yourself."
		] },
		'minestuck:minestuck/kill_ogre': { troll: 'TK', message: [
			"¶ Your strength is δecent, but your technique...",
			"¶ With that style of fighting, how do you expect to δefeat the §kxxxxxxx§r",
			"¶ Yo P why did it censor the worδ §kxxxxxxx§r",
			{ troll: 'GS', text: "DUDE. WE CANT TALK TO THEM ABOUT THAT YET. GRYMLA SAID." },
			"¶ Ohhh bruh for real?"
		] },

		'minecraft:adventure/avoid_vibration': { troll: 'DH', message: [
			"wow... you are narrowly avoiding an awful confrontation rn...",
			"oh... hope i'm not making it harder for you... with the text noises...",
			"i'll go now",
			"my bad"
		] },
		'mekanismgenerators:heat_generator': { troll: 'DH', message: [
			"you know. most of the time",
			"i sit in my hive with no lights on except my computer",
			"its comforting. in a way. gets cold though",
			"something like this wouldve been nice"
		] },

		'minestuck:minestuck/commune': { troll: 'GS', message: [
			"BRO IS POPULAR",
			"WE *NEED* TO COLLAB",
			"DO YOU HAVE TRITCH.TV TOO",
			"I HAVE A FREE PRIME I'LL SUB"
		] },
		'minecraft:story/mine_diamond': { troll: 'GS', message: ["LETSGOOOOOOOOOOOOO"] },

		'minecraft:adventure/sleep_in_bed': { troll: 'BJ', message: [
			"heheh. i seeee you.",
			"your bedsheets are kinda lame tho :)"
		] },
		'minestuck:minestuck/shady_buyer': { troll: 'BJ', message: [
			"haha... getting to see u on my viewport is so funny :)",
			"what you even doing rn :)",
			"buying stuff... interesting :)"
		] },

		'minecraft:husbandry/tactical_fishing': { troll: 'RG', message: ["dude That is my broTher in FISH. why would you DO THAT."] },
		'minestuck:minestuck/dungeon': { troll: 'RG', message: [
			"a dungeon huh. finally someThing worTh doing",
			"Those imps hiT preTTy sofT. you'll be fine —B)",
			"jusT dont Tell anyone if you geT knocked ouT. lol."
		] },

		'minecraft:husbandry/fishy_business': { troll: 'DD', message: [
			"i cannae. deal wi this.",
			"yer fishin up. me brothers. and sisters. oot here.",
			"that wee yin. was so. cute too."
		] },
		'minestuck:minestuck/halfway_point': { troll: 'DD', message: [
			"i never. really understood. the appeal. of the echeladder.",
			"whole thing. really p's. me off.",
			"i dinnae. need some. disembodied voice. wi a finger. up its butt. telling me. how well. im daein.",
			"i can. dae that myself. cheers."
		] }
	}

	function colored(text, color) {
		return Text.literal(text).color(color)
	}

	function white(text) {
		return Text.literal(text).white()
	}

	function playSound(player, sound) {
		player.server.runCommandSilent(`execute as ${player.username} at @s run playsound ${sound} master @s`)
	}

	function playerName(player) {
		const color = $PlayerData.get(player).get().getData($MSAttachments.PLAYER_COLOR)
		return Text.literal(player.getDisplayName().getString()).color(Color.rgba((color >> 16) & 255, (color >> 8) & 255, color & 255, 255))
	}

	function statusLine(initials, verb, name) {
		const troll = TROLLS[initials]
		return Text.empty()
			.append(white('-- '))
			.append(colored(troll.handle, troll.color))
			.append(white(' ['))
			.append(colored(initials, troll.color))
			.append(white(`] ${verb} trolling [`))
			.append(name)
			.append(white('] --'))
	}

	function messageLine(initials, line) {
		let speaker = initials
		let text = line
		if (line.troll) {
			speaker = line.troll
			text = line.text
		}
		return Text.empty()
			.append(colored(speaker, TROLLS[speaker].color))
			.append(white(': '))
			.append(colored(text, TROLLS[speaker].color))
	}

	Object.keys(TROLLS).forEach((initials, i) => {
		ItemEvents.rightClicked(`kubejs:lore_tome_${i + 1}`, event => {
			const troll = TROLLS[initials]
			if (event.hand != 'MAIN_HAND') return
			event.player.tell(Text.empty()
				.append(colored(troll.name, troll.color))
				.append(white(' - '))
				.append(colored(troll.title, ASPECT_COLORS[troll.title.split(' ')[2].toLowerCase()])))
			event.player.tell(Text.literal(troll.lore).gray())
			event.player.swing()
		})
	})

	const STATUE_LINES = {
		'GA': '☠h h☠w it was all s☠ much simpler. D☠n\'t y☠u agree, {player}?',
		'UU': 'd↺de i do not control the traffic if you give me a low rating i will r↺n you over',
		'f(x)': 'well. i cant say i was expecting lots of people to turn up to the fansign, but this is... erm...~♪',
		'FR': '*strums his guitar, singing mostly in tune*',
		'ST': 'this is where grymla and i met... θeemθ θo long ago now',
		'PY': 'This partY has to be a success. It must.',
		'TK': '¶ Your honour, this whole trial has been lame as hell. Can\'t you just δo me a solid?',
		'DH': '*she is staring into her monitor. you haven\'t really seen her blink*',
		'GS': 'WHATS UP GRUBTUBE WE ARE HERE AT TRITCHCON LETSGOOO POGS IN THE CHAT',
		'BJ': 'heheheh :) i love the mall :)',
		'RG': 'anoTher challenger defeaTed —B)',
		'DD': 'these blumming. charity shops. even they are. too spenny.'
	}
	NativeEvents.onEvent($EntityInteractSpecific, event => {
		const statue = event.getTarget()
		const player = event.getEntity()
		if (event.getLevel().isClientSide() || event.getHand() != 'MAIN_HAND' || statue.type != 'strawstatues:straw_statue') return
		const initials = Object.keys(TROLLS).find(key => statue.tags.contains(TROLLS[key].name.split(' ')[0]))
		if (!initials) return
		player.swing()
		player.tell(colored(STATUE_LINES[initials].replace('{player}', player.username), TROLLS[initials].color))
		event.setCanceled(true)
	})

	EntityEvents.drops(event => {
		const player = event.source.player
		const type = String(event.entity.type)
		let chance = 0
		if (type == 'minestuck:imp') chance = 0.005
		if (type == 'minestuck:ogre') chance = 0.015
		if (type == 'minestuck:basilisk') chance = 0.05
		if (type == 'minestuck:lich') chance = 0.1
		if (chance == 0 || !player || !player.tags.contains('time') || Math.random() >= chance) return
		event.addDrop(`kubejs:lore_tome_${Math.floor(Math.random() * 12) + 1}`)
	})

	const busyUntil = {}

	PlayerEvents.advancement(event => {
		const trolling = TROLLINGS[String(event.advancement.id)]
		const player = event.player
		const server = player.server
		const now = server.tickCount
		let start = now + 60
		if (!trolling) return
		const name = playerName(player)
		const lines = [statusLine(trolling.troll, 'began', name)]
		trolling.message.forEach(text => lines.push(messageLine(trolling.troll, text)))
		lines.push(statusLine(trolling.troll, 'ceased', name))
		if (busyUntil[player.username] > start) start = busyUntil[player.username]
		busyUntil[player.username] = start + 60 * lines.length
		lines.forEach((line, i) => {
			let delay = start - now + 20 + 100 * (i - 1)
			if (i == 0) delay = start - now
			server.scheduleInTicks(delay, () => {
				player.tell(line)
				if (i == 0) playSound(player, 'minecraft:custom.pesteropen')
				if (i == lines.length - 1) playSound(player, 'minecraft:custom.pesterclose')
			})
		})
	})
})()
