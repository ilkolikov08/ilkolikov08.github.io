"use strict";sap.ui.define(["./flpSandbox","sap/ui/fl/FakeLrepConnectorLocalStorage","sap/m/MessageBox"],function(e,n,o){"use strict";e.init().then(function(){n.enableFakeConnector()},function(e){o.error(e.message)})});