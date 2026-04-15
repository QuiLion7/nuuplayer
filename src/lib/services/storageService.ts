import { validateProfile, sanitizeSessionData } from '$lib/utils/validation';
import type { SessionData, Profile } from '$lib/types';
// Serviço centralizado para gerenciar persistência de dados no localStorage
export class StorageService {
  private static readonly SESSION_KEY = 'nuuplayer_session';
  private static readonly PROFILE_KEY = 'nuuplayer_profile';

  // Verifica se localStorage está disponível (SSR-safe)

  private static isStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  // Salva dados de sessão no localStorage
  static saveSession(data: SessionData): void {
    if (!this.isStorageAvailable()) return;

    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Falha ao salvar sessão no localStorage:', error);
    }
  }

  // Carrega dados de sessão do localStorage com validação
  static loadSession(): SessionData {
    if (!this.isStorageAvailable()) {
      return this.createDefaultSession();
    }

    try {
      const raw = localStorage.getItem(this.SESSION_KEY);

      if (!raw) return this.createDefaultSession();

      const parsed = JSON.parse(raw);

      return sanitizeSessionData(parsed);
    } catch (error) {
      console.error('Falha ao carregar sessão do localStorage:', error);
      return this.createDefaultSession();
    }
  }

  // Salva perfil no localStorage
  static saveProfile(profile: Profile): void {
    if (!this.isStorageAvailable()) return;

    try {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Falha ao salvar perfil no localStorage:', error);
    }
  }

  // Carrega perfil do localStorage com validação
  static loadProfile(): Profile | null {
    if (!this.isStorageAvailable()) return null;

    try {
      const raw = localStorage.getItem(this.PROFILE_KEY);

      if (!raw) return null;

      const parsed = JSON.parse(raw);
      
      return validateProfile(parsed);
    } catch (error) {
      console.error('Falha ao carregar perfil do localStorage:', error);
      return null;
    }
  }

  // Remove todos os dados do localStorage
  static clearAll(): void {
    if (!this.isStorageAvailable()) return;

    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.PROFILE_KEY);
    } catch (error) {
      console.error('Falha ao limpar localStorage:', error);
    }
  }

  // Cria dados de sessão padrão
  private static createDefaultSession(): SessionData {
    return {
      sessions: [],
      totalClicks: 0,
      keyboardHits: 0,
      scrollDepth: 0,
      visitedGames: [],
      startTime: Date.now(),
    };
  }
}