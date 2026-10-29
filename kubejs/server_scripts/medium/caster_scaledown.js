(() => {
	const CASTERS = [
		'irons_spellbooks:archevoker',
		'irons_spellbooks:apothecarist',
		'irons_spellbooks:cryomancer',
		'irons_spellbooks:pyromancer',
		'irons_spellbooks:priest',
		'irons_spellbooks:cultist',
		'discerning_the_eldritch:apothic_acolyte',
		'discerning_the_eldritch:apothic_crusader',
		'discerning_the_eldritch:apothic_summoner',
		'discerning_the_eldritch:ascended_one',
		'discerning_the_eldritch:ascended_one_cultist',
		'discerning_the_eldritch:blood_cultist_captain',
		'discerning_the_eldritch:blood_cultist_mage',
		'discerning_the_eldritch:blood_cultist_witch',
		'discerning_the_eldritch:blood_matriarch',
		'discerning_the_eldritch:electromancer',
		'irons_spellbooks:fire_boss'
	]

	CASTERS.forEach(type => {
		EntityEvents.spawned(type, event => event.entity.setAttributeBaseValue('minecraft:generic.scale', 0.7))
	})
})()
