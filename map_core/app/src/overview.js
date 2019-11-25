exports.Overview = function(maplibIn, tabManagerIn) {
    let instance = undefined;
	const maplib = maplibIn;
	const tabManager = tabManagerIn;
	let scaffoldModule = undefined;
	let scaffoldDialog = undefined;
	let plotsvyModule = undefined;
	let plotsvyDialog = undefined;

	const dock = function(dialog) {
		return function() {
			
		}
	}

	const overwriteDialogMaximiseCallback = function(dialog, callback) {
		let element = dialog.container.parent().find('#iconExpand');
		element.unbind( "click" );
		element.click(callback);
		//$(this).dialog('widget').find('.ui-dialog-title')
		//window.clickElement = element
		//element.addEventListener("click", dock);

	}

	const createDataViewer = function (organ, annotation, url) {
		return function() {
			if (tabManager) {
			let options = {"url":url};
			let data = tabManager.createDialog("Data Viewer", options);
			let title = annotation + "(Data)";
			if (organ)
				title = organ + " " + title;
					data.module.setName(title);
					
			}
			tabManager.setTitle(data, title);
		}
	  };

	const createOrganViewer = function (species, organ, annotation, url) {
		return function() {
			if (tabManager) {
				let data = tabManager.createDialog("Organ Viewer");
				data.module.loadOrgansFromURL(url, species, organ, annotation);
				let title = annotation + "(Scaffold)";
				if (organ)
					title = organ + " " + title;
				data.module.setName(title);
				tabManager.setTitle(data, title);
				let viewport = scaffoldModule.zincRenderer.getCurrentScene().getZincCameraControls().getCurrentViewport();
				data.module.zincRenderer.getCurrentScene().loadView(viewport);
			}
		}
	};


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
					newDialog.setWidth("30%");
					newDialog.setHeight("50%");
					newDialog.setPosition("70%", "50%");
					overwriteDialogMaximiseCallback(newDialog,createDataViewer(undefined, "Docked", url) );
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
					newDialog.setWidth("30%");
					newDialog.setHeight("50%");
					newDialog.setPosition("70%", "0%");
					overwriteDialogMaximiseCallback(newDialog, createOrganViewer(undefined, undefined, "Docked", url));
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