import { Product, ProductGroup } from '../types';

import imgMaz from '../assets/HAmaz.png';
import imgSurv from '../assets/HAsurv.png';
import imgBac3 from '../assets/HAbac3.png';
import imgBac10 from '../assets/HAbac10.png';

import imgReta10 from '../assets/HAReta10.png';
import imgReta20 from '../assets/HAReta20.png';
import imgReta30 from '../assets/HAReta30.png';
import imgReta40 from '../assets/HAReta40.png';
import imgReta50 from '../assets/HAReta50.png';
import imgReta60 from '../assets/HAReta60.png';

import imgSema10 from '../assets/HAsema10.png';
import imgSema20 from '../assets/HAsema20.png';
import imgSema30 from '../assets/HAsema30.png';

import imgTirz10 from '../assets/HATriz10.png';
import imgTirz20 from '../assets/HATriz20.png';
import imgTirz30 from '../assets/HATriz30.png';
import imgTirz40 from '../assets/HATriz40.png';
import imgTirz50 from '../assets/HATriz50.png';
import imgTirz60 from '../assets/HATriz60.png';

import imgCag25 from '../assets/HACag2.5.png';
import imgCag5 from '../assets/HACag5.png';
import imgCag10 from '../assets/HACAG.png';

export const MEMBERS_PRODUCTS: Product[] = [
  // ── Retatrutide ──────────────────────────────────────────────────────────────
  {
    id: 'members-reta-10mg',
    name: 'Retatrutide (10mg)',
    price: 85,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '10mg',
    image: imgReta10,
    cas: '2381272-77-9',
    molecularWeight: '4731.4 g/mol',
    description: 'Triple GIP/GLP-1/glucagon receptor agonist under active metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-reta-20mg',
    name: 'Retatrutide (20mg)',
    price: 170,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '20mg',
    image: imgReta20,
    cas: '2381272-77-9',
    molecularWeight: '4731.4 g/mol',
    description: 'Triple GIP/GLP-1/glucagon receptor agonist under active metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-reta-30mg',
    name: 'Retatrutide (30mg)',
    price: 230,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '30mg',
    image: imgReta30,
    cas: '2381272-77-9',
    molecularWeight: '4731.4 g/mol',
    description: 'Triple GIP/GLP-1/glucagon receptor agonist under active metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-reta-40mg',
    name: 'Retatrutide (40mg)',
    price: 285,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '40mg',
    image: imgReta40,
    cas: '2381272-77-9',
    molecularWeight: '4731.4 g/mol',
    description: 'Triple GIP/GLP-1/glucagon receptor agonist under active metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-reta-50mg',
    name: 'Retatrutide (50mg)',
    price: 330,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '50mg',
    image: imgReta50,
    cas: '2381272-77-9',
    molecularWeight: '4731.4 g/mol',
    description: 'Triple GIP/GLP-1/glucagon receptor agonist under active metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-reta-60mg',
    name: 'Retatrutide (60mg)',
    price: 370,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '60mg',
    image: imgReta60,
    cas: '2381272-77-9',
    molecularWeight: '4731.4 g/mol',
    description: 'Triple GIP/GLP-1/glucagon receptor agonist under active metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },

  // ── Semaglutide ──────────────────────────────────────────────────────────────
  {
    id: 'members-sema-10mg',
    name: 'Semaglutide (10mg)',
    price: 65,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '10mg',
    image: imgSema10,
    cas: '910463-68-2',
    molecularWeight: '4113.58 g/mol',
    description: 'GLP-1 receptor agonist widely studied for glucose homeostasis and metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-sema-20mg',
    name: 'Semaglutide (20mg)',
    price: 105,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '20mg',
    image: imgSema20,
    cas: '910463-68-2',
    molecularWeight: '4113.58 g/mol',
    description: 'GLP-1 receptor agonist widely studied for glucose homeostasis and metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-sema-30mg',
    name: 'Semaglutide (30mg)',
    price: 140,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '30mg',
    image: imgSema30,
    cas: '910463-68-2',
    molecularWeight: '4113.58 g/mol',
    description: 'GLP-1 receptor agonist widely studied for glucose homeostasis and metabolic research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },

  // ── Tirzepatide ──────────────────────────────────────────────────────────────
  {
    id: 'members-tirz-10mg',
    name: 'Tirzepatide (10mg)',
    price: 79,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '10mg',
    image: imgTirz10,
    cas: '2023788-19-2',
    molecularWeight: '4813.48 g/mol',
    description: 'Dual GIP/GLP-1 receptor agonist studied extensively in metabolic and adipose tissue research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-tirz-20mg',
    name: 'Tirzepatide (20mg)',
    price: 125,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '20mg',
    image: imgTirz20,
    cas: '2023788-19-2',
    molecularWeight: '4813.48 g/mol',
    description: 'Dual GIP/GLP-1 receptor agonist studied extensively in metabolic and adipose tissue research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-tirz-30mg',
    name: 'Tirzepatide (30mg)',
    price: 175,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '30mg',
    image: imgTirz30,
    cas: '2023788-19-2',
    molecularWeight: '4813.48 g/mol',
    description: 'Dual GIP/GLP-1 receptor agonist studied extensively in metabolic and adipose tissue research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-tirz-40mg',
    name: 'Tirzepatide (40mg)',
    price: 220,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '40mg',
    image: imgTirz40,
    cas: '2023788-19-2',
    molecularWeight: '4813.48 g/mol',
    description: 'Dual GIP/GLP-1 receptor agonist studied extensively in metabolic and adipose tissue research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-tirz-50mg',
    name: 'Tirzepatide (50mg)',
    price: 260,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '50mg',
    image: imgTirz50,
    cas: '2023788-19-2',
    molecularWeight: '4813.48 g/mol',
    description: 'Dual GIP/GLP-1 receptor agonist studied extensively in metabolic and adipose tissue research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-tirz-60mg',
    name: 'Tirzepatide (60mg)',
    price: 295,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '60mg',
    image: imgTirz60,
    cas: '2023788-19-2',
    molecularWeight: '4813.48 g/mol',
    description: 'Dual GIP/GLP-1 receptor agonist studied extensively in metabolic and adipose tissue research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },

  // ── Cagrilintide ─────────────────────────────────────────────────────────────
  {
    id: 'members-cag-2.5mg',
    name: 'Cagrilintide (2.5mg)',
    price: 62,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '2.5mg',
    image: imgCag25,
    cas: '2054934-60-8',
    molecularWeight: '3918.5 g/mol',
    description: 'Long-acting amylin analogue studied for appetite regulation and metabolic homeostasis.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-cag-5mg',
    name: 'Cagrilintide (5mg)',
    price: 89,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '5mg',
    image: imgCag5,
    cas: '2054934-60-8',
    molecularWeight: '3918.5 g/mol',
    description: 'Long-acting amylin analogue studied for appetite regulation and metabolic homeostasis.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },
  {
    id: 'members-cag-10mg',
    name: 'Cagrilintide (10mg)',
    price: 99,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '10mg',
    image: imgCag10,
    cas: '2054934-60-8',
    molecularWeight: '3918.5 g/mol',
    description: 'Long-acting amylin analogue studied for appetite regulation and metabolic homeostasis.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },

  // ── Mazdutide ─────────────────────────────────────────────────────────────────
  {
    id: 'members-maz-100mg',
    name: 'Mazdutide (100mg)',
    price: 110,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '100mg',
    image: imgMaz,
    cas: '2413069-18-6',
    molecularWeight: '3958.4 g/mol',
    description: 'GLP-1/glucagon dual receptor agonist investigated for metabolic and body composition research.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },

  // ── Survodutide ──────────────────────────────────────────────────────────────
  {
    id: 'members-surv-10mg',
    name: 'Survodutide (10mg)',
    price: 165,
    category: 'Metabolic & GLP-1 Related',
    quantityLabel: '10mg',
    image: imgSurv,
    cas: '2381272-15-5',
    molecularWeight: '4638.3 g/mol',
    description: 'GLP-1/glucagon dual receptor agonist studied in metabolic and liver disease research contexts.',
    form: 'Lyophilized powder (vial)',
    purity: '≥99% (third-party tested)',
    storage: 'Refrigerate at 2–8°C after reconstitution',
  },

  // ── Bacteriostatic Water ──────────────────────────────────────────────────
  {
    id: 'members-bac-water-3ml',
    name: 'Reconstitution Water (3mL)',
    price: 15,
    category: 'Accessories',
    quantityLabel: '3mL vial',
    image: imgBac3,
    cas: 'N/A (solvent)',
    molecularWeight: 'N/A (solvent)',
    description: 'USP-grade bacteriostatic water with 0.9% benzyl alcohol for peptide reconstitution. Preserves sterility for up to 28 days after puncture.',
    form: 'Sterile Solution',
    purity: 'USP Grade',
    storage: 'Refrigerate at 2–8°C after opening',
  },
  {
    id: 'members-bac-water-10ml',
    name: 'Reconstitution Water (10mL)',
    price: 22,
    category: 'Accessories',
    quantityLabel: '10mL vial',
    image: imgBac10,
    cas: 'N/A (solvent)',
    molecularWeight: 'N/A (solvent)',
    description: 'Larger volume USP-grade bacteriostatic water ideal for high-volume peptide reconstitution in lab workflows.',
    form: 'Sterile Solution',
    purity: 'USP Grade',
    storage: 'Refrigerate at 2–8°C after opening',
  },
];

function buildGroup(baseName: string, ids: string[]): ProductGroup {
  const variants = ids.map((id) => MEMBERS_PRODUCTS.find((p) => p.id === id)!).filter(Boolean);
  return {
    groupId: ids[0],
    baseName,
    category: 'Metabolic & GLP-1 Related',
    image: variants[0].image,
    description: variants[0].description,
    cas: variants[0].cas,
    molecularWeight: variants[0].molecularWeight,
    variants,
  };
}

export const MEMBERS_GROUPS: ProductGroup[] = [
  buildGroup('Retatrutide', [
    'members-reta-10mg',
    'members-reta-20mg',
    'members-reta-30mg',
    'members-reta-40mg',
    'members-reta-50mg',
    'members-reta-60mg',
  ]),
  buildGroup('Semaglutide', [
    'members-sema-10mg',
    'members-sema-20mg',
    'members-sema-30mg',
  ]),
  buildGroup('Tirzepatide', [
    'members-tirz-10mg',
    'members-tirz-20mg',
    'members-tirz-30mg',
    'members-tirz-40mg',
    'members-tirz-50mg',
    'members-tirz-60mg',
  ]),
  buildGroup('Cagrilintide', [
    'members-cag-2.5mg',
    'members-cag-5mg',
    'members-cag-10mg',
  ]),
  buildGroup('Mazdutide', ['members-maz-100mg']),
  buildGroup('Survodutide', ['members-surv-10mg']),
];
