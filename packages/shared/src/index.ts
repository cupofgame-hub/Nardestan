export const appName = 'Nardestan';

export interface AppMetadata {
  name: string;
  stage: 'bootstrap' | 'planned';
}

export const metadata: AppMetadata = {
  name: appName,
  stage: 'bootstrap'
};
