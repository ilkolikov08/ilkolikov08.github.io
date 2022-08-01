"use strict";

sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
  "use strict";

  var sViewName = "App";
  Opa5.createPageObjects({
    onTheAppPage: {
      actions: {},
      assertions: {
        iShouldSeeTheApp: function iShouldSeeTheApp() {
          return this.waitFor({
            id: "app",
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