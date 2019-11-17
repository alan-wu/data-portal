exports.Overview = function(maplibIn) {
    let instance = undefined;
	const maplib = maplibIn;
	let scaffoldModule = undefined;
	let scaffoldDialog = undefined;
	let plotsvyModule = undefined;
	let plotsvyDialog = undefined;

	const dialogDestroyed = function() {
		return function(myInstance) {
			if (myInstance) {
				if (myInstance === scaffoldDialog) {
					scaffoldDialog = undefined;
					scaffoldModule = undefined;
				} else if (myInstance === plotsvyDialog) {
					plotsvyModule = undefined;
					plotsvyDialog = undefined;
				}
			}
		}
	};

	this.displayData = function(parent, url) {
		if (!plotsvyModule) {
			let newModule = new maplib.PlotsvyModule(undefined);
			if (newModule) {
				let options = {"url":url};
				let newDialog = new maplib.PlotsvyDialog(newModule, parent, options);
				if (newDialog) {
					newDialog.destroyModuleOnClose = true;
					newDialog.showCloseButton();
					newDialog.beforeCloseCallbacks.push(dialogDestroyed());
					newDialog.module.addBroadcastChannels("sparc-mapcore-linear");
					newDialog.setHeight("50%");
					newDialog.setPosition("75%", "50%");
					plotsvyModule = newModule;
					plotsvyDialog = newDialog;
				}
			}
		} else {
			plotsvyModule.openCSV(url);
		}
	}
	

	this.display3DScaffold = function(parent, url) {
		if (!scaffoldModule) {
			let newModule = new maplib.physiomeportal.OrgansViewer(undefined);
			if (newModule) {
				let newDialog = new maplib.physiomeportal.OrgansViewerDialog(newModule, parent);
				if (newDialog) {
					newDialog.destroyModuleOnClose = true;
					newDialog.showCloseButton();
					newDialog.beforeCloseCallbacks.push(dialogDestroyed());
					newDialog.module.addBroadcastChannels("sparc-mapcore-linear");
					newDialog.setWidth("25%");
					newDialog.setHeight("50%");
					newDialog.setPosition("75%", "0%");
					scaffoldModule = newModule;
					scaffoldDialog = newDialog;
				}
			}
		}
		if (scaffoldModule) {
			scaffoldModule.loadOrgansFromURL(url, undefined, undefined, "Overlay", undefined);
			scaffoldModule.addBroadcastChannels("sparc-mapcore-linear");
		}
    }
};