/*
    Represent options of the status panel (stored and shared between panel and options editor)
 */
export interface StatusPanelOptions {
  title: string;
  subtitle: string;
  url: string;
  urlTargetBlank: boolean;
  aggregateQueries: boolean;
  // namePrefix: string;
  cornerRadius: string;
  flipCard: boolean;
  flipTime: number;
  flipState: boolean;
  isGrayOnNoData: boolean;
  fieldConfig: {
    defaults: {};
    overrides: unknown[];
  };
}
