'use client'

import type { SceneProps } from './types'
import { TitleScene } from './TitleScene'
import { WhatAwsIsScene } from './WhatAwsIsScene'
import { KeyFeaturesScene } from './KeyFeaturesScene'
import { ServiceFamiliesScene } from './ServiceFamiliesScene'
import { UseCasesScene } from './UseCasesScene'
import { AudienceScene } from './AudienceScene'
import { CertLadderScene } from './CertLadderScene'
import { WhatIsCloudScene } from './WhatIsCloudScene'
import { DeploymentModelsScene } from './DeploymentModelsScene'
import { ResponsibilitiesScene } from './ResponsibilitiesScene'
import { CloudServiceProviderScene } from './CloudServiceProviderScene'
import { IcebergScene } from './IcebergScene'
import { ServiceModelsScene } from './ServiceModelsScene'
import { SixAdvantagesScene } from './SixAdvantagesScene'
import { GlobalInfrastructureScene } from './GlobalInfrastructureScene'
import { RegionsAzsScene } from './RegionsAzsScene'
import { EdgeLocationsScene } from './EdgeLocationsScene'
import { AwsAccountsScene } from './AwsAccountsScene'
import { AccountFeaturesScene } from './AccountFeaturesScene'
import { RootAndIamScene } from './RootAndIamScene'
import { CardsScene } from './CardsScene'
import { StepsScene } from './StepsScene'
import { SplitScene } from './SplitScene'
import { PhotoScene } from './PhotoScene'
import { OutroScene } from './OutroScene'
import { ProgrammeTitleScene } from './ProgrammeTitleScene'
import { ContentsScene } from './ContentsScene'
import { ModuleTitleScene } from './ModuleTitleScene'
import { ModuleOutroScene } from './ModuleOutroScene'
import { CodeScene } from './CodeScene'

export type { SceneProps } from './types'

/** One case per slide scene. */
export function Scene(props: SceneProps) {
  switch (props.slide.scene) {
    case 'title':
      return <TitleScene {...props} />
    case 'what-aws-is':
      return <WhatAwsIsScene {...props} />
    case 'key-features':
      return <KeyFeaturesScene {...props} />
    case 'service-families':
      return <ServiceFamiliesScene {...props} />
    case 'use-cases':
      return <UseCasesScene {...props} />
    case 'audience':
      return <AudienceScene {...props} />
    case 'cert-ladder':
      return <CertLadderScene {...props} />
    case 'what-is-cloud':
      return <WhatIsCloudScene {...props} />
    case 'deployment-models':
      return <DeploymentModelsScene {...props} />
    case 'responsibilities':
      return <ResponsibilitiesScene {...props} />
    case 'cloud-service-provider':
      return <CloudServiceProviderScene {...props} />
    case 'iceberg':
      return <IcebergScene {...props} />
    case 'service-models':
      return <ServiceModelsScene {...props} />
    case 'six-advantages':
      return <SixAdvantagesScene {...props} />
    case 'global-infrastructure':
      return <GlobalInfrastructureScene {...props} />
    case 'regions-azs':
      return <RegionsAzsScene {...props} />
    case 'edge-locations':
      return <EdgeLocationsScene {...props} />
    case 'aws-accounts':
      return <AwsAccountsScene {...props} />
    case 'account-features':
      return <AccountFeaturesScene {...props} />
    case 'root-and-iam':
      return <RootAndIamScene {...props} />
    // generic, data-driven layouts
    case 'cards':
      return <CardsScene {...props} />
    case 'steps':
      return <StepsScene {...props} />
    case 'split':
      return <SplitScene {...props} />
    case 'photo':
      return <PhotoScene {...props} />
    case 'outro':
      return <OutroScene {...props} />
    case 'programme-title':
      return <ProgrammeTitleScene {...props} />
    case 'contents':
      return <ContentsScene {...props} />
    case 'module-title':
      return <ModuleTitleScene {...props} />
    case 'module-outro':
      return <ModuleOutroScene {...props} />
    case 'code':
      return <CodeScene {...props} />
  }
}
