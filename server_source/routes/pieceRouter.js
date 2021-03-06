const LIMIT = 20;

var express = require('express');
var router = express.Router();
var pack = require('../../package');
var Piece = require('../models').Piece;
var path = require('path')




function addCheck(req,res,next){
	next()
}

function viewCheck(req,res,next){
	next()
}

function likeCheck(req,res,next){
	next()
}






function getPiece(req,res,next,id){
	if( ! id ) res.sendStatus(500);
	Piece.findOne( {'_id' : id }).populate('type').exec(function(err,piece){
		if(piece == null) return res.sendStatus(404)
		if(err){
			console.log(err)
			return res.sendStatus(500);
		} 
		req.piece = piece;
		next();
	})
}




var bodyParser = require('body-parser')
var jsonParser = bodyParser.json({
	limit:'20kb',
})






router
.get('/',function(req,res,next){
	var skip = Number(req.query.skip);
	var filter = req.query.filter;
	var sort_q = {};
	var q = {};

	if(skip == null) skip = 0;



	if(req.query.type != null){
		q.type = req.query.type
	}
	
	switch(filter){
		case 'liked':
			sort_q = {likes: -1}
			q = {likes: {$gt:0}}
			break;
		case 'views':
			sort_q = {views: -1}
			q = {views: {$gt:0}}
			break;
		case 'saved':
			if(!req.session.user.local.length) return res.sendStatus(404)
			q = { _id: { $in: req.session.user.local} }
		case 'recent':
		default:
			sort_q = {_id: -1}
			break;
	}
	
	
	Piece.find(q)
	.skip(skip)
	.sort(sort_q)
	.limit(LIMIT)
	.lean()
	.populate('type')
	.then(function(pieces){
		res.json(pieces.map(function(piece){
			var pub_json = Piece.public(piece)
			if(filter == 'saved') pub_json.local = true
			return pub_json
		}))
	}).catch(next)
})

.post('/add',jsonParser,function(req,res,next){
	if(req.session.user.add_count >= 20) return res.sendStatus(403);
	Piece.add(req.body).then(function(piece){
		if(typeof piece == "string") return res.send(piece).status(500)
		if(piece == null || piece.errors) return res.sendStatus(500)
		req.session.user.local.push(piece.id);
		req.session.user.add_count += 1;
		req.session.save()
		res.json(Piece.public(piece))
	}).catch(next)
})

.put('/view/:piece_id',viewCheck,function(req,res,next){

	req.piece.update({views:req.piece.views+1}).then(function(){
		res.sendStatus(200)
	}).catch(next)
})

.put('/like/:piece_id',likeCheck,function(req,res,next){
	if(req.piece.likes >= 999) return res.sendStatus(403);
	if(req.session.user.liked_pieces.indexOf(req.piece._id.toString()) != -1) return res.sendStatus(403);
	req.piece.update({likes:req.piece.likes+1}).then(function(){
		req.session.user.liked_pieces.push(req.piece._id)
		res.setHeader('Set-Cookie',"liked_pieces="+JSON.stringify(req.session.user.liked_pieces))
		res.sendStatus(200)
	}).catch(next)
})

.put('/pick/:piece_id',likeCheck,function(req,res,next){
	if( !req.session.user.admin ) return res.setState(403)
	req.piece.picked = true
	req.piece.save().then(function(){
		res.sendStatus(200)
	}).catch(next)
})

.get('/preview/:piece_id',function(req,res,next){
	var size = 'small';
	if(req.query.size == 'medium') var size = 'medium'
	res.sendFile(path.join(__dirname,'..','..',pack.data_path,'pieces',size,req.piece.id+'.png'));
})

.get('/:piece_id',function(req,res){
	res.json(req.piece.public());
})

.param('piece_id',getPiece)


module.exports = router;
