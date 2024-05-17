import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import styles from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'

interface CustomInputToogleProps {
  onChange: any
  label: string
  column: boolean
}

export function CustomInputToogle({
  onChange,
  label,
  column,
}: CustomInputToogleProps) {
  return (
    <LayerTypeOptionsContainer>
      <div id="type-option" className="flex flex-col items-center">
        <label
          htmlFor="contain-header"
          title="contain header?"
          className={column ? 'flex flex-col gap-2' : 'flex'}
        >
          <input
            id="contain-header"
            onChange={(e) => onChange(e)}
            className={styles.chk}
            type="checkbox"
            name="baseLayer"
          />
          <label
            htmlFor="contain-header"
            className={styles.switch}
            title="layer uploaded"
          >
            <span className={styles.slider}></span>
          </label>
          <p>{label}</p>
        </label>
      </div>
    </LayerTypeOptionsContainer>
  )
}
