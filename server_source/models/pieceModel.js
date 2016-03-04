var Schema = require('mongoose').Schema
var model = require('mongoose').model
var prom = require('bluebird')
var render = require('./piece_render/renderController')
var path = require('path')
var Type = require('./typeModel')

var PreviewSchema = require('./otherModels').PreviewSchema



var Piece = Schema({
	params: [{type:Number}],
	type: { type: Schema.Types.ObjectId, ref: 'Type'},
	views: {type: Number, default: 0},
	likes: {type: Number, default: 0},
	created: {type: Date},
	picked: {type: Boolean, default: false},
	preview: PeviewSchema,
	prints: PeviewSchema,
});


Piece.methods.public = function(){
	return {
		id: this._id,
		likes: this.likes,
		views: this.views,
		params: this.params,
		type_name: this.type.name,
		type_id: this.type.id,
		created_at: this.created,
		picked: this.picked,
		preview: this.preview
	}
}
// var gm = require('gm');



Piece.statics.add = function(body){
	return Type.findOne({_id:body.type_id}).then(function(found){
		if(found == null) return p.resolve(null)

		var piece = new Piece({
			created: Date.now(),
			params: body.params,
			type: found
		});

		return prom.map(['small','medium','large'],function(size){
			piece.preview[size] = '/data/pieces/preview/'+piece.id+'?scale='+size
			return render.renderPiece(piece,size)
		}).then(function(){
			return piece.save()
		})
		
	})
}








module.exports = model('Piece', Piece);