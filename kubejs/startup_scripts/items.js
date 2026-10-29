(() => {
	const GOD_TIER_CLASSES = ['bard', 'heir', 'knight', 'mage', 'maid', 'page', 'prince', 'rogue', 'seer', 'sylph', 'thief', 'witch']

	StartupEvents.registry('armor_material', event => {
		event.create('god_tier').defense({ helmet: 1, chestplate: 3, leggings: 2, boots: 1, body: 3 }).enchantmentValue(15).equipSound('minecraft:item.armor.equip_leather')
	})

	StartupEvents.registry('item', event => {
		event.create('wielded_shield', 'sword').displayName('§9Wielded Shield').tier('netherite').rarity('RARE')
		event.create('captchalberd', 'axe').displayName('§ccaptcHalberd').tier('netherite').rarity('RARE')
		event.create('paladins_arsenal', 'sword').displayName("§6Paladin's Arsenal").tier('netherite').rarity('RARE')
		event.create('gunblade', 'sword').displayName('§3Gunsword').tier('iron').rarity('RARE')
		event.create('snackshot').displayName('§cSnackshot').rarity('RARE').unstackable()
		event.create('edible_modus').displayName('§eEdible Modus').food(food => food.nutrition(8).saturation(0.8)).rarity('RARE')

		event.create('cursor').displayName('§7Cursor').tooltip('Interact with a mob or block to prototype your Kernelsprite').tooltip('Works best on plushies!').unstackable().rarity('EPIC')
		event.create('inventory_upgrade').displayName('§aInventory Upgrade').rarity('EPIC')
		event.create('blankusb').displayName('Blank USB Drive')
		event.create('alchemizeusb').displayName('§44LCH3M-1Z3.ska').glow(true).rarity('EPIC').tooltip('A USB drive containing the 4LCH3M-1Z3 genetic code.')
		event.create('explorationusb').displayName('§53XPL-0R3.ska').glow(true).rarity('EPIC').tooltip('A USB drive containing the 3XPL-0R3 genetic code.')
		event.create('techusb').displayName('§bT3CHN-0.ska').glow(true).rarity('EPIC').tooltip('A USB drive containing the T3CHN-0 genetic code.')
		event.create('magicusb').displayName('§dM4G-1C.ska').glow(true).rarity('EPIC').tooltip('A USB drive containing the M4G-1C genetic code.')

		event.create('derse_token').displayName('§5Derse Token')
		event.create('derse_brick').displayName('§5Derse Brick')
		event.create('derse_signature').displayName('§5Dersite Signature')
		event.create('prospit_token').displayName('§6Prospit Token')
		event.create('prospit_brick').displayName('§6Prospit Brick')
		event.create('prospit_plans').displayName('§6Prospitian War Plans')
		event.create('prospit_key_fragment').displayName('§6Prospitian Key Fragment').rarity('RARE')
		event.create('prospit_key').displayName('§6Prospitian Vault Key').rarity('EPIC')
		event.create('pickpockets_glove').displayName('§ePickpockets Glove').unstackable().rarity('RARE')
		event.create('lunar_transportablizer').displayName('§6Lunar §5Transportablizer').unstackable().rarity('EPIC')
		event.create('transportablizer2').displayName('§7Incipispheric Transportablizer').rarity('EPIC').unstackable()
		event.create('meteoric_transportablizer').displayName('§6Meteoric Transportablizer').rarity('EPIC').unstackable()

		event.create('strife').displayName('§cStrife!')
		event.create('strifex2combo').displayName('§cStrife §6x2 Combo§c!')
		event.create('obsidian_rings').displayName('§8Obsidian Encrusted Rings').rarity('EPIC').fireResistant().unstackable()

		event.create('divine_note').displayName('§9Divine Note').glow(true).rarity('EPIC')

		GOD_TIER_CLASSES.forEach(godClass => {
			const name = godClass.charAt(0).toUpperCase() + godClass.slice(1)
			event.create(`${godClass}_hood`, 'helmet').material('kubejs:god_tier').displayName(`§e${name}'s Hood`).rarity('EPIC')
			event.create(`${godClass}_shirt`, 'chestplate').material('kubejs:god_tier').displayName(`§e${name}'s Shirt`).rarity('EPIC')
			event.create(`${godClass}_pants`, 'leggings').material('kubejs:god_tier').displayName(`§e${name}'s Pants`).rarity('EPIC')
			event.create(`${godClass}_shoes`, 'boots').material('kubejs:god_tier').displayName(`§e${name}'s Shoes`).rarity('EPIC')
		})

		event.create('eye_of_malice', 'eyejs:structure_eye').displayName('Eye of Malice').structures('discerning_the_eldritch:cultist_base').trailColor(0xC02849)
		event.create('eye_of_the_ancients', 'eyejs:structure_eye').displayName('Eye of the Ancients').structures('irons_spellbooks:citadel').trailColor(0x611402)
		event.create('eye_of_ascension', 'eyejs:structure_eye').displayName('Eye of Ascension').trailColor(0x965EFF)
			.structures('kubejs:breath_qb', 'kubejs:light_qb', 'kubejs:time_qb', 'kubejs:space_qb', 'kubejs:life_qb', 'kubejs:void_qb', 'kubejs:heart_qb', 'kubejs:hope_qb', 'kubejs:doom_qb', 'kubejs:rage_qb', 'kubejs:mind_qb', 'kubejs:blood_qb')
		event.create('eye_of_the_protector', 'eyejs:structure_eye').displayName('Eye of the Protector').trailColor(0x4E4E4E)
			.structures('kubejs:breath_lair', 'kubejs:light_lair', 'kubejs:time_lair', 'kubejs:space_lair', 'kubejs:life_lair', 'kubejs:void_lair', 'kubejs:heart_lair', 'kubejs:hope_lair', 'kubejs:doom_lair', 'kubejs:rage_lair', 'kubejs:mind_lair', 'kubejs:blood_lair')

		event.create('gs_chat').displayName('GS Chat')
		event.create('rg_chat').displayName('RG Chat')
		event.create('bj_chat').displayName('BJ Chat')
		event.create('dh_chat').displayName('DH Chat')
		event.create('fr_chat').displayName('FR Chat')
		event.create('py_chat').displayName('PY Chat')
		event.create('tk_chat').displayName('TK Chat')
		event.create('uu_chat').displayName('UU Chat')
		event.create('fx_chat').displayName('f(X) Chat')
		event.create('dd_chat').displayName('DD Chat')
		event.create('st_chat').displayName('ST Chat')
		event.create('ga_chat').displayName('GA Chat')

		event.create('space_scroll').displayName('§8Scroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('time_scroll').displayName('§cScroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('heart_scroll').displayName('§dScroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('mind_scroll').displayName('§3Scroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('hope_scroll').displayName('§eScroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('doom_scroll').displayName('§2Scroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('blood_scroll').displayName('§4Scroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('breath_scroll').displayName('§bScroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('light_scroll').displayName('§6Scroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('rage_scroll').displayName('§5Scroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('void_scroll').displayName('§1Scroll of Quest Completion').rarity('EPIC').unstackable()
		event.create('life_scroll').displayName('§aScroll of Quest Completion').rarity('EPIC').unstackable()

		event.create('space_choice').displayName('§8Dea Matronas Choice').glow(true).rarity('EPIC').unstackable()
		event.create('time_choice').displayName('§cCat-Siths Choice').glow(true).rarity('EPIC').unstackable()
		event.create('heart_choice').displayName('§dLitaviss Choice').glow(true).rarity('EPIC').unstackable()
		event.create('mind_choice').displayName('§3Ecnes Choice').glow(true).rarity('EPIC').unstackable()
		event.create('hope_choice').displayName('§eBesenclaes Choice').glow(true).rarity('EPIC').unstackable()
		event.create('doom_choice').displayName('§2Donns Choice').glow(true).rarity('EPIC').unstackable()
		event.create('blood_choice').displayName('§4Rhiannons Choice').glow(true).rarity('EPIC').unstackable()
		event.create('breath_choice').displayName('§bAos Sís Choice').glow(true).rarity('EPIC').unstackable()
		event.create('light_choice').displayName('§6Lughs Choice').glow(true).rarity('EPIC').unstackable()
		event.create('rage_choice').displayName('§5Nuadas Choice').glow(true).rarity('EPIC').unstackable()
		event.create('void_choice').displayName('§1Llyrs Choice').glow(true).rarity('EPIC').unstackable()
		event.create('life_choice').displayName('§aCaintes Choice').glow(true).rarity('EPIC').unstackable()
		event.create('made_choice').displayName('§7Made Choice').rarity('EPIC').unstackable()

		event.create('floral_receipt').displayName('§aFloral Receipt').rarity('EPIC')
		event.create('ectobiology_certificate').displayName('§aCertificate of Ectobiology').rarity('EPIC')
		event.create('genesis_tadpole').displayName('§aGenesis Tadpole').rarity('EPIC').unstackable()

		event.create('obscured_truth').displayName('§1Obscured Truth').unstackable().rarity('RARE')
		event.create('puzzle_piece_1').displayName('§3Puzzle Piece 1').unstackable().rarity('RARE')
		event.create('puzzle_piece_2').displayName('§3Puzzle Piece 2').unstackable().rarity('RARE')
		event.create('puzzle_piece_3').displayName('§3Puzzle Piece 3').unstackable().rarity('RARE')
		event.create('completed_hit').displayName('§5Completed Hit').rarity('RARE')
		event.create('mediation_stick').displayName('§4Olive Branch').rarity('RARE')
		event.create('salamander_turtle_agreement').displayName('§4Salamander-Turtle Agreement').rarity('RARE')
		event.create('salamander_iguana_agreement').displayName('§4Salamander-Iguana Agreement').rarity('RARE')
		event.create('salamander_nakagator_agreement').displayName('§4Salamander-Nakagator Agreement').rarity('RARE')
		event.create('turtle_iguana_agreement').displayName('§4Turtle-Iguana Agreement').rarity('RARE')
		event.create('turtle_nakagator_agreement').displayName('§4Turtle-Nakagator Agreement').rarity('RARE')
		event.create('iguana_nakagator_agreement').displayName('§4Iguana-Nakagator Agreement').rarity('RARE')
		event.create('elytric_fragment').displayName('§bElytric Fragment').rarity('RARE')
		event.create('wondrous_seed_stash').displayName('§aWondrous Seed Stash').rarity('RARE')
		event.create('sublime_seed_stash').displayName('§aSublime Seed Stash').rarity('RARE')
		event.create('prodigious_seed_stash').displayName('§aProdigious Seed Stash').rarity('RARE')
		event.create('defusal_kit').displayName('§2Defusal Kit').rarity('RARE')
		event.create('lore_tome_1').displayName('§cLore Tome I').rarity('RARE')
		event.create('lore_tome_2').displayName('§cLore Tome II').rarity('RARE')
		event.create('lore_tome_3').displayName('§cLore Tome III').rarity('RARE')
		event.create('lore_tome_4').displayName('§cLore Tome IV').rarity('RARE')
		event.create('lore_tome_5').displayName('§cLore Tome V').rarity('RARE')
		event.create('lore_tome_6').displayName('§cLore Tome VI').rarity('RARE')
		event.create('lore_tome_7').displayName('§cLore Tome VII').rarity('RARE')
		event.create('lore_tome_8').displayName('§cLore Tome VIII').rarity('RARE')
		event.create('lore_tome_9').displayName('§cLore Tome IX').rarity('RARE')
		event.create('lore_tome_10').displayName('§cLore Tome X').rarity('RARE')
		event.create('lore_tome_11').displayName('§cLore Tome XI').rarity('RARE')
		event.create('lore_tome_12').displayName('§cLore Tome XII').rarity('RARE')
		event.create('talent_scout').displayName('§eRecord Deal').rarity('RARE')
		event.create('microphone').displayName('§eMicrophone').rarity('RARE').unstackable()
		event.create('signed_contract').displayName('§eSigned Contract').rarity('RARE')
		event.create('rose_bouquet').displayName('§eRose Bouquet').rarity('EPIC')
		event.create('light_coin').displayName('§6Light Coin').rarity('RARE')
		event.create('super_light_coin').displayName('§6Super Light Coin').rarity('EPIC').glow(true)
	})

	ItemEvents.modification(event => {
		event.modify('kubejs:fresh_prince_plushie', item => {
			item.rarity = 'rare'
			item.tooltip('§2A plushie of the Fresh Prince')
		})
		event.modify('kubejs:durian_plushbomb', item => {
			item.rarity = 'rare'
			item.tooltip('§aA smelly, cuddly and explosive fruit.')
		})
		event.modify('kubejs:matriyarn', item => {
			item.rarity = 'rare'
			item.tooltip('§7You dont think this could resurrect an entire alien race.')
		})

		event.modify('kubejs:thresh_prince_plushie', item => {
			item.rarity = 'epic'
			item.tooltip('§7A plushie of the Thresh Prince')
		})
		event.modify('kubejs:cathedral_cannon', item => {
			item.rarity = 'epic'
			item.tooltip('§6A holy weapon of mass destruction.')
		})
		event.modify('kubejs:second_coming_of_durian_with_a_gun', item => {
			item.rarity = 'epic'
			item.tooltip('§6His Holiness')
		})
		event.modify('kubejs:paradox_autoclave', item => {
			item.rarity = 'epic'
		})
		event.modify('kubejs:dna_sequencer', item => {
			item.rarity = 'epic'
		})

		event.modify('minestuck:black_queens_ring', item => {
			item.setFireResistant()
		})
		event.modify('minestuck:white_queens_ring', item => {
			item.setFireResistant()
		})

		GOD_TIER_CLASSES.forEach(godClass => {
			event.modify([`kubejs:${godClass}_hood`, `kubejs:${godClass}_shirt`, `kubejs:${godClass}_pants`, `kubejs:${godClass}_shoes`], item => {
				item.setCustomData({ armor_model_api: { model: `kubejs:geo/god_tier/${godClass}.geo.json`, texture: 'kubejs:textures/models/armor/god_tier_layer_1.png', trim: 'kubejs:trims/models/armor/god_tier' } })
			})
		})
	})
})()
