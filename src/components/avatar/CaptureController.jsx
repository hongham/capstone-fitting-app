import { useThree } from '@react-three/fiber'
import { forwardRef, useImperativeHandle } from 'react'

/**
 * CaptureController
 * - Canvas 내부에서 useThree로 gl, scene, camera에 접근
 * - capture() 메서드로 현재 프레임을 base64 PNG로 추출
 *
 * 주의:
 *   Canvas 옵션에 gl={{ preserveDrawingBuffer: true }} 필수
 */
const CaptureController = forwardRef((props, ref) => {
  const { gl, scene, camera } = useThree()

  useImperativeHandle(ref, () => ({
    capture: () => {
      // 강제 렌더 (최신 프레임 보장)
      gl.render(scene, camera)
      // base64 PNG 추출
      return gl.domElement.toDataURL('image/png')
    },
  }))

  return null
})

CaptureController.displayName = 'CaptureController'

export default CaptureController
