export type EntityDialogMode = 'create' | 'view' | 'edit';

export interface EntityDialogData<T> {
  mode: EntityDialogMode;
  item?: T;
}
