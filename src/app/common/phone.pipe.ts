import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  /**
   * Transforme un numéro de téléphone en ajoutant des espaces tous les 2 caractères
   * @param value Le numéro de téléphone à formater
   * @param format Le format souhaité (par défaut, "standard")
   * @returns Le numéro formaté avec des espaces
   *
   * Exemple: "0123456789" -> "01 23 45 67 89"
   */
  transform(value: string, format?: string): string {
    if (!value) return '';

    // Nettoyage des caractères non numériques
    const numbers = value.replace(/\D/g, '');

    // Formatage par groupes de 2 chiffres
    return numbers.replace(/(.{2})/g, '$1 ').trim();
  }
}
