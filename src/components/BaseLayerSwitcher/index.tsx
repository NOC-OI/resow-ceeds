/* eslint-disable no-multi-str */
import { baseLayers, keyable } from '../../lib/map/utils'
import { useState } from 'react'
import { CalcTypeContainer } from '../DataExplorationType/styles'
import styles from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import { StackSimple } from 'phosphor-react'

interface BaseLayerSwitcherProps {
  setSelectedBaseLayer: any
  selectedBaseLayer: any
}

export function BaseLayerSwitcher({
  setSelectedBaseLayer,
  selectedBaseLayer,
}: BaseLayerSwitcherProps) {
  const [isActive, setIsActive] = useState(false)

  function handleShowLayers() {
    setIsActive((isActive) => !isActive)
  }

  function handleChangeBaseLayer(baseLayer: keyable) {
    setSelectedBaseLayer(baseLayer)
  }

  return (
    <CalcTypeContainer>
      <div>
        <header
          id="general-types"
          onClick={handleShowLayers}
          style={isActive ? { color: '#D49511' } : { color: 'white' }}
        >
          <span title="expand">
            <StackSimple size={32} />
          </span>
          <p>Base Layer</p>
        </header>
      </div>
      <div className="flex flex-col gap-1 pt-1">
        {isActive &&
          baseLayers.map((baseLayer, index) => (
            <LayerTypeOptionsContainer key={index}>
              <div id="type-option">
                <label htmlFor={baseLayer.attribution}>
                  <input
                    id={baseLayer.attribution}
                    onChange={() => handleChangeBaseLayer(baseLayer)}
                    className={styles.chk}
                    type="radio"
                    name="baseLayer"
                    checked={baseLayer.url === selectedBaseLayer.url}
                  />
                  <label
                    htmlFor={baseLayer.attribution}
                    className={styles.switch}
                  >
                    <span className={styles.slider}></span>
                  </label>
                  <p>{baseLayer.attribution}</p>
                </label>
              </div>
            </LayerTypeOptionsContainer>
          ))}
      </div>
    </CalcTypeContainer>
  )
}
