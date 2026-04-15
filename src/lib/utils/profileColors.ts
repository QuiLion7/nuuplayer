import type { ProfileType } from '$lib/types';

// Sistema de cores padronizado para perfis usando tokens do design system
export const profileColorSystem = {
  Unknown: {
    bg: 'bg-muted/50',
    border: 'border-muted-foreground/20',
    text: 'text-muted-foreground',
    icon: '❓'
  },
  Impatient: {
    bg: 'bg-orange-100 dark:bg-orange-950/80',
    border: 'border-orange-300 dark:border-orange-800/50',
    text: 'text-orange-950 dark:text-orange-300',
    icon: '⚡'
  },
  Explorer: {
    bg: 'bg-blue-100 dark:bg-blue-950/30',
    border: 'border-blue-300 dark:border-blue-800/50',
    text: 'text-blue-950 dark:text-blue-300',
    icon: '🔭'
  },
  Focused: {
    bg: 'bg-purple-100 dark:bg-purple-950/30',
    border: 'border-purple-300 dark:border-purple-800/50',
    text: 'text-purple-950 dark:text-purple-300',
    icon: '🎯'
  },
  Casual: {
    bg: 'bg-green-100 dark:bg-green-950/30',
    border: 'border-green-300 dark:border-green-800/50',
    text: 'text-green-950 dark:text-green-300',
    icon: '😎'
  }
} as const;

// Obtém as classes de cor para um perfil específico
export function getProfileColors(profileType: ProfileType) {
  return profileColorSystem[profileType] || profileColorSystem.Unknown;
}

// Obtém o ícone para um perfil específico
export function getProfileIcon(profileType: ProfileType): string {
  return profileColorSystem[profileType]?.icon || profileColorSystem.Unknown.icon;
}

// Obtém o nome de exibição para um perfil
export function getProfileDisplayName(profileType: ProfileType): string {
  const names: Record<ProfileType, string> = {
    Unknown: 'Novo Jogador',
    Impatient: 'Impaciente',
    Explorer: 'Explorador',
    Focused: 'Focado',
    Casual: 'Casual'
  };
  return names[profileType] ?? 'Novo Jogador';
}