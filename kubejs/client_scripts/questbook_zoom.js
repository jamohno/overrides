(() => {
	const $ScreenInitPost = Java.loadClass('net.neoforged.neoforge.client.event.ScreenEvent$Init$Post')
	const $ScreenClosing = Java.loadClass('net.neoforged.neoforge.client.event.ScreenEvent$Closing')
	const $ScreenWrapper = Java.loadClass('dev.ftb.mods.ftblibrary.ui.ScreenWrapper')
	const $QuestScreen = Java.loadClass('dev.ftb.mods.ftbquests.client.gui.quests.QuestScreen')

	function resetZoom(screen) {
		if (!(screen instanceof $ScreenWrapper) || !(screen.getGui() instanceof $QuestScreen)) return
		const gui = screen.getGui()
		gui.addZoom((8 - gui.getZoom()) / 4)
		if (isNaN(gui.questPanel.getScrollX()) || isNaN(gui.questPanel.getScrollY())) gui.questPanel.resetScroll()
	}

	NativeEvents.onEvent($ScreenInitPost, event => resetZoom(event.getScreen()))
	NativeEvents.onEvent($ScreenClosing, event => resetZoom(event.getScreen()))
})()
