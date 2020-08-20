import { GridOptionsWrapper } from "../../gridOptionsWrapper";
import { Autowired } from "../../context/context";
import { Component } from "../../widgets/component";
import { IComponent } from "../../interfaces/iComponent";

export interface IErrorOverlayParams {}

export interface IErrorOverlayComp extends IComponent<IErrorOverlayParams> {}

export class ErrorOverlayComponent extends Component implements IErrorOverlayComp {

  private static DEFAULT_ERROR_OVERLAY_TEMPLATE = '<span class="ag-overlay-loading-center" style="background-color: lightcoral;" ref="errorMessage">Error occurred</span>';

  @Autowired('gridOptionsWrapper') gridOptionsWrapper: GridOptionsWrapper;

  constructor() {
    super();
  }

  public init(params: IErrorOverlayParams): void {
    const template =
        this.gridOptionsWrapper.getOverlayErrorTemplate() ?
        this.gridOptionsWrapper.getOverlayErrorTemplate() : ErrorOverlayComponent.DEFAULT_ERROR_OVERLAY_TEMPLATE;

    this.setTemplate(template);
  }
}
