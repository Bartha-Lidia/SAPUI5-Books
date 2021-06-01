sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/resource/ResourceModel"
], function (Controller) {
    "use strict";
    let path = ""
    return Controller.extend("org.ubb.books.controller.BookList", {

        onDelete(oEvent) {
            const path = oEvent.getSource().getBindingContext().getPath();
            const model = this.getView().getModel();
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            const confirmDelete = oBundle.getText("deleteConfirm")
            const deleteSuccess = oBundle.getText("deleteSuccess");
            const deleteError = oBundle.getText("deleteError");
            const dialog = new sap.m.Dialog({
                type: 'Message',
                content: new sap.m.Text({text: confirmDelete}),
                beginButton: new sap.m.Button({
                    text: 'Delete',
                    press: function () {
                        model.remove(path, {
                            success: function(data) {
                                sap.m.MessageToast.show(deleteSuccess);
                            },
                            error: function(e) {
                                sap.m.MessageToast.show(deleteError);
                            }
                        });
                        dialog.close();
                    }
                }),
                endButton: new sap.m.Button({
                    text: 'Cancel',
                    press: function () {
                        dialog.close();
                    }
                }),

                afterClose: function (oEvent) {
                    dialog.destroy();
                }
            });
            dialog.open();
        },

        _getDialog : function () {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("org.ubb.books.fragment.BookRecord", this);
                this.getView().addDependent(this._oDialog);
                const oModel = new sap.ui.model.json.JSONModel();
                this._oDialog.setModel(oModel);
            }
            return this._oDialog;
        },

        _getEditDialog : function () {
            if (!this._oDialog1) {
                this._oDialog1 = sap.ui.xmlfragment("org.ubb.books.fragment.EditBook", this);
                this.getView().addDependent(this._oDialog1);
                const oModel1 = new sap.ui.model.json.JSONModel();
                this._oDialog1.setModel(oModel1);
            }
            return this._oDialog1;
        },

        onOpenDialog : function () {
            this._getDialog().open();
        },

        onEdit : function (oEvent) {
            path = oEvent.getSource().getBindingContext().getPath();
            const book = oEvent.getSource().getBindingContext().getObject();
            this._getEditDialog().getModel().setData(book);
            this._getEditDialog().open();

        },

        cancel: function () {
            this._getDialog().close();
        },

        cancelEdit: function () {
            this._getEditDialog().close();
        },

        addBook: function (oEvent) {
            const oDataModel = this.getView().getModel();
            const oModel = oEvent.getSource().getModel();
            const data = oModel.getData();
            data.TotalNrBook = parseInt(data.TotalNrBook);
            data.NrAvailableBook = parseInt(data.NrAvailableBook);
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            const addSuccess = oBundle.getText("addSuccess");
            const addError = oBundle.getText("addError");
            oDataModel.create("/Books", data, {
                    success: function (data) {
                        sap.m.MessageToast.show(addSuccess);
                    },
                    error: function (e) {
                        sap.m.MessageToast.show(addError);
                    },
                }
            );
            this._getDialog().close();
        },

        saveBook: function (oEvent) {
            const oDataModel = this.getView().getModel();
            const oModel = oEvent.getSource().getModel();
            const data = oModel.getData();
            data.TotalNrBook = parseInt(data.TotalNrBook);
            data.NrAvailableBook = parseInt(data.NrAvailableBook);
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            const updateSuccess = oBundle.getText("updateSuccess");
            const updateError = oBundle.getText("updateError");
            oDataModel.update(path, data, {
                    success: function (data) {
                        sap.m.MessageToast.show(updateSuccess);
                    },
                    error: function (e) {
                        sap.m.MessageToast.show(updateError);
                    },
                }
            );
            this._getEditDialog().close();
        }
    });
});
