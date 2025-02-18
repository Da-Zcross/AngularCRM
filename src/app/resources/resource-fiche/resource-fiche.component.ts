import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'crm-resource-fiche',
  standalone: true,
  template: `
    <div class="resource-details">
      <h2>Détails de la ressource {{ resourceId }}</h2>
      <!-- Ajoutez ici le contenu de votre fiche -->
    </div>
  `,
  styles: [`
    .resource-details {
      padding: 20px;
      margin: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class ResourceFicheComponent implements OnInit {
  resourceId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupération de l'ID depuis l'URL
    this.resourceId = this.route.snapshot.paramMap.get('id');
    console.log('ID de la ressource:', this.resourceId);
  }
}
