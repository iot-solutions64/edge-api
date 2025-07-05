import { Thresholds } from "../../domain/valueObjects/Thresholds";
import { IThresholdsRepository } from "../../domain/repositories/IThresholdsRepository";
import { IBackendService } from "../../domain/services/IBackendService";

export class GetThresholdsUseCase {
  constructor(
    private thresholdsRepository: IThresholdsRepository,
    private backendService: IBackendService
  ) {}

  async execute(): Promise<Thresholds | null> {
    try {
      // Intentar obtener del backend primero
      const backendThresholds = await this.backendService.getThresholds();
      if (backendThresholds) {
        // Guardar en cache local
        await this.thresholdsRepository.save(backendThresholds);
        return backendThresholds;
      }
    } catch (error) {
      console.error("Error getting thresholds from backend:", error);
    }

    // Fallback a cache local
    const localThresholds = await this.thresholdsRepository.get();
    if (localThresholds) {
      return localThresholds;
    }

    // Fallback a valores por defecto
    const defaultThresholds = Thresholds.default();
    await this.thresholdsRepository.save(defaultThresholds);
    return defaultThresholds;
  }
}
