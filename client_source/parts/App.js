var intui = require('intui');


var react_redux = require('react-redux');
var connect = react_redux.connect;

var I = require('intui').Slide;
var SlideMixin = require('intui').Mixin;
var Button = require('intui').Button;
var G = require('intui').Grid;
var GItem = require('intui').GridItem;
var ITip = require('intui').ToolTip;
var GMixin = require('intui').GridMixin;
var UserWidget = require('./UserWidget');
var s = require('../state');
var Store = require('./Store');
var IToggle = require('intui').ToggleField;


function getC(c){
	return (c < 0 ? 0 : Math.round(c))
}






















var Sidebar = React.createClass({
	mixins: [SlideMixin],
	// getDefaultProps: function(){
	// 	return {
	// 		width: null
	// 	}
	// },
	getInitialState: function(){
		return {
			active_button: -1,
			fullscreen: false
		}
	},
	showInfo: function(){
		s.toggleInfo()
	},
	componentWillReceiveProps: function(props){
		if(props.show_browser == false){
			this.setState({active_button:-1})
		}else{
			var tab = props.browser_tab;
			this.setState({
				active_button: tab == 'recent' ? 0 : tab == 'liked' ? 1 : tab == 'picked' ? 2 : tab == 'saved' ? 3 : -1
			})	
		}
	},


	toggleFullscreen: function(){
		var elem = document.body

		if(this.state.fullscreen == true){
			console.log('exit fullscreen')
			if (document.exitFullscreen) {
			  document.exitFullscreen();
			} else if (document.msExitFullscreen) {
			 document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
			  document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
			  document.webkitExitFullscreen();
			}
		}else{
			if (elem.requestFullscreen) {
			  elem.requestFullscreen();
			} else if (elem.msRequestFullscreen) {
			  elem.msRequestFullscreen();
			} else if (elem.mozRequestFullScreen) {
			  elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
			  elem.webkitRequestFullscreen();
			}			
		}
		

		this.setState({
			fullscreen: !this.state.fullscreen
		})
	},

	componentDidMount: function(){

		// window.sidebar = this.refs['sidebar']
		// window.sidebar_top = this.refs['sidebar_top']
	},
	render: function(){
		return (
			<I {...this.props} id = 'sidebar' ref="sidebar" outerClassName="gui-sidebar" >
				<I vertical beta={100} offset={-this.props.width-this.props.width/2} ref = 'sidebar_top'>
					<Button inverse c1 = '#00B7FF' c2 ='#003850' down 	onClick={s.toggleBrowserTab.bind(null,'saved')}  height={this.props.width} icon= 'icon-database' active = {this.state.active_button == 3} index_offset={4} bClassName={'gui-button-layer'} />
					<Button inverse c1 = '#00FF76' c2 ='#003E1C' up 	onClick={s.toggleBrowserTab.bind(null,'recent')} height={this.props.width} icon= 'icon-leaf-1' active = {this.state.active_button == 0} index_offset={4} bClassName={'gui-button-layer'} />
					<Button inverse c1 = '#FF0157' c2 ='#39000C' down 	onClick={s.toggleBrowserTab.bind(null,'liked')}  height={this.props.width} icon= 'icon-heart' active = {this.state.active_button == 1} index_offset={4} bClassName={'gui-button-layer'} />
					<Button inverse c1 = '#FFCB00' c2 ='#3A2E00' up 	onClick={s.toggleBrowserTab.bind(null,'picked')} height={this.props.width} icon= 'icon-isight' active = {this.state.active_button == 2} index_offset={4} bClassName={'gui-button-layer'} />
					<I height={this.props.width} />
					<Button down onMouseEnter={function(){console.log("test")}} ease={Bounce.easeOut} inverse c1 = '#D6D6D6' c2 ='#111111' onClick={s.toggleTypesList} height={this.props.width} icon= 'icon-th-thumb' active = {this.props.show_types} index_offset={4} bClassName={'gui-button-layer'} />
					<Button inverse c1 = '#D6D6D6' c2 ='#111111' up onClick={s.toggleSettings.bind(null)} height={this.props.width} icon= 'icon-cog' active = {this.props.show_settings} index_offset={4} bClassName={'gui-button-layer'} />
				</I>
	
				<Button inverse c1 = '#D6D6D6' c2 ='#111111' up 	onClick={this.toggleFullscreen} height={this.props.width/2} icon= 'icon-angle-up' icon_alt= 'icon-angle-down' active = {this.state.fullscreen} index_offset={4} bClassName={'gui-button-layer'} />
				<Button  inverse c1 = '#D6D6D6' c2 ='#111111' down 	onClick={this.showInfo} height={this.props.width} icon= 'icon-info-circled' active = {this.props.show_info} index_offset={4} bClassName={'gui-button-layer'} />
			
			</I>
		)
	}
})



































