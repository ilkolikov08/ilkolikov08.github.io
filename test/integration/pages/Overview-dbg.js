"use strict";

sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
  "use strict";

  var sViewName = "Overview";
  Opa5.createPageObjects({
    onTheViewPage: {
      actions: {},
      assertions: {
        iShouldSeeThePageView: function iShouldSeeThePageView() {
          return this.waitFor({
            id: "page",
            viewName: sViewName,
            success: function success() {
              Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
            },
            errorMessage: "Did not find the " + sViewName + " view"
          });
        }
      }
    }
  });
});