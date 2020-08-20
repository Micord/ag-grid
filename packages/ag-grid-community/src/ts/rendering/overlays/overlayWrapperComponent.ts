import { GridOptionsWrapper } from "../../gridOptionsWrapper";
import { Autowired } from "../../context/context";
import { Component } from "../../widgets/component";
import { IComponent } from "../../interfaces/iComponent";
import { ComponentRecipes } from "../../components/framework/componentRecipes";
import { Constants } from "../../constants";
import { _ } from '../../utils';

export interface IOverlayWrapperParams {}

export interface IOverlayWrapperComp extends IComponent<IOverlayWrapperParams> {
    showLoadingOverlay(eOverlayWrapper: HTMLElement): void;

    showLoadingOverlayWithText(eOverlayWrapper: HTMLElement, message: string): void;

    showCustomOverlayWithText(eOverlayWrapper: HTMLElement, message: string): void;

    showErrorOverlayWithText(eOverlayWrapper: HTMLElement, message: string): void;

    showNoRowsOverlayWithText(eOverlayWrapper: HTMLElement, message: string): void;

    showNoRowsOverlay(eOverlayWrapper: HTMLElement): void;

    hideOverlay(eOverlayWrapper: HTMLElement): void;
}

export class OverlayWrapperComponent extends Component implements IOverlayWrapperComp {
    // wrapping in outer div, and wrapper, is needed to center the loading icon
    // The idea for centering came from here: http://www.vanseodesign.com/css/vertical-centering/
    private static LOADING_WRAPPER_OVERLAY_TEMPLATE =
        '<div class="ag-overlay-panel" role="presentation">' +
        '<div class="ag-overlay-wrapper ag-overlay-loading-wrapper" ref="loadingOverlayWrapper">[OVERLAY_TEMPLATE]</div>' +
        '</div>';

    private static CUSTOM_WRAPPER_OVERLAY_TEMPLATE =
        '<div class="ag-overlay-panel" role="presentation">' +
        '<div class="ag-overlay-wrapper ag-overlay-loading-wrapper" ref="customOverlayWrapper">[OVERLAY_TEMPLATE]</div>' +
        '</div>';

    private static ERROR_WRAPPER_OVERLAY_TEMPLATE =
        '<div class="ag-overlay-panel" role="presentation">' +
        '<div class="ag-overlay-wrapper ag-overlay-loading-wrapper" ref="errorOverlayWrapper">[OVERLAY_TEMPLATE]</div>' +
        '</div>';

    private static NO_ROWS_WRAPPER_OVERLAY_TEMPLATE =
        '<div class="ag-overlay-panel" role="presentation">' +
        '<div class="ag-overlay-wrapper ag-overlay-no-rows-wrapper" ref="noRowsOverlayWrapper">[OVERLAY_TEMPLATE]</div>' +
        '</div>';

    @Autowired('gridOptionsWrapper') gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('componentRecipes') componentRecipes: ComponentRecipes;

    constructor() {
        super();
    }

    public init(): void {}

    public showLoadingOverlay(eOverlayWrapper: HTMLElement): void {
        this.setTemplate(OverlayWrapperComponent.LOADING_WRAPPER_OVERLAY_TEMPLATE);

        this.componentRecipes.newLoadingOverlayComponent().then(renderer => {
            const loadingOverlayWrapper: HTMLElement = this.getRefElement("loadingOverlayWrapper");
            _.removeAllChildren(loadingOverlayWrapper);
            loadingOverlayWrapper.appendChild(renderer.getGui());
        });

        this.showOverlay(eOverlayWrapper, this.getGui());
    }

    public showNoRowsOverlay(eOverlayWrapper: HTMLElement): void {
        this.setTemplate(OverlayWrapperComponent.NO_ROWS_WRAPPER_OVERLAY_TEMPLATE);

        // we don't use gridOptionsWrapper.addLayoutElement here because this component
        // is passive, we don't want to add a new element each time it is created.
        const eNoRowsOverlayWrapper = this.getRefElement('noRowsOverlayWrapper');

        const domLayout = this.gridOptionsWrapper.getDomLayout();
        const domLayoutAutoHeight = domLayout === Constants.DOM_LAYOUT_AUTO_HEIGHT;
        const domLayoutPrint = domLayout === Constants.DOM_LAYOUT_PRINT;
        const domLayoutNormal = domLayout === Constants.DOM_LAYOUT_NORMAL;

        _.addOrRemoveCssClass(eNoRowsOverlayWrapper, 'ag-layout-auto-height', domLayoutAutoHeight);
        _.addOrRemoveCssClass(eNoRowsOverlayWrapper, 'ag-layout-normal', domLayoutNormal);
        _.addOrRemoveCssClass(eNoRowsOverlayWrapper, 'ag-layout-print', domLayoutPrint);

        this.componentRecipes.newNoRowsOverlayComponent().then(renderer => {
            const noRowsOverlayWrapper: HTMLElement = this.getRefElement("noRowsOverlayWrapper");
            _.removeAllChildren(noRowsOverlayWrapper);
            noRowsOverlayWrapper.appendChild(renderer.getGui());
        });

        this.showOverlay(eOverlayWrapper, this.getGui());
    }

