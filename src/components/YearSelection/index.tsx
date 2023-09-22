import { AreaSelectorContainer } from '../AreaSelector/styles'

interface YearSelectionProps {
  yearSelected: number
  setYearSelected: any
}

export function YearSelection({
  yearSelected,
  setYearSelected,
}: YearSelectionProps) {
  console.log(yearSelected)

  function handleChangeYear(e: any) {
    setYearSelected(parseInt(e.target.value))
  }
  return (
    <AreaSelectorContainer>
      <h1>SELECT YEAR</h1>
      <div className="flex justify-center pt-2 pb-0">
        <input
          type="range"
          step={3}
          min={2012}
          max={2015}
          value={yearSelected}
          onChange={handleChangeYear}
        />
      </div>
      <p className="font-bold pt-0">{yearSelected}</p>
    </AreaSelectorContainer>
  )
}
