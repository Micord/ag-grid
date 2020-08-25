import {Autowired, Bean} from "../context/context";
import {GridOptionsWrapper} from "../gridOptionsWrapper";
import {ColumnController} from "../columnController/columnController";
import {GridApi} from "../gridApi";
import {MenuItemDef} from "../entities/gridOptions";
import {Column} from "../entities/column";
import {_, Utils} from "../utils";

@Bean('menuItemMapper')
export class MenuItemMapper {

    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('columnController') private columnController: ColumnController;
    @Autowired('gridApi') private gridApi: GridApi;

    public mapWithStockItems(originalList: (MenuItemDef | string)[], column: Column | null): (MenuItemDef | string)[] {
        if (!originalList) { return []; }

        const resultList: (MenuItemDef | string)[] = [];

        originalList.forEach(menuItemOrString => {
            let result: MenuItemDef | string | null;

            if (typeof menuItemOrString === 'string') {
                result = this.getStockMenuItem(menuItemOrString as string, column);
            } else {
                result = menuItemOrString;
            }
            if ((result as MenuItemDef).subMenu) {
                const resultDef = result as MenuItemDef;
                resultDef.subMenu = this.mapWithStockItems(resultDef.subMenu!, column);
            }
            if (result != null) {
                resultList.push(result);
            }
        });

        return resultList;
    }

    private getStockMenuItem(key: string, column: Column | null): MenuItemDef | string | null {

        const localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();

        switch (key) {
            case 'pinSubMenu': return {
                name: localeTextFunc('pinColumn', 'Pin Column'),
                icon: Utils.createIconNoSpan('menuPin', this.gridOptionsWrapper, null),
                subMenu: ['pinLeft', 'pinRight', 'clearPinned']
            };
            case 'pinLeft': return {
                name: localeTextFunc('pinLeft', 'Pin Left'),
                action: () => this.columnController.setColumnPinned(column, Column.PINNED_LEFT, "contextMenu"),
                checked: (column as Column).isPinnedLeft()
            };
            case 'pinRight': return {
                name: localeTextFunc('pinRight', 'Pin Right'),
                action: () => this.columnController.setColumnPinned(column, Column.PINNED_RIGHT, "contextMenu"),
                checked: (column as Column).isPinnedRight()
            };
            case 'clearPinned': return {
                name: localeTextFunc('noPin', 'No Pin'),
                action: () => this.columnController.setColumnPinned(column, null, "contextMenu"),
                checked: !(column as Column).isPinned()
            };
            case 'autoSizeThis': return {
                name: localeTextFunc('autosizeThiscolumn', 'Autosize This Column'),
                action: () => this.columnController.autoSizeColumn(column, "contextMenu")
            };
            case 'autoSizeAll': return {
                name: localeTextFunc('autosizeAllColumns', 'Autosize All Columns'),
                action: () => this.columnController.autoSizeAllColumns("contextMenu")
            };
            case 'rowGroup': return {
                name: localeTextFunc('groupBy', 'Group by') + ' ' + _.escape(this.columnController.getDisplayNameForColumn(column, 'header')),
                action: () => this.columnController.addRowGroupColumn(column, "contextMenu"),
                icon: Utils.createIconNoSpan('menuAddRowGroup', this.gridOptionsWrapper, null)
            };
            case 'rowUnGroup': return {
                name: localeTextFunc('ungroupBy', 'Un-Group by') + ' ' + _.escape(this.columnController.getDisplayNameForColumn(column, 'header')),
                action: () => this.columnController.removeRowGroupColumn(column, "contextMenu"),
                icon: Utils.createIconNoSpan('menuRemoveRowGroup', this.gridOptionsWrapper, null)
            };
            case 'resetColumns': return {
                name: localeTextFunc('resetColumns', 'Reset Columns'),
                action: () => this.columnController.resetColumnState("contextMenu")
            };
            case 'expandAll': return {
                name: localeTextFunc('expandAll', 'Expand All'),
                action: () => this.gridApi.expandAll()
            };
            case 'contractAll': return {
                name: localeTextFunc('collapseAll', 'Collapse All'),
                action: () => this.gridApi.collapseAll()
            };
            case 'export':
                const exportSubMenuItems:string[] = [];
                if (!this.gridOptionsWrapper.isSuppressCsvExport()) {
                    exportSubMenuItems.push('csvExport');
                }
                if (!this.gridOptionsWrapper.isSuppressExcelExport()) {
                    exportSubMenuItems.push('excelExport');
                    exportSubMenuItems.push('excelXMLExport');
                }
                return {
                    name: localeTextFunc('export', 'Export'),
                    subMenu: exportSubMenuItems
                };
            case 'csvExport': return {
                name: localeTextFunc('csvExport', 'CSV Export'),
                action: () => this.gridApi.exportDataAsCsv({})
            };
            case 'excelExport': return {
                name: localeTextFunc('excelExport', 'Excel Export (.xlsx)'),
                action: () => this.gridApi.exportDataAsExcel({
                    exportMode: 'xlsx'
                })
            };
            case 'excelXMLExport': return {
                name: localeTextFunc('excelXMLExport', 'Excel Export (.xml)'),
                action: () => this.gridApi.exportDataAsExcel({
                    exportMode: 'xml'
                })
            };
            case 'separator': return 'separator';
            default:
                console.warn(`ag-Grid: unknown menu item type ${key}`);
                return null;
        }
    }
}
