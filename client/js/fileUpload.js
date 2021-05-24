FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
)

const filepond = FilePond.create(document.querySelector('#image'))

filepond.setOptions({
	stylePanelAspectRatio: 1,
	imageResizeTargetWidth: 100,
	imageResizeTargetHeight: 100,
	maxFiles: 1,
	// required: true,
})
