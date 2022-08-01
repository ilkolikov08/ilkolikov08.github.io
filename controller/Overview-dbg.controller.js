"use strict";

sap.ui.define(["sap/btp/ui5challange/controller/App.controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/Fragment", "sap/m/SearchField", "sap/ui/model/json/JSONModel"],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function (BaseController, Filter, FilterOperator, Fragment, SearchField, JSONModel) {
  "use strict";

  return BaseController.extend("sap.btp.ui5challange.controller.Overview", {
    onInit: function onInit() {
      this._initLocalModel();

      this._initFilterBar();
    },
    _initLocalModel: function _initLocalModel() {
      var oModel = new JSONModel();
      var oOwnerComponent = this.getOwnerComponent();
      oModel.loadData("./model/mock.json");
      oOwnerComponent.setModel(oModel);
    },

    /**
     * Initialize the filter bar and basic search field
     * populates {controller} with oFilterBar and oSearchField properties
     * @returns {sap.ui.comp.filterbar.FilterBar}
     */
    _initFilterBar: function _initFilterBar() {
      this.oFilterBar = this.byId("FilterBar");
      this.oBasicSearch = new SearchField("BasicSearch", {
        liveChange: this.onSearch.bind(this)
      });
      this.oFilterBar.registerGetFiltersWithValues(this.fGetFiltersWithValues);
      this.oFilterBar.fireInitialise();
      this.oFilterBar.setBasicSearch(this.oBasicSearch);
    },

    /**
     * Event handler for the search field
     * and filterbar group items change event
     * If no search query given or filters set - resets the filter
     * @param {sap.ui.base.Event} oEvent
     */
    onSearch: function onSearch(oEvent) {
      var sQuery = this.oFilterBar.getBasicSearchValue().trim();

      var aFiltersWithValue = this.oFilterBar._getFiltersWithValues();

      var bResetBinding = sQuery.length === 0 && aFiltersWithValue.length === 0;
      var oTable = this.byId("OverviewTable");
      var oBinding = oTable.getBinding("items");
      var aFilters = [];
      if (bResetBinding) return oBinding.filter([]);

      if (aFiltersWithValue.length > 0) {
        aFilters = aFiltersWithValue.map(this.getModelFilters);
      }

      if (sQuery.length > 0) {
        aFilters.push(new Filter("app_id", FilterOperator.Contains, sQuery));
      }

      oBinding.filter(new Filter(aFilters, false));
    },

    /**
     * A function to register private sap.ui.comp.filterbar.FilterBar
     * method getFiltersWithValues
     * @returns {sap.ui.comp.filterbar.FilterGroupItem[]}
     */
    fGetFiltersWithValues: function fGetFiltersWithValues() {
      var _this = this;

      var aFilterItems = this.getFilterGroupItems();
      var aFiltersWithValue = [];
      aFilterItems.forEach(function (oItem) {
        var oControl = _this.determineControlByFilterItem(oItem);

        if (oControl && oControl.getValue && oControl.getValue()) {
          aFiltersWithValue.push(oItem);
        }
      });
      return aFiltersWithValue;
    },

    /**
     * Method that clears the filterbar Comboboxes
     * and BasicSearchField values and triggers binding refresh
     * @param {sap.ui.base.Event} oEvent
     */
    onClear: function onClear(oEvent) {
      var aFiltersWithValues = this.oFilterBar._getFiltersWithValues();

      var oTable = this.byId("OverviewTable");
      var oBinding = oTable.getBinding("items");
      aFiltersWithValues.forEach(function (oGroupItem) {
        var oControl = oGroupItem.getControl();
        oControl.setSelectedKey("");
      });
      this.oBasicSearch.setValue("");
      oBinding.filter([]);
    },

    /**
     * Method to get the service field name in CustomData
     * and selected key from Comboboxes and build a filter
     * @param {sap.ui.comp.filterbar.getFilterGroupItem} oGroupItem
     * @returns {sap.ui.model.Filter}
     */
    getModelFilters: function getModelFilters(oGroupItem) {
      var oControl = oGroupItem.getControl();
      var sProperty = oControl.data("filterProperty");
      var sSearchValue = oControl.getSelectedKey() || oControl.getValue();
      var oFilter = new Filter(sProperty, FilterOperator.EQ, sSearchValue);
      return oFilter;
    },

    /**
     * Input valueHelpRequest event handler
     * loads and opens the SelectDialog fragment
     * @param {sap.ui.base.Event} oEvent
     */
    handleValueHelp: function handleValueHelp(oEvent) {
      var _this2 = this;

      var oView = this.getView();
      var oSource = oEvent.getSource();
      this._sInputId = oSource.getId(); // create value help dialog

      if (!this._oSelectDialog) {
        Fragment.load({
          id: oView.getId(),
          name: "sap.btp.ui5challange.view.fragments.Dialog",
          controller: this
        }).then(function (oSelectDialog) {
          oView.addDependent(oSelectDialog);
          _this2._oSelectDialog = oSelectDialog;

          _this2._oSelectDialog.open();
        });
      } else {
        this._oSelectDialog.open();
      }
    },

    /**
     * Event handler for SelectDialog liveChange event
     * @param {sap.ui.base.Event} oEvent
     */
    handleSelectDialogSearch: function handleSelectDialogSearch(oEvent) {
      var oSource = oEvent.getSource();
      var sValue = oEvent.getParameter("value");
      var oBinding = oSource.getBinding("items");
      var oFilter = new Filter("assign_group", FilterOperator.Contains, sValue);
      oBinding.filter([oFilter]);
    },

    /**
     * Event handler for the confirm event of the value help dialog
     * sets the value of the input and resets the dialog binding
     * @param {sap.ui.base.Event} oEvent
     */
    handleSelectDialogClose: function handleSelectDialogClose(oEvent) {
      var oSource = oEvent.getSource();
      var oSelectedItem = oEvent.getParameter("selectedItem");
      var oBinding = oSource.getBinding("items");

      if (oSelectedItem) {
        var productInput = this.byId(this._sInputId);
        productInput.setValue(oSelectedItem.getTitle());
      }

      oBinding.filter([]);
      this.oFilterBar.fireSearch(oEvent);
    },

    /**
     * Handels binding filtering in case of input value being cleaned
     * @param {sap.ui.base.Event} oEvent
     * @returns
     */
    onInputChange: function onInputChange(oEvent) {
      var sValue = oEvent.getParameter("value").trim();
      if (sValue) return;
      this.oFilterBar.fireSearch(oEvent);
    },

    /**
     * Event handler for dialog cancel event
     * refreshes the items binding in case of cancel button is pressed
     * @param {sap.ui.base.Event} oEvent
     */
    handleSelectDialogCancel: function handleSelectDialogCancel(oEvent) {
      var oSource = oEvent.getSource();
      var oBinding = oSource.getBinding("items");
      oBinding.filter([]);
    }
  });
});