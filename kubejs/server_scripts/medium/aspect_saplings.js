(() => {
	['blood', 'breath', 'doom', 'heart', 'hope', 'life', 'light', 'mind', 'rage', 'space', 'time', 'void'].forEach(aspect => {
		BlockEvents.rightClicked(`minestuck:${aspect}_aspect_leaves`, event => {
			if (event.hand != 'MAIN_HAND' || !event.player.mainHandItem.empty) return
			event.player.give(`minestuck:${aspect}_aspect_sapling`)
			event.player.swing()
			event.cancel()
		})
	})
})()
