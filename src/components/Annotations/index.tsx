import { useEffect, useState } from 'react'
import { AnnotationsContainer } from './styles'

interface keyable {
  [key: string]: any
}

interface AnnotationsProps {
  subLayer: any
  content: any
  layerAction: any
  setLayerAction: any
  selectedLayers: keyable
  setSelectedLayers: any
  setActualLayer: any
  organisms: any
}

export function Annotations({
  subLayer,
  content,
  layerAction,
  setLayerAction,
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  organisms,
}: AnnotationsProps) {
  const [annotations, setAnnotations] = useState<string[]>(organisms)
  const [annotationsAll, setAnnotationsAll] = useState<boolean>(true)

  useEffect(() => {
    if (layerAction) {
      const newSelectedLayer = selectedLayers[`${content}_${subLayer}`]
      newSelectedLayer.show = []
      newSelectedLayer.photos.forEach((photo: any) => {
        if (annotations.length > 0) {
          annotations.every((annotation: any) => {
            if (photo[annotation] === 1) {
              photo.show = true
              return false
            } else {
              photo.show = false
              return true
            }
          })
        } else {
          photo.show = false
        }
        if (photo.show) {
          newSelectedLayer.show.push(photo.FileName)
        }
      })
      setSelectedLayers((selectedLayers: any) => {
        const copy = { ...selectedLayers }
        delete copy[`${content}_${subLayer}`]
        return {
          [`${content}_${subLayer}`]: newSelectedLayer,
          ...copy,
        }
      })
    }
  }, [annotations])

  function handleChangePhotos(e: any) {
    setLayerAction('marker-changes')
    if (e.target.value === 'SELECT ALL') {
      if (e.target.checked) {
        setAnnotations(organisms)
        setAnnotationsAll(true)
      } else {
        setAnnotations([])
        setAnnotationsAll(false)
      }
    } else {
      if (e.target.checked) {
        setAnnotations([e.target.value, ...annotations])
      } else {
        setAnnotations((annotations: any) =>
          annotations.filter(function (el: any) {
            return el !== e.target.value
          }),
        )
      }
    }
    setActualLayer([`${content}_${subLayer}`])
  }

  return (
    <AnnotationsContainer>
      <div key={`${content}_${subLayer}_ALL`}>
        <input
          onChange={handleChangePhotos}
          value={'SELECT ALL'}
          type="checkbox"
          checked={annotationsAll}
        />
        <p>{'ALL'}</p>
      </div>
      {organisms.map((organism: any) => {
        return (
          <div key={`${content}_${subLayer}_${organism}`}>
            <input
              onChange={handleChangePhotos}
              value={organism}
              type="checkbox"
              checked={annotations.includes(organism)}
            />
            <p>{organism}</p>
          </div>
        )
      })}
    </AnnotationsContainer>
  )
}

/* <div class="full-screen inactive-tab flex-container-center" id='first-full-screen'>
<p><i class="fas fa-times-circle"></i></p>
<% if @language == 'pt-br' %>
  <h2 class='text-center text-info'><strong>OCEANUM.LIVE</strong></h2>
  <p class='text-center'><strong>Dados observacionais em tempo real:</strong></p>
  <p class='mb-0 ml-0 mr-0'>Boias, Estações meteorológicas,</p>
  <p class='m-0'>Aeroportos, Observações visuais</p>
  <p class='m-0'>Estações maregráficas,</p>
  <p class='m-0'>Altimetria por satélite,</p>
  <p class='m-0'>Escaterômetros, Boias de Deriva,</p>
  <p class='m-0'>Gliders, Flutuadores ARGO,</p>
  <p class='m-0'>Mensagens SHIP</p>
  <h2 class='mt-3 mb-0 text-center font-weight-bold' id='counter'><%=@total_stations[:total]%></h2>
  <p class='mb-3 mt-0 text-center'>ESTAÇÕES NOS ÚLTIMOS 5 DIAS</p>
  <p class='m-0 text-center'><strong>ATENÇÃO: DADOS EM FUSO UTC</strong></p>
  <h4 class='mt-2 text-center'>CÓDIGOS DISPONÍVEIS EM:</h3>
<% elsif @language == 'en' %>
  <h2 class='text-center text-info'><strong>OCEANUM.LIVE</strong></h2>
  <p class='text-center'><strong>Real-time observational data:</strong></p>
  <p class='mb-0 ml-0 mr-0'>Buoys, Weather stations,</p>
  <p class='m-0'>Airports, Visual observations,</p>
  <p class='m-0'>Tide gauges, Satellite altimetry,</p>
  <p class='m-0'>Scatterometers, Drifters,</p>
  <p class='m-0'>Gliders, ARGO Floats,</p>
  <p class='m-0'>SHIP messages</p>
  <h2 class='mt-3 mb-0 text-center font-weight-bold' id='counter'><%=@total_stations[:total]%></h2>
  <p class='mb-3 mt-0 text-center'>STATIONS IN THE LAST 5 DAYS</p>
  <p class='m-0 text-center'><strong>ATTENTION: DATA IN GMT</strong></p>
  <h4 class='mt-2 text-center'>CODES AVAILABLE AT:</h3>
<% end %>
<div class="row  justify-content-center ">
  <div class='col-4 card-git text-center  justify-content-center'>
    <a href="https://github.com/soutobias/oceanoobsbrasil" target="_blank" class='text-center'>
      <i class="fab fa-github m-0  p-0 text-center"></i>
      <p class='m-0  p-0 text-center'>DATA</p>
    </a>
  </div>
  <div class='col-4 card-git text-center justify-content-center'>
    <a href="https://github.com/soutobias/remobs_api" target="_blank" class='text-center'>
      <i class="fab fa-github m-0 p-0 text-center"></i>
      <p class='m-0  p-0 text-center'>API</p>
    </a>
  </div>
  <div class='col-4 card-git text-center'>
    <a href="https://github.com/soutobias/oceanoobsbrasil_web" target="_blank" class='text-center'>
      <i class="fab fa-github m-0  p-0 text-center"></i>
      <p class='m-0  p-0 text-center'>WEB</p>
    </a>
  </div>
</div>
</div> */

// .full-screen {
//   position: absolute;
//   left: 0;
//   right: 0;
//   top: 0;
//   bottom: 0;
//   background: rgba(0,0,0,0.9);
//   z-index: 2000;
//   h4{
//     font-size: 20px;
//   }
// }

// .flex-container-center {
//   displaY: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items:center;
// }

// .full-screen{
//   color: white;
//   i{
//     font-size: 30px;
//   }
// }
