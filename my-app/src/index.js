/**
 * Created by anatoly on 28.01.18.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl,
    Checkbox, Button, ButtonGroup} from 'react-bootstrap';
//http://theory.phphtml.net

class TodoForm extends React.Component{
    /**
     * onChange form element handle, experiment
     * @params key {string} chenged key
     * */
    handleChange(key){
      return(
        (event) =>
            this.props.onChange(this.props.index, key, event)
      )
    }

    renderFormTextInput(key){
      return(
        <FormControl
          type='text'
          value={this.props.list[key]}
          onChange={
              this.handleChange(key)
          }
        />
      );
    }

    renderFormTextarea(key){
      return(
        <FormControl
          componentClass="textarea"
          value={this.props.list[key]}
          onChange={
              this.handleChange(key)
          }
        />
      );
    }

    renderFormSelect(key){
      return(
        <FormControl
          componentClass="select"
          value={this.props.list[key]}
          onChange={
              this.handleChange(key)
          }
        >
          <option value="0">low</option>
          <option value="1">mid</option>
          <option value="2">high</option>
        </FormControl>
      );
    }

    renderFormDateInput(key){
      return(
        <FormControl
          type="date"
          value={this.props.list[key]}
          onChange={
              this.handleChange(key)
          }
        />
      );
    }

    renderFormCheckBox(key){
      return (
        <Checkbox
          checked={this.props.list[key]}
          onChange={
                this.handleChange(key)
            }
        />
      )
    }
  
    /**
     * Form element render, why not, experimental
     * @params element {object: {key:, name:, type:}}
     * */
    renderFormElement(element){
        const types = {
            input: this.renderFormTextInput,
            textarea: this.renderFormTextarea,
            select: this.renderFormSelect,
            date: this.renderFormDateInput,
            checkbox: this.renderFormCheckBox
        };

        if (!types[element.type]) return null;

        /// experimental
        const handle = types[element.type].bind(this, element.key)();

        /// experimental
        const label = [element].map((el) => {
            return (<ControlLabel key={el.name}>{el.name}</ControlLabel>)
          }
        )

        return (
            <FormGroup>
              {label}
              {handle}
            </FormGroup>
        )
    }

    render(){
        if (!this.props.list) return null;

        return(
            <form>
                {this.renderFormElement({key: 'name', name: 'Название', type: 'input'})}
                {this.renderFormElement({key: 'descr', name: 'Описание', type: 'textarea'})}
                {this.renderFormElement({key: 'priority', name: 'Приоритет', type: 'select'})}
                {this.renderFormElement({key: 'deadline', name: 'Срок выполнения', type: 'date'})}
                {this.renderFormElement({key: 'enddate', name: 'Дата завершения', type: 'date'})}
                {this.renderFormElement({key: 'done', name: 'Выполнено', type: 'checkbox'})}
            </form>
         )
    }
}

class Filters extends React.Component{

  render(){
    return (
      <ButtonGroup>
        <Button onClick={() => this.props.filter('all')}>All</Button>
        <Button onClick={() => this.props.filter('low')}>Low</Button>
        <Button onClick={() => this.props.filter('mid')}>Mid</Button>
        <Button onClick={() => this.props.filter('high')}>High</Button>
      </ButtonGroup>
    )
  }
}

class Todos extends React.Component {
    constructor(){
      super();

      window.onunload = window.onclose = function onExit() {
        localStorage.setItem('todo-list', JSON.stringify(this.state.list));
      }.bind(this);

      let list = localStorage.getItem('todo-list');

      /// try to get data from localStorage, else set empty template
      try {
        list = JSON.parse(list);
        if (!typeof list === 'array') throw 'bad'
      } catch (e){
        list = [{
          name: "",
          descr: "",
          priority: 0,
          deadline: "",
          enddate: "",
          done: 0
        }];
      }

      this.state = {
            list: list,
            currentIndex: 0,
            hideForm: 0,
            filter: 'all'
        }
    }
  
    /**
     * Simple function for priority name
     * @params priority {int} code of priority
     * @returns {String}
     * */
    getPriorityName(priority) {
      const p = {
        0: 'low',
        1: 'mid',
        2: 'high'
      };

      return p[priority];
    }

