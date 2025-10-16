export type Puesto = {
  id?: number;
  codigo: string;
  nombre: string;
  tipo: 'con_meson' | 'sin_meson' | 'con_panchos' | 'acampar';
  precio_base: number;
};
