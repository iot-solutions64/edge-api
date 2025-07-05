import { Thresholds } from "../valueObjects/Thresholds";

export interface IThresholdsRepository {
  get(): Promise<Thresholds | null>;
  save(thresholds: Thresholds): Promise<void>;
}
