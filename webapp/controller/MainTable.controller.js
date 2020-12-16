sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("mdonamcve.controller.MainTable", {
		localVariables: {
			isCheckFilterDefined : false,
			isImageFilterDefined : false,
			pageRendered: "no"
		},
		
		onShowSelected: function() {
			var oTable = this.byId("table");
			var oBinding = oTable.getBinding("rows");
			var oContext, i;
			
			// initialize support field to false to avoid unexpected behaviours
			for (i = 0; i < oBinding.iLength; i++) {
				oContext = oTable.getContextByIndex(i);
				this.getView().getModel().setProperty(oContext.sPath + "/Checked", false);
			}
			
			var selectedIndices = oTable.getSelectedIndices();
			for (i = 0; i < selectedIndices.length; i++) {
				oContext = oTable.getContextByIndex(selectedIndices[i]);
				this.getView().getModel().setProperty(oContext.sPath + "/Checked", true);
			}
			
			this.mCheckFilter = new Filter({
				path: "Checked",
				operator: FilterOperator.EQ,
				value1: true
			});
			
			var aFilters = [];
			//aFilters.push(this.mPreFilters); //I had an array of other filters coming from a different page
			aFilters.push(this.mCheckFilter);
			
			this.mCombinedFilter = new Filter({
				filters: aFilters,
				and: true
			});
			
			this.localVariables.isCheckFilterDefined = true;
			oTable.getBinding("rows").filter(this.mCombinedFilter, "Application");
		},
		
		clearAllFilters: function() {
			var oTable = this.byId("table");
			var aColumns = oTable.getColumns();

			// remove column filters
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}
			
			var oBinding = oTable.getBinding("rows");
			for (i = 0; i < oBinding.iLength; i++) {
				var oContext = oTable.getContextByIndex(i);
				this.getView().getModel().setProperty(oContext.sPath + "/Checked", false);
			}
			
			oBinding.filter([], "Application");

			this.localVariables.isImageFilterDefined = false;
			this.localVariables.isCheckFilterDefined = false;
		}
	});
});