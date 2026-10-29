(() => {
	EntityEvents.drops(event => {
		const roll = Math.random()
		if (!event.source.player || !['minestuck:basilisk', 'minestuck:imp', 'minestuck:ogre', 'minestuck:lich'].includes(String(event.entity.type))) return
		if (roll < 0.02) event.addDrop('simplehats:hatbag_common')
		else if (roll < 0.035) event.addDrop('simplehats:hatbag_uncommon')
		else if (roll < 0.045) event.addDrop('simplehats:hatbag_rare')
		else if (roll < 0.05) event.addDrop('simplehats:hatbag_epic')
	})
})()
