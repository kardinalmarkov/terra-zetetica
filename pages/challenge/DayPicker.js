// pages/challenge/DayPicker.js
// ──────────────────────────────────────────────────────────────────────────────
// Универсальный селектор «День N».
// props:
//   maxDay       — сколько дней уже открыто для пользователя (1-14)
//   currentDay   — текущий выбранный день
//   onChange(n)  — вызывается при выборе нового дня
// ──────────────────────────────────────────────────────────────────────────────
import PropTypes from 'prop-types'

export default function DayPicker({ maxDay = 1, currentDay = 1, onChange }) {
  return (
    <select
      value={currentDay}
      onChange={e => onChange(Number(e.target.value))}
    >
      {Array.from({ length: maxDay }).map((_, i) => (
        <option key={i + 1} value={i + 1}>
          День {i + 1}
        </option>
      ))}
    </select>
  )
}

DayPicker.propTypes = {
  maxDay:     PropTypes.number.isRequired,
  currentDay: PropTypes.number.isRequired,
  onChange:   PropTypes.func.isRequired
}
