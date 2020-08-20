import { GridOptionsWrapper } from "../../gridOptionsWrapper";
import { Autowired } from "../../context/context";
import { Component } from "../../widgets/component";
import { IComponent } from "../../interfaces/iComponent";

export interface ICustomOverlayParams {}

export interface ICustomOverlayComp extends IComponent<ICustomOverlayParams> {}

export class CustomOverlayComponent extends Component implements ICustomOverlayComp {

  private static DEFAULT_CUSTOM_OVERLAY_TEMPLATE = '<span class="ag-overlay-loading-center" ref="customMessage"></span>';

  @Autowired('gridOptionsWrapper') gridOptionsWrapper: GridOptionsWrapper;

  constructor() {
    super();
  }

  public init(params: ICustomOverlayParams): void {
    const template =
        this.gridOptionsWrapper.getOverlayCustomTemplate() ?
        this.gridOptionsWrapper.getOverlayCustomTemplate() : CustomOverlayComponent.DEFAULT_CUSTOM_OVERLAY_TEMPLATE;

    this.setTemplate(template);
  }
}
