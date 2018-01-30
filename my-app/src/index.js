/**
 * Created by anatoly on 28.01.18.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//http://theory.phphtml.net

class TodoForm extends React.Component{
   /*constructor(props){
        super(props);
        this.state = this.props.list;
    }*/
    handleChange(name){
        return(
            (event) =>
                this.props.onChange(this.props.index, name, event)
        )
    }

    renderFormTextInput(name){
        return(
            <input
                type ='text'
                value={this.props.list[name]}
                onChange={
                    this.handleChange(name)
                }
            />
        );
    }

    renderFormTextarea(name){
        return(
            <textarea
                value={this.props.list[name]}
                onChange={
                    this.handleChange(name)
                }
            ></textarea>
        );
    }

    renderFormSelect(name){
        return(
            <select
                value={this.props.list[name]}
                onChange={
                    this.handleChange(name)
                }
            >
                <option value="0">low</option>
                <option value="1">mid</option>
                <option value="2">high</option>
            </select>
        );
    }

    renderFormDateInput(name){
        return(
            <input
                type="date"
                value={this.props.list[name]}
                onChange={
                    this.handleChange(name)
                }
            />
        );
    }

    render(){
        return(
            <div>
                {this.renderFormTextInput('name')}
                {this.renderFormTextarea('descr')}
                {this.renderFormSelect('priority')}
                {this.renderFormDateInput('deadline')}
                {this.renderFormDateInput('enddate')}

            </div>
        )
    }
}


class Game extends React.Component {
    constructor(){
        super();
        this.state = {
            list: [
                {
                    name: 'hello',
                    descr: 'description',
                    priority: 1,
                    deadline:'2018-01-19',
                    enddate: new Date()
                }

            ],
            currentIndex: 0
        }
    }



    render() {
        const list = this.state.list.map((item, index) => {
            return (<li
                key={index}
                onClick={this.setCurrentIndex.bind(this, index)}
            >
                {item.name}
            </li>);
        });

        const index = this.state.currentIndex;
        return (
            <div className="todo">
                <div className="todo-board">
                    <button type="button"
                        onClick={this.handleAdd.bind(this)}
                    >Add</button>
                    <TodoForm
                        list={this.state.list[index]}
                        index={index}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                <div className="game-info">
                    <ol>{list}</ol>
                </div>
            </div>
        );
    }

    setCurrentIndex(index){
        this.setState({currentIndex: index})
    }

    handleAdd(){
        this.setState(
            {
                list: this.state.list.concat(
                    [{
                        name: "",
                        descr: "",
                        priority: 0,
                        deadline: new Date(),
                        enddate: new Date()
                    }]),
                currentIndex: ++this.state.currentIndex
            }
        )
    }

    handleChange(index, field, event){
        const item = this.state.list[index];
        item[field] = event.target.value;
        this.state.list[index] = item;

        this.setState({
            list: this.state.list
        });
    }
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
