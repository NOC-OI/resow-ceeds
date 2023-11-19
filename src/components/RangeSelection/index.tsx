import { yearMonths } from '../../data/yearMonths'
import { years } from '../../data/years'
import { RangeSelectionContainer, RangeValue } from './styles'

interface RangeSelectionProps {
  actualDate: any
  setActualDate: any
  setLayerAction: any
  setActualLayer: any
  selectedLayers: any
}

export function RangeSelection({
  actualDate,
  setActualDate,
  setLayerAction,
  setActualLayer,
  selectedLayers,
}: RangeSelectionProps) {
  const startDate = 0
  const endDate = yearMonths.length - 1

  // const [action, setAction] = useState('')

  function handleChange(e: any) {
    if (!selectedLayers) {
      return
    }
    setActualLayer(selectedLayers)
    setLayerAction('time')
    setActualDate(e.target.value)
  }

  // const [backgroundLimits, setBackGroundLimits] = [startDate, yearMonths.indexOf('2020-12'), endDate ]

  function calculateLimit(position: string) {
    if (position === 'before') {
      if (actualDate < yearMonths.indexOf('2020-12')) {
        return actualDate
      } else {
        return yearMonths.indexOf('2020-12')
      }
    } else if (position === 'after') {
      if (actualDate > yearMonths.indexOf('2020-12')) {
        return actualDate
      } else {
        return yearMonths.indexOf('2020-12')
      }
    }
  }
  const backgroundLimits = [
    startDate,
    ((calculateLimit('before') - startDate) / endDate) * 100,
    ((yearMonths.indexOf('2020-12') - startDate) / endDate) * 100,
    ((calculateLimit('after') - startDate) / endDate) * 100,
    100,
  ]

  // `linear-gradient(to right, #138a8a 0%, #138a8a ${Math.floor(
  //   ((actualDate - startDate) / endDate) * 100,
  // )}%, #fff ${Math.floor(
  //   ((actualDate - startDate) / endDate) * 100,
  // )}%, white 100%)`

  return (
    <RangeSelectionContainer>
      <div className="flex w-full justify-between pb-3">
        {years.map((year: any) => {
          return (
            <div key={year} className="text-center font-extrabold">
              <p
                className={
                  year > 2021
                    ? 'text-red-500 text-transformation'
                    : 'text-transformation'
                }
              >
                {year}
              </p>
              <p className="text-xs">|</p>
            </div>
          )
        })}
        <div className="text-center font-extrabold">
          <p className="opacity-0">20</p>
          <p className="text-xs opacity-0">|</p>
        </div>
      </div>
      <input
        type="range"
        min={startDate}
        max={endDate}
        step={1}
        style={{
          background: `linear-gradient(to right, #138a8a ${backgroundLimits[0]}%, #138a8a ${backgroundLimits[1]}%, white ${backgroundLimits[1]}%, white ${backgroundLimits[2]}%, #fc0505 ${backgroundLimits[2]}%, #fc0505 ${backgroundLimits[3]}%, #ffa6a6 ${backgroundLimits[3]}%, #ffa6a6 ${backgroundLimits[4]}%)`,
        }}
        value={actualDate}
        onChange={handleChange}
        className="w-full large-range"
      />
      <RangeValue
        style={{
          marginLeft: `${Math.floor(
            ((actualDate - startDate) / (endDate + 10)) * 100,
          )}%`,
        }}
      >
        <p
          className={
            actualDate <= yearMonths.indexOf('2020-12')
              ? 'bg-blue-500'
              : 'bg-red-500'
          }
        >
          {yearMonths[actualDate]}
        </p>
      </RangeValue>
      {/* <div className="flex gap-4 justify-center">
        <FontAwesomeIcon
          icon={faBackward}
          onClick={() => handleChangeDate('back')}
          className="h-6"
        />
        <FontAwesomeIcon
          icon={faPlay}
          onClick={() => handleChangeDate('play')}
          className="h-6"
        />
        <FontAwesomeIcon
          icon={faPause}
          onClick={() => handleChangeDate('pause')}
          className="h-6"
        />
        <FontAwesomeIcon
          icon={faForward}
          onClick={() => handleChangeDate('front')}
          className="h-6"
        />
      </div> */}
    </RangeSelectionContainer>
  )
}