    /**
     * Todo-list render
     * */
    renderList(){
      return (
        this.state.list.map((item, index) => {
        const active = index === this.state.currentIndex ?
            'active' : '';
        const done = item.done ? 'done' : '';
        const className = `${active} ${done}`;
        const priorityName = this.getPriorityName(item.priority);

        //console.log(item, item.priority);

        if (!this.filter(index)) return false;
          return (
            <li
                key={index}
                className={className}
                onClick={this.setCurrentIndex.bind(this, index)}
            >
              <dl className={this.outOfTime(index)}>
                <dt>Название</dt>
                <dd>{item.name}</dd>
                <dt>Описание</dt>
                <dd>{item.descr}</dd>
                <dt>Приоритет</dt>
                <dd>{priorityName}</dd>
                <dt>Срок выполнения</dt>
                <dd>{item.deadline}</dd>
                <dt>Дата завершения</dt>
                <dd>{item.enddate}</dd>
                <dt>Удалить</dt>
                <dd>
                  <Button bsStyle="danger"
                          onClick={(event) => this.handleRemove(index, event)}
                  >
                    Remove current
                  </Button>
                </dd>
              </dl>
            </li>);
        })
      )
    }

    render() {
        const list = this.renderList();
        const index = this.state.currentIndex;
        return (
          <Grid >
            <Row>
              <Col xs={4} md={4} className="sticky">
                <Button bsStyle="success"
                    onClick={this.handleAdd.bind(this)}
                >Add
                </Button>
                <Button bsStyle="success"
                        onClick={() =>
                        this.setState({hideForm: !this.state.hideForm})}
                >Toggle form visibility
                </Button>
                <Filters filter={this.setFilter.bind(this)} />
                {
                  !this.state.hideForm ?
                    <TodoForm
                        list={this.state.list[index]}
                        index={index}
                        onChange={this.handleChange.bind(this)}
                    /> : null
                }
              </Col>
              <Col xs={6} md={6} className="Todos-info">
                <ol>{list}</ol>
              </Col>
            </Row>
          </Grid>
        );
    }

    /**
     * Marks out of time items
     * @params index {int} current item index
     * @returns className {string}
     * */
    outOfTime(index){
      let current = this.state.list[index];
      let className = 'dl-horizontal';

      if (current.deadline < current.enddate) {
        className +=' text-danger'
      }

      return (className);
    }

    setCurrentIndex(index){
        this.setState({currentIndex: index});
    }

    /**
     * Remove item handle
     * @params index {int} current item index
     * @params event {event}
     * */
    handleRemove(index, event) {
      /// stops click!
      event.stopPropagation();

      if (!confirm("Are u sure?")) return false;

      this.state.list.splice(index, 1);
      let newIndex = --this.state.currentIndex;
      newIndex = newIndex < 0 ? 0 : newIndex;

      this.setState({
        list: this.state.list,
        currentIndex: newIndex
      })

    }

    /**
     * Add new item in todo-list
     * */
    handleAdd(){
        const index = this.state.list.length ? ++this.state.currentIndex : 0;
        this.setState({
            list: this.state.list.concat(
              [{
                  name: "",
                  descr: "",
                  priority: 0,
                  deadline: "",
                  enddate: "",
                  done: 0
              }]),
            currentIndex: index
          }
        )
    }

    /**
     * Form elements change handle
     * @params index {int} current item index
     * @params field {string} key of item
     * @params event {event}
     * */
    handleChange(index, field, event){
        let value;

        /// for checkbox
        if (field === 'done') {
          value = event.target.checked ? 1 : 0
        } else {
          value = event.target.value
        }

        const item = this.state.list[index];
        item[field] = value;
        this.state.list[index] = item;

        this.setState({
            list: this.state.list
        });
    }

    /**
    * sets filter type all/low/mid/high
     * @params type {string} filter name
    * */
    setFilter(type){
      this.setState({filter: type});
    }

    /**
     * filter on list, check current item
     * @params index {int} current index
     * @returns result, true/false
     * */
    filter(index){
      const current = this.state.list[index];
      const filter = this.state.filter;
      let result;

      const filters = {
        all: () => true,
        low: () => current.priority == 0,
        mid: () => current.priority == 1,
        high: () => current.priority == 2
      };

      result = filters[filter]();
      //console.log(result);

      return (result);
    }
}

// ========================================
ReactDOM.render(
    <Todos />,
    document.getElementById('root')
);
