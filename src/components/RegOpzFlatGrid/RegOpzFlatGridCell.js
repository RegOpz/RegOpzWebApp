import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ModalAlert from '../ModalAlert/ModalAlert';
export default class RegOpzFlatGridCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.data[props.identifier],
        }
        this.inputElem = null;
        this.editingValue = null;
    }
    componentWillReceiveProps(newProps){
        /*this.setState ({
            value: newProps.data[newProps.identifier],
        })*/
        this.state = {
            value: newProps.data[newProps.identifier],
        }
    }
    render() {
        return (
            <div className="flat_grid_row_cell">
                <span
                  onDoubleClick={this.handleCellDoubleClick.bind(this)}
                  onClick={this.handleCellSingleClick.bind(this)}
                  onKeyPress={this.handleCellKeyPress.bind(this)}
                >
                    {(this.state.value != null && this.state.value.toString().length !=0 ) ? this.state.value.toString().substring(0,30) : "---"}
                </span>
                  <ModalAlert ref="modalAlert" showDiscard={true} onClickOkay={this.handleAlertOkayClick.bind(this)} onClickDiscard={this.handleAlertDiscardClick.bind(this)} />
            </div>
        )
    }
    handleCellDoubleClick(event) {
      console.log("Inside handleCellDoubleClick of RegOpzFlatGridCell.....",this.props.readOnly);
      if(this.props.data['dml_allowed']=='Y'&& !this.props.readOnly){
        this.editingValue = this.state.value;
        console.log("The editing data (data,identifier,id)", this.props.data[this.props.identifier], this.props.identifier,this.props.data['id']);
        this.inputElem = document.createElement("input");
        this.inputElem.value = this.state.value;
        this.inputElem.addEventListener('change', this.handleChange.bind(this), false);
        this.inputElem.addEventListener('blur', this.handleBlur.bind(this), false);
        this.inputElem.addEventListener('onkeydown', this.handleKeyPress.bind(this),false);
        event.target.appendChild(this.inputElem);
        this.inputElem.focus();
        $(".flat_grid_row_container").removeClass('flat_grid_row_container_active');
        $(event.target).parent().parent(".flat_grid_row_container").addClass('flat_grid_row_container_active');
      } else{
        this.refs.modalAlert.isDiscardToBeShown=false;
        this.refs.modalAlert.open("This data is readonly. No editing permitted.");
      }
    }
    handleCellSingleClick(event){
      console.log("In single click...")
      $(".flat_grid_row_cell > span").removeClass('selectedCell');
      $(event.target).addClass('selectedCell');
    }
    handleCellKeyPress(event){

    }
    handleChange(event){
        this.setState({
            value:event.target.value
        });

    }
    handleBlur(event){
        $(".flat_grid_row_container").removeClass('flat_grid_row_container_active');
        if(this.editingValue != event.target.value){
          this.refs.modalAlert.open("Do you want to change \"" +  this.editingValue + "\" to \"" + event.target.value + "\" ?");
        }
        $(".flat_grid_row_cell > span").removeClass('selectedCell');
        $(event.target).remove();
    }
    handleAlertOkayClick(){
      if(this.props.data['dml_allowed']=='Y' && !this.props.readOnly){
        this.props.data[this.props.identifier] = this.state.value;
        //console.log("RegOpzFlatGridCell handleAlertOkayClick",this.props.data.user);
        this.props.onUpdateRow(this.props.data);
        this.setState({
            value:this.editingValue
        });
      }
    }
    handleAlertDiscardClick(){
      this.setState({
          value:this.editingValue
      });
    }
    handleKeyPress(event){
      alert(1);
    }

}
