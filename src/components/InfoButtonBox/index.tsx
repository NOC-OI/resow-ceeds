import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer, InfoButtonBoxContent } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import 'katex/dist/katex.min.css'
import Draggable from 'react-draggable'
import { useRef } from 'react'

interface InfoButtonBoxProps {
  infoButtonBox: any
  setInfoButtonBox: any
}

export function InfoButtonBox({
  infoButtonBox,
  setInfoButtonBox,
}: InfoButtonBoxProps) {
  function handleClose() {
    setInfoButtonBox({})
  }
  const nodeRef = useRef(null)
  return (
    <Draggable nodeRef={nodeRef} cancel=".clickable">
      <InfoButtonBoxContainer
        id="info-subsection"
        ref={nodeRef}
        className="w-[26rem]"
      >
        <div>
          <FontAwesomeIcon
            icon={faCircleXmark}
            onClick={handleClose}
            className="clickable"
          />
        </div>
        <div className="font-bold text-center pb-3 text-xl">
          <ReactMarkdown
            children={infoButtonBox.title}
            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
            linkTarget={'_blank'}
          />
        </div>
        <InfoButtonBoxContent className="content-center pb-2 pt-3">
          <ReactMarkdown
            children={infoButtonBox.content}
            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
            linkTarget={'_blank'}
          />
        </InfoButtonBoxContent>
        <div className="clickable p-1 flex justify-center items-center">
          <a
            href={infoButtonBox.metadata}
            target="_blank"
            className="clickable"
          >
            Link to metadata
          </a>
        </div>
      </InfoButtonBoxContainer>
    </Draggable>
  )
}
