import { useState, useCallback, useRef, useEffect } from 'react'
import { useGameStore } from '../stores/gameStore'
import { check } from '../lib/normalize'
import { POINTS_BY_CLUE } from '../lib/constants'

export function useDuel() {
  const [player1Name, setPlayer1Name] = useState('Jugador 1')
  const [player2Name, setPlayer2Name] = useState('Jugador 2')
  const [currentPlayer, setCurrentPlayer] = useState(1) // 1 or 2
  const [scores, setScores] = useState({ 1: 0, 2: 0 })
  const [roundResults, setRoundResults] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [shaking, setShaking] = useState(false)
  const [timer, setTimer] = useState(12)
  const [timerActive, setTimerActive] = useState(false)
  const timerRef = useRef(null)

  const { movies, currentRound, currentClue, loadSoloMovies, revealNextClue, nextRound, gameOver, reset } = useGameStore()
  const currentMovie = movies[currentRound]

  // Timer countdown
  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000)
      return () => clearTimeout(timerRef.current)
    }
    if (timerActive && timer === 0) {
      // Time's up - auto reveal next clue or skip
      if (currentClue < 4) {
        revealNextClue()
        setTimer(12)
      } else {
        handleSkip()
      }
    }
  }, [timer, timerActive])

  const startRound = useCallback(() => {
    setTimer(12)
    setTimerActive(true)
    setShowResult(false)
    setLastResult(null)
  }, [])

  const handleGuess = useCallback((input) => {
    if (!currentMovie) return false
    const isCorrect = check(input, currentMovie)
    if (isCorrect) {
      const points = POINTS_BY_CLUE[currentClue]
      setTimerActive(false)
      const result = {
        movie_id: currentMovie.id,
        title: currentMovie.title,
        diff: currentMovie.diff,
        lb: currentMovie.lb,
        guessed: true,
        clue_revealed: currentClue,
        points_earned: points,
        player: currentPlayer,
      }
      setScores(s => ({ ...s, [currentPlayer]: s[currentPlayer] + points }))
      setRoundResults(r => [...r, result])
      setLastResult(result)
      setShowResult(true)
      return true
    }
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
    return false
  }, [currentMovie, currentClue, currentPlayer])

  const handleSkip = useCallback(() => {
    setTimerActive(false)
    const result = {
      movie_id: currentMovie?.id,
      title: currentMovie?.title,
      diff: currentMovie?.diff,
      lb: currentMovie?.lb,
      guessed: false,
      clue_revealed: currentClue,
      points_earned: 0,
      player: currentPlayer,
    }
    setRoundResults(r => [...r, result])
    setLastResult(result)
    setShowResult(true)
  }, [currentMovie, currentClue, currentPlayer])

  const handleNext = useCallback(() => {
    setShowResult(false)
    setLastResult(null)
    // Alternate players
    setCurrentPlayer(p => p === 1 ? 2 : 1)
    nextRound()
    setTimer(12)
    setTimerActive(true)
  }, [nextRound])

  return {
    player1Name, setPlayer1Name, player2Name, setPlayer2Name,
    currentPlayer, scores, roundResults, showResult, lastResult,
    shaking, timer, timerActive, gameOver,
    movies, currentRound, currentClue, currentMovie,
    loadMovies: loadSoloMovies, startRound, revealNextClue,
    handleGuess, handleSkip, handleNext, reset,
  }
}
