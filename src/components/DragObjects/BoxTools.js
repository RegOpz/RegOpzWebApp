import React, {Component} from 'react';
require('./DragObjects.css');

class BoxTools extends Component{
  constructor(props){
		super(props);
	}
	render(){
		const {toolItems} = this.props;
		return (
			<div className="box-tools">

				<ul className="nav navbar-left panel_toolbox">
					{
						(()=>{
							let content = [];
							toolItems.map((tool,index)=>{

								content.push(
									<li>
                    <a className="close-link"
											title={tool.title}
											onClick={()=>{tool.handleClick()}}><small><i className={tool.className}></i></small></a>
                  </li>
								)
							})
							return content;
						})()
					}
				</ul>

			</div>
		)
	}

}

export default BoxTools;
