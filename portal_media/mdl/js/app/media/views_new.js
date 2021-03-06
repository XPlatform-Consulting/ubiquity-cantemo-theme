! function(Item, $, undefined) {
    "use strict";
    Item.NewView = Backbone.View.extend({
        events: {
            "click #submit": "submit",
            "submit form": "submitFormHandler"
        },
        initialize: function(options) {
            _.bindAll(this, "render", "changeform", "beforeSubmit"), this.options = options || {}, this.form = undefined, this.submit_template = options.submit_template || "", this.advanced_template = options.advanced_template || "", this.change_form_id = options.change_form_id || undefined, this.collectionselect_field_id = options.collectionselect_field_id || undefined, this.setupForm(gblDefaultMetadataGroup)
        },
        setupForm: function(formname) {
            return this.form = cntmo.app.page.forms[_.uniqueId("form")] = new cntmo.prtl.Metadata.Form({
                metadataGroup: formname,
                el: this.options.formel
            }), this.form
        },
        render: function() {
            if (this.form) {
                if (this.submit_template !== undefined && (this.$submit_template = $(_.template(this.submit_template)()), this.form.$fieldset.after(this.$submit_template)), "" !== this.advance_template && (this.$advanced = $(_.template(this.advanced_template)()), this.form.$fieldset.after(this.$advanced), this.$advanced.collapse({
                        closed: !0
                    })), this.change_form_id !== undefined) {
                    var changeevent = "change " + this.change_form_id;
                    this.events[changeevent] = "changeform", this.delegateEvents()
                }
                this.collectionselect_field_id !== undefined && $(this.collectionselect_field_id).AjaxCollectionSelect()
            }
            return this
        },
        changeform: function(event) {
            var value = $(event.currentTarget).val();
            this.form.changeFormMetadataGroup(value)
        },
        beforeSubmit: function(arr) {
            return arr = this.form.serialize(!0), !0
        },
        submit: function(event) {
            var self = this;
            return event.preventDefault(), this.form.valid() ? (this.form.$el.ajaxForm({
                type: "post",
                contentType: "application/json; charset=utf-8",
                accepts: {
                    json: "application/json",
                    text: "text/plain"
                },
                dataType: "json",
                beforeSubmit: self.beforeSubmit,
                error: function() {
                    $.growl(gettext("There was an error sending this form"), "error")
                }
            }), this.form.$el.submit()) : $.growl(gettext("There was an error with the form, please check all the fields"), "error"), !0
        },
        submitFormHandler: function() {
            return !0
        }
    })
}(cntmo.prtl.Item = cntmo.prtl.Item || {}, jQuery);
