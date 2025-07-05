import { Thresholds } from "../../domain/valueObjects/Thresholds";
import { IThresholdsRepository } from "../../domain/repositories/IThresholdsRepository";

export class InMemoryThresholdsRepository implements IThresholdsRepository {
  private thresholds: Thresholds | null = null;

  async get(): Promise<Thresholds | null> {
    return this.thresholds;
  }

  async save(thresholds: Thresholds): Promise<void> {
    this.thresholds = thresholds;
  }
}
