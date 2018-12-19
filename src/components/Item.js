import React, { Component } from 'react';

class Item extends Component {
    constructor(props) {
        super(props);        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();      
        this.props.updateItem(this.props.item.id, {title: this.props.item.input});
    }

    handleOpen() {
        this.props.updateItem(this.props.item.id, {open: !this.props.item.open})
    }

    handleChange(e) {        
        // keep changes in sync, check if our input matches checked condition
        let conditions = this.props.item.conditions
            .map(condition => {
                let value = Object.keys(condition)[0];
                if (condition.checked){
                    return this.updateCondition(value, e.target.value)
                } else {
                    return condition
                }
            });
        // update item props
        this.props.updateItem(this.props.item.id, {
            input: e.target.value,
            conditions
        })
    }    

    toggleCheckbox(e) {
        // update condition, if box is not checked then condition is valid (nothing to check for)
        let updatedCondition = e.target.checked 
                        ? this.updateCondition(e.target.value, this.props.item.input)
                        : {[e.target.value]: true, checked: false}
        let conditions = this.props.item.conditions.map(condition => {
            if (condition.hasOwnProperty(e.target.value)) {
                return updatedCondition;
            } else return condition;
        })

        this.props.updateItem(this.props.item.id, {conditions});        
    }

    updateCondition(condition, input) {
        switch(condition) {
            case "contains_number" : {
                return {[condition]: /[0-9]/.test(input), checked: true}
            }
            case "2_chars_min" : {
                return {[condition]: input.length >= 2, checked: true}
            }
            case "not_empty" : {
                return {[condition]: input !== "", checked: true}
            }
            default: return
        }
    }

    ischecked(conditionStr) {
        return this.props.item.conditions.find(condition => Object.keys(condition)[0] === conditionStr).checked
    }

    render() {        
        const {title, id, open, input, conditions } = this.props.item;
        const {removeItem} = this.props;
        return (
            <div className="item">
                <button onClick={this.handleOpen}>&gt;</button>
                <span>{title || 'Edit Item Title'}</span>                
                <button onClick={() => removeItem(id)}>&times;</button>                
                    { open &&
                        <form onSubmit={this.handleSubmit}>
                            <sup>{input.length}</sup>
                            <input type="text" value={input} onChange={this.handleChange} />
                            <input type="submit" value="Edit" />
                            <fieldset>
                                <legend>Conditions:</legend>
                                {
                                    conditions.map((condition, index) => {
                                        let value = Object.keys(condition)[0];
                                        return (
                                            <div key={'cond'+index} className="conditions">
                                                <input type="checkbox" id={'cond'+index} name="condition" value={value} onChange={this.toggleCheckbox} checked={condition.checked}/>
                                                <label htmlFor={'cond'+index}>{value.replace(/_/g, ' ')}</label>
                                            </div>
                                        )
                                    }) 
                                }
                            </fieldset>
                        </form>
                    }
            </div>
        )
    }
}

export default Item;