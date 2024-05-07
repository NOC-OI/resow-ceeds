import styles from './DimensionsToogle.module.css'
import { useNavigate } from 'react-router-dom'

export function DimensionsToogle() {
  const navigate = useNavigate()

  function handleChangeLanguage() {
    if (rout === '/3d') {
      navigate('/')
    } else {
      navigate('/3d')
    }
  }
  const rout = window.location.pathname
  return (
    <div className="text-[1rem] font-extrabold leading-6 uppercase pt-3">
      <label className={`${styles.switch} relative`}>
        <input
          type="checkbox"
          checked={rout === '/3d'}
          onChange={handleChangeLanguage}
        />
        <span className={`${styles.slider} ${styles.slider_animation}`}></span>
        <div className="absolute z-[60] flex gap-[14px] xl:-mt-[22px] lg:-mt-[18px] md:-mt-[15px] sm:-mt-[13px] -mt-[10px] text-[14px] pl-[8px] text-gray-200 font-changa">
          <div className={rout === '/' ? 'text-black' : 'text-white'}>2D</div>
          <div className={rout === '/3d' ? 'text-black' : 'text-white'}>3D</div>
        </div>
      </label>
    </div>
  )
}
