import styles from './DimensionsToogle.module.css'
// import { useNavigate } from 'react-router-dom'

export function DimensionsToogle() {
  // const navigate = useNavigate()

  // function handleChangeLanguage() {
  //   if (rout === '/3d') {
  //     navigate('/')
  //   } else {
  //     navigate('/3d')
  //   }
  // }
  function handleChangeDimensions() {
    const rout = window.location.pathname
    const newRoute = rout === '/3d' ? '/' : '/3d'

    const link = document.createElement('a')
    link.href = newRoute
    link.click()
  }
  const rout = window.location.pathname
  return (
    <div
      id="dimensions_toogle"
      className="text-[1rem] !z-[9998] font-extrabold leading-6 uppercase pl-0 sm:pl-3 pt-3 cursor-pointer"
    >
      <label className={`${styles.switch} relative cursor-pointer`}>
        <input
          type="checkbox"
          checked={rout === '/3d'}
          onChange={handleChangeDimensions}
        />
        <span className={`${styles.slider} ${styles.slider_animation}`}></span>
        <div className="absolute flex gap-[14px] xl:-mt-[22px] lg:-mt-[18px] md:-mt-[15px] sm:-mt-[13px] -mt-[10px] text-[14px] pl-[6px] text-gray-200 font-changa">
          <div className={rout === '/' ? 'text-black' : 'text-white'}>2D</div>
          <div className={rout === '/3d' ? 'text-black' : 'text-white'}>3D</div>
        </div>
      </label>
    </div>
  )
}
