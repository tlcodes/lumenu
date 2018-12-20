import React, { Component } from 'react';
import Item from './Item';
import Heading from './Heading';
import Modal from './Modal';

class MenuComposer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [                
                {title: 'home', input: 'home', valid: true, open: false, id: 'one0', conditions:[{"contains_number": true, checked: false}, {"2_chars_min": true, checked: false}, {"not_empty": true, checked: false}]},
                {title: 'about', input: 'about', valid: true, open: false, id: 'two1', conditions:[{"contains_number": true, checked: false}, {"2_chars_min": true, checked: false}, {"not_empty": true, checked: false}]},
                {title: 'contact', input: 'contact', valid: true, open: false, id: 'three2', conditions:[{"contains_number": true, checked: false}, {"2_chars_min": true, checked: false}, {"not_empty": true, checked: false}]}
            ],
            history: [],
            modal: false
        }
        this.removeItem = this.removeItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.handleOpenAll = this.handleOpenAll.bind(this);
        this.cancelAction = this.cancelAction.bind(this);
        this.showModal = this.showModal.bind(this);        
    }

    addItem() {
        let id = Math.random();
        let newItems = [...this.state.items, {title: '', input:'', valid: true, open: false, id: id, conditions:[{"contains_number": true, checked: false}, {"2_chars_min": true, checked: false}, {"not_empty": true, checked: false}]}];
        this.setState({ 
            history: [...this.state.history, this.state.items],
            items: newItems 
        })
    }

    removeItem(id) {
        const newItems = this.state.items.filter(item => {
            return item.id !== id;
        });
        this.setState({ 
            history: [...this.state.history, this.state.items],
            items: newItems 
        })
    }

    updateItem(id, updatedProps) {
        // save old state for every change except input
        if (!updatedProps.hasOwnProperty('input')) {
            this.setState({
                history: [...this.state.history, this.state.items]
            })
        }
        let updatedItem = this.state.items.find(item => item.id === id);        
        updatedItem = {...updatedItem, ...updatedProps};        
        // set valid to true if all conditions are true
        updatedItem.valid = !updatedItem.conditions.map(condition => Object.values(condition)[0]).includes(false);

        let newItems = this.state.items.map(item => {
            if (item.id === id) {
                return {
                    ...updatedItem
                }
            } else {
                return item;
            }            
        });        
        this.setState({ items: newItems });        
    }


    handleOpenAll() {
        // open or close all based number of items already open
        let count = this.state.items.reduce((acc, next) => {
            return next.open ? acc+=1 : acc;
        }, 0)
        // if less than half the items are open, open them all
        let openAll = count < this.state.items.length / 2;
        let newItems = this.state.items.map(item => {
            return {
                ...item,
                open: openAll
            }
        })
        this.setState({items: newItems});
    }

    cancelAction(){
        if (this.state.history.length) {
            let prevItems = this.state.history[this.state.history.length-1];
            let newHistory = this.state.history;
            newHistory.splice(newHistory.length-1, 1);
            this.setState({ items: prevItems, history: newHistory });
            } else {
                return;
            }
    }

    showModal() {
        this.setState({
            modal: !this.state.modal
        })
    }

    render() {
        const itemList = this.state.items ? this.state.items.map((item, index) => {
            return (
                <Item 
                    key={item.title+index}
                    item={item}
                    removeItem={this.removeItem}
                    updateItem={this.updateItem}
                    draggable="true"
                    onDragStart={this.dragStart}
                />
            )
        }) : null;
        return (
            <div className="composer">
                <Heading titleList={this.state.items.map(item => {
                        return {title: item.title, input: item.input, valid:item.valid}
                    })}
                    showModal={this.showModal}
                />
                <div>
                    <button onClick={this.handleOpenAll}>&gt;</button>
                        <span className="composer-title">Menu Composer</span>
                    <button onClick={this.addItem}>+</button>
                </div>
                {itemList}
                <button className="cancel" onClick={this.cancelAction}>cancel</button>
                {
                    this.state.modal &&
                    <Modal items={this.state.items} showModal={this.showModal}/>
                }
            </div>
        )
    }
}

export default MenuComposer;