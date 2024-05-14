import { ColorBarContainer, ColorBarItem } from './styles'

interface ColorBarProps {
  layerLegend: any
}

export function ColorBar({ layerLegend }: ColorBarProps) {
  const dataDescription = layerLegend.dataDescription
    ? layerLegend.dataDescription
    : ['', '']
  return (
    <ColorBarContainer>
      <div className="flex justify-center font-extrabold gap-3">
        <p className="text-lg">{dataDescription[0]}</p>
        <p className="text-lg">{dataDescription[1]}</p>
      </div>
      <div className="flex justify-between font-extrabold">
        <p className="text-lg">
          {Math.min(...layerLegend.legend[1]).toFixed(1)}
        </p>
        <p className="text-lg">
          {Math.max(...layerLegend.legend[1]).toFixed(1)}
        </p>
      </div>
      <div className="flex">
        {layerLegend.legend[0].map((value: string, idx) => (
          <ColorBarItem
            key={idx}
            style={{
              backgroundColor: `rgb(${value[0]},${value[1]},${value[2]})`,
            }}
          >
            <p className="">=</p>
          </ColorBarItem>
        ))}
      </div>
    </ColorBarContainer>
  )
}
