import type { KaboomCtx } from 'kaboom'

const isWebGlAvailable = (canvas: HTMLCanvasElement) =>
  !!window.WebGLRenderingContext &&
  (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))

const setCameraScale = (k: KaboomCtx) => {
  const resizeFactor = k.width() / k.height()

  if (resizeFactor < 1) return k.camScale(k.vec2(1))

  k.camScale(k.vec2(1.5))
}

const showDialogue = ({
  onClose,
  text,
}: {
  onClose: VoidFunction
  text: string
}) => {
  const closeButton = document.getElementById('close') as HTMLButtonElement
  let currentText = ''
  const dialogue = document.getElementById('dialogue') as HTMLDivElement
  const dialogueUI = document.getElementById(
    'textbox-container'
  ) as HTMLDivElement
  let index = 0
  dialogueUI.style.display = 'block'

  const intervalRef = setInterval(() => {
    if (index < text?.length) {
      currentText += text[index]
      dialogue.innerHTML = currentText
      index++
      return
    }

    clearInterval(intervalRef)
  }, 1)

  const onButtonClick = () => {
    onClose()
    dialogueUI.style.display = 'none'
    dialogue.innerHTML = ''
    clearInterval(intervalRef)
    closeButton.removeEventListener('click', onButtonClick)
  }

  closeButton.addEventListener('click', onButtonClick)

  addEventListener('keypress', key => {
    if (key.code === 'Enter') closeButton.click()
  })
}

export { isWebGlAvailable, setCameraScale, showDialogue }
