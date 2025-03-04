import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import DefaultTheme from '../../../../services/emt-themes/default';
import ModelsTableColumn from '../../../../utils/emt/emt-column';
import { ModelsTableDataItem } from 'ember-models-table/components/models-table';

export interface RowFilteringCellArgs {
  /**
   * Bound from {@link DefaultTheme.RowFilteringArgs.themeInstance | RowFilteringArgs.themeInstance}
   */
  themeInstance: DefaultTheme;
  /**
   * Current column. One item from {@link Core.ModelsTable.processedColumns | ModelsTable.processedColumns}
   */
  column: ModelsTableColumn;
  /**
   * Bound from {@link DefaultTheme.RowFilteringArgs.data | RowFilteringArgs.data}
   */
  data: ModelsTableDataItem[];
  /**
   * Bound from {@link DefaultTheme.RowFilteringArgs.selectedItems | RowFilteringArgs.selectedItems}
   */
  selectedItems: ModelsTableDataItem[];
  /**
   * Bound from {@link DefaultTheme.RowFilteringArgs.expandedItems | RowFilteringArgs.expandedItems}
   */
  expandedItems: ModelsTableDataItem[];
  /**
   * Bound from {@link DefaultTheme.RowFilteringArgs.expandAllRows | RowFilteringArgs.expandAllRows}
   *
   * @event expandAllRows
   */
  expandAllRows: () => void;
  /**
   * Bound from {@link DefaultTheme.RowFilteringArgs.collapseAllRows | RowFilteringArgs.collapseAllRows}
   *
   * @event collapseAllRows
   */
  collapseAllRows: () => void;
  /**
   * Bound from {@link DefaultTheme.RowFilteringArgs.toggleAllSelection | RowFilteringArgs.toggleAllSelection}
   *
   * @event toggleAllSelection
   */
  toggleAllSelection: () => void;
  /**
   * Bound from {@link DefaultTheme.RowFilteringArgs.changeColumnFilter | RowFilteringArgs.changeColumnFilter}
   *
   * @event changeColumnFilter
   */
  changeColumnFilter: (v: string, column: ModelsTableColumn) => void;
}

/**
 * Filter-row cell used within {@link DefaultTheme.RowFiltering}.
 *
 * ```html
 * <ModelsTable @data={{this.data}} @columns={{this.columns}} as |MT|>
 *   <MT.Table as |Table|>
 *     <Table.Header as |Header|>
 *       <Header.RowFiltering as |RF|>
 *         {{#each MT.visibleProcessedColumns as |column|}}
 *           <RF.RowFilteringCell @column={{column}} />
 *         {{/each}}
 *       </Header.RowFiltering>
 *       {{! ... }}
 *     </Table.Header>
 *     {{! ... }}
 *   </MT.Table>
 *   {{! .... }}
 * </ModelsTable>
 * ```
 *
 * If {@link Core.ModelsTableColumn.componentForFilterCell} is provided it is yielded with next properties and actions:
 *
 * * `column` - {@link DefaultTheme.RowFilteringCellArgs.column}
 * * `selectedItems` - {@link DefaultTheme.RowFilteringCellArgs.selectedItems}
 * * `expandedItems` - {@link DefaultTheme.RowFilteringCellArgs.expandedItems}
 * * `data` - {@link DefaultTheme.RowFilteringCellArgs.data}
 * * `themeInstance` - {@link DefaultTheme.RowFilteringCellArgs.themeInstance}
 * * `expandAllRows` - {@link DefaultTheme.RowFilteringCellArgs.expandAllRows}
 * * `collapseAllRows` - {@link DefaultTheme.RowFilteringCellArgs.collapseAllRows}
 * * `toggleAllSelection` - {@link DefaultTheme.RowFilteringCellArgs.toggleAllSelection}
 * * `updateColumnFilter` - {@link updateColumnFilter}
 * * `clearColumnFilter` - {@link clearColumnFilter}
 *
 * References to the following actions are yielded:
 *
 * * {@link updateColumnFilter} - update filter for current column
 * * {@link clearColumnFilter} - clear filter for current column
 *
 * ```html
 * <ModelsTable @data={{this.data}} @columns={{this.columns}} as |MT|>
 *   <MT.Table as |Table|>
 *     <Table.Header as |Header|>
 *       <Header.RowFiltering as |RF|>
 *         {{#each MT.visibleProcessedColumns as |column|}}
 *           <RF.RowFilteringCell @column={{column}} as |RFC|>
 *             <RFC.CellContent/>
 *           </RF.RowFilteringCell>
 *         {{/each}}
 *       </Header.RowFiltering>
 *       {{! ... }}
 *     </Table.Header>
 *     {{! ... }}
 *   </MT.Table>
 *   {{! .... }}
 * </ModelsTable>
 * ```
 */
export default class RowFilteringCell extends Component<RowFilteringCellArgs> {
  protected elementId = guidFor(this);

  protected get filteringClassName(): string {
    return this.args.column.useFilter
      ? ''
      : this.args.themeInstance.theadCellNoFiltering;
  }

  protected get inputId(): string {
    return `${this.elementId}-column-filter`;
  }

  protected getNewFilterValueFromEvent(e: Event | string): string {
    return typeof e === 'object'
      ? ((e as Event).target as HTMLInputElement).value
      : `${e}`;
  }

  /**
   * @event noop
   */
  @action
  protected noop(e: Event): void {
    e?.stopPropagation?.();
  }

  /**
   * @event updateColumnFilter
   */
  @action
  updateColumnFilter(e: Event | string): boolean {
    const newFilterValue = this.getNewFilterValueFromEvent(e);
    this.args.changeColumnFilter(newFilterValue, this.args.column);
    return false;
  }

  /**
   * @event clearColumnFilter
   */
  @action
  clearColumnFilter(e: Event): boolean {
    e?.stopPropagation?.();
    this.args.changeColumnFilter('', this.args.column);
    return false;
  }
}
