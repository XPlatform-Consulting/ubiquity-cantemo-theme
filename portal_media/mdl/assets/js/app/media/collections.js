! function(Item) { 
	Item.RelatedCollection = Backbone.Collection.extend({ 
		model: cntmo.vs.VSItem || Backbone.Models, 
		parse: function(data) { return data.objects }, 
        initialize: function(models, options) { options || (options = {}), this.url = options.url } 
    }), 
	Item.ACLCollection = Backbone.Collection.extend({ 
		model: cntmo.prtl.Item.ACL, 
		initialize: function(models, options) { options || (options = {}), this.url = options.url } 
	}), 
	Item.ShapeCollection = Backbone.Collection.extend({ 
		model: cntmo.prtl.Item.Shape, 
		initialize: function(models, options) { options || (options = {}), this.url = options.url } 
	}), 
	Item.JobCollection = Backbone.Collection.extend({ 
		model: cntmo.prtl.Item.JobItem, 
		initialize: function(models, options) { options || (options = {}), this.url = options.url } 
	}) 
}(cntmo.prtl.Item = cntmo.prtl.Item || {}, jQuery);
