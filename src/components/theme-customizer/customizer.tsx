import { CustomizerHeader } from './customizer-header'
import { PrimaryColorSection } from './primary-color-section'
import { SurfaceColorSection } from './surface-color-section'
import { RadiusSection } from './radius-section'
import { ModeSection } from './mode-section'
import { CopyCodeButton } from './copy-code-button'

export function Customizer() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <CustomizerHeader />
      <PrimaryColorSection />
      <SurfaceColorSection />
      <RadiusSection />
      <ModeSection />
      <CopyCodeButton />
    </div>
  )
}