var TypeItem = connect(function(state){
	return {
		current_type: state.current_type
	}
})(React.createClass({
	mixins: [GMixin],

	getInitialState: function(){
		return {
			c_offset: 170
			,toggle_modal: false
		}
	},

	toggleHover: function(){
		this.setState({
			c_offset: this.state.c_offset == 170 ? 160 : 170,
			toggle_modal: this.props.item.locked ? true : this.state.toggle_modal
		})
	},

	showType: function(){
		s.showType(this.props.item)
	},

	render: function(){
		var active = this.props.current_type != null && this.props.current_type.id == this.props.item.id;
		var item = this.props.item;
		var symbol_style = {
			color: 'rgb('+item.color[0]+','+item.color[1]+','+item.color[2]+')',
			background: 'rgb('+getC(item.color[0]-this.state.c_offset+(active ? 50 : 0))+','+getC(item.color[1]-this.state.c_offset+(active ? 50 : 0))+','+getC(item.color[2]-this.state.c_offset+(active ? 50 : 0))+')',
			boxShadow: 'inset rgba('+item.color[0]+','+item.color[1]+','+item.color[2]+',0.231373) 0px 0px 20px, rgba(0,0,0,0.3) 0px 0px 2px',
		}

		var global_style = {
			color: 'rgb('+item.color[0]+','+item.color[1]+','+item.color[2]+')',
		}

		var bg = {
			background: 'url('+( (this.props.w == 1 && this.props.h == 1)  ? item.preview.small : item.preview.medium)+') center',
		}



		return (
			<GItem {...this.props} onClick = {this.showType} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} >
				<div className = 'type-item' style = {global_style}>
					<div ref='bg' className = ' type-item-bg' style={bg} />
					<span className='overlay-item type-item-symbol' style={symbol_style} >{item.symbol}</span>
					<span className="overlay-item type-item-name" >{item.name}</span>
					<div className = 'overlay-item type-item-count' >
						<span style = {global_style}>
							<span className="icon icon-spread"/>
							<span className="type-item-count-pieces">{item.piece_count}</span>
							<span className="icon icon-sliders"/>
							<span className="type-item-count-params">{item.params.length}</span>
						</span>
					</div>
				</div>
			</GItem>
		)
	}
}))



var TypeList = React.createClass({
	mixins: [SlideMixin],
	getInitialState: function(){
		return {
			
		}
	},

	componentDidMount: function(){
		
	},

	shouldComponentUpdate: function(props,state){
		if(Object.keys(this.props.type_items).length != Object.keys(props.type_items).length){
			this.makeList(props.type_items)
		}
		return true
	},

	makeList: function(list){
		this.items = [];
		for(var i in list){
			this.items.push(<TypeItem current_type = {this.props.current_type} item = {list[i]} key = {'type_item_'+i}  w = {1} h = {1} />)
		}
	},

	items: [],
	render: function(){
		return (
			<I {...this.props} scroll vertical outerClassName='type_list' >
				<G fill_up={true} fixed={true} list_id = "piece_types" w= {1} h = {3} >
					{this.items}
				</G>
			</I>
		)
	}
})


















var Browser = require('./Browser')


var Settings = React.createClass({
	mixins: [SlideMixin],

	toggleTips: function(){
		s.toggleTipDisplay(!this.props.show_tips)
	},
	render: function(){
		var size = 30;

		return(
			<I vertical beta = {this.props.beta} innerClassName = {'gui-settings'}>
				<I height = {50} outerClassName = 'gui-settings-option'>
					<IToggle onClick = { this.toggleTips } active = {this.props.show_tips} beta = {20} size = {size} color='#FFF9F9'  />
					<I beta = {80} innerClassName = 'gui-settings-option-slide'>
						<span>display tips</span>
					</I>
				</I>
			</I>
		)
	}
})

















var App = React.createClass({

	getInitialState: function(){
		return {
			hide_widget: true,
		}
	},


	showView: function(ee,e){
		console.log("SHOW VIEW")
		s.showView();
		ee.stopPropagation();
		// if(this.props.show_types && !this.props.show_browser) s.toggleTypesList();
	},

	componentDidUpdate: function(props){

		

		if(this.props.view_paused != props.view_paused){
			s.toggleView(this.props.view_paused)
		}

		if(this.refs.piece_canvas){
			this.refs.piece_canvas.width = this.refs.piece_canvas.parentElement.clientWidth;
			this.refs.piece_canvas.height = this.refs.piece_canvas.parentElement.clientHeight;
		}

		if(this.props.current_type != props.current_type){
			s.initCurrentType()
		}

	},


	render: function(){

		

		return (
			<I ease={Power4.easeOut} slide vertical beta={100} ref="root" />

		)
	}
})

// ( !this.props.show_types && !this.props.show_store && !this.props.show_browser ) ? Bounce.easeOut : Power4.easeOut
module.exports = App;