    public showLoadingOverlayWithText(eOverlayWrapper: HTMLElement, message: string): void {
        this.setTemplate(OverlayWrapperComponent.LOADING_WRAPPER_OVERLAY_TEMPLATE);

        this.componentRecipes.newLoadingOverlayComponent().then(renderer => {
            const loadingOverlayWrapper: HTMLElement = this.getRefElement("loadingOverlayWrapper");
            _.removeAllChildren(loadingOverlayWrapper);
            loadingOverlayWrapper.appendChild(renderer.getGui());

            if (message) {
                this.getRefElement("loadingMessage").innerText = message;
            }
        });
        this.showOverlay(eOverlayWrapper, this.getGui());
    }

    public showCustomOverlayWithText(eOverlayWrapper: HTMLElement, message: string): void {
        this.setTemplate(OverlayWrapperComponent.CUSTOM_WRAPPER_OVERLAY_TEMPLATE);

        this.componentRecipes.newCustomOverlayComponent().then(renderer => {
            const customOverlayWrapper: HTMLElement = this.getRefElement("customOverlayWrapper");
            _.removeAllChildren(customOverlayWrapper);
            customOverlayWrapper.appendChild(renderer.getGui());

            if (message) {
                this.getRefElement("customMessage").innerText = message;
            }
        });
        this.showOverlay(eOverlayWrapper, this.getGui());
    }

    public showErrorOverlayWithText(eOverlayWrapper: HTMLElement, message: string): void {
        this.setTemplate(OverlayWrapperComponent.ERROR_WRAPPER_OVERLAY_TEMPLATE);

        this.componentRecipes.newErrorOverlayComponent().then(renderer => {
            const errorOverlayWrapper: HTMLElement = this.getRefElement("errorOverlayWrapper");
            _.removeAllChildren(errorOverlayWrapper);
            errorOverlayWrapper.appendChild(renderer.getGui());

            if (message) {
                this.getRefElement("errorMessage").innerText = message;
            }
        });
        this.showOverlay(eOverlayWrapper, this.getGui());
    }

    public showNoRowsOverlayWithText(eOverlayWrapper: HTMLElement, message: string): void {
        this.setTemplate(OverlayWrapperComponent.NO_ROWS_WRAPPER_OVERLAY_TEMPLATE);

        // we don't use gridOptionsWrapper.addLayoutElement here because this component
        // is passive, we don't want to add a new element each time it is created.
        const eNoRowsOverlayWrapper = this.getRefElement('noRowsOverlayWrapper');

        const domLayout = this.gridOptionsWrapper.getDomLayout();
        const domLayoutAutoHeight = domLayout === Constants.DOM_LAYOUT_AUTO_HEIGHT;
        const domLayoutPrint = domLayout === Constants.DOM_LAYOUT_PRINT;
        const domLayoutNormal = domLayout === Constants.DOM_LAYOUT_NORMAL;

        _.addOrRemoveCssClass(eNoRowsOverlayWrapper, 'ag-layout-auto-height', domLayoutAutoHeight);
        _.addOrRemoveCssClass(eNoRowsOverlayWrapper, 'ag-layout-normal', domLayoutNormal);
        _.addOrRemoveCssClass(eNoRowsOverlayWrapper, 'ag-layout-print', domLayoutPrint);

        this.componentRecipes.newNoRowsOverlayComponent().then(renderer => {
            const noRowsOverlayWrapper: HTMLElement = this.getRefElement("noRowsOverlayWrapper");
            _.removeAllChildren(noRowsOverlayWrapper);
            noRowsOverlayWrapper.appendChild(renderer.getGui());

            if (message) {
                this.getRefElement("noRowsMessage").innerText = message;
            }
        });
        this.showOverlay(eOverlayWrapper, this.getGui());
    }

    public hideOverlay(eOverlayWrapper: HTMLElement): void {
        _.removeAllChildren(eOverlayWrapper);
        _.setVisible(eOverlayWrapper, false);
    }

    private showOverlay(eOverlayWrapper: HTMLElement, overlay: HTMLElement): void {
        if (overlay) {
            _.removeAllChildren(eOverlayWrapper);
            _.setVisible(eOverlayWrapper, true);
            eOverlayWrapper.appendChild(overlay);
        } else {
            console.warn('ag-Grid: unknown overlay');
            this.hideOverlay(eOverlayWrapper);
        }
    }
}
