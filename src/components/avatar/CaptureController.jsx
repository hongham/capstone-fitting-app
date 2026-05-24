import { useThree } from '@react-three/fiber'
import { forwardRef, useImperativeHandle } from 'react'

/**
 * CaptureController
 * - 최신 렌더링 버퍼 싱크를 맞춘 뒤 캡처를 수행하여 구도 억까를 방지합니다.
 */
const CaptureController = forwardRef((props, ref) => {
  const { gl, scene, camera } = useThree()

  useImperativeHandle(ref, () => ({
    capture: () => {
      // 🛠️ [핵심 수정] 카메라 매트릭스와 프로젝션을 수동으로 강제 업데이트합니다.
      // 수치가 바뀌자마자 버퍼가 밀리는 현상을 물리적으로 방지합니다.
      camera.updateMatrixWorld(true);
      camera.updateProjectionMatrix();
      
      // 최신 프레임을 캔버스 도화지에 다시 확실하게 그립니다.
      gl.render(scene, camera)
      
      // 완전히 동기화된 최신 base64 PNG 추출
      return gl.domElement.toDataURL('image/png')
    },
  }))

  return null
})

CaptureController.displayName = 'CaptureController'

export default CaptureController