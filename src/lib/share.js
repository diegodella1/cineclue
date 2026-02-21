const WIDTH = 1080
const HEIGHT = 1920

async function loadFont(family, url) {
  const font = new FontFace(family, `url(${url})`)
  await font.load()
  document.fonts.add(font)
}

export async function generateShareImage({ mode, date, totalScore, maxScore, eloAfter, eloDelta, roundResults, badge }) {
  // Load fonts
  await loadFont('Playfair Display', 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2')
  await loadFont('DM Mono', 'https://fonts.gstatic.com/s/dmmono/v10/aFTU7PB1QTsUX8KYhh2aBYyMcKJHl0Yw.woff2')

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  grad.addColorStop(0, '#0a0a0a')
  grad.addColorStop(1, '#111')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // Gold accent line
  ctx.fillStyle = '#d4af37'
  ctx.fillRect(0, 0, WIDTH, 4)

  // Logo
  ctx.fillStyle = '#d4af37'
  ctx.font = 'italic 64px "Playfair Display"'
  ctx.textAlign = 'center'
  ctx.fillText('CineClue', WIDTH / 2, 120)

  // Mode + date
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '32px "DM Mono"'
  const modeLabel = mode === 'daily' ? `Peli del Dia - ${date}` : 'Modo Solo'
  ctx.fillText(modeLabel, WIDTH / 2, 200)

  // Score
  ctx.fillStyle = '#d4af37'
  ctx.font = 'bold 120px "DM Mono"'
  ctx.fillText(`${totalScore} / ${maxScore}`, WIDTH / 2, 380)

  // Badge
  if (badge) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '36px "DM Mono"'
    ctx.fillText(badge.label, WIDTH / 2, 440)
  }

  // ELO delta
  ctx.font = 'bold 48px "DM Mono"'
  ctx.fillStyle = eloDelta >= 0 ? '#4caf50' : '#e53935'
  ctx.fillText(`${eloDelta >= 0 ? '+' : ''}${eloDelta} ELO`, WIDTH / 2, 530)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '28px "DM Mono"'
  ctx.fillText(`Rating: ${eloAfter}`, WIDTH / 2, 580)

  // Results table
  let y = 680
  ctx.textAlign = 'left'
  roundResults.forEach((r) => {
    // Title
    ctx.fillStyle = r.guessed ? '#ffffff' : 'rgba(255,255,255,0.4)'
    ctx.font = '32px "DM Mono"'
    ctx.fillText(r.title, 80, y)

    // Diff
    ctx.fillStyle = r.diff === 'facil' ? '#4caf50' : r.diff === 'medio' ? '#d4af37' : '#e53935'
    ctx.font = '24px "DM Mono"'
    ctx.textAlign = 'right'
    ctx.fillText(r.diff.toUpperCase(), 880, y)

    // Points
    ctx.fillStyle = r.guessed ? '#d4af37' : 'rgba(255,255,255,0.3)'
    ctx.fillText(`${r.points_earned} pts`, WIDTH - 80, y)
    ctx.textAlign = 'left'

    y += 60
  })

  // CTA
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '28px "DM Mono"'
  ctx.textAlign = 'center'
  ctx.fillText('Cual es tu huella cinematografica?', WIDTH / 2, HEIGHT - 120)
  ctx.fillStyle = '#d4af37'
  ctx.font = 'bold 36px "DM Mono"'
  ctx.fillText('cineclue.game', WIDTH / 2, HEIGHT - 60)

  return canvas.toDataURL('image/png')
}

export async function shareResult(imageDataUrl) {
  const blob = await (await fetch(imageDataUrl)).blob()
  const file = new File([blob], 'cineclue-result.png', { type: 'image/png' })

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return true
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e)
    }
  }
  return false
}
